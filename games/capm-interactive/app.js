// CAPM Step-by-Step Course - Authentic Brilliant Pedagogy

// 1. Brilliant-Style Course Steps (Concept-First, Puzzle-Driven)
const steps = [
    {
        badge: "שלב 1 מתוך 6: ההיגיון הבסיסי",
        title: "איך מתמחרים סיכון?",
        body: `
            <p>למידה בסגנון Brilliant מתחילה תמיד משאלה פשוטה כדי לבנות אינטואיציה. בואו נתחיל:</p>
            <p>נניח שיש לכם 1,000 ש"ח פנויים. עומדות בפניכם שתי אפשרויות:</p>
            <p>א. להפקיד את הכסף בבנק ולקבל <strong>תשואה בטוחה של 5%</strong> (ללא שום סיכון).</p>
            <p>ב. להשקיע את הכסף בסטארט-אפ חדש ומסוכן של חבר, שגם הוא מציע <strong>תשואה צפויה של 5%</strong> (אך יש סיכון גבוה שתפסידו את כל הכסף).</p>
        `,
        visualType: "risk-return-simple",
        question: {
            text: "באיזו אפשרות תבחרו להשקיע את כספכם?",
            choices: [
                "אפשרות א' - הפיקדון הבטוח בבנק",
                "אפשרות ב' - הסטארט-אפ המסוכן",
                "זה לא משנה לי, בשני המסלולים התשואה היא 5%"
            ],
            correctIndex: 0,
            feedbackSuccess: "בדיוק! כמעט כל אדם רציונלי יבחר בבנק. התנהגות זו נקראת <strong>רתע מסיכון (Risk Aversion)</strong>. כדי שתסכימו לבחור בסטארט-אפ המסוכן, הוא חייב להציע לכם תשואה צפויה גבוהה משמעותית (למשל 20%). תוספת התשואה הזו נקראת <strong>פרמיית סיכון (Risk Premium)</strong>.",
            feedbackError: "חשבו על זה: למה לכם להסתכן באיבוד כל הכסף בסטארט-אפ, אם הבנק מציע לכם בדיוק את אותו הרווח בביטחון מלא?"
        }
    },
    {
        badge: "שלב 2 מתוך 6: כוח הפיזור",
        title: "האם כל סיכון שווה פיצוי?",
        body: `
            <p>נניח שהחלטתם להשקיע במניות. יש לכם שתי דרכים לעשות זאת:</p>
            <p>א. לקנות מניה של <strong>חברה אחת בודדת</strong> (למשל, חברת תרופות).</p>
            <p>ב. לקנות תיק מבוזר המכיל מניות של <strong>100 חברות שונות</strong> מענפים שונים.</p>
            <p>אם חברת התרופות תכשל בניסוי קליני, המניה שלה תקרוס. אך בתיק של 100 המניות, קריסה של חברה אחת כמעט ולא תורגש, כי היא תקוזז על ידי הצלחה של חברות אחרות.</p>
            <div class="highlight-block">
                <p>התהליך הזה נקרא <strong>פיזור (Diversification)</strong>. הוא מאפשר לנו למחוק כמעט לחלוטין את ה<strong>סיכון הייחודי</strong> של חברות בודדות בקלות ובחינם.</p>
            </div>
        `,
        visualType: "diversification-simple",
        question: {
            text: "מכיוון שכל משקיע יכול לבטל את הסיכון הייחודי של חברה בודדת בחינם (על ידי קניית מדד מבוזר), האם השוק הפיננסי יעניק פיצוי (תשואה עודפת) למי שבוחר בכל זאת להחזיק מניה בודדת ומסוכנת?",
            choices: [
                "כן, השוק תמיד מפצה על כל סוג של סיכון.",
                "לא, השוק לא ישלם פרמיה על סיכון שניתן להימנע ממנו בקלות ובחינם.",
                "כן, אבל רק אם החברה היא מאוד מפורסמת."
            ],
            correctIndex: 1,
            feedbackSuccess: "תשובה מעולה! זהו אחד העקרונות החשובים בפיננסים: <strong>השוק אינו מפצה על סיכון ייחודי (Unsystematic Risk)</strong>. השוק מתמחר ומפצה רק על סיכון שלא ניתן לבטל באמצעות פיזור.",
            feedbackError: "לא מדויק. אם השוק היה משלם פרמיה על סיכון שקל לבטל בחינם, כולם היו מנצלים זאת כדי להרוויח כסף קל ללא סיכון (ארביטראז'). השוק מתגמל רק על סיכון הכרחי."
        }
    },
    {
        badge: "שלב 3 מתוך 6: סיכון שוק",
        title: "הסיכון שלא ניתן לברוח ממנו",
        body: `
            <p>קניתם מדד מניות ענק המכיל את כל המניות במשק – <strong>תיק השוק ($M$)</strong>. ביטלתם לחלוטין את הסיכון הייחודי של כל חברה בנפרד.</p>
            <p>אך האם כעת ההשקעה שלכם בטוחה לחלוטין כמו פיקדון בבנק? כמובן שלא.</p>
            <div class="highlight-block">
                <p>אם יתרחש אירוע מאקרו-כלכלי ענק (מיתון עולמי, עליית ריבית דרמטית, מלחמה), השוק כולו ירד, ואיתו גם התיק המבוזר שלכם. זהו <strong>הסיכון השיטתי (Systematic Risk / Market Risk)</strong> – הסיכון היחיד שלא ניתן לבטל בפיזור, ולכן <strong>הוא הסיכון היחיד שהשוק מוכן לפצות עליו בתשואה עודפת</strong>.</p>
            </div>
        `,
        visualType: "systematic-risk",
        question: {
            text: "אילו מהאירועים הבאים מייצג סיכון שיטתי (סיכון שוק) שמשקיע מבוזר לחלוטין עדיין חשוף אליו?",
            choices: [
                "שריפה במשרדי ההנהלה של חברת פייסבוק.",
                "העלאת ריבית חדה ופתאומית על ידי הבנק המרכזי שמשפיעה על עלויות המימון של כל החברות במשק.",
                "גילוי פגם בייצור של דגם מכונית חדש של חברת טסלה."
            ],
            correctIndex: 1,
            feedbackSuccess: "נכון מאוד! העלאת ריבית משפיעה על הכלכלה כולה ועל כלל המניות – זהו סיכון שיטתי. שאר האפשרויות הן אירועים נקודתיים של חברות ספציפיות, שמתקזזים בתוך תיק רחב.",
            feedbackError: "חשבו על זה: איזה מהאירועים ישפיע לרעה על כמעט כל החברות בבורסה בו-זמנית, ואיזה ישפיע רק על חברה אחת בודדת?"
        }
    },
    {
        badge: "שלב 4 מתוך 6: הבטא",
        title: "מדד בטא ($\\beta$) - עוצמת התגובה לשוק",
        body: `
            <p>אם סיכון שיטתי (סיכון שוק) הוא היחיד שקובע את הפיצוי, אנו צריכים דרך למדוד אותו עבור כל מניה.</p>
            <p>לשם כך משתמשים במדד ה-<strong>בטא ($\\beta$)</strong>. הבטא מודדת את הרגישות של מניה מסוימת לתנודות של מדד השוק הכללי:</p>
            <ul>
                <li><strong>$\\beta = 1$:</strong> המניה מגיבה בדיוק כמו השוק (למשל, מדד מבוזר).</li>
                <li><strong>$\\beta = 1.5$:</strong> המניה תנודתית פי 1.5 מהשוק (מניות הייטק וצמיחה).</li>
                <li><strong>$\\beta = 0.5$:</strong> המניה יציבה ומגיבה בחצי מעוצמת השוק (חברות מים או מזון).</li>
            </ul>
        `,
        visualType: "beta-sim",
        question: {
            text: "אם מדד השוק ירד ב-10% בעקבות משבר כלכלי, מה צפוי לקרות למניה הגנתית ויציבה בעלת בטא של 0.6?",
            choices: [
                "היא תרד ב-10% בדיוק כמו השוק.",
                "היא תרד ב-6% בלבד (מגיבה רק ב-60% מעוצמת הירידה של השוק).",
                "היא תעלה ב-6% כנגד השוק."
            ],
            correctIndex: 1,
            feedbackSuccess: "מצוין! מכיוון שהבטא היא 0.6, המניה רגישה פחות מהשוק ותנודתיות הסיכון השיטתי שלה נמוכה יותר: $10\\% \\times 0.6 = 6\\%$.",
            feedbackError: "לא מדויק. המניה רגישה לשוק אך רק בעוצמה של 60% (בטא 0.6). הכפילו את ירידת השוק בבטא."
        }
    },
    {
        badge: "שלב 5 מתוך 6: הנוסחה",
        title: "הנוסחה ההגיונית של CAPM",
        body: `
            <p>עכשיו בואו נחבר את הכל יחד. מה צריכה להיות התשואה הנדרשת ממניה כלשהי?</p>
            <p>לפי מודל ה-<strong>CAPM</strong>, התשואה מורכבת מ:</p>
            <p>1. <strong>הבסיס הבטוח ($R_F$):</strong> מה שהיינו מקבלים בבנק ללא שום סיכון.</p>
            <p>2. <strong>פיצוי על סיכון שוק:</strong> הרגישות של המניה לשוק ($\\beta_i$) כפול תוספת התשואה שהשוק כולו מעניק מעבר לבנק הבטוח ($E(R_M) - R_F$).</p>
            <div class="highlight-block" style="text-align: center;">
                <p style="font-size: 1.3rem; font-weight: bold; color: var(--color-primary);">
                    תוחלת התשואה = ריבית בטוחה + (בטא $\\times$ פרמיית השוק)
                </p>
                <p style="font-size: 1.15rem; font-weight: bold; color: var(--text-primary); margin-top: 8px;">
                    $E(R_i) = R_F + \\beta_i \\cdot [E(R_M) - R_F]$
                </p>
            </div>
        `,
        visualType: "cml-simple",
        question: {
            text: "ריבית הבנק הבטוחה היא 4%, ותשואת השוק הצפויה היא 10%. מה תהיה התשואה הנדרשת לפי CAPM ממניה בעלת בטא של 1.0 (רמת סיכון שווה לשוק)?",
            choices: [
                "4% (הריבית חסרת הסיכון בלבד).",
                "10% (שווה בדיוק לתשואת השוק, כי בטא = 1.0).",
                "14% (חיבור פשוט של הנתונים)."
            ],
            correctIndex: 1,
            feedbackSuccess: "תשובה נכונה! מניה עם בטא 1.0 נושאת סיכון זהה לחלוטין לשוק, ולכן לפי הנוסחה: $4\\% + 1.0 \\times (10\\% - 4\\%) = 10\\%$. התשואה שלה שווה בדיוק לתשואת השוק.",
            feedbackError: "הציבו את הערכים בנוסחה: $R_F = 4\\%$, $\\beta = 1.0$, $E(R_M) = 10\\%$. מה מתקבל?"
        }
    },
    {
        badge: "שלב 6 מתוך 6: שיווי משקל",
        title: "קו שוק ניירות הערך (SML)",
        body: `
            <p>אם נשרטט את נוסחת ה-CAPM על גרף (שבו ציר ה-X מייצג בטא וציר ה-Y תוחלת תשואה), נקבל קו ישר העולה מנקודת הריבית חסרת הסיכון. קו זה נקרא <strong>קו שוק ניירות הערך (SML)</strong>.</p>
            <p>כל הנכסים בשוק שואפים להימצא בדיוק על הקו הזה בשיווי משקל (Equilibrium).</p>
            <div class="highlight-block">
                <p>אם מניה מציעה תשואה בפועל הגבוהה מהנדרש (מעל קו ה-SML), כולם ירצו לקנות אותה. הביקוש הגבוה יעלה את מחיר המניה, מה שיוריד את התשואה שלה בחזרה עד שהיא תתיישר בדיוק על קו ה-SML.</p>
            </div>
        `,
        visualType: "sml-simple",
        question: {
            text: "אם מניה ממוקמת כיום מתחת לקו ה-SML (כלומר, היא מציעה תשואה נמוכה מדי ביחס לסיכון השיטתי שלה), מה יעשו משקיעים רציונליים?",
            choices: [
                "הם ימכרו את המניה (או ימנעו מלקנות אותה), מחירה ירד, וכתוצאה מכך התשואה הצפויה שלה תעלה בחזרה לקו ה-SML.",
                "הם ירוצו לקנות אותה כי היא נחשבת מציאה.",
                "הם לא יעשו דבר, שכן השוק מעולם אינו מתקן עיוותים כאלו."
            ],
            correctIndex: 0,
            feedbackSuccess: "מעולה! הבנתם את מנגנון התיקון העצמי ושיווי המשקל בשוק ההון. הגעתם לסוף הקורס התיאורטי של CAPM בהצלחה רבה!",
            feedbackError: "לא נכון. אם מניה מציעה פחות רווח ממה שהיא צריכה לתת עבור הסיכון שלה, היא נחשבת יקרה ולא משתלמת. האם תקנו משהו יקר שאינו מניב מספיק?"
        }
    }
];

