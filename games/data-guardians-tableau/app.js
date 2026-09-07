// Game State (Version 4 - Extended Academic LMS Edition)
const state = {
    player: {
        name: 'סטודנט נתונים 🧙‍♂️',
        avatar: '🧙‍♂️',
        roleTitle: 'מכשף הפרומפטים ⚡',
        roleDesc: 'הנדסת פרומפטים ואיכות נתונים ⚡',
        score: 0
    },
    currentStage: 1,
    stagesUnlocked: [1, 2, 3, 4, 5, 6], // Complete navigation freedom
    completedStages: [], // Tracking resolved stages!
    lifelinesLeft: 3, // Exactly 3 skip lifelines
    isMusicPlaying: false,
    isSFXEnabled: true,
    
    // Stage 1: Database Schema FK connections
    s1: {
        placedKeys: {
            branch: '',
            product: ''
        }
    },
    
    // Stage 2: Data Integrity & Common Sense (Expanded to 10 rows: 6 corrupted, 4 clean)
    s2: {
        corruptedData: [
            { id: 2001, date: "2026-05-01", branch_id: 1, prod_id: 101, qty: 2, total: 3000, segment: "חבר מועדון", profit: 600, isCorrupted: false, errorType: "" },
            { id: 2002, date: "2026-05-02", branch_id: 2, prod_id: 999, qty: 1, total: 120, segment: "מזדמן", profit: 30, isCorrupted: true, errorType: "מפתח זר שבור - לא קיים מוצר 999" },
            { id: 2003, date: "2026-05-03", branch_id: 1, prod_id: 102, qty: 3, total: -55, segment: "חבר מועדון", profit: -10, isCorrupted: true, errorType: "מחיר ורווח שליליים לא חוקיים" },
            { id: 2004, date: "2035-12-01", branch_id: 3, prod_id: 103, qty: 1, total: 90, segment: "מזדמן", profit: 20, isCorrupted: true, errorType: "תאריך עתידי לא סביר משנת 2035" },
            { id: 2005, date: "2026-05-05", branch_id: 2, prod_id: 101, qty: "...", total: 1500, segment: "חבר מועדון", profit: 300, isCorrupted: true, errorType: "כמות קטועה עם נקודות" },
            { id: 2006, date: "2026-05-06", branch_id: 1, prod_id: 103, qty: 4, total: 360, segment: "מזדמן", profit: 80, isCorrupted: false, errorType: "" },
            { id: 2007, date: "2026-05-07", branch_id: 3, prod_id: 102, qty: 2, total: 110, segment: "חבר מועדון", profit: 30, isCorrupted: false, errorType: "" },
            { id: 2008, date: "2026-05-08", branch_id: 2, prod_id: 101, qty: 1, total: 1500, segment: "חבר מועדון", profit: 300, isCorrupted: false, errorType: "" },
            { id: 2009, date: "2026-05-09", branch_id: 99, prod_id: 102, qty: 2, total: 110, segment: "מזדמן", profit: 22, isCorrupted: true, errorType: "מפתח זר שבור - לא קיים סניף 99" },
            { id: 2010, date: "2026-05-10", branch_id: 3, prod_id: 103, qty: 10, total: 900, segment: "חבר מועדון", profit: 950, isCorrupted: true, errorType: "רווח גבוה מסך התשלום - היגיון שבור" }
        ],
        purifiedIds: []
    },
    
    // Stage 3: Prompt Forge (Updated with 12 blocks: 6 correct & 6 distracting blocks)
    s3: {
        blocks: [
            { id: 'role', tag: 'תפקיד 🧙‍♂️', text: 'פעל כאנליסט נתונים בכיר המתמחה בקמעונאות ובבניית דאטה סינתטי תואם סכמה.', isCorrect: true },
            { id: 'context', tag: 'הקשר עסקי 🏢', text: 'עליך לייצר נתונים מדומים המיועדים לטעינה ישירה לתוך סכמת מסד הנתונים שברשותנו.', isCorrect: true },
            { id: 'cols', tag: 'מבנה הטבלה 📊', text: 'הגדר במדויק את מבנה טבלת מכירות עם העמודות: עסקה_מזהה, תאריך_רכישה, סניף_מזהה, מוצר_מזהה, כמות_פריטים, סה״כ_לתשלום, סוג_לקוח, רווח_עסקה.', isCorrect: true },
            { id: 'fk-rules', tag: 'שלמות הנתונים (FK) 🔑', text: 'חוקי שלמות (Foreign Keys): ערכי סניף_מזהה חייבים להיות רק מתוך רשימת המפתח הראשי של טבלת סניפים (1, 2, 3), וערכי מוצר_מזהה מתוך טבלת מוצרים (101, 102, 103) כדי לקשר ביניהן!', isCorrect: true },
            { id: 'integrity', tag: 'היגיון בריא 💡', text: 'חוקי היגיון בריא: כמויות הגיוניות (1 עד 5), מחירים חיוביים תואמים למחירי המוצרים, סוג לקוח ("חבר מועדון" או "מזדמן"), רווח ריאלי חיובי (20% מתוך המחיר לצרכן), ותאריכים עוקבים בחודש האחרון בלבד.', isCorrect: true },
            { id: 'file-output', tag: 'ייצוא כקובץ CSV פיזי 💾', text: 'אל תציג רק טקסט סתמי, אלא פלוט את התוכן בתוך תיבת קוד ייעודית (Code Block) בפורמט CSV נקי וללא קיצורים כדי שאוכל להעתיק ולשמור אותו פיזית כקובץ sales_data.csv!', isCorrect: true },
            { id: 'distractor_mp3', tag: 'מסיח קול 🎵', text: 'פלוט את נתוני המכירות כקובץ שמע מסוג MP3 עם מוזיקת רקע מגניבה וקצבית.', isCorrect: false },
            { id: 'distractor_gif', tag: 'מסיח ויזואלי 🐒', text: 'תייצר לי קובץ תמונה מונפש מסוג GIF שמציג אנימציית קופים רוקדים שחוגגים יחד.', isCorrect: false },
            { id: 'distractor_text', tag: 'מסיח מילולי 📝', text: 'אל תשתמש בטבלאות או פסיקים, תכתוב את כל הנתונים כסיפור מילולי ארוך ומשפטים רגילים בעברית.', isCorrect: false },
            { id: 'distractor_space', tag: 'מסיח חלל 🪐', text: 'תמציא מזהי סניפים וערכים מחוץ לגלקסיה (כמו "סניף מאדים" או "מחוז שביל החלב") לצורך בדיקות עתידיות.', isCorrect: false },
            { id: 'distractor_python', tag: 'מסיח קוד פייתון 🐍', text: 'תכתוב סקריפט פייתון פשוט שמדפיס Hello World למסך ומתעלם לחלוטין מנתוני המכירות.', isCorrect: false },
            { id: 'distractor_dots', tag: 'מסיח שלוש נקודות 💬', text: 'תכתוב רק את השורה הראשונה ותעצור עם שלוש נקודות (...) כדי לחסוך מקום בפלט.', isCorrect: false }
        ],
        selectedBlocks: []
    },
    
    // Stage 4: Platforms & Connections (Expanded to 5 questions)
    s4: {
        questions: [
            {
                id: 1,
                q: "בחיבור שלוש טבלאות (מכירות, מוצרים, סניפים) ב-Tableau Public, כיצד נגדיר את הקישור הלוגי ביניהן?",
                options: [
                    { text: "מגדירים קשר (Relationship) על בסיס שדות המפתח המשותפים: 'מוצר_מזהה' בין מכירות למוצרים, ו'סניף_מזהה' בין מכירות לסניפים.", isCorrect: true },
                    { text: "מייבאים רק את טבלת המכירות ומתעלמים משאר הטבלאות מכיוון שאין להן שום חשיבות.", isCorrect: false },
                    { text: "מעתיקים את כל הנתונים באופן ידני לגיליון אחד גדול באקסל מבלי לעשות קישורים ב-Tableau.", isCorrect: false }
                ],
                answered: false
            },
            {
                id: 2,
                q: "אם שמרנו את קובץ המכירות שנוצר ב-AI בפורמט CSV (קובץ טקסט מופרד בפסיקים), באיזה תפריט חיבור (Connect) נבחר במסך הבית של Tableau?",
                options: [
                    { text: "Text file (קובץ טקסט)", isCorrect: true },
                    { text: "Microsoft Excel", isCorrect: false },
                    { text: "Google Sheets", isCorrect: false }
                ],
                answered: false
            },
            {
                id: 3,
                q: "מדוע חיוני לוודא שערכי המפתחות הזרים (סניף_מזהה ומוצר_מזהה) בטבלת המכירות שה-AI מייצר תואמים בדיוק למפתחות הראשיים בטבלאות האם?",
                options: [
                    { text: "מפני שאם הערכים לא יהיו תואמים, הקישור (Relationship) ב-Tableau ייכשל, וכל העסקאות עם הערכים הלא תואמים פשוט יישמטו מהניתוח והדאשבורד!", isCorrect: true },
                    { text: "זה פשוט מנהג ישן של מתכנתים, אך ל-Tableau זה לא משנה כלל.", isCorrect: false },
                    { text: "כי אחרת הקובץ יהיה גדול מדי להעלאה בגרסה החינמית.", isCorrect: false }
                ],
                answered: false
            },
            {
                id: 4,
                q: "מה ההבדל המרכזי בין גיליון עבודה (Worksheet) ללוח מחוונים (Dashboard) ב-Tableau?",
                options: [
                    { text: "גיליון מכיל תרשים יחיד ובודד, בעוד שדאשבורד מאחד מספר גיליונות לסיפור ויזואלי שלם ואינטראקטיבי.", isCorrect: true },
                    { text: "גיליון מיועד לעבודה על מחשבים אישיים ודאשבורד מיועד למכשירים ניידים בלבד.", isCorrect: false },
                    { text: "אין שום הבדל ביניהם, אלו פשוט שני שמות שונים לאותו סוג מסך.", isCorrect: false }
                ],
                answered: false
            },
            {
                id: 5,
                q: "כיצד שומרים ומגישים את העבודה המוגמרת ב-Tableau Public לבודק המטלות של הקורס?",
                options: [
                    { text: "שומרים ל-Tableau Public בענן, לוחצים על כפתור Share בפינה הימנית התחתונה ומעתיקים את הקישור מתוך שדה Link.", isCorrect: true },
                    { text: "מצלמים את המסך של המחשב בטלפון הנייד ושולחים תמונה בווטסאפ של המרצה.", isCorrect: false },
                    { text: "מייצאים את הפרויקט כקובץ PDF ומדפיסים אותו במזכירות החוג.", isCorrect: false }
                ],
                answered: false
            }
        ],
        currentQuestionIndex: 0
    },

    // Stage 5: Tableau 5-Sheet Builder
    s5: {
        activeMission: 1, // 1: Category Sales, 2: Temporal Trends, 3: Geographic Map, 4: Customer Segment Donut, 5: Profit Scatter Plot
        placedColumns: [],
        placedRows: [],
        fields: {
            'category': { id: 's5-field-cat', name: 'קטגוריית מוצר', type: 'dimension' },
            'date': { id: 's5-field-date', name: 'תאריך רכישה', type: 'dimension' },
            'city': { id: 's5-field-city', name: 'שם_עיר (סניף)', type: 'dimension' },
            'segment': { id: 's5-field-segment', name: 'סוג לקוח (מקטע)', type: 'dimension' },
            'sales': { id: 's5-field-sales', name: 'סה״כ מכירות (ש"ח)', type: 'measure' },
            'qty': { id: 's5-field-qty', name: 'כמות פריטים', type: 'measure' },
            'profit': { id: 's5-field-profit', name: 'רווח עסקה (ש"ח)', type: 'measure' }
        }
    },

    // Stage 6: Dashboard Hierarchy with 5 charts
    s6: {
        placedStrategic: [],
        placedTactical: [],
        placedOperational: [],
        correctStrategic: ['map', 'profit'],  // Strategic receives Israel Map & Profit Scatter Plot
        correctTactical: ['category', 'segment'], // Tactical receives Product Category & Customer Loyalty Segment
        correctOperational: ['time'], // Operational receives Day-to-Day Timeline quantities
    }
};

// Canvas Fireworks Particle System Engine!
let setupFireworksTimer = null;
let setupCanvas = null;
let setupCtx = null;
let setupParticles = [];

function initSetupFireworks() {
    setupCanvas = document.getElementById('setup-fireworks-canvas');
    if (!setupCanvas) return;
    
    setupCtx = setupCanvas.getContext('2d');
    resizeSetupCanvas();
    window.addEventListener('resize', resizeSetupCanvas);
    
    // Mouse click explosion trigger!
    const setupCard = document.getElementById('setup-screen');
    if (setupCard) {
        setupCard.addEventListener('mousedown', (e) => {
            const rect = setupCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            createFireworkExplosion(x, y);
            if (window.AudioEngine) window.AudioEngine.playFireworkBurst();
        });
    }
    
    // Start canvas animation loop
    requestAnimationFrame(animateSetupFireworks);
    
    // Auto launch fireworks at random intervals!
    if (setupFireworksTimer) clearInterval(setupFireworksTimer);
    setupFireworksTimer = setInterval(() => {
        const screen = document.getElementById('setup-screen');
        if (screen && screen.style.display !== 'none') {
            const rx = Math.random() * setupCanvas.width;
            const ry = Math.random() * (setupCanvas.height * 0.5) + (setupCanvas.height * 0.15);
            createFireworkExplosion(rx, ry);
            if (window.AudioEngine) window.AudioEngine.playFireworkBurst();
        }
    }, 1500);
}

function resizeSetupCanvas() {
    if (!setupCanvas) return;
    setupCanvas.width = setupCanvas.parentElement.clientWidth;
    setupCanvas.height = setupCanvas.parentElement.clientHeight;
}

function createFireworkExplosion(x, y) {
    const colors = [
        '#6366f1', // Indigo
        '#0d9488', // Teal
        '#ea580c', // Orange
        '#10b981', // Green
        '#3b82f6', // Blue
        '#8b5cf6'  // Purple
    ];
    
    const particleCount = 40;
    for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4.5 + 1.5;
        setupParticles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 0.5,
            radius: Math.random() * 2.5 + 1.5,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: 1,
            decay: Math.random() * 0.02 + 0.015
        });
    }
}

