// Game State Management
const gameState = {
    playerName: "",
    avatar: "",
    avatarEmoji: "🧙‍♂️",
    avatarDisplayName: "",
    score: 0,
    currentStage: "intro",
    stageUnlocked: {
        stage1: true,
        stage2: false,
        stage3: false,
        stage4: false,
        quiz: false,
        cert: false
    },
    audioEnabled: true,
    audioCtx: null,
    
    // Stage 2 simulator states
    simChallengesActive: false,
    simChallengeIndex: 0,
    simChallengesCompleted: false,

    // Stage 3 decision
    committeeVoted: false,

    // Stage 4 tool deployed
    toolDeployed: false,

    // Quiz state
    quizCurrentIndex: 0,
    quizCorrectAnswers: 0
};

// Avatars mapping
const avatars = {
    saver: { emoji: "📉", name: "שרגא החוסך" },
    entrepreneur: { emoji: "🚀", name: "נטע היזמת" },
    inflationist: { emoji: "🔥", name: "דינוזאור האינפלציה" },
    governor: { emoji: "🎓", name: "הנגיד/ה הבא/ה" }
};

// Web Audio API Sound Synthesizer (No external assets needed!)
function initAudio() {
    if (!gameState.audioCtx) {
        gameState.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playSound(freqs, durations, type = "sine", volume = 0.1) {
    if (!gameState.audioEnabled) return;
    initAudio();
    if (!gameState.audioCtx) return;

    let time = gameState.audioCtx.currentTime;
    
    freqs.forEach((freq, index) => {
        let osc = gameState.audioCtx.createOscillator();
        let gain = gameState.audioCtx.createGain();
        
        osc.type = type;
        osc.frequency.setValueAtTime(freq, time);
        
        gain.gain.setValueAtTime(volume, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + durations[index]);
        
        osc.connect(gain);
        gain.connect(gameState.audioCtx.destination);
        
        osc.start(time);
        osc.stop(time + durations[index]);
        
        time += durations[index] * 0.7; // overlapping notes
    });
}

function playTapSound() {
    playSound([600], [0.15], "triangle", 0.15);
}

function playSuccessSound() {
    playSound([523.25, 659.25, 783.99, 1046.50], [0.1, 0.1, 0.1, 0.3], "sine", 0.2);
}

function playErrorSound() {
    playSound([220, 180], [0.2, 0.3], "sawtooth", 0.25);
}

function playVictoryFanfare() {
    playSound([261.63, 329.63, 392.00, 523.25, 392.00, 523.25, 659.25], [0.15, 0.15, 0.15, 0.2, 0.15, 0.15, 0.6], "sine", 0.25);
}

// Celebration Fireworks and Confetti (HTML5 Canvas Engine)
const canvas = document.getElementById("celebration-canvas");
const ctx = canvas.getContext("2d");
let animationFrameId = null;
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

class Particle {
    constructor(x, y, color, isFirework = false) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.isFirework = isFirework;
        this.radius = isFirework ? Math.random() * 3 + 2 : Math.random() * 5 + 4;
        
        const angle = Math.random() * Math.PI * 2;
        const speed = isFirework ? Math.random() * 8 + 4 : Math.random() * 4 + 2;
        
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - (isFirework ? 2 : 0);
        this.gravity = 0.12;
        this.friction = 0.98;
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.01;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
    }
}

function spawnFirework(x, y) {
    const colors = ["#ff0055", "#00ffcc", "#ffcc00", "#ff00ff", "#00ff00", "#00ffff", "#ffffff"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    for (let i = 0; i < 60; i++) {
        particles.push(new Particle(x, y, color, true));
    }
}

function spawnConfettiShower() {
    const colors = ["#6366f1", "#ec4899", "#10b981", "#f59e0b", "#06b6d4", "#fbbf24"];
    for (let i = 0; i < 150; i++) {
        particles.push(new Particle(Math.random() * canvas.width, -20, colors[Math.floor(Math.random() * colors.length)], false));
    }
}

function loopCelebration() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Randomly spawn fireworks
    if (Math.random() < 0.03) {
        spawnFirework(Math.random() * canvas.width, Math.random() * (canvas.height * 0.6));
    }

    particles = particles.filter(p => p.alpha > 0);
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    if (particles.length > 0) {
        animationFrameId = requestAnimationFrame(loopCelebration);
    } else {
        canvas.style.display = "none";
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
}

function startCelebration() {
    canvas.style.display = "block";
    particles = [];
    spawnConfettiShower();
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            spawnFirework(Math.random() * canvas.width, Math.random() * (canvas.height * 0.5) + 100);
        }, i * 400);
    }
    if (!animationFrameId) {
        loopCelebration();
    }
}

// Sound Toggle Handling
document.getElementById("audio-toggle").addEventListener("click", () => {
    gameState.audioEnabled = !gameState.audioEnabled;
    const btn = document.getElementById("audio-toggle");
    if (gameState.audioEnabled) {
        btn.textContent = "🔊";
        playTapSound();
    } else {
        btn.textContent = "🔇";
    }
});

// Avatar selection UI logic
const avatarCards = document.querySelectorAll(".avatar-card");
avatarCards.forEach(card => {
    card.addEventListener("click", () => {
        avatarCards.forEach(c => c.classList.remove("selected"));
        card.classList.add("selected");
        gameState.avatar = card.getAttribute("data-avatar");
        gameState.avatarEmoji = card.querySelector(".avatar-emoji").textContent;
        gameState.avatarDisplayName = card.querySelector("h4").textContent;
        playTapSound();
    });
});

// START GAME Trigger
document.getElementById("btn-start-game").addEventListener("click", () => {
    const nameInput = document.getElementById("student-name").value.trim();
    if (!nameInput) {
        alert("נא להזין שם מלא לקבלת התעודה ההיתולית בסוף!");
        playErrorSound();
        document.getElementById("student-name").focus();
        return;
    }
    if (!gameState.avatar) {
        alert("נא לבחור דמות (אווטאר) מוניטרית!");
        playErrorSound();
        return;
    }

    gameState.playerName = nameInput;
    
    // Show HUD
    document.getElementById("game-hud").style.display = "flex";
    document.getElementById("hud-score").textContent = gameState.score;
    document.getElementById("hud-avatar-emoji").textContent = gameState.avatarEmoji;
    document.getElementById("hud-avatar-name").textContent = gameState.playerName;

    playSuccessSound();
    navigateToScreen("screen-stage1");
});

function navigateToScreen(screenId) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    document.getElementById(screenId).classList.add("active");
    
    // Update Stage HUD
    const hudStage = document.getElementById("hud-stage");
    if (screenId === "screen-stage1") {
        hudStage.textContent = "שלב 1: אקדמיה";
        renderFlowchart(true); // Default to rate hike
    } else if (screenId === "screen-stage2") {
        hudStage.textContent = "שלב 2: סימולטור";
        updateSimulatorMetrics();
    } else if (screenId === "screen-stage3") {
        hudStage.textContent = "שלב 3: ועדה";
    } else if (screenId === "screen-stage4") {
        hudStage.textContent = "שלב 4: כלים מיוחדים";
    } else if (screenId === "screen-pacman") {
        hudStage.textContent = "שלב 4.5: פקמן";
        initPacmanGame();
    } else if (screenId === "screen-quiz") {
        hudStage.textContent = "שלב 5: חידון";
        loadQuizQuestion();
    } else if (screenId === "screen-cert") {
        hudStage.textContent = "תעודת הצטיינות";
        document.getElementById("cert-holder-name").textContent = gameState.playerName;
        document.getElementById("cert-avatar-signature").textContent = `${gameState.avatarDisplayName} ${gameState.avatarEmoji}`;
        playVictoryFanfare();
        startCelebration();
    }
}

// STAGE 1: Tabs logic
const tabBtns = document.querySelectorAll(".tab-btn");
tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        tabBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        
        const targetTab = btn.getAttribute("data-tab");
        document.querySelectorAll(".tab-content").forEach(tc => tc.classList.remove("active"));
        document.getElementById(targetTab).classList.add("active");
        playTapSound();
    });
});

