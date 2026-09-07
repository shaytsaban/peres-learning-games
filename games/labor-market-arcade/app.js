/* =====================================================================
   שוק העבודה ועוני — ARCADE EDITION  ·  app.js  (game engine)
   ===================================================================== */
(function () {
  "use strict";

  var DATA = window.GAME_DATA;
  var MAX_LIVES = (DATA.meta && DATA.meta.lives) || 3;
  var XP_PER_LEVEL = 500;
  var BASE_POINTS = 100;
  var SAVE_KEY = "labor_poverty_arcade_v1";

  /* -------------------- state -------------------- */
  var state = {
    player: { name: "", email: "" },
    unlocked: 0,            // highest unlocked world index
    completed: [],          // world indices completed
    score: 0,
    lives: MAX_LIVES,
    streak: 0,
    bestStreak: 0,
    totalCorrect: 0,
    totalAnswered: 0,
    // per-stage session
    curWorld: 0,
    curQ: 0,
    worldCorrect: 0,
    worldScore: 0,
    worldBestStreak: 0,
    answered: false,
    pendingGameOver: false,
    muted: false
  };

  /* -------------------- tiny DOM helpers -------------------- */
  function $(id) { return document.getElementById(id); }
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function show(node) { node.hidden = false; }
  function hide(node) { node.hidden = true; }

  var SCREENS = ["start", "map", "learn", "quiz", "stage-clear", "gameover", "win"];
  function showScreen(name) {
    SCREENS.forEach(function (s) {
      var node = $("screen-" + s);
      if (node) node.classList.toggle("is-active", s === name);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* =====================================================================
     SOUND  (Web Audio, synthesized — no files)
     ===================================================================== */
  var actx = null;
  function audio() {
    if (state.muted) return null;
    if (!actx) {
      try { actx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch (e) { return null; }
    }
    if (actx.state === "suspended") actx.resume();
    return actx;
  }
  function tone(freq, start, dur, type, vol) {
    var ac = audio(); if (!ac) return;
    var t0 = ac.currentTime + start;
    var osc = ac.createOscillator(), g = ac.createGain();
    osc.type = type || "square";
    osc.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol || 0.12, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g); g.connect(ac.destination);
    osc.start(t0); osc.stop(t0 + dur + 0.02);
  }
  var SFX = {
    blip:   function () { tone(420, 0, 0.07, "square", 0.05); },
    correct:function () { [523,659,784,1046].forEach(function (f,i){ tone(f, i*0.07, 0.14, "square", 0.10); }); },
    coin:   function () { tone(988,0,0.06,"square",0.10); tone(1319,0.06,0.16,"square",0.10); },
    wrong:  function () { tone(200,0,0.18,"sawtooth",0.10); tone(150,0.12,0.22,"sawtooth",0.10); },
    level:  function () { [392,523,659,784,1046].forEach(function (f,i){ tone(f,i*0.06,0.16,"triangle",0.10); }); },
    clear:  function () { [523,659,784,1046,784,1046,1318].forEach(function (f,i){ tone(f,i*0.09,0.2,"square",0.09); }); },
    over:   function () { [392,330,262,196].forEach(function (f,i){ tone(f,i*0.16,0.3,"sawtooth",0.10); }); },
    win:    function () { [523,659,784,1046,1318,1046,1318,1568].forEach(function (f,i){ tone(f,i*0.12,0.26,"square",0.10); }); }
  };

  /* =====================================================================
     CONFETTI helpers (guarded)
     ===================================================================== */
  var NEON = ["#00f0ff","#ff2e97","#ffe600","#39ff14","#a06bff","#ff8c1a"];
  function burst(opts) {
    if (typeof window.confetti !== "function") return;
    window.confetti(Object.assign({ colors: NEON, disableForReducedMotion: true }, opts));
  }
  function confettiSmall() { burst({ particleCount: 60, spread: 70, origin: { y: 0.7 }, startVelocity: 35 }); }
  function confettiBig() {
    burst({ particleCount: 120, spread: 100, origin: { y: 0.6 } });
    setTimeout(function(){ burst({ particleCount: 60, angle: 60, spread: 70, origin: { x: 0 } }); }, 150);
    setTimeout(function(){ burst({ particleCount: 60, angle: 120, spread: 70, origin: { x: 1 } }); }, 150);
  }
  function confettiRain() {
    var end = Date.now() + 1600;
    (function frame() {
      burst({ particleCount: 5, angle: 60, spread: 60, origin: { x: 0 } });
      burst({ particleCount: 5, angle: 120, spread: 60, origin: { x: 1 } });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }

  /* =====================================================================
     PERSISTENCE
     ===================================================================== */
  function save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({
        player: state.player, unlocked: state.unlocked, completed: state.completed,
        score: state.score, totalCorrect: state.totalCorrect,
        totalAnswered: state.totalAnswered, bestStreak: state.bestStreak, muted: state.muted
      }));
    } catch (e) {}
  }
  function load() {
    try {
      var raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) { return null; }
  }

  /* =====================================================================
     HUD
     ===================================================================== */
  function level() { return Math.floor(state.score / XP_PER_LEVEL) + 1; }
  function renderHUD() {
    $("hud").hidden = false;
    $("hud-name").textContent = state.player.name || "שחקן";
    $("hud-score").textContent = state.score.toLocaleString("en-US");
    $("hud-level").textContent = level();
    var into = state.score % XP_PER_LEVEL;
    $("xpbar-fill").style.width = (into / XP_PER_LEVEL * 100) + "%";
    $("hud-xp-num").textContent = into + "/" + XP_PER_LEVEL;
    renderLives();
  }
  function renderLives() {
    var s = "";
    for (var i = 0; i < MAX_LIVES; i++) s += (i < state.lives) ? "❤️" : "🖤";
    $("hud-lives").textContent = s;
  }
  function toast(msg) {
    var t = $("streak-toast");
    t.textContent = msg; t.hidden = false;
    requestAnimationFrame(function(){ t.classList.add("show"); });
    clearTimeout(toast._t);
    toast._t = setTimeout(function(){
      t.classList.remove("show");
      setTimeout(function(){ t.hidden = true; }, 250);
    }, 1300);
  }

  /* =====================================================================
     LOGIN
     ===================================================================== */
  function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
  function setFieldError(name, msg) {
    var input = name === "name" ? $("player-name") : $("player-email");
    var field = input.closest(".field");
    var err = document.querySelector('.field-error[data-for="' + name + '"]');
    if (msg) { field.classList.add("invalid"); err.textContent = msg; }
    else { field.classList.remove("invalid"); err.textContent = ""; }
  }
  function handleLogin(e) {
    e.preventDefault();
    var name = $("player-name").value.trim();
    var email = $("player-email").value.trim();
    var ok = true;
    if (name.length < 2) { setFieldError("name", "צריך שם באורך 2 תווים לפחות"); ok = false; }
    else setFieldError("name", "");
    if (!validEmail(email)) { setFieldError("email", "כתובת אימייל לא תקינה"); ok = false; }
    else setFieldError("email", "");
    if (!ok) { SFX.wrong(); return; }

    state.player = { name: name, email: email };
    SFX.coin(); confettiSmall();
    save();
    renderHUD();
    renderMap();
    showScreen("map");
  }

  /* =====================================================================
     MAP / LEVEL SELECT
     ===================================================================== */
  function renderMap() {
    $("map-greeting").innerHTML = "ברוך/ה הבא/ה, <b>" + escapeHtml(state.player.name) + "</b>! בחר/י שלב כדי להתחיל את ההרפתקה.";
    var grid = $("map-grid"); grid.innerHTML = "";
    DATA.worlds.forEach(function (w, i) {
      var done = state.completed.indexOf(i) !== -1;
      var open = i <= state.unlocked;
      var card = el("button", "world-card");
      card.style.setProperty("--wc", w.color);
      if (!open) card.classList.add("locked");
      card.disabled = !open;

      if (w.boss) card.appendChild(el("span", "boss-flag", "BOSS"));

      var top = el("div", "wc-top");
      top.appendChild(el("span", "wc-emoji", w.emoji));
      top.appendChild(el("span", "wc-num", "0" + w.id));
      card.appendChild(top);

      card.appendChild(el("div", "wc-name", w.name));
      card.appendChild(el("div", "wc-tag", w.tag));

      var st = el("div", "wc-state");
      if (done) { st.className = "wc-state done"; st.innerHTML = '<span class="wc-stars">★★★</span> הושלם'; }
      else if (open) { st.className = "wc-state open"; st.innerHTML = "▶ זמין — קדימה!"; }
      else { st.className = "wc-state lock"; st.innerHTML = "🔒 נעול"; }
      card.appendChild(st);

      if (open) card.addEventListener("click", function () { SFX.blip(); enterWorld(i); });
      grid.appendChild(card);
    });
  }

  /* =====================================================================
     LEARN
     ===================================================================== */
  function enterWorld(i) {
    state.curWorld = i;
    state.curQ = 0;
    state.worldCorrect = 0;
    state.worldScore = 0;
    state.worldBestStreak = 0;
    state.streak = 0;
    renderLearn();
    showScreen("learn");
  }

  function renderLearn() {
    var w = DATA.worlds[state.curWorld];
    var badge = $("learn-badge");
    badge.textContent = "📖 " + w.tag;
    badge.style.background = w.color;
    badge.style.boxShadow = "0 0 14px " + w.color;
    $("learn-title").innerHTML = w.emoji + " " + w.name;

    var body = $("learn-body"); body.innerHTML = "";
    w.learn.forEach(function (b) { body.appendChild(renderBlock(b, w)); });

    $("btn-learn-start").style.setProperty("--c", w.color);
  }

  function renderBlock(b, w) {
    switch (b.type) {
      case "lead":  return el("p", "lblk-lead", b.html);
      case "text":  return el("p", "lblk-text", b.html);
      case "note":  return el("p", "lblk-text", b.html);
      case "def": {
        var d = el("div", "lblk-def");
        d.appendChild(el("div", "def-term", b.term));
        d.appendChild(el("div", "def-body", b.html));
        return d;
      }
      case "callout": {
        var c = el("div", "callout " + (b.variant || "info"));
        c.appendChild(el("span", "co-icon", b.icon || "💡"));
        var inner = el("div", "co-inner");
        inner.appendChild(el("div", "co-title", b.title || ""));
        inner.appendChild(el("div", "co-body", b.html));
        c.appendChild(inner);
        return c;
      }
      case "statRow": {
        var sr = el("div", "statrow");
        b.items.forEach(function (it) {
          var s = el("div", "stat");
          s.style.setProperty("--sc", it.accent || w.color);
          s.appendChild(el("div", "s-big", it.big));
          s.appendChild(el("div", "s-small", it.small));
          sr.appendChild(s);
        });
        return sr;
      }
      case "formula": {
        var f = el("div", "formula");
        f.appendChild(el("div", "f-he", b.he));
        f.appendChild(el("div", "f-expr", b.expr));
        if (b.note) f.appendChild(el("div", "f-note", b.note));
        return f;
      }
      case "example": {
        var ex = el("div", "example");
        ex.appendChild(el("div", "ex-title", b.title));
        if (b.intro) ex.appendChild(el("div", "ex-intro", b.intro));
        var steps = el("div", "ex-steps");
        b.steps.forEach(function (st) {
          var row = el("div", "ex-step" + (st.good ? " good" : ""));
          row.appendChild(el("span", "es-label", st.label));
          row.appendChild(el("span", "es-expr", st.expr));
          steps.appendChild(row);
        });
        ex.appendChild(steps);
        return ex;
      }
      case "table": {
        var t = el("table", "ltable");
        var thead = el("thead"), htr = el("tr");
        b.headers.forEach(function (h) { htr.appendChild(el("th", null, h)); });
        thead.appendChild(htr); t.appendChild(thead);
        var tb = el("tbody");
        b.rows.forEach(function (r, ri) {
          var tr = el("tr");
          if (b.highlight && b.highlight.indexOf(ri) !== -1) tr.className = "hot";
          r.forEach(function (cell) { tr.appendChild(el("td", null, cell)); });
          tb.appendChild(tr);
        });
        t.appendChild(tb);
        return t;
      }
      default: return el("p", "lblk-text", b.html || "");
    }
  }

  /* =====================================================================
     QUIZ
     ===================================================================== */
  var KEYS = ["א", "ב", "ג", "ד", "ה"];

  function startQuiz() { state.curQ = 0; renderQuestion(); showScreen("quiz"); }

  function renderQuestion() {
    var w = DATA.worlds[state.curWorld];
    var q = w.questions[state.curQ];
    state.answered = false;

    var sb = $("quiz-stage");
    sb.textContent = w.emoji + " " + w.name;
    sb.style.background = w.color;
    sb.style.boxShadow = "0 0 14px " + w.color;

    $("quiz-counter").textContent = "שאלה " + (state.curQ + 1) + " / " + w.questions.length;
    $("quiz-bar").style.width = (state.curQ / w.questions.length * 100) + "%";

    var ctx = $("quiz-context");
    if (q.context) { ctx.innerHTML = "📌 " + q.context; show(ctx); } else { hide(ctx); }

    $("quiz-prompt").innerHTML = q.prompt;

    var opts = $("quiz-options"); opts.innerHTML = "";
    q.options.forEach(function (text, idx) {
      var btn = el("button", "opt");
      btn.type = "button";
      btn.appendChild(el("span", "opt-key", KEYS[idx]));
      btn.appendChild(el("span", "opt-text", text));
      btn.addEventListener("click", function () { onAnswer(idx, btn); });
      opts.appendChild(btn);
    });

    hide($("quiz-feedback"));
  }

  function onAnswer(idx, btn) {
    if (state.answered) return;
    state.answered = true;
    SFX.blip();

    var w = DATA.worlds[state.curWorld];
    var q = w.questions[state.curQ];
    var correct = idx === q.correct;
    var buttons = $("quiz-options").querySelectorAll(".opt");

    buttons.forEach(function (b, i) {
      b.disabled = true;
      if (i === q.correct) {
        b.classList.add("correct");
        b.appendChild(el("span", "opt-mark", "✓"));
      } else if (i === idx) {
        b.classList.add("wrong");
        b.appendChild(el("span", "opt-mark", "✕"));
      } else {
        b.classList.add("dim");
      }
    });

    state.totalAnswered++;

    if (correct) {
      state.streak++;
      state.bestStreak = Math.max(state.bestStreak, state.streak);
      state.worldBestStreak = Math.max(state.worldBestStreak, state.streak);
      var bonus = Math.min(state.streak - 1, 5) * 20;
      var gained = BASE_POINTS + bonus;
      var before = level();
      state.score += gained;
      state.worldScore += gained;
      state.totalCorrect++;
      state.worldCorrect++;

      SFX.correct();
      confettiSmall();
      if (state.streak >= 2) toast("🔥 רצף " + state.streak + "!  +" + gained + " (בונוס " + bonus + ")");
      if (level() > before) { setTimeout(SFX.level, 200); setTimeout(function(){ toast("⬆️ עלית לרמה " + level() + "!"); }, 600); }
    } else {
      state.streak = 0;
      state.lives--;
      btn.classList.add("shake");
      SFX.wrong();
      if (state.lives <= 0) state.pendingGameOver = true;
    }

    renderHUD();
    showFeedback(q, correct);
  }

  function showFeedback(q, correct) {
    var fb = $("quiz-feedback");
    var banner = $("feedback-banner");
    banner.className = "feedback-banner " + (correct ? "ok" : "no");
    banner.textContent = correct ? "★ נכון! כל הכבוד ★" : "✕ לא נורא — ככה לומדים!";

    $("feedback-title").textContent = (q.explain && q.explain.title) || (correct ? "הסבר" : "ההסבר המלא");
    $("feedback-html").innerHTML = (q.explain && q.explain.html) || "";

    var po = $("feedback-peroption"); po.innerHTML = "";
    if (q.explain && q.explain.perOption) {
      q.explain.perOption.forEach(function (txt, i) {
        var cls = "po" + (i === q.correct ? " ok" : "");
        var row = el("div", cls);
        row.innerHTML = '<b class="po-key">' + KEYS[i] + '.</b> ' + txt;
        po.appendChild(row);
      });
    }

    var lastQ = state.curQ >= DATA.worlds[state.curWorld].questions.length - 1;
    $("btn-next-label").textContent = state.pendingGameOver ? "אוֹי…" : (lastQ ? "סיום השלב" : "השאלה הבאה");

    show(fb);
    fb.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function onNext() {
    SFX.blip();
    if (state.pendingGameOver) { state.pendingGameOver = false; showGameOver(); return; }
    advance();
  }
  function advance() {
    state.curQ++;
    var w = DATA.worlds[state.curWorld];
    if (state.curQ >= w.questions.length) stageClear();
    else { renderQuestion(); }
  }

  /* =====================================================================
     GAME OVER (soft — never lose progress)
     ===================================================================== */
  function showGameOver() { SFX.over(); showScreen("gameover"); }
  function continueGame() {
    state.lives = MAX_LIVES;
    renderLives();
    SFX.coin();
    advance();
    showScreen("quiz");
  }

  /* =====================================================================
     STAGE CLEAR
     ===================================================================== */
  function stageClear() {
    var w = DATA.worlds[state.curWorld];
    if (state.completed.indexOf(state.curWorld) === -1) state.completed.push(state.curWorld);
    if (state.curWorld + 1 < DATA.worlds.length) state.unlocked = Math.max(state.unlocked, state.curWorld + 1);
    save();

    $("clear-stage-name").textContent = w.emoji + " " + w.name + " — הושלם!";
    $("clear-correct").textContent = state.worldCorrect + "/" + w.questions.length;
    $("clear-xp").textContent = "+" + state.worldScore;
    $("clear-streak").textContent = state.worldBestStreak;

    var allDone = state.completed.length >= DATA.worlds.length;
    $("btn-clear-cont").textContent = allDone ? "🏁 לסיום הגדול" : "המשך למפה";
    $("btn-clear-cont").onclick = function () {
      SFX.blip();
      if (allDone) showWin();
      else { renderMap(); showScreen("map"); }
    };

    SFX.clear();
    confettiBig();
    showScreen("stage-clear");
  }

  /* =====================================================================
     VICTORY + CERTIFICATE
     ===================================================================== */
  function rankFor(acc) {
    if (acc >= 100) return "אלוף/ת הכלכלה 👑";
    if (acc >= 85)  return "מאסטר שוק העבודה 🏆";
    if (acc >= 70)  return "כלכלן/ית מבטיח/ה 🌟";
    if (acc >= 50)  return "סטודנט/ית חרוץ/ה 📚";
    return "מתחיל/ה נחוש/ה 💪";
  }
  function showWin() {
    var acc = state.totalAnswered ? Math.round(state.totalCorrect / state.totalAnswered * 100) : 0;
    var rank = rankFor(acc);
    $("win-greeting").innerHTML = "כל הכבוד, <b>" + escapeHtml(state.player.name) + "</b>! סיימת את כל ששת השלבים.";
    $("win-score").textContent = state.score.toLocaleString("en-US");
    $("win-acc").textContent = acc + "%";
    $("win-rank").textContent = rank;

    drawCertificate(state.player.name, state.score, acc, rank);
    SFX.win();
    confettiRain();
    showScreen("win");
  }

  function drawCertificate(name, score, acc, rank) {
    var cv = $("cert-canvas"), ctx = cv.getContext("2d");
    var W = cv.width, H = cv.height;
    ctx.clearRect(0, 0, W, H);

    // bg
    var g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, "#140a24"); g.addColorStop(0.5, "#0a0612"); g.addColorStop(1, "#1a0a2e");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

    // subtle grid
    ctx.strokeStyle = "rgba(160,107,255,0.10)"; ctx.lineWidth = 1;
    for (var x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (var y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    // neon frame
    function frame(pad, color, lw) {
      ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.shadowColor = color; ctx.shadowBlur = 18;
      ctx.strokeRect(pad, pad, W - pad * 2, H - pad * 2);
    }
    frame(24, "#00f0ff", 4);
    frame(34, "#ff2e97", 2);
    ctx.shadowBlur = 0;

    ctx.direction = "rtl";
    ctx.textAlign = "center";

    // header
    ctx.fillStyle = "#ffe600"; ctx.shadowColor = "#ffe600"; ctx.shadowBlur = 14;
    ctx.font = "700 30px 'Secular One', sans-serif";
    ctx.fillText("★ תעודת סיום ★", W / 2, 100);

    ctx.shadowBlur = 16; ctx.shadowColor = "#00f0ff"; ctx.fillStyle = "#00f0ff";
    ctx.font = "700 54px 'Secular One', sans-serif";
    ctx.fillText("שוק העבודה ועוני", W / 2, 168);
    ctx.shadowBlur = 0;

    ctx.fillStyle = "#9b8fc7"; ctx.font = "600 20px Heebo, sans-serif";
    ctx.fillText("ARCADE · שיעור 12", W / 2, 205);

    ctx.fillStyle = "#eafcff"; ctx.font = "500 24px Heebo, sans-serif";
    ctx.fillText("מוענקת בגאווה ל", W / 2, 280);

    ctx.fillStyle = "#ff2e97"; ctx.shadowColor = "#ff2e97"; ctx.shadowBlur = 14;
    ctx.font = "700 50px 'Secular One', sans-serif";
    ctx.fillText(name, W / 2, 340);
    ctx.shadowBlur = 0;

    ctx.fillStyle = "#cfc6ee"; ctx.font = "400 20px Heebo, sans-serif";
    ctx.fillText("על השלמת כל ששת השלבים של מסע שוק העבודה והעוני", W / 2, 392);

    // stat boxes
    var boxes = [
      { label: "ניקוד סופי", value: score.toLocaleString("en-US"), color: "#ffe600" },
      { label: "דיוק", value: acc + "%", color: "#39ff14" },
      { label: "דרגה", value: rank, color: "#a06bff" }
    ];
    var bw = 250, gap = 24, total = bw * 3 + gap * 2, startX = (W - total) / 2, by = 440, bh = 110;
    boxes.forEach(function (b, i) {
      var bx = startX + i * (bw + gap);
      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.strokeStyle = b.color; ctx.lineWidth = 2; ctx.shadowColor = b.color; ctx.shadowBlur = 10;
      roundRect(ctx, bx, by, bw, bh, 14); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
      ctx.fillStyle = b.color; ctx.font = "700 30px 'Secular One', sans-serif";
      ctx.fillText(b.value, bx + bw / 2, by + 52);
      ctx.fillStyle = "#cfc6ee"; ctx.font = "500 17px Heebo, sans-serif";
      ctx.fillText(b.label, bx + bw / 2, by + 86);
    });

    // footer
    var d = new Date();
    var dateStr = d.getDate() + "." + (d.getMonth() + 1) + "." + d.getFullYear();
    ctx.fillStyle = "#9b8fc7"; ctx.font = "500 18px Heebo, sans-serif";
    ctx.fillText("הונפק בתאריך " + dateStr + "  ·  🎉 ניצחון! 🎉", W / 2, 620);
    ctx.fillStyle = "#5b4f80"; ctx.font = "400 15px Heebo, sans-serif";
    ctx.fillText("Labor Market & Poverty — Arcade Edition", W / 2, 655);
  }
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  function downloadCert() {
    var cv = $("cert-canvas");
    try {
      var link = document.createElement("a");
      link.download = "תעודה-" + (state.player.name || "student") + ".png";
      link.href = cv.toDataURL("image/png");
      document.body.appendChild(link); link.click(); document.body.removeChild(link);
      SFX.coin();
    } catch (e) { alert("לא ניתן להוריד את התעודה בדפדפן זה."); }
  }

  /* =====================================================================
     RESET / REPLAY
     ===================================================================== */
  function resetProgress() {
    if (!confirm("לאפס את כל ההתקדמות ולהתחיל מחדש?")) return;
    var p = state.player, muted = state.muted;
    Object.assign(state, {
      unlocked: 0, completed: [], score: 0, lives: MAX_LIVES, streak: 0, bestStreak: 0,
      totalCorrect: 0, totalAnswered: 0, curWorld: 0, curQ: 0,
      worldCorrect: 0, worldScore: 0, worldBestStreak: 0, pendingGameOver: false
    });
    state.player = p; state.muted = muted;
    save(); renderHUD(); renderMap(); showScreen("map");
  }
  function playAgain() {
    state.unlocked = 0; state.completed = []; state.score = 0; state.lives = MAX_LIVES;
    state.streak = 0; state.bestStreak = 0; state.totalCorrect = 0; state.totalAnswered = 0;
    state.pendingGameOver = false;
    save(); renderHUD(); renderMap(); showScreen("map"); SFX.coin();
  }

  /* -------------------- utils -------------------- */
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* =====================================================================
     SOUND TOGGLE
     ===================================================================== */
  function toggleSound() {
    state.muted = !state.muted;
    var b = $("sound-toggle");
    b.textContent = state.muted ? "🔇" : "🔊";
    b.classList.toggle("muted", state.muted);
    save();
    if (!state.muted) SFX.blip();
  }

  /* =====================================================================
     INIT
     ===================================================================== */
  function init() {
    // restore saved profile (returning player)
    var saved = load();
    if (saved) {
      state.muted = !!saved.muted;
      if (saved.player && saved.player.name) {
        $("player-name").value = saved.player.name;
        $("player-email").value = saved.player.email || "";
      }
      // pre-fill progress so a returning player keeps stars after they log in again
      state._restore = saved;
    }
    var sb = $("sound-toggle");
    sb.textContent = state.muted ? "🔇" : "🔊";
    sb.classList.toggle("muted", state.muted);

    $("login-form").addEventListener("submit", function (e) {
      // merge restored progress for the same email
      handleLogin(e);
      if (state._restore && state._restore.player &&
          state._restore.player.email === state.player.email) {
        var r = state._restore;
        state.unlocked = r.unlocked || 0;
        state.completed = r.completed || [];
        state.score = r.score || 0;
        state.totalCorrect = r.totalCorrect || 0;
        state.totalAnswered = r.totalAnswered || 0;
        state.bestStreak = r.bestStreak || 0;
        renderHUD(); renderMap();
      }
      state._restore = null;
    });

    $("btn-learn-start").addEventListener("click", function () { SFX.blip(); startQuiz(); });
    $("btn-next").addEventListener("click", onNext);
    $("btn-continue").addEventListener("click", continueGame);
    $("btn-download-cert").addEventListener("click", downloadCert);
    $("btn-play-again").addEventListener("click", playAgain);
    $("btn-reset").addEventListener("click", resetProgress);
    $("sound-toggle").addEventListener("click", toggleSound);

    // live-clear field errors
    $("player-name").addEventListener("input", function () { setFieldError("name", ""); });
    $("player-email").addEventListener("input", function () { setFieldError("email", ""); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