function animateSetupFireworks() {
    if (!setupCanvas || !setupCtx) return;
    
    const screen = document.getElementById('setup-screen');
    if (screen && screen.style.display === 'none') {
        setupParticles = [];
        return; // End animation loop
    }
    
    setupCtx.clearRect(0, 0, setupCanvas.width, setupCanvas.height);
    
    for (let i = setupParticles.length - 1; i >= 0; i--) {
        const p = setupParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.07; // Gravity
        p.vx *= 0.985; // Air drag
        p.alpha -= p.decay;
        
        if (p.alpha <= 0) {
            setupParticles.splice(i, 1);
            continue;
        }
        
        setupCtx.save();
        setupCtx.globalAlpha = p.alpha;
        setupCtx.beginPath();
        setupCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        setupCtx.fillStyle = p.color;
        
        // Premium glow effect!
        setupCtx.shadowBlur = 10;
        setupCtx.shadowColor = p.color;
        setupCtx.fill();
        setupCtx.restore();
    }
    
    requestAnimationFrame(animateSetupFireworks);
}

// Progressive Wizard Navigation
function goToSetupStep(stepNum) {
    if (window.AudioEngine) window.AudioEngine.playSuccess();
    
    document.querySelectorAll('.setup-step').forEach(step => {
        step.style.display = 'none';
    });
    
    const nextStep = document.getElementById(`setup-step-${stepNum}`);
    if (nextStep) {
        nextStep.style.display = 'block';
    }
    
    // Blast double fireworks on transition!
    if (setupCanvas) {
        createFireworkExplosion(setupCanvas.width * 0.3, setupCanvas.height * 0.35);
        createFireworkExplosion(setupCanvas.width * 0.7, setupCanvas.height * 0.35);
    }
}

// On-page notification banner helper
function showFeedback(stageNum, message, type) {
    const banner = document.getElementById(`s${stageNum}-feedback`);
    if (!banner) return;
    banner.innerText = message;
    banner.className = `feedback-banner ${type}`;
    banner.style.display = 'block';
    banner.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    if (type === 'error') {
        const emojis = ['😭', '🤦‍♂️', '😢', '🥺', '💔', '💥'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        triggerSadEmoji(randomEmoji, 'אוי לא! שגיאה בתהליך 🛑', message);
    }
}

function clearFeedback(stageNum) {
    const banner = document.getElementById(`s${stageNum}-feedback`);
    if (banner) {
        banner.style.display = 'none';
    }
}

// Character setup Functions
function selectAvatar(element, icon, roleTitle, roleDesc) {
    if (window.AudioEngine) window.AudioEngine.playClick();
    
    document.querySelectorAll('.avatar-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    element.classList.add('selected');
    
    state.player.avatar = icon;
    state.player.roleTitle = roleTitle;
    state.player.roleDesc = roleDesc;
    
    // Small splash of fireworks on click!
    const rect = element.getBoundingClientRect();
    const canvasRect = setupCanvas.getBoundingClientRect();
    const ex = (rect.left + rect.width / 2) - canvasRect.left;
    const ey = (rect.top + rect.height / 2) - canvasRect.top;
    createFireworkExplosion(ex, ey);
}

function startGame() {
    const nameInput = document.getElementById('player-name-input').value.trim();
    if (!nameInput) {
        alert("אנא הזן/י את שמך כדי להתחיל בהכשרה! ✍️🌟");
        if (window.AudioEngine) window.AudioEngine.playError();
        return;
    }
    
    state.player.name = nameInput;
    
    document.getElementById('hud-name').innerText = state.player.name;
    document.getElementById('hud-avatar').innerText = state.player.avatar;
    document.getElementById('hud-class').innerText = `דרגה: ${state.player.roleTitle}`;
    
    // Set all stage map nodes to clickable/unlocked UI
    for (let i = 1; i <= 6; i++) {
        const node = document.getElementById(`node-${i}`);
        if (node) {
            node.className = 'map-node';
            const status = document.getElementById(`node-status-${i}`);
            if (status) status.innerText = i === 1 ? "פעיל ⚡" : "זמין 🔓";
        }
    }
    
    if (window.AudioEngine) {
        window.AudioEngine.playLevelUp();
        if (state.isMusicPlaying) {
            window.AudioEngine.startAmbient();
        }
    }
    
    document.getElementById('setup-screen').style.display = 'none';
    document.getElementById('gameplay-area').style.display = 'block';
    
    if (setupFireworksTimer) {
        clearInterval(setupFireworksTimer);
        setupFireworksTimer = null;
    }
    
    initStage1();
}

// Global Navigation
function navigateToStage(stageNum) {
    if (window.AudioEngine) window.AudioEngine.playClick();
    
    const allStages = [1, 2, 3, '3-5', 4, 5, 6];
    allStages.forEach(s => {
        const node = document.getElementById(`node-${s}`);
        if (node) {
            node.classList.remove('active');
            if (s === stageNum) {
                node.classList.add('active');
            }
        }
    });
    
    document.querySelectorAll('.stage-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    const activePanel = document.getElementById(`stage-${stageNum}`);
    if (activePanel) {
        activePanel.classList.add('active');
    }
    
    state.currentStage = stageNum;
    
    // Stop active Pac-Man loop if navigating away
    if (stageNum !== '3-5' && pacmanGameInterval) {
        clearInterval(pacmanGameInterval);
        pacmanGameInterval = null;
    }
    
    if (stageNum === 1) initStage1();
    if (stageNum === 2) initStage2();
    if (stageNum === 3) initStage3();
    if (stageNum === '3-5') initStage3_5();
    if (stageNum === 4) initStage4();
    if (stageNum === 5) initStage5();
    if (stageNum === 6) initStage6();
}


function unlockStage(stageNum) {}

function completeStage(stageNum, xpGained) {
    if (!state.completedStages.includes(stageNum)) {
        state.completedStages.push(stageNum);
        state.player.score += xpGained;
        document.getElementById('hud-score').innerText = `${state.player.score} XP`;
    }
    
    const node = document.getElementById(`node-${stageNum}`);
    if (node) {
        node.classList.add('completed');
        const status = document.getElementById(`node-status-${stageNum}`);
        if (status) status.innerText = "הושלם ✅";
    }
    
    if (window.confetti) {
        window.confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.7 }
        });
    }
    
    if (window.AudioEngine) window.AudioEngine.playSuccess();
}

// Audio Controls
function toggleMusic() {
    state.isMusicPlaying = !state.isMusicPlaying;
    const musicIcon = document.getElementById('music-icon');
    
    if (window.AudioEngine) {
        if (state.isMusicPlaying) {
            window.AudioEngine.isMuted = false;
            window.AudioEngine.startAmbient();
            musicIcon.className = "fa-solid fa-volume-high";
            musicIcon.style.color = "var(--primary)";
        } else {
            window.AudioEngine.stopAmbient();
            musicIcon.className = "fa-solid fa-volume-xmark";
            musicIcon.style.color = "var(--text-muted)";
        }
    }
}

function toggleMuteSFX() {
    state.isSFXEnabled = !state.isSFXEnabled;
    const sfxIcon = document.getElementById('sfx-icon');
    
    if (window.AudioEngine) {
        window.AudioEngine.isMuted = !state.isSFXEnabled;
        if (state.isSFXEnabled) {
            sfxIcon.className = "fa-solid fa-bell";
            sfxIcon.style.color = "var(--primary)";
        } else {
            sfxIcon.className = "fa-solid fa-bell-slash";
            sfxIcon.style.color = "var(--text-muted)";
        }
    }
}

// ================= STAGE 1 LOGIC =================
function initStage1() {
    state.s1.placedKeys = { branch: '', product: '' };
    document.getElementById('slot-branch-val').innerText = '[גרור מפתח כאן]';
    document.getElementById('slot-product-val').innerText = '[גרור מפתח כאן]';
    document.getElementById('s1-verify-btn').disabled = true;
    clearFeedback(1);
}

function allowKeyDrop(ev) {
    ev.preventDefault();
    ev.currentTarget.classList.add('drag-hover');
}

function dragKey(ev, keyVal) {
    ev.dataTransfer.setData("keyVal", keyVal);
    if (window.AudioEngine) window.AudioEngine.playClick();
}

function dropKey(ev, slotType) {
    ev.preventDefault();
    const slot = document.getElementById(`slot-${slotType}`);
    slot.classList.remove('drag-hover');
    const keyVal = ev.dataTransfer.getData("keyVal");
    
    placeKeyInSlot(slotType, keyVal);
}

function clickKeySlot(slotType) {
    let unplacedKey = '';
    const placedVals = Object.values(state.s1.placedKeys);
    if (!placedVals.includes('סניף_מזהה')) unplacedKey = 'סניף_מזהה';
    else if (!placedVals.includes('מוצר_מזהה')) unplacedKey = 'מוצר_מזהה';
    
    if (unplacedKey) {
        placeKeyInSlot(slotType, unplacedKey);
    }
}

function placeKeyInSlot(slotType, keyVal) {
    clearFeedback(1);
    
    if (slotType === 'branch') {
        if (keyVal.includes('סניף')) {
            state.s1.placedKeys.branch = 'סניף_מזהה';
            document.getElementById('slot-branch-val').innerText = 'סניף_מזהה (FK) ✅';
            if (window.AudioEngine) window.AudioEngine.playSuccess();
            showFeedback(1, "חיבור סניפים בוצע כהלכה! שדה 'סניף_מזהה' מקשר בין המכירות לסניף תל-אביב, חיפה או ירושלים.", "success");
        } else {
            if (window.AudioEngine) window.AudioEngine.playError();
            showFeedback(1, "מפתח לא מתאים! טבלת הסניפים מוגדרת עם סניף_מזהה כמפתח ראשי (PK) ולכן המכירות חייבות להתקשר אליה רק דרך מפתח זה.", "error");
        }
    } else if (slotType === 'product') {
        if (keyVal.includes('מוצר')) {
            state.s1.placedKeys.product = 'מוצר_מזהה';
            document.getElementById('slot-product-val').innerText = 'מוצר_מזהה (FK) ✅';
            if (window.AudioEngine) window.AudioEngine.playSuccess();
            showFeedback(1, "חיבור מוצרים בוצע כהלכה! שדה 'מוצר_מזהה' יאפשר לדעת מה הקטגוריה והמחיר של כל פריט שנמכר.", "success");
        } else {
            if (window.AudioEngine) window.AudioEngine.playError();
            showFeedback(1, "מפתח לא מתאים! טבלת המוצרים מוגדרת עם מוצר_מזהה כמפתח ראשי (PK).", "error");
        }
    }
    
    if (state.s1.placedKeys.branch === 'סניף_מזהה' && state.s1.placedKeys.product === 'מוצר_מזהה') {
        document.getElementById('s1-verify-btn').disabled = false;
        showFeedback(1, "מצוין! סכמת בסיס הנתונים הוגדרה במלואה. כעת תוכל לאמת את הסכמה ולעבור לשלב ניקוי הדאשבורדים.", "success");
    }
}

function verifyStage1() {
    completeStage(1, 150);
    navigateToStage(2);
}

// ================= STAGE 2 LOGIC =================
function initStage2() {
    const corruptedTbody = document.getElementById('s2-corrupted-table-body');
    const cleanTbody = document.getElementById('s2-clean-table-body');
    
    corruptedTbody.innerHTML = '';
    cleanTbody.innerHTML = '';
    
    state.s2.purifiedIds = [];
    document.getElementById('s2-verify-btn').disabled = true;
    clearFeedback(2);
    
    state.s2.corruptedData.forEach(row => {
        const tr = document.createElement('tr');
        tr.id = `s2-row-${row.id}`;
        tr.className = 'clickable-row';
        tr.onclick = () => selectRowStage2(row.id);
        
        tr.innerHTML = `
            <td>${row.id}</td>
            <td>${row.date}</td>
            <td>${row.branch_id}</td>
            <td>${row.prod_id}</td>
            <td>${row.qty}</td>
            <td>${row.total}</td>
            <td>${row.segment}</td>
            <td>${row.profit}</td>
        `;
        corruptedTbody.appendChild(tr);
    });
}

function selectRowStage2(id) {
    const row = state.s2.corruptedData.find(r => r.id === id);
    const rowElement = document.getElementById(`s2-row-${id}`);
    
    if (!row) return;
    clearFeedback(2);
    
    if (state.s2.purifiedIds.includes(id)) {
        state.s2.purifiedIds = state.s2.purifiedIds.filter(pid => pid !== id);
        rowElement.className = 'clickable-row';
        
        const cleanRow = document.getElementById(`s2-clean-row-${id}`);
        if (cleanRow) cleanRow.remove();
        
        if (window.AudioEngine) window.AudioEngine.playClick();
    } else {
        state.s2.purifiedIds.push(id);
        
        if (row.isCorrupted) {
            rowElement.className = 'clickable-row row-purified';
            
            const cleanTbody = document.getElementById('s2-clean-table-body');
            const cleanTr = document.createElement('tr');
            cleanTr.id = `s2-clean-row-${id}`;
            
            let cleanDate = row.date;
            let cleanBranchId = row.branch_id;
            let cleanProdId = row.prod_id;
            let cleanQty = row.qty;
            let cleanTotal = row.total;
            let cleanProfit = row.profit;
            
            if (row.errorType.includes("לא קיים מוצר 999")) cleanProdId = 101; 
            if (row.errorType.includes("לא קיים סניף 99")) cleanBranchId = 1;
            if (row.errorType.includes("מחיר ורווח שליליים")) { cleanTotal = 55; cleanProfit = 11; } 
            if (row.errorType.includes("תאריך עתידי")) cleanDate = "2026-05-04"; 
            if (row.errorType.includes("כמות קטועה")) cleanQty = 5; 
            if (row.errorType.includes("רווח גבוה מסך התשלום")) cleanProfit = 180;
            
            cleanTr.innerHTML = `
                <td>${row.id}</td>
                <td>${cleanDate}</td>
                <td>${cleanBranchId}</td>
                <td>${cleanProdId}</td>
                <td>${cleanQty}</td>
                <td>${cleanTotal}</td>
                <td>${row.segment}</td>
                <td>${cleanProfit}</td>
            `;
            cleanTbody.appendChild(cleanTr);
            
            if (window.AudioEngine) window.AudioEngine.playSuccess();
            showFeedback(2, `טוהר! שורה ${row.id} תוקנה. סוג השגיאה שזוהה: ${row.errorType}`, "success");
        } else {
            rowElement.className = 'clickable-row row-error';
            if (window.AudioEngine) window.AudioEngine.playError();
            
            showFeedback(2, `נתון תקין לחלוטין! עסקה ${row.id} עומדת בכל חוקי שלמות הנתונים וההיגיון הבריא.`, "error");
            
            setTimeout(() => {
                if (!state.s2.purifiedIds.includes(id)) return;
                state.s2.purifiedIds = state.s2.purifiedIds.filter(pid => pid !== id);
                rowElement.className = 'clickable-row';
                updateS2VerifyButton();
            }, 1500);
        }
    }
    
    updateS2VerifyButton();
}

