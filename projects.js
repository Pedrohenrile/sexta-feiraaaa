/* =========================================================
   ORION — PROJECTS ENGINE
   Projetos + Estudos + Objetivos + Finanças
   ========================================================= */


/* =========================================================
   CONFIGURAÇÃO
   ========================================================= */

const PROJECTS_CONFIG = {
    storageKey: "orion_projects_core",

    locale: "pt-BR",

    defaultStudyProgress: 64,

    defaultFinance: {
        balance: 0,
        income: 0,
        expenses: 0,
        goal: 0
    }
};


/* =========================================================
   ESTADO
   ========================================================= */

const PROJECTS_STATE = {
    initialized: false,

    focusMode: false,

    projects: [],

    tasks: [],

    goals: [],

    studies: {
        progress: 64,
        questions: 128,
        correct: 91,
        essays: 2,
        focus: "Ciências da Natureza"
    },

    finance: {
        balance: 0,
        income: 0,
        expenses: 0,
        goal: 0
    }
};


/* =========================================================
   ELEMENTOS
   ========================================================= */

const projectsElements = {

    projectCount:
        document.querySelector("[data-project-count]"),

    taskCount:
        document.querySelector("[data-task-count]"),

    studyProgress:
        document.querySelector("[data-study-progress]"),

    financeBalance:
        document.querySelector("[data-finance-balance]"),

    financeMain:
        document.querySelector("[data-finance-main]"),

    projectCards:
        document.querySelectorAll("[data-project]"),

    taskCheckboxes:
        document.querySelectorAll("[data-task-checkbox]"),

    projectAddButtons:
        document.querySelectorAll(
            "[data-action='project-add']"
        ),

    projectFocusButtons:
        document.querySelectorAll(
            "[data-action='project-focus']"
        ),

    projectOpenButtons:
        document.querySelectorAll(
            "[data-action='project-open']"
        ),

    financeAddButton:
        document.querySelector(
            "[data-action='finance-add']"
        )
};


/* =========================================================
   DADOS PADRÃO
   ========================================================= */

const DEFAULT_PROJECTS = [

    {
        id: "sexta-feira",
        name: "SEXTA-FEIRA",
        category: "Sistema pessoal",
        status: "active",
        progress: 42,
        next: "Módulo de voz"
    },

    {
        id: "web-lab",
        name: "WEB LAB",
        category: "Desenvolvimento web",
        status: "active",
        progress: 67,
        next: "Finalizar portfólio"
    },

    {
        id: "independencia",
        name: "INDEPENDÊNCIA",
        category: "Projeto financeiro",
        status: "planning",
        progress: 21,
        next: "Primeira fonte de renda"
    }

];


const DEFAULT_TASKS = [

    {
        id: "task-01",
        title: "Estudar para o ENEM",
        category: "Ciências da Natureza",
        priority: "high",
        completed: false
    },

    {
        id: "task-02",
        title: "Evoluir página da SEXTA-FEIRA",
        category: "Project Lab",
        priority: "medium",
        completed: false
    },

    {
        id: "task-03",
        title: "Revisar Python",
        category: "Programação",
        priority: "medium",
        completed: false
    },

    {
        id: "task-04",
        title: "Registrar evolução da academia",
        category: "Desempenho",
        priority: "low",
        completed: false
    }

];


const DEFAULT_GOALS = [

    {
        id: "goal-programming",
        name: "Dominar programação",
        category: "Python • Web • Backend",
        progress: 58
    },

    {
        id: "goal-enem",
        name: "Preparação ENEM",
        category: "ENEM 2026",
        progress: 64
    },

    {
        id: "goal-physical",
        name: "Evolução física",
        category: "Academia • Consistência",
        progress: 72
    },

    {
        id: "goal-finance",
        name: "Independência financeira",
        category: "Renda • Economia • Projetos",
        progress: 21
    }

];


/* =========================================================
   STORAGE
   ========================================================= */

