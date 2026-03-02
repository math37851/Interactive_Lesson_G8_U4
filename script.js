import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";

// !ضع رابط قاعدة بيانات Firebase الخاصة بك هنا!
export const firebaseConfig = {
    databaseURL: "https://interactive-lesson-de2d9-default-rtdb.firebaseio.com/"
};

let app, db;
export let useFirebase = false;

if (firebaseConfig.databaseURL && !firebaseConfig.databaseURL.includes("REPLACE_WITH")) {
    try {
        app = initializeApp(firebaseConfig);
        db = getDatabase(app);
        useFirebase = true;

        // استماع للتحديثات الحية من جميع الطلاب عبر الإنترنت
        const studentsRef = ref(db, 'u4_students');
        onValue(studentsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // حفظ نسخة محلية لكي يقوم الكود الأصلي برسم المتصدرين
                localStorage.setItem('math_lesson_u4_students', JSON.stringify(data));
                if (typeof updateLiveLeaderboard === 'function') {
                    updateLiveLeaderboard();
                }
            }
        });
    } catch (e) {
        console.warn("تنبيه: فشل الاتصال بقاعدة البيانات السحابية. سيتم استخدام التخزين المحلي.", e);
    }
}

// قاعدة بيانات الأسئلة والمستويات للوحدة الرابعة: أنظمة المعادلات الخطية
const levelsData = [
    {
        level: 1,
        title: "المستوى الأول: الفهم البياني وتحديد عدد الحلول",
        questions: [
            {
                skill: "فهم ميل المستقيم وتقاطعه (حل واحد)",
                tutorial: {
                    title: "شرح قبل البدء: تحديد عدد الحلول نظرياً",
                    equation: "y = 2x + 4 \\text{ , } y = 3x - 1",
                    steps: [
                        { text: "لكل خط مستقيم (ميل) وهو العدد المضروب في x.", math: "$$y = \\textcolor{blue}{m}x + b$$" },
                        { text: "أولاً: إذا اختلف ميل المعادلتين (مثلاً 2 و 3)، فهذا يعني أن المستقيمين سيتقاطعان في نقطة واحدة.", math: "\\text{حل واحد}" },
                        { text: "ثانياً: إذا تساوى الميل، ننظر للمقطع الصادي (b). إذا اختلفا، فالمستقيمان متوازيان.", math: "\\text{لا يوجد حل}" },
                        { text: "ثالثاً: إذا تساوى الميل والمقطع الصادي (نفس المعادلة بالضبط)، فالمستقيمان متطابقان.", math: "\\text{عدد لانهائي من الحلول}" }
                    ]
                },
                equation: "\\begin{cases} y = 2x + 4 \\\\ y = 3x - 1 \\end{cases}",
                steps: [
                    { skill: "تحديد الميل المختلف", expected: "حل واحد", options: ["حل واحد", "لا يوجد حل", "عدد لانهائي من الحلول"], userInstruction: "كم عدد الحلول لهذا النظام بناءً على الميل والمقطع؟", hint: "قارن الميل في المعادلة الأولى (2) مع الميل في المعادلة الثانية (3). هل هما مختلفان؟", success: "ممتاز! الميلان مختلفان، لذا سيتقاطعان في نقطة واحدة (حل واحد)." }
                ],
                backup: {
                    equation: "\\begin{cases} y = 5x + 2 \\\\ y = -2x + 7 \\end{cases}",
                    steps: [
                        { skill: "تحديد الميل المختلف", expected: "حل واحد", options: ["حل واحد", "لا يوجد حل", "عدد لانهائي من الحلول"], userInstruction: "سؤال تدريبي: كم عدد الحلول للنظام التالي؟", hint: "الميل للأول 5 وللثاني -2، فهما قطعا متقاطعان.", success: "أحسنت!" }
                    ]
                }
            },
            {
                skill: "المستقيمات المتوازية (لا يوجد حل)",
                equation: "\\begin{cases} y = 3x + 4 \\\\ y = 3x + 5 \\end{cases}",
                steps: [
                    { skill: "تمييز الميل المتساوي والمقاطع المختلفة", expected: "لا يوجد حل", options: ["حل واحد", "لا يوجد حل", "عدد لانهائي من الحلول"], userInstruction: "حدد عدد الحلول لهذا النظام.", hint: "لاحظ أن الميل متساوٍ (3 و 3) لكن المقاطع الصادية مختلفة (4 و 5). الخطان متوازيان.", success: "إجابة دقيقة! لا يوجد تقاطع أبدًا." }
                ]
            },
            {
                skill: "المستقيمات المتطابقة (عدد لانهائي من الحلول)",
                equation: "\\begin{cases} y = \\frac{1}{2}x + 1 \\\\ -2x + 4y = 4 \\end{cases}",
                steps: [
                    { skill: "تمييز المعادلات المتكافئة تماماً", expected: "عدد لانهائي من الحلول", options: ["حل واحد", "لا يوجد حل", "عدد لانهائي من الحلول"], userInstruction: "ماذا لو كانت المعادلتان متكافئتين (نفس المستقيم)؟", hint: "إذا قسمت المعادلة الثانية على 4 ورتبتها، ستصبح تماماً كالمعادلة الأولى. إنهما خط واحد!", success: "رائع! المستقيمان يقعان فوق بعضهما، فكل نقطة هي حل." }
                ]
            }
        ]
    },
    {
        level: 2,
        title: "المستوى الثاني: حل النظام بالتعويض",
        questions: [
            {
                skill: "طريقة التعويض (الأساسيات)",
                tutorial: {
                    title: "شرح قبل البدء: الحل بطريقة التعويض",
                    equation: "\\begin{cases} y = x + 4 \\\\ y = -2x + 1 \\end{cases}",
                    steps: [
                        { text: "أولاً: بما أن كلتا المعادلتين تساویان y، يمكننا مساواتهما ببعضهما للتخلص من y.", math: "$$x + 4 = -2x + 1$$" },
                        { text: "ثانياً: نجمع السينات (x) في طرف والأرقام في طرف ونحل.", math: "$$3x = -3 \\Rightarrow x = -1$$" },
                        { text: "ثالثاً: نعوض بقيمة x في أي من المعادلتين الأصلية لنجد قيمة y.", math: "$$y = (-1) + 4 = 3$$" },
                        { text: "إذن، نقطة التقاطع هي (-1, 3).", text: "" }
                    ]
                },
                equation: "\\begin{cases} y = x + 4 \\\\ y = -2x + 1 \\end{cases}",
                steps: [
                    { skill: "المساواة الأولية للتعويض", expected: "x + 4 = -2x + 1", options: ["x + 4 = 2x + 1", "x + 4 = -2x + 1", "y = x - 2x", "x + 4 = y"], userInstruction: "الخطوة 1: ساوي ببن المعادلتين للتخلص من y", hint: "ضع ما يساويه y في المعادلة الأولى قبالة ما يساويه في المعادلة الثانية", success: "عمل موفق وتفكير سليم!" },
                    { skill: "تجميع المتغيرات في المتطابقات", expected: "3x = -3", options: ["3x = -3", "x = 3", "-x = 5", "3x = 5"], userInstruction: "الخطوة 2: جمع المتغيرات x في طرف والأعداد في طرف", hint: "أضف 2x للطرفين واطرح 4 من الطرفين (-2x + 2x و 1 - 4)", success: "أنت تقترب كثيراً!" },
                    { skill: "استخراج القيمة الأولى (x)", expected: "x = -1", options: ["x = -1", "x = 1", "x = 3", "x = -3"], userInstruction: "الخطوة 3: أوجد قيمة x", hint: "اقسم الطرفين على 3", success: "إجابة صحيحة لقيمة x." },
                    { skill: "التعويض النهائي لإيجاد القيمة الثانية (y)", expected: "y = 3", options: ["y = 3", "y = -1", "y = 5", "y = -3"], userInstruction: "الخطوة 4: عوض بقيمة x في أي معادلة لإيجاد y", hint: "عوض بـ x=-1 في المعادلة y=x+4", success: "بطل! لقد أوجدت نقطة الحل كاملة." }
                ],
                backup: {
                    equation: "\\begin{cases} y = 2x - 3 \\\\ y = -x + 6 \\end{cases}",
                    steps: [
                        { skill: "المساواة الأولية للتعويض", expected: "2x - 3 = -x + 6", options: ["2x - 3 = x + 6", "2x - 3 = -x + 6", "3x = -x + 6", "2x = -x + 6"], userInstruction: "سؤال تدريبي: ساوي بين المعادلتين", hint: "بما أن كلاهما يساوي y، ضعهما في مساواة.", success: "صحيح!" },
                        { skill: "استخراج القيمة الأولى (x)", expected: "x = 3", options: ["x = 3", "x = 9", "x = 1", "x = -3"], userInstruction: "أوجد قيمة x مباشرًة (بعد ترتيب المعادلة في عقلك)", hint: "3x = 9، وبالتالي ماذا تساوي x؟", success: "ممتاز." },
                        { skill: "التعويض النهائي لإيجاد القيمة الثانية (y)", expected: "y = 3", options: ["y = 3", "y = 9", "y = -3", "y = 6"], userInstruction: "عوض لنجد y", hint: "أدخل x=3 في y = 2x - 3", success: "أحسنت!" }
                    ]
                }
            },
            {
                skill: "التعويض المتقدم لمعادلة خطية ضمن قياسية",
                tutorial: {
                    title: "شرح قبل البدء: التعويض داخل معادلة قياسية",
                    equation: "\\begin{cases} y = 2x - 1 \\\\ 3x + y = 14 \\end{cases}",
                    steps: [
                        { text: "أولاً: نعوض كامل معادلة y في المعادلة الثانية (القياسية) بدلاً من حرف y.", math: "$$3x + (2x - 1) = 14$$" },
                        { text: "ثانياً: نجمع الحدود المتشابهة.", math: "$$5x - 1 = 14$$" },
                        { text: "ثالثاً: نحل لإيجاد x ثم نعوض لنجد y.", math: "$$5x = 15 \\Rightarrow x = 3$$" }
                    ]
                },
                equation: "\\begin{cases} y = 3x - 2 \\\\ 2x + y = 13 \\end{cases}",
                steps: [
                    { skill: "تطبيق التعويض في الشكل القياسي", expected: "2x + 3x - 2 = 13", options: ["3x + 2x + 2 = 13", "2x + (3x - 2) = 13", "2x + 3x - 2 = 13", "5x + 13 = -2"], userInstruction: "الخطوة 1: استبدل الـ y في المعادلة الثانية بما تساويه من المعادلة الأولى", hint: "اكتب 2x زائد (3x - 2) مكان الـ y", success: "أحسنت في استبدال المتغير بالمعادلة." },
                    { skill: "جمع الحدود الجبرية المتشابهة", expected: "5x - 2 = 13", options: ["6x - 2 = 13", "5x - 2 = 13", "x - 2 = 13", "5x + 2 = 13"], userInstruction: "الخطوة 2: بسّط المعادلة من خلال جمع معاملات x", hint: "اجمع 2x مع 3x", success: "تبسيط صحيح ومتقن." },
                    { skill: "استخراج القيمة الأولى (x)", expected: "x = 3", options: ["x = 3", "x = 15", "x = -3", "x = 5"], userInstruction: "الخطوة 3: أوجد قيمة x", hint: "5x = 15، اقسم على 5", success: "تمت إيجاد الجزء الأول من الحل بنجاح." },
                    { skill: "التعويض النهائي لإيجاد القيمة الثانية (y)", expected: "y = 7", options: ["y = 7", "y = 11", "y = 5", "y = 9"], userInstruction: "الخطوة 4: عوض بقيمة x لإيجاد قيمة y النهائية", hint: "استخدم المعادلة سهلة التعويض: y = 3(3) - 2", success: "بطل! النقطة (3, 7) هي الحل." }
                ]
            }
        ]
    },
    {
        level: 3,
        title: "المستوى الثالث: حل النظام بالحذف",
        questions: [
            {
                skill: "الحذف المباشر (عن طريق الجمع)",
                tutorial: {
                    title: "شرح قبل البدء: طريقة الحذف",
                    equation: "\\begin{cases} x + y = 10 \\\\ 2x - y = 5 \\end{cases}",
                    steps: [
                        { text: "عند رؤية متغير يمتلك معاملين متعاكسين (مثل y و -y)، أو أرقام متعاكسة، فالأفضل جمع المعادلتين رأسياً!", text: "" },
                        { text: "أولاً: نجمع المعادلتين مما يؤدي لاختفاء (حذف) الـ y تماماً.", math: "$$3x = 15$$" },
                        { text: "ثانياً: نحصل على المتغير الأول.", math: "$$x = 5$$" },
                        { text: "ثالثاً: نعوض بـ x لإيجاد y.", math: "$$5 + y = 10 \\Rightarrow y = 5$$" }
                    ]
                },
                equation: "\\begin{cases} 4x + y = 12 \\\\ 2x - y = 6 \\end{cases}",
                steps: [
                    { skill: "تطبيق جمع المعادلتين للحذف", expected: "6x = 18", options: ["2x = 6", "6x = 18", "6x = 6", "2x = 18"], userInstruction: "الخطوة 1: اجمع المعادلتين رأسياً لحذف المتغير y", hint: "اجمع 4x+2x و y مع -y (تحذف) و 12+6", success: "حذف ذكي جداً!" },
                    { skill: "استخراج القيمة الأولى (x)", expected: "x = 3", options: ["x = 3", "x = 6", "x = -3", "x = 9"], userInstruction: "الخطوة 2: استخرج قيمة x من المعادلة البسيطة الناتجة", hint: "انقل المعامل 6 مع قسمة الطرفين على 6", success: "نصف المسافة قد قُطعت." },
                    { skill: "التعويض لحل القيمة المتبقية", expected: "y = 0", options: ["y = 2", "y = 0", "y = 6", "y = -2"], userInstruction: "الخطوة 3: عوض بناتج x في أحد المعادلتين لتعرف قيمة y", hint: "استعمل 4(3) + y = 12 لتعرف قيمة y", success: "عمل متكامل! لقد حللت النظام بنجاح." }
                ],
                backup: {
                    equation: "\\begin{cases} 5x + 3y = 19 \\\\ x - 3y = -1 \\end{cases}",
                    steps: [
                        { skill: "تطبيق جمع المعادلتين للحذف", expected: "6x = 18", options: ["4x = 20", "6x = 18", "6x = 20", "4x = 18"], userInstruction: "سؤال تدريبي: اجمع لحذف 3y و -3y", hint: "اجمع المعادلتين", success: "حذف سليم!" },
                        { skill: "استخراج القيمة الأولى (x)", expected: "x = 3", options: ["x = 3", "x = 2", "x = 5", "x = 6"], userInstruction: "أوجد قيمة x", hint: "أكمل العملية 6x = 18", success: "ممتاز." },
                        { skill: "التعويض لحل القيمة المتبقية", expected: "y = 4/3", options: ["y = 4/3", "y = 2", "y = 3", "y = 1"], userInstruction: "عوض لنجد y", hint: "يفضل تعويض x=3 في المعادلة الثانية: 3 - 3y = -1، إذن -3y = -4 أي y = 4/3", success: "رائع جداً." }
                    ]
                }
            },
            {
                skill: "تجهيز المعادلات للحذف بالضرب المسبق",
                tutorial: {
                    title: "شرح قبل البدء: ماذا لو لم يكن هناك معاملات متعاكسة؟",
                    equation: "\\begin{cases} x + 2y = 8 \\\\ 3x - y = 3 \\end{cases}",
                    steps: [
                        { text: "أولاً: إذا لم تكن المعاملات جاهزة للحذف، نضرب إحدى المعادلتين (أو كلاهما) في رقم لتكوين معاملات متعاكسة.", text: "" },
                        { text: "مثلاً: نضرب المعادلة الثانية في 2 لتصبح الـ y متعاكسة.", math: "$$6x - 2y = 6$$" },
                        { text: "ثانياً: النظام الجديد بعد الضرب يصبح جاهزاً للحذف المباشر (بطرح أو جمع المعادلتين).", math: "\\begin{cases} x + 2y = 8 \\\\ 6x - 2y = 6 \\end{cases}" },
                        { text: "نجمع المعادلتين فتختفي y.", math: "$$7x = 14 \\Rightarrow x = 2$$" }
                    ]
                },
                equation: "\\begin{cases} x + y = 6 \\\\ 2x - 3y = -8 \\end{cases}",
                steps: [
                    { skill: "ضرب المعادلة لمساواة المعاملات", expected: "3x + 3y = 18", options: ["2x + 2y = 12", "3x + y = 18", "3x + 3y = 18", "-2x - 2y = -12"], userInstruction: "الخطوة 1: اضرب المعادلة الأولى بـ 3 لكي تجعل معامل y هو 3، ليعاكس -3y بالمعادلة الثانية.", hint: "اضرب كل حد في x+y=6 في العدد 3", success: "خطوة تجهيز عبقرية!" },
                    { skill: "الجمع المباشر بعد التجهيز", expected: "5x = 10", options: ["5x = 10", "x = -2", "5x = 14", "x = 4"], userInstruction: "الخطوة 2: أضف المعادلة الجديدة (3x+3y=18) للمعادلة الثانية (2x-3y=-8) واحذف المتغير", hint: "اجمع 3x+2x والطرف الآخر 18-8", success: "ممتاز، تم التخلص من أصعب جزء." },
                    { skill: "استخراج القيمة الأولى (x)", expected: "x = 2", options: ["x = 2", "x = -2", "x = 5", "x = 4"], userInstruction: "الخطوة 3: أوجد القيمة x للمتغير", hint: "اقسم على 5", success: "أحسنت." },
                    { skill: "التعويض النهائي لإيجاد القيمة الثانية (y)", expected: "y = 4", options: ["y = 4", "y = 2", "y = -4", "y = 8"], userInstruction: "الخطوة الأخيرة: عوّض بـ x لإيجاد قيمة y النهائية في أسهل معادلة", hint: "أسهل معادلة هي الأصلية الأولى x + y = 6", success: "أنت جاهز لأي مسألة صعبة رياضياً! الحل هوالنقطة (2, 4)." }
                ]
            }
        ]
    }
];

