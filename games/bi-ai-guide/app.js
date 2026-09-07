/**
 * BI & AI Survival Game: App Logic (v9 - ETL Fix)
 */

let activeStreamInterval = null;
let particleIdCounter = 0;

// --- Global State ---
const state = {
    wisdom: 0,
    confusion: 100,
    character: 'clueless',
    currentZone: 'zone-welcome',
    
    // User info
    studentName: '',
    studentEmail: '',
    eligibleForCertificate: true,
    
    // Zone 2 (ETL)
    etlStep: 'idle',
    extractedCount: 0,
    botsFilteredCount: 0,
    cleanLoadedCount: 0,
    particles: [],
    
    // Quiz state
    quizIndex: 0,
    quizScore: 0
};

// --- Dom Elements ---
const dom = {
    wisdomVal: document.getElementById('wisdom-score'),
    confusionVal: document.getElementById('confusion-level'),
    stepBtns: document.querySelectorAll('.step-btn'),
    sections: document.querySelectorAll('.game-section'),
    
    // Onboarding
    studentNameInput: document.getElementById('student-name'),
    studentEmailInput: document.getElementById('student-email'),
    charCards: document.querySelectorAll('.char-card'),
    startGameBtn: document.getElementById('start-game-btn'),
    
    // Slide deck (Learning Lounge)
    learnTabBtns: document.querySelectorAll('.learn-tab-btn'),
    learningSlides: document.querySelectorAll('.learning-slide'),
    finishLearningBtn: document.getElementById('btn-finish-learning'),
    
    // Zone 2 (Traditional vs BI)
    featuresPool: document.getElementById('features-pool'),
    boxTraditional: document.getElementById('box-traditional'),
    boxBi: document.getElementById('box-bi'),
    checkZone1Btn: document.getElementById('check-zone1-btn'),
    nextZone2Btn: document.getElementById('next-zone2-btn'),
    btnResetZone1: document.getElementById('btn-reset-zone1'),
    
    // Zone 3 (ETL)
    btnEtlExtract: document.getElementById('btn-etl-extract'),
    btnEtlTransformPhase: document.getElementById('btn-etl-transform-phase'),
    btnEtlLoad: document.getElementById('btn-etl-load'),
    pipelinePipeElement: document.getElementById('pipeline-pipe-element'),
    pipelineStream: document.getElementById('pipeline-stream'),
    transformGridView: document.getElementById('transform-grid-view'),
    transformItemsPool: document.getElementById('transform-items-pool'),
    kpiGaugeFill: document.getElementById('kpi-gauge-fill'),
    kpiGaugeVal: document.getElementById('kpi-gauge-val'),
    statTotalExtracted: document.getElementById('stat-total-extracted'),
    statBotsFiltered: document.getElementById('stat-bots-filtered'),
    statLoadedRecords: document.getElementById('stat-loaded-records'),
    nextZone3Btn: document.getElementById('next-zone3-btn'),
    btnResetZone2: document.getElementById('btn-reset-zone2'),
    
    // Zone 4 (AI/ML/DL)
    tabBtns: document.querySelectorAll('.tab-btn'),
    tabContents: document.querySelectorAll('.tab-content'),
    excelRating: document.getElementById('excel-rating'),
    excelAttendance: document.getElementById('excel-attendance'),
    excelResult: document.getElementById('excel-result'),
    btnTrainMl: document.getElementById('btn-train-ml'),
    mlTrainingLog: document.getElementById('ml-training-log'),
    mlLogContent: document.getElementById('ml-log-content'),
    btnBombardDl: document.getElementById('btn-bombard-dl'),
    dlCanvas: document.getElementById('dl-canvas'),
    dlStatus: document.getElementById('dl-status'),
    dlFeaturesBox: document.getElementById('dl-features-box'),
    nextZone4Btn: document.getElementById('next-zone4-btn'),
    btnResetZone3: document.getElementById('btn-reset-zone3'),
    
    // Zone 5 (Quiz)
    questionText: document.getElementById('question-text'),
    answersContainer: document.getElementById('answers-container'),
    quizFeedback: document.getElementById('quiz-feedback'),
    feedbackStatusTitle: document.getElementById('feedback-status-title'),
    memeVisual: document.getElementById('meme-visual'),
    memeTextT: document.getElementById('meme-text-t'),
    memeTextB: document.getElementById('meme-text-b'),
    explanationContent: document.getElementById('explanation-content'),
    btnNextQuestion: document.getElementById('btn-next-question'),
    currentQuestionNum: document.getElementById('current-question-num'),
    totalQuestionsNum: document.getElementById('total-questions-num'),
    
    // Certificate / Victory
    certNameVal: document.getElementById('cert-name-val'),
    certEmailVal: document.getElementById('cert-email-val'),
    certPrintArea: document.getElementById('certificate-print-area'),
    certBlockedCard: document.getElementById('cert-blocked-card'),
    btnPrintCertificate: document.getElementById('btn-print-certificate')
};

// --- Navigation Steps Click Listeners (Skip Logic) ---
dom.stepBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.dataset.target;
        
        if (btn.classList.contains('locked')) {
            if (!state.studentName || !state.studentEmail) {
                alert('אנא הזינו קודם שם מלא ואימייל במסך הרישום!');
                return;
            }
            
            const confirmSkip = confirm('⚠️ שים לב: דילוג קדימה יבטל את זכאותך לקבלת תעודת הסמכה רשמית מד״ר צבאן בסיום! האם ברצונך לדלג בכל זאת?');
            if (confirmSkip) {
                state.eligibleForCertificate = false;
                btn.classList.remove('locked');
                
                if (target === 'zone-traditional-bi') {
                    initZone1();
                } else if (target === 'zone-etl-simulator') {
                    resetZone2();
                } else if (target === 'zone-ai-ml-dl') {
                    resetZone3();
                } else if (target === 'zone-survival-quiz') {
                    loadQuizQuestion();
                }
                
                navigateTo(target);
            }
        } else {
            navigateTo(target);
        }
    });
});

// --- Onboarding & Registration ---
dom.charCards.forEach(card => {
    card.addEventListener('click', () => {
        dom.charCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        state.character = card.dataset.char;
        
        if (state.character === 'clueless') {
            state.confusion = 120;
            state.wisdom = 0;
        } else if (state.character === 'excel-pro') {
            state.confusion = 90;
            state.wisdom = 15;
        } else if (state.character === 'ai-hype') {
            state.confusion = 100;
            state.wisdom = 10;
        }
        updateScoreboard();
    });
});

