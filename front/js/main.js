document.addEventListener("DOMContentLoaded", () => {
  if (
    window.location.pathname.includes("login.html") ||
    window.location.pathname.includes("cadastro.html")
  ) {
    return;
  }

  Auth.verificarAutenticacao();
});
