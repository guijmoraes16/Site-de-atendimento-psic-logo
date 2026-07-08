// URL base da sua API backend
const API_URL = 'http://127.0.0.1:8000';

async function requestAdminJson(path, options = {}) {
    const response = await fetch(`${API_URL}${path}`, {
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

let adminPsychologists = JSON.parse(localStorage.getItem('admin_psychologists')) || [];
let adminServices = JSON.parse(localStorage.getItem('admin_services')) || [];
let adminSchedules = JSON.parse(localStorage.getItem('admin_schedules')) || [];
let adminAppointments = JSON.parse(localStorage.getItem('admin_appointments')) || [];

// Executa assim que a página carrega
document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacao();
    
    const loginForm = document.getElementById('admin-login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', realizarLogin);
    }
});

// Função para fazer a requisição de login
async function realizarLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('admin-email').value;
    const senha = document.getElementById('admin-password').value;
    const erroDiv = document.getElementById('login-error');
    
    erroDiv.style.display = 'none';

    try {
        const data = await requestAdminJson('/usuarios/login', {
            method: 'POST',
            body: JSON.stringify({ email, senha })
        });

        // Salva o token com segurança no navegador
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('token_type', data.token_type);

        // Atualiza a tela para exibir o painel
        verificarAutenticacao();
        alert("Login Sucedido")

    } catch (error) {
        erroDiv.innerText = error.message;
        erroDiv.style.display = 'block';
    }
}

// Função que checa se o usuário está logado e alterna as telas
function verificarAutenticacao() {
    const token = localStorage.getItem('access_token');
    const loginSection = document.getElementById('admin-login');
    const panelSection = document.getElementById('admin-panel');

    if (token) {
        loginSection.style.display = 'none';
        panelSection.style.display = 'block';
        setAdminTab('patients');
        carregarDadosDoPainel();
    } else {
        loginSection.style.display = 'block';
        panelSection.style.display = 'none';
    }
}

// Função para fazer logout
function logoutAdmin() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    verificarAutenticacao();
}

function showAdminFeedback(message, type = 'success') {
    const feedback = document.getElementById('admin-feedback');
    if (!feedback) return;
    feedback.textContent = message;
    feedback.style.display = 'block';
    feedback.style.color = type === 'error' ? '#c0392b' : '#155724';
    feedback.style.backgroundColor = type === 'error' ? '#f8d7da' : '#d4edda';
    feedback.style.border = type === 'error' ? '1px solid #f5c6cb' : '1px solid #c3e6cb';
    feedback.style.padding = '12px';
    setTimeout(() => {
        feedback.style.display = 'none';
    }, 4500);
}

async function createPatient() {
    const nome = document.getElementById('patient-name').value.trim();
    const email = document.getElementById('patient-email').value.trim();
    const telefone = document.getElementById('patient-phone').value.trim();
    const senha = document.getElementById('patient-password').value.trim();
    const token = localStorage.getItem('access_token');

    if (!nome || !email || !telefone || !senha) {
        showAdminFeedback('Preencha todos os campos do paciente.', 'error');
        return;
    }

    try {
        const paciente = await requestAdminJson('/usuarios', {
            method: 'POST',
            headers: {
                'Authorization': token ? `Bearer ${token}` : ''
            },
            body: JSON.stringify({ nome, email, telefone, senha })
        });
        showAdminFeedback('Paciente cadastrado com sucesso.');
        document.getElementById('patient-name').value = '';
        document.getElementById('patient-email').value = '';
        document.getElementById('patient-phone').value = '';
        document.getElementById('patient-password').value = '';
        carregarPacientes();
    } catch (error) {
        showAdminFeedback(error.message || 'Falha ao cadastrar paciente.', 'error');
    }
}

async function carregarPacientes() {
    const token = localStorage.getItem('access_token');
    try {
        const data = await requestAdminJson('/usuarios', {
            headers: {
                'Authorization': token ? `Bearer ${token}` : ''
            }
        });
        const pacientes = Array.isArray(data) ? data : data.objetos || [];
        const list = document.getElementById('patient-admin-list');
        if (!list) return;
        if (pacientes.length === 0) {
            list.innerHTML = '<p>Nenhum paciente cadastrado.</p>';
        } else {
            list.innerHTML = pacientes.map(paciente => `
                <div class="service-card">
                    <strong>${paciente.nome}</strong><br>
                    <span>${paciente.email}</span><br>
                    <span>${paciente.telefone || 'Telefone não informado'}</span>
                </div>
            `).join('');
        }
        document.getElementById('patient-count').textContent = pacientes.length;
    } catch (error) {
        showAdminFeedback(error.message || 'Erro ao carregar pacientes.', 'error');
    }
}

function carregarDadosDoPainel() {
    carregarResumoLocal();
    atualizarSchedulePsychologistSelect();
    renderPatients();
    renderPsychologists();
    renderServices();
    renderSchedules();
    renderAppointments();
}

function carregarResumoLocal() {
    document.getElementById('total-count').textContent = adminAppointments.length;
    document.getElementById('patient-count').textContent = adminPatientsCount();
    document.getElementById('psychologist-count').textContent = adminPsychologists.length;
}

function adminPatientsCount() {
    return document.querySelectorAll('#patient-admin-list .service-card').length || 0;
}

function atualizarSchedulePsychologistSelect() {
    const select = document.getElementById('schedule-psychologist');
    if (!select) return;
    select.innerHTML = '<option value="">Selecione um psicólogo</option>' + adminPsychologists.map(psicologo => `
        <option value="${psicologo.id}">${psicologo.nome}</option>
    `).join('');
}

