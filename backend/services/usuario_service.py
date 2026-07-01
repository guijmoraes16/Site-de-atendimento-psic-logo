from fastapi import HTTPException
from models.usuario import Usuario
from repositories.usuario_repository import UsuarioRepository
from core.seguranca import gerar_hash, verificar_senha
from core.jwt import criar_token


class UsuarioSelfService:
    def __init__(self, repository: UsuarioRepository):
        self.repository = repository

    def criar_usuario(self, dados):
        usuario_existe = self.repository.get_by_email(dados.email)
        if usuario_existe:
            raise HTTPException(status_code=400, detail="Usuário já cadastrado")

        senha_hash = gerar_hash(dados.senha)

        usuario = Usuario(
            nome=dados.nome,
            email=dados.email,
            senha=senha_hash,
            telefone=dados.telefone,
        )
        usuario = self.repository.create(usuario)
        return {
            "Mensagem": "Usuário criado com sucesso",
            "objeto": {
                "id": usuario.id,
                "nome": usuario.nome,
                "email": usuario.email,
                "telefone": usuario.telefone,
            },
        }

    def listar_usuarios(self):
        lista = self.repository.get_all()
        return {
            "mensagem": "usuarios encontrados",
            "total": len(lista),
            "objetos": lista,
        }

    def buscar_usuario(self, usuario_id: int):
        usuario = self.repository.get_by_id(usuario_id)

        if not usuario:
            raise HTTPException(status_code=404, detail="Usuário não encontrado")
        return {
            "mensagem": "Usuário encontrado",
            "objeto": {"id": usuario.id, "nome": usuario.nome, "email": usuario.email},
        }

    def autenticar_usuario(self, email: str, senha: str):
        usuario = self.repository.get_by_email(email)
        if not usuario:
            raise HTTPException(
                status_code=401,
                detail="Credenciais inválidas",
            )
        senha_valida = verificar_senha(senha, usuario.senha)
        if not senha_valida:
            raise HTTPException(
                status_code=401,
                detail="Credenciais inválidas",
            )
        token = criar_token(
            {
                "sub": str(usuario.id),
                "email": usuario.email,
            }
        )
        return {"access_token": token, "token_type": "bearer"}
