/* =========================================================
   ORION — SEXTA-FEIRA
   ASSISTENTE PESSOAL
   ========================================================= */


/* =========================================================
   CONFIGURAÇÃO
   ========================================================= */

const ASSISTANT_CONFIG = {

    backend: {
        url: "http://127.0.0.1:8765",
        chatEndpoint: "/chat",
        statusEndpoint: "/status"
    },

    assistant: {
        name: "SEXTA-FEIRA"
    },

    interface: {
        typingDelay: 350,
        maxInputHeight: 160
    },

    storage: {
        historyKey: "sexta-feira-history"
    }

};


/* =========================================================
   ELEMENTOS
   ========================================================= */

const assistantElements = {

    conversation: null,
    input: null,
    sendButton: null,

    clearButton: null,
    clearAllButton: null,
    newChatButton: null,

    history: null,

    systemTime: null,

    topbarStatus: null,
    systemState: null,
    contextIndicator: null,
    footerStatus: null

};


/* =========================================================
   ESTADO
   ========================================================= */

let conversaAtual = [];

let conversaAtualId = null;

let conversasSalvas = [];

let enviandoMensagem = false;


/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    iniciarAssistente
);


function iniciarAssistente() {

    localizarElementos();

    carregarHistorico();

    configurarEventos();

    configurarInput();

    atualizarRelogioAssistente();

    verificarBackend();

    atualizarInterfaceInicial();

}


/* =========================================================
   LOCALIZAR ELEMENTOS
   ========================================================= */

function localizarElementos() {

    assistantElements.conversation =
        document.querySelector(
            "[data-assistant-conversation]"
        );


    assistantElements.input =
        document.querySelector(
            "[data-assistant-input]"
        );


    assistantElements.sendButton =
        document.querySelector(
            "[data-assistant-send]"
        );


    assistantElements.clearButton =
        document.querySelector(
            '[data-action="clear-conversation"]'
        );


    assistantElements.clearAllButton =
        document.querySelector(
            '[data-action="clear-all-history"]'
        );


    assistantElements.newChatButton =
        document.querySelector(
            "[data-new-chat]"
        );


    assistantElements.history =
        document.querySelector(
            "[data-assistant-history]"
        );


    assistantElements.systemTime =
        document.querySelector(
            "#current-time"
        );


    assistantElements.topbarStatus =
        document.querySelector(
            ".topbar-status"
        );


    assistantElements.systemState =
        document.querySelector(
            ".assistant-system-state"
        );


    assistantElements.contextIndicator =
        document.querySelector(
            ".context-indicator"
        );


    assistantElements.footerStatus =
        document.querySelector(
            ".footer-status"
        );

}


/* =========================================================
   EVENTOS
   ========================================================= */

function configurarEventos() {

    /* ---------------------------------------------------------
       ENVIAR
    --------------------------------------------------------- */

    if (assistantElements.sendButton) {

        assistantElements.sendButton.addEventListener(
            "click",
            enviarMensagem
        );

    }


    /* ---------------------------------------------------------
       TECLADO
    --------------------------------------------------------- */

    if (assistantElements.input) {

        assistantElements.input.addEventListener(
            "keydown",
            tratarTeclado
        );

    }


    /* ---------------------------------------------------------
       LIMPAR CONVERSA ATUAL
    --------------------------------------------------------- */

    if (assistantElements.clearButton) {

        assistantElements.clearButton.addEventListener(
            "click",
            limparConversa
        );

    }


    /* ---------------------------------------------------------
       LIMPAR TODO O HISTÓRICO
    --------------------------------------------------------- */

    if (assistantElements.clearAllButton) {

        assistantElements.clearAllButton.addEventListener(
            "click",
            limparTudoComConfirmacao
        );

    }


    /* ---------------------------------------------------------
       NOVA CONVERSA
    --------------------------------------------------------- */

    if (assistantElements.newChatButton) {

        assistantElements.newChatButton.addEventListener(
            "click",
            iniciarNovaConversa
        );

    }

}


