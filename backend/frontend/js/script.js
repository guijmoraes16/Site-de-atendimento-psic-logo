const API_URL = "http://127.0.0.1:8000";

// Global variables
let currentStep = 1;
let currentPatientEmail = localStorage.getItem("patient_email") || null;
let currentPatientName = localStorage.getItem("patient_name") || null;
let currentPatientPhone = localStorage.getItem("patient_phone") || null;
let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
let services = [];
let psychologists = [];
let scheduleEntries = [];
let selectedPsychologistId = null;
let selectedSchedule = null;

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("equipe")) {
    generateTeamProfiles();
  }

  if (document.getElementById("agendamento-intro")) {
    showStep(1);
    initializeAppointmentPage();
  }

  if (
    document.getElementById("psychologist-list") &&
    !document.getElementById("agendamento-intro")
  ) {
    initializePsychologistPage();
  }

  if (document.getElementById("admin-page")) {
    // Load admin script dynamically
    const script = document.createElement("script");
    script.src = "admin.js";
    script.onload = function () {
      if (typeof initAdminPage === "function") {
        initAdminPage();
      }
    };
    document.head.appendChild(script);
  }

  checkAdminAccess();
});

async function initializeAppointmentPage() {
  await loadServices();
  await loadPsychologists();
  renderServiceOptions();
  populatePsychologistList();
  renderSchedulePreview();
  loadPatientSession();
  await selectPsychologistFromStorage();
  loadAppointments();
}

async function selectPsychologistFromStorage() {
  const stored = localStorage.getItem("selected_psychologist_id");
  if (!stored) return;

  const id = parseInt(stored, 10);
  localStorage.removeItem("selected_psychologist_id");

  const psychExists = psychologists.some((psych) => psych.id === id);
  if (psychExists) {
    await selectPsychologist(id);
    showFeedback(
      "Psicólogo selecionado. Complete seus dados para finalizar o agendamento.",
      "success"
    );
  }
}

function loadPatientSession() {
  const authInput = document.getElementById("patient-email-login");
  const logoutButton = document.getElementById("patient-logout-button");
  const authMessage = document.getElementById("patient-auth-message");

  if (authInput) {
    authInput.value = currentPatientEmail || "";
  }

  if (currentPatientEmail) {
    if (authMessage) {
      authMessage.textContent = `Você está logado como ${currentPatientEmail}.`;
      authMessage.style.color = "#155724";
    }
    if (logoutButton) {
      logoutButton.style.display = "inline-block";
    }
  } else {
    if (authMessage) {
      authMessage.textContent =
        "Faça login com seu email para ver seus agendamentos.";
      authMessage.style.color = "#333";
    }
    if (logoutButton) {
      logoutButton.style.display = "none";
    }
  }
}

function patientLogin() {
  const authInput = document.getElementById("patient-email-login");
  const authMessage = document.getElementById("patient-auth-message");

  if (!authInput || !authInput.value) {
    if (authMessage) {
      authMessage.textContent = "Digite seu email para continuar.";
      authMessage.style.color = "#a94442";
    }
    return;
  }

  currentPatientEmail = authInput.value;
  localStorage.setItem("patient_email", currentPatientEmail);
  loadPatientSession();
  loadAppointments();
  showFeedback("Login de paciente realizado com sucesso.", "success");
}

function patientLogout() {
  currentPatientEmail = null;
  currentPatientName = null;
  currentPatientPhone = null;
  localStorage.removeItem("patient_email");
  localStorage.removeItem("patient_name");
  localStorage.removeItem("patient_phone");
  loadPatientSession();
  loadAppointments();
  showFeedback("Logout do paciente realizado.", "success");
}

// Multi-step form functions
function showStep(step) {
  document
    .querySelectorAll(".step")
    .forEach((s) => s.classList.remove("active"));
  document.getElementById(`step-${step}`).classList.add("active");
  currentStep = step;
}

function nextStep(current) {
  if (validateStep(current)) {
    showStep(current + 1);
  }
}

