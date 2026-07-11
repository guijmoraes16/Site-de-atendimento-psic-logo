const params = new URLSearchParams(window.location.search);

const servicoId = params.get("id");

document.addEventListener("DOMContentLoaded", inicializar);

async function inicializar() {
  Auth.verificarAutenticacao();

  carregarUsuario();

  document
    .getElementById("formServico")
    .addEventListener("submit", salvarServico);

  if (servicoId) {
    document.getElementById("tituloPagina").innerText = "Editar Serviço";

    await carregarServico();
  }
}

async function carregarServico() {
  try {
    const resposta = await ServicoService.buscar(servicoId);

    const servico = resposta.servico;

    document.getElementById("nome").value = servico.nome;

    document.getElementById("descricao").value = servico.descricao;

    document.getElementById("valor").value = servico.valor;

    document.getElementById("duracao").value = servico.duracao;

    document.getElementById("modalidade").value = servico.modalidade;

    document.getElementById("ativo").checked = servico.ativo;
  } catch (erro) {
    alert(erro.message);

    window.location.href = "servicos.html";
  }
}

async function salvarServico(e) {
  e.preventDefault();

  const servico = {
    nome: document.getElementById("nome").value.trim(),

    descricao: document.getElementById("descricao").value.trim(),

    valor: Number(document.getElementById("valor").value),

    duracao: Number(document.getElementById("duracao").value),

    modalidade: document.getElementById("modalidade").value.trim(),

    ativo: document.getElementById("ativo").checked,
  };

  try {
    if (servicoId) {
      await ServicoService.atualizar(servicoId, servico);

      alert("Serviço atualizado com sucesso!");
    } else {
      await ServicoService.criar(servico);

      alert("Serviço cadastrado com sucesso!");
    }

    window.location.href = "servicos.html";
  } catch (erro) {
    alert(erro.message);
  }
}

function carregarUsuario() {
  const usuario = Auth.getUsuario();

  if (!usuario) return;

  document.getElementById("usuarioNome").innerText = usuario.nome;
}
