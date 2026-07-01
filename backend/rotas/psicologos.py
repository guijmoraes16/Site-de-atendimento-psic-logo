from fastapi import APIRouter, Depends

from core.dependencies import get_psicologo_service

from services.psicologo_service import PsicologoService

from schema.psicologo import (
    PsicologoCreate,
    PsicologoUpdate,
)

roteador = APIRouter(
    prefix="/psicologos",
    tags=["Psicólogos"],
)


@roteador.post("", status_code=201)
def criar(
    dados: PsicologoCreate,
    service: PsicologoService = Depends(get_psicologo_service),
):
    return service.criar(dados)


@roteador.get("")
def listar(
    service: PsicologoService = Depends(get_psicologo_service),
):
    return service.listar()


@roteador.get("/ativos")
def listar_ativos(
    service: PsicologoService = Depends(get_psicologo_service),
):
    return service.listar_ativos()


@roteador.get("/buscar/{nome}")
def buscar_nome(
    nome: str,
    service: PsicologoService = Depends(get_psicologo_service),
):
    return service.buscar_nome(nome)


@roteador.get("/{psicologo_id}")
def buscar(
    psicologo_id: int,
    service: PsicologoService = Depends(get_psicologo_service),
):
    return service.buscar(psicologo_id)


@roteador.put("/{psicologo_id}")
def atualizar(
    psicologo_id: int,
    dados: PsicologoUpdate,
    service: PsicologoService = Depends(get_psicologo_service),
):
    return service.atualizar(
        psicologo_id,
        dados,
    )


@roteador.delete("/{psicologo_id}")
def excluir(
    psicologo_id: int,
    service: PsicologoService = Depends(get_psicologo_service),
):
    return service.excluir(psicologo_id)
