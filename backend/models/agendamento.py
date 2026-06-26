
from datetime import datetime

from sqlalchemy import (
    Column,
    String,
    Integer,
    Date,
    Time,
    Text,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

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
        nullable=True,
    )

    servico_id = Column(
        Integer,
        ForeignKey("servicos.id"),
        nullable=False,
    )

    data = Column(Date, nullable=False)
    hora = Column(Time, nullable=False)
    mensagem = Column(Text)
    status = Column(String(20), default="Pendente")
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
