from sqlalchemy.orm import Session

from models.agendamento import Agendamento


class AgendamentoRepository:
    def __init__(self, db: Session):
        self.db = db

    # ======================
    # CREATE
    # ======================

    def create(self, agendamento: Agendamento):

        self.db.add(agendamento)
        self.db.commit()
        self.db.refresh(agendamento)

        return agendamento

    # ======================
    # LISTAR
    # ======================

    def get_all(self):

        return self.db.query(Agendamento).order_by(Agendamento.id.desc()).all()

    # ======================
    # BUSCAR
    # ======================

    def get_by_id(self, agendamento_id):

        return (
            self.db.query(Agendamento).filter(Agendamento.id == agendamento_id).first()
        )

    # ======================
    # PACIENTE
    # ======================

    def get_by_paciente(
        self,
        paciente_id,
    ):

        return (
            self.db.query(Agendamento)
            .filter(Agendamento.paciente_id == paciente_id)
            .all()
        )

    # ======================
    # PSICÓLOGO
    # ======================

    def get_by_psicologo(
        self,
        psicologo_id,
    ):

        return (
            self.db.query(Agendamento)
            .filter(Agendamento.psicologo_id == psicologo_id)
            .all()
        )

    # ======================
    # UPDATE
    # ======================

    def update(self):

        self.db.commit()

    # ======================
    # DELETE
    # ======================

    def delete(
        self,
        agendamento,
    ):

        self.db.delete(agendamento)
        self.db.commit()