// 2. Application State
let currentStep = 0;
let selectedOption = null;
let isAnswerChecked = false;
let portfolioStocks = [];

// Values for graphics
let rfValue = 3;
let emValue = 10;
let stockBeta = 1.2;
let customAssetBeta = 1.2;
let customAssetReturn = 15;

// 3. UI Element Mapping
const elProgressPercent = document.getElementById("progress-percent");
const elProgressFill = document.getElementById("progress-fill");
const elStepBadge = document.getElementById("step-badge");
const elStepTitle = document.getElementById("step-title");
const elStepBody = document.getElementById("step-body");
const elQuestionSection = document.getElementById("question-section");
const elQuestionText = document.getElementById("question-text");
const elOptionsContainer = document.getElementById("options-container");
const elFeedbackBox = document.getElementById("feedback-box");
const elFeedbackIcon = document.getElementById("feedback-icon");
const elFeedbackTitle = document.getElementById("feedback-title");
const elFeedbackDesc = document.getElementById("feedback-desc");
const elBtnBack = document.getElementById("btn-back");
const elBtnAction = document.getElementById("btn-action");
const elVisualDisplay = document.getElementById("visual-display");
const elVisualControls = document.getElementById("visual-controls");
const elVisualTitle = document.getElementById("visual-title");
const elVisualSubtitle = document.getElementById("visual-subtitle");

