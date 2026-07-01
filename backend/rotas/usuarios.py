from fastapi import APIRouter, Depends

from core.dependencies import get_usuario_service

from services.usuario_service import UsuarioSelfService

from schema.usuario import (
    LoginRequest,
    CadastroRequest,
)

roteador = APIRouter(
    prefix="/usuarios",
    tags=["Usuários"],
)


# ===========================
# POST - Criar usuário
# ===========================
@roteador.post(
    "",
    status_code=201,
    # include_in_schema=False,
)
def criar_usuario(
    usuario: CadastroRequest,
    service: UsuarioSelfService = Depends(get_usuario_service),
    # include_in_schema=False,  # FLAG
):
    return service.criar_usuario(usuario)


# ===========================
# POST - Login
# ===========================
@roteador.post(
    "/login",
    # include_in_schema=False,
)
def login(
    dados: LoginRequest,
    service: UsuarioSelfService = Depends(get_usuario_service),
):
    return service.autenticar_usuario(
        dados.email,
        dados.senha,
    )


# ===========================
# GET - Listar usuários
# ===========================
@roteador.get(
    "",
    # include_in_schema=False
)
def listar_usuarios(
    service: UsuarioSelfService = Depends(get_usuario_service),
):
    return service.listar_usuarios()


# ===========================
# GET - Buscar usuário
# ===========================
@roteador.get(
    "/{usuario_id}",
    # include_in_schema=False
)
def buscar_usuario(
    usuario_id: int,
    service: UsuarioSelfService = Depends(get_usuario_service),
):
    return service.buscar_usuario(usuario_id)