/* =========================================================
   CONFIRMAR LIMPEZA TOTAL
   ========================================================= */

function limparTudoComConfirmacao() {

    const confirmar = window.confirm(
        "Deseja apagar todo o histórico de conversas?"
    );

    if (!confirmar) {
        return;
    }

    limparTodoHistorico();

}


/* =========================================================
   TECLADO
   ========================================================= */

function tratarTeclado(event) {

    if (
        event.key === "Enter" &&
        !event.shiftKey
    ) {

        event.preventDefault();

        enviarMensagem();

    }

}


/* =========================================================
   CONFIGURAR INPUT
   ========================================================= */

function configurarInput() {

    const input =
        assistantElements.input;

    if (!input) {
        return;
    }

    input.addEventListener(
        "input",
        ajustarAlturaInput
    );

    ajustarAlturaInput();

}


/* =========================================================
   ALTURA AUTOMÁTICA
   ========================================================= */

function ajustarAlturaInput() {

    const input =
        assistantElements.input;

    if (!input) {
        return;
    }

    input.style.height = "auto";

    const novaAltura =
        Math.min(
            input.scrollHeight,
            ASSISTANT_CONFIG.interface.maxInputHeight
        );

    input.style.height =
        `${novaAltura}px`;

}


/* =========================================================
   ENVIAR MENSAGEM
   ========================================================= */

async function enviarMensagem() {

    const input =
        assistantElements.input;

    if (!input) {
        return;
    }

    if (enviandoMensagem) {
        return;
    }

    const mensagem =
        input.value.trim();

    if (!mensagem) {
        return;
    }

    enviandoMensagem = true;


    /* ---------------------------------------------------------
       MENSAGEM DO USUÁRIO
    --------------------------------------------------------- */

    adicionarMensagem(
        "user",
        mensagem
    );


    /* ---------------------------------------------------------
       LIMPAR INPUT
    --------------------------------------------------------- */

    input.value = "";

    ajustarAlturaInput();


    /* ---------------------------------------------------------
       PROCESSAMENTO
    --------------------------------------------------------- */

    bloquearInterface(true);

    mostrarProcessamento();


    try {

        const resposta =
            await consultarBackend(
                mensagem
            );


        removerProcessamento();


        if (
            resposta &&
            resposta.success &&
            resposta.response
        ) {

            adicionarMensagem(
                "system",
                resposta.response
            );

        } else {

            adicionarMensagem(
                "system",
                "Não consegui obter uma resposta da SEXTA-FEIRA."
            );

        }


    } catch (erro) {

        removerProcessamento();


        console.error(
            "Erro ao comunicar com a SEXTA-FEIRA:",
            erro
        );


        adicionarMensagem(
            "system",
            "Não foi possível estabelecer comunicação com o núcleo da SEXTA-FEIRA."
        );


    } finally {

        bloquearInterface(false);

        enviandoMensagem = false;

        input.focus();

    }

}


/* =========================================================
   CONSULTAR BACKEND
   ========================================================= */

async function consultarBackend(
    mensagem
) {

    const url =
        ASSISTANT_CONFIG.backend.url +
        ASSISTANT_CONFIG.backend.chatEndpoint;


    const resposta =
        await fetch(
            url,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    message: mensagem
                })
            }
        );


    if (!resposta.ok) {

        throw new Error(
            `Backend respondeu com HTTP ${resposta.status}`
        );

    }


    return await resposta.json();

}


/* =========================================================
   VERIFICAR BACKEND
   ========================================================= */

