const PacienteService = {
  listar() {
    return API.request("/pacientes", "GET", null, true);
  },

  buscar(id) {
    return API.request(`/pacientes/${id}`, "GET", null, true);
  },

  buscarPorNome(nome) {
    return API.request(
      `/pacientes/buscar/${encodeURIComponent(nome)}`,
      "GET",
      null,
      true
    );
  },

  buscarPorCPF(cpf) {
    return API.request(`/pacientes/buscar/cpf/${cpf}`, "GET", null, true);
  },

  criar(dados) {
    return API.request("/pacientes", "POST", dados, true);
  },

  atualizar(id, dados) {
    return API.request(`/pacientes/${id}`, "PUT", dados, true);
  },

  excluir(id) {
    return API.request(`/pacientes/${id}`, "DELETE", null, true);
  },
};
