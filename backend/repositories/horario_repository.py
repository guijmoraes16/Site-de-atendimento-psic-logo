from datetime import date, time

from sqlalchemy.orm import Session

from models.horario_disponivel import HorarioDisponivel
from models.agendamento import Agendamento


class HorarioRepository:
    def __init__(self, db: Session):
        self.db = db

    # ==========================
    # CREATE
    # ==========================
    def create(self, horario: HorarioDisponivel):
        self.db.add(horario)
        self.db.commit()
        self.db.refresh(horario)
        return horario

    # ==========================
    # GET ALL
    # ==========================
    def get_all(self):
        return (
            self.db.query(HorarioDisponivel)
            .order_by(
                HorarioDisponivel.data,
                HorarioDisponivel.hora,
            )
            .all()
        )

    # ==========================
    # GET BY ID
    # ==========================
    def get_by_id(self, horario_id: int):
        return (
            self.db.query(HorarioDisponivel)
            .filter(HorarioDisponivel.id == horario_id)
            .first()
        )

    # ==========================
    # HORÁRIOS DISPONÍVEIS
    # ==========================
    def get_disponiveis(self):
        return (
            self.db.query(HorarioDisponivel)
            .filter(HorarioDisponivel.disponivel)
            .order_by(
                HorarioDisponivel.data,
                HorarioDisponivel.hora,
            )
            .all()
        )

    # ==========================
    # HORÁRIOS DO PSICÓLOGO
    # ==========================
    def get_by_psicologo(self, psicologo_id: int):
        return (
            self.db.query(HorarioDisponivel)
            .filter(HorarioDisponivel.psicologo_id == psicologo_id)
            .order_by(
                HorarioDisponivel.data,
                HorarioDisponivel.hora,
            )
            .all()
        )

    # ==========================
    # VERIFICAR DUPLICIDADE
    # ==========================
    def get_by_data_hora(
        self,
        psicologo_id: int,
        data: date,
        hora: time,
    ):
        return (
            self.db.query(HorarioDisponivel)
            .filter(
                HorarioDisponivel.psicologo_id == psicologo_id,
                HorarioDisponivel.data == data,
                HorarioDisponivel.hora == hora,
            )
            .first()
        )

    # ==========================
    # UPDATE
    # ==========================
    def update(self):
        self.db.commit()

    # ==========================
    # DELETE
    # ==========================
    def delete(self, horario):
        self.db.delete(horario)
        self.db.commit()

    def marcar_indisponivel(self, horario):
        horario.disponivel = False
        self.db.commit()

    def marcar_disponivel(self, horario):
        horario.disponivel = True
        self.db.commit()

    def possui_agendamento(self, horario_id: int):
        return (
            self.db.query(Agendamento)
            .filter(Agendamento.horario_id == horario_id)
            .first()
        )