function prevStep(current) {
  showStep(current - 1);
}

function validateStep(step) {
  if (step === 1) {
    if (!selectedPsychologistId) {
      showFeedback("Selecione um psicólogo antes de prosseguir.", "error");
      return false;
    }
    if (!document.getElementById("servico").value) {
      showFeedback("Escolha um tipo de serviço.", "error");
      return false;
    }
    return true;
  } else if (step === 2) {
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefone = document.getElementById("telefone").value.trim();

    if (!nome || !email || !telefone) {
      showFeedback("Preencha nome, e-mail e telefone para continuar.", "error");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFeedback("Informe um e-mail válido.", "error");
      return false;
    }

    return true;
  } else if (step === 3) {
    if (!selectedSchedule) {
      showFeedback(
        "Selecione um horário para concluir o agendamento.",
        "error"
      );
      return false;
    }
    return true;
  }
  return true;
}

async function fetchJson(url, options = {}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Erro ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

async function loadServices() {
  try {
    const data = await fetchJson(`${API_URL}/servicos`);
    services = data.map((item) => ({
      id: item.id,
      nome: item.nome || item.label,
      descricao: item.descricao || "",
      valor: item.valor || item.price || "R$ 0,00",
      modalidade: item.modalidade || "Presencial",
      ativo: item.ativo !== false,
    }));
  } catch (error) {
    services = [
      {
        id: 1,
        nome: "Terapia Individual",
        descricao: "Sessão individual de acompanhamento",
        valor: "R$ 120",
        modalidade: "Presencial",
        ativo: true,
      },
      {
        id: 2,
        nome: "Terapia de Casal",
        descricao: "Sessão para casal",
        valor: "R$ 180",
        modalidade: "Presencial",
        ativo: true,
      },
      {
        id: 3,
        nome: "Atendimento Online",
        descricao: "Sessão online",
        valor: "R$ 100",
        modalidade: "Online",
        ativo: true,
      },
      {
        id: 4,
        nome: "Orientação Psicológica",
        descricao: "Atendimento breve",
        valor: "R$ 80",
        modalidade: "Online",
        ativo: true,
      },
    ];
  }
}

async function loadRandomUserPortraits(count = 4) {
  try {
    const response = await fetch(
      `https://randomuser.me/api/?results=${count}&nat=br`
    );
    const data = await response.json();
    return data.results.map(
      (user) => user.picture?.large || user.picture?.medium || ""
    );
  } catch (error) {
    return [];
  }
}

async function loadPsychologists() {
  const portraits = await loadRandomUserPortraits(6);

  try {
    const data = await fetchJson(`${API_URL}/psicologos`);
    psychologists = data.map((item, index) => ({
      id: item.id,
      nome: item.nome || item.name,
      titulo: item.titulo || item.title || "Psicólogo(a)",
      bio: item.bio || item.biography || "",
      foto:
        item.foto ||
        item.photo ||
        portraits[index % portraits.length] ||
        "https://randomuser.me/api/portraits/men/32.jpg",
      ativo: item.ativo !== false,
      detalhes: item.detalhes || [],
    }));
  } catch (error) {
    psychologists = [
      {
        id: 1,
        nome: "Dra. Ana Silva",
        titulo: "Psicóloga Clínica",
        bio: "Atendimento humanizado e focado em ansiedade e autoconhecimento.",
        foto:
          portraits[0] || "https://randomuser.me/api/portraits/women/32.jpg",
        ativo: true,
        detalhes: [
          "Terapia cognitiva",
          "Apoio emocional",
          "Mentalidade positiva",
        ],
      },
      {
        id: 2,
        nome: "Dr. Carlos Souza",
        titulo: "Psicólogo Familiar",
        bio: "Especialista em relações familiares e orientação de casais.",
        foto: portraits[1] || "https://randomuser.me/api/portraits/men/32.jpg",
        ativo: true,
        detalhes: [
          "Terapia de casal",
          "Apoio à família",
          "Resolução de conflitos",
        ],
      },
      {
        id: 3,
        nome: "Dra. Juliana Costa",
        titulo: "Psicóloga Infantil",
        bio: "Atendimento para crianças e adolescentes com cuidado afetivo.",
        foto:
          portraits[2] || "https://randomuser.me/api/portraits/women/33.jpg",
        ativo: true,
        detalhes: [
          "Atendimento infantil",
          "Suporte escolar",
          "Desenvolvimento emocional",
        ],
      },
      {
        id: 4,
        nome: "Dra. Fernanda Lima",
        titulo: "Psicóloga de Orientação Familiar",
        bio: "Apoio a famílias, casais e jovens em transição.",
        foto:
          portraits[3] || "https://randomuser.me/api/portraits/women/34.jpg",
        ativo: true,
        detalhes: [
          "Terapia familiar",
          "Aconselhamento",
          "Orientação de decisões",
        ],
      },
    ];
  }
}

function renderServiceOptions() {
  const select = document.getElementById("servico");
  if (!select) return;
  select.innerHTML = '<option value="">Selecione um serviço</option>';
  services.forEach((service) => {
    select.innerHTML += `<option value="${service.id}">${service.nome}</option>`;
  });
}

function populatePsychologistList() {
  const list = document.getElementById("psychologist-list");
  if (!list) return;
  list.innerHTML = "";

  psychologists.forEach((psych) => {
    const specialties =
      Array.isArray(psych.detalhes) && psych.detalhes.length
        ? psych.detalhes
        : ["Atendimento acolhedor", "Abordagem personalizada"];
    list.innerHTML += `
            <article class="psychologist-card">
                <img src="${psych.foto}" alt="${psych.nome}" loading="lazy">
                <div class="card-body">
                    <span class="card-tag">${psych.titulo}</span>
                    <h4>${psych.nome}</h4>
                    <p>${psych.bio}</p>
                    <ul class="speciality-list">
                        ${specialties
                          .slice(0, 3)
                          .map((item) => `<li>${item}</li>`)
                          .join("")}
                    </ul>
                    <div class="card-actions">
                        <button type="button" class="secondary-action" onclick="showPsychologistDetailsById(${
                          psych.id
                        })">Ver perfil</button>
                    </div>
                </div>
            </article>
        `;
  });
}

async function initializePsychologistPage() {
  await loadPsychologists();
  populatePsychologistList();
}

function prepareBooking(id) {
  localStorage.setItem("selected_psychologist_id", id);
  window.location.href = "agendar.html";
}

function showPsychologistDetailsById(id) {
  const psych = psychologists.find((item) => item.id === id);
  if (!psych) return;
  const detailsHtml = `
        <div class="psychologist-detail">
            <img src="${psych.foto}" alt="${psych.nome}">
            <h2>${psych.nome}</h2>
            <p class="title">${psych.titulo}</p>
            <p>${psych.bio}</p>
            ${
              psych.detalhes && psych.detalhes.length
                ? `<ul>${psych.detalhes
                    .map((item) => `<li>${item}</li>`)
                    .join("")}</ul>`
                : ""
            }
            <div class="detail-actions">
                <button type="button" class="primary-action" onclick="prepareBooking(${
                  psych.id
                }); closePsychologistModal();">Agendar consulta</button>
                <button type="button" class="secondary-action" onclick="closePsychologistModal()">Fechar</button>
            </div>
        </div>
    `;
  document.getElementById("psychologist-details").innerHTML = detailsHtml;
  document.getElementById("psychologist-modal").style.display = "block";
  document.body.style.overflow = "hidden";
}

async function selectPsychologist(id) {
  selectedPsychologistId = id;
  selectedSchedule = null;
  document.getElementById("selected-psychologist-name").textContent =
    psychologists.find((p) => p.id === id)?.nome || "Nenhum";
  document.getElementById("confirm-psychologist").textContent =
    psychologists.find((p) => p.id === id)?.nome || "-";
  await loadPsychologistSchedule(id);
  renderSchedulePreview();
}

async function loadPsychologistSchedule(psychologistId) {
  try {
    const data = await fetchJson(
      `${API_URL}/psicologos/${psychologistId}/horarios`
    );
    scheduleEntries = data.map((item) => ({
      id: item.id,
      psicologo_id: item.psicologo_id || psychologistId,
      date: item.data || item.date,
      time: item.hora || item.time,
      disponivel: item.disponivel !== false,
      label:
        item.label || `${item.data || item.date} ${item.hora || item.time}`,
    }));
  } catch (error) {
    scheduleEntries = [];
  }
}

function renderSchedulePreview() {
  const preview = document.getElementById("schedule-preview");
  if (!preview) return;

  if (!selectedPsychologistId) {
    preview.innerHTML = `
            <h3>Agenda do psicólogo</h3>
            <p>Selecione um psicólogo para ver os horários disponíveis.</p>
        `;
    return;
  }

  const available = scheduleEntries.filter((entry) => entry.disponivel);
  if (available.length === 0) {
    preview.innerHTML = `
            <h3>Agenda do psicólogo</h3>
            <p>Não há horários disponíveis para este psicólogo no momento.</p>
        `;
    return;
  }

  const grouped = available.reduce((acc, item) => {
    acc[item.date] = acc[item.date] || [];
    acc[item.date].push(item);
    return acc;
  }, {});

  preview.innerHTML = `
        <h3>Agenda do psicólogo</h3>
        <p>Selecione um horário disponível abaixo:</p>
        <div class="schedule-preview-grid">
            ${Object.keys(grouped)
              .map(
                (date) => `
                <div class="schedule-day">
                    <div class="schedule-day-title">${new Date(
                      date
                    ).toLocaleDateString("pt-BR")}</div>
                    <div class="schedule-times">
                        ${grouped[date]
                          .map(
                            (item) => `
                            <button type="button" class="schedule-slot ${
                              selectedSchedule?.id === item.id ? "selected" : ""
                            }" onclick="selectSchedule(${item.id})">${
                              item.time
                            }</button>
                        `
                          )
                          .join("")}
                    </div>
                </div>
            `
              )
              .join("")}
        </div>
    `;
}

function selectSchedule(scheduleId) {
  selectedSchedule = scheduleEntries.find((entry) => entry.id === scheduleId);
  updateSelectedAppointmentDisplay();
  renderSchedulePreview();
  if (selectedSchedule) {
    showFeedback(
      `Horário selecionado: ${selectedSchedule.date} ${selectedSchedule.time}`,
      "success"
    );
  }
}

function updateSelectedAppointmentDisplay() {
  const confirmDate = document.getElementById("confirm-date");
  const confirmTime = document.getElementById("confirm-time");
  const confirmPsychologist = document.getElementById("confirm-psychologist");

  if (confirmDate && confirmTime) {
    confirmDate.textContent = selectedSchedule
      ? new Date(selectedSchedule.date).toLocaleDateString("pt-BR")
      : "-";
    confirmTime.textContent = selectedSchedule ? selectedSchedule.time : "-";
  }

  if (confirmPsychologist) {
    confirmPsychologist.textContent = selectedPsychologistId
      ? psychologists.find((p) => p.id === selectedPsychologistId)?.nome || "-"
      : "-";
  }
}

function showFeedback(message, type) {
  const existing = document.getElementById("global-feedback");
  let feedback = existing;
  if (!feedback) {
    feedback = document.createElement("div");
    feedback.id = "global-feedback";
    feedback.style.position = "fixed";
    feedback.style.right = "24px";
    feedback.style.top = "24px";
    feedback.style.zIndex = "9999";
    feedback.style.maxWidth = "320px";
    feedback.style.boxShadow = "0 2px 10px rgba(0,0,0,0.12)";
    document.body.appendChild(feedback);
  }

  feedback.textContent = message;
  feedback.style.display = "block";
  feedback.style.color = type === "error" ? "#721c24" : "#155724";
  feedback.style.backgroundColor = type === "error" ? "#f8d7da" : "#d4edda";
  feedback.style.border =
    "1px solid " + (type === "error" ? "#f5c6cb" : "#c3e6cb");
  feedback.style.padding = "14px 18px";
  feedback.style.borderRadius = "10px";
  feedback.style.marginBottom = "16px";
  feedback.style.transition = "opacity 0.3s ease";
  feedback.style.opacity = "1";

  setTimeout(() => {
    feedback.style.opacity = "0";
    setTimeout(() => (feedback.style.display = "none"), 300);
  }, 4200);
}

// Random User API
async function generateRandomUser() {
  try {
    const response = await fetch("https://randomuser.me/api/");
    const data = await response.json();
    const user = data.results[0];
    document.getElementById(
      "nome"
    ).value = `${user.name.first} ${user.name.last}`;
    document.getElementById("email").value = user.email;
    document.getElementById("telefone").value = user.phone;
  } catch (error) {
    showFeedback("Erro ao gerar dados aleatórios", "error");
  }
}

// Submit form
async function createGoogleCalendarEvent(appointmentData) {
  try {
    if (!window.gapi || !window.gapi.client) {
      return { success: false, message: "Google Calendar não inicializado." };
    }

    const event = {
      summary: `Consulta - ${appointmentData.psicologo_name || "Clínica"}`,
      description: `Agendamento de consulta\nServiço: ${
        appointmentData.servico_name || ""
      }\nPaciente: ${appointmentData.nome}`,
      start: {
        dateTime: `${appointmentData.data}T${appointmentData.hora}:00`,
        timeZone: "America/Sao_Paulo",
      },
      end: {
        dateTime: `${appointmentData.data}T${appointmentData.hora}:00`,
        timeZone: "America/Sao_Paulo",
      },
    };

    const response = await window.gapi.client.calendar.events.insert({
      calendarId: "primary",
      resource: event,
    });

    return { success: true, eventId: response.result.id };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Erro ao criar evento no Google Calendar.",
    };
  }
}