// Flowchart rendering logic
function renderFlowchart(isHike) {
    const container = document.getElementById("flowchart-container");
    container.innerHTML = "";

    const hikeNodes = [
        { title: "בנק ישראל מעלה ריבית 📈", desc: "ריבית בנק ישראל עולה לערך גבוה.", cls: "danger-highlight" },
        { title: "האשראי מתייקר 💸", desc: "הלוואות ומשכנתאות בבנקים הופכות ליקרות.", cls: "" },
        { title: "הציבור חוסך יותר 🏦", desc: "הפיקדונות בבנק מעניקים תשואה גבוהה יותר.", cls: "" },
        { title: "הביקושים יורדים 📉", desc: "הציבור קונה פחות ומשקיע פחות.", cls: "" },
        { title: "האינפלציה נבלמת 🎯", desc: "עליות המחירים נעצרות. יעד 1%-3% מושג.", cls: "highlight" }
    ];

    const cutNodes = [
        { title: "בנק ישראל מפחית ריבית 📉", desc: "ריבית בנק ישראל יורדת לערך נמוך.", cls: "highlight" },
        { title: "האשראי זול 💰", desc: "הלוואות ומשכנתאות זולות וקלות להשגה.", cls: "" },
        { title: "משתלם לבזבז 🛍️", desc: "הפיקדונות בבנק לא מניבים כסף. הציבור קונה.", cls: "" },
        { title: "העסקים צומחים 🚀", desc: "חברות משקיעות, בונות ומגייסות עובדים.", cls: "" },
        { title: "הצמיחה עולה 📈", desc: "התוצר גדל והאבטלה יורדת לשפל.", cls: "highlight" }
    ];

    const nodes = isHike ? hikeNodes : cutNodes;

    nodes.forEach((node, index) => {
        const nodeEl = document.createElement("div");
        nodeEl.className = `flow-node ${node.cls}`;
        nodeEl.innerHTML = `<strong>${node.title}</strong><p style="font-size: 0.75rem; margin-top: 5px;">${node.desc}</p>`;
        container.appendChild(nodeEl);

        if (index < nodes.length - 1) {
            const arrow = document.createElement("div");
            arrow.className = "flowchart-arrow";
            arrow.textContent = "➔";
            container.appendChild(arrow);
        }
    });
}

document.getElementById("btn-flow-up").addEventListener("click", () => {
    document.getElementById("btn-flow-up").classList.add("active");
    document.getElementById("btn-flow-down").classList.remove("active");
    renderFlowchart(true);
    playTapSound();
});

document.getElementById("btn-flow-down").addEventListener("click", () => {
    document.getElementById("btn-flow-down").classList.add("active");
    document.getElementById("btn-flow-up").classList.remove("active");
    renderFlowchart(false);
    playTapSound();
});

document.getElementById("btn-stage1-next").addEventListener("click", () => {
    gameState.score += 50;
    document.getElementById("hud-score").textContent = gameState.score;
    playSuccessSound();
    navigateToScreen("screen-stage2");
});

// STAGE 2: Simulator Formulas and Logic
const rateSlider = document.getElementById("rate-range-slider");
const rateDisplay = document.getElementById("sim-rate-display");

rateSlider.addEventListener("input", (e) => {
    const val = parseFloat(e.target.value).toFixed(2);
    rateDisplay.textContent = `${val}%`;
    updateSimulatorMetrics();
});

function updateSimulatorMetrics() {
    const rate = parseFloat(rateSlider.value);
    
    // Core Simulator Formulas:
    // High interest rates cool inflation, sluggish growth, strengthens Shekel (lower exchange rate)
    // Low interest rates raise inflation, accelerate growth, weakens Shekel (higher exchange rate)
    
    let inflationVal = Math.max(0.1, 7.5 - rate * 1.25); 
    let growthVal = Math.max(-1.5, rate > 6 ? 6 - rate * 0.9 : 4.5 - rate * 0.3);
    let forexVal = Math.max(3.10, 4.30 - rate * 0.15);

    // Apply some slight bounds
    inflationVal = parseFloat(inflationVal.toFixed(1));
    growthVal = parseFloat(growthVal.toFixed(1));
    forexVal = parseFloat(forexVal.toFixed(2));

    // Update UI elements
    const infDisplay = document.getElementById("metric-inflation-val");
    const infBar = document.getElementById("metric-inflation-bar");
    infDisplay.textContent = `${inflationVal}%`;
    infBar.style.width = `${Math.min(100, inflationVal * 12)}%`;

    if (inflationVal >= 1 && inflationVal <= 3) {
        infDisplay.style.color = "var(--success)";
        infBar.style.backgroundColor = "var(--success)";
    } else if (inflationVal < 1) {
        infDisplay.style.color = "var(--info)";
        infBar.style.backgroundColor = "var(--info)";
    } else {
        infDisplay.style.color = "var(--danger)";
        infBar.style.backgroundColor = "var(--danger)";
    }

    const growthDisplay = document.getElementById("metric-growth-val");
    const growthBar = document.getElementById("metric-growth-bar");
    const growthDesc = document.getElementById("metric-growth-desc");
    growthDisplay.textContent = `${growthVal}%`;
    growthBar.style.width = `${Math.min(100, (growthVal + 2) * 12)}%`;
    
    if (growthVal > 2.5) {
        growthDisplay.style.color = "var(--success)";
        growthBar.style.backgroundColor = "var(--success)";
        growthDesc.textContent = "המשק צומח בקצב מעולה! שיעור האבטלה נמוך.";
    } else if (growthVal >= 1 && growthVal <= 2.5) {
        growthDisplay.style.color = "var(--warning)";
        growthBar.style.backgroundColor = "var(--warning)";
        growthDesc.textContent = "הצמיחה מתונה. שוק העבודה מראה יציבות.";
    } else {
        growthDisplay.style.color = "var(--danger)";
        growthBar.style.backgroundColor = "var(--danger)";
        growthDesc.textContent = "מיתון ואבטלה מתגברים! העסקים מתקשים לקבל אשראי.";
    }

    const forexDisplay = document.getElementById("metric-forex-val");
    const forexBar = document.getElementById("metric-forex-bar");
    const forexDesc = document.getElementById("metric-forex-desc");
    forexDisplay.textContent = `${forexVal} ₪`;
    // width representation: range from 3.10 to 4.30
    const percentForex = ((forexVal - 3.10) / (4.30 - 3.10)) * 100;
    forexBar.style.width = `${Math.min(100, Math.max(0, percentForex))}%`;

    if (forexVal < 3.40) {
        forexDisplay.style.color = "var(--danger)";
        forexDesc.textContent = "שקל חזק באופן קיצוני! פגיעה חמורה ביצואנים.";
    } else if (forexVal > 3.90) {
        forexDisplay.style.color = "var(--warning)";
        forexDesc.textContent = "השקל נחלש. סל המוצרים המיובא ונופש בחו\"ל מתייקרים.";
    } else {
        forexDisplay.style.color = "var(--info)";
        forexDesc.textContent = "שער השליפין יציב ומשרת את הכלכלה היטב.";
    }

    // Check challenge condition if active
    if (gameState.simChallengesActive && !gameState.simChallengesCompleted) {
        checkChallengeCompletion(rate, inflationVal, growthVal, forexVal);
    }
}

