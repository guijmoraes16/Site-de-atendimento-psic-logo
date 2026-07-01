from datetime import date
from typing import Optional

from pydantic import BaseModel, EmailStr


class PacienteCreate(BaseModel):
    nome: str
    email: EmailStr
    telefone: str
    cpf: str
    data_nascimento: date
    endereco: Optional[str] = None
    observacoes: Optional[str] = None


class PacienteUpdate(BaseModel):
    nome: str
    email: EmailStr
    telefone: str
    cpf: str
    data_nascimento: date
    endereco: Optional[str] = None
    observacoes: Optional[str] = None


class PacienteResponse(BaseModel):
    id: int
    nome: str
    email: EmailStr
    telefone: str
    cpf: str
    data_nascimento: date
    endereco: Optional[str]
    observacoes: Optional[str]

    class Config:
        from_attributes = True