async function verificarBackend() {

    const url =
        ASSISTANT_CONFIG.backend.url +
        ASSISTANT_CONFIG.backend.statusEndpoint;


    try {

        const resposta =
            await fetch(
                url,
                {
                    method: "GET"
                }
            );


        if (!resposta.ok) {

            throw new Error(
                `HTTP ${resposta.status}`
            );

        }


        const dados =
            await resposta.json();


        console.log(
            "SEXTA-FEIRA:",
            dados
        );


        atualizarEstadoConexao(
            Boolean(dados.online)
        );


    } catch (erro) {

        console.warn(
            "SEXTA-FEIRA offline:",
            erro
        );


        atualizarEstadoConexao(false);

    }

}


/* =========================================================
   ESTADO DA CONEXÃO
   ========================================================= */

function atualizarEstadoConexao(
    online
) {

    /* ---------------------------------------------------------
       TOPBAR
    --------------------------------------------------------- */

    const topbar =
        assistantElements.topbarStatus;


    if (topbar) {

        const texto =
            topbar.querySelector(
                "span:last-child"
            );


        if (online) {

            topbar.classList.add(
                "is-online"
            );


            if (texto) {

                texto.textContent =
                    "SISTEMA ONLINE";

            }

        } else {

            topbar.classList.remove(
                "is-online"
            );


            if (texto) {

                texto.textContent =
                    "SISTEMA OFFLINE";

            }

        }

    }


    /* ---------------------------------------------------------
       ESTADO DO ASSISTENTE
    --------------------------------------------------------- */

    const systemState =
        assistantElements.systemState;


    if (systemState) {

        const dot =
            systemState.querySelector(
                ".assistant-state-dot"
            );


        const strong =
            systemState.querySelector(
                "strong"
            );


        if (online) {

            systemState.classList.add(
                "is-online"
            );


            if (dot) {

                dot.classList.add(
                    "is-online"
                );

            }


            if (strong) {

                strong.textContent =
                    "ONLINE";

            }

        } else {

            systemState.classList.remove(
                "is-online"
            );


            if (dot) {

                dot.classList.remove(
                    "is-online"
                );

            }


            if (strong) {

                strong.textContent =
                    "OFFLINE";

            }

        }

    }


    /* ---------------------------------------------------------
       CONTEXTO
    --------------------------------------------------------- */

    const context =
        assistantElements.contextIndicator;


    if (context) {

        context.classList.toggle(
            "is-offline",
            !online
        );

    }


    /* ---------------------------------------------------------
       FOOTER
    --------------------------------------------------------- */

    const footer =
        assistantElements.footerStatus;


    if (footer) {

        footer.textContent =
            online
                ? "● ONLINE"
                : "● OFFLINE";

    }

}


/* =========================================================
   MARKDOWN SEGURO
   ========================================================= */

