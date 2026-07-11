const ServicoService = {
  listar() {
    return API.request("/servicos", "GET", null, true);
  },

  buscar(id) {
    return API.request(`/servicos/${id}`, "GET", null, true);
  },

  buscarPorNome(nome) {
    return API.request(
      `/servicos/buscar/${encodeURIComponent(nome)}`,
      "GET",
      null,
      true
    );
  },

  listarAtivos() {
    return API.request("/servicos/ativos", "GET", null, true);
  },

  criar(dados) {
    return API.request("/servicos", "POST", dados, true);
  },

  atualizar(id, dados) {
    return API.request(`/servicos/${id}`, "PUT", dados, true);
  },

  excluir(id) {
    return API.request(`/servicos/${id}`, "DELETE", null, true);
  },
};