// حالة التطبيق
const appState = {
    studentName: "",
    currentLevelIndex: 0,
    currentQuestionIndex: 0,
    currentStepIndex: 0,
    score: 0,
    totalPossibleScore: 0, // أقصى درجة بناءً على عدد الأسئلة
    errors: 0,
    timeStarted: null,
    selectedAnswer: "",
    isBackupQuestion: false,
    madeErrorInCurrentQuestion: false,
    hasShownQuestionTutorial: false,
    failedSkills: []
};

// عناصر واجهة المستخدم
const elements = {
    screens: {
        login: document.getElementById('login-screen'),
        game: document.getElementById('game-screen'),
        end: document.getElementById('end-screen')
    },
    displays: {
        studentInfo: document.getElementById('student-info'),
        scoreInfo: document.getElementById('score-info'),
        nameOut: document.getElementById('student-name-display'),
        levelOut: document.getElementById('current-level-display'),
        scoreOut: document.getElementById('score-display'),
        totalScoreOut: document.getElementById('total-score-display'),
        progressBar: document.getElementById('progress-bar'),
        progressContainer: document.getElementById('progress-container')
    },
    game: {
        levelIndicator: document.getElementById('level-indicator'),
        questionText: document.getElementById('question-text'),
        stepsContainer: document.getElementById('steps-container'),
        instructionText: document.getElementById('instruction-text'),
        customSelectContainer: document.getElementById('custom-select-container'),
        selectSelected: document.getElementById('select-selected'),
        selectItems: document.getElementById('select-items'),
        feedbackMsg: document.getElementById('feedback-message'),
        tutorialContainer: document.getElementById('tutorial-container'),
        mainQuestionContainer: document.getElementById('main-question-container'),
        tutorialTitle: document.getElementById('tutorial-title'),
        tutorialEquation: document.getElementById('tutorial-equation'),
        tutorialStepsContainer: document.getElementById('tutorial-steps-container'),
        startLevelBtn: document.getElementById('start-level-btn')
    }
};

