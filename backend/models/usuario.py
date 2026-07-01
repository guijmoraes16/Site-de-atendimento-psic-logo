from core.database import Base


from sqlalchemy import (
    Column,
    String,
    Integer,
)


class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    senha = Column(String(255), nullable=False)
    telefone = Column(String(255), nullable=True)
