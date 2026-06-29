from fastapi import FastAPI
from rotas.saude import roteador as saude_roteador
from rotas.auth import roteador as auth_roteador

# Inicializa a aplicação FastAPI
app = FastAPI()

app.include_router(saude_roteador)
app.include_router(auth_roteador)

# Define uma rota padrão (Root)
@app.get("/")
def root():
    return {
        "application": "MiniAPI",
        "version": "1.0.0",
        "docs": "/docs",
        "saude": "/saude",
        "saude_banco": "/saude/db"
    }