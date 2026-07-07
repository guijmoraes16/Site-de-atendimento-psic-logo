const Auth = {
  async login(email, senha) {
    const resposta = await API.request(
      "/auth/login",

      "POST",

      {
        email,
        senha,
      }
    );

    Utils.salvar(
      STORAGE.TOKEN,

      resposta.access_token
    );

    const usuario = await this.buscarUsuario();

    Utils.salvar(
      STORAGE.USUARIO,

      usuario
    );

    return usuario;
  },

  async cadastrar(usuario) {
    return await API.request(
      "/auth/cadastro",

      "POST",

      usuario
    );
  },

  async buscarUsuario() {
    return await API.request(
      "/saude/me",

      "GET",

      null,

      true
    );
  },

  getUsuario() {
    return Utils.recuperar(STORAGE.USUARIO);
  },

  getToken() {
    return Utils.recuperar(STORAGE.TOKEN);
  },

  logout() {
    Utils.remover(STORAGE.TOKEN);

    Utils.remover(STORAGE.USUARIO);

    window.location.href = "login.html";
  },

  verificarAutenticacao() {
    if (!this.getToken()) {
      window.location.href = "login.html";
    }
  },
};