function loadProjectsData() {

    try {

        const saved =
            localStorage.getItem(
                PROJECTS_CONFIG.storageKey
            );

        if (!saved) {

            PROJECTS_STATE.projects =
                [...DEFAULT_PROJECTS];

            PROJECTS_STATE.tasks =
                [...DEFAULT_TASKS];

            PROJECTS_STATE.goals =
                [...DEFAULT_GOALS];

            PROJECTS_STATE.studies = {
                progress: 64,
                questions: 128,
                correct: 91,
                essays: 2,
                focus: "Ciências da Natureza"
            };

            PROJECTS_STATE.finance = {
                ...PROJECTS_CONFIG.defaultFinance
            };

            return;
        }


        const data =
            JSON.parse(saved);


        PROJECTS_STATE.projects =
            Array.isArray(data.projects)
                ? data.projects
                : [...DEFAULT_PROJECTS];


        PROJECTS_STATE.tasks =
            Array.isArray(data.tasks)
                ? data.tasks
                : [...DEFAULT_TASKS];


        PROJECTS_STATE.goals =
            Array.isArray(data.goals)
                ? data.goals
                : [...DEFAULT_GOALS];


        PROJECTS_STATE.studies =
            data.studies || {
                progress: 64,
                questions: 128,
                correct: 91,
                essays: 2,
                focus: "Ciências da Natureza"
            };


        PROJECTS_STATE.finance =
            data.finance || {
                ...PROJECTS_CONFIG.defaultFinance
            };


    } catch (error) {

        console.warn(
            "Falha ao carregar Project Core.",
            error
        );

        PROJECTS_STATE.projects =
            [...DEFAULT_PROJECTS];

        PROJECTS_STATE.tasks =
            [...DEFAULT_TASKS];

        PROJECTS_STATE.goals =
            [...DEFAULT_GOALS];

    }

}


/* =========================================================
   SALVAR
   ========================================================= */

function saveProjectsData() {

    try {

        const data = {

            projects:
                PROJECTS_STATE.projects,

            tasks:
                PROJECTS_STATE.tasks,

            goals:
                PROJECTS_STATE.goals,

            studies:
                PROJECTS_STATE.studies,

            finance:
                PROJECTS_STATE.finance

        };


        localStorage.setItem(
            PROJECTS_CONFIG.storageKey,
            JSON.stringify(data)
        );


    } catch (error) {

        console.warn(
            "Falha ao salvar Project Core.",
            error
        );

    }

}


/* =========================================================
   FORMATAÇÃO FINANCEIRA
   ========================================================= */

function formatCurrency(value) {

    return new Intl.NumberFormat(
        PROJECTS_CONFIG.locale,
        {
            style: "currency",
            currency: "BRL"
        }
    ).format(value);

}


/* =========================================================
   ATUALIZAR RESUMO
   ========================================================= */

function updateProjectSummary() {

    const activeProjects =
        PROJECTS_STATE.projects.filter(
            project =>
                project.status === "active"
        ).length;


    const pendingTasks =
        PROJECTS_STATE.tasks.filter(
            task =>
                !task.completed
        ).length;


    if (projectsElements.projectCount) {

        projectsElements.projectCount.textContent =
            String(
                PROJECTS_STATE.projects.length
            ).padStart(2, "0");

    }


    if (projectsElements.taskCount) {

        projectsElements.taskCount.textContent =
            String(
                pendingTasks
            ).padStart(2, "0");

    }


    if (projectsElements.studyProgress) {

        projectsElements.studyProgress.textContent =
            `${PROJECTS_STATE.studies.progress}%`;

    }


    if (projectsElements.financeBalance) {

        projectsElements.financeBalance.textContent =
            formatCurrency(
                PROJECTS_STATE.finance.balance
            );

    }


    if (projectsElements.financeMain) {

        projectsElements.financeMain.textContent =
            formatCurrency(
                PROJECTS_STATE.finance.balance
            );

    }


    return {
        activeProjects,
        pendingTasks
    };

}


/* =========================================================
   TAREFAS
   ========================================================= */

