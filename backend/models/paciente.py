from datetime import datetime
from core.database import Base

from sqlalchemy import (
    Column,
    String,
    Integer,
    Date,
    DateTime,
    Text,
)
from sqlalchemy.orm import relationship


class Paciente(Base):
    __tablename__ = "pacientes"

    id = Column(Integer, primary_key=True, index=True)

    nome = Column(String(120), nullable=False)

    email = Column(String(120), nullable=False, unique=True)

    telefone = Column(String(20), nullable=False)

    cpf = Column(String(14), nullable=False, unique=True)

    data_nascimento = Column(Date, nullable=False)

    endereco = Column(String(255), nullable=True)

    observacoes = Column(Text, nullable=True)

    criado_em = Column(DateTime, default=datetime.utcnow)

    consultas = relationship(
        "Agendamento",
        back_populates="paciente",
        cascade="all, delete-orphan",
    )
