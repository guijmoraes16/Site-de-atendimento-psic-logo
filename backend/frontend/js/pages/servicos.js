document.addEventListener("DOMContentLoaded", inicializar);

async function inicializar() {
  Auth.verificarAutenticacao();

  carregarUsuario();

  document
    .getElementById("btnPesquisar")
    .addEventListener("click", pesquisarServico);

  document.getElementById("pesquisa").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();

      pesquisarServico();
    }
  });

  await carregarServicos();
}

async function carregarServicos() {
  try {
    const resposta = await ServicoService.listar();

    renderizarTabela(resposta.servicos);
  } catch (erro) {
    alert(erro.message);
  }
}

function renderizarTabela(servicos) {
  const tabela = document.querySelector("#tabelaServicos tbody");

  tabela.innerHTML = "";

  servicos.forEach((servico) => {
    tabela.innerHTML += `
      <tr>

        <td>
          ${servico.nome}
        </td>
        <td>${servico.modalidade}</td>
        <td>
          ${formatarMoeda(servico.valor)}
        </td>

        <td>
          ${servico.duracao} min
        </td>

        <td>
          ${
            servico.ativo
              ? `<span class="badge badge-success">Ativo</span>`
              : `<span class="badge badge-danger">Inativo</span>`
          }
        </td>

        <td>

          <button
            class="btn btn-primary btn-sm"
            onclick="editarServico(${servico.id})">

            <i class="bi bi-pencil"></i>

          </button>

          <button
            class="btn btn-danger btn-sm"
            onclick="excluirServico(${servico.id})">

            <i class="bi bi-trash"></i>

          </button>

        </td>

      </tr>
    `;
  });
}

async function pesquisarServico() {
  const nome = document.getElementById("pesquisa").value.trim();

  if (nome === "") {
    carregarServicos();

    return;
  }

  try {
    const resposta = await ServicoService.buscarPorNome(nome);

    renderizarTabela(resposta.servicos);
  } catch (erro) {
    alert(erro.message);
  }
}

function editarServico(id) {
  window.location.href = `servico-form.html?id=${id}`;
}

async function excluirServico(id) {
  if (!confirm("Deseja excluir este serviço?")) return;

  try {
    await ServicoService.excluir(id);

    alert("Serviço excluído com sucesso.");

    carregarServicos();
  } catch (erro) {
    alert(erro.message);
  }
}

function formatarMoeda(valor) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function carregarUsuario() {
  const usuario = Auth.getUsuario();

  if (!usuario) return;

  document.getElementById("usuarioNome").innerText = usuario.nome;
}