dom.startGameBtn.addEventListener('click', () => {
    const name = dom.studentNameInput.value.trim();
    const email = dom.studentEmailInput.value.trim();
    
    if (!name || !email) {
        alert('אנא הזינו שם מלא ואימייל כדי שנוכל להנפיק לכם תעודת הסמכה בסיום!');
        return;
    }
    
    state.studentName = name;
    state.studentEmail = email;
    
    unlockSection('zone-learning-lounge', 'nav-learning');
    navigateTo('zone-learning-lounge');
});

function updateScoreboard() {
    dom.wisdomVal.textContent = state.wisdom;
    dom.confusionVal.textContent = state.confusion + '%';
    if (state.confusion <= 30) {
        dom.confusionVal.className = 'score-value status-low';
    } else if (state.confusion >= 90) {
        dom.confusionVal.className = 'score-value status-high';
    } else {
        dom.confusionVal.className = 'score-value';
    }
}

function navigateTo(zoneId) {
    dom.sections.forEach(section => {
        section.classList.remove('active');
    });
    const activeSection = document.getElementById(zoneId);
    activeSection.classList.add('active');
    state.currentZone = zoneId;
    
    dom.stepBtns.forEach(btn => {
        if (btn.dataset.target === zoneId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    if (zoneId === 'zone-ai-ml-dl') {
        initDlNetwork();
    }
    
    // Update mascot helper tip when navigating to a new zone
    showMascotTip(zoneId);
}

// --- Mascot Helper Logic (Dr. Tsaban Clone) ---
const mascot = document.getElementById('mascot-helper');
const mascotTooltip = document.getElementById('mascot-tooltip');
let mascotBubbleTimer = null;

const mascotTips = {
    'zone-welcome': [
        "היי! 👋 אני ד״ר צבאן הקטן. לחץ עליי בכל שלב לרמזים!",
        "תרשמו שם ואימייל למעלה, ואם אתם אמיצים — תבחרו דמות 🤷‍♂️",
        "מי שלא מדלג מקבל תעודה חתומה על ידי! 🎓"
    ],
    'zone-learning-lounge': [
        "אל תרוצו! המשל של מכולת הרצל יציל אתכם בבוחן 🛒",
        "מערכת של פעם = עבר בלבד. BI = עתיד! 🔮",
        "סלט פירות ענק = צינור ETL. ככה פשוט 🥗"
    ],
    'zone-traditional-bi': [
        "לחצו על הכרטיסיות כדי להעביר אותן בין הקטגוריות! 👆",
        "טיקטוק ומזג אוויר? ברור שזה BI ולא קלאסי! 📱",
        "דוחות קשיחים? שנות ה-80 רוצות את זה בחזרה 📼"
    ],
    'zone-etl-simulator': [
        "שלב 1: שלוף פירות 🍎 → שלב 2: זרוק רקובים 🗑️ → שלב 3: טען! 📊",
        "הפירות האדומים = ספאם ובוטים. תלחץ עליהם להעיף! 🤖",
        "אחרי הניקוי כפתור Load יופיע ותראה את ה-KPI טס! 📈"
    ],
    'zone-ai-ml-dl': [
        "נוסחת אקסל = AI הכי בסיסי. כן, גם IF זה AI! 🤯",
        "בML אתה מציע פרמטרים. המכונה מחליטה מי באמת חשוב 🧠",
        "בDL פשוט תפציץ מידע גולמי. המכונה תבין לבד כמו תינוק 👶"
    ],
    'zone-survival-quiz': [
        "10 שאלות בינך לבין התעודה. בהצלחה! 🍀",
        "תחשוב על המשלים שלמדת, הם המפתח לתשובות! 🔑",
        "טעית? לא נורא, הבננה שלי תעודד אותך 🍌"
    ],
    'zone-victory': [
        "איזה אלוף/ה! מגיעה לך התעודה. תמסגר! 🖼️",
        "ישר לקורות החיים עם ההסמכה הזו! 📄",
        "ניצחת את הבירוקרטיה! 🏆 סע/י לשלום!"
    ]
};

function showMascotTip(zoneId) {
    if (!mascotTooltip) return;
    const tips = mascotTips[zoneId] || ["אני איתך! לחץ עליי לרמזים 💡"];
    mascotTooltip.textContent = tips[Math.floor(Math.random() * tips.length)];
    mascotTooltip.style.display = 'block';
    
    if (mascotBubbleTimer) clearTimeout(mascotBubbleTimer);
    mascotBubbleTimer = setTimeout(() => {
        mascotTooltip.style.display = 'none';
    }, 6000);
}

function hideMascotTip() {
    if (!mascotTooltip) return;
    mascotTooltip.style.display = 'none';
    if (mascotBubbleTimer) clearTimeout(mascotBubbleTimer);
}

// Drag + Click logic
if (mascot) {
    let dragged = false;
    let sx, sy, ox, oy;
    
    mascot.addEventListener('mousedown', onDown);
    mascot.addEventListener('touchstart', onDown, { passive: false });

    function onDown(e) {
        dragged = false;
        const ev = e.touches ? e.touches[0] : e;
        sx = ev.clientX;
        sy = ev.clientY;
        const r = mascot.getBoundingClientRect();
        ox = r.left;
        oy = r.top;
        mascot.style.bottom = 'auto';
        mascot.style.left = ox + 'px';
        mascot.style.top = oy + 'px';
        
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
        document.addEventListener('touchmove', onMove, { passive: false });
        document.addEventListener('touchend', onUp);
    }

    function onMove(e) {
        const ev = e.touches ? e.touches[0] : e;
        const dx = ev.clientX - sx;
        const dy = ev.clientY - sy;
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) dragged = true;
        if (!dragged) return;
        
        let nl = ox + dx, nt = oy + dy;
        nl = Math.max(0, Math.min(nl, window.innerWidth - 65));
        nt = Math.max(0, Math.min(nt, window.innerHeight - 65));
        mascot.style.left = nl + 'px';
        mascot.style.top = nt + 'px';
        if (e.cancelable) e.preventDefault();
    }

    function onUp() {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onUp);
        
        if (!dragged) {
            // It was a click, not a drag — toggle bubble
            if (mascotTooltip.style.display === 'block') {
                hideMascotTip();
            } else {
                showMascotTip(state.currentZone);
            }
        }
    }
    
    // Show welcome tip after 2 seconds
    setTimeout(() => showMascotTip('zone-welcome'), 2000);
}

function unlockSection(zoneId, navBtnId) {
    const navBtn = document.getElementById(navBtnId);
    if (navBtn) {
        navBtn.classList.remove('locked');
    }
}

// --- Slide Deck Navigation ---
dom.learnTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        dom.learnTabBtns.forEach(b => b.classList.remove('active'));
        dom.learningSlides.forEach(s => s.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(btn.dataset.slide).classList.add('active');
    });
});

