const params = new URLSearchParams(window.location.search);

const pacienteId = params.get("id");

document.addEventListener("DOMContentLoaded", inicializar);

async function inicializar() {
  Auth.verificarAutenticacao();

  carregarUsuario();

  document
    .getElementById("formPaciente")
    .addEventListener("submit", salvarPaciente);

  if (pacienteId) {
    document.getElementById("tituloPagina").innerText = "Editar Paciente";

    carregarPaciente();
  }
}

async function carregarPaciente() {
  try {
    const resposta = await PacienteService.buscar(pacienteId);

    const paciente = resposta.paciente;

    document.getElementById("nome").value = paciente.nome;
    document.getElementById("cpf").value = paciente.cpf;
    document.getElementById("telefone").value = paciente.telefone;
    document.getElementById("email").value = paciente.email;
    document.getElementById("data_nascimento").value = paciente.data_nascimento;
  } catch (erro) {
    alert(erro.message);
  }
}

async function salvarPaciente(e) {
  e.preventDefault();

  const paciente = {
    nome: document.getElementById("nome").value,
    cpf: document.getElementById("cpf").value,
    telefone: document.getElementById("telefone").value,
    email: document.getElementById("email").value,
    data_nascimento: document.getElementById("data_nascimento").value,

    endereco: "",
    observacoes: "",
  };

  try {
    if (pacienteId) {
      await PacienteService.atualizar(pacienteId, paciente);

      alert("Paciente atualizado.");
    } else {
      await PacienteService.criar(paciente);

      alert("Paciente cadastrado.");
    }

    window.location.href = "pacientes.html";
  } catch (erro) {
    alert(erro.message);
  }
}

function carregarUsuario() {
  const usuario = Auth.getUsuario();

  if (!usuario) return;

  document.getElementById("usuarioNome").innerText = usuario.nome;
}