// Challenges Array
const simChallenges = [
    {
        title: "🔥 אתגר 1: האינפלציה הבוערת!",
        desc: "משק יתר של צרכנים חמים הקפיץ את האינפלציה לערך מבהיל. המפלצת משתוללת ומאיימת למחוק את ערך השקלים. <strong>העלו את הריבית מעל 6%</strong> כדי להביא את האינפלציה חזרה ליעד הבריא (1%-3%)!",
        targetMinRate: 6.0,
        targetMaxRate: 10.0,
        hint: "ריבית גבוהה מייקרת קניות ומרסנת את עליות המחירים!"
    },
    {
        title: "🥶 אתגר 2: מיתון ואבטלה!",
        desc: "משבר כלכלי עולמי מכה בישראל. הצמיחה צונחת למינוס והרבה עסקים נסגרים. הציבור שומר את הכסף מתחת לבלטות. <strong>הפחיתו את הריבית אל מתחת ל-2.5%</strong> כדי לעודד את לקיחת ההלוואות, לצמיחה מחודשת של הכלכלה!",
        targetMinRate: 0.0,
        targetMaxRate: 2.5,
        hint: "הורידו את הריבית כדי להוזיל אשראי לעסקים שיוכלו לגייס עובדים!"
    },
    {
        title: "🎯 אתגר 3: נקודת האיזון המוניטרית!",
        desc: "המשק מתייצב אך אתם מחפשים את שביל הזהב. כוונו את הריבית <strong>בדיוק בטווח של 3.5% עד 4.5%</strong> כדי להשיג אינציפלציה יציבה לצד צמיחה בריאה ושער חליפין מאוזן.",
        targetMinRate: 3.5,
        targetMaxRate: 4.5,
        hint: "טווח של 3.5% עד 4.5% ישיג יציבות משק מושלמת כפי שמלמד ד\"ר צבאן!"
    }
];

document.getElementById("btn-trigger-challenges").addEventListener("click", () => {
    gameState.simChallengesActive = true;
    gameState.simChallengeIndex = 0;
    playSuccessSound();
    renderActiveChallenge();
});

function renderActiveChallenge() {
    const challenge = simChallenges[gameState.simChallengeIndex];
    const eventZone = document.getElementById("sim-event-zone");
    
    eventZone.innerHTML = `
        <div class="sim-event-card" style="border-color: var(--primary);">
            <div class="event-details">
                <h4 style="color: var(--primary);">${challenge.title}</h4>
                <p>${challenge.desc}</p>
                <p style="margin-top: 10px; font-size: 0.9rem; color: var(--gold);">💡 רמז: ${challenge.hint}</p>
            </div>
            <div id="challenge-status-badge" style="font-weight: bold; color: var(--warning); white-space: nowrap; border: 1px dashed var(--warning); padding: 8px 12px; border-radius: 8px;">
                ממתין להחלטה... ⏱️
            </div>
        </div>
    `;
    updateSimulatorMetrics();
}

function checkChallengeCompletion(rate, inflation, growth, forex) {
    const challenge = simChallenges[gameState.simChallengeIndex];
    const badge = document.getElementById("challenge-status-badge");
    
    if (rate >= challenge.targetMinRate && rate <= challenge.targetMaxRate) {
        // Success
        badge.innerHTML = "הצלחה! 🎉";
        badge.style.color = "var(--success)";
        badge.style.borderColor = "var(--success)";
        playSuccessSound();

        // Advance or complete
        gameState.simChallengesActive = false;
        setTimeout(() => {
            if (gameState.simChallengeIndex < simChallenges.length - 1) {
                gameState.simChallengeIndex++;
                gameState.simChallengesActive = true;
                gameState.score += 100;
                document.getElementById("hud-score").textContent = gameState.score;
                renderActiveChallenge();
            } else {
                // Completed all challenges
                gameState.simChallengesCompleted = true;
                gameState.score += 200;
                document.getElementById("hud-score").textContent = gameState.score;
                
                // Show completion banner
                document.getElementById("sim-event-zone").innerHTML = `
                    <div class="sim-event-card" style="border-color: var(--success); background: rgba(16, 185, 129, 0.05);">
                        <div class="event-details">
                            <h4 style="color: var(--success);">🏆 אלוף המוניטרי של בנק ישראל!</h4>
                            <p>פתרתם בהצלחה מזהירה את שלושת משברי הכלכלה הראשיים. למדתם כיצד הריבית מאזנת את ערוצי התמסורת בהצלחה!</p>
                        </div>
                    </div>
                `;
                
                // Enable next button
                const nextBtn = document.getElementById("btn-stage2-next");
                nextBtn.removeAttribute("disabled");
                nextBtn.style.opacity = "1";
                nextBtn.style.cursor = "pointer";
                
                startCelebration();
            }
        }, 1800);
    }
}

document.getElementById("btn-stage2-prev").addEventListener("click", () => {
    navigateToScreen("screen-stage1");
});

document.getElementById("btn-stage2-next").addEventListener("click", () => {
    if (gameState.simChallengesCompleted) {
        navigateToScreen("screen-stage3");
    }
});

// STAGE 3: Monetary Committee Debate
document.getElementById("btn-vote-up").addEventListener("click", () => {
    handleCommitteeChoice(true);
});

document.getElementById("btn-vote-down").addEventListener("click", () => {
    handleCommitteeChoice(false);
});

function handleCommitteeChoice(isHike) {
    gameState.committeeVoted = true;
    playSuccessSound();

    const fb = document.getElementById("committee-feedback");
    const fbTitle = document.getElementById("committee-feedback-title");
    const fbText = document.getElementById("committee-feedback-text");

    fb.style.display = "block";
    
    if (isHike) {
        fb.className = "feedback-card correct-feedback";
        fbTitle.textContent = "החלטתם להעלות ריבית! 📈";
        fbText.textContent = "חברי הועדה המוניטרית מקבלים את קולכם המכריע. העלאת הריבית תורמת מיידית לבלימת שיעורי האינפלציה המשתוללים ומגנה על חסכונות הציבור. דינוזאור האינפלציה התכווץ בחזרה! עם זאת, משכנתאות משתנות מתייקרות במקצת ויש לחץ קל על ההייטק. פתרון שקול!";
        gameState.score += 150;
    } else {
        fb.className = "feedback-card correct-feedback";
        fbTitle.textContent = "החלטתם להפחית ריבית! 📉";
        fbText.textContent = "קולכם שובר את השוויון ומפחית את הריבית. המהלך מקל מיידית על בעלי המשכנתאות המשתנות ומאפשר ליצואני ההייטק הישראלים לנשום לרווחה עקב החלשות השקל מול הדולר. יחד עם זאת, יש לעקוב מקרוב שזה לא יגרום לאינפלציה חדשה. החלטה אמיצה וערנית!";
        gameState.score += 150;
    }

    document.getElementById("hud-score").textContent = gameState.score;
    
    // Enable next stage
    const nextBtn = document.getElementById("btn-stage3-next");
    nextBtn.removeAttribute("disabled");
    nextBtn.style.opacity = "1";
    nextBtn.style.cursor = "pointer";
}

document.getElementById("btn-stage3-prev").addEventListener("click", () => {
    navigateToScreen("screen-stage2");
});

document.getElementById("btn-stage3-next").addEventListener("click", () => {
    if (gameState.committeeVoted) {
        navigateToScreen("screen-stage4");
    }
});

// STAGE 4: Unconventional tools
const toolCards = document.querySelectorAll(".tool-card");
toolCards.forEach(card => {
    card.addEventListener("click", () => {
        toolCards.forEach(c => c.classList.remove("active-tool"));
        card.classList.add("active-tool");
        
        const tool = card.getAttribute("data-tool");
        activateEmergencyTool(tool);
    });
});

function activateEmergencyTool(tool) {
    gameState.toolDeployed = true;
    playSuccessSound();

    const fb = document.getElementById("tool-activation-feedback");
    const text = document.getElementById("tool-activation-text");

    fb.style.display = "block";
    
    if (tool === "forex") {
        text.textContent = "הבנק הדפיס שקלים ורכש בהצלחה מיליארדי דולרים בשוק המט\"ח! המהלך מנע ירידה תלולה של שער הדולר מתחת ל-3.40 ₪, סייע להייטקיסטים ואיזן מחדש את הייצוא של מדינת ישראל. עבודה מצוינת!";
        gameState.score += 150;
    } else {
        text.textContent = "הרחבה כמותית (QE) הופעלה! בנק ישראל יצר נזילות ורכש אגרות חוב ממשלתיות ישירות מהבנקים המסחריים. בנקי המדינה הוצפו בכסף נזיל וחילקו הלוואות זולות לעסקים שהיו בסכנת קריסה. פתרתם את משבר הנזילות הגדול!";
        gameState.score += 150;
    }

    document.getElementById("hud-score").textContent = gameState.score;

    // Enable next stage to Quiz
    const nextBtn = document.getElementById("btn-stage4-next");
    nextBtn.removeAttribute("disabled");
    nextBtn.style.opacity = "1";
    nextBtn.style.cursor = "pointer";
    
    startCelebration();
}