dom.finishLearningBtn.addEventListener('click', () => {
    unlockSection('zone-traditional-bi', 'nav-traditional-bi');
    navigateTo('zone-traditional-bi');
    initZone1();
});

// --- Zone 2: Traditional vs BI Drag-Drop & Clicks ---
const comparisonFeatures = [
    { id: 'f1', text: 'מקור יחיד ומובנה (למשל רק קובצי Excel של הארגון)', type: 'traditional' },
    { id: 'f2', text: 'ריבוי מקורות (רשתות חברתיות, פינטק, מזג אוויר)', type: 'bi' },
    { id: 'f3', text: 'דוח סטטי, פקודות יומן סגורות של פעם', type: 'traditional' },
    { id: 'f4', text: 'דאשבורדים ויזואליים ולוחות מחוונים (Tableau)', type: 'bi' },
    { id: 'f5', text: 'תחזיות לעתיד והשלכות הפעילות בעתיד', type: 'bi' },
    { id: 'f6', text: 'עיבוד ליניארי מוגדר מראש וקשיח', type: 'traditional' },
    { id: 'f7', text: 'שימוש בכלי ETL (Extract, Transform, Load)', type: 'bi' },
    { id: 'f8', text: 'מדדי ביצוע מוגדרים (KPIs) להצגה גרפית', type: 'bi' }
];

let zone1Selections = {};

function initZone1() {
    dom.featuresPool.innerHTML = '';
    document.getElementById('features-traditional').innerHTML = '';
    document.getElementById('features-bi').innerHTML = '';
    zone1Selections = {};
    
    const shuffled = [...comparisonFeatures].sort(() => Math.random() - 0.5);
    shuffled.forEach(feat => {
        const card = document.createElement('div');
        card.className = 'feature-card';
        card.id = feat.id;
        card.textContent = feat.text;
        card.setAttribute('draggable', 'true');
        
        card.addEventListener('click', () => {
            moveCard(feat.id);
        });
        
        card.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', feat.id);
            card.classList.add('dragging');
        });
        
        card.addEventListener('dragend', () => {
            card.classList.remove('dragging');
        });
        
        dom.featuresPool.appendChild(card);
    });
}

function moveCard(cardId, targetContainer = null) {
    const card = document.getElementById(cardId);
    const feat = comparisonFeatures.find(f => f.id === cardId);
    if (!card || !feat) return;
    
    if (targetContainer === 'traditional') {
        zone1Selections[cardId] = 'traditional';
        card.className = 'feature-card placed-tr';
        document.getElementById('features-traditional').appendChild(card);
    } else if (targetContainer === 'bi') {
        zone1Selections[cardId] = 'bi';
        card.className = 'feature-card placed-bi';
        document.getElementById('features-bi').appendChild(card);
    } else {
        if (!zone1Selections[cardId]) {
            moveCard(cardId, 'traditional');
        } else if (zone1Selections[cardId] === 'traditional') {
            moveCard(cardId, 'bi');
        } else {
            delete zone1Selections[cardId];
            card.className = 'feature-card';
            dom.featuresPool.appendChild(card);
        }
    }
}

const dropTargets = [
    { el: dom.boxTraditional, type: 'traditional' },
    { el: dom.boxBi, type: 'bi' }
];

dropTargets.forEach(target => {
    target.el.addEventListener('dragover', (e) => {
        e.preventDefault();
        target.el.classList.add('dragover');
    });
    
    target.el.addEventListener('dragleave', () => {
        target.el.classList.remove('dragover');
    });
    
    target.el.addEventListener('drop', (e) => {
        e.preventDefault();
        target.el.classList.remove('dragover');
        const cardId = e.dataTransfer.getData('text/plain');
        if (cardId) {
            moveCard(cardId, target.type);
        }
    });
});

dom.btnResetZone1.addEventListener('click', () => {
    initZone1();
    dom.checkZone1Btn.classList.remove('disabled');
    dom.nextZone2Btn.classList.add('disabled');
});

dom.checkZone1Btn.addEventListener('click', () => {
    let allCorrect = true;
    let correctCount = 0;
    
    comparisonFeatures.forEach(feat => {
        const card = document.getElementById(feat.id);
        const userChoice = zone1Selections[feat.id];
        
        if (userChoice === feat.type) {
            card.className = 'feature-card correct';
            correctCount++;
        } else {
            card.className = 'feature-card incorrect';
            allCorrect = false;
            setTimeout(() => {
                card.className = 'feature-card';
                delete zone1Selections[feat.id];
                dom.featuresPool.appendChild(card);
            }, 1500);
        }
    });
    
    if (correctCount > 0) {
        state.wisdom += correctCount * 5;
        state.confusion = Math.max(0, state.confusion - correctCount * 8);
        updateScoreboard();
    }
    
    if (allCorrect) {
        dom.checkZone1Btn.classList.add('disabled');
        dom.nextZone2Btn.classList.remove('disabled');
        unlockSection('zone-etl-simulator', 'nav-etl');
    }
});

dom.nextZone2Btn.addEventListener('click', () => {
    navigateTo('zone-etl-simulator');
});

