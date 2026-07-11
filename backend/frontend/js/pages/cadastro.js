document.addEventListener("DOMContentLoaded", () => {
  if (Auth.getToken()) {
    window.location.href = "inicio.html";
    return;
  }

  document.getElementById("formLogin").addEventListener("submit", login);
});

document.getElementById("formCadastro").addEventListener("submit", cadastrar);

async function cadastrar(e) {
  e.preventDefault();

  const nome = $("nome").value.trim();

  const telefone = $("telefone").value.trim();

  const email = $("email").value.trim();

  const senha = $("senha").value;

  const confirmarSenha = $("confirmarSenha").value;

  if (!nome || !telefone || !email || !senha) {
    Utils.mostrarErro("Preencha todos os campos.");

    return;
  }

  if (senha !== confirmarSenha) {
    Utils.mostrarErro("As senhas não coincidem.");

    return;
  }

  try {
    await Auth.cadastrar({
      nome,

      email,

      senha,

      telefone,
    });

    Utils.mostrarMensagem("Cadastro realizado com sucesso.");

    window.location.href = "login.html";
  } catch (erro) {
    Utils.mostrarErro(erro.message);
  }
}