// الدالة المسؤولة عن بناء خط الأعداد بواسطة SVG (نحتفظ بها لاستخدام مستقبلي أو إذا تطلب سؤال رسم بياني مبسط)
function generateNumberLineSVG(optStr) {
    const parts = optStr.split('_');
    const type = parts[1]; // ge, le, gt, lt
    const value = parts[2];

    const isClosed = (type === 'ge' || type === 'le');
    const isRight = (type === 'ge' || type === 'gt');

    // تصميم خط الأعداد التفاعلي كـ SVG
    let svg = `<svg viewBox="0 0 300 80" width="100%" height="80" xmlns="http://www.w3.org/2000/svg">`;
    svg += `<line x1="20" y1="40" x2="280" y2="40" stroke="#94a3b8" stroke-width="3" />`;
    svg += `<polygon points="20,40 30,33 30,47" fill="#94a3b8"/>`;
    svg += `<polygon points="280,40 270,33 270,47" fill="#94a3b8"/>`;
    svg += `<line x1="150" y1="30" x2="150" y2="50" stroke="#64748b" stroke-width="2" />`;
    svg += `<text x="150" y="70" font-family="Arial, Tajawal, sans-serif" font-weight="bold" font-size="20" fill="#334155" text-anchor="middle">${value}</text>`;
    if (isRight) {
        svg += `<line x1="150" y1="40" x2="260" y2="40" stroke="#0ea5e9" stroke-width="7" opacity="0.8"/>`;
        svg += `<polygon points="270,40 250,28 250,52" fill="#0ea5e9"/>`;
    } else {
        svg += `<line x1="150" y1="40" x2="40" y2="40" stroke="#0ea5e9" stroke-width="7" opacity="0.8"/>`;
        svg += `<polygon points="30,40 50,28 50,52" fill="#0ea5e9"/>`;
    }
    if (isClosed) {
        svg += `<circle cx="150" cy="40" r="8" fill="#0ea5e9" stroke="#0284c7" stroke-width="2"/>`;
    } else {
        svg += `<circle cx="150" cy="40" r="8" fill="#ffffff" stroke="#0ea5e9" stroke-width="4"/>`;
    }
    svg += `</svg>`;
    return svg;
}

