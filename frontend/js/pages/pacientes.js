document.addEventListener("DOMContentLoaded", inicializar);

async function inicializar() {
  Auth.verificarAutenticacao();

  carregarUsuario();

  document
    .getElementById("btnPesquisar")
    .addEventListener("click", pesquisarPaciente);

  document.getElementById("pesquisa").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();

      pesquisarPaciente();
    }
  });

  await carregarPacientes();
}

async function carregarPacientes() {
  try {
    const resposta = await PacienteService.listar();

    renderizarTabela(resposta.pacientes);
  } catch (erro) {
    alert(erro.message);
  }
}

function editarPaciente(id) {
  window.location.href = `paciente-form.html?id=${id}`;
}

async function excluirPaciente(id) {
  if (!confirm("Deseja excluir este paciente?")) return;

  try {
    await PacienteService.excluir(id);

    alert("Paciente excluído.");

    carregarPacientes();
  } catch (erro) {
    alert(erro.message);
  }
}

function carregarUsuario() {
  const usuario = Auth.getUsuario();

  if (!usuario) return;

  document.getElementById("usuarioNome").innerText = usuario.nome;
}

function renderizarTabela(pacientes) {
  const tabela = document.querySelector("#tabelaPacientes tbody");

  tabela.innerHTML = "";

  pacientes.forEach((paciente) => {
    tabela.innerHTML += `
      <tr>

        <td>${paciente.nome}</td>

        <td>${paciente.cpf}</td>

        <td>${paciente.telefone}</td>

        <td>${paciente.email}</td>

        <td>

          <button
            class="btn btn-primary btn-sm"
            onclick="editarPaciente(${paciente.id})">

            <i class="bi bi-pencil"></i>

          </button>

          <button
            class="btn btn-danger btn-sm"
            onclick="excluirPaciente(${paciente.id})">

            <i class="bi bi-trash"></i>

          </button>

        </td>

      </tr>
    `;
  });
}

async function pesquisarPaciente() {
  const nome = document.getElementById("pesquisa").value.trim();

  if (nome === "") {
    carregarPacientes();

    return;
  }

  try {
    const resposta = await PacienteService.buscarPorNome(nome);

    renderizarTabela(resposta.objetos);
  } catch (erro) {
    alert(erro.message);
  }
}
