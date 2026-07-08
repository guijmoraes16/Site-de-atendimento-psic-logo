const params = new URLSearchParams(window.location.search);

const horarioId = params.get("id");

document.addEventListener("DOMContentLoaded", inicializar);

async function inicializar() {
  Auth.verificarAutenticacao();

  carregarUsuario();

  await carregarPsicologos();

  document
    .getElementById("formHorario")
    .addEventListener("submit", salvarHorario);

  if (horarioId) {
    document.getElementById("tituloPagina").textContent = "Editar Horário";

    document.getElementById("divDisponivel").style.display = "block";

    await carregarHorario();
  }
}

async function carregarPsicologos() {
  try {
    const resposta = await PsicologoService.listarAtivos();

    const select = document.getElementById("psicologo");

    select.innerHTML = '<option value="">Selecione um psicólogo</option>';

    resposta.psicologos.forEach((psicologo) => {
      select.innerHTML += `
            <option value="${psicologo.id}">
                ${psicologo.nome}
            </option>
        `;
    });
  } catch (erro) {
    alert(erro.message);
  }
}

async function carregarHorario() {
  try {
    const resposta = await HorarioService.buscar(horarioId);

    const horario = resposta.horario;

    document.getElementById("psicologo").value = horario.psicologo_id;

    document.getElementById("data").value = horario.data;

    document.getElementById("hora").value = horario.hora.substring(0, 5);

    document.getElementById("disponivel").checked = horario.disponivel;
  } catch (erro) {
    alert(erro.message);
  }
}

async function salvarHorario(e) {
  e.preventDefault();

  const horario = {
    psicologo_id: Number(document.getElementById("psicologo").value),

    data: document.getElementById("data").value,

    hora: document.getElementById("hora").value,
  };

  try {
    if (horarioId) {
      horario.disponivel = document.getElementById("disponivel").checked;

      await HorarioService.atualizar(horarioId, horario);

      alert("Horário atualizado.");
    } else {
      await HorarioService.criar(horario);

      alert("Horário cadastrado.");
    }

    window.location.href = "horarios.html";
  } catch (erro) {
    alert(erro.message);
  }
}

function carregarUsuario() {
  const usuario = Auth.getUsuario();

  if (!usuario) return;

  document.getElementById("usuarioNome").textContent = usuario.nome;
}
