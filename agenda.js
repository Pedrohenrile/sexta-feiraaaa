/* =========================================================
   ORION — AGENDA INTELIGENTE
   Controle temporal e organização do dia
   ========================================================= */


/* =========================================================
   CONFIGURAÇÃO
   ========================================================= */

const AGENDA_CONFIG = {

    locale: "pt-BR",

    refreshInterval: 1000,

    nextEvent: {
        hour: 16,
        minute: 0,
        title: "Academia"
    }

};


/* =========================================================
   ESTADO
   ========================================================= */

const AGENDA_STATE = {

    initialized: false,

    currentDate: null,

    nextEvent: null,

    events: [],

    countdown: null

};


/* =========================================================
   ELEMENTOS
   ========================================================= */

const agendaElements = {

    weekday: null,
    day: null,
    month: null,
    fullDate: null,

    countdown: null,

    nextEventTitle: null

};


/* =========================================================
   INICIALIZAÇÃO DOS ELEMENTOS
   ========================================================= */

function initializeAgendaElements() {

    agendaElements.weekday =
        document.getElementById("agenda-weekday");

    agendaElements.day =
        document.getElementById("agenda-day");

    agendaElements.month =
        document.getElementById("agenda-month");

    agendaElements.fullDate =
        document.getElementById("agenda-full-date");

    agendaElements.countdown =
        document.getElementById("next-event-countdown");

}


/* =========================================================
   DATA ATUAL
   ========================================================= */

function getAgendaDate() {

    return new Date();

}


/* =========================================================
   FORMATAR DIA DA SEMANA
   ========================================================= */

function formatAgendaWeekday(date) {

    return new Intl.DateTimeFormat(
        AGENDA_CONFIG.locale,
        {
            weekday: "long"
        }
    ).format(date);

}


/* =========================================================
   FORMATAR MÊS
   ========================================================= */

function formatAgendaMonth(date) {

    return new Intl.DateTimeFormat(
        AGENDA_CONFIG.locale,
        {
            month: "long"
        }
    ).format(date);

}


/* =========================================================
   FORMATAR DATA COMPLETA
   ========================================================= */