function updateS2VerifyButton() {
    const verifyBtn = document.getElementById('s2-verify-btn');
    const corruptedCount = state.s2.corruptedData.filter(r => r.isCorrupted).length;
    const selectedCorrectCount = state.s2.purifiedIds.filter(id => {
        const row = state.s2.corruptedData.find(r => r.id === id);
        return row && row.isCorrupted;
    }).length;
    
    const selectedIncorrectCount = state.s2.purifiedIds.filter(id => {
        const row = state.s2.corruptedData.find(r => r.id === id);
        return row && !row.isCorrupted;
    }).length;
    
    if (selectedCorrectCount === corruptedCount && selectedIncorrectCount === 0) {
        verifyBtn.disabled = false;
        showFeedback(2, "כל הכבוד! סיננת את כל שורות הדאטה הרובוטי המשובש. כעת תוכל לאמת נאותות ולהמשיך הלאה.", "success");
    } else {
        verifyBtn.disabled = true;
    }
}

function verifyStage2() {
    completeStage(2, 150);
    navigateToStage(3);
}

// ================= STAGE 3 LOGIC =================
function initStage3() {
    const blocksPool = document.getElementById('s3-blocks-pool');
    blocksPool.innerHTML = '';
    
    state.s3.selectedBlocks = [];
    document.getElementById('s3-prompt-preview').innerText = "לחץ על הבלוקים בצד ימין כדי להרכיב את הפרומפט...";
    document.getElementById('s3-console-area').style.display = 'none';
    document.getElementById('s3-next-action').style.display = 'none';
    clearFeedback(3);
    
    state.s3.blocks.forEach(block => {
        const div = document.createElement('div');
        div.className = 'prompt-block';
        div.id = `s3-block-${block.id}`;
        div.onclick = () => togglePromptBlockV3(block.id);
        
        div.innerHTML = `
            <div class="block-tag">${block.tag}</div>
            <div class="block-text">${block.text}</div>
            <div class="block-check"><i class="fa-solid fa-circle-check"></i></div>
        `;
        blocksPool.appendChild(div);
    });
}

function togglePromptBlockV3(id) {
    const block = state.s3.blocks.find(b => b.id === id);
    const div = document.getElementById(`s3-block-${id}`);
    if (!block) return;
    clearFeedback(3);
    
    if (window.AudioEngine) window.AudioEngine.playClick();
    
    if (state.s3.selectedBlocks.includes(id)) {
        state.s3.selectedBlocks = state.s3.selectedBlocks.filter(bid => bid !== id);
        div.classList.remove('selected');
    } else {
        state.s3.selectedBlocks.push(id);
        div.classList.add('selected');
    }
    
    updatePromptPreviewV3();
}

function updatePromptPreviewV3() {
    const previewBox = document.getElementById('s3-prompt-preview');
    
    if (state.s3.selectedBlocks.length === 0) {
        previewBox.innerText = "לחץ על הבלוקים בצד ימין כדי להרכיב את הפרומפט...";
        return;
    }
    
    const sortedSelected = state.s3.blocks
        .filter(b => state.s3.selectedBlocks.includes(b.id))
        .map(b => b.text);
        
    previewBox.innerText = sortedSelected.join('\n\n');
}

function runPromptSynthesisV2() {
    const consoleArea = document.getElementById('s3-console-area');
    const consoleOutput = document.getElementById('s3-console-output');
    const downloadContainer = document.getElementById('s3-download-container');
    
    consoleArea.style.display = 'block';
    consoleOutput.innerText = '';
    downloadContainer.style.display = 'none';
    clearFeedback(3);
    
    const hasRole = state.s3.selectedBlocks.includes('role');
    const hasContext = state.s3.selectedBlocks.includes('context');
    const hasCols = state.s3.selectedBlocks.includes('cols');
    const hasFk = state.s3.selectedBlocks.includes('fk-rules');
    const hasIntegrity = state.s3.selectedBlocks.includes('integrity');
    const hasFileOutput = state.s3.selectedBlocks.includes('file-output');
    
    const hasDistractorMp3 = state.s3.selectedBlocks.includes('distractor_mp3');
    const hasDistractorGif = state.s3.selectedBlocks.includes('distractor_gif');
    const hasDistractorText = state.s3.selectedBlocks.includes('distractor_text');
    const hasDistractorSpace = state.s3.selectedBlocks.includes('distractor_space');
    const hasDistractorPython = state.s3.selectedBlocks.includes('distractor_python');
    const hasDistractorDots = state.s3.selectedBlocks.includes('distractor_dots');
    
    const hasAnyDistractor = hasDistractorMp3 || hasDistractorGif || hasDistractorText || hasDistractorSpace || hasDistractorPython || hasDistractorDots;
    const requiredCount = [hasRole, hasContext, hasCols, hasFk, hasIntegrity, hasFileOutput].filter(Boolean).length;
    
    if (hasAnyDistractor) {
        let distractorExplanation = "";
        if (hasDistractorMp3) distractorExplanation += "• מסיח קול 🎵: בינה מלאכותית לא יכולה לייצר נתונים כקובץ מוזיקה, וגם Tableau לא יודע לקרוא תווים מוזיקליים!\n";
        if (hasDistractorGif) distractorExplanation += "• מסיח ויזואלי 🐒: קובץ תמונה מונפש GIF של קופים רוקדים הוא חמוד, אבל לא נותן שום טבלת נתונים לחישובים!\n";
        if (hasDistractorText) distractorExplanation += "• מסיח מילולי 📝: כתיבת הנתונים כסיפור מילולי ארוך ללא פסיקים תכשיל לגמרי את ה-JOIN ואת טעינת הנתונים ב-Tableau!\n";
        if (hasDistractorSpace) distractorExplanation += "• מסיח חלל 🪐: סניפים במאדים או מחוז שביל החלב עדיין לא קיימים אצלנו ברשת... זהו מפתח שבור המפר את נאותות המערכת!\n";
        if (hasDistractorPython) distractorExplanation += "• מסיח קוד פייתון 🐍: לכתוב Hello World זה מקסים, אבל זה מתעלם לחלוטין מנתוני המכירות שכל כך נחוצים לפרויקט!\n";
        if (hasDistractorDots) distractorExplanation += "• מסיח קיטועים 💬: להשתמש בשלוש נקודות (...) מקטיע את הנתונים ומשאיר אותנו עם טבלה חסרה שלא ניתנת לניתוח!\n";
        
        if (window.AudioEngine) window.AudioEngine.playError();
        showFeedback(3, "אופס! מזהה מסיח/ים מבלבל/ים או שבור/ים בפרומפט שלך שעלולים להרוס את איכות הנתונים. אנא הסר אותם ונסה שוב! 🛑", "error");
        simulateTerminalType(`[ERROR] בדיקת נאותות שלמות דאטה סינתטי נכשלה! 🛑
נמצאו מסיחים או סתירות קשות בפרומפט שלך:

${distractorExplanation}
אנא הסר/י את הבלוקים המשובשים הללו ונסה/י שוב!`, null);
        return;
    }
    
    if (requiredCount < 6) {
        if (window.AudioEngine) window.AudioEngine.playError();
        showFeedback(3, `אוי! חסרים רכיבים חיוניים בפרומפט שלך (${requiredCount}/6). אנא בחר/י את כל 6 הבלוקים החיוניים.`, "error");
        simulateTerminalType(`[WARNING] בדיקת רכיבים חסרים נכשלה (${requiredCount}/6)!
הפרומפט שלך חסר הנחיות חיוניות!
ללא הגדרת תפקיד, הקשר עסקי, מפתחות זרים (FK), כללי היגיון בריא, או דרישה מפורשת לייצוא קובץ CSV פיזי בתיבת קוד - ה-AI עלול לפלוט נתונים שבורים, שליליים או חלקיים שלא יתחברו ב-Tableau.

אנא בחר/י את כל 6 הבלוקים החיוניים בצד ימין (הבלוקים הירוקים והכחולים התקינים) ונסה/י שוב!`, null);
        return;
    }
    
    if (window.AudioEngine) window.AudioEngine.playLevelUp();
    showFeedback(3, "פרומפט מושלם וחכם! 🧙‍♂️ סינתזת ה-AI החלה בהצלחה לייצור קובץ CSV פיזי.", "success");
    
    const mockMultiCSV = `\`\`\`csv
עסקה_מזהה,תאריך_רכישה,סניף_מזהה,שם_עיר,מחוז,מוצר_מזהה,שם_מוצר,קטגוריה,כמות_פריטים,סה״כ_לתשלום,סוג_לקוח,רווח_עסקה
2001,2026-05-01,1,תל אביב,מרכז,101,סמארטפון,אלקטרוניקה,2,3000.00,חבר מועדון,600.00
2002,2026-05-02,2,חיפה,צפון,103,אוזניות אלחוטיות,אלקטרוניקה,1,90.00,מזדמן,18.00
2003,2026-05-03,1,תל אביב,מרכז,102,מחשב נייד,אלקטרוניקה,3,165.00,חבר מועדון,33.00
2004,2026-05-04,3,ירושלים,ירושלים,103,אוזניות אלחוטיות,אלקטרוניקה,1,90.00,מזדמן,18.00
2005,2026-05-05,2,חיפה,צפון,101,סמארטפון,אלקטרוניקה,1,1500.00,חבר מועדון,300.00
2006,2026-05-06,1,תל אביב,מרכז,103,אוזניות אלחוטיות,אלקטרוניקה,4,360.00,מזדמן,72.00
2007,2026-05-07,3,ירושלים,ירושלים,102,מחשב נייד,אלקטרוניקה,2,110.00,חבר מועדון,22.00
2008,2026-05-08,2,חיפה,צפון,101,סמארטפון,אלקטרוניקה,1,1500.00,חבר מועדון,300.00
2009,2026-05-09,1,תל אביב,מרכז,102,מחשב נייד,אלקטרוניקה,1,55.00,חבר מועדון,11.00
2010,2026-05-10,3,ירושלים,ירושלים,103,אוזניות אלחוטיות,אלקטרוניקה,2,180.00,מזדמן,36.00
\`\`\`

[SUCCESS] נאותות נתונים מלאה: 10/10 שורות תואמות סכמה נוצרו בתוך קוד CSV נקי.
מקטעי לקוחות ורווחי עלויות חושבו כהלכה ב-100% נאותות.
הקובץ מוכן להורדה פיזית למחשב ולייבוא ישיר ל-Tableau Public! 💾`;
    
    simulateTerminalType(mockMultiCSV, () => {
        downloadContainer.style.display = 'block';
        document.getElementById('s3-next-action').style.display = 'inline-block';
        showFeedback(3, "הסימולציה הסתיימה! 🎉 לחץ על הכפתור הירוק למטה כדי להוריד את קובץ ה-CSV המדומה למחשב שלך, ולאחר מכן לחץ על 'עבור לפלטפורמות'.", "success");
    });
}

function simulateTerminalType(text, callback) {
    const consoleOutput = document.getElementById('s3-console-output');
    if (!consoleOutput) return;
    
    consoleOutput.innerText = '';
    let i = 0;
    
    consoleOutput.classList.remove('cursor-blink');
    
    const interval = setInterval(() => {
        if (i < text.length) {
            consoleOutput.innerText += text.charAt(i);
            i++;
            if (i % 4 === 0 && window.AudioEngine && state.isSFXEnabled) {
                window.AudioEngine.playClick();
            }
            consoleOutput.scrollTop = consoleOutput.scrollHeight;
        } else {
            clearInterval(interval);
            consoleOutput.classList.add('cursor-blink');
            if (callback) callback();
        }
    }, 12);
}

function completeStage3() {
    completeStage(3, 200);
    navigateToStage('3-5');
}

function simulateCSVDownload() {
    const csvContent = `עסקה_מזהה,תאריך_רכישה,סניף_מזהה,שם_עיר,מחוז,מוצר_מזהה,שם_מוצר,קטגוריה,כמות_פריטים,סה״כ_לתשלום,סוג_לקוח,רווח_עסקה
2001,2026-05-01,1,תל אביב,מרכז,101,סמארטפון,אלקטרוניקה,2,3000.00,חבר מועדון,600.00
2002,2026-05-02,2,חיפה,צפון,103,אוזניות אלחוטיות,אלקטרוניקה,1,90.00,מזדמן,18.00
2003,2026-05-03,1,תל אביב,מרכז,102,מחשב נייד,אלקטרוניקה,3,165.00,חבר מועדון,33.00
2004,2026-05-04,3,ירושלים,ירושלים,103,אוזניות אלחוטיות,אלקטרוניקה,1,90.00,מזדמן,18.00
2005,2026-05-05,2,חיפה,צפון,101,סמארטפון,אלקטרוניקה,1,1500.00,חבר מועדון,300.00
2006,2026-05-06,1,תל אביב,מרכז,103,אוזניות אלחוטיות,אלקטרוניקה,4,360.00,מזדמן,72.00
2007,2026-05-07,3,ירושלים,ירושלים,102,מחשב נייד,אלקטרוניקה,2,110.00,חבר מועדון,22.00
2008,2026-05-08,2,חיפה,צפון,101,סמארטפון,אלקטרוניקה,1,1500.00,חבר מועדון,300.00
2009,2026-05-09,1,תל אביב,מרכז,102,מחשב נייד,אלקטרוניקה,1,55.00,חבר מועדון,11.00
2010,2026-05-10,3,ירושלים,ירושלים,103,אוזניות אלחוטיות,אלקטרוניקה,2,180.00,מזדמן,36.00`;

    // UTF-8 BOM to support Hebrew perfectly in Microsoft Excel and Tableau!
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "sales_data.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    if (window.AudioEngine) window.AudioEngine.playSuccess();
    showFeedback(3, "קובץ sales_data.csv הורד בהצלחה למחשב שלך! 💾 הסטודנטים יכולים כעת לייבא אותו ישירות ל-Tableau Public כקובץ טקסט (Text file).", "success");
}

