from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from core.jwt import criar_token
from core.seguranca import gerar_hash, verificar_senha
from core.database import get_banco
from schema.usuario import LoginRequest, CadastroRequest
from models.usuario import Usuario

roteador = APIRouter(prefix="/auth", tags=["Auth"])


@roteador.post(
    "/login",
    # include_in_schema=False,
)
def login(dados: LoginRequest, db: Session = Depends(get_banco)):
    usuario = db.query(Usuario).filter(Usuario.email == dados.email).first()
    print(usuario.senha)
    print(gerar_hash(dados.senha))
    print(dados.senha)
    if not usuario or not verificar_senha(dados.senha, usuario.senha):
        raise HTTPException(status_code=401, detail="Email ou senha inválidos")

    return {
        "access_token": criar_token({"sub": str(usuario.id)}),
        "token_type": "bearer",
    }


@roteador.post(
    "/cadastro",
    # include_in_schema=False
)
def registro(dados: CadastroRequest, db: Session = Depends(get_banco)):
    existente = db.query(Usuario).filter(Usuario.email == dados.email).first()
    if existente:
        raise HTTPException(status_code=400, detail="Usuário já existe")

    novo_usuario = Usuario(
        nome=dados.nome,
        email=dados.email,
        senha=gerar_hash(dados.senha),
        telefone=dados.telefone,
    )
    db.add(novo_usuario)
    db.commit()
    db.refresh(novo_usuario)

    return {
        "id": novo_usuario.id,
        "email": novo_usuario.email,
        "nome": novo_usuario.nome,
        "telefone": novo_usuario.telefone,
    }
