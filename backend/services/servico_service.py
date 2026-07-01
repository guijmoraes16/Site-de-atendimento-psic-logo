from fastapi import HTTPException

from models.servico import Servico


class ServicoService:
    def __init__(self, repository):
        self.repository = repository

    def criar(self, dados):

        modalidade = dados.modalidade.lower()

        if modalidade not in ["presencial", "online"]:
            raise HTTPException(
                status_code=400, detail="Modalidade deve ser Presencial ou Online."
            )

        servico = Servico(
            nome=dados.nome,
            descricao=dados.descricao,
            valor=dados.valor,
            duracao=dados.duracao,
            modalidade=dados.modalidade.capitalize(),
            ativo=dados.ativo,
        )

        servico = self.repository.create(servico)

        return {
            "mensagem": "Serviço cadastrado com sucesso.",
            "objeto": servico,
        }

    def listar(self):

        lista = self.repository.get_all()

        return {
            "mensagem": "Serviços encontrados.",
            "total": len(lista),
            "servicos": lista,
        }

    def listar_ativos(self):

        lista = self.repository.get_all_ativos()

        return {
            "mensagem": "Serviços ativos.",
            "total": len(lista),
            "servicos": lista,
        }

    def buscar(self, servico_id):

        servico = self.repository.get_by_id(servico_id)

        if not servico:
            raise HTTPException(status_code=404, detail="Serviço não encontrado.")

        return {
            "mensagem": "Serviço encontrado.",
            "servico": servico,
        }

    def buscar_nome(self, nome):

        lista = self.repository.get_by_nome(nome)

        return {
            "mensagem": "Busca realizada.",
            "total": len(lista),
            "servicos": lista,
        }

    def atualizar(self, servico_id, dados):

        servico = self.repository.get_by_id(servico_id)

        if not servico:
            raise HTTPException(status_code=404, detail="Serviço não encontrado.")

        modalidade = dados.modalidade.lower()

        if modalidade not in ["presencial", "online"]:
            raise HTTPException(
                status_code=400, detail="Modalidade deve ser Presencial ou Online."
            )

        servico.nome = dados.nome
        servico.descricao = dados.descricao
        servico.valor = dados.valor
        servico.duracao = dados.duracao
        servico.modalidade = dados.modalidade.capitalize()
        servico.ativo = dados.ativo

        self.repository.update()

        return {
            "mensagem": "Serviço atualizado com sucesso.",
        }

    def excluir(self, servico_id):

        servico = self.repository.get_by_id(servico_id)

        if not servico:
            raise HTTPException(status_code=404, detail="Serviço não encontrado.")

        self.repository.delete(servico)

        return {"mensagem": "Serviço removido com sucesso."}
