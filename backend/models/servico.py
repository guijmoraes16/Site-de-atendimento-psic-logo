from core.database import Base

from sqlalchemy import (
    Column,
    String,
    Integer,
    Text,
    Boolean,
    Numeric,
)
from sqlalchemy.orm import relationship


class Servico(Base):
    __tablename__ = "servicos"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    descricao = Column(Text)
    valor = Column(Numeric(10, 2), nullable=False)
    duracao = Column(Integer, nullable=False)
    modalidade = Column(String(30), nullable=False)
    ativo = Column(Boolean, default=True)

    consultas = relationship(
        "Agendamento",
        back_populates="servico",
        cascade="all, delete-orphan",
    )
