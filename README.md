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
