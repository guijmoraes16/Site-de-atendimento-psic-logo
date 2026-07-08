from fastapi import HTTPException

from models.horario_disponivel import HorarioDisponivel


class HorarioService:
    def __init__(
        self,
        repository,
        psicologo_repository,
    ):
        self.repository = repository
        self.psicologo_repository = psicologo_repository

    # ==========================
    # CREATE
    # ==========================
    def criar(self, dados):

        psicologo = self.psicologo_repository.get_by_id(dados.psicologo_id)

        if not psicologo:
            raise HTTPException(status_code=404, detail="Psicólogo não encontrado.")

        horario_existe = self.repository.get_by_data_hora(
            dados.psicologo_id,
            dados.data,
            dados.hora,
        )

        if horario_existe:
            raise HTTPException(
                status_code=400,
                detail="Este horário já está cadastrado para este psicólogo.",
            )

        horario = HorarioDisponivel(
            psicologo_id=dados.psicologo_id,
            data=dados.data,
            hora=dados.hora,
            disponivel=True,
        )

        horario = self.repository.create(horario)

        return {
            "mensagem": "Horário cadastrado com sucesso.",
            "objeto": horario,
        }

    # ==========================
    # LISTAR
    # ==========================
    def listar(self):

        lista = self.repository.get_all()

        return {
            "mensagem": "Horários encontrados.",
            "total": len(lista),
            "horarios": lista,
        }

    # ==========================
    # BUSCAR
    # ==========================
    def buscar(self, horario_id):

        horario = self.repository.get_by_id(horario_id)

        if not horario:
            raise HTTPException(status_code=404, detail="Horário não encontrado.")

        return {
            "mensagem": "Horário encontrado.",
            "horario": horario,
        }

    # ==========================
    # HORÁRIOS DISPONÍVEIS
    # ==========================
    def listar_disponiveis(self):

        lista = self.repository.get_disponiveis()

        return {
            "mensagem": "Horários disponíveis.",
            "total": len(lista),
            "horarios": lista,
        }

    # ==========================
    # HORÁRIOS DO PSICÓLOGO
    # ==========================
    def listar_por_psicologo(
        self,
        psicologo_id,
    ):

        psicologo = self.psicologo_repository.get_by_id(psicologo_id)

        if not psicologo:
            raise HTTPException(status_code=404, detail="Psicólogo não encontrado.")

        lista = self.repository.get_by_psicologo(psicologo_id)

        return {
            "mensagem": "Horários encontrados.",
            "total": len(lista),
            "horarios": lista,
        }

    # ==========================
    # UPDATE
    # ==========================
    def atualizar(
        self,
        horario_id,
        dados,
    ):

        horario = self.repository.get_by_id(horario_id)

        if not horario:
            raise HTTPException(status_code=404, detail="Horário não encontrado.")

        horario_repetido = self.repository.get_by_data_hora(
            dados.psicologo_id,
            dados.data,
            dados.hora,
        )

        if horario_repetido and horario_repetido.id != horario.id:
            raise HTTPException(status_code=400, detail="Já existe este horário.")

        horario.psicologo_id = dados.psicologo_id
        horario.data = dados.data
        horario.hora = dados.hora
        horario.disponivel = dados.disponivel

        self.repository.update()

        return {
            "mensagem": "Horário atualizado.",
        }

    # ==========================
    # DELETE
    # ==========================
    def excluir(self, horario_id):

        horario = self.repository.get_by_id(horario_id)

        if not horario:
            raise HTTPException(status_code=404, detail="Horário não encontrado.")

        if self.repository.possui_agendamento(horario_id):
            raise HTTPException(
                status_code=409,
                detail="Este horário possui um agendamento e não pode ser excluído.",
            )

        self.repository.delete(horario)

        return {"mensagem": "Horário removido."}