document.getElementById("btn-stage4-prev").addEventListener("click", () => {
    navigateToScreen("screen-stage3");
});

document.getElementById("btn-stage4-next").addEventListener("click", () => {
    if (gameState.toolDeployed) {
        navigateToScreen("screen-pacman");
    }
});

// QUIZ SYSTEM: 15 Core Hebrew Questions with hints, answers, and explanations
const quizQuestions = [
    {
        q: "מהי ההגדרה הטובה ביותר למדיניות מוניטרית כפי שהוצגה בחומר?",
        options: [
            "א. מדיניות מוניטרית היא סך ההחלטות שמתקבלות על ידי הממשלה לגבי גובה המיסים וההוצאות התקציביות",
            "ב. מדיניות מוניטרית היא סך ההחלטות של הבנק המרכזי בנוגע לשינויים בריבית, שנועדו להשפיע על פעילות המשק, האינפלציה וקצב הצמיחה",
            "ג. מדיניות מוניטרית היא התערבות של הבנקים המסחריים בשוק ההון במטרה לקדם את רווחיהם",
            "ד. מדיניות מוניטרית היא ההחלטה הקבועה של בנק ישראל להימנע משינויים בריבית, ללא קשר למצב המשק"
        ],
        answer: 1,
        hint: "מוני = Money = כסף. מי קובע את מחיר הכסף ובאיזה מוסד מדובר?",
        explanation: "תשובה ב' היא הנכונה! טענה א' שגויה כי החלטות לגבי מסים ותקציב הן מדיניות פיסקלית (תקציבית). טענה ג' שגויה כי כלים של מדיניות מוניטרית (ופיסקלית) הם רגולטוריים (של הבנק המרכזי והממשלה) ואינם מייצגים פעילות מסחרית של בנקים רגילים."
    },
    {
        q: "מדוע הבנק המרכזי טורח להתערב בשוק על ידי שינוי הריבית, במקום להשאיר את הפעילות הכלכלית לניהול 'טבעי' של השוק החופשי?",
        options: [
            "א. כי הבנק המרכזי מעוניין להתחרות ישירות בבנקים המסחריים על לקוחותיהם",
            "ב. כי לבנק המרכזי יש אחריות לאומית להבטיח יציבות מחירים, למנוע אינפלציה גבוהה מדי ולתמוך בצמיחה מתונה תוך שמירה על תעסוקה",
            "ג. כי הבנק המרכזי מנסה להגדיל את הכנסותיו מריבית על הלוואות",
            "ד. כי הבנק המרכזי מבקש לחזק חברות מסוימות על חשבון אחרות"
        ],
        answer: 1,
        hint: "האם בנק ישראל הוא גוף עסקי שמחפש רווחים או רגולטור שלטוני הדואג ליציבות לאומית?",
        explanation: "תשובה ב' היא הנכונה! הבנק המרכזי הוא גוף רגולטורי (שלטוני). האינטרס לפעולתו אינו מסחרי אלא דאגה ליציבות ולהתפתחות המשק בכללותו. הבנק אינו מגייס לקוחות פרטיים ואינו מנסה למקסם הכנסות."
    },
    {
        q: "במידה והבנק המרכזי מחליט להעלות את הריבית, מהי ההשפעה הצפויה על משקי בית, בהתחשב בהסבר שניתן בשיעור?",
        options: [
            "א. משקי הבית ימצאו כי הלוואות נעשות יקרות יותר, מה שעשוי להפחית רכישת מוצרים יקרים כמו דירות או רכבים ולהקטין את הצריכה הכוללת",
            "ב. משקי הבית יצליחו לקבל הלוואות זולות במיוחד, ובכך יגדילו מיד את הצריכה ואת רמת החיים שלהם",
            "ג. העלאת הריבית לא תשפיע כלל על התנהגות משקי הבית, שכן ריבית בנק ישראל, אשר נקבעת על ידי הבנק המרכזי, אינה קשורה למחירי ההלוואות",
            "ד. משקי הבית יתחילו לייבא מוצרים מחו\"ל במחירים נמוכים יותר בשל הריבית הגבוהה"
        ],
        answer: 0,
        hint: "חשבו על עליית ריבית הפריים (ריבית בנק ישראל + 1.5%) וכיצד היא מייקרת משכנתאות והלוואות לקניית רכבים.",
        explanation: "תשובה א' היא הנכונה! היגד ג' שגוי כי למרות שתנאי הריבית נקבעים דיפרנציאלית לכל לקוח, העוגן ובסיס לכל הריביות הוא ריבית בנק ישראל המהווה ריבית 'חסרת סיכון'. היגד ד' שגוי ברמת משקי בית כי המהלך המרכזי מבוסס על צמצום צריכה והגדלת חיסכון (בגלל תשואה גבוהה יותר על פיקדונות)."
    },
    {
        q: "כיצד תשפיע העלאת הריבית על החלטות ההתרחבות של עסקים, כמו למשל מסעדה המתכננת לפתוח סניף נוסף או לרכוש מכונה ענקית לחימום נקניק?",
        options: [
            "א. ההלוואות העסקיות יהפכו זולות יותר, ולכן עסקים ייפתחו סניפים חדשים במהירות רבה יותר",
            "ב. העלאת הריבית תייקר את עלות ההלוואות, ולכן עסקים עלולים לדחות או לצמצם את תכניות ההתרחבות שלהם",
            "ג. עסקים יושפעו לטובה, מאחר שהריבית הגבוהה תגדיל את תנועת הלקוחות במסעדה",
            "ד. העלאת הריבית לא תשפיע בשום אופן על עסקים, משום שהם מממנים את עצמם אך ורק מהון עצמי"
        ],
        answer: 1,
        hint: "הקשר בין שיעור התשואה הפנימי (IRR) של הפרויקט לעלות ההון העסקית (k) שעלתה בעקבות הריבית.",
        explanation: "תשובה ב' היא הנכונה! חלק גדול מהמימון העסקי מתבסס על חוב הנושא ריבית. בנוסף, גם לעסקים הממומנים מהון עצמי, עליית הריבית מייקרת את מחיר ההון (k) כיוון שלמשקיעים יש אלטרנטיבות חסרות סיכון בריבית גבוהה. פרויקטים רבים שהיו כדאיים (IRR > k) נפסלים מיידית (IRR < k)."
    },
    {
        q: "בנק ישראל החליט להוריד את הריבית בצורה משמעותית. מה תהיה ההשפעה על החסכונות שלכם בבנק?",
        options: [
            "הריבית שהבנק ישלם לנו על הפיקדון תקטן והחיסכון יניב פחות כסף.",
            "הבנק יכפיל לנו את הריבית כפרס על כך שאנחנו לא מבזבזים.",
            "אין שום שינוי בגובה הריביות על הפיקדונות.",
            "הכסף בפיקדון יימחק אוטומטית."
        ],
        answer: 0,
        hint: "כשהריבית במשק יורדת, פחות משתלם להשאיר את הכסף נעול בבנק.",
        explanation: "הפחתת הריבית מובילה לירידה בריביות על הפיקדונות והחסכונות בבנקים, ובכך מעודדת את הציבור לצרוך ולהשקיע במקום לחסוך."
    },
    {
        q: "אם בנק ישראל מעלה את הריבית ל-5% בעוד שהריבית בארה\"ב נשארת 1%, מה יקרה לשער השקל מול הדולר (ערוץ שער החליפין)?",
        options: [
            "משקיעים זרים ימכרו שקלים ויקנו דולרים, מה שיחליש את השקל.",
            "משקיעים זרים ירצו להשקיע בישראל כדי ליהנות מהריבית הגבוהה, יקנו שקלים והשקל יתחזק.",
            "השקל והדולר יתאחדו למטבע אחד רשמי.",
            "שער השליפין לא מושפע בכלל מפערי הריביות בין המדינות."
        ],
        answer: 1,
        hint: "הכסף העולמי זורם למקום שבו הוא מקבל תשואה (ריבית) גבוהה יותר.",
        explanation: "ריבית גבוהה בישראל מושכת משקיעים זרים שרוצים להרוויח ריבית גבוהה. הם רוכשים שקלים לשם כך, מה שמחזק (מייסר) את השקל מול הדולר."
    },
    {
        q: "מי הניזוק העיקרי מכך שהשקל הישראלי הופך להיות חזק מדי (ייסוף משמעותי)?",
        options: [
            "צרכנים ישראלים המזמינים אייפונים ומוצרים מאמזון בחו\"ל.",
            "יצואני ההייטק והתעשייה המקומית המקבלים הכנסות בדולרים אך משלמים משכורות בשקלים.",
            "נופשים ישראלים הטסים לחופשות מפנקות באירופה.",
            "אף אחד, שקל חזק זה תמיד טוב ב-100% לכולם ללא יוצא מן הכלל."
        ],
        answer: 1,
        hint: "חשבו מי מחליף דולרים בשקלים כדי לשלם משכורות מקומיות ורואה שהדולר שלו שווה פחות שקלים.",
        explanation: "היצואנים נפגעים מאוד משקל חזק, מכיוון שההכנסות הדולריות שלהם מחו\"ל שוות פחות שקלים בארץ, מה שמקטין את הרווחיות ומקשה על תשלום המשכורות."
    },
    {
        q: "מה קובע חוק בנק ישראל (התש\"ע-2010) לגבי מדרג המטרות של הבנק?",
        options: [
            "מטרה ראשונה היא תעסוקה מלאה, מטרה שנייה היא יציבות פיננסית, ויציבות מחירים אינה מוזכרת כלל.",
            "אין מדרג מטרות, הנגיד רשאי לבחור בכל יום במה לטפל.",
            "יציבות המחירים היא היעד הראשי. צמיחה ותעסוקה ויציבות פיננסית הן מטרות משניות בלבד כל עוד הן לא פוגעות ביעד הראשי.",
            "להפוך את מדינת ישראל למעצמת ביטקוין עולמית."
        ],
        answer: 2,
        hint: "לפי ד\"ר צבאן, שמירה על יעד האינפלציה (1%-3%) היא הערך החשוב והעליון ביותר של הבנק המרכזי.",
        explanation: "חוק בנק ישראל קובע בבירור שיציבות מחירים היא המטרה המרכזית, ותמיכה בצמיחה או יציבות פיננסית יקודמו רק כל עוד אינם מסכנים יציבות זו."
    },
    {
        q: "מהי הגדרת המונח 'הרחבה כמותית' (Quantitative Easing)?",
        options: [
            "העלאת מסים גורפת כדי למלא את קופת המדינה.",
            "הדפסת כסף (נזילות) ע\"י הבנק המרכזי ורכישת אגרות חוב ממשלתיות וקונצרניות מהבנקים כדי להגדיל את האשראי במשק.",
            "חלוקת שטרות כסף חינם לכל אזרחי המדינה בתיבת הדואר.",
            "הגדלת מספר העובדים בבנק ישראל פי שניים."
        ],
        answer: 1,
        hint: "זהו כלי לא קונבנציונלי שנועד להזרים מזומנים (נזילות) ישירות לתוך המערכת הפיננסית כשהריבית אפסית.",
        explanation: "הרחבה כמותית היא הזרקת נזילות למשק באמצעות רכישת נכסים פיננסיים (אג\"ח) ע\"י הבנק המרכזי, כלי שמשתמשים בו במשברי ענק."
    },
    {
        q: "כאשר בנק ישראל רוכש עשרות מיליארדי דולרים בשוק המט\"ח (התערבות במט\"ח), מהי המטרה שלו?",
        options: [
            "להחליש את השקל באופן מלאכותי כדי להגן על היצואנים וההייטק הישראלי.",
            "לטוס לחופשה יקרה בחו\"ל עם תקציב דולרי מנופח.",
            "לחזק את השקל עוד יותר כדי שנוכל לקנות מוצרים זולים מסין.",
            "לסגור את הבנק ולהשקיע את כל המאגרים בבורסה בניו יורק."
        ],
        answer: 0,
        hint: "הצפת השוק בשקלים בתמורה לדולרים מפחיתה את ערכו של השקל.",
        explanation: "בנק ישראל רוכש דולרים כדי להגדיל את הביקוש לדולר ולהחליש את השקל, ובכך הוא מגן על כושר התחרותיות של היצואנים הישראלים בעולם."
    },
    {
        q: "מהי דיפלציה ומדוע היא נחשבת לסיוט מאקרו-כלכלי לא פחות מאינפלציה גבוהה?",
        options: [
            "עליות מחירים של מוצרים ספציפיים כמו עגבניות.",
            "מצב שבו מחירי המוצרים יורדים באופן עקבי, הציבור דוחה קניות, עסקים קורסים מחוסר רווחים והאבטלה מזנקת.",
            "כאשר אין כסף פיזי מודפס במשק בכלל.",
            "דיפלציה זה מצב חיובי לחלוטין שהבנק המרכזי תמיד מנסה להגיע אליו."
        ],
        answer: 1,
        hint: "חשבו מה קורה לכם כצרכנים אם אתם יודעים שמחר הטלוויזיה שאתם רוצים תעלה 200 שקלים פחות.",
        explanation: "בדיפלציה, אנשים דוחים רכישות כי המחירים יורדים. כתוצאה מכך הביקוש קורס, מפעלים נסגרים, שכר העובדים נחתך והאבטלה גואה."
    },
    {
        q: "מהי ריבית ריאלית וכיצד היא מחושבת?",
        options: [
            "הריבית הרשומה בבנק ללא קשר לשום מדד אחר.",
            "הריבית הנומינלית בניכוי שיעור האינפלציה המצופה או בפועל.",
            "הריבית שהבנק נותן אך ורק על הלוואות לקניית נדל\"ן.",
            "נוסחה סודית שרק ד\"ר צבאן יודע לחשב במבחן."
        ],
        answer: 1,
        hint: "היא מייצגת את כוח הקנייה האמיתי של הריבית אחרי שהבנו כמה כוח קנייה נשחק עקב עליות המחירים.",
        explanation: "הריבית הריאלית היא הריבית המתקבלת בניכוי השחיקה האינפלציונית (ריבית נומינלית פחות אינפלציה), והיא המדד האמיתי למחיר הכסף."
    },
    {
        q: "מיהו הגוף שמייעץ כלכלית לממשלת ישראל על פי חוק?",
        options: [
            "המחלקה הכלכלית של הכנסת.",
            "חברת ייעוץ פרטית מניו יורק.",
            "נגיד בנק ישראל משמש כיועץ הכלכלי לממשלה.",
            "יו\"ר האופוזיציה בלבד."
        ],
        answer: 2,
        hint: "לנגיד יש כובע כפול: הוא גם ראש הבנק המרכזי וגם היועץ הבכיר ביותר למקבלי ההחלטות באוצר ובממשלה.",
        explanation: "על פי חוק בנק ישראל, נגיד בנק ישראל משמש כיועץ הכלכלי הרשמי של הממשלה בתחומי המאקרו והכלכלה."
    },
    {
        q: "מהו מדד המחירים לצרכן (CPI) ואיך הוא קשור לאינפלציה?",
        options: [
            "מדד של מחירי המניות בבורסת תל אביב בלבד.",
            "סקר שבודק כמה סטודנטים ישנים בשיעור כלכלה.",
            "מדד המודד את השינוי לאורך זמן במחירו של סל מוצרים ושירותים קבוע הנצרך ע\"י משפחה ממוצעת, והשינוי בו מודד את האינפלציה.",
            "רשימת המחירים המומלצת לצרכן ברשתות השיווק הגדולות."
        ],
        answer: 2,
        hint: "הוא משקף את 'סל הקניות' הטיפוסי של הציבור ומשמש למדידת השינוי ביוקר המחיה.",
        explanation: "מדד המחירים לצרכן מודד את אחוז השינוי שחל במשך הזמן בהוצאה הדרושה לקניית 'סל' קבוע של מצרכים ושירותים. שינוי חיובי בו מייצג אינפלציה."
    },
    {
        q: "למה בנק ישראל לא שואף ל-0% אינפלציה ומעדיף יעד חיובי קטן של 1%-3%?",
        options: [
            "כי 0% אינפלציה קרוב מדי לסכנת דיפלציה, ואינפלציה נמוכה חיובית משמנת את גלגלי הכלכלה ומאפשרת התאמת שכר גמישה.",
            "כי אין להם מחשבון שיכול לחשב 0% ריבית או אינפלציה.",
            "כדי שהממשלה תוכל לגבות יותר מיסים בדרכים לא ישרות.",
            "זה פשוט טעות היסטורית שאיש לא טרח לתקן."
        ],
        answer: 0,
        hint: "אינפלציה קלה מעודדת אנשים לצרוך כעת ולא להמתין לנצח, ומאפשרת למעסיקים להתאים שכר מבלי לחתוך אותו נומינלית.",
        explanation: "אינפלציה מתונה וחיובית (1%-3%) משמשת ככרית ביטחון נגד דיפלציה הרסנית ומאפשרת התאמות מחירים ושכר טבעיות וקלות יותר בשוק החופשי."
    }
];

