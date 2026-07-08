document.addEventListener("DOMContentLoaded", inicializar);

document.getElementById("btnPesquisar").addEventListener("click", pesquisar);
document.getElementById("pesquisa").addEventListener("input", pesquisar);

let agendamentos = [];

async function inicializar() {
  Auth.verificarAutenticacao();

  carregarUsuario();

  await carregarConsultas();
}

async function carregarConsultas() {
  try {
    const resposta = await ConsultaService.listar();

    agendamentos = resposta.agendamentos;

    renderizarTabela(agendamentos);
  } catch (erro) {
    alert(erro.message);
  }
}

function renderizarTabela(consultas) {
  const tabela = document.querySelector("#tabelaConsultas tbody");

  tabela.innerHTML = "";

  consultas.forEach((consulta) => {
    tabela.innerHTML += `
      <tr>

        <td>${consulta.paciente}</td>

        <td>${consulta.psicologo}</td>

        <td>${consulta.servico}</td>

        <td>

            ${formatarData(consulta.data)}

            <br>

            <small>${consulta.hora.substring(0, 5)}</small>

        </td>

        <td>

            ${badgeStatus(consulta.status)}

        </td>

        <td>

            <button
                class="btn btn-success btn-sm"
                title="Concluir"
                onclick="concluirConsulta(${consulta.id})">

                <i class="bi bi-check-lg"></i>

            </button>

            <button
                class="btn btn-warning btn-sm"
                title="Cancelar"
                onclick="cancelarConsulta(${consulta.id})">

                <i class="bi bi-x-lg"></i>

            </button>

            <button
                class="btn btn-danger btn-sm"
                title="Excluir"
                onclick="excluirConsulta(${consulta.id})">

                <i class="bi bi-trash"></i>

            </button>

        </td>

      </tr>
    `;
  });
}

async function concluirConsulta(id) {
  if (!confirm("Deseja concluir esta consulta?")) return;

  try {
    await ConsultaService.concluir(id);

    carregarConsultas();
  } catch (erro) {
    alert(erro.message);
  }
}

async function cancelarConsulta(id) {
  if (!confirm("Deseja cancelar esta consulta?")) return;

  try {
    await ConsultaService.cancelar(id);

    carregarConsultas();
  } catch (erro) {
    alert(erro.message);
  }
}

async function excluirConsulta(id) {
  if (!confirm("Deseja excluir esta consulta?")) return;

  try {
    await ConsultaService.excluir(id);

    carregarConsultas();
  } catch (erro) {
    alert(erro.message);
  }
}

function badgeStatus(status) {
  switch (status) {
    case "Agendado":
      return `<span class="badge badge-primary">${status}</span>`;

    case "Concluido":
      return `<span class="badge badge-success">${status}</span>`;

    case "Cancelado":
      return `<span class="badge badge-danger">${status}</span>`;

    default:
      return `<span class="badge">${status}</span>`;
  }
}

function pesquisar() {
  const texto = document.getElementById("pesquisa").value.toLowerCase();

  if (!texto) {
    renderizarTabela(agendamentos);

    return;
  }

  const filtrados = agendamentos.filter((c) =>
    c.paciente.toLowerCase().includes(texto)
  );

  renderizarTabela(filtrados);
}

function formatarData(data) {
  return new Date(data).toLocaleDateString("pt-BR");
}

function carregarUsuario() {
  const usuario = Auth.getUsuario();

  if (!usuario) return;

  document.getElementById("usuarioNome").textContent = usuario.nome;
}
