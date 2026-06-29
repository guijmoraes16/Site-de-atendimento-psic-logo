from datetime import datetime

from sqlalchemy import (
    Column,
    String,
    Integer,
)

from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class Usuario(Base):
    __tablename__ = "usuario"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, nullable=False, index=True)
    senha = Column(String(255), nullable=False)
    telefone = Column(String(100), nullable=False)