// --- Zone 3: ETL Pipeline Simulator ---
function resetZone2() {
    if (activeStreamInterval) clearInterval(activeStreamInterval);
    state.etlStep = 'idle';
    state.extractedCount = 0;
    state.botsFilteredCount = 0;
    state.cleanLoadedCount = 0;
    state.particles = [];
    
    dom.btnEtlExtract.classList.remove('disabled');
    dom.btnEtlTransformPhase.classList.add('hidden');
    dom.btnEtlLoad.classList.add('hidden');
    dom.btnEtlLoad.classList.remove('disabled');
    
    dom.pipelinePipeElement.classList.remove('hidden');
    dom.transformGridView.classList.add('hidden');
    dom.transformItemsPool.innerHTML = '';
    
    dom.pipelineStream.innerHTML = '<div class="empty-pipeline-text">הקטיף טרם החל. לחצו על "שלוף נתונים" כדי להתחיל!</div>';
    
    document.getElementById('etl-step-extract').classList.remove('active');
    document.getElementById('etl-step-transform').classList.remove('active');
    document.getElementById('etl-step-load').classList.remove('active');
    
    dom.statTotalExtracted.textContent = '0';
    dom.statBotsFiltered.textContent = '0';
    dom.statLoadedRecords.textContent = '0';
    updateGauge(0);
    dom.nextZone3Btn.classList.add('disabled');
}

dom.btnResetZone2.addEventListener('click', resetZone2);

dom.btnEtlExtract.addEventListener('click', () => {
    if (state.etlStep !== 'idle') return;
    
    state.etlStep = 'extract';
    dom.btnEtlExtract.classList.add('disabled');
    document.getElementById('etl-step-extract').classList.add('active');
    
    dom.pipelineStream.innerHTML = '';
    state.particles = [];
    state.extractedCount = 0;
    dom.statTotalExtracted.textContent = '0';
    
    const maxParticles = 12;
    let generated = 0;
    
    if (activeStreamInterval) clearInterval(activeStreamInterval);
    
    activeStreamInterval = setInterval(() => {
        if (generated >= maxParticles) {
            clearInterval(activeStreamInterval);
            activeStreamInterval = null;
            // Show transform button after last fruit has had time to travel
            setTimeout(() => {
                dom.btnEtlTransformPhase.classList.remove('hidden');
            }, 1500);
            return;
        }
        spawnParticle();
        generated++;
    }, 300);
});

const particleTypes = [
    { label: 'בננה בשלה 🍌', isBot: false },
    { label: 'תפוח טרי 🍎', isBot: false },
    { label: 'תפוז עסיסי 🍊', isBot: false },
    { label: 'פרי רקוב 🗑️', isBot: true },
    { label: 'בוט ספאם 🤖', isBot: true },
    { label: 'בננה רקובה 🗑️', isBot: true },
    { label: 'אפרסק מתוק 🍑', isBot: false },
    { label: 'ענב מתוק 🍇', isBot: false },
    { label: 'נתון כפול 🔁', isBot: true }
];

function spawnParticle() {
    const proto = particleTypes[Math.floor(Math.random() * particleTypes.length)];
    const p = {
        id: 'p-' + (particleIdCounter++),
        label: proto.label,
        isBot: proto.isBot
    };
    
    state.particles.push(p);
    state.extractedCount++;
    dom.statTotalExtracted.textContent = state.extractedCount;
    
    const el = document.createElement('div');
    el.id = p.id;
    el.className = `data-particle ${p.isBot ? 'spam' : 'insight'}`;
    el.innerHTML = `<span>${p.label}</span>`;
    
    // Position: start from the LEFT side (inlet is on right in the HTML, but visually
    // we slide from right side of pipe-body to the left)
    const pipeH = dom.pipelineStream.clientHeight || 100;
    const topPx = Math.floor(Math.random() * (pipeH - 60)) + 4;
    el.style.position = 'absolute';
    el.style.top = topPx + 'px';
    el.style.right = '-60px';   // start hidden off-right
    
    dom.pipelineStream.appendChild(el);
    
    // Animate: slide from right to left
    const pipeW = dom.pipelineStream.clientWidth || 300;
    let pos = -60; // starting right value (negative = off-screen right)
    const speed = 6; // px per tick
    const targetRight = pipeW + 10; // stop when fully off the left side
    
    const mover = setInterval(() => {
        if (!el.parentNode) { clearInterval(mover); return; }
        pos += speed;
        el.style.right = pos + 'px';
        if (pos > targetRight) {
            clearInterval(mover);
        }
    }, 20);
}

dom.btnEtlTransformPhase.addEventListener('click', () => {
    state.etlStep = 'transform';
    dom.btnEtlTransformPhase.classList.add('hidden');
    
    document.getElementById('etl-step-extract').classList.remove('active');
    document.getElementById('etl-step-transform').classList.add('active');
    
    dom.pipelinePipeElement.classList.add('hidden');
    dom.transformGridView.classList.remove('hidden');
    
    renderTransformCards();
});

function renderTransformCards() {
    dom.transformItemsPool.innerHTML = '';
    
    state.particles.forEach(p => {
        const itemCard = document.createElement('div');
        itemCard.className = `transform-item-card ${p.isBot ? 'spam' : 'insight'}`;
        itemCard.id = 'grid-' + p.id;
        itemCard.innerHTML = `<span>${p.label}</span>`;
        
        itemCard.addEventListener('click', () => {
            if (p.isBot) {
                itemCard.style.transform = 'scale(0)';
                setTimeout(() => itemCard.remove(), 150);
                
                state.particles = state.particles.filter(item => item.id !== p.id);
                state.botsFilteredCount++;
                dom.statBotsFiltered.textContent = state.botsFilteredCount;
                
                checkIfLoadReady();
            }
        });
        
        dom.transformItemsPool.appendChild(itemCard);
    });
    
    checkIfLoadReady();
}

function checkIfLoadReady() {
    const botsLeft = state.particles.some(item => item.isBot);
    if (!botsLeft) {
        state.etlStep = 'load';
        document.getElementById('etl-step-transform').classList.remove('active');
        document.getElementById('etl-step-load').classList.add('active');
        dom.btnEtlLoad.classList.remove('hidden');
    }
}