function loadQuizQuestion() {
    const qData = quizQuestions[gameState.quizCurrentIndex];
    
    // Set level badge based on index
    const badge = document.getElementById("quiz-level-badge");
    if (gameState.quizCurrentIndex < 5) {
        badge.textContent = "רמת קושי: סטודנט מתחיל 🎓";
        badge.style.background = "var(--info)";
    } else if (gameState.quizCurrentIndex < 10) {
        badge.textContent = "רמת קושי: חבר ועדה מוניטרית 👔";
        badge.style.background = "var(--warning)";
    } else {
        badge.textContent = "רמת קושי: הנגיד המומחה 👑";
        badge.style.background = "var(--secondary)";
    }

    document.getElementById("quiz-q-num").textContent = `שאלה ${gameState.quizCurrentIndex + 1} מתוך ${quizQuestions.length}`;
    document.getElementById("question-title").textContent = qData.q;
    
    // Clear elements
    document.getElementById("quiz-hint-box").style.display = "none";
    document.getElementById("quiz-feedback-card").style.display = "none";
    document.getElementById("btn-quiz-next").style.display = "none";
    document.getElementById("btn-quiz-hint").style.display = "inline-flex";

    const optionsContainer = document.getElementById("question-options");
    optionsContainer.innerHTML = "";

    const letters = ["א", "ב", "ג", "ד"];
    qData.options.forEach((opt, idx) => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.innerHTML = `
            <span>${opt}</span>
            <span class="option-badge">${letters[idx]}</span>
        `;
        btn.addEventListener("click", () => handleAnswerSelect(idx, btn));
        optionsContainer.appendChild(btn);
    });

    renderQuizProgressDots();
}

