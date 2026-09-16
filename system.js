/* =========================================================
   ORION — SYSTEM CORE ENGINE
   Segurança / Diagnóstico / Permissões / Atividade
   ========================================================= */


/* =========================================================
   CONFIGURAÇÃO
   ========================================================= */

const SYSTEM_CONFIG = {

    name: "ORION",

    assistant: "SEXTA-FEIRA",

    version: "1.0.0",

    locale: "pt-BR",

    storageKey: "orion_system_core",

    logLimit: 50

};


/* =========================================================
   ESTADO
   ========================================================= */

const SYSTEM_STATE = {

    initialized: false,

    lastCheck: null,

    diagnosticsRunning: false,

    connection: navigator.onLine,

    permissions: {},

    device: {

        browser: "Desconhecido",

        platform: "Desconhecida",

        language: navigator.language || "pt-BR"

    },

    diagnostics: {

        cpu: "NORMAL",

        memory: "NORMAL",

        storage: "NORMAL",

        network: "ONLINE"

    },

    logs: []

};


/* =========================================================
   ELEMENTOS
   ========================================================= */

const systemElements = {

    lastCheck:
        document.querySelector(
            "[data-security-last-check]"
        ),

    cpu:
        document.querySelector(
            "[data-system-cpu]"
        ),

    memory:
        document.querySelector(
            "[data-system-memory]"
        ),

    network:
        document.querySelector(
            "[data-system-network]"
        ),

    networkStatus:
        document.querySelector(
            "[data-network-status]"
        ),

    browser:
        document.querySelector(
            "[data-browser-name]"
        ),

    platform:
        document.querySelector(
            "[data-browser-platform]"
        ),

    log:
        document.querySelector(
            "[data-system-log]"
        ),

    diagnosticsButton:
        document.querySelector(
            "[data-action='system-diagnostics']"
        ),

    fullCheckButton:
        document.querySelector(
            "[data-action='system-full-check']"
        ),

    clearLogButton:
        document.querySelector(
            "[data-action='system-clear-log']"
        ),

    permissionButtons:
        document.querySelectorAll(
            "[data-permission]"
        )

};


/* =========================================================
   STORAGE
   ========================================================= */

function loadSystemData() {

    try {

        const saved =
            localStorage.getItem(
                SYSTEM_CONFIG.storageKey
            );


        if (!saved) {

            SYSTEM_STATE.logs = [];

            return;

        }


        const data =
            JSON.parse(saved);


        if (Array.isArray(data.logs)) {

            SYSTEM_STATE.logs =
                data.logs.slice(
                    0,
                    SYSTEM_CONFIG.logLimit
                );

        }


        if (data.lastCheck) {

            SYSTEM_STATE.lastCheck =
                data.lastCheck;

        }


    } catch (error) {

        console.warn(
            "Falha ao carregar System Core.",
            error
        );

    }

}


/* =========================================================
   SALVAR
   ========================================================= */

function saveSystemData() {

    try {

        const data = {

            lastCheck:
                SYSTEM_STATE.lastCheck,

            logs:
                SYSTEM_STATE.logs.slice(
                    0,
                    SYSTEM_CONFIG.logLimit
                )

        };


        localStorage.setItem(
            SYSTEM_CONFIG.storageKey,
            JSON.stringify(data)
        );


    } catch (error) {

        console.warn(
            "Falha ao salvar System Core.",
            error
        );

    }

}


/* =========================================================
   HORÁRIO
   ========================================================= */

function getCurrentTime() {

    return new Intl.DateTimeFormat(
        SYSTEM_CONFIG.locale,
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    ).format(
        new Date()
    );

}


/* =========================================================
   REGISTRO DE ATIVIDADE
   ========================================================= */

function addSystemLog(
    title,
    description,
    type = "online"
) {

    const log = {

        id:
            Date.now(),

        time:
            getCurrentTime(),

        title,

        description,

        type

    };


    SYSTEM_STATE.logs.unshift(
        log
    );


    SYSTEM_STATE.logs =
        SYSTEM_STATE.logs.slice(
            0,
            SYSTEM_CONFIG.logLimit
        );


    saveSystemData();

    renderSystemLogs();

}


/* =========================================================
   RENDERIZAR LOG
   ========================================================= */