// ================= STAGE 4 LOGIC =================
function initStage4() {
    state.s4.currentQuestionIndex = 0;
    state.s4.questions.forEach(q => q.answered = false);
    clearFeedback(4);
    renderStage4Quiz();
}

function renderStage4Quiz() {
    const qWrapper = document.getElementById('s4-quiz-wrapper');
    const currentQ = state.s4.questions[state.s4.currentQuestionIndex];
    
    if (!currentQ) {
        completeStage(4, 200);
        
        qWrapper.innerHTML = `
            <div style="text-align: center; padding: 16px;">
                <h3 style="color: var(--success); margin-bottom: 12px;"><i class="fa-solid fa-circle-check"></i> כל הכבוד! עברת את חידון הטקטיקה.</h3>
                <p style="color: var(--text-muted); margin-bottom: 24px;">אתה מכיר את סוגי החיבורים ויציקת נתוני ה-CSV והאקסל לתוך Tableau. לחץ להמשך בניית התרשימים בשלב 5!</p>
                <button class="cyber-button success" onclick="navigateToStage(5)">המשך לשלב 5 <i class="fa-solid fa-angle-left"></i></button>
            </div>
        `;
        return;
    }
    
    qWrapper.innerHTML = `
        <div class="quiz-question">
            <span style="color: var(--primary); font-family: var(--font-code);">[שאלה ${currentQ.id} מתוך ${state.s4.questions.length}]</span>
            <br>${currentQ.q}
        </div>
        <div class="quiz-options">
            ${currentQ.options.map((opt, index) => `
                <button class="quiz-option" id="s4-opt-${index}" onclick="answerStage4Quiz(${index})">
                    <span>${opt.text}</span>
                    <i class="fa-solid fa-angle-left" id="s4-opt-icon-${index}"></i>
                </button>
            `).join('')}
        </div>
    `;
}

function answerStage4Quiz(optIndex) {
    const currentQ = state.s4.questions[state.s4.currentQuestionIndex];
    if (currentQ.answered) return;
    
    currentQ.answered = true;
    const selectedOpt = currentQ.options[optIndex];
    const button = document.getElementById(`s4-opt-${optIndex}`);
    const icon = document.getElementById(`s4-opt-icon-${optIndex}`);
    
    clearFeedback(4);
    
    if (selectedOpt.isCorrect) {
        button.classList.add('correct');
        icon.className = "fa-solid fa-check";
        
        if (window.AudioEngine) window.AudioEngine.playSuccess();
        showFeedback(4, "תשובה נכונה! כל הכבוד.", "success");
        
        setTimeout(() => {
            state.s4.currentQuestionIndex++;
            renderStage4Quiz();
        }, 1500);
    } else {
        button.classList.add('wrong');
        icon.className = "fa-solid fa-xmark";
        
        if (window.AudioEngine) window.AudioEngine.playError();
        showFeedback(4, "תשובה שגויה. קרא/י את המדריך החזותי למעלה ונסה/י שוב!", "error");
        
        setTimeout(() => {
            currentQ.answered = false;
            renderStage4Quiz();
        }, 1800);
    }
}

// ================= STAGE 5 LOGIC (5 WORKSHEETS) =================
function initStage5() {
    state.s5.activeMission = 1;
    state.s5.placedColumns = [];
    state.s5.placedRows = [];
    clearFeedback(5);
    renderStage5Workbench();
}

function renderStage5Workbench() {
    const missionDesc = document.getElementById('s5-mission-desc');
    const sheetTitle = document.getElementById('s5-sheet-active-title');
    
    if (state.s5.activeMission === 1) {
        sheetTitle.innerText = "ACTIVE_SHEET: Category_Sales_Bar";
        missionDesc.innerHTML = `
            <strong>📊 משימה א': פילוח מכירות לפי קטגוריית מוצר</strong>
            <br>
            <strong>למה צריך את התרשים:</strong> מנהלי הארגון צריכים לדעת היכן מרוכזות רוב המכירות כדי להקצות תקציבים שיווקיים בהתאם.
            <br><br>
            <strong>הנחיית בנייה:</strong> 
            גרור/י את השדה <strong>"קטגוריית מוצר" (Dimension כחול)</strong> אל מדף **עמודות (Columns)**, 
            ואת השדה <strong>"סה״כ מכירות (ש"ח)" (Measure ירוק)</strong> אל מדף **שורות (Rows)**.
        `;
    } else if (state.s5.activeMission === 2) {
        sheetTitle.innerText = "ACTIVE_SHEET: Purchases_Timeline_Line";
        missionDesc.innerHTML = `
            <strong>📈 משימה ב': מעקב עונתיות ומגמות לאורך זמן</strong>
            <br>
            <strong>למה צריך את התרשים:</strong> לוגיסטיקאים ומנהלי סניפים צריכים לחשוף עליות וירידות רכישה שבועיות לתכנון רכש ומלאי תקין.
            <br><br>
            <strong>הנחיית בנייה:</strong>
            גרור/י את השדה <strong>"תאריך רכישה" (Dimension כחול)</strong> אל מדף **עמודות (Columns)**,
            ואת השדה <strong>"כמות פריטים" (Measure ירוק)</strong> אל מדף **שורות (Rows)**.
        `;
    } else if (state.s5.activeMission === 3) {
        sheetTitle.innerText = "ACTIVE_SHEET: National_Branches_Map";
        missionDesc.innerHTML = `
            <strong>🗺️ משימה ג': מפת ביצועים ופיזור גיאוגרפי</strong>
            <br>
            <strong>למה צריך את התרשים:</strong> ההנהלה הבכירה והמנכ\"ל צריכים תמונה גיאוגרפית רחבה של רווחי הסניפים לקביעת מיקומי פריסה חדשים.
            <br><br>
            <strong>הנחיית בנייה:</strong>
            גרור/י את השדה <strong>"שם_עיר (סניף)" (Dimension כחול)</strong> אל מדף **עמודות (Columns)**,
            ואת השדה <strong>"סה״כ מכירות (ש"ח)" (Measure ירוק)</strong> אל מדף **שורות (Rows)**.
        `;
    } else if (state.s5.activeMission === 4) {
        sheetTitle.innerText = "ACTIVE_SHEET: Customer_Segment_Donut";
        missionDesc.innerHTML = `
            <strong>🍩 משימה ד': פילוח מכירות לפי סוג לקוח (חברי מועדון)</strong>
            <br>
            <strong>למה צריך את התרשים:</strong> מחלקת השיווק צריכה לדעת האם מועדון הלקוחות אכן מצדיק את ההטבות הניתנות בו, והאם הוא מייצר את מירב המכירות.
            <br><br>
            <strong>הנחיית בנייה:</strong>
            גרור/י את השדה <strong>"סוג לקוח (מקטע)" (Dimension כחול)</strong> אל מדף **עמודות (Columns)**,
            ואת השדה <strong>"סה״כ מכירות (ש"ח)" (Measure ירוק)</strong> אל מדף **שורות (Rows)**.
        `;
    } else if (state.s5.activeMission === 5) {
        sheetTitle.innerText = "ACTIVE_SHEET: Price_vs_Profit_Scatter";
        missionDesc.innerHTML = `
            <strong>🎯 משימה ה': ניתוח שולי רווח ועמידה בעלויות (Scatter Plot)</strong>
            <br>
            <strong>למה צריך את התרשים:</strong> דרג אסטרטגי ופיננסי בוחן את היחס בין מחיר המכירה הסופי לרווח שהופק בפועל מכל עסקה כדי לאתר חריגות ומוצרים בעלי רווחיות על.
            <br><br>
            <strong>הנחיית בנייה:</strong>
            גרור/י את המדד <strong>"סה״כ מכירות (ש"ח)" (Measure ירוק)</strong> אל מדף **עמודות (Columns)**,
            ואת המדד השני <strong>"רווח עסקה (ש"ח)" (Measure ירוק)</strong> אל מדף **שורות (Rows)**.
        `;
    }
    
    document.getElementById('s5-shelf-items-columns').innerHTML = '';
    document.getElementById('s5-shelf-items-rows').innerHTML = '';
    
    state.s5.placedColumns.forEach(key => renderPlacedFieldV2(key, 'columns'));
    state.s5.placedRows.forEach(key => renderPlacedFieldV2(key, 'rows'));
    
    checkStage5State();
}

function allowFieldDropV2(ev) {
    ev.preventDefault();
    ev.currentTarget.classList.add('drag-hover');
}

function dragFieldV2(ev, key) {
    ev.dataTransfer.setData("fieldKey", key);
    if (window.AudioEngine) window.AudioEngine.playClick();
}

function dropFieldV2(ev, shelfId) {
    ev.preventDefault();
    const shelf = document.getElementById(`s5-shelf-${shelfId}`);
    shelf.classList.remove('drag-hover');
    
    const key = ev.dataTransfer.getData("fieldKey");
    if (!key || !state.s5.fields[key]) return;
    
    placeFieldOnShelfV2(key, shelfId);
}

function clickShelfV2(shelfId) {
    const keys = Object.keys(state.s5.fields);
    const unplacedKey = keys.find(k => !state.s5.placedColumns.includes(k) && !state.s5.placedRows.includes(k));
    
    if (unplacedKey) {
        placeFieldOnShelfV2(unplacedKey, shelfId);
    }
}

function placeFieldOnShelfV2(key, shelfId) {
    clearFeedback(5);
    
    state.s5.placedColumns = state.s5.placedColumns.filter(k => k !== key);
    state.s5.placedRows = state.s5.placedRows.filter(k => k !== key);
    
    if (shelfId === 'columns') {
        state.s5.placedColumns = [key];
    } else {
        state.s5.placedRows = [key];
    }
    
    if (window.AudioEngine) window.AudioEngine.playClick();
    renderStage5Workbench();
}

function removeFieldV2(key) {
    clearFeedback(5);
    state.s5.placedColumns = state.s5.placedColumns.filter(k => k !== key);
    state.s5.placedRows = state.s5.placedRows.filter(k => k !== key);
    
    if (window.AudioEngine) window.AudioEngine.playClick();
    renderStage5Workbench();
}

function renderPlacedFieldV2(key, shelfId) {
    const field = state.s5.fields[key];
    const container = document.getElementById(`s5-shelf-items-${shelfId}`);
    
    const div = document.createElement('div');
    div.className = `placed-field ${field.type}`;
    div.innerHTML = `
        <span>${field.name}</span>
        <span class="placed-field-remove" onclick="removeFieldV2('${key}'); event.stopPropagation();">&times;</span>
    `;
    container.appendChild(div);
}

