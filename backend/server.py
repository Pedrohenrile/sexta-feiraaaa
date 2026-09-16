import json
import os
from http.server import BaseHTTPRequestHandler, HTTPServer

from openai import OpenAI


# =========================================================
# CONFIGURAÇÃO
# =========================================================

HOST = "127.0.0.1"
PORT = 8765

MODEL = "gpt-5.6-luna"

client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY")
)


# =========================================================
# MEMÓRIA DE CONVERSA
# =========================================================

# Guarda o identificador da última resposta da SEXTA-FEIRA.
#
# Isso permite que a próxima mensagem continue o contexto
# da conversa em vez de começar do zero.
#
# IMPORTANTE:
# isso ainda NÃO é a memória permanente da SEXTA-FEIRA.
# É apenas memória/contexto da conversa atual.

ultima_resposta_id = None


# =========================================================
# PERSONALIDADE DA SEXTA-FEIRA
# =========================================================

INSTRUCOES_SEXTA_FEIRA = """
Você é a SEXTA-FEIRA, a inteligência pessoal central
do sistema ORION.

Seu usuário conversa com você naturalmente e espera
uma interação semelhante a conversar com um assistente
inteligente de verdade.

IDENTIDADE
----------

Nome:
SEXTA-FEIRA

Função:
Ser uma inteligência pessoal capaz de conversar,
raciocinar, analisar situações, organizar informações
e auxiliar o usuário em suas tarefas, projetos,
estudos e decisões.

PERSONALIDADE
-------------

Você é:

- inteligente
- analítica
- observadora
- estratégica
- direta
- natural
- objetiva quando necessário
- detalhada quando o assunto exige
- prestativa
- crítica quando necessário
- capaz de discordar do usuário
- capaz de reconhecer quando não sabe algo

Você NÃO deve concordar automaticamente com o usuário.

Se o usuário estiver equivocado, explique de maneira
clara e respeitosa.

Se existir uma alternativa melhor, apresente-a.

Não invente informações.

Se não souber algo, diga que não sabe.

CONVERSA
--------

Converse naturalmente em português brasileiro.

Não responda sempre como se estivesse lendo um manual.

Evite frases artificiais e repetitivas.

Adapte o tamanho da resposta ao contexto.

Se o usuário fizer uma pergunta simples,
responda de forma simples.

Se o usuário quiser analisar algo complexo,
aprofundar a resposta.

Mantenha o contexto da conversa.

Quando o usuário fizer referência a algo que acabou
de ser mencionado, use o contexto anterior para
entender a referência.

Exemplo:

Usuário:
"Estou pensando em mudar meu treino."

Você:
"Qual parte você está pensando em mudar?"

Usuário:
"Os dias."

Você deve entender que "os dias" se refere
aos dias do treino mencionado anteriormente.

ORION
------

Você é o núcleo inteligente do sistema ORION.

Neste momento você possui acesso apenas às informações
que forem enviadas nesta conversa.

Você ainda NÃO possui acesso real à agenda,
memória permanente, arquivos pessoais, projetos,
computador ou outros módulos do ORION.

Nunca finja possuir acesso a algo que ainda não foi
implementado.

Quando esses módulos forem conectados futuramente,
você poderá utilizá-los através de ferramentas próprias.

OBJETIVO
--------

Seu objetivo é ajudar o usuário a pensar melhor,
organizar informações, resolver problemas e executar
tarefas.

Não tente parecer inteligente.

Seja útil.
"""


# =========================================================
# SERVIDOR
# =========================================================