// الدالة المسؤولة عن حفظ البيانات وتحديث لوحة المعلم
function updateTeacherDashboard() {
    let studentData = {
        level: appState.currentLevelIndex + 1,
        score: appState.score,
        totalScore: appState.totalPossibleScore,
        errors: appState.errors,
        failedSkills: [...new Set(appState.failedSkills)],
        timeStarted: appState.timeStarted || new Date().toLocaleTimeString('ar-QA')
    };

    if (useFirebase && appState.studentName) {
        // الحفظ السحابي
        set(ref(db, 'u4_students/' + appState.studentName), studentData).catch(error => {
            console.error("خطأ في حفظ البيانات سحابياً: ", error);
        });
    } else {
        // الحفظ المحلي (كبديل إذا لم تعمل السحابة)
        let studentsData = JSON.parse(localStorage.getItem('math_lesson_u4_students')) || {};
        studentsData[appState.studentName] = studentData;
        localStorage.setItem('math_lesson_u4_students', JSON.stringify(studentsData));
        if (typeof updateLiveLeaderboard === 'function') {
            updateLiveLeaderboard();
        }
    }
}

function updateLiveLeaderboard() {
    const listEl = document.getElementById('leaderboard-list');
    if (!listEl) return;

    let studentsData = JSON.parse(localStorage.getItem('math_lesson_u4_students')) || {};
    let allStudents = [];

    // جلب الطلاب الحقيقيين من النظام (الذين دخلوا مسبقاً)
    for (const [name, data] of Object.entries(studentsData)) {
        if (name !== appState.studentName) {
            allStudents.push({ name: name, score: data.score, isCurrent: false });
        }
    }

    // دمج نقاط الطالب الحالي اللحظية
    if (appState.studentName) {
        allStudents.push({ name: appState.studentName, score: appState.score, isCurrent: true });
    }

    // ترتيب تنازلي حسب النقاط
    allStudents.sort((a, b) => b.score - a.score);

    // تحديث القائمة
    listEl.innerHTML = '';

    if (allStudents.length === 0) {
        return;
    }

    // عرض أصحاب المراكز الأولى، ويمكن أن يكون الطالب الوحيد
    allStudents.forEach((st, index) => {
        const item = document.createElement('li');
        item.className = `leaderboard-item ${st.isCurrent ? 'current-student' : ''}`;

        let rankHtml = `<div class="leaderboard-rank">${index + 1}</div>`;
        if (index === 0) rankHtml = `<div class="leaderboard-rank" style="background: #fbbf24;">1</div>`;
        else if (index === 1) rankHtml = `<div class="leaderboard-rank" style="background: #94a3b8;">2</div>`;
        else if (index === 2) rankHtml = `<div class="leaderboard-rank" style="background: #b45309;">3</div>`;

        item.innerHTML = `
            ${rankHtml}
            <div class="leaderboard-name">${st.name}</div>
            <div class="leaderboard-score">${st.score} <span style="font-size:0.8rem; color:#64748b;">نقطة</span></div>
        `;
        listEl.appendChild(item);
    });
}

