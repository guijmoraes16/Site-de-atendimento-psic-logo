Etapa 1
Login
Cadastro
Autenticação
Armazenamento do token
Etapa 2

Dashboard

Quantidade de pacientes
Psicólogos
Serviços
Agendamentos
Próximos atendimentos
Etapa 3

CRUD de Pacientes

listar
cadastrar
editar
excluir
pesquisar
Etapa 4

CRUD de Psicólogos

Etapa 5

CRUD de Serviços

Etapa 6

CRUD de Horários

Etapa 7

CRUD de Agendamentos

criar
cancelar
concluir
Etapa 8

Polimento visual

responsividade
animações
loading
mensagens
confirmações
dashboard mais bonito

```
css/
    main.css
    dashboard.css
    login.css
    pacientes.css
    psicologos.css
    servicos.css
    horarios.css
    agendamentos.css

js/
    services/
        api.js
        auth.js
        pacienteService.js
        psicologoService.js
        servicoService.js
        horarioService.js
        agendamentoService.js

    pages/
        login.js
        dashboard.js
        pacientes.js
        paciente-form.js
        psicologos.js
        psicologo-form.js
        servicos.js
        horarios.js
        agendamentos.js

assets/

inicio.html
login.html
pacientes.html
paciente-form.html
...
```

Etapa 1

Eu dividiria exatamente assim:

Parte 1
Estrutura do projeto
api.js
auth.js
utils.js
Parte 2

Criar a tela de Login.

Parte 3

Implementar o Login.

Parte 4

Criar a tela de Cadastro.

Parte 5

Implementar o Cadastro.

Parte 6

Implementar proteção das páginas.

Parte 7

Implementar Logout.

```html
<body>

<div class="layout">

    <aside class="sidebar">

        ...

    </aside>

    <div class="content">

        <header class="navbar">

            ...

        </header>

        <main class="main">

            ...

        </main>

    </div>

</div>

</body>
```