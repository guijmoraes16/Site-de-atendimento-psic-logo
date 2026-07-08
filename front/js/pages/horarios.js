document.addEventListener("DOMContentLoaded", inicializar);

async function inicializar() {
  Auth.verificarAutenticacao();

  carregarUsuario();

  await carregarPsicologos();

  await carregarTodosHorarios();

  document
    .getElementById("psicologo")
    .addEventListener("change", filtrarHorarios);
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

async function filtrarHorarios() {
  const psicologoId = document.getElementById("psicologo").value;

  if (!psicologoId) {
    carregarTodosHorarios();

    return;
  }

  try {
    const resposta = await HorarioService.listarPorPsicologo(psicologoId);

    renderizarTabela(resposta.horarios);
  } catch (erro) {
    alert(erro.message);
  }
}

async function carregarTodosHorarios() {
  try {
    const resposta = await HorarioService.listar();

    renderizarTabela(resposta.horarios);
  } catch (erro) {
    alert(erro.message);
  }
}

function renderizarTabela(horarios) {
  const tabela = document.querySelector("#tabelaHorarios tbody");

  tabela.innerHTML = "";

  horarios.forEach((horario) => {
    tabela.innerHTML += `
      <tr>

        <td>${buscarNomePsicologo(horario.psicologo_id)}</td>

        <td>${formatarData(horario.data)}</td>

        <td>${horario.hora.substring(0, 5)}</td>

        <td>

            ${
              horario.disponivel
                ? `<span class="badge badge-success">Disponível</span>`
                : `<span class="badge badge-danger">Ocupado</span>`
            }

        </td>

        <td>

            <button
                class="btn btn-primary btn-sm"
                onclick="editarHorario(${horario.id})">

                <i class="bi bi-pencil"></i>

            </button>

            <button
                class="btn btn-danger btn-sm"
                onclick="excluirHorario(${horario.id})">

                <i class="bi bi-trash"></i>

            </button>

        </td>

      </tr>
    `;
  });
}

function editarHorario(id) {
  window.location.href = `horario-form.html?id=${id}`;
}

async function excluirHorario(id) {
  if (!confirm("Deseja excluir este horário?")) return;

  try {
    await HorarioService.excluir(id);

    carregarTodosHorarios();
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

function buscarNomePsicologo(id) {
  const select = document.getElementById("psicologo");

  const option = [...select.options].find((o) => Number(o.value) === id);

  return option ? option.text : id;
}
