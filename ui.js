/* =========================================================
   ORION — UI
   Interface / Interações / Feedback
========================================================= */


/* =========================================================
   01. CONFIGURAÇÃO
========================================================= */

const UI_CONFIG = {
    notificationDuration: 4000,
    transitionDuration: 220
};


/* =========================================================
   02. ESTADO DA INTERFACE
========================================================= */

const UI_STATE = {
    notificationContainer: null,
    initialized: false
};


/* =========================================================
   03. CRIAR CONTAINER DE NOTIFICAÇÕES
========================================================= */

function createNotificationContainer() {

    let container = document.querySelector(
        ".system-notifications"
    );

    if (container) {
        UI_STATE.notificationContainer = container;
        return container;
    }

    container = document.createElement("div");

    container.className = "system-notifications";

    container.setAttribute(
        "aria-live",
        "polite"
    );

    container.setAttribute(
        "aria-atomic",
        "true"
    );

    document.body.appendChild(container);

    UI_STATE.notificationContainer = container;

    return container;
}


/* =========================================================
   04. NOTIFICAÇÃO
========================================================= */

function showNotification(
    message,
    type = "info",
    duration = UI_CONFIG.notificationDuration
) {

    if (!message) {
        return;
    }

    const container =
        UI_STATE.notificationContainer ||
        createNotificationContainer();

    const notification = document.createElement("div");

    notification.className =
        `system-notification notification-${type}`;

    notification.innerHTML = `
        <div class="notification-indicator"></div>

        <div class="notification-content">
            <span class="notification-type">
                ${getNotificationLabel(type)}
            </span>

            <span class="notification-message">
                ${escapeHTML(message)}
            </span>
        </div>

        <button
            class="notification-close"
            type="button"
            aria-label="Fechar notificação"
        >
            ×
        </button>
    `;

    container.appendChild(notification);

    requestAnimationFrame(() => {

        notification.classList.add(
            "notification-visible"
        );

    });

    const closeButton =
        notification.querySelector(
            ".notification-close"
        );

    closeButton.addEventListener(
        "click",
        () => removeNotification(notification)
    );

    const timeout = setTimeout(() => {

        removeNotification(notification);

    }, duration);

    notification.dataset.timeout = timeout;
}


/* =========================================================
   05. LABEL DA NOTIFICAÇÃO
========================================================= */

function getNotificationLabel(type) {

    const labels = {
        success: "Concluído",
        warning: "Atenção",
        danger: "Alerta",
        info: "Sistema"
    };

    return labels[type] || labels.info;
}


/* =========================================================
   06. REMOVER NOTIFICAÇÃO
========================================================= */

function removeNotification(notification) {

    if (!notification) {
        return;
    }

    const timeout = notification.dataset.timeout;

    if (timeout) {
        clearTimeout(Number(timeout));
    }

    notification.classList.remove(
        "notification-visible"
    );

    notification.classList.add(
        "notification-removing"
    );

    setTimeout(() => {

        notification.remove();

    }, UI_CONFIG.transitionDuration);
}


/* =========================================================
   07. ATALHOS DE NOTIFICAÇÃO
========================================================= */

function notifySuccess(message) {
    showNotification(message, "success");
}

function notifyWarning(message) {
    showNotification(message, "warning");
}

function notifyDanger(message) {
    showNotification(message, "danger");
}

function notifyInfo(message) {
    showNotification(message, "info");
}


/* =========================================================
   08. ESCAPAR HTML
========================================================= */

function escapeHTML(value) {

    const element = document.createElement("div");

    element.textContent = value;

    return element.innerHTML;
}


/* =========================================================
   09. BOTÕES DE AÇÃO
========================================================= */

function initializeActionButtons() {

    const buttons = document.querySelectorAll(
        "[data-action]"
    );

    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const action =
                    button.dataset.action;

                handleAction(action, button);

            }
        );

    });
}


/* =========================================================
   10. CENTRAL DE AÇÕES
========================================================= */

function handleAction(action, element = null) {

    if (!action) {
        return;
    }

    switch (action) {

        case "assistant":
            navigateTo("assistant");
            break;


        case "agenda":
            navigateTo("agenda");
            break;


        case "memory":
            navigateTo("memory");
            break;


        case "performance":
            navigateTo("performance");
            break;


        case "projects":
            navigateTo("projects");
            break;


        case "system":
            navigateTo("system");
            break;


        case "test-notification":
            notifyInfo(
                "Sistema de notificações funcionando normalmente."
            );
            break;


        default:

            console.warn(
                `[ORION] Ação desconhecida: ${action}`
            );

    }
}


/* =========================================================
   11. ESTADO DE CARREGAMENTO
========================================================= */

function setLoading(element, loading = true) {

    if (!element) {
        return;
    }

    if (loading) {

        element.dataset.originalText =
            element.textContent;

        element.classList.add(
            "is-loading"
        );

        element.disabled = true;

        element.innerHTML = `
            <span class="button-loader"></span>
            <span>Processando</span>
        `;

    } else {

        const originalText =
            element.dataset.originalText;

        if (originalText) {
            element.textContent = originalText;
        }

        element.classList.remove(
            "is-loading"
        );

        element.disabled = false;
    }
}


