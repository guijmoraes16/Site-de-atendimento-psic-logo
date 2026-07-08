document.addEventListener("DOMContentLoaded", verificarSessao);

async function verificarSessao() {
  const paginasPublicas = ["login.html", "cadastro.html"];

  const paginaAtual = location.pathname.split("/").pop();

  if (paginasPublicas.includes(paginaAtual)) return;

  const token = Auth.getToken();

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  try {
    await Auth.buscarUsuario();
  } catch {
    Auth.logout();
  }
}
