const API_BASE_URL = 'http://127.0.0.1:8000';

async function requestJson(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  let data = null;
  try {
    data = await response.json();
  } catch (error) {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.detail || data?.message || data?.mensagem || 'Erro ao comunicar com a API.');
  }

  return data;
}

function setBookingMessage(message, type = 'success') {
  const feedback = document.getElementById('booking-status');
  if (!feedback) return;

  feedback.textContent = message;
  feedback.style.display = 'block';
  feedback.style.padding = '12px 14px';
  feedback.style.borderRadius = '10px';
  feedback.style.marginTop = '12px';
  feedback.style.fontWeight = '600';
  feedback.style.color = type === 'error' ? '#b42318' : '#155724';
  feedback.style.backgroundColor = type === 'error' ? '#fee4e2' : '#e8f5ee';
}

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  return date.toLocaleDateString('pt-BR');
}

function formatTime(value) {
  if (!value) return '';
  return value.toString().slice(0, 5);
}

function normalizeList(payload, key) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.[key])) return payload[key];
  if (Array.isArray(payload?.objetos)) return payload.objetos;
  if (Array.isArray(payload?.psicologos)) return payload.psicologos;
  if (Array.isArray(payload?.servicos)) return payload.servicos;
  if (Array.isArray(payload?.horarios)) return payload.horarios;
  return [];
}

function buildPatientPayload({ nome, email, telefone }) {
  const cpfBase = `${email.replace(/[^a-z0-9]/gi, '').slice(0, 9)}${Date.now().toString().slice(-4)}`;
  return {
    nome,
    email,
    telefone,
    cpf: cpfBase.slice(0, 11),
    data_nascimento: '2000-01-01',
    endereco: 'Não informado',
    observacoes: 'Criado via formulário web',
  };
}

async function ensurePatient({ nome, email, telefone }) {
  const payload = buildPatientPayload({ nome, email, telefone });

  try {
    const created = await requestJson('/pacientes', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return created.objeto || created.paciente || created;
  } catch (error) {
    if (String(error.message).includes('Email') || String(error.message).includes('CPF')) {
      try {
        const found = await requestJson(`/pacientes/buscar/${encodeURIComponent(nome)}`);
        const pacientes = normalizeList(found, 'objetos');
        return pacientes.find((item) => item.email === email) || pacientes[0] || null;
      } catch (searchError) {
        throw error;
      }
    }
    throw error;
  }
}

async function loadServices(select) {
  try {
    const data = await requestJson('/servicos');
    const services = normalizeList(data, 'servicos');
    select.innerHTML = '<option value="">Selecione um serviço</option>';

    services.forEach((service) => {
      const value = service.id;
      const label = service.nome || service.label;
      const option = document.createElement('option');
      option.value = value;
      option.textContent = label;
      select.appendChild(option);
    });
  } catch (error) {
    select.innerHTML = '<option value="">Erro ao carregar serviços</option>';
    console.error(error);
  }
}

async function loadPsychologists(select) {
  try {
    const data = await requestJson('/psicologos');
    const psychologists = normalizeList(data, 'psicologos');
    select.innerHTML = '<option value="">Selecione um psicólogo</option>';

    psychologists.forEach((psychologist) => {
      const option = document.createElement('option');
      option.value = psychologist.id;
      option.textContent = psychologist.nome;
      select.appendChild(option);
    });
  } catch (error) {
    select.innerHTML = '<option value="">Erro ao carregar psicólogos</option>';
    console.error(error);
  }
}

async function loadSchedules(select, psychologistId = '') {
  try {
    const data = await requestJson('/horarios/disponiveis');
    const schedules = normalizeList(data, 'horarios');
    select.innerHTML = '<option value="">Selecione um horário</option>';

    const filtered = schedules.filter((item) => !psychologistId || String(item.psicologo_id) === String(psychologistId));

    filtered.forEach((schedule) => {
      const option = document.createElement('option');
      option.value = schedule.id;
      option.textContent = `${formatDate(schedule.data)} às ${formatTime(schedule.hora)}`;
      select.appendChild(option);
    });
  } catch (error) {
    select.innerHTML = '<option value="">Erro ao carregar horários</option>';
    console.error(error);
  }
}

function initBookingPage() {
  const form = document.getElementById('booking-form');
  const serviceSelect = document.getElementById('booking-service');
  const psychologistSelect = document.getElementById('booking-psychologist');
  const scheduleSelect = document.getElementById('booking-schedule');

  if (!form || !serviceSelect || !psychologistSelect || !scheduleSelect) {
    return;
  }

  loadServices(serviceSelect);
  loadPsychologists(psychologistSelect);
  loadSchedules(scheduleSelect);

  psychologistSelect.addEventListener('change', (event) => {
    loadSchedules(scheduleSelect, event.target.value);
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nome = document.getElementById('booking-name').value.trim();
    const email = document.getElementById('booking-email').value.trim();
    const telefone = document.getElementById('booking-telefone').value.trim();
    const servicoId = Number(serviceSelect.value);
    const psicologoId = Number(psychologistSelect.value);
    const horarioId = Number(scheduleSelect.value);
    const mensagem = document.getElementById('booking-message').value.trim();

    if (!nome || !email || !telefone || !servicoId || !psicologoId || !horarioId) {
      setBookingMessage('Preencha todos os campos para concluir o agendamento.', 'error');
      return;
    }

    try {
      const paciente = await ensurePatient({ nome, email, telefone });
      if (!paciente?.id) {
        throw new Error('Não foi possível identificar o paciente.');
      }

      await requestJson('/agendamentos', {
        method: 'POST',
        body: JSON.stringify({
          paciente_id: paciente.id,
          psicologo_id: psicologoId,
          servico_id: servicoId,
          horario_id: horarioId,
          mensagem,
        }),
      });

      setBookingMessage('Agendamento realizado com sucesso!');
      form.reset();
      loadSchedules(scheduleSelect, psychologistSelect.value);
    } catch (error) {
      setBookingMessage(error.message || 'Não foi possível concluir o agendamento.', 'error');
    }
  });
}

document.addEventListener('DOMContentLoaded', initBookingPage);