function renderSystemLogs() {

    if (!systemElements.log) {
        return;
    }


    if (!SYSTEM_STATE.logs.length) {

        systemElements.log.innerHTML = `

            <div class="empty-state">

                <strong>
                    Nenhuma atividade registrada
                </strong>

                <span>
                    O núcleo ainda não possui eventos armazenados.
                </span>

            </div>

        `;

        return;

    }


    systemElements.log.innerHTML =
        SYSTEM_STATE.logs
            .map(
                log => `

                    <div class="system-log-item">

                        <span class="log-time">
                            ${escapeSystemHTML(log.time)}
                        </span>

                        <div
                            class="log-indicator ${escapeSystemHTML(log.type)}"
                        ></div>

                        <div class="log-information">

                            <strong>
                                ${escapeSystemHTML(log.title)}
                            </strong>

                            <span>
                                ${escapeSystemHTML(log.description)}
                            </span>

                        </div>

                    </div>

                `
            )
            .join("");

}


/* =========================================================
   SEGURANÇA CONTRA HTML INJETADO
   ========================================================= */

function escapeSystemHTML(value) {

    return String(value)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll(
            "'",
            "&#039;"
        );

}


/* =========================================================
   DETECTAR NAVEGADOR
   ========================================================= */

function detectBrowser() {

    const userAgent =
        navigator.userAgent;


    let browser =
        "Navegador desconhecido";


    if (
        userAgent.includes("Edg/")
    ) {

        browser =
            "Microsoft Edge";

    }

    else if (
        userAgent.includes("Chrome/")
    ) {

        browser =
            "Google Chrome";

    }

    else if (
        userAgent.includes("Firefox/")
    ) {

        browser =
            "Mozilla Firefox";

    }

    else if (
        userAgent.includes("Safari/")
        &&
        !userAgent.includes("Chrome/")
    ) {

        browser =
            "Safari";

    }


    SYSTEM_STATE.device.browser =
        browser;


    SYSTEM_STATE.device.platform =
        navigator.platform ||
        "Plataforma desconhecida";


    if (systemElements.browser) {

        systemElements.browser.textContent =
            browser;

    }


    if (systemElements.platform) {

        systemElements.platform.textContent =
            `${SYSTEM_STATE.device.platform} • ${SYSTEM_STATE.device.language}`;

    }


}


/* =========================================================
   CONEXÃO
   ========================================================= */

function updateConnectionState(
    isOnline
) {

    SYSTEM_STATE.connection =
        isOnline;


    SYSTEM_STATE.diagnostics.network =
        isOnline
            ? "ONLINE"
            : "OFFLINE";


    if (systemElements.network) {

        systemElements.network.textContent =
            isOnline
                ? "ESTÁVEL"
                : "OFFLINE";

    }


    if (systemElements.networkStatus) {

        systemElements.networkStatus.textContent =
            isOnline
                ? "ONLINE"
                : "OFFLINE";


        systemElements.networkStatus.classList.toggle(
            "status-online",
            isOnline
        );


        systemElements.networkStatus.classList.toggle(
            "status-danger",
            !isOnline
        );

    }


    addSystemLog(

        isOnline
            ? "Conexão restaurada"
            : "Conexão perdida",

        isOnline
            ? "O sistema voltou a detectar conectividade."
            : "O navegador informou ausência de conexão.",

        isOnline
            ? "online"
            : "danger"

    );

}


/* =========================================================
   STORAGE DO NAVEGADOR
   ========================================================= */

async function checkStorage() {

    if (
        !navigator.storage ||
        !navigator.storage.estimate
    ) {

        SYSTEM_STATE.diagnostics.storage =
            "INDISPONÍVEL";

        return;

    }


    try {

        const estimate =
            await navigator.storage.estimate();


        const usage =
            estimate.usage || 0;


        const quota =
            estimate.quota || 0;


        if (!quota) {

            SYSTEM_STATE.diagnostics.storage =
                "NORMAL";

            return;

        }


        const percentage =
            (usage / quota) * 100;


        if (percentage >= 90) {

            SYSTEM_STATE.diagnostics.storage =
                "ATENÇÃO";

        }

        else {

            SYSTEM_STATE.diagnostics.storage =
                "NORMAL";

        }


    } catch (error) {

        SYSTEM_STATE.diagnostics.storage =
            "NORMAL";

    }

}


/* =========================================================
   MEMÓRIA DO NAVEGADOR
   ========================================================= */

function checkMemory() {

    if (
        performance &&
        performance.memory
    ) {

        const memory =
            performance.memory;


        const used =
            memory.usedJSHeapSize;


        const limit =
            memory.jsHeapSizeLimit;


        if (limit > 0) {

            const percentage =
                (used / limit) * 100;


            SYSTEM_STATE.diagnostics.memory =
                percentage > 90
                    ? "ATENÇÃO"
                    : "NORMAL";

            return;

        }

    }


    SYSTEM_STATE.diagnostics.memory =
        "NORMAL";

}