function formatarMarkdownSeguro(
    texto
) {

    let html =
        String(texto)
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            );


    /* ---------------------------------------------------------
       CÓDIGO INLINE
    --------------------------------------------------------- */

    html =
        html.replace(
            /`([^`]+)`/g,
            "<code>$1</code>"
        );


    /* ---------------------------------------------------------
       NEGRITO
    --------------------------------------------------------- */

    html =
        html.replace(
            /\*\*(.+?)\*\*/g,
            "<strong>$1</strong>"
        );


    /* ---------------------------------------------------------
       ITÁLICO
    --------------------------------------------------------- */

    html =
        html.replace(
            /(^|[^\*])\*([^*\n]+)\*(?!\*)/g,
            "$1<em>$2</em>"
        );


    /* ---------------------------------------------------------
       TÍTULOS
    --------------------------------------------------------- */

    html =
        html.replace(
            /^### (.+)$/gm,
            "<h4>$1</h4>"
        );


    html =
        html.replace(
            /^## (.+)$/gm,
            "<h3>$1</h3>"
        );


    html =
        html.replace(
            /^# (.+)$/gm,
            "<h2>$1</h2>"
        );


    /* ---------------------------------------------------------
       LISTAS
    --------------------------------------------------------- */

    html =
        html.replace(
            /^[*-] (.+)$/gm,
            "<li>$1</li>"
        );


    html =
        html.replace(
            /(<li>.*<\/li>)/gs,
            "<ul>$1</ul>"
        );


    /* ---------------------------------------------------------
       LISTAS NUMERADAS
    --------------------------------------------------------- */

    html =
        html.replace(
            /^\d+\. (.+)$/gm,
            "<li>$1</li>"
        );


    /* ---------------------------------------------------------
       ESCAPES
    --------------------------------------------------------- */

    html =
        html.replace(
            /\\([.!])/g,
            "$1"
        );


    /* ---------------------------------------------------------
       QUEBRAS DE LINHA
    --------------------------------------------------------- */

    html =
        html.replace(
            /\n/g,
            "<br>"
        );


    return html;

}


/* =========================================================
   ADICIONAR MENSAGEM
   ========================================================= */

function adicionarMensagem(
    tipo,
    texto
) {

    const conversation =
        assistantElements.conversation;


    if (!conversation) {
        return;
    }


    const mensagem =
        document.createElement(
            "article"
        );


    mensagem.classList.add(
        "assistant-message"
    );


    if (tipo === "user") {

        mensagem.classList.add(
            "assistant-message-user"
        );

    } else {

        mensagem.classList.add(
            "assistant-message-system"
        );

    }


    /* ---------------------------------------------------------
       AVATAR
    --------------------------------------------------------- */

    const avatar =
        document.createElement(
            "div"
        );


    avatar.className =
        "message-avatar";


    avatar.textContent =
        tipo === "user"
            ? "VC"
            : "SF";


    /* ---------------------------------------------------------
       CONTEÚDO
    --------------------------------------------------------- */

    const content =
        document.createElement(
            "div"
        );


    content.className =
        "message-content";


    /* ---------------------------------------------------------
       CABEÇALHO
    --------------------------------------------------------- */

    const header =
        document.createElement(
            "div"
        );


    header.className =
        "message-header";


    const nome =
        document.createElement(
            "strong"
        );


    nome.textContent =
        tipo === "user"
            ? "VOCÊ"
            : "SEXTA-FEIRA";


    const horario =
        document.createElement(
            "span"
        );


    horario.textContent =
        obterHorarioAtual();


    header.appendChild(
        nome
    );


    header.appendChild(
        horario
    );


    /* ---------------------------------------------------------
       TEXTO
    --------------------------------------------------------- */

    const corpo =
        document.createElement(
            "div"
        );


    corpo.className =
        "message-body";


    corpo.innerHTML =
        formatarMarkdownSeguro(
            texto
        );


    /* ---------------------------------------------------------
       MONTAGEM
    --------------------------------------------------------- */

    content.appendChild(
        header
    );


    content.appendChild(
        corpo
    );


    mensagem.appendChild(
        avatar
    );


    mensagem.appendChild(
        content
    );


    conversation.appendChild(
        mensagem
    );


    /* ---------------------------------------------------------
       ESTADO
    --------------------------------------------------------- */

    conversaAtual.push({

        tipo: tipo,

        texto: texto,

        horario:
            obterHorarioAtual()

    });


    salvarConversaAtual();

    atualizarInterfaceConversacao();

    rolarConversaParaBaixo();

}


/* =========================================================
   PROCESSAMENTO
   ========================================================= */

function mostrarProcessamento() {

    const conversation =
        assistantElements.conversation;


    if (!conversation) {
        return;
    }


    if (
        document.querySelector(
            ".assistant-processing"
        )
    ) {

        return;

    }


    const processamento =
        document.createElement(
            "div"
        );


    processamento.className =
        "assistant-processing";


    processamento.innerHTML = `

        <div class="processing-avatar">
            ◈
        </div>

        <div class="processing-content">

            <strong>
                SEXTA-FEIRA
            </strong>

            <span>
                Analisando contexto...
            </span>

        </div>

    `;


    conversation.appendChild(
        processamento
    );


    rolarConversaParaBaixo();

}


/* =========================================================
   REMOVER PROCESSAMENTO
   ========================================================= */

function removerProcessamento() {

    const processamento =
        document.querySelector(
            ".assistant-processing"
        );


    if (!processamento) {
        return;
    }


    processamento.remove();

}


/* =========================================================
   BLOQUEAR INTERFACE
   ========================================================= */

function bloquearInterface(
    bloqueado
) {

    const input =
        assistantElements.input;


    const button =
        assistantElements.sendButton;


    if (input) {

        input.disabled =
            bloqueado;

    }


    if (button) {

        button.disabled =
            bloqueado;


        button.style.opacity =
            bloqueado
                ? "0.45"
                : "";


        button.style.pointerEvents =
            bloqueado
                ? "none"
                : "";

    }

}


/* =========================================================
   NOVA CONVERSA
   ========================================================= */

function iniciarNovaConversa() {

    const conversation =
        assistantElements.conversation;


    if (!conversation) {
        return;
    }


    /* ---------------------------------------------------------
       SALVA A CONVERSA ANTERIOR
    --------------------------------------------------------- */

    salvarConversaAtual();


    /* ---------------------------------------------------------
       CRIA NOVA CONVERSA
    --------------------------------------------------------- */

    conversaAtual = [];

    conversaAtualId =
        gerarIdConversa();


    /* ---------------------------------------------------------
       LIMPA INTERFACE
    --------------------------------------------------------- */

    conversation.innerHTML =
        "";


    conversation.classList.add(
        "is-empty"
    );


    /* ---------------------------------------------------------
       ATUALIZA HISTÓRICO
    --------------------------------------------------------- */

    atualizarHistorico();

    atualizarInterfaceInicial();


    if (assistantElements.input) {

        assistantElements.input.focus();

    }

}


/* =========================================================
   LIMPAR CONVERSA ATUAL
   ========================================================= */

function limparConversa() {

    const conversation =
        assistantElements.conversation;


    if (!conversation) {
        return;
    }


    /*
       Se existir conteúdo, removemos a conversa
       atual também do histórico.
    */

    if (conversaAtualId) {

        conversasSalvas =
            conversasSalvas.filter(
                conversa =>
                    conversa.id !== conversaAtualId
            );

    }


    conversaAtual = [];

    conversaAtualId =
        gerarIdConversa();


    conversation.innerHTML =
        "";


    conversation.classList.add(
        "is-empty"
    );


    salvarHistorico();

    atualizarHistorico();

    atualizarInterfaceInicial();


    if (assistantElements.input) {

        assistantElements.input.focus();

    }

}


/* =========================================================
   ROLAR CONVERSA
   ========================================================= */

function rolarConversaParaBaixo() {

    const conversation =
        assistantElements.conversation;


    if (!conversation) {
        return;
    }


    requestAnimationFrame(
        () => {

            conversation.scrollTop =
                conversation.scrollHeight;

        }
    );

}


/* =========================================================
   RELÓGIO
   ========================================================= */

function obterHorarioAtual() {

    const agora =
        new Date();


    return agora.toLocaleTimeString(
        "pt-BR",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


/* =========================================================
   RELÓGIO DO SISTEMA
   ========================================================= */

function atualizarRelogioAssistente() {

    const elemento =
        assistantElements.systemTime;


    if (!elemento) {
        return;
    }


    function atualizar() {

        const agora =
            new Date();


        elemento.textContent =
            agora.toLocaleTimeString(
                "pt-BR",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                }
            );

    }


    atualizar();


    setInterval(
        atualizar,
        1000
    );

}


/* =========================================================
   HISTÓRICO — CARREGAR
   ========================================================= */

function carregarHistorico() {

    try {

        const dados =
            localStorage.getItem(
                ASSISTANT_CONFIG.storage.historyKey
            );


        if (!dados) {

            conversasSalvas = [];

            conversaAtualId =
                gerarIdConversa();

            atualizarHistorico();

            return;

        }


        const historico =
            JSON.parse(dados);


        if (Array.isArray(historico)) {

            conversasSalvas =
                historico;

        } else {

            conversasSalvas = [];

        }


    } catch (erro) {

        console.warn(
            "Não foi possível carregar o histórico:",
            erro
        );


        conversasSalvas = [];

    }


    conversaAtualId =
        gerarIdConversa();


    atualizarHistorico();

}


/* =========================================================
   HISTÓRICO — SALVAR
   ========================================================= */

function salvarHistorico() {

    try {

        localStorage.setItem(
            ASSISTANT_CONFIG.storage.historyKey,
            JSON.stringify(
                conversasSalvas
            )
        );


    } catch (erro) {

        console.warn(
            "Não foi possível salvar o histórico:",
            erro
        );

    }

}


/* =========================================================
   SALVAR CONVERSA ATUAL
   ========================================================= */

function salvarConversaAtual() {

    if (
        !conversaAtual ||
        conversaAtual.length === 0
    ) {

        return;

    }


    const primeiraMensagem =
        conversaAtual.find(
            item =>
                item.tipo === "user"
        );


    if (!primeiraMensagem) {
        return;
    }


    const titulo =
        gerarTituloConversa(
            primeiraMensagem.texto
        );


    const agora =
        Date.now();


    const existente =
        conversasSalvas.find(
            conversa =>
                conversa.id === conversaAtualId
        );


    if (existente) {

        existente.titulo =
            titulo;


        existente.mensagens =
            [...conversaAtual];


        existente.atualizadaEm =
            agora;


    } else {

        conversasSalvas.unshift({

            id:
                conversaAtualId,

            titulo:
                titulo,

            mensagens:
                [...conversaAtual],

            criadaEm:
                agora,

            atualizadaEm:
                agora

        });

    }


    /*
       Mantém no máximo 50 conversas.
    */

    conversasSalvas =
        conversasSalvas.slice(
            0,
            50
        );


    salvarHistorico();

    atualizarHistorico();

}


/* =========================================================
   GERAR TÍTULO
   ========================================================= */

function gerarTituloConversa(
    texto
) {

    const titulo =
        String(texto)
            .replace(
                /\s+/g,
                " "
            )
            .trim();


    if (titulo.length <= 42) {

        return titulo;

    }


    return (
        titulo
            .substring(
                0,
                42
            )
            .trim() +
        "..."
    );

}


/* =========================================================
   GERAR ID
   ========================================================= */

function gerarIdConversa() {

    return (

        Date.now().toString(36) +

        Math.random()
            .toString(36)
            .substring(2, 8)

    );

}


/* =========================================================
   ATUALIZAR HISTÓRICO
   ========================================================= */

function atualizarHistorico() {

    const history =
        assistantElements.history;


    if (!history) {
        return;
    }


    history.innerHTML =
        "";


    if (
        !conversasSalvas ||
        conversasSalvas.length === 0
    ) {

        const vazio =
            document.createElement(
                "div"
            );


        vazio.className =
            "assistant-history-empty";


        vazio.innerHTML = `

            <span>
                ◌
            </span>

            <p>
                Nenhuma conversa arquivada.
            </p>

        `;


        history.appendChild(
            vazio
        );


        return;

    }


    conversasSalvas.forEach(
        conversa => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "assistant-history-item";


            if (
                conversa.id ===
                conversaAtualId
            ) {

                item.classList.add(
                    "active"
                );

            }


            /* -------------------------------------------------
               TÍTULO
            ------------------------------------------------- */

            const titulo =
                document.createElement(
                    "span"
                );


            titulo.className =
                "assistant-history-item-title";


            titulo.textContent =
                conversa.titulo ||
                "Conversa sem título";


            /* -------------------------------------------------
               DATA
            ------------------------------------------------- */

            const data =
                document.createElement(
                    "span"
                );


            data.className =
                "assistant-history-item-date";


            data.textContent =
                formatarDataHistorico(
                    conversa.atualizadaEm
                );


            /* -------------------------------------------------
               EXCLUIR
            ------------------------------------------------- */

            const excluir =
                document.createElement(
                    "button"
                );


            excluir.type =
                "button";


            excluir.className =
                "assistant-history-delete";


            excluir.textContent =
                "×";


            excluir.title =
                "Excluir conversa";


            excluir.addEventListener(
                "click",
                event => {

                    event.stopPropagation();


                    excluirConversa(
                        conversa.id
                    );

                }
            );


            /* -------------------------------------------------
               MONTAGEM
            ------------------------------------------------- */

            item.appendChild(
                titulo
            );


            item.appendChild(
                data
            );


            item.appendChild(
                excluir
            );


            /* -------------------------------------------------
               ABRIR CONVERSA
            ------------------------------------------------- */

            item.addEventListener(
                "click",
                () => {

                    carregarConversa(
                        conversa.id
                    );

                }
            );


            history.appendChild(
                item
            );

        }
    );

}


/* =========================================================
   EXCLUIR UMA CONVERSA
   ========================================================= */

function excluirConversa(
    id
) {

    const conversaExiste =
        conversasSalvas.some(
            conversa =>
                conversa.id === id
        );


    if (!conversaExiste) {
        return;
    }


    conversasSalvas =
        conversasSalvas.filter(
            conversa =>
                conversa.id !== id
        );


    /*
       Se o usuário excluiu a conversa
       atualmente aberta, limpamos a interface.
    */

    if (id === conversaAtualId) {

        conversaAtual = [];

        conversaAtualId =
            gerarIdConversa();


        if (assistantElements.conversation) {

            assistantElements.conversation.innerHTML =
                "";

        }

    }


    salvarHistorico();

    atualizarHistorico();

    atualizarInterfaceInicial();

}


/* =========================================================
   LIMPAR TODO O HISTÓRICO
   ========================================================= */

function limparTodoHistorico() {

    conversasSalvas = [];

    conversaAtual = [];

    conversaAtualId =
        gerarIdConversa();


    /*
       CORREÇÃO IMPORTANTE:
       usamos a mesma chave definida na configuração.
    */

    localStorage.removeItem(
        ASSISTANT_CONFIG.storage.historyKey
    );


    if (assistantElements.conversation) {

        assistantElements.conversation.innerHTML =
            "";

        assistantElements.conversation.classList.add(
            "is-empty"
        );

    }


    atualizarHistorico();

    atualizarInterfaceInicial();


    if (assistantElements.input) {

        assistantElements.input.focus();

    }

}


/* =========================================================
   FORMATAR DATA DO HISTÓRICO
   ========================================================= */

function formatarDataHistorico(
    timestamp
) {

    if (!timestamp) {
        return "";
    }


    const data =
        new Date(
            timestamp
        );


    const hoje =
        new Date();


    const ontem =
        new Date();


    ontem.setDate(
        hoje.getDate() - 1
    );


    if (
        data.toDateString() ===
        hoje.toDateString()
    ) {

        return "HOJE";

    }


    if (
        data.toDateString() ===
        ontem.toDateString()
    ) {

        return "ONTEM";

    }


    return data.toLocaleDateString(
        "pt-BR",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );

}


/* =========================================================
   CARREGAR CONVERSA
   ========================================================= */

function carregarConversa(
    id
) {

    const conversa =
        conversasSalvas.find(
            item =>
                item.id === id
        );


    if (!conversa) {
        return;
    }


    conversaAtualId =
        conversa.id;


    conversaAtual =
        Array.isArray(
            conversa.mensagens
        )
            ? [...conversa.mensagens]
            : [];


    const conversation =
        assistantElements.conversation;


    if (!conversation) {
        return;
    }


    conversation.innerHTML =
        "";


    conversaAtual.forEach(
        mensagem => {

            renderizarMensagemExistente(
                mensagem.tipo,
                mensagem.texto,
                mensagem.horario
            );

        }
    );


    atualizarHistorico();


    if (
        conversaAtual.length > 0
    ) {

        atualizarInterfaceConversacao();

    } else {

        atualizarInterfaceInicial();

    }


    rolarConversaParaBaixo();

}


/* =========================================================
   RENDERIZAR MENSAGEM EXISTENTE
   ========================================================= */

function renderizarMensagemExistente(
    tipo,
    texto,
    horario
) {

    const conversation =
        assistantElements.conversation;


    if (!conversation) {
        return;
    }


    const mensagem =
        document.createElement(
            "article"
        );


    mensagem.classList.add(
        "assistant-message"
    );


    if (tipo === "user") {

        mensagem.classList.add(
            "assistant-message-user"
        );

    } else {

        mensagem.classList.add(
            "assistant-message-system"
        );

    }


    /* ---------------------------------------------------------
       AVATAR
    --------------------------------------------------------- */

    const avatar =
        document.createElement(
            "div"
        );


    avatar.className =
        "message-avatar";


    avatar.textContent =
        tipo === "user"
            ? "VC"
            : "SF";


    /* ---------------------------------------------------------
       CONTEÚDO
    --------------------------------------------------------- */

    const content =
        document.createElement(
            "div"
        );


    content.className =
        "message-content";


    /* ---------------------------------------------------------
       CABEÇALHO
    --------------------------------------------------------- */

    const header =
        document.createElement(
            "div"
        );


    header.className =
        "message-header";


    const nome =
        document.createElement(
            "strong"
        );


    nome.textContent =
        tipo === "user"
            ? "VOCÊ"
            : "SEXTA-FEIRA";


    const hora =
        document.createElement(
            "span"
        );


    hora.textContent =
        horario || "";


    header.appendChild(
        nome
    );


    header.appendChild(
        hora
    );


    /* ---------------------------------------------------------
       CORPO
    --------------------------------------------------------- */

    const corpo =
        document.createElement(
            "div"
        );


    corpo.className =
        "message-body";


    corpo.innerHTML =
        formatarMarkdownSeguro(
            texto
        );


    /* ---------------------------------------------------------
       MONTAGEM
    --------------------------------------------------------- */

    content.appendChild(
        header
    );


    content.appendChild(
        corpo
    );


    mensagem.appendChild(
        avatar
    );


    mensagem.appendChild(
        content
    );


    conversation.appendChild(
        mensagem
    );

}


/* =========================================================
   ATUALIZAR ESTADO DA INTERFACE
   ========================================================= */

function atualizarInterfaceInicial() {

    const conversation =
        assistantElements.conversation;


    if (!conversation) {
        return;
    }


    if (
        conversaAtual.length === 0
    ) {

        conversation.classList.add(
            "is-empty"
        );

    } else {

        conversation.classList.remove(
            "is-empty"
        );

    }

}


/* =========================================================
   ATUALIZAR ESTADO DE CONVERSAÇÃO
   ========================================================= */

function atualizarInterfaceConversacao() {

    const conversation =
        assistantElements.conversation;


    if (!conversation) {
        return;
    }


    conversation.classList.remove(
        "is-empty"
    );

}


/* =========================================================
   NOVA CONVERSA — ESTADO
   ========================================================= */

function atualizarEstadoNovaConversa() {

    conversaAtual = [];

    conversaAtualId =
        gerarIdConversa();


    atualizarHistorico();

    atualizarInterfaceInicial();

}


/* =========================================================
   EXPORTAÇÃO
   ========================================================= */

window.SextaFeiraAssistant = {

    enviarMensagem,

    consultarBackend,

    verificarBackend,

    adicionarMensagem,

    limparConversa,

    iniciarNovaConversa,

    carregarConversa,

    atualizarHistorico,

    limparTodoHistorico,

    excluirConversa

};