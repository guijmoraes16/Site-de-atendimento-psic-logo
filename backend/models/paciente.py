from datetime import datetime

from sqlalchemy import (
    Column,
    String,
    Integer,
    DateTime,
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class Paciente(Base):
    __tablename__ = "pacientes"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(120), nullable=False)
    email = Column(String(120), nullable=False)
    telefone = Column(String(20), nullable=False)
    criado_em = Column(DateTime, default=datetime.utcnow)

    consultas = relationship(
        "Agendamento",
        back_populates="paciente",
        cascade="all, delete-orphan",
    )