function checkStage5State() {
    const placeholder = document.getElementById('s5-viz-placeholder');
    const container = document.getElementById('s5-viz-container');
    const svgPlaceholder = document.getElementById('s5-viz-svg-placeholder');
    const explanation = document.getElementById('s5-viz-explanation');
    const chartTitle = document.getElementById('s5-viz-chart-title');
    const actionPanel = document.getElementById('s5-action-panel');
    
    placeholder.style.display = 'flex';
    container.classList.remove('active');
    actionPanel.innerHTML = '';
    
    const cols = state.s5.placedColumns;
    const rows = state.s5.placedRows;
    
    if (state.s5.activeMission === 1) {
        if (cols.includes('category') && rows.includes('sales')) {
            placeholder.style.display = 'none';
            container.classList.add('active');
            
            chartTitle.innerText = "סה\"כ מכירות לפי קטגוריית מוצר";
            svgPlaceholder.innerHTML = generateSVGBarChart();
            
            explanation.innerHTML = `
                <strong style="color: var(--primary);"><i class="fa-solid fa-circle-check"></i> תובנה עסקית (רווחיות קטגוריות):</strong>
                <br>
                מעולה! תרשים העמודות מציג פער עצום של מכירות **אלקטרוניקה** (6,000 ש"ח) לעומת ביגוד ומזון. 
                מנהל מחלקה יסיק מכך כי אלקטרוניקה היא מנוע ההכנסות הראשי של הרשת ויתקצב שיווק בהתאם.
            `;
            
            showFeedback(5, "משימה א' הושלמה! תרשים העמודות נבנה בהצלחה.", "success");
            actionPanel.innerHTML = `
                <button class="cyber-button success" onclick="startStage5Mission2()"><i class="fa-solid fa-arrow-left"></i> משימה א' הושלמה! עבור למשימה ב'</button>
            `;
            
            if (window.AudioEngine) window.AudioEngine.playSuccess();
        }
    } else if (state.s5.activeMission === 2) {
        if (cols.includes('date') && rows.includes('qty')) {
            placeholder.style.display = 'none';
            container.classList.add('active');
            
            chartTitle.innerText = "מגמות כמות פריטים שנרכשו לאורך זמן";
            svgPlaceholder.innerHTML = generateSVGLineChart();
            
            explanation.innerHTML = `
                <strong style="color: var(--secondary);"><i class="fa-solid fa-circle-check"></i> תובנה עסקית (עונתיות):</strong>
                <br>
                עבודה נפלאה! קו המגמה מעלה קפיצת ביקוש ברורה בסופי השבוע. מנהל תפעול השטח יסיק מכך כי חובה לתגבר קופות, להערך עם מלאי טרי בחמישי בערב ולהתאים משמרות עובדים.
            `;
            
            showFeedback(5, "משימה ב' הושלמה! תרשים קו המגמה נבנה בהצלחה.", "success");
            actionPanel.innerHTML = `
                <button class="cyber-button success" onclick="startStage5Mission3()"><i class="fa-solid fa-arrow-left"></i> משימה ב' הושלמה! עבור למשימה ג'</button>
            `;
            
            if (window.AudioEngine) window.AudioEngine.playSuccess();
        }
    } else if (state.s5.activeMission === 3) {
        if (cols.includes('city') && rows.includes('sales')) {
            placeholder.style.display = 'none';
            container.classList.add('active');
            
            chartTitle.innerText = "ביצועי מכירות בפריסה גיאוגרפית (ישראל)";
            svgPlaceholder.innerHTML = generateSVGMapChart();
            
            explanation.innerHTML = `
                <strong style="color: var(--accent);"><i class="fa-solid fa-circle-check"></i> תובנה עסקית (אסטרטגיה גיאוגרפית):</strong>
                <br>
                מצוין! מפת הבועות מציגה פריסה גיאוגרפית של הסניפים בארץ. מנכ"ל הרשת (CEO) מזהה מיד כי סניף תל אביב מוביל, ומחליט אסטרטגית האם לפתוח סניף חדש במרכז או לתקצב סניפי מחוז צפוני/דרומי להתרחבות.
            `;
            
            showFeedback(5, "משימה ג' הושלמה! מפת בועות הפריסה הגיאוגרפית של ישראל נבנתה כהלכה.", "success");
            actionPanel.innerHTML = `
                <button class="cyber-button success" onclick="startStage5Mission4()"><i class="fa-solid fa-arrow-left"></i> משימה ג' הושלמה! עבור למשימה ד'</button>
            `;
            
            if (window.AudioEngine) window.AudioEngine.playSuccess();
        }
    } else if (state.s5.activeMission === 4) {
        if (cols.includes('segment') && rows.includes('sales')) {
            placeholder.style.display = 'none';
            container.classList.add('active');
            
            chartTitle.innerText = "פילוח מכירות לפי סוג לקוח (חברי מועדון מול מזדמנים)";
            svgPlaceholder.innerHTML = generateSVGDonutChart();
            
            explanation.innerHTML = `
                <strong style="color: var(--info);"><i class="fa-solid fa-circle-check"></i> תובנה עסקית (סוגי לקוחות):</strong>
                <br>
                פנטסטי! תרשים הדונאט מוכיח כי **70% מהמכירות** (7,200 ש"ח) מבוצעות על ידי חברי מועדון, ורק 30% על ידי לקוחות מזדמנים.
                מנהלי שיווק (CMO) מסיקים מכך כי מועדון הלקוחות הוא ליבת ההצלחה ויש להרחיב את הצעות הערך וההטבות כדי לשמר אותם.
            `;
            
            showFeedback(5, "משימה ד' הושלמה! תרשים הדונאט של סוגי הלקוחות נבנה בהצלחה.", "success");
            actionPanel.innerHTML = `
                <button class="cyber-button success" onclick="startStage5Mission5()"><i class="fa-solid fa-arrow-left"></i> משימה ד' הושלמה! עבור למשימה ה'</button>
            `;
            
            if (window.AudioEngine) window.AudioEngine.playSuccess();
        }
    } else if (state.s5.activeMission === 5) {
        // Price vs Profit Scatter: cols has 'sales', rows has 'profit'
        if (cols.includes('sales') && rows.includes('profit')) {
            placeholder.style.display = 'none';
            container.classList.add('active');
            
            chartTitle.innerText = "עלות מכירה מול רווח עסקה בפועל (Scatter Plot)";
            svgPlaceholder.innerHTML = generateSVGScatterChart();
            
            explanation.innerHTML = `
                <strong style="color: var(--warning);"><i class="fa-solid fa-circle-check"></i> תובנה עסקית (שולי רווח):</strong>
                <br>
                מדהים! תרשים הפיזור (Scatter Plot) מציג את פיזור העסקאות לפי גובה ההכנסה (ציר X) והרווח (ציר Y).
                ניתן לראות יחס ישר, אך עסקאות האלקטרוניקה (סניף תל אביב) בולטות ברווח גבוה ביותר של 600 ש"ח.
                מנהל כספים (CFO) מזהה שולי רווח קבועים של 20% ומחפש עסקאות חריגות (Outliers) למיקסום רווחים.
            `;
            
            showFeedback(5, "משימה ה' הושלמה! תרשים הפיזור של שולי הרווח נבנה בהצלחה.", "success");
            actionPanel.innerHTML = `
                <button class="cyber-button success" onclick="completeStage5()">כל 5 התרשימים מוכנים! עבור לבניית דאשבורדים <i class="fa-solid fa-angle-left"></i></button>
            `;
            
            if (window.AudioEngine) window.AudioEngine.playSuccess();
        }
    }
}

function completeStage5() {
    completeStage(5, 250);
    navigateToStage(6);
}

function startStage5Mission2() {
    state.s5.activeMission = 2;
    state.s5.placedColumns = [];
    state.s5.placedRows = [];
    renderStage5Workbench();
}

function startStage5Mission3() {
    state.s5.activeMission = 3;
    state.s5.placedColumns = [];
    state.s5.placedRows = [];
    renderStage5Workbench();
}

function startStage5Mission4() {
    state.s5.activeMission = 4;
    state.s5.placedColumns = [];
    state.s5.placedRows = [];
    renderStage5Workbench();
}

function startStage5Mission5() {
    state.s5.activeMission = 5;
    state.s5.placedColumns = [];
    state.s5.placedRows = [];
    renderStage5Workbench();
}

// Generate the beautiful Bar Chart in SVG!
function generateSVGBarChart() {
    return `
    <svg viewBox="0 0 400 200" style="width:100%; height:100%; background: #f8fafc; border-radius:8px;">
        <!-- Axes -->
        <line x1="50" y1="20" x2="50" y2="160" stroke="#cbd5e1" stroke-width="1.5" />
        <line x1="50" y1="160" x2="380" y2="160" stroke="#cbd5e1" stroke-width="1.5" />
        
        <!-- Y Axis Grid lines -->
        <line x1="50" y1="50" x2="380" y2="50" stroke="rgba(0,0,0,0.03)" />
        <line x1="50" y1="110" x2="380" y2="110" stroke="rgba(0,0,0,0.03)" />
        
        <!-- Y Axis Labels -->
        <text x="42" y="54" fill="#475569" font-size="8" text-anchor="end">6,000 ש"ח</text>
        <text x="42" y="114" fill="#475569" font-size="8" text-anchor="end">3,000 ש"ח</text>
        
        <!-- Bar 1: Electronics -->
        <rect x="75" y="50" width="45" height="110" fill="var(--primary)" rx="4" style="filter: drop-shadow(0 2px 4px rgba(99,102,241,0.25));" />
        <text x="97" y="44" fill="var(--primary)" font-size="9" font-weight="950" text-anchor="middle">6,000 ₪</text>
        <text x="97" y="175" fill="#1e293b" font-size="9" font-weight="700" text-anchor="middle">אלקטרוניקה</text>

        <!-- Bar 2: Clothing -->
        <rect x="175" y="110" width="45" height="50" fill="var(--secondary)" rx="4" style="filter: drop-shadow(0 2px 4px rgba(13,148,136,0.25));" />
        <text x="197" y="104" fill="var(--secondary)" font-size="9" font-weight="950" text-anchor="middle">2,500 ₪</text>
        <text x="197" y="175" fill="#1e293b" font-size="9" font-weight="700" text-anchor="middle">ביגוד</text>

        <!-- Bar 3: Food -->
        <rect x="275" y="130" width="45" height="30" fill="var(--accent)" rx="4" style="filter: drop-shadow(0 2px 4px rgba(245,158,11,0.25));" />
        <text x="297" y="124" fill="var(--accent)" font-size="9" font-weight="950" text-anchor="middle">1,820 ₪</text>
        <text x="297" y="175" fill="#1e293b" font-size="9" font-weight="700" text-anchor="middle">מזון</text>
    </svg>
    `;
}

// Generate the beautiful Line Chart in SVG!
function generateSVGLineChart() {
    return `
    <svg viewBox="0 0 400 200" style="width:100%; height:100%; background: #f8fafc; border-radius:8px;">
        <!-- Axes -->
        <line x1="40" y1="20" x2="40" y2="160" stroke="#cbd5e1" stroke-width="1.5" />
        <line x1="40" y1="160" x2="380" y2="160" stroke="#cbd5e1" stroke-width="1.5" />
        
        <!-- Y Grid lines -->
        <line x1="40" y1="60" x2="380" y2="60" stroke="rgba(0,0,0,0.03)" />
        <line x1="40" y1="110" x2="380" y2="110" stroke="rgba(0,0,0,0.03)" />
        
        <!-- Axis labels -->
        <text x="32" y="64" fill="#475569" font-size="7" text-anchor="end">15 יח'</text>
        <text x="32" y="114" fill="#475569" font-size="7" text-anchor="end">5 יח'</text>
        
        <!-- Sparkline path -->
        <path d="M 60 140 L 120 120 L 180 135 L 240 50 L 300 130 L 360 80" fill="none" stroke="var(--secondary)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        
        <!-- Spark dots -->
        <circle cx="60" cy="140" r="4" fill="#ffffff" stroke="var(--secondary)" stroke-width="2" />
        <circle cx="120" cy="120" r="4" fill="#ffffff" stroke="var(--secondary)" stroke-width="2" />
        <circle cx="180" cy="135" r="4" fill="#ffffff" stroke="var(--secondary)" stroke-width="2" />
        
        <!-- Peak point dot -->
        <circle cx="240" cy="50" r="6" fill="#ef4444" stroke="#ffffff" stroke-width="2" style="filter: drop-shadow(0 0 8px #ef4444);" />
        <text x="240" y="38" fill="#ef4444" font-size="8" font-weight="900" text-anchor="middle">שיא סופ"ש (18 יחידות)</text>
        
        <circle cx="300" cy="130" r="4" fill="#ffffff" stroke="var(--secondary)" stroke-width="2" />
        <circle cx="360" cy="80" r="4" fill="#ffffff" stroke="var(--secondary)" stroke-width="2" />
        
        <!-- Timeline Labels -->
        <text x="60" y="175" fill="#1e293b" font-size="8" font-weight="700" text-anchor="middle">א'</text>
        <text x="120" y="175" fill="#1e293b" font-size="8" font-weight="700" text-anchor="middle">ב'</text>
        <text x="180" y="175" fill="#1e293b" font-size="8" font-weight="700" text-anchor="middle">ג'</text>
        <text x="240" y="175" fill="#ef4444" font-size="9" font-weight="900" text-anchor="middle">סופ"ש</text>
        <text x="300" y="175" fill="#1e293b" font-size="8" font-weight="700" text-anchor="middle">ה'</text>
        <text x="360" y="175" fill="#1e293b" font-size="8" font-weight="700" text-anchor="middle">ו'</text>
    </svg>
    `;
}

// Generate the beautiful Map Chart in SVG!
function generateSVGMapChart() {
    return `
    <svg viewBox="0 0 400 200" style="width:100%; height:100%; background: #f8fafc; border-radius:8px;">
        <!-- Minimal Simplified Map of Israel Coastal Outline -->
        <path d="M 180 30 C 185 45, 175 60, 170 75 C 165 90, 160 100, 172 130 L 195 180 L 199 180 L 182 135 L 184 105 L 195 78 C 197 70, 202 55, 192 30 Z" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="1.5" />
        
        <!-- Mediterranean Sea text -->
        <text x="100" y="90" fill="#94a3b8" font-size="8" font-style="italic" text-anchor="middle">הים התיכון</text>
        
        <!-- Bubble 1: Tel Aviv (Huge) -->
        <circle cx="171" cy="95" r="14" fill="rgba(13, 148, 136, 0.6)" stroke="#0d9488" stroke-width="1.5" style="filter: drop-shadow(0 0 8px rgba(13, 148, 136, 0.4));" />
        <text x="192" y="98" fill="#0f172a" font-size="8" font-weight="900" text-anchor="start">תל אביב (6,200 ש"ח)</text>

        <!-- Bubble 2: Haifa (Medium) -->
        <circle cx="178" cy="55" r="9" fill="rgba(13, 148, 136, 0.6)" stroke="#0d9488" stroke-width="1.5" />
        <text x="194" y="58" fill="#0f172a" font-size="8" font-weight="900" text-anchor="start">חיפה (2,300 ש"ח)</text>

        <!-- Bubble 3: Jerusalem (Large) -->
        <circle cx="183" cy="115" r="11" fill="rgba(13, 148, 136, 0.6)" stroke="#0d9488" stroke-width="1.5" />
        <text x="200" y="118" fill="#0f172a" font-size="8" font-weight="900" text-anchor="start">ירושלים (1,820 ש"ח)</text>
        
        <!-- Title box -->
        <rect x="260" y="10" width="130" height="28" rx="4" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" />
        <text x="325" y="26" fill="#1e293b" font-size="8" font-weight="900" text-anchor="middle">מפת מכירות מחוזית</text>
    </svg>
    `;
}

// Generate the beautiful circular Donut/Pie Chart in SVG!
function generateSVGDonutChart() {
    return `
    <svg viewBox="0 0 400 200" style="width:100%; height:100%; background: #f8fafc; border-radius:8px;">
        <!-- Circular segment: Club (70%) in Indigo -->
        <circle cx="130" cy="100" r="60" fill="none" stroke="#4f46e5" stroke-width="30" stroke-dasharray="264 377" stroke-dashoffset="0" />
        
        <!-- Circular segment: Casual (30%) in Orange -->
        <circle cx="130" cy="100" r="60" fill="none" stroke="#ea580c" stroke-width="30" stroke-dasharray="113 377" stroke-dashoffset="-264" />
        
        <!-- Donut inner hole -->
        <circle cx="130" cy="100" r="45" fill="#f8fafc" />
        <text x="130" y="105" fill="#1e293b" font-size="12" font-weight="900" text-anchor="middle">70% חברי מועדון</text>

        <!-- Legend -->
        <rect x="230" y="55" width="130" height="90" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
        
        <rect x="245" y="70" width="12" height="12" fill="var(--primary)" rx="2"/>
        <text x="265" y="80" fill="#1e293b" font-size="9" font-weight="700">חברי מועדון (7,200 ש"ח)</text>

        <rect x="245" y="95" width="12" height="12" fill="var(--accent)" rx="2"/>
        <text x="265" y="105" fill="#1e293b" font-size="9" font-weight="700">לקוחות מזדמנים (3,120 ש"ח)</text>
        
        <text x="245" y="130" fill="#94a3b8" font-size="8" font-style="italic">סה"כ: 10,320 ש"ח</text>
    </svg>
    `;
}

