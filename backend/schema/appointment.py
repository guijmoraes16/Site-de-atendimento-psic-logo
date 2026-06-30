from datetime import date, time
from typing import Optional

from pydantic import BaseModel, EmailStr


class AppointmentCreate(BaseModel):
    nome: str
    email: EmailStr
    telefone: str
    servico: str
    data: date
    hora: time
    mensagem: Optional[str] = None
    status: Optional[str] = "Pendente"
