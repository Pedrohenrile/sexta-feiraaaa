/* =========================================================
   PERFORMANCE — SEXTA-FEIRA
   ========================================================= */


/* =========================================================
   DADOS PRINCIPAIS
   ========================================================= */

const performanceData = {

    pesoAtual: 63,

    pesoMeta: 70,

    altura: 1.75,

    progresso: 42,

    otimizacao: 78,

    foco: "OMBROS",

    focoValor: 78

};


/* =========================================================
   RELÓGIO
   ========================================================= */

function atualizarRelogio() {

    const clock = document.getElementById("clock");

    if (!clock) return;

    const agora = new Date();

    const horas = String(agora.getHours()).padStart(2, "0");
    const minutos = String(agora.getMinutes()).padStart(2, "0");
    const segundos = String(agora.getSeconds()).padStart(2, "0");

    clock.textContent =
        `${horas}:${minutos}:${segundos}`;
}

atualizarRelogio();

setInterval(atualizarRelogio, 1000);


/* =========================================================
   ELEMENTOS
   ========================================================= */

const currentWeight =
    document.getElementById("currentWeight");

const targetWeight =
    document.getElementById("targetWeight");

const progress =
    document.getElementById("progress");

const optimization =
    document.getElementById("optimization");

const focusMuscle =
    document.getElementById("focusMuscle");

const focusValue =
    document.getElementById("focusValue");

const focusBar =
    document.getElementById("focusBar");

const focusDescription =
    document.getElementById("focusDescription");

const aiMessage =
    document.getElementById("aiMessage");


/* =========================================================
   CARREGAR DADOS
   ========================================================= */

function carregarDados() {

    if (currentWeight) {
        currentWeight.textContent =
            performanceData.pesoAtual;
    }

    if (targetWeight) {
        targetWeight.textContent =
            performanceData.pesoMeta;
    }

    if (progress) {
        progress.textContent =
            performanceData.progresso;
    }

    if (optimization) {
        optimization.textContent =
            `${performanceData.otimizacao}%`;
    }

    if (focusMuscle) {
        focusMuscle.textContent =
            performanceData.foco;
    }

    if (focusValue) {
        focusValue.textContent =
            `${performanceData.focoValor}%`;
    }

    if (focusBar) {
        focusBar.style.width =
            `${performanceData.focoValor}%`;
    }

}

carregarDados();


/* =========================================================
   PONTOS DO CORPO
   ========================================================= */

const bodyPoints =
    document.querySelectorAll(".body-point");


bodyPoints.forEach(point => {

    point.addEventListener("click", () => {

        bodyPoints.forEach(item => {

            item.classList.remove("selected");

        });

        point.classList.add("selected");


        const muscle =
            point.dataset.muscle;


        if (!muscle) return;


        const muscleData = {

            ombros: {
                nome: "OMBROS",
                valor: 78,
                descricao:
                    "Grupo muscular prioritário atual. Mantenha consistência e acompanhe a evolução."
            },

            peito: {
                nome: "PEITO",
                valor: 76,
                descricao:
                    "Grupo muscular integrado à rotina de membros superiores."
            },

            braços: {
                nome: "BRAÇOS",
                valor: 72,
                descricao:
                    "Desenvolvimento acompanhado através dos estímulos de bíceps e tríceps."
            },

            pernas: {
                nome: "PERNAS",
                valor: 70,
                descricao:
                    "Grupo muscular trabalhado duas vezes por semana dentro da programação."
            }

        };


        const data =
            muscleData[muscle];


        if (!data) return;


        focusMuscle.textContent =
            data.nome;

        focusValue.textContent =
            `${data.valor}%`;

        focusBar.style.width =
            `${data.valor}%`;

        focusDescription.textContent =
            data.descricao;


        aiMessage.innerHTML =
            `O sistema está analisando o grupo <strong>${data.nome.toLowerCase()}</strong>. Os dados apresentados representam o acompanhamento interno da sua rotina.`;

    });

});


/* =========================================================
   MAPA DE TREINO
   ========================================================= */

const trainingDays =
    document.querySelectorAll(".training-day");


trainingDays.forEach(day => {

    day.addEventListener("click", () => {

        trainingDays.forEach(item => {

            item.classList.remove("selected");

        });

        day.classList.add("selected");


        const dayName =
            day.querySelector("span")?.textContent || "";

        const training =
            day.querySelector("strong")?.textContent || "";


        if (training.toLowerCase().includes("recuperação")) {

            aiMessage.innerHTML =
                "Hoje o sistema identifica um período de <strong>recuperação</strong>. O foco é permitir que o corpo se prepare para o próximo ciclo.";

            return;

        }


        aiMessage.innerHTML =
            `Treino selecionado: <strong>${training}</strong>. A sessão está registrada como parte da matriz semanal de performance.`;

    });

});


/* =========================================================
   ANIMAÇÃO INICIAL
   ========================================================= */

window.addEventListener("load", () => {

    document.body.classList.add("system-ready");

});