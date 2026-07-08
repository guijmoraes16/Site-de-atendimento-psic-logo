document.addEventListener("DOMContentLoaded", inicializar);

async function inicializar() {
  Auth.verificarAutenticacao();

  carregarUsuario();

  document
    .getElementById("btnPesquisar")
    .addEventListener("click", pesquisarPsicologo);

  document.getElementById("pesquisa").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();

      pesquisarPsicologo();
    }
  });

  await carregarPsicologos();
}

async function carregarPsicologos() {
  try {
    const resposta = await PsicologoService.listar();

    renderizarTabela(resposta.psicologos);
  } catch (erro) {
    alert(erro.message);
  }
}

function renderizarTabela(psicologos) {
  const tabela = document.querySelector("#tabelaPsicologos tbody");

  tabela.innerHTML = "";

  psicologos.forEach((psicologo) => {
    tabela.innerHTML += `
      <tr>

        <td>
          <strong>${psicologo.nome}</strong>
        </td>

        <td>
          ${psicologo.titulo}
        </td>

        <td>
          ${
            psicologo.ativo
              ? `<span class="badge badge-success">Ativo</span>`
              : `<span class="badge badge-danger">Inativo</span>`
          }
        </td>

        <td>

          <button
            class="btn btn-primary btn-sm"
            onclick="editarPsicologo(${psicologo.id})">

            <i class="bi bi-pencil"></i>

          </button>

          <button
            class="btn btn-danger btn-sm"
            onclick="excluirPsicologo(${psicologo.id})">

            <i class="bi bi-trash"></i>

          </button>

        </td>

      </tr>
    `;
  });
}

function editarPsicologo(id) {
  window.location.href = `psicologo-form.html?id=${id}`;
}

async function excluirPsicologo(id) {
  if (!confirm("Deseja excluir este psicólogo?")) return;

  try {
    await PsicologoService.excluir(id);

    alert("Psicólogo excluído com sucesso.");

    carregarPsicologos();
  } catch (erro) {
    alert(erro.message);
  }
}

async function pesquisarPsicologo() {
  const nome = document.getElementById("pesquisa").value.trim();

  if (nome === "") {
    carregarPsicologos();

    return;
  }

  try {
    const resposta = await PsicologoService.buscarPorNome(nome);

    renderizarTabela(resposta.psicologos);
  } catch (erro) {
    alert(erro.message);
  }
}

function carregarUsuario() {
  const usuario = Auth.getUsuario();

  if (!usuario) return;

  document.getElementById("usuarioNome").innerText = usuario.nome;
}
