from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.database import get_banco

from core.dependencies import get_paciente_service
from services.paciente_service import PacienteService
from schema.paciente import (
    PacienteCreate,
    PacienteUpdate,
    PacienteResponse,
)

roteador = APIRouter(
    prefix="/pacientes",
    tags=["Pacientes"],
)


# ===========================
# POST - Cadastrar paciente
# ===========================
@roteador.post("", status_code=201)
def criar_paciente(
    paciente: PacienteCreate,
    service: PacienteService = Depends(get_paciente_service),
):
    return service.criar(paciente)


# ===========================
# GET - Listar pacientes
# ===========================
@roteador.get("")
def listar_pacientes(
    service: PacienteService = Depends(get_paciente_service),
):
    lista = service.listar()

    return {
        "mensagem": "Pacientes encontrados",
        "total": len(lista),
        "pacientes": lista,
    }


# ===========================
# GET - Buscar por ID
# ===========================
@roteador.get("/{paciente_id}")
def buscar_paciente(
    paciente_id: int,
    service: PacienteService = Depends(get_paciente_service),
):
    paciente = service.buscar(paciente_id)

    return {"mensagem": "Paciente encontrado.", "paciente": paciente}


# ===========================
# GET - Buscar por Nome
# ===========================
@roteador.get("/buscar/{nome}")
def buscar_por_nome(
    nome: str,
    service: PacienteService = Depends(get_paciente_service),
):
    return service.buscar_por_nome(nome)


# ===========================
# GET - Buscar por CPF
# ===========================
@roteador.get("/buscar/cpf/{cpf}")
def buscar_por_cpf(
    cpf: str,
    service: PacienteService = Depends(get_paciente_service),
):

    return service.buscar_por_cpf(cpf)


# ===========================
# PUT - Atualizar paciente
# ===========================
@roteador.put("/{paciente_id}")
def atualizar_paciente(
    paciente_id: int,
    paciente: PacienteUpdate,
    service: PacienteService = Depends(get_paciente_service),
):
    service.atualizar(
        paciente_id,
        paciente,
    )
    return {
        "mensagem": "Paciente atualizado com sucesso.",
    }


# ===========================
# DELETE - Excluir paciente
# ===========================
@roteador.delete("/{paciente_id}", status_code=200)
def excluir_paciente(
    paciente_id: int,
    service: PacienteService = Depends(get_paciente_service),
):
    service.excluir(paciente_id)

    return {"mensagem": "Paciente Removido com sucesso."}