dom.btnEtlLoad.addEventListener('click', () => {
    if (state.etlStep !== 'load') return;
    
    state.etlStep = 'complete';
    dom.btnEtlLoad.classList.add('disabled');
    
    const cleanParticles = state.particles.filter(p => !p.isBot);
    let loaded = 0;
    
    dom.transformGridView.classList.add('hidden');
    dom.pipelinePipeElement.classList.remove('hidden');
    dom.pipelineStream.innerHTML = '<div style="text-align:center; padding-top:40px; font-weight:bold; color:var(--primary-blue);">טוען נתונים נקיים ל-Tableau... ⏳</div>';
    
    const loadInterval = setInterval(() => {
        if (cleanParticles.length === 0 || loaded >= cleanParticles.length) {
            clearInterval(loadInterval);
            dom.pipelineStream.innerHTML = '<div style="text-align:center; padding-top:40px; font-weight:bold; color:var(--color-green);">כל הנתונים נטענו בהצלחה! ✅</div>';
            dom.nextZone3Btn.classList.remove('disabled');
            unlockSection('zone-ai-ml-dl', 'nav-ai');
            state.wisdom += 30;
            state.confusion = Math.max(0, state.confusion - 25);
            updateScoreboard();
            return;
        }
        
        state.cleanLoadedCount++;
        dom.statLoadedRecords.textContent = state.cleanLoadedCount;
        
        const progressPercent = Math.min(100, Math.floor((state.cleanLoadedCount / (state.extractedCount - state.botsFilteredCount)) * 100));
        updateGauge(progressPercent);
        
        loaded++;
    }, 250);
});

function updateGauge(val) {
    dom.kpiGaugeVal.textContent = val + '%';
    const offset = 126 - (126 * val) / 100;
    dom.kpiGaugeFill.style.strokeDashoffset = offset;
}

dom.nextZone3Btn.addEventListener('click', () => {
    navigateTo('zone-ai-ml-dl');
});

// --- Zone 4: AI / ML / DL Tabbed Simulations ---
dom.tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        dom.tabBtns.forEach(b => b.classList.remove('active'));
        dom.tabContents.forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
    });
});

function updateExcelFormula() {
    const rating = parseFloat(dom.excelRating.value) || 0;
    const attendance = parseInt(dom.excelAttendance.value) || 0;
    
    if (rating >= 4.0 && attendance >= 80) {
        dom.excelResult.textContent = "מצטיין! 🎉";
        dom.excelResult.style.color = "var(--color-green)";
    } else {
        dom.excelResult.textContent = "להשתפר ⛔";
        dom.excelResult.style.color = "var(--color-red)";
    }
}
dom.excelRating.addEventListener('input', updateExcelFormula);
dom.excelAttendance.addEventListener('input', updateExcelFormula);

dom.btnTrainMl.addEventListener('click', () => {
    dom.mlTrainingLog.classList.remove('hidden');
    dom.mlLogContent.innerHTML = '';
    
    const logs = [
        'Setting up ML regression matrix...',
        'Mapping input metadata features...',
        'Calculating correlation vectors on 1000 items...'
    ];
    
    let index = 0;
    function printNextLog() {
        if (index < logs.length) {
            const line = document.createElement('div');
            line.textContent = `> ${logs[index]}`;
            dom.mlLogContent.appendChild(line);
            dom.mlLogContent.scrollTop = dom.mlLogContent.scrollHeight;
            index++;
            setTimeout(printNextLog, 600);
        } else {
            const hasHeight = document.getElementById('param-height').checked;
            const hasHair = document.getElementById('param-hair').checked;
            const hasComplexity = document.getElementById('param-complexity').checked;
            const hasMethod = document.getElementById('param-method').checked;
            
            setTimeout(() => {
                const results = [];
                if (hasHeight) results.push(' גובה מרצה: השפעה 0.0% (לא משפיע כלל!)');
                if (hasHair) results.push(' צפיפות שיער: השפעה 0.02% (חוקרים טוענים שקשר אינו קיים)');
                if (hasComplexity) results.push(' מורכבות הקורס: השפעה 45% (מודל ML מצא מתאם שלילי מובהק)');
                if (hasMethod) results.push(' רמת הומור: השפעה 55% (מודל ML זיהה השפעה חיובית ישירה)');
                
                results.forEach(res => {
                    const line = document.createElement('div');
                    line.textContent = `[ML Analysis] ${res}`;
                    line.style.color = res.includes('גובה') || res.includes('שיער') ? 'var(--color-red)' : 'var(--color-green)';
                    dom.mlLogContent.appendChild(line);
                });
                
                const lineFinal = document.createElement('div');
                lineFinal.textContent = `> מודל ה-ML סיים. הפרמטרים שהגדרנו נמדדו והוכחה יעילותם!`;
                lineFinal.style.fontWeight = 'bold';
                lineFinal.style.color = '#fff';
                dom.mlLogContent.appendChild(lineFinal);
                dom.mlLogContent.scrollTop = dom.mlLogContent.scrollHeight;
                
                checkDlAndMlDone();
            }, 800);
        }
    }
    printNextLog();
});

let dlCanvasCtx = null;
let dlNodes = [];
let dlParticles = [];
let dlAnimationId = null;
let dlFeaturesUnlocked = false;

function initDlNetwork() {
    const canvas = dom.dlCanvas;
    dlCanvasCtx = canvas.getContext('2d');
    
    const layers = [3, 4, 4, 2];
    dlNodes = [];
    
    const layerWidth = canvas.width / (layers.length + 1);
    
    layers.forEach((count, lIdx) => {
        const x = layerWidth * (lIdx + 1);
        const yGap = canvas.height / (count + 1);
        
        for (let i = 0; i < count; i++) {
            dlNodes.push({
                x: x,
                y: yGap * (i + 1),
                layer: lIdx,
                pulse: Math.random() * Math.PI
            });
        }
    });
    
    if (dlAnimationId) cancelAnimationFrame(dlAnimationId);
    animateDlNetwork();
}

