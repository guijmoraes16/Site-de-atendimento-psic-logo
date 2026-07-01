from core.database import Base

from sqlalchemy import (
    Column,
    String,
    Integer,
    Text,
    Boolean,
)
from sqlalchemy.orm import relationship


class Psicologo(Base):
    __tablename__ = "psicologos"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(120), nullable=False)
    titulo = Column(String(120), nullable=False)
    bio = Column(Text, nullable=False)
    foto = Column(String(255), nullable=True)
    ativo = Column(Boolean, default=True)

    consultas = relationship(
        "Agendamento",
        back_populates="psicologo",
        cascade="all, delete-orphan",
    )

    horarios = relationship(
        "HorarioDisponivel",
        back_populates="psicologo",
        cascade="all, delete-orphan",
    )
