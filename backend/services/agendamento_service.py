from fastapi import HTTPException

from models import Agendamento


class AgendamentoService:
    def __init__(
        self,
        repository,
        paciente_repository,
        psicologo_repository,
        servico_repository,
        horario_repository,
    ):
        self.repository = repository
        self.paciente_repository = paciente_repository
        self.psicologo_repository = psicologo_repository
        self.servico_repository = servico_repository
        self.horario_repository = horario_repository

    def criar(self, dados):

        # ==========================
        # Paciente
        # ==========================

        paciente = self.paciente_repository.get_by_id(dados.paciente_id)

        if not paciente:
            raise HTTPException(status_code=404, detail="Paciente não encontrado.")

        # ==========================
        # Psicólogo
        # ==========================

        psicologo = self.psicologo_repository.get_by_id(dados.psicologo_id)

        if not psicologo:
            raise HTTPException(status_code=404, detail="Psicólogo não encontrado.")

        # ==========================
        # Serviço
        # ==========================

        servico = self.servico_repository.get_by_id(dados.servico_id)

        if not servico:
            raise HTTPException(status_code=404, detail="Serviço não encontrado.")

        # ==========================
        # Horário
        # ==========================

        horario = self.horario_repository.get_by_id(dados.horario_id)

        if not horario:
            raise HTTPException(status_code=404, detail="Horário não encontrado.")

        # ==========================
        # Horário pertence ao psicólogo?
        # ==========================

        if horario.psicologo_id != dados.psicologo_id:
            raise HTTPException(
                status_code=400, detail="O horário informado não pertence ao psicólogo."
            )

        # ==========================
        # Horário disponível?
        # ==========================

        if not horario.disponivel:
            raise HTTPException(
                status_code=400, detail="Este horário já está reservado."
            )

        # ==========================
        # Criar Agendamento
        # ==========================

        agendamento = Agendamento(
            paciente_id=dados.paciente_id,
            psicologo_id=dados.psicologo_id,
            servico_id=dados.servico_id,
            horario_id=dados.horario_id,
            mensagem=dados.mensagem,
            status="Agendado",
        )

        agendamento = self.repository.create(agendamento)

        # ==========================
        # Atualizar horário
        # ==========================

        self.horario_repository.marcar_indisponivel(horario)

        return {
            "mensagem": "Agendamento realizado com sucesso.",
        }

    def listar(self):
        lista = self.repository.get_all()
        resposta = []

        for agendamento in lista:
            resposta.append(
                {
                    "id": agendamento.id,
                    "paciente": agendamento.paciente.nome,
                    "psicologo": agendamento.psicologo.nome,
                    "servico": agendamento.servico.nome,
                    "data": agendamento.horario.data,
                    "hora": agendamento.horario.hora,
                    "status": agendamento.status,
                }
            )

        return {
            "mensagem": "Agendamentos encontrados.",
            "total": len(resposta),
            "agendamentos": resposta,
        }

    def buscar(
        self,
        agendamento_id,
    ):

        agendamento = self.repository.get_by_id(agendamento_id)

        if not agendamento:
            raise HTTPException(status_code=404, detail="Agendamento não encontrado.")

        return {
            "mensagem": "Agendamento encontrado.",
            "agendamento": agendamento,
        }

    def listar_por_paciente(
        self,
        paciente_id,
    ):

        paciente = self.paciente_repository.get_by_id(paciente_id)

        if not paciente:
            raise HTTPException(status_code=404, detail="Paciente não encontrado.")

        lista = self.repository.get_by_paciente(paciente_id)

        return {
            "mensagem": "Agendamentos do paciente.",
            "total": len(lista),
            "agendamentos": lista,
        }

    def listar_por_psicologo(
        self,
        psicologo_id,
    ):

        psicologo = self.psicologo_repository.get_by_id(psicologo_id)

        if not psicologo:
            raise HTTPException(status_code=404, detail="Psicólogo não encontrado.")

        lista = self.repository.get_by_psicologo(psicologo_id)

        return {
            "mensagem": "Agendamentos do psicólogo.",
            "total": len(lista),
            "agendamentos": lista,
        }

    def cancelar(
        self,
        agendamento_id,
    ):

        agendamento = self.repository.get_by_id(agendamento_id)

        if not agendamento:
            raise HTTPException(status_code=404, detail="Agendamento não encontrado.")

        if agendamento.status == "Cancelado":
            raise HTTPException(
                status_code=400, detail="Este agendamento já foi cancelado."
            )

        horario = self.horario_repository.get_by_id(agendamento.horario_id)

        self.horario_repository.marcar_disponivel(horario)

        agendamento.status = "Cancelado"

        self.repository.update()

        return {
            "mensagem": "Agendamento cancelado com sucesso.",
        }

    def concluir(
        self,
        agendamento_id,
    ):

        agendamento = self.repository.get_by_id(agendamento_id)

        if not agendamento:
            raise HTTPException(status_code=404, detail="Agendamento não encontrado.")

        if agendamento.status == "Concluído":
            raise HTTPException(
                status_code=400, detail="Este atendimento já foi concluído."
            )

        agendamento.status = "Concluído"

        self.repository.update()

        return {
            "mensagem": "Consulta concluída.",
        }

    def excluir(
        self,
        agendamento_id,
    ):

        agendamento = self.repository.get_by_id(agendamento_id)

        if not agendamento:
            raise HTTPException(status_code=404, detail="Agendamento não encontrado.")

        if agendamento.status == "Agendado":
            horario = self.horario_repository.get_by_id(agendamento.horario_id)

            self.horario_repository.marcar_disponivel(horario)

        self.repository.delete(agendamento)

        return {"mensagem": "Agendamento removido."}