function animateDlNetwork() {
    const ctx = dlCanvasCtx;
    const canvas = dom.dlCanvas;
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.15)';
    ctx.lineWidth = 1;
    for (let i = 0; i < dlNodes.length; i++) {
        for (let j = 0; j < dlNodes.length; j++) {
            if (dlNodes[j].layer === dlNodes[i].layer + 1) {
                ctx.beginPath();
                ctx.moveTo(dlNodes[i].x, dlNodes[i].y);
                ctx.lineTo(dlNodes[j].x, dlNodes[j].y);
                ctx.stroke();
            }
        }
    }
    
    dlParticles.forEach((p, idx) => {
        p.progress += 0.025;
        if (p.progress >= 1) {
            const nextNodes = dlNodes.filter(n => n.layer === p.currentLayer + 1);
            if (nextNodes.length > 0) {
                p.currentLayer++;
                p.progress = 0;
                p.startX = p.endX;
                p.startY = p.endY;
                const targetNode = nextNodes[Math.floor(Math.random() * nextNodes.length)];
                p.endX = targetNode.x;
                p.endY = targetNode.y;
            } else {
                dlParticles.splice(idx, 1);
            }
        }
        
        const curX = p.startX + (p.endX - p.startX) * p.progress;
        const curY = p.startY + (p.endY - p.startY) * p.progress;
        
        ctx.fillStyle = 'var(--primary-purple)';
        ctx.beginPath();
        ctx.arc(curX, curY, 3, 0, Math.PI * 2);
        ctx.fill();
    });
    
    dlNodes.forEach(node => {
        node.pulse += 0.05;
        const glow = Math.abs(Math.sin(node.pulse)) * 3 + 2;
        ctx.fillStyle = 'rgba(139, 92, 246, 0.9)';
        ctx.shadowColor = 'var(--primary-purple)';
        ctx.shadowBlur = glow;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    });
    
    dlAnimationId = requestAnimationFrame(animateDlNetwork);
}

dom.btnBombardDl.addEventListener('click', () => {
    dom.dlStatus.textContent = 'מפציץ בנתונים גולמיים (למידה עצמאית)...';
    
    for (let i = 0; i < 40; i++) {
        setTimeout(() => {
            const startNodes = dlNodes.filter(n => n.layer === 0);
            const startNode = startNodes[Math.floor(Math.random() * startNodes.length)];
            const targetNodes = dlNodes.filter(n => n.layer === 1);
            const targetNode = targetNodes[Math.floor(Math.random() * targetNodes.length)];
            
            dlParticles.push({
                startX: startNode.x,
                startY: startNode.y,
                endX: targetNode.x,
                endY: targetNode.y,
                currentLayer: 0,
                progress: 0
            });
        }, i * 70);
    }
    
    setTimeout(() => {
        dom.dlStatus.textContent = 'למידה עמוקה הושלמה באופן עצמאי! 🏆';
        dom.dlFeaturesBox.classList.remove('hidden');
        dlFeaturesUnlocked = true;
        checkDlAndMlDone();
    }, 3500);
});

function checkDlAndMlDone() {
    if (dom.mlLogContent.children.length > 0 && dlFeaturesUnlocked) {
        dom.nextZone4Btn.classList.remove('disabled');
        unlockSection('zone-survival-quiz', 'nav-quiz');
        state.wisdom += 30;
        state.confusion = Math.max(0, state.confusion - 25);
        updateScoreboard();
    }
}

function resetZone3() {
    dom.mlTrainingLog.classList.add('hidden');
    dom.mlLogContent.innerHTML = '';
    
    dom.dlStatus.textContent = 'ממתין להפגזת מידע...';
    dom.dlFeaturesBox.classList.add('hidden');
    dlFeaturesUnlocked = false;
    
    initDlNetwork();
    dom.nextZone4Btn.classList.add('disabled');
}
dom.btnResetZone3.addEventListener('click', resetZone3);

dom.nextZone4Btn.addEventListener('click', () => {
    navigateTo('zone-survival-quiz');
    loadQuizQuestion();
});