function renderQuizProgressDots() {
    const dotsContainer = document.getElementById("quiz-progress-dots");
    dotsContainer.innerHTML = "";
    
    for (let i = 0; i < quizQuestions.length; i++) {
        const dot = document.createElement("div");
        dot.className = "progress-dot";
        if (i === gameState.quizCurrentIndex) {
            dot.classList.add("active");
        } else if (i < gameState.quizCurrentIndex) {
            // we can mark past ones if we tracked correct/incorrect
            dot.classList.add("correct");
        }
        dotsContainer.appendChild(dot);
    }
}

function handleAnswerSelect(selectedIdx, btnElement) {
    const qData = quizQuestions[gameState.quizCurrentIndex];
    const optionsList = document.querySelectorAll(".option-btn");
    
    // Disable all options
    optionsList.forEach(btn => btn.setAttribute("disabled", "true"));

    const fbCard = document.getElementById("quiz-feedback-card");
    const fbTitle = document.getElementById("quiz-feedback-title");
    const fbExpl = document.getElementById("quiz-feedback-explanation");

    fbCard.style.display = "block";
    document.getElementById("btn-quiz-hint").style.display = "none";
    document.getElementById("btn-quiz-next").style.display = "inline-flex";

    if (selectedIdx === qData.answer) {
        // Correct
        btnElement.classList.add("correct");
        fbCard.className = "feedback-card correct-feedback";
        fbTitle.textContent = "תשובה נכונה! כל הכבוד! 🎉";
        fbExpl.textContent = qData.explanation;
        gameState.score += 100;
        gameState.quizCorrectAnswers++;
        playSuccessSound();
    } else {
        // Incorrect
        btnElement.classList.add("incorrect");
        optionsList[qData.answer].classList.add("correct"); // Highlight correct one
        fbCard.className = "feedback-card incorrect-feedback";
        fbTitle.textContent = "אופס! לא מדויק. 🧐";
        fbExpl.textContent = qData.explanation;
        playErrorSound();
    }

    document.getElementById("hud-score").textContent = gameState.score;
}

// Hint button trigger
document.getElementById("btn-quiz-hint").addEventListener("click", () => {
    const qData = quizQuestions[gameState.quizCurrentIndex];
    const hintBox = document.getElementById("quiz-hint-box");
    hintBox.textContent = `צוות המרצים של ד"ר צבאן רומז: ${qData.hint}`;
    hintBox.style.display = "block";
    playTapSound();
});

// Next question trigger
document.getElementById("btn-quiz-next").addEventListener("click", () => {
    playTapSound();
    if (gameState.quizCurrentIndex < quizQuestions.length - 1) {
        gameState.quizCurrentIndex++;
        loadQuizQuestion();
    } else {
        // Quiz finished! Calculate grade and go to certificate
        gameState.stageUnlocked.cert = true;
        gameState.score += gameState.quizCorrectAnswers * 50; // extra bonus
        document.getElementById("hud-score").textContent = gameState.score;
        navigateToScreen("screen-cert");
    }
});

// Certificate Print/Save Trigger
document.getElementById("btn-print-certificate").addEventListener("click", () => {
    playTapSound();
    window.print();
});

// Restart Game trigger
document.getElementById("btn-restart-game").addEventListener("click", () => {
    playTapSound();
    
    // Reset state
    gameState.score = 0;
    gameState.currentStage = "intro";
    gameState.simChallengesCompleted = false;
    gameState.simChallengesActive = false;
    gameState.simChallengeIndex = 0;
    gameState.committeeVoted = false;
    gameState.toolDeployed = false;
    gameState.quizCurrentIndex = 0;
    gameState.quizCorrectAnswers = 0;

    // Reset UI blocks
    document.getElementById("committee-feedback").style.display = "none";
    document.getElementById("tool-activation-feedback").style.display = "none";
    
    const nextS2 = document.getElementById("btn-stage2-next");
    nextS2.setAttribute("disabled", "true");
    nextS2.style.opacity = "0.5";
    nextS2.style.cursor = "not-allowed";

    const nextS3 = document.getElementById("btn-stage3-next");
    nextS3.setAttribute("disabled", "true");
    nextS3.style.opacity = "0.5";
    nextS3.style.cursor = "not-allowed";

    const nextS4 = document.getElementById("btn-stage4-next");
    nextS4.setAttribute("disabled", "true");
    nextS4.style.opacity = "0.5";
    nextS4.style.cursor = "not-allowed";

    const nextPac = document.getElementById("btn-pacman-next");
    nextPac.setAttribute("disabled", "true");
    nextPac.style.opacity = "0.5";
    nextPac.style.cursor = "not-allowed";

    navigateToScreen("screen-auth");
});

