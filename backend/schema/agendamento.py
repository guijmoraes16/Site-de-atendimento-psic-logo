from typing import Optional

from pydantic import BaseModel


class AgendamentoCreate(BaseModel):
    paciente_id: int
    psicologo_id: int
    servico_id: int
    horario_id: int
    mensagem: Optional[str] = None


class AgendamentoUpdate(BaseModel):
    mensagem: Optional[str] = None
    status: str


class AgendamentoResponse(BaseModel):
    id: int
    paciente_id: int
    psicologo_id: int
    servico_id: int
    horario_id: int
    mensagem: Optional[str]
    status: str

    class Config:
        from_attributes = True