function renderPatients() {
    const list = document.getElementById('patient-admin-list');
    if (!list) return;
    list.innerHTML = adminPsychologists.length === 0 && list.innerHTML.trim() === '' ? '<p>Nenhum paciente local cadastrado ainda.</p>' : list.innerHTML;
}

function renderPsychologists() {
    const list = document.getElementById('psychologist-admin-list');
    if (!list) return;
    list.innerHTML = adminPsychologists.length > 0 ? adminPsychologists.map(psicologo => `
        <div class="service-card">
            <strong>${psicologo.nome}</strong><br>
            <span>${psicologo.titulo || ''}</span><br>
            <span>${psicologo.bio || ''}</span>
        </div>
    `).join('') : '<p>Nenhum psicólogo cadastrado.</p>';
}

function renderServices() {
    const list = document.getElementById('service-admin-list');
    if (!list) return;
    list.innerHTML = adminServices.length > 0 ? adminServices.map(servico => `
        <div class="service-card">
            <strong>${servico.nome}</strong><br>
            <span>${servico.descricao || ''}</span><br>
            <span>${servico.valor || ''}</span><br>
            <span>${servico.modalidade || ''}</span>
        </div>
    `).join('') : '<p>Nenhum serviço cadastrado.</p>';
}

function renderSchedules() {
    const list = document.getElementById('schedule-admin-list');
    if (!list) return;
    list.innerHTML = adminSchedules.length > 0 ? adminSchedules.map(agenda => `
        <div class="service-card">
            <strong>${agenda.psicologoNome || 'Psicólogo não informado'}</strong><br>
            <span>${agenda.data} às ${agenda.hora}</span>
        </div>
    `).join('') : '<p>Nenhum horário cadastrado.</p>';
}

function renderAppointments() {
    const list = document.getElementById('appointments-admin-list');
    if (!list) return;
    list.innerHTML = adminAppointments.length > 0 ? adminAppointments.map(app => `
        <div class="service-card">
            <strong>${app.nome}</strong> - ${app.email}<br>
            <span>${app.servico || ''}</span><br>
            <span>${app.data || ''} às ${app.hora || ''}</span>
        </div>
    `).join('') : '<p>Nenhum agendamento registrado.</p>';
}

function saveAdminData() {
    localStorage.setItem('admin_psychologists', JSON.stringify(adminPsychologists));
    localStorage.setItem('admin_services', JSON.stringify(adminServices));
    localStorage.setItem('admin_schedules', JSON.stringify(adminSchedules));
    localStorage.setItem('admin_appointments', JSON.stringify(adminAppointments));
}

async function createPsychologist() {
    const nome = document.getElementById('psychologist-name').value.trim();
    const titulo = document.getElementById('psychologist-title').value.trim();
    const bio = document.getElementById('psychologist-bio').value.trim();
    const foto = document.getElementById('psychologist-photo').value.trim();

    if (!nome || !titulo) {
        showAdminFeedback('Informe nome e título do psicólogo.', 'error');
        return;
    }

    const novoPsicologo = {
        id: Date.now(),
        nome,
        titulo,
        bio,
        foto,
    };
    adminPsychologists.push(novoPsicologo);
    saveAdminData();
    atualizarSchedulePsychologistSelect();
    renderPsychologists();
    document.getElementById('psychologist-name').value = '';
    document.getElementById('psychologist-title').value = '';
    document.getElementById('psychologist-bio').value = '';
    document.getElementById('psychologist-photo').value = '';
    showAdminFeedback('Psicólogo cadastrado localmente.', 'success');
}

async function createService() {
    const nome = document.getElementById('service-name').value.trim();
    const descricao = document.getElementById('service-description').value.trim();
    const valor = document.getElementById('service-price').value.trim();
    const modalidade = document.getElementById('service-modality').value.trim();

    if (!nome || !descricao) {
        showAdminFeedback('Informe nome e descrição do serviço.', 'error');
        return;
    }

    const novoServico = {
        id: Date.now(),
        nome,
        descricao,
        valor,
        modalidade,
    };
    adminServices.push(novoServico);
    saveAdminData();
    renderServices();
    document.getElementById('service-name').value = '';
    document.getElementById('service-description').value = '';
    document.getElementById('service-price').value = '';
    document.getElementById('service-modality').value = '';
    showAdminFeedback('Serviço cadastrado localmente.', 'success');
}

async function createSchedule() {
    const psicologoId = parseInt(document.getElementById('schedule-psychologist').value, 10);
    const data = document.getElementById('schedule-date').value;
    const hora = document.getElementById('schedule-time').value;

    if (!psicologoId || !data || !hora) {
        showAdminFeedback('Preencha psicólogo, data e horário.', 'error');
        return;
    }

    const psicologo = adminPsychologists.find(item => item.id === psicologoId);
    const novoHorario = {
        id: Date.now(),
        psicologoId,
        psicologoNome: psicologo ? psicologo.nome : 'Psicólogo sem nome',
        data,
        hora,
    };
    adminSchedules.push(novoHorario);
    saveAdminData();
    renderSchedules();
    document.getElementById('schedule-date').value = '';
    document.getElementById('schedule-time').value = '';
    document.getElementById('schedule-psychologist').value = '';
    showAdminFeedback('Horário cadastrado localmente.', 'success');
}

function setAdminTab(tabName) {
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.toggle('active', button.dataset.tab === tabName);
    });
    document.querySelectorAll('.admin-tab').forEach(section => {
        section.style.display = section.id === `tab-${tabName}` ? 'block' : 'none';
    });

    if (tabName === 'patients') {
        carregarPacientes();
    } else if (tabName === 'psychologists') {
        renderPsychologists();
    } else if (tabName === 'services') {
        renderServices();
    } else if (tabName === 'schedules') {
        renderSchedules();
    } else if (tabName === 'appointments') {
        renderAppointments();
    }
}
