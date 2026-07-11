const STORAGE = {
  TOKEN: "token",
  USUARIO: "usuario",
};

const Utils = {
  salvar(chave, valor) {
    localStorage.setItem(chave, JSON.stringify(valor));
  },

  recuperar(chave) {
    const valor = localStorage.getItem(chave);

    if (!valor) return null;

    return JSON.parse(valor);
  },

  remover(chave) {
    localStorage.removeItem(chave);
  },

  mostrarMensagem(texto) {
    alert(texto);
  },

  mostrarErro(texto) {
    alert(texto);
  },
};

const $ = (id) => document.getElementById(id);