// --- Zone 5: Quiz (10 Hebrew Questions) ---
const quizQuestions = [
    {
        question: "מהי הגדרת הליבה של בינה עסקית (Business Intelligence - BI)?",
        answers: [
            { text: "א. כתיבת קוד לבניית אתרי אינטרנט שיווקיים", correct: false },
            { text: "ב. שיטות לאסוף, לארגן ולהנגיש מידע למקבלי החלטות לשיפור הפעילות העסקית", correct: true },
            { text: "ג. תכנון גיליונות Excel פשוטים בלבד לשם תיעוד חשבונאי", correct: false },
            { text: "ד. שימוש ברובוטים פיזיים במפעלים תעשייתיים", correct: false }
        ],
        explanation: "נכון מאוד! בינה עסקית עוסקת בדרכים ובשיטות לאיסוף, ארגון והנגשת מידע למקבלי החלטות לשיפור הפעילות העסקית.",
        memeTop: "הרצל מהמכולת שומע",
        memeBottom: "שבינה עסקית זה לא רק אקסל קבלה"
    },
    {
        question: "טענה 1: מערכות בינה עסקית מתמחות בשליפת נתונים מתוך קבצי Excel מובנים בארגון, שמהווים את מקור המידע המרכזי לבינה עסקית וקבלת החלטות\nטענה 2: מערכות בינה עסקית מתמקדות בהצגה גרפית של נתונים על בסיס מדדי ביצוע KPIs\nטענה 3: מערכות בינה עסקית מסוגלות להתמודד עם מגוון רחב של נתונים – כל עוד הם מסודרים ומובנים היטב עוד לפני שהמערכת ניגשה אליהם\n\nמהי הטענה הנכונה?",
        answers: [
            { text: "א. טענה 1 בלבד", correct: false },
            { text: "ב. טענה 2 בלבד", correct: true },
            { text: "ג. טענה 3 בלבד", correct: false },
            { text: "ד. טענות 2 ו-3", correct: false }
        ],
        explanation: "תשובה ב' היא הנכונה! טענה 1 שגויה כי BI לא מסתפק באקסל אלא מחבר מקורות מגוונים. טענה 3 שגויה כי ה-ETL של BI יודע לנקות ולסדר מידע מבולגן, הוא לא חייב לקבל אותו מושלם מראש.",
        memeTop: "ד״ר צבאן רואה שכתבת",
        memeBottom: "ש-BI משתמש רק באקסל מסודר"
    },
    {
        question: "איזו מהחלופות הבאות מתארת בצורה מדויקת את ההבדל בין מערכת מידע מסורתית למערכת BI?",
        answers: [
            { text: "א. מערכת מסורתית פועלת בצורה ליניארית וסטטית; מערכת BI מתחילה מצורכי המשתמש, היא דינמית ומייצרת תחזיות", correct: true },
            { text: "ב. מערכת מסורתית היא מורכבת יותר ומשתמשת ברשתות חברתיות; מערכת BI היא פשוטה ואינה משתמשת ברשת", correct: false },
            { text: "ג. מערכת BI משתמשת רק במידע היסטורי; מערכת מסורתית מייצרת תחזיות עתיד", correct: false },
            { text: "ד. אין שום הבדל ביניהן, מדובר באותו מושג בדיוק", correct: false }
        ],
        explanation: "נכון מאוד! המערכת המסורתית מקבלת הגדרת מידע, אוספת ומעבדת (ליניארי וקשיח). מערכת BI מתוכננת סביב צורכי מקבלי ההחלטות, היא דינמית ומייצרת תחזיות עתיד.",
        memeTop: "הסטודנט המבולבל קולט",
        memeBottom: "שהמערכת המסורתית היא דינמית כמו קרטון"
    },
    {
        question: "מהו התפקיד המרכזי של שלב ה-Transform בצינור ה-ETL?",
        answers: [
            { text: "א. שליפת הנתונים הגולמיים ממקורות המידע החיצוניים בלבד", correct: false },
            { text: "ב. עיבוד, ניקוי, סינון בוטים וסידור הנתונים לפורמט המתאים", correct: true },
            { text: "ג. שמירת הנתונים הסופיים בקובצי Excel של החברה", correct: false },
            { text: "ד. הדפסת הדוחות הכספיים ושליחתם למנהלי הארגון", correct: false }
        ],
        explanation: "מצוין! Transform הוא שלב העיבוד והניקוי (סינון בוטים, מיון, פילטרים וסיכומים) המכין את המידע לטעינה.",
        memeTop: "כשאתה מנקה בוטים ב-Transform",
        memeBottom: "והם מנסים לשלוח לך ספאם על קריפטו"
    },
    {
        question: "מהו הפירוש המלא של ראשי התיבות KPIs במערכות BI?",
        answers: [
            { text: "א. Key Performance Indicators - מדדי ביצוע עיקריים", correct: true },
            { text: "ב. Kernel Processing Information - עיבוד מידע ליבה", correct: false },
            { text: "ג. Keyboard Protocol Interface - ממשק מקלדת רשמי", correct: false },
            { text: "ד. Key Predictive Insights - תובנות חיזוי מפתח", correct: false }
        ],
        explanation: "מדדי ביצוע עיקריים (Key Performance Indicators) הם מדדים כמותיים המוצגים בפאנל השליטה ועוזרים להבין היכן אנו עומדים ביחס ליעדים.",
        memeTop: "המנהל רואה שה-KPI שלך",
        memeBottom: "נמצא עמוק באזור האדום"
    },
    {
        question: "כיצד מוגדרת מערכת Tableau לפי חומר הלימוד?",
        answers: [
            { text: "א. כלי המאפשר להתחבר למאגרי מידע ולייצר גרפים ומסכי ניהול ייעודיים (Tableau Dashboard)", correct: true },
            { text: "ב. תוכנה לבניית מצגות המבוססת על בינה מלאכותית יוצרת", correct: false },
            { text: "ג. שפת תכנות לבניית אפליקציות מובייל", correct: false },
            { text: "ד. מסד נתונים פנימי השומר קבצים מוגנים בלבד", correct: false }
        ],
        explanation: "נכון! הדגמנו את Tableau בתור מערכת המתחברת למקורות מידע ומייצרת דאשבורדים ויזואליים למשתמש.",
        memeTop: "הפרצוף שלך כשהצלחת לחבר",
        memeBottom: "את הטבלאות ישירות לדאשבורד ב-Tableau"
    },
    {
        question: "מהי הדוגמה הבסיסית ביותר לבינה מלאכותית (AI) המוזכרת בחומר הלימוד?",
        answers: [
            { text: "א. נוסחת Excel פשוטה שלוקחת נתונים ומחשבת תוצאה במקום אחר", correct: true },
            { text: "ב. מודל ChatGPT של חברת OpenAI", correct: false },
            { text: "ג. מכונית אוטונומית הנוסעת ללא נהג", correct: false },
            { text: "ד. רובוט המצייר ציורים על קנבס", correct: false }
        ],
        explanation: "נכון מאוד! העובדה שנוסחה ב-Excel יודעת לקחת נתונים ממקור מסוים ולהוציא תוצאה מותנית במקום אחר היא סוג של AI בסיסי ביותר.",
        memeTop: "כשאומרים לך שאתה מתכנת AI",
        memeBottom: "ואתה בעצם רק כתבת נוסחת IF באקסל"
    },
    {
        question: "באיזה סוג של בינה מלאכותית אנו מגדירים למערכת פרמטרים מראש לפיהם היא צריכה לבצע ניתוח ולמידה?",
        answers: [
            { text: "א. למידה עמוקה (Deep Learning)", correct: false },
            { text: "ב. למידת מכונה (Machine Learning)", correct: true },
            { text: "ג. עיבוד שפה טבעית פשוט ללא הכוונה", correct: false },
            { text: "ד. נוסחאות חישוב מתמטיות קשיחות ללא פרמטרים", correct: false }
        ],
        explanation: "תשובה ב' נכונה! בלמידת מכונה (ML) אנו מגדירים למערכת את הפרמטרים שעשויים להשפיע, והיא לומדת ומזהה מה מתוכם משפיע באמת.",
        memeTop: "כשאתה מגדיר למכונה את אורך האוזן",
        memeBottom: "כדי שהיא תדע לזהות שזה כלב"
    },
    {
        question: "באיזה סוג AI אנו מפציצים את התוכנה במידע, לא מגדירים לה פרמטרים בכלל, והיא לומדת לאפיין גם את הפרמטרים וגם את המסקנות לבד?",
        answers: [
            { text: "א. למידת מכונה (Machine Learning)", correct: false },
            { text: "ב. למידה עמוקה (Deep Learning)", correct: true },
            { text: "ג. מערכת חוקים מבוססת Excel", correct: false },
            { text: "ד. רובוטיקה תעשייתית קלאסית", correct: false }
        ],
        explanation: "מעולה! בלמידה עמוקה (Deep Learning) אנו זורקים על המכונה את כל המידע ללא הגדרת פרמטרים והיא בוחנת את כל הקשרים עצמאית (כמו ChatGPT).",
        memeTop: "הפגזת את המכונה במיליון תמונות",
        memeBottom: "והיא גילתה לבד שחתולים אוהבים קרטון"
    },
    {
        question: "טענה 1: כאשר מעוניינים לחקור את המשתנים המשפיעים על תופעה מורכבת מאד, שהגורמים להיווצרותה מצויים באי ודאות רבה, הכלי המתאים יהיה בינה מלאכותית שאיננה למידה עמוקה או למידת מכונה\nטענה 2: כאשר מעוניינים לחקור את מערכת הקשרים בין מספר פרמטרים שביכולתנו להגדיר, אך איננו משוכנעים שכולם משפיעים על התופעה הנחקרת, הכלי המתאים יהיה בינה מלאכותית מסוג למידה עמוקה\nטענה 3: כאשר מעוניינים לחקור את מערכת הקשרים בין תופעה מורכבת, שהפרמטרים המשפיעים עליה מוטלים בספק רב מבחינת יכולתנו לאפיין אותם, הכלי המתאים יהיה בינה מלאכותית מסוג למידת מכונה.\n\nמהי הטענה הנכונה?",
        answers: [
            { text: "א. טענה 2 ו-3 נכונות", correct: false },
            { text: "ב. טענה 1 נכונה בלבד", correct: false },
            { text: "ג. כל הטענות שגויות", correct: true },
            { text: "ד. טענה 3 נכונה בלבד", correct: false }
        ],
        explanation: "כל הטענות שגויות! טענה 1 דורשת למידה עמוקה (בגלל אי הודאות). טענה 2 דורשת למידת מכונה (כי אנחנו יודעים להגדיר את הפרמטרים מראש). טענה 3 דורשת למידה עמוקה (כי אין לנו מושג איך לאפיין את הפרמטרים).",
        memeTop: "הפנים שלך במבחן כשאתה מבין",
        memeBottom: "שכל שלוש הטענות הן המצאה מוחלטת"
    }
];

