from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from core.auth import criar_token, hash_senha
from core.database import get_banco
from schema.usuario import LoginRequest, CadastroRequest
from models.usuarios import Usuario

roteador = APIRouter(prefix="/auth", tags=["auth"])


class RegistroRequest(BaseModel):
    nome: str
    email: EmailStr
    senha: str


@roteador.post("/login")
def login(dados: LoginRequest, db: Session = Depends(get_banco)):
    usuario = db.query(Usuario).filter(Usuario.email == dados.email).first()
    if not usuario or usuario.senha != hash_senha(dados.senha):
        raise HTTPException(status_code=401, detail="Email ou senha inválidos")

    return {"access_token": criar_token(usuario.id), "token_type": "bearer"}


@roteador.post("/registro")
def registro(dados: RegistroRequest, db: Session = Depends(get_banco)):
    existente = db.query(Usuario).filter(Usuario.email == dados.email).first()
    if existente:
        raise HTTPException(status_code=400, detail="Usuário já existe")

    novo_usuario = Usuario(
        nome=dados.nome,
        email=dados.email,
        senha=hash_senha(dados.senha),
    )
    db.add(novo_usuario)
    db.commit()
    db.refresh(novo_usuario)

    return {
        "id": novo_usuario.id,
        "email": novo_usuario.email,
        "nome": novo_usuario.nome,
    }