// Generate the Scatter Plot (Price vs Profit Margin) in SVG!
function generateSVGScatterChart() {
    return `
    <svg viewBox="0 0 400 200" style="width:100%; height:100%; background: #f8fafc; border-radius:8px;">
        <!-- Axes -->
        <line x1="40" y1="20" x2="40" y2="170" stroke="#cbd5e1" stroke-width="1.5" />
        <line x1="40" y1="170" x2="380" y2="170" stroke="#cbd5e1" stroke-width="1.5" />

        <!-- Grid Lines -->
        <line x1="120" y1="20" x2="120" y2="170" stroke="rgba(0,0,0,0.03)" />
        <line x1="200" y1="20" x2="200" y2="170" stroke="rgba(0,0,0,0.03)" />
        <line x1="280" y1="20" x2="280" y2="170" stroke="rgba(0,0,0,0.03)" />
        <line x1="40" y1="110" x2="380" y2="110" stroke="rgba(0,0,0,0.03)" />
        <line x1="40" y1="60" x2="380" y2="60" stroke="rgba(0,0,0,0.03)" />

        <!-- Outlier Linear Trend Line -->
        <line x1="40" y1="170" x2="360" y2="35" stroke="rgba(16, 185, 129, 0.2)" stroke-width="2" stroke-dasharray="4 4"/>

        <!-- Scatter Dots -->
        <!-- Dot 1: Low Price, Low Profit -->
        <circle cx="80" cy="155" r="5" fill="var(--secondary)" />
        <text x="80" y="145" fill="#475569" font-size="7" text-anchor="middle">55 ש"ח (מזון)</text>

        <!-- Dot 2: Low Price -->
        <circle cx="110" cy="150" r="5" fill="var(--secondary)" />

        <!-- Dot 3: Mid Price, Mid Profit -->
        <circle cx="210" cy="120" r="5" fill="var(--primary)" />
        <text x="210" y="110" fill="#475569" font-size="7" text-anchor="middle">360 ש"ח (ביגוד)</text>

        <!-- Dot 4: High Price, High Profit (Outlier!) -->
        <circle cx="340" cy="45" r="7" fill="var(--accent)" />
        <text x="340" y="32" fill="var(--accent)" font-size="8" font-weight="900" text-anchor="middle">3,000 ש"ח (אלקטרוניקה)</text>

        <!-- Axes Titles -->
        <text x="375" y="185" fill="#475569" font-size="8" text-anchor="end">מחיר מכירה (ש"ח)</text>
        <text x="35" y="15" fill="#475569" font-size="8" text-anchor="start">רווח עסקה (ש"ח)</text>
    </svg>
    `;
}

// ================= STAGE 6 LOGIC (5 CHARTS TO 3 CANVASES) =================
function initStage6() {
    state.s6.placedStrategic = [];
    state.s6.placedTactical = [];
    state.s6.placedOperational = [];
    
    document.getElementById('db-zone-strategic').innerHTML = `<span style="color: var(--text-muted); font-size: 0.85rem;" id="db-zone-lbl-strategic">[גרור/לחץ להצבת התרשימים האסטרטגיים המתאימים]</span>`;
    document.getElementById('db-zone-tactical').innerHTML = `<span style="color: var(--text-muted); font-size: 0.85rem;" id="db-zone-lbl-tactical">[גרור/לחץ להצבת התרשימים הניהוליים המתאימים]</span>`;
    document.getElementById('db-zone-operational').innerHTML = `<span style="color: var(--text-muted); font-size: 0.85rem;" id="db-zone-lbl-operational">[גרור/לחץ להצבת התרשים התפעולי המתאים]</span>`;
    
    document.getElementById('s6-verify-btn').disabled = true;
    document.getElementById('s6-action-panel').style.display = 'flex';
    document.getElementById('certificate-wrapper').style.display = 'none';
    
    clearFeedback(6);
    renderStage6Inventory();
}

function renderStage6Inventory() {
    const list = document.getElementById('chart-inv-list');
    if (!list) return;
    list.innerHTML = '';
    
    const items = [
        { key: 'category', label: 'תרשים מכירות לפי קטגוריית מוצר', icon: 'fa-chart-bar' },
        { key: 'time', label: 'תרשים מגמות רכישה לאורך זמן', icon: 'fa-chart-line' },
        { key: 'map', label: 'מפת ביצועים ופריסת סניפים בארץ', icon: 'fa-map-location-dot' },
        { key: 'segment', label: 'פילוח סוגי לקוחות (חברי מועדון)', icon: 'fa-chart-pie' },
        { key: 'profit', label: 'תרשים שולי רווח ועמידה בעלויות (Scatter)', icon: 'fa-circle-dot' }
    ];
    
    items.forEach(item => {
        const isPlaced = state.s6.placedStrategic.includes(item.key) || 
                         state.s6.placedTactical.includes(item.key) || 
                         state.s6.placedOperational.includes(item.key);
                         
        if (!isPlaced) {
            const div = document.createElement('div');
            div.className = 'inventory-item';
            div.draggable = true;
            div.id = `inv-chart-${item.key}`;
            div.ondragstart = (e) => dragChartToDb(e, item.key);
            
            div.innerHTML = `
                <i class="fa-solid ${item.icon}"></i> ${item.label}
            `;
            list.appendChild(div);
        }
    });
}

function allowChartDrop(ev) {
    ev.preventDefault();
    ev.currentTarget.classList.add('drag-hover');
}

function dragChartToDb(ev, chartKey) {
    ev.dataTransfer.setData("chartKey", chartKey);
    if (window.AudioEngine) window.AudioEngine.playClick();
}

function dropChartToDb(ev, zoneId) {
    ev.preventDefault();
    const zone = document.getElementById(`db-zone-${zoneId}`);
    zone.classList.remove('drag-hover');
    
    const chartKey = ev.dataTransfer.getData("chartKey");
    if (!chartKey) return;
    
    placeChartInZone(chartKey, zoneId);
}

function clickDbZone(zoneId) {
    const all = ['category', 'time', 'map', 'segment', 'profit'];
    const unplaced = all.find(k => !state.s6.placedStrategic.includes(k) && 
                                   !state.s6.placedTactical.includes(k) && 
                                   !state.s6.placedOperational.includes(k));
    
    if (unplaced) {
        placeChartInZone(unplaced, zoneId);
    }
}

function placeChartInZone(key, zoneId) {
    clearFeedback(6);
    
    // Remove key from all lists
    state.s6.placedStrategic = state.s6.placedStrategic.filter(k => k !== key);
    state.s6.placedTactical = state.s6.placedTactical.filter(k => k !== key);
    state.s6.placedOperational = state.s6.placedOperational.filter(k => k !== key);
    
    if (zoneId === 'strategic') state.s6.placedStrategic.push(key);
    if (zoneId === 'tactical') state.s6.placedTactical.push(key);
    if (zoneId === 'operational') state.s6.placedOperational.push(key);
    
    if (window.AudioEngine) window.AudioEngine.playSuccess();
    
    renderPlacedChartsInZoneUI(zoneId);
    renderStage6Inventory();
    checkStage6Verification();
}

function renderPlacedChartsInZoneUI(zoneId) {
    const zone = document.getElementById(`db-zone-${zoneId}`);
    let keys = [];
    if (zoneId === 'strategic') keys = state.s6.placedStrategic;
    if (zoneId === 'tactical') keys = state.s6.placedTactical;
    if (zoneId === 'operational') keys = state.s6.placedOperational;
    
    if (keys.length === 0) {
        zone.innerHTML = `<span style="color: var(--text-muted); font-size: 0.85rem;" id="db-zone-lbl-${zoneId}">[גרור/לחץ להצבת התרשימים המתאימים]</span>`;
        return;
    }
    
    zone.innerHTML = '';
    keys.forEach(key => {
        let label = '';
        let icon = '';
        if (key === 'category') { label = 'קטגוריית מוצר'; icon = 'fa-chart-bar'; }
        if (key === 'time') { label = 'קו זמן קניות'; icon = 'fa-chart-line'; }
        if (key === 'map') { label = 'מפת סניפים'; icon = 'fa-map-location-dot'; }
        if (key === 'segment') { label = 'סוג לקוח דונאט'; icon = 'fa-chart-pie'; }
        if (key === 'profit') { label = 'שולי רווח Scatter'; icon = 'fa-circle-dot'; }
        
        const div = document.createElement('div');
        div.className = 'placed-chart-card';
        div.innerHTML = `
            <i class="fa-solid ${icon}"></i>
            <span>${label}</span>
            <span style="cursor:pointer; color:var(--error); font-weight:700;" onclick="removeChartFromZone('${zoneId}', '${key}'); event.stopPropagation();">&times;</span>
        `;
        zone.appendChild(div);
    });
}

function removeChartFromZone(zoneId, key) {
    clearFeedback(6);
    
    if (zoneId === 'strategic') state.s6.placedStrategic = state.s6.placedStrategic.filter(k => k !== key);
    if (zoneId === 'tactical') state.s6.placedTactical = state.s6.placedTactical.filter(k => k !== key);
    if (zoneId === 'operational') state.s6.placedOperational = state.s6.placedOperational.filter(k => k !== key);
    
    if (window.AudioEngine) window.AudioEngine.playClick();
    
    renderPlacedChartsInZoneUI(zoneId);
    renderStage6Inventory();
    checkStage6Verification();
}

function checkStage6Verification() {
    const verifyBtn = document.getElementById('s6-verify-btn');
    const totalPlaced = state.s6.placedStrategic.length + state.s6.placedTactical.length + state.s6.placedOperational.length;
    
    if (totalPlaced === 5) {
        verifyBtn.disabled = false;
        showFeedback(6, "כל 5 התרשימים מוצבים בדאשבורדים! לחץ/י על כפתור האימות לבדיקת דירוג הדרגים העסקיים.", "success");
    } else {
        verifyBtn.disabled = true;
    }
}

function verifyStage6() {
    clearFeedback(6);
    
    // Check if stages 1-5 are completed successfully!
    const required = [1, 2, 3, 4, 5];
    const missing = required.filter(num => !state.completedStages.includes(num));
    if (missing.length > 0) {
        if (window.AudioEngine) window.AudioEngine.playError();
        
        const stageNames = {
            1: "שלב 1 (סכמת הנתונים 📁)",
            2: "שלב 2 (נאותות הנתונים 🧹)",
            3: "שלב 3 (מחשפת הפרומפטים ✍️)",
            4: "שלב 4 (חיבור ל-Tableau וחידון 🔗)",
            5: "שלב 5 (בניית 5 התרשימים 📊)"
        };
        const missingNames = missing.map(n => stageNames[n]).join(", ");
        
        showFeedback(6, `🚨 רגע אחד! לא ניתן להנפיק תעודת מוסמך Master עדיין! 🛑 עליך לסיים בהצלחה את השלבים הקודמים שטרם השלמת: ${missingNames}. אנא חזור אליהם דרך מפת השלבים למעלה, פתור אותם בהצלחה ונסה שוב! 💪✨`, "error");
        return;
    }

    // Check strategic list matches correctStrategic: ['map', 'profit']
    const hasStratMap = state.s6.placedStrategic.includes('map');
    const hasStratProfit = state.s6.placedStrategic.includes('profit');
    const isStratCorrect = hasStratMap && hasStratProfit && state.s6.placedStrategic.length === 2;
    
    // Check tactical list matches correctTactical: ['category', 'segment']
    const hasTactCat = state.s6.placedTactical.includes('category');
    const hasTactSeg = state.s6.placedTactical.includes('segment');
    const isTactCorrect = hasTactCat && hasTactSeg && state.s6.placedTactical.length === 2;
    
    // Check operational list matches correctOperational: ['time']
    const isOperCorrect = state.s6.placedOperational.includes('time') && state.s6.placedOperational.length === 1;
    
    if (isStratCorrect && isTactCorrect && isOperCorrect) {
        completeStage(6, 250);
        
        document.getElementById('s6-action-panel').style.display = 'none';
        document.getElementById('chart-inv-list').parentElement.style.display = 'none';
        document.querySelector('.dashboard-canvases').style.display = 'none';
        
        const certWrapper = document.getElementById('certificate-wrapper');
        certWrapper.style.display = 'block';
        
        document.getElementById('cert-recipient-name').innerText = state.player.name;
        document.getElementById('cert-final-score').innerText = `${state.player.score} XP`;
        
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();
        document.getElementById('cert-date').innerText = `${dd}.${mm}.${yyyy}`;
        
        if (window.AudioEngine) window.AudioEngine.playLevelUp();
        showFeedback(6, "מזל טוב! סווגת את כל 5 התרשימים לדאשבורדים המתאימים בהצטיינות יתרה. תעודת המאסטר שלך מוכנה!", "success");
    } else {
        if (window.AudioEngine) window.AudioEngine.playError();
        
        let explanation = "בדיקת הדרגים העסקיים נכשלה! שים/י לב לסיבות השגיאה הניהוליות:\n\n";
        
        if (!isStratCorrect) {
            explanation += "• **הדרג האסטרטגי** (מנכ\"ל/CFO) זקוק לכלים לקבלת החלטות גלובליות: *מפת סניפים* בפריסה ארצית לצורכי פריסת נכסים חדשים, ו*תרשים הפיזור (Scatter)* של שולי הרווח כדי לבצע ניתוח יציבות פיננסית ועמידה בעלויות.\n";
        }
        if (!isTactCorrect) {
            explanation += "• **הדרג הטקטי** (מנהלי מחלקות שיווק ומכירות) מנתח ביצועי קטגוריות: *תרשים עמודות* של מכירות מוצרים כדי לדעת איפה לתקצב פרסום, ו*תרשים סוג לקוח (מועדון)* להרחבת חברי מועדון קיימים.\n";
        }
        if (!isOperCorrect) {
            explanation += "• **הדרג התפעולי** (מנהלי סניפים בשטח) זקוק למעקב שבועי תדיר: *קו זמן* של כמויות פריטים כדי לתגבר קופות בשישי-שבת ולהערך לוגיסטית.\n";
        }
        
        showFeedback(6, explanation, "error");
        
        // Reset wrong zones
        if (!isStratCorrect) {
            state.s6.placedStrategic = [];
            renderPlacedChartsInZoneUI('strategic');
        }
        if (!isTactCorrect) {
            state.s6.placedTactical = [];
            renderPlacedChartsInZoneUI('tactical');
        }
        if (!isOperCorrect) {
            state.s6.placedOperational = [];
            renderPlacedChartsInZoneUI('operational');
        }
        renderStage6Inventory();
    }
}