class SextaFeiraServer(BaseHTTPRequestHandler):


    # =====================================================
    # RESPOSTA JSON
    # =====================================================

    def enviar_json(self, dados, status=200):

        resposta = json.dumps(
            dados,
            ensure_ascii=False
        ).encode("utf-8")


        self.send_response(status)


        self.send_header(
            "Content-Type",
            "application/json; charset=utf-8"
        )


        self.send_header(
            "Content-Length",
            str(len(resposta))
        )


        self.send_header(
            "Access-Control-Allow-Origin",
            "*"
        )


        self.send_header(
            "Access-Control-Allow-Headers",
            "Content-Type"
        )


        self.send_header(
            "Access-Control-Allow-Methods",
            "GET, POST, OPTIONS"
        )


        self.end_headers()


        self.wfile.write(resposta)


    # =====================================================
    # OPTIONS
    # =====================================================

    def do_OPTIONS(self):

        self.send_response(204)


        self.send_header(
            "Access-Control-Allow-Origin",
            "*"
        )


        self.send_header(
            "Access-Control-Allow-Methods",
            "GET, POST, OPTIONS"
        )


        self.send_header(
            "Access-Control-Allow-Headers",
            "Content-Type"
        )


        self.end_headers()


    # =====================================================
    # GET
    # =====================================================

    def do_GET(self):

        if self.path == "/status":

            self.enviar_json({

                "online": True,

                "system": "ORION",

                "assistant": "SEXTA-FEIRA",

                "ai": True,

                "model": MODEL,

                "conversation_context":
                    ultima_resposta_id is not None

            })

            return


        self.enviar_json(
            {
                "success": False,
                "error": "Endpoint não encontrado."
            },
            404
        )


    # =====================================================
    # POST
    # =====================================================

       # =====================================================
    # POST
    # =====================================================

    def do_POST(self):

        if self.path != "/chat":

            self.enviar_json(
                {
                    "success": False,
                    "error": "Endpoint não encontrado."
                },
                404
            )

            return


        try:

            # -------------------------------------------------
            # TAMANHO DA REQUISIÇÃO
            # -------------------------------------------------

            content_length = int(
                self.headers.get(
                    "Content-Length",
                    0
                )
            )


            if content_length <= 0:

                self.enviar_json(
                    {
                        "success": False,
                        "error": "Nenhum dado foi enviado."
                    },
                    400
                )

                return


            # -------------------------------------------------
            # LER DADOS
            # -------------------------------------------------

            raw_data = self.rfile.read(
                content_length
            )


            # -------------------------------------------------
            # DECODIFICAR JSON
            # -------------------------------------------------

            try:

                data = json.loads(
                    raw_data.decode("utf-8")
                )

            except UnicodeDecodeError:

                data = json.loads(
                    raw_data.decode("cp1252")
                )


            # -------------------------------------------------
            # PEGAR MENSAGEM
            # -------------------------------------------------

            mensagem = data.get(
                "message",
                ""
            )


            if not isinstance(
                mensagem,
                str
            ):

                self.enviar_json(
                    {
                        "success": False,
                        "error": "Mensagem inválida."
                    },
                    400
                )

                return


            mensagem = mensagem.strip()


            if not mensagem:

                self.enviar_json(
                    {
                        "success": False,
                        "error": "Mensagem vazia."
                    },
                    400
                )

                return


            # -------------------------------------------------
            # PROCESSAR MENSAGEM
            # -------------------------------------------------

            resposta = self.processar_mensagem(
                mensagem
            )


            # -------------------------------------------------
            # ENVIAR RESPOSTA
            # -------------------------------------------------

            self.enviar_json(
                {
                    "success": True,
                    "response": resposta
                }
            )


        except json.JSONDecodeError:

            self.enviar_json(
                {
                    "success": False,
                    "error": "JSON inválido."
                },
                400
            )


        except Exception as erro:

            print()
            print(
                "ERRO SEXTA-FEIRA:"
            )

            print(
                repr(erro)
            )

            print()


            self.enviar_json(
                {
                    "success": False,
                    "error": str(erro)
                },
                500
            )
    # =====================================================
    # PROCESSAR MENSAGEM
    # =====================================================

    def processar_mensagem(
        self,
        mensagem
    ):

        global ultima_resposta_id


        # =================================================
        # PRIMEIRA MENSAGEM
        # =================================================

        if ultima_resposta_id is None:

            resposta = client.responses.create(

                model=MODEL,

                instructions=
                    INSTRUCOES_SEXTA_FEIRA,

                input=mensagem

            )


        # =================================================
        # CONTINUAR CONVERSA
        # =================================================

        else:

            resposta = client.responses.create(

                model=MODEL,

                instructions=
                    INSTRUCOES_SEXTA_FEIRA,

                previous_response_id=
                    ultima_resposta_id,

                input=mensagem

            )


        # =================================================
        # GUARDAR CONTEXTO
        # =================================================

        ultima_resposta_id = resposta.id


        # =================================================
        # RETORNAR TEXTO
        # =================================================

        return resposta.output_text


# =========================================================
# INICIAR SERVIDOR
# =========================================================

def iniciar_servidor():

    servidor = HTTPServer(
        (HOST, PORT),
        SextaFeiraServer
    )


    print("=" * 60)
    print("ORION — SEXTA-FEIRA CORE")
    print("=" * 60)
    print()


    print(
        "SEXTA-FEIRA: ONLINE"
    )


    print(
        "Inteligência: ONLINE"
    )


    print(
        f"Modelo: {MODEL}"
    )


    print()


    print(
        f"Servidor: http://{HOST}:{PORT}"
    )


    print()


    print(
        "Contexto de conversa: ATIVO"
    )


    print()


    print(
        "Aguardando conexão do ORION..."
    )


    print(
        "Pressione CTRL+C para encerrar."
    )


    print()


    try:

        servidor.serve_forever()


    except KeyboardInterrupt:

        print()


        print(
            "Encerrando SEXTA-FEIRA..."
        )


    finally:

        servidor.server_close()


        print(
            "Servidor encerrado."
        )


# =========================================================
# EXECUÇÃO
# =========================================================

if __name__ == "__main__":

    iniciar_servidor()