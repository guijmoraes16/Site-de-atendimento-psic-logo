from typing import Optional

from pydantic import BaseModel


class PsicologoCreate(BaseModel):
    nome: str
    titulo: str
    bio: str
    foto: Optional[str] = None
    ativo: bool = True


class PsicologoUpdate(BaseModel):
    nome: str
    titulo: str
    bio: str
    foto: Optional[str] = None
    ativo: bool


class PsicologoResponse(BaseModel):
    id: int
    nome: str
    titulo: str
    bio: str
    foto: Optional[str]
    ativo: bool

    class Config:
        from_attributes = True
