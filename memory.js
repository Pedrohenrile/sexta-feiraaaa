/* =========================================================
   MEMORY CORE
   ORION — Sistema Pessoal
   Gerenciamento da memória da SEXTA-FEIRA
========================================================= */


/* =========================================================
   CONFIGURAÇÃO
========================================================= */

const MEMORY_CONFIG = {

    storageKey: "orion_memory_core",

    locale: "pt-BR",

    maxMemories: 500

};


/* =========================================================
   ESTADO
========================================================= */

const MEMORY_STATE = {

    initialized: false,

    memories: [],

    searchTerm: "",

    activeCategory: "all"

};


/* =========================================================
   ELEMENTOS
========================================================= */

const memoryElements = {

    search:
        document.querySelector("[data-memory-search]"),

    filter:
        document.querySelector("[data-memory-filter]"),

    memoryCount:
        document.querySelector("[data-memory-count]"),

    categoryButtons:
        document.querySelectorAll("[data-memory-category-filter]"),

    addButtons:
        document.querySelectorAll("[data-action='memory-add']"),

    addIdeaButtons:
        document.querySelectorAll("[data-action='memory-add-idea']"),

    editProfile:
        document.querySelector("[data-action='memory-edit-profile']"),

    memoryItems:
        document.querySelectorAll("[data-memory-category]")

};


/* =========================================================
   MEMÓRIAS PADRÃO
========================================================= */

const DEFAULT_MEMORIES = [

    {
        id: "profile",
        category: "personal",
        title: "Perfil pessoal",
        content:
            "Informações importantes sobre o usuário que ajudam a SEXTA-FEIRA a compreender seu contexto.",
        important: true,
        createdAt: Date.now()
    },

    {
        id: "long-term-goals",
        category: "goals",
        title: "Objetivos de longo prazo",
        content:
            "Metas que devem permanecer no contexto da SEXTA-FEIRA para orientar decisões futuras.",
        important: true,
        createdAt: Date.now()
    },

    {
        id: "orion-project",
        category: "projects",
        title: "Projeto ORION",
        content:
            "Desenvolvimento do sistema pessoal, incluindo assistente, memória, agenda, automações e inteligência.",
        important: true,
        createdAt: Date.now()
    }

];


/* =========================================================
   STORAGE
========================================================= */

function loadMemories() {

    try {

        const saved =
            localStorage.getItem(MEMORY_CONFIG.storageKey);

        if (!saved) {

            MEMORY_STATE.memories =
                [...DEFAULT_MEMORIES];

            saveMemories();

            return;

        }

        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {

            MEMORY_STATE.memories = parsed;

        } else {

            MEMORY_STATE.memories =
                [...DEFAULT_MEMORIES];

        }

    } catch (error) {

        console.error(
            "Erro ao carregar Memory Core:",
            error
        );

        MEMORY_STATE.memories =
            [...DEFAULT_MEMORIES];

    }

}


/* =========================================================
   SALVAR
========================================================= */

function saveMemories() {

    try {

        const memories =
            MEMORY_STATE.memories.slice(
                0,
                MEMORY_CONFIG.maxMemories
            );

        localStorage.setItem(
            MEMORY_CONFIG.storageKey,
            JSON.stringify(memories)
        );

    } catch (error) {

        console.error(
            "Erro ao salvar Memory Core:",
            error
        );

    }

}


/* =========================================================
   CONTADOR
========================================================= */

function updateMemoryCount() {

    if (!memoryElements.memoryCount) {
        return;
    }

    memoryElements.memoryCount.textContent =
        MEMORY_STATE.memories.length;

}


/* =========================================================
   NORMALIZAÇÃO
========================================================= */

