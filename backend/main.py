from fastapi import FastAPI

# Inicializa a aplicação FastAPI
app = FastAPI()

# Define uma rota padrão (Root)
@app.get("/")
def read_root():
    return {"mensagem": "API FUNFANDO"}