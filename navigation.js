/* =========================================================
   ORION — NAVIGATION
   Sistema Central de Navegação
========================================================= */


/* =========================================================
   01. CONFIGURAÇÃO DAS PÁGINAS
========================================================= */

const ORION_PAGES = {
    dashboard: "index.html",
    assistant: "pages/assistant.html",
    agenda: "pages/agenda.html",
    memory: "pages/memory.html",
    performance: "pages/performance.html",
    projects: "pages/projects.html",
    system: "pages/system.html"
};


/* =========================================================
   02. ELEMENTOS DE NAVEGAÇÃO
========================================================= */

const navigationItems = document.querySelectorAll(
    "[data-page]"
);


/* =========================================================
   03. IDENTIFICAR PÁGINA ATUAL
========================================================= */

function getCurrentPage() {

    const currentPath = window.location.pathname;

    const fileName =
        currentPath.split("/").pop() || "index.html";

    return fileName;
}


/* =========================================================
   04. MAPEAR PÁGINA
========================================================= */

function getPageKey() {

    const currentFile = getCurrentPage();

    const pageMap = {
        "index.html": "dashboard",
        "assistant.html": "assistant",
        "agenda.html": "agenda",
        "memory.html": "memory",
        "performance.html": "performance",
        "projects.html": "projects",
        "system.html": "system"
    };

    return pageMap[currentFile] || "dashboard";
}


/* =========================================================
   05. DESTACAR PÁGINA ATIVA
========================================================= */

function setActiveNavigation() {

    const currentPage = getPageKey();

    navigationItems.forEach(item => {

        const page = item.dataset.page;

        item.classList.toggle(
            "active",
            page === currentPage
        );

    });
}


/* =========================================================
   06. NAVEGAR
========================================================= */

function navigateTo(page) {

    if (!page) {
        return;
    }

    const destination = ORION_PAGES[page];

    if (!destination) {

        console.warn(
            `[ORION] Página não encontrada: ${page}`
        );

        return;
    }

    window.location.href = destination;
}


/* =========================================================
   07. CONFIGURAR CLIQUES
========================================================= */

function initializeNavigation() {

    navigationItems.forEach(item => {

        item.addEventListener("click", event => {

            event.preventDefault();

            const page = item.dataset.page;

            navigateTo(page);

        });

    });

    setActiveNavigation();
}


/* =========================================================
   08. NAVEGAÇÃO POR TECLADO
========================================================= */

function initializeKeyboardNavigation() {

    document.addEventListener("keydown", event => {

        /*
         * ALT + 1 → Central
         * ALT + 2 → Assistente
         * ALT + 3 → Agenda
         * ALT + 4 → Memória
         * ALT + 5 → Desempenho
         * ALT + 6 → Projetos
         * ALT + 7 → Segurança
         */

        if (!event.altKey) {
            return;
        }

        const shortcuts = {
            "1": "dashboard",
            "2": "assistant",
            "3": "agenda",
            "4": "memory",
            "5": "performance",
            "6": "projects",
            "7": "system"
        };

        const page = shortcuts[event.key];

        if (page) {

            event.preventDefault();

            navigateTo(page);

        }

    });
}


/* =========================================================
   09. VOLTAR / AVANÇAR
========================================================= */

function initializeHistoryNavigation() {

    window.addEventListener(
        "pageshow",
        () => {
            setActiveNavigation();
        }
    );

}


/* =========================================================
   10. INICIALIZAÇÃO
========================================================= */

function initializeNavigationSystem() {

    initializeNavigation();

    initializeKeyboardNavigation();

    initializeHistoryNavigation();

}


/* =========================================================
   11. INICIAR SISTEMA
========================================================= */

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initializeNavigationSystem
    );

} else {

    initializeNavigationSystem();

}