function formatAgendaFullDate(date) {

    return new Intl.DateTimeFormat(
        AGENDA_CONFIG.locale,
        {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    ).format(date);

}


/* =========================================================
   CAPITALIZAR
   ========================================================= */

function capitalizeAgendaText(text) {

    if (!text) {
        return "";
    }

    return text.charAt(0).toUpperCase() + text.slice(1);

}


/* =========================================================
   ATUALIZAR DATA NA INTERFACE
   ========================================================= */

function updateAgendaDate() {

    const date = getAgendaDate();

    AGENDA_STATE.currentDate = date;


    if (agendaElements.weekday) {

        agendaElements.weekday.textContent =
            capitalizeAgendaText(
                formatAgendaWeekday(date)
            );

    }


    if (agendaElements.day) {

        agendaElements.day.textContent =
            String(date.getDate()).padStart(2, "0");

    }


    if (agendaElements.month) {

        agendaElements.month.textContent =
            capitalizeAgendaText(
                formatAgendaMonth(date)
            );

    }


    if (agendaElements.fullDate) {

        agendaElements.fullDate.textContent =
            capitalizeAgendaText(
                formatAgendaFullDate(date)
            );

    }

}


/* =========================================================
   PRÓXIMA ATIVIDADE
   ========================================================= */

function getNextEventDate() {

    const now = new Date();

    const eventDate = new Date();

    eventDate.setHours(
        AGENDA_CONFIG.nextEvent.hour,
        AGENDA_CONFIG.nextEvent.minute,
        0,
        0
    );


    /*
     * Se o horário já passou,
     * considera o próximo dia.
     */

    if (eventDate <= now) {

        eventDate.setDate(
            eventDate.getDate() + 1
        );

    }


    return eventDate;

}


/* =========================================================
   FORMATAR CONTAGEM REGRESSIVA
   ========================================================= */

function formatCountdown(milliseconds) {

    if (milliseconds <= 0) {

        return "00:00";

    }


    const totalSeconds =
        Math.floor(milliseconds / 1000);


    const hours =
        Math.floor(totalSeconds / 3600);


    const minutes =
        Math.floor(
            (totalSeconds % 3600) / 60
        );


    const seconds =
        totalSeconds % 60;


    /*
     * Quando faltar mais de uma hora,
     * mostra HH:MM.
     */

    if (hours > 0) {

        return (
            String(hours).padStart(2, "0") +
            ":" +
            String(minutes).padStart(2, "0")
        );

    }


    return (
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0")
    );

}


/* =========================================================
   ATUALIZAR CONTAGEM
   ========================================================= */

function updateAgendaCountdown() {

    if (!agendaElements.countdown) {
        return;
    }


    const now = new Date();

    const nextEvent =
        getNextEventDate();


    AGENDA_STATE.nextEvent =
        nextEvent;


    const difference =
        nextEvent.getTime() - now.getTime();


    agendaElements.countdown.textContent =
        formatCountdown(difference);


    /*
     * Se chegou ao horário,
     * atualiza novamente.
     */

    if (difference <= 0) {

        AGENDA_STATE.nextEvent =
            getNextEventDate();

    }

}


/* =========================================================
   ESTADO DO EVENTO
   ========================================================= */

function getEventState(eventDate) {

    const now = new Date();

    const difference =
        eventDate.getTime() - now.getTime();


    if (difference <= 0) {

        return "active";

    }


    if (difference <= 30 * 60 * 1000) {

        return "soon";

    }


    return "scheduled";

}


/* =========================================================
   EVENTOS BASE
   ========================================================= */

function initializeAgendaEvents() {

    AGENDA_STATE.events = [

        {
            id: "school",
            title: "Período escolar",
            type: "school",
            start: "06:00",
            end: "12:00",
            status: "completed"
        },

        {
            id: "lunch",
            title: "Almoço + descanso",
            type: "personal",
            start: "12:00",
            end: "13:00",
            status: "scheduled"
        },

        {
            id: "study",
            title: "Bloco de estudos",
            type: "study",
            start: "14:00",
            end: "15:30",
            status: "scheduled"
        },

        {
            id: "gym",
            title: "Treino",
            type: "gym",
            start: "16:00",
            end: "18:00",
            status: "next"
        },

        {
            id: "project",
            title: "Projeto ORION",
            type: "project",
            start: "19:00",
            end: "21:00",
            status: "scheduled"
        }

    ];

}


/* =========================================================
   VERIFICAR EVENTOS
   ========================================================= */

function evaluateAgendaEvents() {

    const now = new Date();


    AGENDA_STATE.events.forEach(event => {

        const [hour, minute] =
            event.start.split(":").map(Number);


        const eventDate = new Date();

        eventDate.setHours(
            hour,
            minute,
            0,
            0
        );


        event.runtimeState =
            getEventState(eventDate);

    });

}


/* =========================================================
   ATUALIZAÇÃO GERAL
   ========================================================= */

function updateAgenda() {

    updateAgendaDate();

    updateAgendaCountdown();

    evaluateAgendaEvents();

}


/* =========================================================
   AÇÃO: IR PARA HOJE
   ========================================================= */

function goToToday() {

    updateAgendaDate();


    if (typeof notifyInfo === "function") {

        notifyInfo(
            "Agenda sincronizada com o dia atual."
        );

    }

}


/* =========================================================
   AÇÃO: NOVO COMPROMISSO
   ========================================================= */

function createAgendaEvent() {

    /*
     * Por enquanto é apenas uma interface.
     *
     * Posteriormente:
     *
     * interface
     *      ↓
     * formulário
     *      ↓
     * backend
     *      ↓
     * banco de dados
     *      ↓
     * agenda
     */

    if (typeof notifyInfo === "function") {

        notifyInfo(
            "O módulo de criação de compromissos será conectado ao banco de dados posteriormente."
        );

    }

}


/* =========================================================
   AÇÃO: ANALISAR DIA
   ========================================================= */

function analyzeAgendaDay() {

    if (typeof navigateTo === "function") {

        navigateTo("assistant");

    }

}


/* =========================================================
   AÇÕES DA AGENDA
   ========================================================= */

function initializeAgendaActions() {


    /*
     * Botão HOJE
     */

    const todayButton =
        document.querySelector(
            '[data-action="today"]'
        );


    if (todayButton) {

        todayButton.addEventListener(
            "click",
            goToToday
        );

    }


    /*
     * Novo compromisso
     */

    const newEventButton =
        document.querySelector(
            '[data-action="new-event"]'
        );


    if (newEventButton) {

        newEventButton.addEventListener(
            "click",
            createAgendaEvent
        );

    }


    /*
     * Analisar meu dia
     */

    const analyzeButton =
        document.querySelector(
            '[data-action="assistant-recommendation"]'
        );


    if (analyzeButton) {

        analyzeButton.addEventListener(
            "click",
            analyzeAgendaDay
        );

    }

}


/* =========================================================
   ATUALIZAÇÃO AUTOMÁTICA
   ========================================================= */

function startAgendaClock() {

    updateAgenda();


    AGENDA_STATE.countdown =
        setInterval(
            updateAgenda,
            AGENDA_CONFIG.refreshInterval
        );

}


/* =========================================================
   PARAR ATUALIZAÇÃO
   ========================================================= */

function stopAgendaClock() {

    if (AGENDA_STATE.countdown) {

        clearInterval(
            AGENDA_STATE.countdown
        );

        AGENDA_STATE.countdown = null;

    }

}


/* =========================================================
   RELÓGIO DA PÁGINA
   ========================================================= */

function updateAssistantContextTime() {

    const element =
        document.getElementById(
            "assistant-context-time"
        );


    if (!element) {
        return;
    }


    const now = new Date();


    element.textContent =
        now.toLocaleTimeString(
            AGENDA_CONFIG.locale,
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

}


/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

function initializeAgenda() {

    if (AGENDA_STATE.initialized) {
        return;
    }


    /*
     * Verifica se estamos realmente
     * na página da agenda.
     */

    if (!document.querySelector(".agenda-page")) {
        return;
    }


    initializeAgendaElements();

    initializeAgendaEvents();

    initializeAgendaActions();

    updateAssistantContextTime();

    startAgendaClock();


    AGENDA_STATE.initialized = true;


    /*
     * Atualiza o contexto do relógio
     * independentemente da agenda.
     */

    setInterval(
        updateAssistantContextTime,
        1000
    );


    console.log(
        "[ORION] Agenda Inteligente inicializada."
    );

}


/* =========================================================
   CICLO DE VIDA
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeAgenda
);


/*
 * Quando o usuário retorna à página,
 * sincroniza novamente.
 */

window.addEventListener(
    "pageshow",
    () => {

        if (AGENDA_STATE.initialized) {

            updateAgenda();

        }

    }
);


/* =========================================================
   API PÚBLICA
   ========================================================= */

window.ORION_AGENDA = {

    getState: () => ({
        ...AGENDA_STATE
    }),

    getEvents: () => [
        ...AGENDA_STATE.events
    ],

    refresh: updateAgenda,

    goToToday,

    createEvent: createAgendaEvent,

    analyzeDay: analyzeAgendaDay

};