// 4. Initializer
function initStep(index) {
    currentStep = index;
    isAnswerChecked = false;
    selectedOption = null;
    
    const step = steps[currentStep];
    
    elStepBadge.innerText = step.badge;
    elStepTitle.innerText = step.title;
    elStepBody.innerHTML = step.body;
    
    // Progress
    const progress = Math.round((currentStep / (steps.length - 1)) * 100);
    elProgressPercent.innerText = `${progress}%`;
    elProgressFill.style.width = `${progress}%`;
    
    // Questions
    elQuestionText.innerText = step.question.text;
    renderOptions(step.question);
    
    elFeedbackBox.style.display = "none";
    
    setupVisualDisplay(step.visualType);
    
    elBtnBack.disabled = currentStep === 0;
    elBtnAction.innerHTML = 'בדיקה <i class="fa-solid fa-check"></i>';
    elBtnAction.className = "btn btn-primary";
}

function renderOptions(question) {
    elOptionsContainer.innerHTML = "";
    question.choices.forEach((choice, index) => {
        const card = document.createElement("div");
        card.className = "option-card";
        card.addEventListener("click", () => {
            if (isAnswerChecked) return;
            document.querySelectorAll(".option-card").forEach(c => c.classList.remove("selected"));
            card.classList.add("selected");
            selectedOption = index;
        });
        
        const circ = document.createElement("div");
        circ.className = "option-circle";
        const text = document.createElement("div");
        text.className = "option-text";
        text.innerText = choice;
        
        card.appendChild(circ);
        card.appendChild(text);
        elOptionsContainer.appendChild(card);
    });
}

