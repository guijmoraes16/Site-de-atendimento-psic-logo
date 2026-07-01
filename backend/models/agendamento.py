from datetime import datetime
from core.database import Base

from sqlalchemy import (
    Column,
    String,
    Integer,
    Text,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import relationship


class Agendamento(Base):
    __tablename__ = "agendamentos"

    id = Column(Integer, primary_key=True, index=True)

    paciente_id = Column(
        Integer,
        ForeignKey("pacientes.id"),
        nullable=False,
    )

    psicologo_id = Column(
        Integer,
        ForeignKey("psicologos.id"),
        nullable=False,
    )

    servico_id = Column(
        Integer,
        ForeignKey("servicos.id"),
        nullable=False,
    )

    horario_id = Column(
        Integer,
        ForeignKey("horarios_disponiveis.id"),
        nullable=False,
    )
    mensagem = Column(Text)

    status = Column(String(20), default="Agendado")

    criado_em = Column(DateTime, default=datetime.utcnow)

    paciente = relationship(
        "Paciente",
        back_populates="consultas",
    )

    psicologo = relationship(
        "Psicologo",
        back_populates="consultas",
    )

    servico = relationship(
        "Servico",
        back_populates="consultas",
    )

    horario = relationship(
        "HorarioDisponivel",
        back_populates="agendamento",
    )
