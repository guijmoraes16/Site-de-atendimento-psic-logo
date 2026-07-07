document.getElementById("formLogin").addEventListener("submit", login);

async function login(event) {
  event.preventDefault();

  const email = $("email").value.trim();

  const senha = $("senha").value;

  if (!email || !senha) {
    Utils.mostrarErro("Preencha todos os campos.");

    return;
  }

  try {
    await Auth.login(
      email,

      senha
    );

    window.location.href = "index.html";
  } catch (erro) {
    Utils.mostrarErro(erro.message);
  }
}