// 5. Visualizer Mapper
function setupVisualDisplay(type) {
    elVisualDisplay.innerHTML = "";
    elVisualControls.innerHTML = "";
    
    if (type === "risk-return-simple") {
        elVisualTitle.innerText = "בחירה תחת סיכון";
        elVisualSubtitle.innerText = "השוואה בין פיקדון בנקאי בטוח לבין פרויקט תנודתי באותה תשואה.";
        
        elVisualDisplay.innerHTML = `
            <svg class="graph-svg" viewBox="0 0 400 220">
                <line x1="50" y1="170" x2="350" y2="170" class="graph-axis" />
                <line x1="50" y1="30" x2="50" y2="170" class="graph-axis" />
                <text x="340" y="190" class="graph-axis-label" text-anchor="end">רמת הסיכון</text>
                <text x="40" y="40" class="graph-axis-label" text-anchor="start" transform="rotate(-90 40 40)">תשואה</text>
                
                <!-- Bank path (Safe, flat) -->
                <line x1="50" y1="100" x2="320" y2="100" stroke="var(--color-success)" stroke-width="3" />
                <circle cx="50" cy="100" r="5" fill="var(--color-success)" />
                <text x="60" y="90" class="graph-point-label" style="fill: var(--color-success); font-weight: bold;">פיקדון בנקאי (5% בטוח)</text>
                
                <!-- Startup path (Fluctuating) -->
                <path d="M 50 100 Q 120 40 200 130 T 320 100" fill="none" stroke="var(--color-error)" stroke-width="2.5" stroke-dasharray="3 3" />
                <circle cx="320" cy="100" r="5" fill="var(--color-error)" />
                <text x="320" y="85" class="graph-point-label" style="fill: var(--color-error); font-weight: bold;" text-anchor="end">סטארט-אפ (5% צפוי, מסוכן)</text>
            </svg>
        `;
    }
    else if (type === "diversification-simple") {
        elVisualTitle.innerText = "אינטואיציית פיזור ההשקעות";
        elVisualSubtitle.innerText = "בחרו מניות משמאל והוסיפו לתיק כדי להיווכח כיצד השונות הייחודית פוחתת.";
        portfolioStocks = [];
        renderDiversification();
    }
    else if (type === "systematic-risk") {
        elVisualTitle.innerText = "רצפת הסיכון שלא ניתן לפיזור";
        elVisualSubtitle.innerText = "גם בפיזור מקסימלי, המשקיע נשאר חשוף לתנודות של מדד השוק כולו.";
        
        elVisualDisplay.innerHTML = `
            <svg class="graph-svg" viewBox="0 0 400 220">
                <line x1="50" y1="180" x2="360" y2="180" class="graph-axis" />
                <line x1="50" y1="20" x2="50" y2="180" class="graph-axis" />
                <text x="350" y="195" class="graph-axis-label" text-anchor="end">מספר המניות בתיק</text>
                <text x="45" y="25" class="graph-axis-label" text-anchor="end">סיכון התיק (σ)</text>
                
                <!-- Risk decay curve -->
                <path d="M 60 50 Q 180 130 350 130" fill="none" stroke="var(--color-primary)" stroke-width="3" />
                
                <!-- Systematic floor -->
                <line x1="50" y1="130" x2="350" y2="130" stroke="var(--color-error)" stroke-width="2" stroke-dasharray="3 3" />
                <text x="355" y="134" class="graph-point-label" style="fill: var(--color-error);" text-anchor="start">סיכון שוק שיטתי (לא ניתן לביטול)</text>
            </svg>
        `;
    }
    else if (type === "beta-sim") {
        elVisualTitle.innerText = "בטא ורגישות לתנודות השוק";
        elVisualSubtitle.innerText = "שנו את הבטא וראו את תנודות המניה מול תנודות השוק.";
        renderBetaGraph();
        
        elVisualControls.innerHTML = `
            <div class="slider-group">
                <div class="slider-header">
                    <span class="slider-label">בטא (\\beta) של המניה</span>
                    <span class="slider-value" id="beta-lbl">${stockBeta}</span>
                </div>
                <input type="range" class="slider-input" id="beta-slider" min="0" max="2" value="${stockBeta}" step="0.1">
            </div>
        `;
        document.getElementById("beta-slider").addEventListener("input", (e) => {
            stockBeta = parseFloat(e.target.value);
            document.getElementById("beta-lbl").innerText = `${stockBeta}`;
            renderBetaGraph();
        });
    }
    else if (type === "cml-simple") {
        elVisualTitle.innerText = "מבנה פרמיית השוק";
        elVisualSubtitle.innerText = "פרמיית סיכון השוק מיוצגת על ידי המרווח בין ריבית הבנק לתשואת השוק.";
        renderCML();
    }
    else if (type === "sml-simple") {
        elVisualTitle.innerText = "קו שוק ניירות הערך (SML)";
        elVisualSubtitle.innerText = "גררו את המניה. מעל הקו היא נחשבת מציאה פיננסית ותעלה בחזרה לקו שיווי המשקל.";
        renderSML();
    }
}

