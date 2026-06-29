from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    senha: str


class CadastroRequest(BaseModel):
    nome: str
    email: EmailStr
    senha: str
    telefone: str
