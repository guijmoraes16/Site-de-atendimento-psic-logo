from fastapi import APIRouter, Depends

from core.dependencies import get_agendamento_service

from services.agendamento_service import AgendamentoService

from schema.agendamento import (
    AgendamentoCreate,
)

roteador = APIRouter(
    prefix="/agendamentos",
    tags=["Agendamentos"],
)


@roteador.post("", status_code=201)
def criar(
    dados: AgendamentoCreate,
    service: AgendamentoService = Depends(get_agendamento_service),
):
    return service.criar(dados)


@roteador.get("")
def listar(
    service: AgendamentoService = Depends(get_agendamento_service),
):
    return service.listar()


@roteador.get("/paciente/{paciente_id}")
def listar_paciente(
    paciente_id: int,
    service: AgendamentoService = Depends(get_agendamento_service),
):
    return service.listar_por_paciente(paciente_id)


@roteador.get("/psicologo/{psicologo_id}")
def listar_psicologo(
    psicologo_id: int,
    service: AgendamentoService = Depends(get_agendamento_service),
):
    return service.listar_por_psicologo(psicologo_id)


@roteador.patch("/{agendamento_id}/cancelar")
def cancelar(
    agendamento_id: int,
    service: AgendamentoService = Depends(get_agendamento_service),
):
    return service.cancelar(agendamento_id)


@roteador.patch("/{agendamento_id}/concluir")
def concluir(
    agendamento_id: int,
    service: AgendamentoService = Depends(get_agendamento_service),
):
    return service.concluir(agendamento_id)


@roteador.get("/{agendamento_id}")
def buscar(
    agendamento_id: int,
    service: AgendamentoService = Depends(get_agendamento_service),
):
    return service.buscar(agendamento_id)


@roteador.delete("/{agendamento_id}")
def excluir(
    agendamento_id: int,
    service: AgendamentoService = Depends(get_agendamento_service),
):
    return service.excluir(agendamento_id)