// 6. Diversification display
function renderDiversification() {
    const assets = [
        { id: 1, name: "מניית בנקים", icon: "fa-building-columns" },
        { id: 2, name: "מניית טכנולוגיה", icon: "fa-microchip" },
        { id: 3, name: "מניית קמעונאות", icon: "fa-cart-shopping" },
        { id: 4, name: "מניית פארמה", icon: "fa-pills" }
    ];
    const count = portfolioStocks.length;
    let risk = 30;
    if (count === 2) risk = 21;
    else if (count === 3) risk = 15;
    else if (count >= 4) risk = 11;
    
    elVisualDisplay.innerHTML = `
        <div style="display: flex; flex-direction: column; width: 100%; padding: 12px; gap: 12px;">
            <svg style="width: 100%; height: 110px;" viewBox="0 0 400 110">
                <path d="M 50 15 Q 180 80 350 80" fill="none" stroke="#94a3b8" stroke-width="2.5" stroke-dasharray="3 3" />
                <line x1="50" y1="80" x2="350" y2="80" stroke="var(--color-error)" stroke-width="1.5" stroke-dasharray="2 2" />
                
                ${count >= 1 ? `<circle cx="50" cy="15" r="4.5" fill="var(--color-primary)" />` : ''}
                ${count >= 2 ? `<circle cx="150" cy="48" r="4.5" fill="var(--color-primary)" />` : ''}
                ${count >= 3 ? `<circle cx="250" cy="68" r="4.5" fill="var(--color-primary)" />` : ''}
                ${count >= 4 ? `<circle cx="350" cy="80" r="4.5" fill="var(--color-success)" />` : ''}
            </svg>
            <div style="background-color: var(--bg-tertiary); padding: 6px; border-radius: var(--border-radius-sm); text-align: center; font-size: 0.8rem;">
                מניות בתיק: <strong>${count}</strong> | סיכון התיק: <strong style="color: var(--color-primary);">${risk}%</strong>
            </div>
            <div class="portfolio-cards-grid" style="margin: 0;">
                ${assets.map(asset => {
                    const active = portfolioStocks.includes(asset.id);
                    return `
                        <div class="diversification-card ${active ? 'selected' : ''}" onclick="togglePortfolioAsset(${asset.id})">
                            <div class="card-icon" style="font-size: 1.2rem;"><i class="fa-solid ${asset.icon}"></i></div>
                            <div class="card-title" style="font-size: 0.8rem;">${asset.name}</div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

window.togglePortfolioAsset = function(id) {
    if (portfolioStocks.includes(id)) {
        portfolioStocks = portfolioStocks.filter(x => x !== id);
    } else {
        portfolioStocks.push(id);
    }
    renderDiversification();
};

function renderBetaGraph() {
    const marketPoints = [];
    const stockPoints = [];
    for (let i = 0; i <= 40; i++) {
        const x = 50 + (i * 8);
        const yBase = Math.sin(i * 0.25) * 35;
        marketPoints.push(`${x},${130 + yBase}`);
        stockPoints.push(`${x},${130 + yBase * stockBeta}`);
    }
    elVisualDisplay.innerHTML = `
        <svg class="graph-svg" viewBox="0 0 400 240">
            <line x1="50" y1="130" x2="380" y2="130" stroke="#cbd5e1" stroke-width="1.5" />
            <line x1="50" y1="210" x2="380" y2="210" class="graph-axis" />
            <line x1="50" y1="30" x2="50" y2="210" class="graph-axis" />
            
            <path d="M ${marketPoints.join(' L ')}" fill="none" stroke="var(--color-primary)" stroke-width="2" />
            <path d="M ${stockPoints.join(' L ')}" fill="none" stroke="var(--color-accent)" stroke-width="2" />
        </svg>
    `;
}

function renderCML() {
    const rfY = 200 - (rfValue * 15);
    const emY = 200 - (emValue * 15);
    const mX = 220;
    const endX = 350;
    const slope = (rfY - emY) / mX;
    const endY = rfY - (slope * endX);
    
    elVisualDisplay.innerHTML = `
        <svg class="graph-svg" viewBox="0 0 400 240">
            <line x1="50" y1="210" x2="380" y2="210" class="graph-axis" />
            <line x1="50" y1="30" x2="50" y2="210" class="graph-axis" />
            <line x1="50" y1="${rfY}" x2="${endX}" y2="${endY}" class="graph-line graph-line-cml" />
            
            <circle cx="50" cy="${rfY}" r="5" fill="var(--color-success)" />
            <text x="60" y="${rfY + 12}" class="graph-point-label" style="fill: var(--color-success);">בנק (R_F) = ${rfValue}%</text>
            
            <circle cx="${mX}" cy="${emY}" r="6" fill="var(--color-primary)" />
            <text x="${mX}" y="${emY - 10}" class="graph-point-label" text-anchor="middle">תיק השוק = ${emValue}%</text>
        </svg>
    `;
}

function renderSML() {
    const rfY = 200 - (rfValue * 12);
    const emY = 200 - (10 * 12);
    const mX = 200;
    const slope = (rfY - emY) / (mX - 50);
    const endX = 350;
    const endY = rfY - (slope * (endX - 50));
    
    const assetX = 50 + (customAssetBeta * 150);
    const assetY = 200 - (customAssetReturn * 12);
    
    const required = rfValue + (10 - rfValue) * customAssetBeta;
    let statusText = "בשיווי משקל";
    if (customAssetReturn > required + 0.1) statusText = "מניה זולה (בחוסר תמחור)";
    else if (customAssetReturn < required - 0.1) statusText = "מניה יקרה (ביתר תמחור)";
    
    const lblBeta = document.getElementById("asset-beta");
    const lblRet = document.getElementById("asset-ret");
    const lblStatus = document.getElementById("asset-status");
    if (lblBeta) lblBeta.innerText = customAssetBeta.toFixed(1);
    if (lblRet) lblRet.innerText = `${customAssetReturn.toFixed(1)}%`;
    if (lblStatus) {
        lblStatus.innerText = statusText;
        lblStatus.style.color = customAssetReturn > required + 0.1 ? "var(--color-success)" : (customAssetReturn < required - 0.1 ? "var(--color-error)" : "var(--text-primary)");
    }
    
    elVisualDisplay.innerHTML = `
        <svg class="graph-svg" viewBox="0 0 400 240" id="sml-svg-drag">
            <line x1="50" y1="210" x2="380" y2="210" class="graph-axis" />
            <line x1="50" y1="30" x2="50" y2="210" class="graph-axis" />
            <line x1="50" y1="${rfY}" x2="${endX}" y2="${endY}" class="graph-line graph-line-sml" />
            <text x="${endX - 10}" y="${endY - 10}" class="graph-point-label" style="fill: var(--color-accent);" text-anchor="end">SML</text>
            
            <circle cx="50" cy="${rfY}" r="5" fill="var(--color-success)" />
            <circle cx="${mX}" cy="${emY}" r="5" fill="var(--color-primary)" />
            
            <g id="asset-dot" style="cursor: move;">
                <circle cx="${assetX}" cy="${assetY}" r="12" fill="rgba(180, 83, 9, 0.15)" />
                <circle cx="${assetX}" cy="${assetY}" r="6" fill="var(--color-warning)" />
                <text x="${assetX}" y="${assetY - 14}" class="graph-point-label" style="fill: var(--color-warning); font-weight: bold;" text-anchor="middle">מניה ג'</text>
            </g>
        </svg>
    `;
    
    setupSMLDrag();
}

function setupSMLDrag() {
    const svg = document.getElementById("sml-svg-drag");
    const dot = document.getElementById("asset-dot");
    if (!svg || !dot) return;
    
    let dragging = false;
    
    function move(clientX, clientY) {
        const rect = svg.getBoundingClientRect();
        let x = ((clientX - rect.left) / rect.width) * 400;
        let y = ((clientY - rect.top) / rect.height) * 240;
        
        if (x < 50) x = 50;
        if (x > 350) x = 350;
        if (y < 40) y = 40;
        if (y > 210) y = 210;
        
        customAssetBeta = (x - 50) / 150;
        customAssetReturn = (210 - y) / 12;
        renderSML();
    }
    
    dot.addEventListener("mousedown", (e) => { dragging = true; e.preventDefault(); });
    window.addEventListener("mousemove", (e) => { if (dragging) move(e.clientX, e.clientY); });
    window.addEventListener("mouseup", () => { dragging = false; });
    
    dot.addEventListener("touchstart", (e) => { dragging = true; e.preventDefault(); });
    window.addEventListener("touchmove", (e) => { if (dragging) move(e.touches[0].clientX, e.touches[0].clientY); });
    window.addEventListener("touchend", () => { dragging = false; });
}

// 7. Event Handlers
elBtnAction.addEventListener("click", () => {
    const step = steps[currentStep];
    
    if (!isAnswerChecked) {
        if (selectedOption === null) {
            alert("אנא בחרו תשובה!");
            return;
        }
        
        isAnswerChecked = true;
        
        if (selectedOption === step.question.correctIndex) {
            elFeedbackBox.className = "feedback-box success";
            elFeedbackIcon.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
            elFeedbackTitle.innerText = "תשובה נכונה!";
            elFeedbackDesc.innerHTML = step.question.feedbackSuccess;
            elBtnAction.innerHTML = 'המשך לשלב הבא <i class="fa-solid fa-arrow-left"></i>';
        } else {
            elFeedbackBox.className = "feedback-box error";
            elFeedbackIcon.innerHTML = '<i class="fa-solid fa-circle-xmark"></i>';
            elFeedbackTitle.innerText = "אופס, לא בדיוק...";
            elFeedbackDesc.innerText = step.question.feedbackError;
            isAnswerChecked = false; // retry
        }
        elFeedbackBox.style.display = "flex";
    } else {
        if (currentStep < steps.length - 1) {
            initStep(currentStep + 1);
        } else {
            renderCelebration();
        }
    }
});

elBtnBack.addEventListener("click", () => {
    if (currentStep > 0) {
        initStep(currentStep - 1);
    }
});

function renderCelebration() {
    elProgressPercent.innerText = "100%";
    elProgressFill.style.width = "100%";
    
    elStepBadge.innerText = "הקורס הושלם!";
    elStepTitle.innerText = "מעולה! סיימתם את שיעור ה-CAPM!";
    
    elStepBody.innerHTML = `
        <p>כעת אתם מבינים היטב את תיאוריית התמחור של מודל ה-CAPM:</p>
        <ul>
            <li><strong>למה צריך אותו?</strong> כדי לקבוע תוספת תשואה הולמת עבור נטילת סיכון שיטתי.</li>
            <li><strong>שני סוגי סיכון:</strong> הבנו שהשוק אינו מתגמל על סיכון ספציפי (כי ניתן לבטלו בחינם) אלא רק על סיכון שוק שיטתי.</li>
            <li><strong>מדד הבטא:</strong> המכפיל המודד את רגישות המניה לסיכון השוק הכללי.</li>
            <li><strong>שיווי משקל:</strong> מניות תמיד שואפות לחזור ולהיסחר על קו ה-SML.</li>
        </ul>
    `;
    
    elQuestionSection.style.display = "none";
    elFeedbackBox.style.display = "none";
    elBtnBack.disabled = false;
    
    elBtnAction.innerHTML = 'התחל מהתחלה <i class="fa-solid fa-rotate-left"></i>';
    elBtnAction.className = "btn btn-secondary";
    elBtnAction.onclick = () => { location.reload(); };
    
    elVisualTitle.innerText = "הסמכה שהושלמה";
    elVisualSubtitle.innerText = "הבנתם את מודל CAPM לעומק.";
    elVisualDisplay.innerHTML = `
        <div style="text-align: center; padding: 40px; color: var(--color-warning);">
            <i class="fa-solid fa-trophy" style="font-size: 5rem; margin-bottom: 14px;"></i>
            <h4 style="color: var(--text-primary);">הבנת התיאוריה הושלמה במלואה!</h4>
        </div>
    `;
}

// Bootstrap
initStep(0);