/* =========================================================
   12. FEEDBACK VISUAL
========================================================= */

function flashElement(element) {

    if (!element) {
        return;
    }

    element.classList.remove(
        "ui-flash"
    );

    void element.offsetWidth;

    element.classList.add(
        "ui-flash"
    );

    setTimeout(() => {

        element.classList.remove(
            "ui-flash"
        );

    }, 600);
}


/* =========================================================
   13. ATUALIZAR TEXTO
========================================================= */

function updateText(
    selector,
    text
) {

    const element =
        typeof selector === "string"
            ? document.querySelector(selector)
            : selector;

    if (!element) {
        return false;
    }

    element.textContent = text;

    return true;
}


/* =========================================================
   14. ATUALIZAR HTML
========================================================= */

function updateHTML(
    selector,
    html
) {

    const element =
        typeof selector === "string"
            ? document.querySelector(selector)
            : selector;

    if (!element) {
        return false;
    }

    element.innerHTML = html;

    return true;
}


/* =========================================================
   15. MOSTRAR / ESCONDER ELEMENTOS
========================================================= */

function showElement(element) {

    if (!element) {
        return;
    }

    element.hidden = false;

    element.classList.remove(
        "is-hidden"
    );
}


function hideElement(element) {

    if (!element) {
        return;
    }

    element.hidden = true;

    element.classList.add(
        "is-hidden"
    );
}


function toggleElement(element) {

    if (!element) {
        return;
    }

    if (
        element.hidden ||
        element.classList.contains("is-hidden")
    ) {

        showElement(element);

    } else {

        hideElement(element);

    }
}


/* =========================================================
   16. MODAL SIMPLES
========================================================= */

function openModal(modal) {

    if (!modal) {
        return;
    }

    modal.classList.add(
        "modal-open"
    );

    document.body.classList.add(
        "modal-active"
    );

    modal.setAttribute(
        "aria-hidden",
        "false"
    );
}


function closeModal(modal) {

    if (!modal) {
        return;
    }

    modal.classList.remove(
        "modal-open"
    );

    document.body.classList.remove(
        "modal-active"
    );

    modal.setAttribute(
        "aria-hidden",
        "true"
    );
}


/* =========================================================
   17. FECHAR MODAL COM ESC
========================================================= */

function initializeModalKeyboard() {

    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape") {
                return;
            }

            const openModalElement =
                document.querySelector(
                    ".modal-open"
                );

            if (openModalElement) {
                closeModal(openModalElement);
            }

        }
    );
}


/* =========================================================
   18. TOGGLE DE ELEMENTOS
========================================================= */

function initializeToggles() {

    const toggles = document.querySelectorAll(
        "[data-toggle]"
    );

    toggles.forEach(toggle => {

        toggle.addEventListener(
            "click",
            () => {

                const targetSelector =
                    toggle.dataset.toggle;

                const target =
                    document.querySelector(
                        targetSelector
                    );

                if (!target) {
                    return;
                }

                toggleElement(target);

                toggle.classList.toggle(
                    "active"
                );

            }
        );

    });
}


/* =========================================================
   19. LINKS EXTERNOS
========================================================= */

function initializeExternalLinks() {

    const links = document.querySelectorAll(
        'a[target="_blank"]'
    );

    links.forEach(link => {

        link.setAttribute(
            "rel",
            "noopener noreferrer"
        );

    });
}


/* =========================================================
   20. DETECTAR TECLADO
========================================================= */

function initializeKeyboardState() {

    document.addEventListener(
        "keydown",
        () => {

            document.body.classList.add(
                "using-keyboard"
            );

        }
    );

    document.addEventListener(
        "mousedown",
        () => {

            document.body.classList.remove(
                "using-keyboard"
            );

        }
    );

}


/* =========================================================
   21. ESTADO ONLINE
========================================================= */

function initializeConnectionState() {

    function updateConnectionState() {

        const online =
            navigator.onLine;

        document.body.dataset.connection =
            online
                ? "online"
                : "offline";

        const indicators =
            document.querySelectorAll(
                "[data-connection-status]"
            );

        indicators.forEach(indicator => {

            indicator.textContent =
                online
                    ? "CONEXÃO ONLINE"
                    : "SEM CONEXÃO";

        });

    }

    window.addEventListener(
        "online",
        updateConnectionState
    );

    window.addEventListener(
        "offline",
        updateConnectionState
    );

    updateConnectionState();
}


/* =========================================================
   22. INICIALIZAÇÃO
========================================================= */

function initializeUI() {

    if (UI_STATE.initialized) {
        return;
    }

    UI_STATE.initialized = true;

    createNotificationContainer();

    initializeActionButtons();

    initializeModalKeyboard();

    initializeToggles();

    initializeExternalLinks();

    initializeKeyboardState();

    initializeConnectionState();

}


/* =========================================================
   23. INICIAR
========================================================= */

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initializeUI
    );

} else {

    initializeUI();

}