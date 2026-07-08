const params = new URLSearchParams(window.location.search);

const psicologoId = params.get("id");

document.addEventListener("DOMContentLoaded", inicializar);

async function inicializar() {
  Auth.verificarAutenticacao();

  carregarUsuario();

  document
    .getElementById("formPsicologo")
    .addEventListener("submit", salvarPsicologo);

  if (psicologoId) {
    document.getElementById("tituloPagina").innerText = "Editar Psicólogo";

    await carregarPsicologo();
  }
}

async function carregarPsicologo() {
  try {
    const resposta = await PsicologoService.buscar(psicologoId);

    const psicologo = resposta.psicologo;

    document.getElementById("nome").value = psicologo.nome;

    document.getElementById("titulo").value = psicologo.titulo;

    document.getElementById("bio").value = psicologo.bio;

    document.getElementById("foto").value = psicologo.foto;

    document.getElementById("ativo").checked = psicologo.ativo;
  } catch (erro) {
    alert(erro.message);

    window.location.href = "psicologos.html";
  }
}

async function salvarPsicologo(e) {
  e.preventDefault();

  const psicologo = {
    nome: document.getElementById("nome").value.trim(),

    titulo: document.getElementById("titulo").value.trim(),

    bio: document.getElementById("bio").value.trim(),

    foto: document.getElementById("foto").value.trim(),

    ativo: document.getElementById("ativo").checked,
  };

  try {
    if (psicologoId) {
      await PsicologoService.atualizar(psicologoId, psicologo);

      alert("Psicólogo atualizado com sucesso!");
    } else {
      await PsicologoService.criar(psicologo);

      alert("Psicólogo cadastrado com sucesso!");
    }

    window.location.href = "psicologos.html";
  } catch (erro) {
    alert(erro.message);
  }
}

function carregarUsuario() {
  const usuario = Auth.getUsuario();

  if (!usuario) return;

  document.getElementById("usuarioNome").innerText = usuario.nome;
}