function syncTasksWithInterface() {

    const checkboxes =
        document.querySelectorAll(
            "[data-task-checkbox]"
        );


    checkboxes.forEach(
        (checkbox, index) => {

            const task =
                PROJECTS_STATE.tasks[index];

            if (!task) {
                return;
            }


            checkbox.checked =
                task.completed;


            const taskItem =
                checkbox.closest(
                    ".task-item"
                );


            if (taskItem) {

                taskItem.classList.toggle(
                    "completed",
                    task.completed
                );

            }

        }
    );

}


function toggleTask(index, completed) {

    const task =
        PROJECTS_STATE.tasks[index];

    if (!task) {
        return;
    }


    task.completed =
        completed;


    saveProjectsData();

    updateProjectSummary();


    if (typeof notifySuccess === "function") {

        if (completed) {

            notifySuccess(
                `Tarefa concluída: ${task.title}`
            );

        }

    }


    if (
        typeof generateProjectsAnalysis ===
        "function"
    ) {

        generateProjectsAnalysis();

    }

}


function initializeTasks() {

    const checkboxes =
        document.querySelectorAll(
            "[data-task-checkbox]"
        );


    checkboxes.forEach(
        (checkbox, index) => {

            checkbox.addEventListener(
                "change",
                () => {

                    toggleTask(
                        index,
                        checkbox.checked
                    );

                }
            );

        }
    );


    syncTasksWithInterface();

}


/* =========================================================
   PROJETOS
   ========================================================= */

function createProject() {

    const name =
        prompt(
            "Nome do novo projeto:"
        );


    if (!name) {
        return;
    }


    const category =
        prompt(
            "Categoria do projeto:"
        ) ||
        "Projeto pessoal";


    const project = {

        id:
            `project-${Date.now()}`,

        name:
            name.trim(),

        category:
            category.trim(),

        status:
            "active",

        progress:
            0,

        next:
            "Definir próximo passo",

        createdAt:
            new Date().toISOString()

    };


    PROJECTS_STATE.projects.push(
        project
    );


    saveProjectsData();

    updateProjectSummary();


    if (typeof notifySuccess === "function") {

        notifySuccess(
            `Projeto "${project.name}" criado.`
        );

    }


    renderDynamicProjectNotice(
        project
    );

}


function openProject(index) {

    const project =
        PROJECTS_STATE.projects[index];

    if (!project) {
        return;
    }


    const message =
        `${project.name}\n\n` +
        `Categoria: ${project.category}\n` +
        `Progresso: ${project.progress}%\n` +
        `Próximo passo: ${project.next}`;


    if (typeof notifyInfo === "function") {

        notifyInfo(
            message,
            5000
        );

    }

}


function initializeProjectButtons() {

    projectsElements.projectAddButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                createProject
            );

        }
    );


    projectsElements.projectOpenButtons.forEach(
        (button, index) => {

            button.addEventListener(
                "click",
                () => {

                    openProject(index);

                }
            );

        }
    );

}


/* =========================================================
   AVISO DE PROJETO
   ========================================================= */

function renderDynamicProjectNotice(project) {

    const list =
        document.querySelector(
            ".project-list"
        );

    if (!list) {
        return;
    }


    const article =
        document.createElement(
            "article"
        );


    article.className =
        "project-card";


    article.dataset.project =
        "";


    article.dataset.projectStatus =
        "active";


    article.innerHTML = `

        <div class="project-card-header">

            <div class="project-identity">

                <div class="project-icon">
                    NEW
                </div>

                <div>

                    <h3>
                        ${escapeProjectHTML(project.name)}
                    </h3>

                    <span>
                        ${escapeProjectHTML(project.category)}
                    </span>

                </div>

            </div>

            <span class="status status-info">
                NOVO
            </span>

        </div>


        <p class="project-description">
            Projeto criado através do Project Lab.
        </p>


        <div class="project-progress">

            <div class="project-progress-header">

                <span>
                    PROGRESSO
                </span>

                <strong>
                    0%
                </strong>

            </div>

            <div class="progress-track">

                <div
                    class="progress-bar"
                    style="width: 0%"
                ></div>

            </div>

        </div>


        <div class="project-card-footer">

            <span>
                Próximo:
                definir próximo passo
            </span>

        </div>

    `;


    list.appendChild(
        article
    );

}


function escapeProjectHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================================================
   OBJETIVOS
   ========================================================= */

function calculateAverageGoalProgress() {

    if (!PROJECTS_STATE.goals.length) {
        return 0;
    }


    const total =
        PROJECTS_STATE.goals.reduce(
            (sum, goal) =>
                sum + Number(
                    goal.progress || 0
                ),
            0
        );


    return Math.round(
        total /
        PROJECTS_STATE.goals.length
    );

}


function getGoalsContext() {

    return PROJECTS_STATE.goals.map(
        goal => ({

            name:
                goal.name,

            category:
                goal.category,

            progress:
                goal.progress

        })
    );

}


/* =========================================================
   ESTUDOS
   ========================================================= */

function getStudyAccuracy() {

    const questions =
        Number(
            PROJECTS_STATE.studies.questions
        );


    const correct =
        Number(
            PROJECTS_STATE.studies.correct
        );


    if (!questions) {
        return 0;
    }


    return Math.round(
        (correct / questions) * 100
    );

}


function getStudyContext() {

    return {

        progress:
            PROJECTS_STATE.studies.progress,

        questions:
            PROJECTS_STATE.studies.questions,

        correct:
            PROJECTS_STATE.studies.correct,

        accuracy:
            getStudyAccuracy(),

        essays:
            PROJECTS_STATE.studies.essays,

        focus:
            PROJECTS_STATE.studies.focus

    };

}


/* =========================================================
   FINANÇAS
   ========================================================= */

function registerFinanceEntry() {

    const type =
        prompt(
            "Digite o tipo:\n\n1 — Entrada\n2 — Despesa"
        );


    if (
        type !== "1" &&
        type !== "2"
    ) {
        return;
    }


    const value =
        Number(
            prompt(
                "Digite o valor:"
            )
        );


    if (
        !Number.isFinite(value) ||
        value <= 0
    ) {

        if (typeof notifyWarning === "function") {

            notifyWarning(
                "Valor inválido."
            );

        }

        return;
    }


    const description =
        prompt(
            "Descrição:"
        ) ||
        "Movimentação";


    if (type === "1") {

        PROJECTS_STATE.finance.income +=
            value;

        PROJECTS_STATE.finance.balance +=
            value;

    } else {

        PROJECTS_STATE.finance.expenses +=
            value;

        PROJECTS_STATE.finance.balance -=
            value;

    }


    saveProjectsData();

    updateProjectSummary();


    if (typeof notifySuccess === "function") {

        notifySuccess(
            `${description}: ${formatCurrency(value)}`
        );

    }

}


function initializeFinance() {

    if (
        projectsElements.financeAddButton
    ) {

        projectsElements.financeAddButton.addEventListener(
            "click",
            registerFinanceEntry
        );

    }

}


/* =========================================================
   MODO FOCO
   ========================================================= */

function activateFocusMode() {

    PROJECTS_STATE.focusMode =
        !PROJECTS_STATE.focusMode;


    document.body.classList.toggle(
        "focus-mode-active",
        PROJECTS_STATE.focusMode
    );


    projectsElements.projectFocusButtons.forEach(
        button => {

            button.textContent =
                PROJECTS_STATE.focusMode
                    ? "SAIR DO FOCO"
                    : "MODO FOCO";

        }
    );


    if (
        typeof notifyInfo === "function"
    ) {

        notifyInfo(
            PROJECTS_STATE.focusMode
                ? "Modo Foco ativado. Prioridade máxima: execução."
                : "Modo Foco encerrado.",
            3500
        );

    }

}


function initializeFocusMode() {

    projectsElements.projectFocusButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                activateFocusMode
            );

        }
    );

}


