from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.database import get_banco

from repositories.usuario_repository import UsuarioRepository
from services.usuario_service import UsuarioSelfService
from schema.usuario_schema import UsuarioCreate
from schema.login_schema import LoginRequest

roteador = APIRouter(
    prefix="/usuarios",
    tags=["Usuários"],
)


# POST - Criar usuário
@roteador.post("", status_code=201)
def criar_usuario(usuario: UsuarioCreate, db: Session = Depends(get_banco)):
    repository = UsuarioRepository(db)
    service = UsuarioSelfService(repository)

    return service.criar_usuario(usuario)


@roteador.post("/login")
def login(dados: LoginRequest, db: Session = Depends(get_banco)):
    repositorio = UsuarioRepository(db)
    service = UsuarioSelfService(repositorio)

    return service.autenticar_usuario(dados.email, dados.senha)


# GET - Listar usuários
@roteador.get("")
def listar_usuarios(db: Session = Depends(get_banco)):
    repository = UsuarioRepository(db)
    service = UsuarioSelfService(repository)

    return service.listar_usuarios()


@roteador.get("/{usuario_id}")
def listar_usuario_unico(usuario_id: int, db: Session = Depends(get_banco)):
    repository = UsuarioRepository(db)
    service = UsuarioSelfService(repository)

    return service.buscar_usuarios(usuario_id)