from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from rotas.saude import roteador as saude_roteador
from rotas.auth import roteador as auth_roteador
from rotas.usuarios import roteador as usuario_roteador
from rotas.pacientes import roteador as pacientes_roteador

import models

# from rotas.appointments import roteador as appointments_roteador

# Inicializa a aplicação FastAPI
app = FastAPI()

app.include_router(saude_roteador)
app.include_router(auth_roteador)
app.include_router(usuario_roteador)
app.include_router(pacientes_roteador)
# app.include_router(appointments_roteador)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Define uma rota padrão (Root)
@app.get("/")
def root():
    return {
        "application": "MiniAPI",
        "version": "1.0.0",
        "docs": "/docs",
        "saude": "/saude",
        "saude_banco": "/saude/db",
    }