/* =========================================================
   ANÁLISE DA SEXTA-FEIRA
   ========================================================= */

function generateProjectsAnalysis() {

    const pendingTasks =
        PROJECTS_STATE.tasks.filter(
            task =>
                !task.completed
        );


    const priorityTasks =
        pendingTasks.filter(
            task =>
                task.priority === "high"
        );


    const averageGoal =
        calculateAverageGoalProgress();


    const analysisElement =
        document.querySelector(
            "[data-project-analysis]"
        );


    if (!analysisElement) {
        return;
    }


    if (priorityTasks.length > 0) {

        analysisElement.textContent =
            `Existe ${priorityTasks.length} tarefa prioritária pendente. `
            +
            `Antes de adicionar novas metas, finalize o que possui maior impacto.`;

    } else if (pendingTasks.length > 0) {

        analysisElement.textContent =
            `Você possui ${pendingTasks.length} tarefas pendentes. `
            +
            `O melhor próximo passo é escolher uma única tarefa e concluí-la.`;

    } else {

        analysisElement.textContent =
            "Nenhuma tarefa pendente. É um bom momento para avançar um objetivo maior.";

    }


    const priorityElement =
        document.querySelector(
            "[data-project-priority]"
        );


    if (priorityElement) {

        priorityElement.textContent =
            `Progresso médio dos objetivos: ${averageGoal}%`;

    }

}


/* =========================================================
   CONTEXTO PARA A SEXTA-FEIRA
   ========================================================= */

function getProjectsContext() {

    return {

        page:
            "projects",

        focusMode:
            PROJECTS_STATE.focusMode,

        projects:
            PROJECTS_STATE.projects.map(
                project => ({

                    name:
                        project.name,

                    category:
                        project.category,

                    status:
                        project.status,

                    progress:
                        project.progress,

                    next:
                        project.next

                })
            ),

        tasks:
            PROJECTS_STATE.tasks.map(
                task => ({

                    title:
                        task.title,

                    category:
                        task.category,

                    priority:
                        task.priority,

                    completed:
                        task.completed

                })
            ),

        goals:
            getGoalsContext(),

        studies:
            getStudyContext(),

        finance: {

            balance:
                PROJECTS_STATE.finance.balance,

            income:
                PROJECTS_STATE.finance.income,

            expenses:
                PROJECTS_STATE.finance.expenses,

            goal:
                PROJECTS_STATE.finance.goal

        }

    };

}


/* =========================================================
   EVENTOS DO SISTEMA
   ========================================================= */

function initializeProjectsEvents() {

    document.addEventListener(
        "orion:ready",
        () => {

            updateProjectSummary();

            generateProjectsAnalysis();

        }
    );

}


/* =========================================================
   API PÚBLICA
   ========================================================= */

window.ORION_PROJECTS = {

    getContext:
        getProjectsContext,

    getProjects:
        () =>
            PROJECTS_STATE.projects,

    getTasks:
        () =>
            PROJECTS_STATE.tasks,

    getGoals:
        () =>
            PROJECTS_STATE.goals,

    getStudies:
        getStudyContext,

    getFinance:
        () =>
            PROJECTS_STATE.finance,

    createProject,

    toggleTask,

    registerFinanceEntry,

    activateFocusMode,

    refresh:
        () => {

            updateProjectSummary();

            generateProjectsAnalysis();

        }

};


/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

function initializeProjects() {

    if (
        PROJECTS_STATE.initialized
    ) {
        return;
    }


    loadProjectsData();

    initializeTasks();

    initializeProjectButtons();

    initializeFinance();

    initializeFocusMode();

    initializeProjectsEvents();

    updateProjectSummary();

    generateProjectsAnalysis();


    PROJECTS_STATE.initialized =
        true;


    document.dispatchEvent(
        new CustomEvent(
            "orion:projects-ready",
            {
                detail:
                    getProjectsContext()
            }
        )
    );

}


if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeProjects
    );

} else {

    initializeProjects();

}