function loadQuizQuestion() {
    dom.quizFeedback.classList.add('hidden');
    dom.answersContainer.innerHTML = '';
    
    if (state.quizIndex >= quizQuestions.length) {
        navigateTo('zone-victory');
        dom.certNameVal.textContent = state.studentName;
        dom.certEmailVal.textContent = state.studentEmail;
        
        if (state.eligibleForCertificate) {
            dom.certPrintArea.classList.remove('hidden');
            dom.btnPrintCertificate.classList.remove('hidden');
            dom.certBlockedCard.classList.add('hidden');
        } else {
            dom.certPrintArea.classList.add('hidden');
            dom.btnPrintCertificate.classList.add('hidden');
            dom.certBlockedCard.classList.remove('hidden');
        }
        return;
    }
    
    const q = quizQuestions[state.quizIndex];
    dom.currentQuestionNum.textContent = state.quizIndex + 1;
    dom.totalQuestionsNum.textContent = quizQuestions.length;
    dom.questionText.innerHTML = q.question.replace(/\n/g, '<br>');
    
    q.answers.forEach(ans => {
        const btn = document.createElement('div');
        btn.className = 'answer-option';
        btn.textContent = ans.text;
        btn.addEventListener('click', () => selectAnswer(ans, btn));
        dom.answersContainer.appendChild(btn);
    });
}

function selectAnswer(ans, btnEl) {
    const options = dom.answersContainer.querySelectorAll('.answer-option');
    options.forEach(opt => opt.style.pointerEvents = 'none');
    
    const q = quizQuestions[state.quizIndex];
    
    const correctPhrases = [
        "נכון מאוד! 🎉 כבוד למגזר!",
        "קללל! 🍌 גאונות טהורה!",
        "ד״ר צבאן גאה בך! 🎓",
        "בול בפוני! 🎯 שברת את המערכת!",
        "תותח על! ⚡ ה-BI זורם אצלך בדם!"
    ];

    const incorrectPhrases = [
        "טעות מביכה! 🤦‍♂️",
        "הרצל מוסר שזה ממש לא זה... 🗑️",
        "אויש, בלבול ברמת קריסה! 😭",
        "לא נכון! המכונה צוחקת עליך 🤖",
        "פספוס! אולי כדאי לקרוא את המשל שוב? 📚"
    ];

    if (ans.correct) {
        btnEl.classList.add('correct');
        dom.feedbackStatusTitle.textContent = correctPhrases[Math.floor(Math.random() * correctPhrases.length)];
        dom.feedbackStatusTitle.style.color = "var(--color-green)";
        state.wisdom += 10;
        state.confusion = Math.max(0, state.confusion - 10);
        drawMemeGraphic(true);
    } else {
        btnEl.classList.add('incorrect');
        dom.feedbackStatusTitle.textContent = incorrectPhrases[Math.floor(Math.random() * incorrectPhrases.length)];
        dom.feedbackStatusTitle.style.color = "var(--color-red)";
        state.confusion = Math.min(120, state.confusion + 5);
        
        const correctBtn = Array.from(options).find(opt => {
            const match = q.answers.find(a => a.text === opt.textContent);
            return match && match.correct;
        });
        if (correctBtn) correctBtn.classList.add('correct');
        drawMemeGraphic(false);
    }
    
    updateScoreboard();
    
    dom.memeTextT.textContent = q.memeTop;
    dom.memeTextB.textContent = q.memeBottom;
    
    dom.explanationContent.textContent = q.explanation;
    dom.quizFeedback.classList.remove('hidden');
}

function drawMemeGraphic(isCorrect) {
    const container = dom.memeVisual;
    const randomRot = (Math.random() * 8 - 4).toFixed(1);
    if (isCorrect) {
        container.innerHTML = `
            <img src="assets/banana_correct.png" alt="Correct Banana" style="width:100%; max-height:220px; object-fit:contain; border-radius:6px; transform: rotate(${randomRot}deg); transition: transform 0.3s ease;">
        `;
    } else {
        container.innerHTML = `
            <img src="assets/banana_wrong.png" alt="Wrong Banana" style="width:100%; max-height:220px; object-fit:contain; border-radius:6px; transform: rotate(${randomRot}deg); transition: transform 0.3s ease;">
        `;
    }
}

dom.btnNextQuestion.addEventListener('click', () => {
    state.quizIndex++;
    loadQuizQuestion();
});

// Certificate Print Trigger
dom.btnPrintCertificate.addEventListener('click', () => {
    window.print();
});

// --- Initialize App ---
updateScoreboard();
updateExcelFormula();
initZone1();
dom.studentNameInput.focus();
