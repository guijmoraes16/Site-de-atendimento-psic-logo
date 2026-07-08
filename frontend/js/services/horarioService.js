const HorarioService = {
  listar() {
    return API.request("/horarios", "GET", null, true);
  },

  buscar(id) {
    return API.request(`/horarios/${id}`, "GET", null, true);
  },

  listarDisponiveis() {
    return API.request("/horarios/disponiveis", "GET", null, true);
  },

  listarPorPsicologo(psicologoId) {
    return API.request(`/horarios/psicologo/${psicologoId}`, "GET", null, true);
  },

  criar(dados) {
    return API.request("/horarios", "POST", dados, true);
  },

  atualizar(id, dados) {
    return API.request(`/horarios/${id}`, "PUT", dados, true);
  },

  excluir(id) {
    return API.request(`/horarios/${id}`, "DELETE", null, true);
  },
};
