from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.database import get_banco

from repositories.paciente_repository import PacienteRepository
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
    db: Session = Depends(get_banco),
):
    repository = PacienteRepository(db)
    service = PacienteService(repository)

    return service.criar(paciente)


# ===========================
# GET - Listar pacientes
# ===========================
@roteador.get("")
def listar_pacientes(
    db: Session = Depends(get_banco),
):
    repository = PacienteRepository(db)
    service = PacienteService(repository)
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
    db: Session = Depends(get_banco),
):
    repository = PacienteRepository(db)
    service = PacienteService(repository)
    paciente = service.buscar(paciente_id)

    return {"mensagem": "Paciente encontrado.", "paciente": paciente}


# ===========================
# GET - Buscar por Nome
# ===========================
@roteador.get("/buscar/{nome}")
def buscar_por_nome(
    nome: str,
    db: Session = Depends(get_banco),
):
    service = PacienteService(PacienteRepository(db))

    return service.buscar_por_nome(nome)


# ===========================
# GET - Buscar por CPF
# ===========================
@roteador.get("/buscar/cpf/{cpf}")
def buscar_por_cpf(
    cpf: str,
    db: Session = Depends(get_banco),
):
    service = PacienteService(PacienteRepository(db))

    return service.buscar_por_cpf(cpf)


# ===========================
# PUT - Atualizar paciente
# ===========================
@roteador.put("/{paciente_id}")
def atualizar_paciente(
    paciente_id: int,
    paciente: PacienteUpdate,
    db: Session = Depends(get_banco),
):
    repository = PacienteRepository(db)
    service = PacienteService(repository)
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
    db: Session = Depends(get_banco),
):
    repository = PacienteRepository(db)
    service = PacienteService(repository)
    service.excluir(paciente_id)

    return {"mensagem": "Paciente Removido com sucesso."}