if (!useFirebase) {
    window.addEventListener('storage', (e) => {
        if (e.key === 'math_lesson_u4_students') {
            if (typeof updateLiveLeaderboard === 'function') {
                updateLiveLeaderboard();
            }
        }
    });
}

function calculateTotalPossibleScore() {
    let total = 0;
    levelsData.forEach(lvl => {
        lvl.questions.forEach(q => {
            total += (q.steps.length * 10);
            total += 20;
        });
        total += 50;
    });
    return total;
}

document.getElementById('start-btn').addEventListener('click', () => {
    const nameInput = document.getElementById('student-name').value.trim();
    if (nameInput === "") {
        alert("الرجاء إدخال اسمك لبدء التحدي.");
        return;
    }

    appState.studentName = nameInput;
    appState.timeStarted = new Date().toLocaleTimeString('ar-QA', { hour: '2-digit', minute: '2-digit' });
    appState.totalPossibleScore = calculateTotalPossibleScore();

    elements.displays.nameOut.textContent = appState.studentName;
    if (elements.displays.totalScoreOut) {
        elements.displays.totalScoreOut.textContent = appState.totalPossibleScore;
    }
    elements.displays.studentInfo.classList.remove('hidden');
    elements.displays.scoreInfo.classList.remove('hidden');
    elements.displays.progressContainer.classList.remove('hidden');

    elements.screens.login.classList.remove('active');
    elements.screens.game.classList.remove('hidden');
    elements.screens.game.classList.add('active');

    const sidebar = document.getElementById('leaderboard-sidebar');
    if (sidebar) sidebar.classList.add('active');

    appState.hasShownQuestionTutorial = false;
    checkAndShowTutorial();
    updateTeacherDashboard();
});

