from fastapi import HTTPException

from models import Psicologo


class PsicologoService:
    def __init__(self, repository):
        self.repository = repository

    def criar(self, dados):

        psicologo = Psicologo(
            nome=dados.nome,
            titulo=dados.titulo,
            bio=dados.bio,
            foto=dados.foto,
            ativo=dados.ativo,
        )

        psicologo = self.repository.create(psicologo)

        return {
            "mensagem": "Psicólogo cadastrado com sucesso.",
            "objeto": psicologo,
        }

    def listar(self):

        lista = self.repository.get_all()

        return {
            "mensagem": "Psicólogos encontrados.",
            "total": len(lista),
            "psicologos": lista,
        }

    def listar_ativos(self):

        lista = self.repository.get_all_ativos()

        return {
            "mensagem": "Psicólogos ativos.",
            "total": len(lista),
            "psicologos": lista,
        }

    def buscar(self, psicologo_id: int):

        psicologo = self.repository.get_by_id(psicologo_id)

        if not psicologo:
            raise HTTPException(
                status_code=404,
                detail="Psicólogo não encontrado.",
            )

        return {
            "mensagem": "Psicólogo encontrado.",
            "psicologo": psicologo,
        }

    def buscar_nome(self, nome: str):

        lista = self.repository.get_by_nome(nome)

        return {
            "mensagem": "Busca realizada.",
            "total": len(lista),
            "psicologos": lista,
        }

    def atualizar(self, psicologo_id, dados):

        psicologo = self.repository.get_by_id(psicologo_id)

        if not psicologo:
            raise HTTPException(
                status_code=404,
                detail="Psicólogo não encontrado.",
            )

        psicologo.nome = dados.nome
        psicologo.titulo = dados.titulo
        psicologo.bio = dados.bio
        psicologo.foto = dados.foto
        psicologo.ativo = dados.ativo

        self.repository.update()

        return {"mensagem": "Psicólogo atualizado com sucesso."}

    def excluir(self, psicologo_id):

        psicologo = self.repository.get_by_id(psicologo_id)

        if not psicologo:
            raise HTTPException(
                status_code=404,
                detail="Psicólogo não encontrado.",
            )

        self.repository.delete(psicologo)

        return {"mensagem": "Psicólogo removido com sucesso."}
