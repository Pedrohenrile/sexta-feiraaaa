/* =========================================================
   ORION — CLOCK
   Relógio e Data do Sistema
========================================================= */


/* =========================================================
   01. CONFIGURAÇÃO
========================================================= */

const CLOCK_CONFIG = {
    locale: "pt-BR",

    timeOptions: {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    },

    dateOptions: {
        day: "2-digit",
        month: "long",
        year: "numeric"
    },

    dayOptions: {
        weekday: "long"
    }
};


/* =========================================================
   02. ELEMENTOS
========================================================= */

const clockElements = {
    time: document.getElementById("current-time"),
    day: document.getElementById("current-day"),
    date: document.getElementById("current-date")
};


/* =========================================================
   03. DATA ATUAL
========================================================= */

function getCurrentDate() {
    return new Date();
}


/* =========================================================
   04. FORMATAR HORA
========================================================= */

function formatTime(date) {
    return new Intl.DateTimeFormat(
        CLOCK_CONFIG.locale,
        CLOCK_CONFIG.timeOptions
    ).format(date);
}


/* =========================================================
   05. FORMATAR DIA
========================================================= */

function formatDay(date) {

    const day = new Intl.DateTimeFormat(
        CLOCK_CONFIG.locale,
        CLOCK_CONFIG.dayOptions
    ).format(date);

    return capitalizeFirstLetter(day);
}


/* =========================================================
   06. FORMATAR DATA
========================================================= */

function formatDate(date) {

    const formattedDate = new Intl.DateTimeFormat(
        CLOCK_CONFIG.locale,
        CLOCK_CONFIG.dateOptions
    ).format(date);

    return capitalizeFirstLetter(formattedDate);
}


/* =========================================================
   07. CAPITALIZAR PRIMEIRA LETRA
========================================================= */

function capitalizeFirstLetter(text) {

    if (!text) {
        return "";
    }

    return text.charAt(0).toUpperCase() + text.slice(1);
}


/* =========================================================
   08. ATUALIZAR RELÓGIO
========================================================= */

function updateClock() {

    const now = getCurrentDate();

    /* -----------------------------------------
       Hora
    ----------------------------------------- */

    if (clockElements.time) {
        clockElements.time.textContent = formatTime(now);
    }


    /* -----------------------------------------
       Dia
    ----------------------------------------- */

    if (clockElements.day) {
        clockElements.day.textContent = formatDay(now);
    }


    /* -----------------------------------------
       Data
    ----------------------------------------- */

    if (clockElements.date) {
        clockElements.date.textContent = formatDate(now);
    }
}


/* =========================================================
   09. INICIALIZAÇÃO
========================================================= */

function initializeClock() {

    updateClock();

    /*
     * Atualiza a cada segundo.
     *
     * Isso mantém a interface sincronizada
     * com o horário real do computador.
     */

    setInterval(updateClock, 1000);
}


/* =========================================================
   10. INICIAR
========================================================= */

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initializeClock
    );

} else {

    initializeClock();

}