function checkAndShowTutorial() {
    const currentLevel = levelsData[appState.currentLevelIndex];
    const currentQuestion = currentLevel.questions[appState.currentQuestionIndex];

    if (currentQuestion.tutorial && !appState.hasShownQuestionTutorial && !appState.isBackupQuestion) {
        elements.game.mainQuestionContainer.classList.add('hidden');
        elements.game.tutorialContainer.classList.remove('hidden');
        elements.game.levelIndicator.textContent = currentLevel.title;

        elements.game.tutorialTitle.textContent = currentQuestion.tutorial.title;
        elements.game.tutorialEquation.innerHTML = `$$${currentQuestion.tutorial.equation}$$`;
        elements.game.tutorialStepsContainer.innerHTML = '';
        elements.game.startLevelBtn.classList.add('hidden');

        if (window.MathJax) {
            MathJax.typesetPromise([elements.game.tutorialEquation]).catch(err => console.log(err));
        }

        let delay = 1000;
        currentQuestion.tutorial.steps.forEach((step, index) => {
            setTimeout(() => {
                const stepDiv = document.createElement('div');
                stepDiv.className = 'tutorial-step';
                let mathHtml = '';
                if (step.math) {
                    mathHtml = `<div class="tutorial-step-math">${step.math}</div>`;
                } else if (step.mathSVG) {
                    mathHtml = `<div class="tutorial-step-math" style="background:none; border: 2px solid #bae6fd;">${generateNumberLineSVG(step.mathSVG)}</div>`;
                }

                stepDiv.innerHTML = `
                    <div class="tutorial-step-text">${step.text}</div>
                    ${mathHtml}
                `;
                elements.game.tutorialStepsContainer.appendChild(stepDiv);

                if (window.MathJax && step.math) {
                    MathJax.typesetPromise([stepDiv]).catch(err => console.log(err));
                }

                setTimeout(() => {
                    stepDiv.classList.add('visible');
                }, 100);

                if (index === currentQuestion.tutorial.steps.length - 1) {
                    setTimeout(() => {
                        elements.game.startLevelBtn.classList.remove('hidden');
                    }, 500);
                }
            }, delay);
            delay += 2500;
        });

    } else {
        startQuestion();
    }
}

document.getElementById('start-level-btn').addEventListener('click', () => {
    appState.hasShownQuestionTutorial = true;
    startQuestion();
});

function startQuestion() {
    elements.game.tutorialContainer.classList.add('hidden');
    elements.game.mainQuestionContainer.classList.remove('hidden');
    loadQuestion();
}

elements.game.selectSelected.addEventListener('click', function (e) {
    e.stopPropagation();
    elements.game.selectItems.classList.toggle('select-hide');
    this.classList.toggle('select-arrow-active');
});