function restartGame() {
    if (window.AudioEngine) window.AudioEngine.playLevelUp();
    
    state.player.score = 0;
    state.currentStage = 1;
    state.completedStages = []; // Reset completed stages on restart!
    
    for (let i = 2; i <= 6; i++) {
        const node = document.getElementById(`node-${i}`);
        if (node) {
            node.className = 'map-node locked';
            const status = document.getElementById(`node-status-${i}`);
            if (status) status.innerText = "נעול 🔒";
        }
    }
    
    const node1 = document.getElementById('node-1');
    node1.className = 'map-node active';
    const status1 = document.getElementById('node-status-1');
    status1.innerText = "פעיל ⚡";
    
    document.getElementById('hud-score').innerText = `0 XP`;
    
    document.getElementById('gameplay-area').style.display = 'none';
    document.getElementById('setup-screen').style.display = 'block';
    document.getElementById('player-name-input').value = '';
    
    // Reset setup progressive step wizard
    goToSetupStep(1);
    initSetupFireworks();
}

window.addEventListener('DOMContentLoaded', () => {
    // Initialize the Canvas particle fireworks!
    initSetupFireworks();
    
    const musicIcon = document.getElementById('music-icon');
    const sfxIcon = document.getElementById('sfx-icon');
    
    if (state.isMusicPlaying) {
        musicIcon.className = "fa-solid fa-volume-high";
        musicIcon.style.color = "var(--primary)";
    } else {
        musicIcon.className = "fa-solid fa-volume-xmark";
        musicIcon.style.color = "var(--text-muted)";
    }
    
    if (state.isSFXEnabled) {
        sfxIcon.className = "fa-solid fa-bell";
        sfxIcon.style.color = "var(--primary)";
    } else {
        sfxIcon.className = "fa-solid fa-bell-slash";
        sfxIcon.style.color = "var(--text-muted)";
    }
});

/* ================= SAD EMOJI POPUPS ================= */
function triggerSadEmoji(emojiStr, titleStr, descStr) {
    const overlay = document.getElementById('sad-emoji-overlay');
    const iconEl = document.getElementById('sad-emoji-icon');
    const titleEl = document.getElementById('sad-emoji-title');
    const textEl = document.getElementById('sad-emoji-text');
    
    if (!overlay || !iconEl || !titleEl || !textEl) return;
    
    iconEl.innerText = emojiStr || '😭';
    titleEl.innerText = titleStr || 'אוי לא! שגיאה בתהליך';
    textEl.innerText = descStr || 'משהו לא הסתדר בדיוק כמו שצריך. בדוק את ההנחיות ונסה שוב!';
    
    overlay.classList.add('active');
    
    if (window.AudioEngine && state.isSFXEnabled) {
        window.AudioEngine.playSadBuzzer();
    }
}

function closeSadEmojiOverlay() {
    const overlay = document.getElementById('sad-emoji-overlay');
    if (overlay) overlay.classList.remove('active');
}

/* ================= 3 SKIP LIFELINES ================= */
function useLifeline(stageNum) {
    if (state.lifelinesLeft === undefined) {
        state.lifelinesLeft = 3;
    }
    
    if (state.lifelinesLeft <= 0) {
        showFeedback(stageNum, "אופס! נגמרו לך גלגלי ההצלה למשחק זה. עליך לפתור את השלב בעצמך! 💪✨", "error");
        return;
    }
    
    // Decrement lifelines
    state.lifelinesLeft--;
    const hud = document.getElementById('hud-lifelines');
    if (hud) hud.innerText = state.lifelinesLeft;
    
    // Play sound!
    if (window.AudioEngine && state.isSFXEnabled) {
        window.AudioEngine.playSuccess();
    }
    
    // Perform auto-solve based on stageNum
    if (stageNum === 1) {
        state.s1.placedKeys.branch = 'סניף_מזהה';
        state.s1.placedKeys.product = 'מוצר_מזהה';
        const bDrop = document.getElementById('branch-dropzone');
        const pDrop = document.getElementById('product-dropzone');
        if (bDrop) bDrop.innerHTML = `<div class="key-card mini">סניף_מזהה (PK) <i class="fa-solid fa-key"></i></div>`;
        if (pDrop) pDrop.innerHTML = `<div class="key-card mini">מוצר_מזהה (PK) <i class="fa-solid fa-key"></i></div>`;
        
        const bSlot = document.getElementById('slot-branch-val');
        const pSlot = document.getElementById('slot-product-val');
        if (bSlot) bSlot.innerText = 'סניף_מזהה (FK) ✅';
        if (pSlot) pSlot.innerText = 'מוצר_מזהה (FK) ✅';
        
        document.getElementById('s1-verify-btn').disabled = false;
        showFeedback(1, "הגלגל הציל אותך! 🛟 המפתחות הנכונים שובצו בסכמה. כעת לחץ/י על הכפתור הירוק 'אמת סכמה ועבור לטעינת נתונים' למטה כדי להמשיך!", "success");
    } else if (stageNum === 2) {
        state.s2.purifiedIds = [];
        state.s2.corruptedData.forEach(row => {
            if (row.isCorrupted) {
                state.s2.purifiedIds.push(row.id);
                const rowElement = document.getElementById(`s2-row-${row.id}`);
                if (rowElement) {
                    rowElement.className = 'clickable-row row-purified';
                }
                
                const cleanTbody = document.getElementById('s2-clean-table-body');
                if (cleanTbody && !document.getElementById(`s2-clean-row-${row.id}`)) {
                    const cleanTr = document.createElement('tr');
                    cleanTr.id = `s2-clean-row-${row.id}`;
                    
                    let cleanDate = row.date;
                    let cleanBranchId = row.branch_id;
                    let cleanProdId = row.prod_id;
                    let cleanQty = row.qty;
                    let cleanTotal = row.total;
                    let cleanProfit = row.profit;
                    
                    if (row.errorType.includes("לא קיים מוצר 999")) cleanProdId = 101; 
                    if (row.errorType.includes("לא קיים סניף 99")) cleanBranchId = 1;
                    if (row.errorType.includes("מחיר ורווח שליליים")) { cleanTotal = 55; cleanProfit = 11; } 
                    if (row.errorType.includes("תאריך עתידי")) cleanDate = "2026-05-04"; 
                    if (row.errorType.includes("כמות קטועה")) cleanQty = 5; 
                    if (row.errorType.includes("רווח גבוה מסך התשלום")) cleanProfit = 180;
                    
                    cleanTr.innerHTML = `
                        <td>${row.id}</td>
                        <td>${cleanDate}</td>
                        <td>${cleanBranchId}</td>
                        <td>${cleanProdId}</td>
                        <td>${cleanQty}</td>
                        <td>${cleanTotal}</td>
                        <td>${row.segment}</td>
                        <td>${cleanProfit}</td>
                    `;
                    cleanTbody.appendChild(cleanTr);
                }
            }
        });
        
        const verifyBtn = document.getElementById('s2-verify-btn');
        if (verifyBtn) verifyBtn.disabled = false;
        showFeedback(2, "הגלגל הציל אותך! 🛟 כל השורות המשובשות אותרו וטוהרו עבורך. כעת לחץ/י על כפתור 'אמת נאותות ועבור למשפך' למטה!", "success");
    } else if (stageNum === 3) {
        state.s3.selectedBlocks = state.s3.blocks.filter(b => b.isCorrect).map(b => b.id);
        const preview = document.getElementById('s3-prompt-preview');
        if (preview) {
            preview.innerHTML = `<strong>פרומפט מנצח נוצר אוטומטית באמצעות גלגל הצלה! 🛟</strong><br>` + state.s3.blocks.filter(b => b.isCorrect).map(b => b.text).join('<br><br>');
        }
        state.s3.blocks.forEach(block => {
            const el = document.getElementById(`s3-block-${block.id}`);
            if (el) {
                if (block.isCorrect) el.classList.add('selected');
                else el.classList.remove('selected');
            }
        });
        showFeedback(3, "הגלגל הציל אותך! 🛟 הפרומפט המנצח הורכב. כעת לחץ/י על הכפתור הכתום 'שגר הנחיה לייצור קובצי CSV' למטה כדי לצפות בסימולציה ולהוריד את קובץ המכירות!", "success");
    } else if (stageNum === 4) {
        const currentQ = state.s4.questions[state.s4.currentQuestionIndex];
        if (currentQ) {
            const correctOptIndex = currentQ.options.findIndex(opt => opt.isCorrect);
            if (correctOptIndex !== -1) {
                const button = document.getElementById(`s4-opt-${correctOptIndex}`);
                const icon = document.getElementById(`s4-opt-icon-${correctOptIndex}`);
                if (button && icon) {
                    button.classList.add('correct');
                    icon.className = "fa-solid fa-check";
                }
                
                showFeedback(4, `גלגל הצלה מראה את התשובה הנכונה: "${currentQ.options[correctOptIndex].text}" 🛟 השאלה תיפתר ותתקדם בעוד 3 שניות...`, "success");
                
                currentQ.answered = true;
                setTimeout(() => {
                    state.s4.currentQuestionIndex++;
                    renderStage4Quiz();
                }, 3000);
            }
        }
    } else if (stageNum === '3-5') {
        completeStage('3-5', 150);
        
        if (pacmanGameInterval) {
            clearInterval(pacmanGameInterval);
            pacmanGameInterval = null;
        }
        
        pacmanCanvas = document.getElementById('stage-3-5-pacman-canvas');
        if (pacmanCanvas) {
            pacmanCtx = pacmanCanvas.getContext('2d');
            if (pacmanCtx) {
                pacmanCtx.fillStyle = '#0f172a';
                pacmanCtx.fillRect(0, 0, 450, 450);
                pacmanCtx.fillStyle = '#10b981';
                pacmanCtx.font = 'bold 22px sans-serif';
                pacmanCtx.textAlign = 'center';
                pacmanCtx.fillText('הגלגל הציל אותך! 🛟', 225, 205);
                pacmanCtx.fillText('ד"ר רמי הובס!', 225, 245);
            }
        }
        
        document.getElementById('pacman-cover-screen').style.display = 'none';
        document.getElementById('pacman-gameover-screen').style.display = 'none';
        document.getElementById('pacman-victory-screen').style.display = 'flex';
        
        document.getElementById('s3_5-next-action').style.display = 'inline-block';
        
        showFeedback('3_5', "גלגל ההצלה הופעל בהצלחה! 🛟 נמלטת מד\"ר רמי ושלב 3.5 הושלם! כעת לחץ/י על כפתור המעבר לשלב 4.", "success");
    } else if (stageNum === 5) {
        const correctCols = { 1: ['category'], 2: ['date'], 3: ['city'], 4: ['segment'], 5: ['sales'] };
        const correctRows = { 1: ['sales'], 2: ['qty'], 3: ['sales'], 4: ['sales'], 5: ['profit'] };
        const actMission = state.s5.activeMission;
        
        state.s5.placedColumns = correctCols[actMission];
        state.s5.placedRows = correctRows[actMission];
        
        renderStage5Workbench();
        showFeedback(5, `גלגל הצלה שיבץ את העמודות והשורות בצורה מדוייקת עבור משימה ${actMission}! 🛟 כעת לחץ/י על כפתור ההמשך הירוק שנוסף בתחתית התצוגה המקדימה!`, "success");
    } else {
        showFeedback(stageNum, "לא ניתן לדלג על שלב זה! 🛑", "error");
    }
}

/* ================= RAMI PAC-MAN MINI-GAME ================= */
let pacmanGameInterval = null;
let pacmanCanvas = null;
let pacmanCtx = null;

const PACMAN_GRID_SIZE = 15;
const PACMAN_CELL_SIZE = 30;

