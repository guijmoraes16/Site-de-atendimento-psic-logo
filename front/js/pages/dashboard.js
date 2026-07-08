document.addEventListener("DOMContentLoaded", carregarDashboard);

async function carregarDashboard() {
  const usuario = Auth.getUsuario();

  if (usuario) {
    document.getElementById("usuarioNome").textContent = usuario.nome;
    document.getElementById("usuarioHeader").textContent = usuario.nome;
  }

  try {
    const pacientes = await PacienteService.listar();

    document.getElementById("totalPacientes").textContent = pacientes.total;
  } catch {}

  try {
    const psicologos = await PsicologoService.listar();

    document.getElementById("totalPsicologos").textContent = psicologos.total;
  } catch {}

  try {
    const servicos = await ServicoService.listar();

    document.getElementById("totalServicos").textContent = servicos.total;
  } catch {}

  try {
    // const agendamentos = await AgendamentoService.listar();

    document.getElementById("totalAgendamentos").textContent = 0;
  } catch {}
}
