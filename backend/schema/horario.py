from datetime import date, time

from pydantic import BaseModel


class HorarioCreate(BaseModel):
    psicologo_id: int
    data: date
    hora: time


class HorarioUpdate(BaseModel):
    psicologo_id: int
    data: date
    hora: time
    disponivel: bool


class HorarioResponse(BaseModel):
    id: int
    psicologo_id: int
    data: date
    hora: time
    disponivel: bool

    class Config:
        from_attributes = True
