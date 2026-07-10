# 🧠 Sistema de Atendimento de Psicologia

Este projeto é um sistema web para gestão de uma clínica de psicologia, com foco no cadastro e organização de pacientes, psicólogos, serviços, horários e agendamentos. A aplicação possui uma API em FastAPI no backend e uma interface web no frontend, permitindo o gerenciamento completo do atendimento.

![alt text](imagens/image.png)

aqui você faz o login para acessar a pagina do administrador

![alt text](imagens/image2.png)

## ✅ Funcionalidades

- Autenticação de usuários com JWT
- Cadastro, listagem, atualização e exclusão de pacientes
- Cadastro e gestão de psicólogos
- Cadastro de serviços oferecidos pela clínica
- Gerenciamento de horários disponíveis
- Criação e controle de agendamentos de consultas
- Interface web para navegação e uso do sistema

## 🛠️ Tecnologias utilizadas

- Python 3.x
- FastAPI
- SQLAlchemy
- Pydantic
- JWT para autenticação
- PostgreSQL
- HTML, CSS e JavaScript

## 📁 Estrutura do projeto

```text
Site-de-atendimento-psic-logo/
├── backend/
│   ├── core/           # Configurações, autenticação e banco
│   ├── models/         # Modelos do banco de dados
│   ├── repositories/   # Regras de acesso aos dados
│   ├── rotas/          # Endpoints da API
│   ├── schema/         # Schemas do FastAPI
│   ├── services/       # Lógica de negócio
│   └── main.py         # Aplicação principal
├── frontend/
│   ├── css/            # Estilos da interface
│   ├── js/             # Scripts da aplicação
│   └── *.html          # Páginas do sistema
└── README.md
```

## 🚀 Como executar o projeto localmente

### 1. Pré-requisitos

- Python 3.10 ou superior
- PostgreSQL instalado e rodando
- pip

### 2. Clone o repositório

```bash
https://github.com/guijmoraes16/Site-de-atendimento-psic-logo.git
```

### 3. Crie um ambiente virtual

```bash
conda activate projeto
```

### 4. Instale as dependências do backend

```bash
cd backend
pip install -r requirements.txt
```

### 5. Configure as variáveis de ambiente

Crie um arquivo chamado `.env` dentro da pasta `backend` com as seguintes variáveis:

```env
DATABASE_URL=postgresql://seu_usuario:suasenha@localhost:5432/seu_banco
SECRET_KEY=sua_chave_secreta
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
API_TITLE=Sistema de Atendimento Psicologia
API_VERSION=1.0.0
```

### 6. Crie o banco de dados

Use o arquivo SQL disponível na pasta `backend` para criar as tabelas necessárias.

### 7. Inicie o backend

```bash
cd backend
uvicorn main:app --reload 
```

### 8. Acesse a aplicação

- API principal: http://localhost:8000
- Documentação Swagger: http://localhost:8000/docs
- Frontend: abra os arquivos HTML na pasta `frontend` ou use uma extensão como Live Server

## 📡 Principais rotas da API

- `/auth/login`
- `/auth/cadastro`
- `/pacientes`
- `/psicologos`
- `/servicos`
- `/horarios`
- `/agendamentos`

## 📝 Observações

- O frontend é construído com HTML, CSS e JavaScript puro, sem necessidade de build.
- O backend segue uma estrutura organizada em camadas, com rotas, schemas, serviços e modelos.
- O projeto está em desenvolvimento e pode receber novas funcionalidades no futuro.

## 👨‍💻 Autor

Projeto desenvolvido como parte de um sistema de gestão para clínica de psicologia.


Essa página vai ser um painel administrativo do sistema, onde o administrador consegue acompanhar e controlar as principais áreas do atendimento. Em resumo, ela funciona como um centro de gestão para organizar pacientes, psicólogos, serviços, horários e consultas de forma centralizada e prática.

![alt text](imagens/image-1.png)
