const PsicologoService = {
    listar() {
      return API.request("/psicologos", "GET", null, true);
    },

    buscar(id) {
      return API.request(`/psicologos/${id}`, "GET", null, true);
    },

    buscarPorNome(nome) {
      return API.request(
        `/psicologos/buscar/${encodeURIComponent(nome)}`,
        "GET",
        null,
        true
      );
    },

    listarAtivos() {
      return API.request(
        "/psicologos/ativos",
        "GET",
        null,
        true
      );
    },

    criar(dados) {
      return API.request(
        "/psicologos",
        "POST",
        dados,
        true
      );
    },

    atualizar(id, dados) {
      return API.request(
        `/psicologos/${id}`,
        "PUT",
        dados,
        true
      );
    },

    excluir(id) {
      return API.request(
        `/psicologos/${id}`,
        "DELETE",
        null,
        true
      );
    }
  };