/* =========================================================
   CPU — ESTIMATIVA
   ========================================================= */

function checkCPU() {

    const cores =
        navigator.hardwareConcurrency;


    if (!cores) {

        SYSTEM_STATE.diagnostics.cpu =
            "MONITORADO";

        return;

    }


    SYSTEM_STATE.diagnostics.cpu =
        cores >= 4
            ? "NORMAL"
            : "LIMITADO";

}


/* =========================================================
   ATUALIZAR DIAGNÓSTICOS
   ========================================================= */

function updateDiagnosticInterface() {

    if (systemElements.cpu) {

        systemElements.cpu.textContent =
            SYSTEM_STATE.diagnostics.cpu;

    }


    if (systemElements.memory) {

        systemElements.memory.textContent =
            SYSTEM_STATE.diagnostics.memory;

    }


    if (systemElements.network) {

        systemElements.network.textContent =
            SYSTEM_STATE.diagnostics.network ===
            "ONLINE"
                ? "ESTÁVEL"
                : "OFFLINE";

    }

}


/* =========================================================
   DIAGNÓSTICO COMPLETO
   ========================================================= */

async function runDiagnostics(
    full = false
) {

    if (
        SYSTEM_STATE.diagnosticsRunning
    ) {

        return;

    }


    SYSTEM_STATE.diagnosticsRunning =
        true;


    setDiagnosticButtonState(
        true
    );


    if (typeof notifyInfo === "function") {

        notifyInfo(
            full
                ? "Verificação completa iniciada..."
                : "Diagnóstico do sistema iniciado...",
            3000
        );

    }


    await delay(
        full
            ? 900
            : 500
    );


    checkCPU();

    checkMemory();

    await checkStorage();


    SYSTEM_STATE.diagnostics.network =
        navigator.onLine
            ? "ONLINE"
            : "OFFLINE";


    updateDiagnosticInterface();


    SYSTEM_STATE.lastCheck =
        new Date().toISOString();


    updateLastCheck();


    addSystemLog(

        full
            ? "Verificação completa concluída"
            : "Diagnóstico concluído",

        "Nenhuma anomalia crítica foi identificada no ambiente local.",

        "online"

    );


    SYSTEM_STATE.diagnosticsRunning =
        false;


    setDiagnosticButtonState(
        false
    );


    if (typeof notifySuccess === "function") {

        notifySuccess(
            "Diagnóstico concluído. Sistema operacional.",
            3500
        );

    }

}


/* =========================================================
   ESTADO DOS BOTÕES
   ========================================================= */

function setDiagnosticButtonState(
    running
) {

    const buttons = [

        systemElements.diagnosticsButton,

        systemElements.fullCheckButton

    ];


    buttons.forEach(
        button => {

            if (!button) {
                return;
            }


            button.disabled =
                running;


            if (running) {

                button.dataset.originalText =
                    button.textContent;

                button.textContent =
                    "ANALISANDO...";

            }

            else {

                button.textContent =
                    button.dataset.originalText ||
                    button.textContent;

            }

        }
    );

}


/* =========================================================
   ÚTIL
   ========================================================= */

function delay(
    milliseconds
) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                milliseconds
            )
    );

}


/* =========================================================
   ÚLTIMA VERIFICAÇÃO
   ========================================================= */

function updateLastCheck() {

    if (!systemElements.lastCheck) {
        return;
    }


    if (!SYSTEM_STATE.lastCheck) {

        systemElements.lastCheck.textContent =
            "AGORA";

        return;

    }


    const date =
        new Date(
            SYSTEM_STATE.lastCheck
        );


    systemElements.lastCheck.textContent =
        new Intl.DateTimeFormat(
            SYSTEM_CONFIG.locale,
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        ).format(date);

}


/* =========================================================
   PERMISSÕES
   ========================================================= */

async function checkPermission(
    permissionName,
    button
) {

    if (!button) {
        return;
    }


    button.disabled = true;

    button.textContent =
        "VERIFICANDO...";


    let state =
        "indisponível";


    try {

        if (
            navigator.permissions &&
            navigator.permissions.query
        ) {

            const result =
                await navigator.permissions.query({
                    name:
                        permissionName
                });


            state =
                result.state;


            SYSTEM_STATE.permissions[
                permissionName
            ] =
                state;

        }


    } catch (error) {

        state =
            "não disponível";

    }


    updatePermissionButton(
        button,
        state
    );


    addSystemLog(

        `Permissão verificada: ${permissionName}`,

        `Estado atual: ${state}.`,

        "info"

    );

}


