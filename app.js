/* =========================================================
   ORION — APP
   Inicialização Central do Sistema
========================================================= */


/* =========================================================
   01. CONFIGURAÇÃO PRINCIPAL
========================================================= */

const ORION_APP = {

    name: "ORION",

    assistant: "SEXTA-FEIRA",

    version: "1.0.0",

    environment: "local",

    initialized: false,

    startTime: null

};


/* =========================================================
   02. ESTADO GLOBAL
========================================================= */

const ORION_STATE = {

    system: "online",

    connection: "online",

    page: null,

    modules: {

        clock: false,

        navigation: false,

        ui: false,

        assistant: false

    }

};


/* =========================================================
   03. REGISTRAR LOG DO SISTEMA
========================================================= */

function systemLog(
    message,
    type = "info"
) {

    const prefix =
        `[${ORION_APP.name}]`;

    switch (type) {

        case "success":

            console.log(
                `%c${prefix} ${message}`,
                "color: #9fe6c0;"
            );

            break;


        case "warning":

            console.warn(
                `${prefix} ${message}`
            );

            break;


        case "error":

            console.error(
                `${prefix} ${message}`
            );

            break;


        default:

            console.log(
                `${prefix} ${message}`
            );

    }

}


/* =========================================================
   04. IDENTIFICAR PÁGINA
========================================================= */

function getApplicationPage() {

    const file =
        window.location.pathname
            .split("/")
            .pop();

    return file || "index.html";

}


/* =========================================================
   05. ATUALIZAR ESTADO DA PÁGINA
========================================================= */

function updateApplicationPage() {

    ORION_STATE.page =
        getApplicationPage();

}


/* =========================================================
   06. VERIFICAR CONEXÃO
========================================================= */

function updateApplicationConnection() {

    ORION_STATE.connection =
        navigator.onLine
            ? "online"
            : "offline";

    document.body.dataset.connection =
        ORION_STATE.connection;

}


/* =========================================================
   07. VERIFICAR MÓDULOS
========================================================= */

function detectModules() {

    ORION_STATE.modules.clock =
        typeof updateClock === "function";


    ORION_STATE.modules.navigation =
        typeof navigateTo === "function";


    ORION_STATE.modules.ui =
        typeof showNotification === "function";


    ORION_STATE.modules.assistant =
        typeof processAssistantMessage === "function";

}


/* =========================================================
   08. RELATÓRIO DO SISTEMA
========================================================= */

function getSystemReport() {

    return {

        name:
            ORION_APP.name,

        assistant:
            ORION_APP.assistant,

        version:
            ORION_APP.version,

        environment:
            ORION_APP.environment,

        page:
            ORION_STATE.page,

        system:
            ORION_STATE.system,

        connection:
            ORION_STATE.connection,

        modules:
            {
                ...ORION_STATE.modules
            },

        uptime:
            ORION_APP.startTime
                ? Date.now() -
                  ORION_APP.startTime
                : 0

    };

}


/* =========================================================
   09. DISPONIBILIDADE DOS MÓDULOS
========================================================= */

function validateModules() {

    const modules =
        ORION_STATE.modules;

    Object.entries(modules)
        .forEach(
            ([name, active]) => {

                if (active) {

                    systemLog(
                        `Módulo ${name} carregado.`,
                        "success"
                    );

                } else {

                    systemLog(
                        `Módulo ${name} não encontrado.`,
                        "warning"
                    );

                }

            }
        );

}


/* =========================================================
   10. ATUALIZAR INDICADORES DA INTERFACE
========================================================= */

function updateSystemIndicators() {

    const statusElements =
        document.querySelectorAll(
            "[data-system-status]"
        );

    statusElements.forEach(
        element => {

            element.textContent =
                ORION_STATE.system === "online"
                    ? "SISTEMA ONLINE"
                    : "SISTEMA OFFLINE";

        }
    );


    const versionElements =
        document.querySelectorAll(
            "[data-system-version]"
        );

    versionElements.forEach(
        element => {

            element.textContent =
                `ORION ${ORION_APP.version}`;

        }
    );


    const assistantElements =
        document.querySelectorAll(
            "[data-assistant-name]"
        );

    assistantElements.forEach(
        element => {

            element.textContent =
                ORION_APP.assistant;

        }
    );

}


/* =========================================================
   11. EVENTO DE CONEXÃO
========================================================= */

function initializeConnectionMonitor() {

    window.addEventListener(
        "online",
        () => {

            ORION_STATE.connection =
                "online";

            updateSystemIndicators();

            if (
                typeof notifySuccess === "function"
            ) {

                notifySuccess(
                    "Conexão restaurada."
                );

            }

            systemLog(
                "Conexão restaurada.",
                "success"
            );

        }
    );


    window.addEventListener(
        "offline",
        () => {

            ORION_STATE.connection =
                "offline";

            updateSystemIndicators();

            if (
                typeof notifyWarning === "function"
            ) {

                notifyWarning(
                    "O sistema está sem conexão."
                );

            }

            systemLog(
                "Conexão perdida.",
                "warning"
            );

        }
    );

}


/* =========================================================
   12. EXPOR ESTADO PARA OUTROS MÓDULOS
========================================================= */

function getORIONState() {

    return {

        app: {
            ...ORION_APP
        },

        state: {
            ...ORION_STATE,

            modules: {
                ...ORION_STATE.modules
            }

        }

    };

}


/* =========================================================
   13. MARCAR SISTEMA COMO PRONTO
========================================================= */

function setSystemReady() {

    ORION_APP.initialized =
        true;

    ORION_STATE.system =
        "online";

    document.documentElement.dataset.system =
        "ready";

    document.body.classList.add(
        "system-ready"
    );

}


/* =========================================================
   14. EVENTO DE SISTEMA PRONTO
========================================================= */

function dispatchSystemReadyEvent() {

    const event =
        new CustomEvent(
            "orion:ready",
            {
                detail:
                    getSystemReport()
            }
        );

    window.dispatchEvent(event);

}


/* =========================================================
   15. INICIALIZAÇÃO PRINCIPAL
========================================================= */

function initializeORION() {

    if (
        ORION_APP.initialized
    ) {
        return;
    }

    ORION_APP.startTime =
        Date.now();


    systemLog(
        "Inicializando sistema..."
    );


    /* -----------------------------------------
       Estado inicial
    ----------------------------------------- */

    updateApplicationPage();

    updateApplicationConnection();


    /* -----------------------------------------
       Detectar módulos
    ----------------------------------------- */

    detectModules();


    /* -----------------------------------------
       Indicadores
    ----------------------------------------- */

    updateSystemIndicators();


    /* -----------------------------------------
       Monitoramento
    ----------------------------------------- */

    initializeConnectionMonitor();


    /* -----------------------------------------
       Validação
    ----------------------------------------- */

    validateModules();


    /* -----------------------------------------
       Sistema pronto
    ----------------------------------------- */

    setSystemReady();

    dispatchSystemReadyEvent();


    systemLog(
        `${ORION_APP.name} ${ORION_APP.version} operacional.`,
        "success"
    );

}


/* =========================================================
   16. EVENTO GLOBAL
========================================================= */

window.addEventListener(
    "orion:ready",
    event => {

        const report =
            event.detail;

        console.log(
            "[ORION] Relatório inicial:",
            report
        );

    }
);


/* =========================================================
   17. INICIALIZAR
========================================================= */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeORION
    );

} else {

    initializeORION();

}