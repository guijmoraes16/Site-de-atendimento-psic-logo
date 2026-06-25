# 🧠 Sistema de Agendamento para Psicologia Online

Este é um projeto simples de um sistema web para agendamento de consultas psicológicas online. Ele permite que usuários realizem agendamentos e visualizem consultas já marcadas.

---

## 🚀 Funcionalidades

* Agendamento de consultas online
* Listagem de consultas agendadas
* Interface simples e intuitiva
* Backend básico com API REST

---

## 🛠️ Tecnologias utilizadas

* Node.js
* HTML5
* CSS3
* JavaScript (Vanilla)

---

## 📁 Estrutura do projeto

```
psico-agendamento/
│
├── server.js
├── package.json
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
```

---

## ⚙️ Como executar o projeto

### 1. Clone o repositório

```
git clone https://github.com/seu-usuario/psico-agendamento.git
```

### 2. Acesse a pasta do projeto

```
cd psico-agendamento
```

### 3. Instale as dependências

```
npm install
```

### 4. Inicie o servidor

```
node server.js
```

---

## 🌐 Acesse no navegador

```
http://localhost:3000
```

---

## 📌 Endpoints da API

### ➤ Criar agendamento

* **POST** `/agendar`

**Body:**

```
{
  "nome": "João",
  "email": "joao@email.com",
  "data": "2026-05-10",
  "horario": "14:00"
}
```

---

### ➤ Listar agendamentos

* **GET** `/agendamentos`

---

## ⚠️ Observações

* Os dados são armazenados em memória (não persistem após reiniciar o servidor)
* Projeto voltado para fins educacionais

---

## 🔮 Melhorias futuras

* Integração com banco de dados (MongoDB, PostgreSQL)
* Sistema de autenticação (login)
* Integração com pagamentos (Pix, cartão)
* Notificações por email ou WhatsApp
* Agenda com horários disponíveis
* Painel administrativo

---

## 📄 Licença

Este projeto está sob a licença MIT. Sinta-se livre para usar e modificar.

---

## 👨‍💻 Autor

Desenvolvido para fins de estudo e prototipagem.

```
Site-de-atendimento-psic-logo
├─ Frontend
│  ├─ admin.html
│  ├─ agendar.html
│  ├─ css
│  │  └─ style.css
│  ├─ index.html
│  └─ js
│     ├─ admin.js
│     └─ script.js
└─ README.md

```

## Backend & Banco de Dados (SQLite)

Este projeto inclui um backend mínimo em Flask que recebe agendamentos e os grava no banco SQLite usado pelo DBeaver.

Passos para rodar localmente (Windows, usando o venv `ambientepsico` criado no projeto):

1. Ative o venv (PowerShell):
```
.\ambientepsico\Scripts\Activate.ps1
```

2. Instale dependências:
```
pip install -r requirements.txt
```

3. Gerar o banco e popular dados de exemplo:
```
python scripts\seed_data.py
```

4. Iniciar o backend Flask:
```
python backend\app.py
```

O backend ficará disponível em `http://127.0.0.1:8000` e expõe o endpoint `POST /appointments`.

Frontend: o formulário de agendamento em `Frontend/js/script.js` já envia o JSON para `http://127.0.0.1:8000/appointments`.

Conectar no DBeaver: crie uma conexão `SQLite` apontando para o arquivo `dbeaver.db` no diretório do projeto.