// PACMAN MONETARY MINI-GAME ENGINE
let pacmanState = {
    x: 30,
    y: 30,
    radius: 12,
    speed: 3,
    direction: { x: 1, y: 0 },
    nextDirection: { x: 1, y: 0 },
    score: 0,
    lives: 10,
    gameRunning: false,
    ghost: {
        x: 450,
        y: 250,
        radius: 12,
        speed: 1.5,
        color: "red",
        vulnerable: false,
        vulnerableTimer: 0
    },
    dots: [],
    powerPellets: [],
    walls: [],
    animationId: null
};

// Maze Layout (15 columns x 9 rows, each cell 40x40px)
const TILE_SIZE = 40;
const MAZE_GRID = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,1,0,0,0,1,0,0,0,2,1],
    [1,0,1,1,0,1,0,1,0,1,0,1,1,0,1],
    [1,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
    [1,1,0,1,1,1,0,1,0,1,1,1,0,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,0,1,0,1,0,1,1,0,1],
    [1,2,0,0,0,1,0,0,0,1,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

function generateMaze() {
    pacmanState.dots = [];
    pacmanState.powerPellets = [];
    pacmanState.walls = [];
    
    for (let r = 0; r < MAZE_GRID.length; r++) {
        for (let c = 0; c < MAZE_GRID[r].length; c++) {
            const x = c * TILE_SIZE;
            const y = r * TILE_SIZE;
            if (MAZE_GRID[r][c] === 1) {
                pacmanState.walls.push({ x, y, w: TILE_SIZE, h: TILE_SIZE });
            } else if (MAZE_GRID[r][c] === 2) {
                pacmanState.powerPellets.push({ x: x + TILE_SIZE/2, y: y + TILE_SIZE/2, eaten: false });
            } else {
                // Don't spawn dot right at Pacman start (0,0) or Ghost start (13,7)
                if ((r === 1 && c === 1) || (r === 7 && c === 13)) continue;
                pacmanState.dots.push({ x: x + TILE_SIZE/2, y: y + TILE_SIZE/2, eaten: false });
            }
        }
    }
}

function initPacmanGame() {
    pacmanState.x = 60;
    pacmanState.y = 60;
    pacmanState.direction = { x: 1, y: 0 };
    pacmanState.nextDirection = { x: 1, y: 0 };
    pacmanState.score = 0;
    pacmanState.lives = 10;
    pacmanState.gameRunning = false;
    
    pacmanState.ghost = {
        x: 500,
        y: 280,
        radius: 12,
        speed: 1.5,
        color: "red",
        vulnerable: false,
        vulnerableTimer: 0
    };

    generateMaze();
    updatePacmanStats();

    // Show start overlay
    document.getElementById("pacman-start-overlay").style.display = "block";
    document.getElementById("btn-pacman-next").setAttribute("disabled", "true");
    document.getElementById("btn-pacman-next").style.opacity = "0.5";
    document.getElementById("btn-pacman-next").style.cursor = "not-allowed";

    drawPacmanBoard();
}

function updatePacmanStats() {
    document.getElementById("pacman-score-val").textContent = pacmanState.score;
    document.getElementById("pacman-lives-val").textContent = pacmanState.lives;
}

// Controller logic
function setDirection(dx, dy) {
    pacmanState.nextDirection = { x: dx, y: dy };
    if (!pacmanState.gameRunning && pacmanState.lives > 0) {
        startGame();
    }
}

document.getElementById("pac-btn-up").addEventListener("click", () => setDirection(0, -1));
document.getElementById("pac-btn-down").addEventListener("click", () => setDirection(0, 1));
document.getElementById("pac-btn-left").addEventListener("click", () => setDirection(-1, 0));
document.getElementById("pac-btn-right").addEventListener("click", () => setDirection(1, 0));

window.addEventListener("keydown", (e) => {
    const activeScreen = document.getElementById("screen-pacman").classList.contains("active");
    if (!activeScreen) return;

    if (e.key === "ArrowUp") { e.preventDefault(); setDirection(0, -1); }
    if (e.key === "ArrowDown") { e.preventDefault(); setDirection(0, 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); setDirection(-1, 0); }
    if (e.key === "ArrowRight") { e.preventDefault(); setDirection(1, 0); }
});

document.getElementById("pacman-start-overlay").addEventListener("click", () => {
    startGame();
});

function startGame() {
    if (pacmanState.gameRunning) return;
    pacmanState.gameRunning = true;
    document.getElementById("pacman-start-overlay").style.display = "none";
    playSuccessSound();
    
    if (pacmanState.animationId) cancelAnimationFrame(pacmanState.animationId);
    pacmanState.animationId = requestAnimationFrame(pacmanGameLoop);
}

function checkWallCollision(x, y, radius) {
    for (let wall of pacmanState.walls) {
        // Simple AABB vs circle collision
        let closestX = Math.max(wall.x, Math.min(x, wall.x + wall.w));
        let closestY = Math.max(wall.y, Math.min(y, wall.y + wall.h));
        
        let distanceX = x - closestX;
        let distanceY = y - closestY;
        let distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);
        
        if (distanceSquared < (radius * radius)) {
            return true;
        }
    }
    return false;
}

function pacmanGameLoop() {
    if (!pacmanState.gameRunning) return;

    // 1. Try to apply next direction
    const testNextX = pacmanState.x + pacmanState.nextDirection.x * pacmanState.speed;
    const testNextY = pacmanState.y + pacmanState.nextDirection.y * pacmanState.speed;
    if (!checkWallCollision(testNextX, testNextY, pacmanState.radius)) {
        pacmanState.direction = pacmanState.nextDirection;
    }

    // 2. Move Pacman
    const nextX = pacmanState.x + pacmanState.direction.x * pacmanState.speed;
    const nextY = pacmanState.y + pacmanState.direction.y * pacmanState.speed;
    if (!checkWallCollision(nextX, nextY, pacmanState.radius)) {
        pacmanState.x = nextX;
        pacmanState.y = nextY;
    }

    // 3. Move Ghost (Simple AI chasing Pacman)
    const ghost = pacmanState.ghost;
    if (ghost.vulnerable) {
        ghost.vulnerableTimer--;
        if (ghost.vulnerableTimer <= 0) {
            ghost.vulnerable = false;
            ghost.color = "red";
        }
    }

    // Simple Chase or Run away
    let gdxVal = pacmanState.x - ghost.x;
    let gdyVal = pacmanState.y - ghost.y;
    
    let ghostSpeed = ghost.vulnerable ? ghost.speed * 0.5 : ghost.speed;
    let moveDirX = gdxVal > 0 ? 1 : -1;
    let moveDirY = gdyVal > 0 ? 1 : -1;

    // Escape if vulnerable
    if (ghost.vulnerable) {
        moveDirX *= -1;
        moveDirY *= -1;
    }

    let testGhostX = ghost.x + moveDirX * ghostSpeed;
    let testGhostY = ghost.y + moveDirY * ghostSpeed;

    if (!checkWallCollision(testGhostX, ghost.y, ghost.radius)) {
        ghost.x = testGhostX;
    }
    if (!checkWallCollision(ghost.x, testGhostY, ghost.radius)) {
        ghost.y = testGhostY;
    }

    // 4. Dot Collisions
    pacmanState.dots.forEach(dot => {
        if (!dot.eaten) {
            let dx = pacmanState.x - dot.x;
            let dy = pacmanState.y - dot.y;
            if (dx*dx + dy*dy < 144) {
                dot.eaten = true;
                pacmanState.score += 10;
                gameState.score += 10;
                document.getElementById("hud-score").textContent = gameState.score;
                updatePacmanStats();
                playSound([800], [0.05], "sine", 0.05);

                // Check win condition
                if (pacmanState.score >= 150) {
                    unlockQuiz();
                }
            }
        }
    });

    // 5. Power Pellet Collisions
    pacmanState.powerPellets.forEach(pellet => {
        if (!pellet.eaten) {
            let dx = pacmanState.x - pellet.x;
            let dy = pacmanState.y - pellet.y;
            if (dx*dx + dy*dy < 225) {
                pellet.eaten = true;
                pacmanState.score += 30;
                gameState.score += 30;
                document.getElementById("hud-score").textContent = gameState.score;
                ghost.vulnerable = true;
                ghost.vulnerableTimer = 300; // ~5 seconds at 60fps
                ghost.color = "blue";
                updatePacmanStats();
                playSuccessSound();
            }
        }
    });

    // 6. Ghost Collision
    let gdx = pacmanState.x - ghost.x;
    let gdy = pacmanState.y - ghost.y;
    if (gdx*gdx + gdy*gdy < 400) {
        if (ghost.vulnerable) {
            // Eat ghost
            ghost.x = 300;
            ghost.y = 180;
            ghost.vulnerable = false;
            ghost.color = "red";
            pacmanState.score += 100;
            gameState.score += 100;
            document.getElementById("hud-score").textContent = gameState.score;
            updatePacmanStats();
            playSuccessSound();
            if (pacmanState.score >= 150) {
                unlockQuiz();
            }
        } else {
            // Lose a life
            pacmanState.lives--;
            playErrorSound();
            updatePacmanStats();
            // Screen shake
            const board = document.querySelector(".pacman-board-wrapper");
            board.classList.add("shake");
            setTimeout(() => board.classList.remove("shake"), 400);

            if (pacmanState.lives <= 0) {
                // Restart with 10 lives so student is not locked out
                alert("הרוח הכלכלית תפסה אותך! לא נורא, המשמר הלאומי הזרים עוד 10 פסילות של יציבות! נסה שוב!");
                pacmanState.lives = 10;
                updatePacmanStats();
            }
            
            // Reset positions
            pacmanState.x = 60;
            pacmanState.y = 60;
            pacmanState.direction = { x: 1, y: 0 };
            pacmanState.nextDirection = { x: 1, y: 0 };
            ghost.x = 500;
            ghost.y = 280;
            pacmanState.gameRunning = false;
            document.getElementById("pacman-start-overlay").style.display = "block";
            return;
        }
    }

    drawPacmanBoard();
    pacmanState.animationId = requestAnimationFrame(pacmanGameLoop);
}

function unlockQuiz() {
    const nextBtn = document.getElementById("btn-pacman-next");
    nextBtn.removeAttribute("disabled");
    nextBtn.style.opacity = "1";
    nextBtn.style.cursor = "pointer";
    nextBtn.innerHTML = "המשך לחידון המאקרו הגדול! ➔";
    
    // Give bonus
    gameState.score += 200;
    document.getElementById("hud-score").textContent = gameState.score;
    
    pacmanState.gameRunning = false;
    cancelAnimationFrame(pacmanState.animationId);
    startCelebration();
}

function drawPacmanBoard() {
    const pc = document.getElementById("pacman-canvas");
    const pctx = pc.getContext("2d");
    
    // Clear Board
    pctx.fillStyle = "#020208";
    pctx.fillRect(0, 0, pc.width, pc.height);

    // Draw Walls
    pctx.fillStyle = "#1e293b";
    pctx.strokeStyle = "#4f46e5";
    pctx.lineWidth = 2;
    pacmanState.walls.forEach(w => {
        pctx.fillRect(w.x, w.y, w.w, w.h);
        pctx.strokeRect(w.x, w.y, w.w, w.h);
    });

    // Draw Dots
    pctx.fillStyle = "var(--gold)";
    pacmanState.dots.forEach(dot => {
        if (!dot.eaten) {
            pctx.beginPath();
            pctx.arc(dot.x, dot.y, 4, 0, Math.PI * 2);
            pctx.fill();
        }
    });

    // Draw Power Pellets (Rate Hikes)
    pctx.fillStyle = "var(--secondary)";
    pacmanState.powerPellets.forEach(pellet => {
        if (!pellet.eaten) {
            pctx.beginPath();
            pctx.arc(pellet.x, pellet.y, 8, 0, Math.PI * 2);
            pctx.fill();
            // Glow effect
            pctx.shadowColor = "var(--secondary)";
            pctx.shadowBlur = 10;
            pctx.fillStyle = "#fff";
            pctx.beginPath();
            pctx.arc(pellet.x, pellet.y, 4, 0, Math.PI * 2);
            pctx.fill();
            pctx.shadowBlur = 0; // reset
        }
    });

    // Draw Pacman
    pctx.fillStyle = "#fbbf24";
    pctx.beginPath();
    // Simple animated mouth
    let mouthAngle = 0.2;
    if (pacmanState.gameRunning) {
        mouthAngle = Math.abs(Math.sin(Date.now() / 100)) * 0.4;
    }
    let rotation = 0;
    if (pacmanState.direction.x === 1) rotation = 0;
    if (pacmanState.direction.x === -1) rotation = Math.PI;
    if (pacmanState.direction.y === 1) rotation = Math.PI / 2;
    if (pacmanState.direction.y === -1) rotation = -Math.PI / 2;

    pctx.arc(pacmanState.x, pacmanState.y, pacmanState.radius, rotation + mouthAngle, rotation + Math.PI * 2 - mouthAngle);
    pctx.lineTo(pacmanState.x, pacmanState.y);
    pctx.fill();

    // Draw Ghost (Inflation)
    const ghost = pacmanState.ghost;
    pctx.fillStyle = ghost.color;
    pctx.beginPath();
    pctx.arc(ghost.x, ghost.y - 2, ghost.radius, Math.PI, 0, false);
    // Draw ghost body skirt
    pctx.lineTo(ghost.x + ghost.radius, ghost.y + ghost.radius);
    pctx.lineTo(ghost.x + ghost.radius - 6, ghost.y + ghost.radius - 4);
    pctx.lineTo(ghost.x + ghost.radius - 12, ghost.y + ghost.radius);
    pctx.lineTo(ghost.x - ghost.radius + 6, ghost.y + ghost.radius - 4);
    pctx.lineTo(ghost.x - ghost.radius, ghost.y + ghost.radius);
    pctx.closePath();
    pctx.fill();

    // Ghost Eyes
    pctx.fillStyle = "#fff";
    pctx.beginPath();
    pctx.arc(ghost.x - 4, ghost.y - 3, 3, 0, Math.PI * 2);
    pctx.arc(ghost.x + 4, ghost.y - 3, 3, 0, Math.PI * 2);
    pctx.fill();
    // Pupils
    pctx.fillStyle = "#000";
    pctx.beginPath();
    pctx.arc(ghost.x - 4, ghost.y - 3, 1.5, 0, Math.PI * 2);
    pctx.arc(ghost.x + 4, ghost.y - 3, 1.5, 0, Math.PI * 2);
    pctx.fill();

    // Ghost text label: "אינפלציה"
    pctx.fillStyle = "#fff";
    pctx.font = "bold 9px sans-serif";
    pctx.textAlign = "center";
    pctx.fillText("אינפלציה 👻", ghost.x, ghost.y - 18);
}

// Prev and Next triggers for Pacman Screen
document.getElementById("btn-pacman-prev").addEventListener("click", () => {
    pacmanState.gameRunning = false;
    cancelAnimationFrame(pacmanState.animationId);
    navigateToScreen("screen-stage4");
});

document.getElementById("btn-pacman-next").addEventListener("click", () => {
    if (pacmanState.score >= 150) {
        pacmanState.gameRunning = false;
        cancelAnimationFrame(pacmanState.animationId);
        navigateToScreen("screen-quiz");
    }
});