function submitForm() {
  if (!validateStep(3)) return;

  if (!selectedSchedule || !selectedPsychologistId) {
    showFeedback(
      "Selecione um psicólogo e um horário válidos antes de enviar.",
      "error"
    );
    return;
  }

  const serviceId = parseInt(document.getElementById("servico").value, 10);
  const service = services.find((item) => item.id === serviceId);
  const serviceName = service
    ? service.nome
    : document.getElementById("servico").value;
  const psychologist = psychologists.find(
    (item) => item.id === selectedPsychologistId
  );

  const formData = {
    nome: document.getElementById("nome").value,
    email: document.getElementById("email").value,
    telefone: document.getElementById("telefone").value,
    servico: serviceName,
    servico_id: serviceId,
    psicologo_id: selectedPsychologistId,
    horario_id: selectedSchedule.id,
    mensagem: document.getElementById("mensagem").value,
    data: selectedSchedule.date,
    hora: selectedSchedule.time,
  };

  const appointmentRecord = {
    ...formData,
    status: "pending",
    id: Date.now(),
    servico_name: serviceName,
    psicologo_name: psychologist?.nome || "",
  };

  appointments.push(appointmentRecord);
  localStorage.setItem("appointments", JSON.stringify(appointments));
  localStorage.setItem("patient_email", formData.email);

  showConfirmation(appointmentRecord);
  loadAppointments();
  resetForm();

  // Send to backend
  fetch(`${API_URL}/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  })
    .then(async (res) => {
      const resp = await res.json().catch(() => ({}));
      if (resp.success) {
        showFeedback("Agendamento enviado ao servidor com sucesso!", "success");
      } else {
        showFeedback(
          "Agendamento salvo localmente. O servidor retornou: " +
            (resp.error || "erro desconhecido"),
          "warning"
        );
      }
    })
    .catch((err) => {
      showFeedback(
        "Sem conexão com servidor — agendamento salvo localmente.",
        "warning"
      );
    });

  if (window.gapi && window.gapi.client) {
    createGoogleCalendarEvent(appointmentRecord).then((result) => {
      if (result.success) {
        showFeedback(
          "Agendamento salvo localmente e enviado para o Google Calendar.",
          "success"
        );
      }
    });
  }
}

// Show confirmation
function showConfirmation(data) {
  const content = `
        <h3>Consulta agendada com sucesso!</h3>
        <p><strong>Nome:</strong> ${data.nome}</p>
        <p><strong>Psicólogo:</strong> ${
          data.psicologo_name || "Não informado"
        }</p>
        <p><strong>Serviço:</strong> ${getServiceName(data.servico)}</p>
        <p><strong>Data:</strong> ${data.data || "-"}</p>
        <p><strong>Hora:</strong> ${data.hora || "-"}</p>
    `;
  document.getElementById("confirmacao-content").innerHTML = content;
  document.getElementById("confirmacao").style.display = "block";
  showFeedback("Agendamento realizado com sucesso!", "success");
}

// Get service name
function getServiceName(service) {
  if (service === undefined || service === null || service === "") {
    return "Serviço não definido";
  }
  const serviceId = parseInt(service, 10);
  if (!Number.isNaN(serviceId)) {
    const matched = services.find((item) => item.id === serviceId);
    return matched ? matched.nome : `Serviço ${serviceId}`;
  }
  const matched = services.find((item) => item.nome === service);
  if (matched) {
    return matched.nome;
  }
  return service || "Serviço não definido";
}

// Load appointments
function loadAppointments() {
  const list = document.getElementById("appointments-list");
  if (!list) return;
  list.innerHTML = "";

  const userEmail =
    currentPatientEmail || localStorage.getItem("patient_email");
  const visibleAppointments = userEmail
    ? appointments.filter((app) => app.email === userEmail)
    : [];

  if (!userEmail) {
    list.innerHTML = `
            <div class="appointment-item empty-state">
                <h4>Faça login para ver sua agenda</h4>
                <p>Entre com seu e-mail para visualizar os agendamentos já realizados e acompanhar suas consultas.</p>
            </div>
        `;
    return;
  }

  if (visibleAppointments.length === 0) {
    list.innerHTML = `
            <div class="appointment-item empty-state">
                <h4>Nenhum agendamento encontrado</h4>
                <p>Você ainda não possui consultas registradas para este e-mail. Quando agendar, elas aparecerão aqui.</p>
            </div>
        `;
    return;
  }

  const userMessage = document.createElement("p");
  userMessage.textContent = `Mostrando agenda para: ${userEmail}`;
  userMessage.style.marginBottom = "16px";
  list.appendChild(userMessage);

  visibleAppointments.forEach((app) => {
    const item = document.createElement("div");
    item.className = `appointment-item ${app.status || "pending"}`;
    item.innerHTML = `
            <h4>${app.nome}</h4>
            <p><strong>Psicólogo:</strong> ${
              app.psicologo_name || "Não informado"
            }</p>
            <p><strong>Serviço:</strong> ${getServiceName(app.servico)}</p>
            <p><strong>Data:</strong> ${app.data || "-"} às ${
      app.hora || "-"
    }</p>
            <p><strong>Status:</strong> ${
              app.status === "confirmed" ? "Confirmado" : "Pendente"
            }</p>
            <p><strong>E-mail:</strong> ${app.email}</p>
            <p><strong>Telefone:</strong> ${app.telefone}</p>
            ${
              app.mensagem
                ? `<p><strong>Mensagem:</strong> ${app.mensagem}</p>`
                : ""
            }
        `;
    list.appendChild(item);
  });
}

// Reset form
function resetForm() {
  document.getElementById("servico").value = "";
  document.getElementById("nome").value = "";
  document.getElementById("email").value = "";
  document.getElementById("telefone").value = "";
  document.getElementById("mensagem").value = "";
  selectedPsychologistId = null;
  selectedSchedule = null;
  document.getElementById("selected-psychologist-name").textContent = "Nenhum";
  document.getElementById("confirm-psychologist").textContent = "-";
  document.getElementById("confirm-date").textContent = "-";
  document.getElementById("confirm-time").textContent = "-";
  showStep(1);
  renderSchedulePreview();
}

// Admin functions (redirect to admin.js)
function checkAdminAccess() {
  const adminLink = document.getElementById("admin-link");
  if (adminLink) {
    adminLink.style.display = "inline";
  }
}

function showAdmin() {
  window.location.href = "admin.html";
}

// Generate team profiles using Random User API
// Generate team profiles using Random User API
async function generateTeamProfiles() {
  try {
    const response = await fetch("https://randomuser.me/api/?results=4&nat=br");
    const data = await response.json();

    const users = data.results;

    const titles = [
      "Psicóloga Clínica",
      "Psicólogo Familiar",
      "Psicóloga Infantil",
      "Psicóloga Cognitiva",
    ];

    const specializations = [
      ["Ansiedade", "Depressão", "Terapia Cognitivo-Comportamental"],
      ["Terapia Familiar", "Relacionamentos", "Conflitos conjugais"],
      ["Psicologia Infantil", "Adolescentes", "Orientação emocional"],
      ["TCC", "Autoconhecimento", "Mindfulness"],
    ];

    psychologistDetails = users.map((user, index) => {
      const num = index + 1;

      const fullName = `${user.name.first} ${user.name.last}`;

      const profile = {
        name: `Dr(a). ${fullName}`,
        title: titles[index],
        crp: generateRandomCRP(),
        image: user.picture.large,
        bio: `Especialista em saúde emocional com ampla experiência clínica e atendimento humanizado.`,
        education: [
          "Graduação em Psicologia",
          "Especialização em Terapia Clínica",
          "Formação complementar em saúde mental",
        ],
        specializations: specializations[index],
        experience: [
          "Atendimento clínico presencial",
          "Atendimento online",
          "Acompanhamento emocional",
        ],
        approaches: [
          "Terapia Cognitivo-Comportamental",
          "Psicologia Humanista",
          "Mindfulness",
        ],
      };

      // Preencher cards
      document.getElementById(`img-${num}`).src = profile.image;
      document.getElementById(`img-${num}`).alt = profile.name;

      document.getElementById(`name-${num}`).textContent = profile.name;

      document.getElementById(
        `title-${num}`
      ).textContent = `${profile.title} (${profile.crp})`;

      document.getElementById(`bio-${num}`).textContent = profile.bio;

      return profile;
    });
  } catch (error) {
    console.error("Erro ao carregar equipe:", error);
  }
}

function setFallbackProfiles() {
  const profiles = [
    {
      img: "https://img.freepik.com/fotos-gratis/mulher-terapeuta-com-prancheta_23-2148759113.jpg",
      name: "Dra. Ana Silva",
      title: `Psicóloga clínica (${generateRandomCRP()})`,
      bio: "Profissional formada em psicologia pela USP e pós-graduação pela UniCatólica, com especialização em terapia cognitivo-comportamental, atendimento a adolescentes e orientação emocional.",
    },
    {
      img: "https://img.freepik.com/fotos-gratis/homem-terapeuta-sorridente_23-2148759114.jpg",
      name: "Dr. Carlos Souza",
      title: `Psicólogo (${generateRandomCRP()})`,
      bio: "Profissional formado em psicologia pela UFBA e pós-graduação pela Faculdade de Psicologia, com especialização em terapia de casal e orientação familiar.",
    },
    {
      img: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600",
      name: "Dra. Juliana Costa",
      title: `Psicóloga (${generateRandomCRP()})`,
      bio: "Profissional formada em psicologia pela UFRJ e pós-graduação pela Escola de Psicologia, com especialização em terapia cognitivo-comportamental e atendimento a adolescentes.",
    },
    {
      img: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600",
      name: "Dra. Fernanda Lima",
      title: `Psicóloga de Orientação Familiar (${generateRandomCRP()})`,
      bio: "Profissional formada em psicologia pela PUC-SP e com mestrado em terapia familiar, atuando no apoio a casais, famílias e jovens em transição de vida.",
    },
  ];

  profiles.forEach((profile, index) => {
    const num = index + 1;
    document.getElementById(`img-${num}`).src = profile.img;
    document.getElementById(`img-${num}`).alt = profile.name;
    document.getElementById(`name-${num}`).textContent = profile.name;
    document.getElementById(`title-${num}`).textContent = profile.title;
    document.getElementById(`bio-${num}`).textContent = profile.bio;
    document
      .getElementById(`equipe-${num}`)
      .insertAdjacentHTML(
        "beforeend",
        '<div class="badges"><span class="badge">CRP</span><span class="badge">Especialista</span></div>'
      );
  });
}

function generateRandomCRP() {
  const part1 = String(Math.floor(Math.random() * 90) + 10).padStart(2, "0");
  const part2 = String(Math.floor(Math.random() * 90000) + 10000).padStart(
    5,
    "0"
  );
  return `CRP ${part1}/${part2}`;
}

// Psychologist details data
let psychologistDetails = [];

// Show psychologist details modal
function showPsychologistDetails(index) {
  const psychologist = psychologistDetails[index - 1];

  const detailsHTML = `
        <div class="psychologist-detail">

            <img src="${psychologist.image}"
                 alt="${psychologist.name}"
                 style="display:block; margin:0 auto;">

            <h2>${psychologist.name}</h2>

            <p class="title">
                ${psychologist.title} - ${psychologist.crp}
            </p>

            <div class="detail-section">
                <h3>🎓 Formação</h3>

                <ul>
                    ${psychologist.education
                      .map((item) => `<li>${item}</li>`)
                      .join("")}
                </ul>
            </div>

            <div class="detail-section">
                <h3>🧠 Especialidades</h3>

                <ul>
                    ${psychologist.specializations
                      .map((item) => `<li>${item}</li>`)
                      .join("")}
                </ul>
            </div>

            <div class="detail-section">
                <h3>💼 Experiência</h3>

                <ul>
                    ${psychologist.experience
                      .map((item) => `<li>${item}</li>`)
                      .join("")}
                </ul>
            </div>

            <div class="detail-section">
                <h3>🔍 Abordagens Terapêuticas</h3>

                <ul>
                    ${psychologist.approaches
                      .map((item) => `<li>${item}</li>`)
                      .join("")}
                </ul>
            </div>

        </div>
    `;

  document.getElementById("psychologist-details").innerHTML = detailsHTML;
  document.getElementById("psychologist-modal").style.display = "block";
  document.body.style.overflow = "hidden";
}

// Close psychologist details modal
function closePsychologistModal() {
  document.getElementById("psychologist-modal").style.display = "none";
  document.body.style.overflow = "auto"; // Restore scrolling
}

// Scroll to specific section in modal
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// Close modal when clicking outside
window.onclick = function (event) {
  const modal = document.getElementById("psychologist-modal");
  if (event.target === modal) {
    closePsychologistModal();
  }
};

function selectTime(time) {
  selectedTime = time;

  // Update time buttons display
  const timeButtons = document.querySelectorAll(".time-button");
  timeButtons.forEach((button) => {
    button.classList.remove("selected");
    if (button.textContent === time) {
      button.classList.add("selected");
    }
  });

  // Update confirmation display
  updateSelectedAppointmentDisplay();
}

function updateSelectedAppointmentDisplay() {
  const confirmDate = document.getElementById("confirm-date");
  const confirmTime = document.getElementById("confirm-time");
  const confirmPsychologist = document.getElementById("confirm-psychologist");

  if (confirmDate && confirmTime) {
    confirmDate.textContent = selectedSchedule
      ? new Date(selectedSchedule.date).toLocaleDateString("pt-BR")
      : "-";
    confirmTime.textContent = selectedSchedule ? selectedSchedule.time : "-";
  }

  if (confirmPsychologist) {
    confirmPsychologist.textContent = selectedPsychologistId
      ? psychologists.find((p) => p.id === selectedPsychologistId)?.nome || "-"
      : "-";
  }
}