function updatePermissionButton(
    button,
    state
) {

    const labels = {

        granted:
            "AUTORIZADO",

        denied:
            "BLOQUEADO",

        prompt:
            "SOLICITAR",

        "não disponível":
            "INDISPONÍVEL",

        indisponível:
            "INDISPONÍVEL"

    };


    button.textContent =
        labels[state] ||
        state.toUpperCase();


    button.disabled =
        false;


    button.dataset.permissionState =
        state;


    button.classList.toggle(
        "permission-granted",
        state === "granted"
    );


    button.classList.toggle(
        "permission-denied",
        state === "denied"
    );

}


/* =========================================================
   INICIALIZAR PERMISSÕES
   ========================================================= */

function initializePermissions() {

    systemElements.permissionButtons.forEach(
        button => {

            const permission =
                button.dataset.permission;


            if (!permission) {
                return;
            }


            button.addEventListener(
                "click",
                () => {

                    checkPermission(
                        permission,
                        button
                    );

                }
            );

        }
    );

}


/* =========================================================
   LIMPAR LOG
   ========================================================= */

function clearSystemLog() {

    SYSTEM_STATE.logs = [];

    saveSystemData();

    renderSystemLogs();


    addSystemLog(

        "Registro reiniciado",

        "O histórico local de atividade foi limpo.",

        "info"

    );


    if (typeof notifySuccess === "function") {

        notifySuccess(
            "Registro de atividade limpo."
        );

    }

}


/* =========================================================
   EVENTOS
   ========================================================= */

function initializeSystemEvents() {

    if (
        systemElements.diagnosticsButton
    ) {

        systemElements.diagnosticsButton.addEventListener(
            "click",
            () =>
                runDiagnostics(false)
        );

    }


    if (
        systemElements.fullCheckButton
    ) {

        systemElements.fullCheckButton.addEventListener(
            "click",
            () =>
                runDiagnostics(true)
        );

    }


    if (
        systemElements.clearLogButton
    ) {

        systemElements.clearLogButton.addEventListener(
            "click",
            clearSystemLog
        );

    }


    window.addEventListener(
        "online",
        () =>
            updateConnectionState(true)
    );


    window.addEventListener(
        "offline",
        () =>
            updateConnectionState(false)
    );

}


/* =========================================================
   RELATÓRIO DO SISTEMA
   ========================================================= */

function getSystemReport() {

    return {

        name:
            SYSTEM_CONFIG.name,

        assistant:
            SYSTEM_CONFIG.assistant,

        version:
            SYSTEM_CONFIG.version,

        connection:
            SYSTEM_STATE.connection,

        device:
            {
                ...SYSTEM_STATE.device
            },

        diagnostics:
            {
                ...SYSTEM_STATE.diagnostics
            },

        permissions:
            {
                ...SYSTEM_STATE.permissions
            },

        lastCheck:
            SYSTEM_STATE.lastCheck

    };

}


/* =========================================================
   API PÚBLICA
   ========================================================= */

window.ORION_SYSTEM = {

    getReport:
        getSystemReport,

    runDiagnostics,

    getLogs:
        () =>
            [...SYSTEM_STATE.logs],

    getPermissions:
        () =>
            ({
                ...SYSTEM_STATE.permissions
            }),

    addLog:
        addSystemLog,

    clearLog:
        clearSystemLog,

    getState:
        () =>
            ({
                ...SYSTEM_STATE
            })

};


/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

function initializeSystem() {

    if (
        SYSTEM_STATE.initialized
    ) {

        return;

    }


    loadSystemData();

    detectBrowser();

    initializePermissions();

    initializeSystemEvents();

    renderSystemLogs();

    updateLastCheck();

    updateConnectionState(
        navigator.onLine
    );


    /*
     * Pequeno diagnóstico inicial.
     * Não bloqueia a interface.
     */

    checkCPU();

    checkMemory();

    checkStorage()
        .then(
            () => {

                updateDiagnosticInterface();

            }
        );


    SYSTEM_STATE.initialized =
        true;


    document.dispatchEvent(
        new CustomEvent(
            "orion:system-ready",
            {
                detail:
                    getSystemReport()
            }
        )
    );

}


if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeSystem
    );

} else {

    initializeSystem();

}



document.addEventListener("DOMContentLoaded", () => {

    const integrityCard =
        document.querySelector(".integrity-card");

    if (!integrityCard) return;

    integrityCard.classList.add("security-normal");

});