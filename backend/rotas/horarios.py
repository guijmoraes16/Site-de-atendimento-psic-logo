from fastapi import APIRouter, Depends

from core.dependencies import get_horario_service

from services.horario_service import HorarioService

from schema.horario import (
    HorarioCreate,
    HorarioUpdate,
)

roteador = APIRouter(
    prefix="/horarios",
    tags=["Horários"],
)


@roteador.post("", status_code=201)
def criar(
    dados: HorarioCreate,
    service: HorarioService = Depends(get_horario_service),
):
    return service.criar(dados)


@roteador.get("")
def listar(
    service: HorarioService = Depends(get_horario_service),
):
    return service.listar()


@roteador.get("/disponiveis")
def listar_disponiveis(
    service: HorarioService = Depends(get_horario_service),
):
    return service.listar_disponiveis()


@roteador.get("/psicologo/{psicologo_id}")
def listar_psicologo(
    psicologo_id: int,
    service: HorarioService = Depends(get_horario_service),
):
    return service.listar_por_psicologo(psicologo_id)


@roteador.get("/{horario_id}")
def buscar(
    horario_id: int,
    service: HorarioService = Depends(get_horario_service),
):
    return service.buscar(horario_id)


@roteador.put("/{horario_id}")
def atualizar(
    horario_id: int,
    dados: HorarioUpdate,
    service: HorarioService = Depends(get_horario_service),
):
    return service.atualizar(
        horario_id,
        dados,
    )


@roteador.delete("/{horario_id}")
def excluir(
    horario_id: int,
    service: HorarioService = Depends(get_horario_service),
):
    return service.excluir(horario_id)