function closeAllSelect() {
    elements.game.selectItems.classList.add('select-hide');
    elements.game.selectSelected.classList.remove('select-arrow-active');
}
document.addEventListener('click', closeAllSelect);

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function loadQuestion() {
    const currentLevel = levelsData[appState.currentLevelIndex];
    let currentQuestion = currentLevel.questions[appState.currentQuestionIndex];

    if (appState.isBackupQuestion && currentQuestion.backup) {
        currentQuestion = currentQuestion.backup;
    }

    const currentStepObj = currentQuestion.steps[appState.currentStepIndex];

    elements.displays.levelOut.textContent = (appState.currentLevelIndex + 1);
    elements.game.levelIndicator.textContent = currentLevel.title;

    // إمكانية دمج معادلات LaTeX معقدة (مثل أنظمة المعادلات)
    let eqT = currentQuestion.equation;
    if (eqT.includes("\\begin{cases}")) {
        elements.game.questionText.innerHTML = `<div>حل النظام التالي:</div> <div style="direction:ltr;">$$${eqT}$$</div>`;
    } else {
        elements.game.questionText.textContent = `حل: ${eqT}`;
    }

    elements.game.instructionText.textContent = currentStepObj.userInstruction;
    elements.game.selectSelected.innerHTML = 'اختر الإجابة أو المعادلة...';
    elements.game.selectItems.innerHTML = '';
    appState.selectedAnswer = '';

    let options = [...currentStepObj.options];
    options = shuffleArray(options);

    options.forEach(opt => {
        const optionDiv = document.createElement('div');

        if (opt.startsWith("NL_")) {
            optionDiv.innerHTML = generateNumberLineSVG(opt);
            optionDiv.style.width = "100%";
            optionDiv.style.cursor = "pointer";
            optionDiv.style.marginBottom = "-5px";
        } else if (opt.includes("حل") || opt.includes("لها")) {
            // الخيارات النصية الخالصة التي ليست معادلات لايتكس
            optionDiv.innerHTML = `<span style="text-align:right">${opt}</span>`;
            optionDiv.style.display = "block";
            optionDiv.style.textAlign = "right";
        } else {
            let latexOpt = opt.replace('>=', '\\ge').replace('<=', '\\le');
            if (latexOpt.includes('≥')) latexOpt = latexOpt.replace('≥', '\\ge');
            if (latexOpt.includes('≤')) latexOpt = latexOpt.replace('≤', '\\le');
            optionDiv.innerHTML = `$$${latexOpt}$$`;
        }

        optionDiv.addEventListener('click', function () {
            elements.game.selectSelected.innerHTML = this.innerHTML;
            appState.selectedAnswer = opt; // القيمة الحقيقية للمقارنة
            closeAllSelect();
            if (window.MathJax && (!opt.startsWith('NL_') && !opt.includes("حل"))) {
                MathJax.typesetPromise([elements.game.selectSelected]).catch((err) => console.log(err.message));
            }
        });

        elements.game.selectItems.appendChild(optionDiv);
    });

    elements.game.feedbackMsg.className = "feedback";

    const totalQuestions = levelsData.reduce((acc, curr) => acc + curr.questions.length, 0);
    let completedQuestions = 0;
    for (let i = 0; i < appState.currentLevelIndex; i++) completedQuestions += levelsData[i].questions.length;
    completedQuestions += appState.currentQuestionIndex;

    const progressPercent = (completedQuestions / totalQuestions) * 100;
    elements.displays.progressBar.style.width = `${progressPercent}%`;

    updateTeacherDashboard();

    if (window.MathJax) {
        MathJax.typesetPromise([elements.game.questionText, elements.game.selectItems]).catch((err) => console.log(err.message));
    }
}

function normalizeEquation(eq) {
    if (!eq) return "";
    if (eq.startsWith("NL_")) return eq;
    if (eq.includes("حل") || eq.includes("لها")) return eq; // لا تبسط النصوص العربية

    let normalized = eq.replace(/\s+/g, '').toUpperCase();
    normalized = normalized.replace('>=', '≥').replace('<=', '≤');
    return normalized;
}

document.getElementById('check-btn').addEventListener('click', checkAnswer);