function normalizeText(value) {

    return String(value || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

}


/* =========================================================
   VERIFICAR MEMÓRIA
========================================================= */

function memoryMatchesSearch(memory) {

    if (!MEMORY_STATE.searchTerm) {
        return true;
    }

    const search =
        normalizeText(MEMORY_STATE.searchTerm);

    const searchableText = normalizeText(
        `${memory.title} ${memory.content} ${memory.category}`
    );

    return searchableText.includes(search);

}


/* =========================================================
   VERIFICAR CATEGORIA
========================================================= */

function memoryMatchesCategory(memory) {

    if (MEMORY_STATE.activeCategory === "all") {
        return true;
    }

    if (MEMORY_STATE.activeCategory === "important") {
        return memory.important === true;
    }

    return (
        memory.category ===
        MEMORY_STATE.activeCategory
    );

}


/* =========================================================
   FILTRAR MEMÓRIAS
========================================================= */

function getFilteredMemories() {

    return MEMORY_STATE.memories.filter(memory => {

        return (
            memoryMatchesSearch(memory) &&
            memoryMatchesCategory(memory)
        );

    });

}


/* =========================================================
   FILTRAR ELEMENTOS VISUAIS
========================================================= */

function updateVisibleMemoryItems() {

    memoryElements.memoryItems.forEach(item => {

        const category =
            item.dataset.memoryCategory || "";

        const text =
            normalizeText(item.textContent);

        const search =
            normalizeText(
                MEMORY_STATE.searchTerm
            );

        let visible = true;


        /* Categoria */

        if (
            MEMORY_STATE.activeCategory !== "all" &&
            MEMORY_STATE.activeCategory !== "important" &&
            category !== MEMORY_STATE.activeCategory
        ) {

            visible = false;

        }


        /* Importantes */

        if (
            MEMORY_STATE.activeCategory === "important"
        ) {

            if (
                !item.classList.contains("important-memory")
            ) {

                visible = false;

            }

        }


        /* Pesquisa */

        if (
            search &&
            !text.includes(search)
        ) {

            visible = false;

        }


        item.classList.toggle(
            "memory-item-hidden",
            !visible
        );

    });

}


/* =========================================================
   ATUALIZAR FILTROS
========================================================= */

function updateFilterInterface() {

    if (memoryElements.filter) {

        memoryElements.filter.value =
            MEMORY_STATE.activeCategory;

    }


    memoryElements.categoryButtons.forEach(button => {

        const category =
            button.dataset.memoryCategoryFilter;

        button.classList.toggle(
            "active",
            category === MEMORY_STATE.activeCategory
        );

    });

}


/* =========================================================
   PESQUISA
========================================================= */

function handleMemorySearch(event) {

    MEMORY_STATE.searchTerm =
        event.target.value.trim();

    updateVisibleMemoryItems();

}


/* =========================================================
   FILTRO SELECT
========================================================= */

function handleMemoryFilter(event) {

    MEMORY_STATE.activeCategory =
        event.target.value;

    updateFilterInterface();
    updateVisibleMemoryItems();

}


/* =========================================================
   FILTRO POR CATEGORIA
========================================================= */

function handleCategoryClick(event) {

    const button =
        event.currentTarget;

    const category =
        button.dataset.memoryCategoryFilter;

    if (!category) {
        return;
    }

    MEMORY_STATE.activeCategory =
        category;

    updateFilterInterface();
    updateVisibleMemoryItems();

}


/* =========================================================
   CRIAR MEMÓRIA
========================================================= */

function createMemory({

    title,
    content,
    category = "personal",
    important = false

}) {

    if (!title || !content) {

        notifyWarning(
            "Título e conteúdo são necessários."
        );

        return null;

    }


    const memory = {

        id:
            `memory-${Date.now()}-${Math.random()
                .toString(36)
                .slice(2, 8)}`,

        title:
            title.trim(),

        content:
            content.trim(),

        category,

        important,

        createdAt:
            Date.now()

    };


    MEMORY_STATE.memories.unshift(memory);

    saveMemories();

    updateMemoryCount();


    notifySuccess(
        "Memória adicionada ao Memory Core."
    );


    return memory;

}


/* =========================================================
   INTERFACE TEMPORÁRIA PARA NOVA MEMÓRIA
========================================================= */

function createMemoryFromPrompt() {

    const title =
        window.prompt(
            "Título da memória:"
        );

    if (!title) {
        return;
    }


    const content =
        window.prompt(
            "O que você deseja que a SEXTA-FEIRA lembre?"
        );

    if (!content) {
        return;
    }


    createMemory({

        title,

        content,

        category: "personal",

        important: false

    });

}


/* =========================================================
   NOVA IDEIA
========================================================= */

function createIdeaFromPrompt() {

    const title =
        window.prompt(
            "Nome da ideia:"
        );

    if (!title) {
        return;
    }


    const content =
        window.prompt(
            "Descreva a ideia:"
        );

    if (!content) {
        return;
    }


    createMemory({

        title,

        content,

        category: "ideas",

        important: false

    });

}


/* =========================================================
   EDITAR PERFIL
========================================================= */

function editProfile() {

    notifyInfo(
        "Editor de perfil será conectado ao banco de dados na próxima etapa."
    );

}


/* =========================================================
   ABRIR MEMÓRIA
========================================================= */

function openMemory(memoryId) {

    const memory =
        MEMORY_STATE.memories.find(
            item => item.id === memoryId
        );

    if (!memory) {
        return;
    }


    notifyInfo(
        `${memory.title}: ${memory.content}`
    );

}


/* =========================================================
   CLIQUES NAS MEMÓRIAS
========================================================= */

function initializeMemoryCards() {

    document
        .querySelectorAll(".important-memory")
        .forEach((card, index) => {

            card.addEventListener(
                "click",
                event => {

                    if (
                        event.target.closest(
                            ".icon-button"
                        )
                    ) {

                        const memory =
                            MEMORY_STATE.memories[index];

                        if (memory) {
                            openMemory(memory.id);
                        }

                    }

                }
            );

        });

}


/* =========================================================
   ATALHOS
========================================================= */

function initializeMemoryShortcuts() {

    document.addEventListener(
        "keydown",
        event => {

            /*
                Ctrl + K
                Foco na pesquisa
            */

            if (
                event.ctrlKey &&
                event.key.toLowerCase() === "k"
            ) {

                event.preventDefault();

                if (memoryElements.search) {

                    memoryElements.search.focus();

                }

            }


            /*
                ESC
                Limpa pesquisa
            */

            if (
                event.key === "Escape" &&
                document.activeElement ===
                memoryElements.search
            ) {

                memoryElements.search.value = "";

                MEMORY_STATE.searchTerm = "";

                updateVisibleMemoryItems();

            }

        }
    );

}


/* =========================================================
   EVENTOS
========================================================= */

function initializeMemoryEvents() {


    /* Pesquisa */

    if (memoryElements.search) {

        memoryElements.search.addEventListener(
            "input",
            handleMemorySearch
        );

    }


    /* Filtro */

    if (memoryElements.filter) {

        memoryElements.filter.addEventListener(
            "change",
            handleMemoryFilter
        );

    }


    /* Categorias */

    memoryElements.categoryButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                handleCategoryClick
            );

        }
    );


    /* Nova memória */

    memoryElements.addButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                createMemoryFromPrompt
            );

        }
    );


    /* Nova ideia */

    memoryElements.addIdeaButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                createIdeaFromPrompt
            );

        }
    );


    /* Perfil */

    if (memoryElements.editProfile) {

        memoryElements.editProfile.addEventListener(
            "click",
            editProfile
        );

    }

}