const PACMAN_MAZE = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,1,2,2,2,2,2,2,1],
    [1,2,1,1,2,1,2,1,2,1,2,1,1,2,1],
    [1,2,1,1,2,1,2,2,2,1,2,1,1,2,1],
    [1,2,2,2,2,2,2,1,2,2,2,2,2,2,1],
    [1,1,2,1,1,1,2,1,2,1,1,1,2,1,1],
    [1,2,2,2,2,1,2,2,2,1,2,2,2,2,1],
    [1,2,1,1,2,1,1,0,1,1,2,1,1,2,1],
    [1,2,2,2,2,1,2,2,2,1,2,2,2,2,1],
    [1,1,2,1,1,1,2,1,2,1,1,1,2,1,1],
    [1,2,2,2,2,2,2,1,2,2,2,2,2,2,1],
    [1,2,1,1,2,1,2,2,2,1,2,1,1,2,1],
    [1,2,1,1,2,1,2,1,2,1,2,1,1,2,1],
    [1,2,2,2,2,2,2,1,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

let pacmanState = {
    x: 1,
    y: 1,
    px: 45,
    py: 45,
    dir: 'right',
    nextDir: 'right',
    score: 0,
    lives: 3,
    dotsTotal: 0,
    dotsEaten: 0,
    ghost: {
        x: 7,
        y: 7,
        px: 225,
        py: 225,
        dir: 'up',
        speed: 1.5
    },
    dots: []
};

function initStage3_5() {
    if (pacmanGameInterval) {
        clearInterval(pacmanGameInterval);
        pacmanGameInterval = null;
    }
    
    // Reset wizard action button
    document.getElementById('s3_5-next-action').style.display = 'none';
    
    // Reset screens to show cover first
    document.getElementById('pacman-cover-screen').style.display = 'flex';
    document.getElementById('pacman-gameover-screen').style.display = 'none';
    document.getElementById('pacman-victory-screen').style.display = 'none';
    
    // Draw initial cover on canvas
    pacmanCanvas = document.getElementById('stage-3-5-pacman-canvas');
    if (pacmanCanvas) {
        pacmanCtx = pacmanCanvas.getContext('2d');
        if (pacmanCtx) {
            pacmanCtx.fillStyle = '#0f172a';
            pacmanCtx.fillRect(0, 0, 450, 450);
            
            // Draw grid in background just for aesthetics
            for (let r = 0; r < PACMAN_GRID_SIZE; r++) {
                for (let c = 0; c < PACMAN_GRID_SIZE; c++) {
                    let x = c * PACMAN_CELL_SIZE;
                    let y = r * PACMAN_CELL_SIZE;
                    if (PACMAN_MAZE[r][c] === 1) {
                        pacmanCtx.fillStyle = 'rgba(59, 130, 246, 0.15)';
                        pacmanCtx.fillRect(x + 2, y + 2, PACMAN_CELL_SIZE - 4, PACMAN_CELL_SIZE - 4);
                    }
                }
            }
        }
    }
    
    // Initialize scoreboard display to defaults
    document.getElementById('stage-pacman-score').innerText = 0;
    document.getElementById('stage-pacman-lives').innerText = 3;
}

function startStagePacmanGame() {
    if (window.AudioEngine && state.isSFXEnabled) {
        window.AudioEngine.playClick();
    }
    
    // Hide all overlay screens
    document.getElementById('pacman-cover-screen').style.display = 'none';
    document.getElementById('pacman-gameover-screen').style.display = 'none';
    document.getElementById('pacman-victory-screen').style.display = 'none';
    
    // Initialize the canvas and game state
    pacmanCanvas = document.getElementById('stage-3-5-pacman-canvas');
    if (!pacmanCanvas) return;
    pacmanCtx = pacmanCanvas.getContext('2d');
    
    pacmanState.dots = [];
    pacmanState.dotsTotal = 0;
    pacmanState.dotsEaten = 0;
    pacmanState.score = 0;
    pacmanState.lives = 3;
    
    for (let r = 0; r < PACMAN_GRID_SIZE; r++) {
        pacmanState.dots[r] = [];
        for (let c = 0; c < PACMAN_GRID_SIZE; c++) {
            if (PACMAN_MAZE[r][c] === 2) {
                pacmanState.dots[r][c] = true;
                pacmanState.dotsTotal++;
            } else {
                pacmanState.dots[r][c] = false;
            }
        }
    }
    
    resetStagePacmanPositions();
    
    // Bind keys
    window.removeEventListener('keydown', handlePacmanKeydown);
    window.addEventListener('keydown', handlePacmanKeydown);
    
    // Start interval at half speed (200ms instead of 100ms)
    if (pacmanGameInterval) clearInterval(pacmanGameInterval);
    pacmanGameInterval = setInterval(updateStagePacmanGame, 200);
}

function resetStagePacmanPositions() {
    pacmanState.x = 1;
    pacmanState.y = 1;
    pacmanState.px = 1 * PACMAN_CELL_SIZE + PACMAN_CELL_SIZE / 2;
    pacmanState.py = 1 * PACMAN_CELL_SIZE + PACMAN_CELL_SIZE / 2;
    pacmanState.dir = 'right';
    pacmanState.nextDir = 'right';
    
    pacmanState.ghost.x = 7;
    pacmanState.ghost.y = 7;
    pacmanState.ghost.px = 7 * PACMAN_CELL_SIZE + PACMAN_CELL_SIZE / 2;
    pacmanState.ghost.py = 7 * PACMAN_CELL_SIZE + PACMAN_CELL_SIZE / 2;
    
    document.getElementById('stage-pacman-lives').innerText = pacmanState.lives;
    document.getElementById('stage-pacman-score').innerText = pacmanState.score;
}

function handlePacmanKeydown(e) {
    if (['ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        pacmanState.nextDir = 'up';
    } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        pacmanState.nextDir = 'down';
    } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        pacmanState.nextDir = 'left';
    } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        pacmanState.nextDir = 'right';
    }
}

function sendPacmanDirection(dir) {
    pacmanState.nextDir = dir;
}

function canMove(gx, gy) {
    if (gx < 0 || gx >= PACMAN_GRID_SIZE || gy < 0 || gy >= PACMAN_GRID_SIZE) return false;
    return PACMAN_MAZE[gy][gx] !== 1;
}

function updateStagePacmanGame() {
    let nextX = pacmanState.x;
    let nextY = pacmanState.y;
    
    if (pacmanState.nextDir === 'up') nextY--;
    else if (pacmanState.nextDir === 'down') nextY++;
    else if (pacmanState.nextDir === 'left') nextX--;
    else if (pacmanState.nextDir === 'right') nextX++;
    
    if (canMove(nextX, nextY)) {
        pacmanState.dir = pacmanState.nextDir;
    }
    
    let moveX = pacmanState.x;
    let moveY = pacmanState.y;
    if (pacmanState.dir === 'up') moveY--;
    else if (pacmanState.dir === 'down') moveY++;
    else if (pacmanState.dir === 'left') moveX--;
    else if (pacmanState.dir === 'right') moveX++;
    
    if (canMove(moveX, moveY)) {
        pacmanState.x = moveX;
        pacmanState.y = moveY;
        pacmanState.px = pacmanState.x * PACMAN_CELL_SIZE + PACMAN_CELL_SIZE / 2;
        pacmanState.py = pacmanState.y * PACMAN_CELL_SIZE + PACMAN_CELL_SIZE / 2;
        
        if (window.AudioEngine && state.isSFXEnabled && Math.random() < 0.25) {
            window.AudioEngine.playWaka();
        }
    }
    
    if (pacmanState.dots[pacmanState.y][pacmanState.x]) {
        pacmanState.dots[pacmanState.y][pacmanState.x] = false;
        pacmanState.dotsEaten++;
        pacmanState.score += 10;
        
        document.getElementById('stage-pacman-score').innerText = pacmanState.score;
        
        if (pacmanState.dotsEaten >= pacmanState.dotsTotal) {
            clearInterval(pacmanGameInterval);
            if (window.AudioEngine && state.isSFXEnabled) {
                window.AudioEngine.playSuccess();
            }
            
            // Show inline victory overlay
            document.getElementById('pacman-victory-screen').style.display = 'flex';
            document.getElementById('s3_5-next-action').style.display = 'inline-block';
            
            // confettis!
            if (window.confetti) {
                window.confetti({
                    particleCount: 100,
                    spread: 80,
                    origin: { y: 0.6 }
                });
            }
            
            completeStage('3-5', 150);
            return;
        }
    }
    
    let ghostX = pacmanState.ghost.x;
    let ghostY = pacmanState.ghost.y;
    let possibleMoves = [];
    if (canMove(ghostX + 1, ghostY)) possibleMoves.push({x: ghostX + 1, y: ghostY, dist: Math.hypot(pacmanState.x - (ghostX + 1), pacmanState.y - ghostY)});
    if (canMove(ghostX - 1, ghostY)) possibleMoves.push({x: ghostX - 1, y: ghostY, dist: Math.hypot(pacmanState.x - (ghostX - 1), pacmanState.y - ghostY)});
    if (canMove(ghostX, ghostY + 1)) possibleMoves.push({x: ghostX, y: ghostY + 1, dist: Math.hypot(pacmanState.x - ghostX, pacmanState.y - (ghostY + 1))});
    if (canMove(ghostX, ghostY - 1)) possibleMoves.push({x: ghostX, y: ghostY - 1, dist: Math.hypot(pacmanState.x - ghostX, pacmanState.y - (ghostY - 1))});
    
    if (possibleMoves.length > 0) {
        possibleMoves.sort((a,b) => a.dist - b.dist);
        let chosen = possibleMoves[0];
        if (Math.random() < 0.25) {
            chosen = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        }
        pacmanState.ghost.x = chosen.x;
        pacmanState.ghost.y = chosen.y;
        pacmanState.ghost.px = pacmanState.ghost.x * PACMAN_CELL_SIZE + PACMAN_CELL_SIZE / 2;
        pacmanState.ghost.py = pacmanState.ghost.y * PACMAN_CELL_SIZE + PACMAN_CELL_SIZE / 2;
    }
    
    if (pacmanState.x === pacmanState.ghost.x && pacmanState.y === pacmanState.ghost.y) {
        pacmanState.lives--;
        document.getElementById('stage-pacman-lives').innerText = pacmanState.lives;
        
        if (window.AudioEngine && state.isSFXEnabled) {
            window.AudioEngine.playPacmanDeath();
        }
        
        if (pacmanState.lives <= 0) {
            clearInterval(pacmanGameInterval);
            
            // Show inline defeat overlay
            document.getElementById('pacman-gameover-screen').style.display = 'flex';
            return;
        } else {
            resetStagePacmanPositions();
        }
    }
    
    drawStagePacmanGame();
}

function drawStagePacmanGame() {
    if (!pacmanCtx) return;
    pacmanCtx.clearRect(0, 0, 450, 450);
    
    for (let r = 0; r < PACMAN_GRID_SIZE; r++) {
        for (let c = 0; c < PACMAN_GRID_SIZE; c++) {
            let x = c * PACMAN_CELL_SIZE;
            let y = r * PACMAN_CELL_SIZE;
            
            if (PACMAN_MAZE[r][c] === 1) {
                pacmanCtx.fillStyle = '#1e3a8a';
                pacmanCtx.fillRect(x + 2, y + 2, PACMAN_CELL_SIZE - 4, PACMAN_CELL_SIZE - 4);
                pacmanCtx.strokeStyle = '#3b82f6';
                pacmanCtx.strokeRect(x, y, PACMAN_CELL_SIZE, PACMAN_CELL_SIZE);
            } else {
                if (pacmanState.dots[r][c]) {
                    pacmanCtx.fillStyle = '#fbbf24';
                    pacmanCtx.beginPath();
                    pacmanCtx.arc(x + PACMAN_CELL_SIZE/2, y + PACMAN_CELL_SIZE/2, 3, 0, Math.PI * 2);
                    pacmanCtx.fill();
                }
            }
        }
    }
    
    let px = pacmanState.px;
    let py = pacmanState.py;
    pacmanCtx.fillStyle = '#fbbf24';
    pacmanCtx.beginPath();
    
    let startAngle = 0.2 * Math.PI;
    let endAngle = 1.8 * Math.PI;
    
    if (pacmanState.dir === 'left') {
        startAngle = 1.2 * Math.PI;
        endAngle = 0.8 * Math.PI;
    } else if (pacmanState.dir === 'up') {
        startAngle = 1.7 * Math.PI;
        endAngle = 1.3 * Math.PI;
    } else if (pacmanState.dir === 'down') {
        startAngle = 0.7 * Math.PI;
        endAngle = 0.3 * Math.PI;
    }
    
    pacmanCtx.arc(px, py, PACMAN_CELL_SIZE / 2 - 2, startAngle, endAngle);
    pacmanCtx.lineTo(px, py);
    pacmanCtx.fill();
    
    let gx = pacmanState.ghost.px;
    let gy = pacmanState.ghost.py;
    
    pacmanCtx.fillStyle = '#ef4444';
    pacmanCtx.beginPath();
    pacmanCtx.arc(gx, gy - 2, PACMAN_CELL_SIZE / 2 - 2, Math.PI, 0, false);
    pacmanCtx.lineTo(gx + PACMAN_CELL_SIZE / 2 - 2, gy + PACMAN_CELL_SIZE / 2 - 2);
    pacmanCtx.lineTo(gx + PACMAN_CELL_SIZE / 3, gy + PACMAN_CELL_SIZE / 3);
    pacmanCtx.lineTo(gx, gy + PACMAN_CELL_SIZE / 2 - 2);
    pacmanCtx.lineTo(gx - PACMAN_CELL_SIZE / 3, gy + PACMAN_CELL_SIZE / 3);
    pacmanCtx.lineTo(gx - PACMAN_CELL_SIZE / 2 + 2, gy + PACMAN_CELL_SIZE / 2 - 2);
    pacmanCtx.fill();
    
    pacmanCtx.fillStyle = '#ffffff';
    pacmanCtx.beginPath();
    pacmanCtx.arc(gx - 4, gy - 4, 3, 0, Math.PI * 2);
    pacmanCtx.arc(gx + 4, gy - 4, 3, 0, Math.PI * 2);
    pacmanCtx.fill();
    
    pacmanCtx.fillStyle = '#1e3a8a';
    pacmanCtx.beginPath();
    let eyeOffsetX = (pacmanState.x - pacmanState.ghost.x) > 0 ? 1 : -1;
    let eyeOffsetY = (pacmanState.y - pacmanState.ghost.y) > 0 ? 1 : -1;
    pacmanCtx.arc(gx - 4 + eyeOffsetX, gy - 4 + eyeOffsetY, 1.5, 0, Math.PI * 2);
    pacmanCtx.arc(gx + 4 + eyeOffsetX, gy - 4 + eyeOffsetY, 1.5, 0, Math.PI * 2);
    pacmanCtx.fill();
    
    pacmanCtx.strokeStyle = '#000000';
    pacmanCtx.lineWidth = 1.5;
    pacmanCtx.strokeRect(gx - 8, gy - 7, 6, 5);
    pacmanCtx.strokeRect(gx + 2, gy - 7, 6, 5);
    pacmanCtx.beginPath();
    pacmanCtx.moveTo(gx - 2, gy - 4);
    pacmanCtx.lineTo(gx + 2, gy - 4);
    pacmanCtx.stroke();
    
    pacmanCtx.fillStyle = '#ffffff';
    pacmanCtx.font = 'bold 9px sans-serif';
    pacmanCtx.textAlign = 'center';
    pacmanCtx.fillText('חזור ללמוד!', gx, gy - 13);
}
