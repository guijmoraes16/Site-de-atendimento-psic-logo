const params = new URLSearchParams(window.location.search);

const consultaId = params.get("id");

document.addEventListener("DOMContentLoaded", inicializar);

async function inicializar() {
  Auth.verificarAutenticacao();

  carregarUsuario();

  await carregarPacientes();

  await carregarPsicologos();

  await carregarServicos();

  document
    .getElementById("psicologo")
    .addEventListener("change", carregarHorarios);

  document
    .getElementById("formConsulta")
    .addEventListener("submit", salvarConsulta);
}

async function carregarPacientes() {
  try {
    const resposta = await PacienteService.listar();

    const select = document.getElementById("paciente");

    select.innerHTML = '<option value="">Selecione...</option>';

    resposta.pacientes.forEach((paciente) => {
      select.innerHTML += `
                <option value="${paciente.id}">
                    ${paciente.nome}
                </option>
            `;
    });
  } catch (erro) {
    alert(erro.message);
  }
}

async function carregarPsicologos() {
  try {
    const resposta = await PsicologoService.listarAtivos();

    const select = document.getElementById("psicologo");

    select.innerHTML = '<option value="">Selecione...</option>';

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

async function carregarServicos() {
  try {
    const resposta = await ServicoService.listar();

    const select = document.getElementById("servico");

    select.innerHTML = '<option value="">Selecione...</option>';

    resposta.servicos.forEach((servico) => {
      select.innerHTML += `
                <option value="${servico.id}">
                    ${servico.nome}
                </option>
            `;
    });
  } catch (erro) {
    alert(erro.message);
  }
}

async function carregarHorarios() {
  const psicologoId = document.getElementById("psicologo").value;

  const select = document.getElementById("horario");

  select.innerHTML = '<option value="">Selecione...</option>';

  if (!psicologoId) return;

  try {
    const resposta = await HorarioService.listarPorPsicologo(psicologoId);

    resposta.horarios
      .filter((h) => h.disponivel)
      .forEach((horario) => {
        select.innerHTML += `
                    <option value="${horario.id}">

                        ${formatarData(horario.data)}
                        -
                        ${horario.hora.substring(0, 5)}

                    </option>
                `;
      });
  } catch (erro) {
    alert(erro.message);
  }
}

async function salvarConsulta(e) {
  e.preventDefault();

  const consulta = {
    paciente_id: Number(document.getElementById("paciente").value),

    psicologo_id: Number(document.getElementById("psicologo").value),

    servico_id: Number(document.getElementById("servico").value),

    horario_id: Number(document.getElementById("horario").value),

    mensagem: document.getElementById("mensagem").value,
  };

  try {
    await ConsultaService.criar(consulta);

    alert("Consulta agendada com sucesso!");

    window.location.href = "consultas.html";
  } catch (erro) {
    alert(erro.message);
  }
}

function formatarData(data) {
  return new Date(data).toLocaleDateString("pt-BR");
}

function carregarUsuario() {
  const usuario = Auth.getUsuario();

  if (!usuario) return;

  document.getElementById("usuarioNome").textContent = usuario.nome;
}