/* =========================================================
   CONTEXTO PARA A SEXTA-FEIRA
========================================================= */

function getMemoryContext() {

    const memories =
        MEMORY_STATE.memories;

    return {

        total:
            memories.length,

        important:
            memories.filter(
                memory => memory.important
            ).length,

        categories:
            [
                ...new Set(
                    memories.map(
                        memory => memory.category
                    )
                )
            ],

        recent:
            memories
                .slice(0, 10)
                .map(memory => ({
                    title: memory.title,
                    category: memory.category,
                    content: memory.content
                }))

    };

}


/* =========================================================
   API PÚBLICA
========================================================= */

window.ORION_MEMORY = {

    getAll() {

        return [
            ...MEMORY_STATE.memories
        ];

    },


    getFiltered() {

        return getFilteredMemories();

    },


    create(data) {

        return createMemory(data);

    },


    search(term) {

        MEMORY_STATE.searchTerm =
            String(term || "");

        updateVisibleMemoryItems();

        return getFilteredMemories();

    },


    setCategory(category) {

        MEMORY_STATE.activeCategory =
            category || "all";

        updateFilterInterface();
        updateVisibleMemoryItems();

    },


    getContext() {

        return getMemoryContext();

    },


    clearSearch() {

        MEMORY_STATE.searchTerm = "";

        if (memoryElements.search) {
            memoryElements.search.value = "";
        }

        updateVisibleMemoryItems();

    }

};


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

function initializeMemoryCore() {

    if (MEMORY_STATE.initialized) {
        return;
    }


    loadMemories();

    initializeMemoryEvents();

    initializeMemoryShortcuts();

    initializeMemoryCards();

    updateMemoryCount();

    updateFilterInterface();

    updateVisibleMemoryItems();


    MEMORY_STATE.initialized = true;


    console.log(
        "Memory Core inicializado.",
        getMemoryContext()
    );


    /*
        Evento global para o restante do ORION.
    */

    document.dispatchEvent(
        new CustomEvent(
            "orion:memory-ready",
            {
                detail:
                    getMemoryContext()
            }
        )
    );

}


/* =========================================================
   START
========================================================= */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeMemoryCore
    );

} else {

    initializeMemoryCore();

}