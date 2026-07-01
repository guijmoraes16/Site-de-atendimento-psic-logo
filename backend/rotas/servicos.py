from fastapi import APIRouter, Depends

from core.dependencies import get_servico_service

from services.servico_service import ServicoService

from schema.servico import (
    ServicoCreate,
    ServicoUpdate,
)

roteador = APIRouter(
    prefix="/servicos",
    tags=["Serviços"],
)


@roteador.post("", status_code=201)
def criar(
    dados: ServicoCreate,
    service: ServicoService = Depends(get_servico_service),
):
    return service.criar(dados)


@roteador.get("")
def listar(
    service: ServicoService = Depends(get_servico_service),
):
    return service.listar()


@roteador.get("/ativos")
def listar_ativos(
    service: ServicoService = Depends(get_servico_service),
):
    return service.listar_ativos()


@roteador.get("/buscar/{nome}")
def buscar_nome(
    nome: str,
    service: ServicoService = Depends(get_servico_service),
):
    return service.buscar_nome(nome)


@roteador.get("/{servico_id}")
def buscar(
    servico_id: int,
    service: ServicoService = Depends(get_servico_service),
):
    return service.buscar(servico_id)


@roteador.put("/{servico_id}")
def atualizar(
    servico_id: int,
    dados: ServicoUpdate,
    service: ServicoService = Depends(get_servico_service),
):
    return service.atualizar(servico_id, dados)


@roteador.delete("/{servico_id}")
def excluir(
    servico_id: int,
    service: ServicoService = Depends(get_servico_service),
):
    return service.excluir(servico_id)
