const ConsultaService = {
  listar() {
    return API.request("/agendamentos", "GET", null, true);
  },

  buscar(id) {
    return API.request(`/agendamentos/${id}`, "GET", null, true);
  },

  listarPorPaciente(id) {
    return API.request(`/agendamentos/paciente/${id}`, "GET", null, true);
  },

  listarPorPsicologo(id) {
    return API.request(`/agendamentos/psicologo/${id}`, "GET", null, true);
  },

  criar(dados) {
    return API.request("/agendamentos", "POST", dados, true);
  },

  cancelar(id) {
    return API.request(`/agendamentos/${id}/cancelar`, "PATCH", null, true);
  },

  concluir(id) {
    return API.request(`/agendamentos/${id}/concluir`, "PATCH", null, true);
  },

  excluir(id) {
    return API.request(`/agendamentos/${id}`, "DELETE", null, true);
  },
};
