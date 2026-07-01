from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, Field


class ServicoCreate(BaseModel):
    nome: str
    descricao: Optional[str] = None
    valor: Decimal = Field(gt=0)
    duracao: int = Field(ge=15)
    modalidade: str
    ativo: bool = True


class ServicoUpdate(BaseModel):
    nome: str
    descricao: Optional[str] = None
    valor: Decimal = Field(gt=0)
    duracao: int = Field(ge=15)
    modalidade: str
    ativo: bool


class ServicoResponse(BaseModel):
    id: int
    nome: str
    descricao: Optional[str]
    valor: Decimal
    duracao: int
    modalidade: str
    ativo: bool

    class Config:
        from_attributes = True