function checkAnswer() {
    const userInput = appState.selectedAnswer;

    if (!userInput) {
        alert("الرجاء اختيار إجابة من القائمة أولاً.");
        return;
    }

    const normalizedInput = normalizeEquation(userInput);

    const currentLevel = levelsData[appState.currentLevelIndex];
    let currentQuestion = currentLevel.questions[appState.currentQuestionIndex];
    if (appState.isBackupQuestion && currentQuestion.backup) {
        currentQuestion = currentQuestion.backup;
    }

    const currentStepObj = currentQuestion.steps[appState.currentStepIndex];
    const expectedAnswer = normalizeEquation(currentStepObj.expected);
    const feedbackEl = elements.game.feedbackMsg;

    if (normalizedInput === expectedAnswer || (normalizedInput.includes('4/3') && expectedAnswer.includes('1.33'))) {
        appState.score += 10;
        elements.displays.scoreOut.textContent = appState.score;

        feedbackEl.textContent = currentStepObj.success;
        feedbackEl.className = "feedback success";

        const stepCard = document.createElement('div');
        stepCard.className = 'step-card';

        if (expectedAnswer.startsWith("NL_")) {
            stepCard.innerHTML = `<span class="step-text">${currentStepObj.userInstruction}</span> <div class="step-math-svg" style="width:250px; display:inline-block; border-radius: 8px; background:white; border: 2px solid #bae6fd;">${generateNumberLineSVG(currentStepObj.expected)}</div>`;
        } else if (expectedAnswer.includes("حل") || expectedAnswer.includes("لها")) {
            stepCard.innerHTML = `<span class="step-text">${currentStepObj.userInstruction}</span> <span class="step-math" style="direction:rtl">${currentStepObj.expected}</span>`;
        } else {
            let latexEq = expectedAnswer.replace('>=', '\\ge').replace('<=', '\\le');
            if (latexEq.includes('≥')) latexEq = latexEq.replace('≥', '\\ge');
            if (latexEq.includes('≤')) latexEq = latexEq.replace('≤', '\\le');
            stepCard.innerHTML = `<span class="step-text">${currentStepObj.userInstruction}</span> <span class="step-math" style="direction:ltr">$$${latexEq}$$</span>`;
        }

        elements.game.stepsContainer.appendChild(stepCard);

        if (window.MathJax && !expectedAnswer.startsWith("NL_") && !expectedAnswer.includes("حل")) {
            MathJax.typesetPromise([stepCard]).catch((err) => console.log(err.message));
        }

        appState.currentStepIndex++;

        if (appState.currentStepIndex >= currentQuestion.steps.length) {
            appState.currentStepIndex = 0;

            if (appState.madeErrorInCurrentQuestion && !appState.isBackupQuestion && levelsData[appState.currentLevelIndex].questions[appState.currentQuestionIndex].backup) {
                appState.isBackupQuestion = true;
                appState.madeErrorInCurrentQuestion = false;
                alert("ممتاز لأنك أكملت السؤال! لأنك واجهت بعض الصعوبات، سنعطيك سؤالاً مشابهاً للتدريب.");
            } else {
                appState.currentQuestionIndex++;
                appState.isBackupQuestion = false;
                appState.madeErrorInCurrentQuestion = false;
                appState.score += 20;
            }

            setTimeout(() => {
                elements.game.stepsContainer.innerHTML = '';

                if (appState.currentQuestionIndex >= currentLevel.questions.length) {
                    appState.currentQuestionIndex = 0;
                    appState.currentLevelIndex++;
                    appState.score += 50;

                    if (appState.currentLevelIndex >= levelsData.length) {
                        endGame();
                    } else {
                        alert(`مبروك! لقد انتقلت إلى ${levelsData[appState.currentLevelIndex].title} 🚀`);
                        appState.hasShownQuestionTutorial = false;
                        checkAndShowTutorial();
                    }
                } else {
                    appState.hasShownQuestionTutorial = false;
                    checkAndShowTutorial();
                }
            }, 1000);
        } else {
            setTimeout(() => {
                const nextStep = currentQuestion.steps[appState.currentStepIndex];
                elements.game.instructionText.textContent = nextStep.userInstruction;

                elements.game.selectSelected.innerHTML = 'اختر الخطوة التالية...';
                elements.game.selectItems.innerHTML = '';
                appState.selectedAnswer = '';

                let options = shuffleArray([...nextStep.options]);
                options.forEach(opt => {
                    const optionDiv = document.createElement('div');

                    if (opt.startsWith("NL_")) {
                        optionDiv.innerHTML = generateNumberLineSVG(opt);
                        optionDiv.style.width = "100%";
                        optionDiv.style.cursor = "pointer";
                        optionDiv.style.marginBottom = "-5px";
                    } else if (opt.includes("حل") || opt.includes("لها")) {
                        optionDiv.innerHTML = `<span style="text-align:right">${opt}</span>`;
                        optionDiv.style.display = "block";
                        optionDiv.style.textAlign = "right";
                    } else {
                        let latexOpt = opt.replace('>=', '\\ge').replace('<=', '\\le');
                        if (latexOpt.includes('≥')) latexOpt = latexOpt.replace('≥', '\\ge');
                        if (latexOpt.includes('≤')) latexOpt = latexOpt.replace('≤', '\\le');

                        optionDiv.innerHTML = `$$${latexOpt}$$`;
                    }

                    optionDiv.addEventListener('click', function () {
                        elements.game.selectSelected.innerHTML = this.innerHTML;
                        appState.selectedAnswer = opt;
                        closeAllSelect();
                        if (window.MathJax && !opt.startsWith('NL_') && !opt.includes("حل")) {
                            MathJax.typesetPromise([elements.game.selectSelected]).catch((err) => console.log(err.message));
                        }
                    });
                    elements.game.selectItems.appendChild(optionDiv);
                });

                if (window.MathJax) {
                    MathJax.typesetPromise([elements.game.selectItems]).catch((err) => console.log(err.message));
                }

                feedbackEl.className = "feedback";
            }, 1000);
        }

    } else {
        appState.errors++;
        appState.score = Math.max(0, appState.score - 5);
        appState.madeErrorInCurrentQuestion = true;

        const skillToRecord = currentStepObj.skill || currentQuestion.skill;
        if (skillToRecord && !appState.failedSkills.includes(skillToRecord)) {
            appState.failedSkills.push(skillToRecord);
        }

        elements.displays.scoreOut.textContent = appState.score;

        feedbackEl.innerHTML = `<strong>خطأ:</strong> حاول مرة أخرى! <br>💡 <em>تلميح:</em> ${currentStepObj.hint}`;
        feedbackEl.className = "feedback error";

        const checkBtn = document.getElementById('check-btn');
        if (checkBtn) {
            checkBtn.classList.add('shake');
            setTimeout(() => checkBtn.classList.remove('shake'), 400);
        }

        elements.game.selectSelected.innerHTML = '<span style="color:#ef4444;">اختر إجابة أخرى...</span>';
        appState.selectedAnswer = '';
    }

    updateTeacherDashboard();
}

function endGame() {
    elements.screens.game.classList.remove('active');
    elements.screens.game.classList.add('hidden');
    elements.screens.end.classList.remove('hidden');
    elements.screens.end.classList.add('active');

    document.getElementById('final-score').textContent = appState.score;
    const finalTotalEl = document.getElementById('final-total-score');
    if (finalTotalEl) {
        finalTotalEl.textContent = appState.totalPossibleScore;
    }
    document.getElementById('final-level').textContent = "أنهيت جميع المستويات";

    elements.displays.progressBar.style.width = '100%';

    appState.currentLevelIndex = 3;
    updateTeacherDashboard();
}
