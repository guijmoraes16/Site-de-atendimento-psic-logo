// Admin Panel JavaScript - admin.js
// Contains all administrative functionality for the clinic management system

// Admin variables
let currentUser = null;

// Staff data (in production, this would come from a secure backend)
const staff = JSON.parse(localStorage.getItem('staff')) || [
    { email: 'ana.silva@clinicaequilibrio.com', password: 'ana123', name: 'Dra. Ana Silva', role: 'Psicóloga' },
    { email: 'carlos.souza@clinicaequilibrio.com', password: 'carlos123', name: 'Dr. Carlos Souza', role: 'Psicólogo' },
    { email: 'juliana.costa@clinicaequilibrio.com', password: 'juliana123', name: 'Dra. Juliana Costa', role: 'Psicóloga' },
    { email: 'admin@clinicaequilibrio.com', password: 'admin123', name: 'Administrador', role: 'Admin' }
];

// Initialize admin page
function initAdminPage() {
    const loginForm = document.getElementById('admin-login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const savedUser = sessionStorage.getItem('current-user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showAdminPanel();
    }
}

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;
    const errorDiv = document.getElementById('login-error');

    const user = staff.find(s => s.email === email && s.password === password);

    if (user) {
        currentUser = user;
        sessionStorage.setItem('current-user', JSON.stringify(user));
        errorDiv.style.display = 'none';
        showAdminPanel();
    } else {
        errorDiv.textContent = 'Email ou senha incorretos.';
        errorDiv.style.display = 'block';
    }
}

// Logout admin user
function logoutAdmin() {
    currentUser = null;
    sessionStorage.removeItem('current-user');
    document.getElementById('admin-panel').style.display = 'none';
    document.getElementById('admin-login').style.display = 'block';
    document.getElementById('admin-login-form').reset();
}

// Show admin panel after successful login
function showAdminPanel() {
    document.getElementById('admin-login').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'block';

    // Show logged user information
    const userInfo = document.createElement('div');
    userInfo.className = 'user-info';
    userInfo.innerHTML = `
        <p><strong>Logado como:</strong> ${currentUser.name} (${currentUser.role})</p>
        <p><strong>Email:</strong> ${currentUser.email}</p>
    `;

    const panel = document.getElementById('admin-panel');
    const firstChild = panel.firstElementChild;
    panel.insertBefore(userInfo, firstChild);

    // Load all admin data
    loadAppointments();
    loadPendingAppointments();
    loadAdminAppointments();
    loadAvailableTimes();
    loadServiceManagement();
    loadScheduleControl();
    updateAdminSummary();
}

// Update admin summary statistics
function updateAdminSummary() {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    document.getElementById('total-count').textContent = appointments.length;
    document.getElementById('pending-count').textContent = appointments.filter(app => app.status === 'pending').length;
    document.getElementById('confirmed-count').textContent = appointments.filter(app => app.status === 'confirmed').length;
}

// Load service management section
function loadServiceManagement() {
    const services = JSON.parse(localStorage.getItem('services')) || [];
    const list = document.getElementById('services-admin-list');
    if (!list) return;
    list.innerHTML = '';

    services.forEach(service => {
        list.innerHTML += `
            <div class="service-card">
                <h4>${service.label}</h4>
                <p><strong>Preço:</strong> ${service.price}</p>
                <p><strong>Status:</strong> ${service.active ? 'Ativo' : 'Desativado'}</p>
                <button onclick="toggleServiceActive('${service.key}')">${service.active ? 'Desativar' : 'Ativar'}</button>
            </div>
        `;
    });
}

// Toggle service active status
function toggleServiceActive(serviceKey) {
    const services = JSON.parse(localStorage.getItem('services')) || [];
    const service = services.find(s => s.key === serviceKey);
    if (!service) return;
    service.active = !service.active;
    localStorage.setItem('services', JSON.stringify(services));
    loadServiceManagement();
    updateServiceOptions();
}

// Update service options in booking form
function updateServiceOptions() {
    const services = JSON.parse(localStorage.getItem('services')) || [];
    const select = document.getElementById('servico');
    if (!select) return;

    services.forEach(service => {
        const option = select.querySelector(`option[value="${service.key}"]`);
        if (option) {
            option.disabled = !service.active;
            option.textContent = `${service.label}${service.active ? '' : ' (Indisponível)'}`;
        }
    });
}

// Load admin appointments list
function loadAdminAppointments() {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const list = document.getElementById('appointments-admin-list');
    if (!list) return;
    list.innerHTML = '';

    if (appointments.length === 0) {
        list.innerHTML = '<p>Nenhum agendamento registrado.</p>';
        return;
    }

    appointments.forEach(app => {
        list.innerHTML += `
            <div class="appointment-admin-item ${app.status}">
                <h4>${app.nome}</h4>
                <p><strong>Serviço:</strong> ${getServiceName(app.servico)}</p>
                <p><strong>Data:</strong> ${app.data} às ${app.hora}</p>
                <p><strong>Status:</strong> ${app.status === 'pending' ? 'Pendente' : 'Confirmado'}</p>
                <p><strong>Email:</strong> ${app.email}</p>
                <p><strong>Telefone:</strong> ${app.telefone}</p>
                ${app.mensagem ? `<p><strong>Mensagem:</strong> ${app.mensagem}</p>` : ''}
                <button onclick="confirmAppointment(${app.id})">Confirmar</button>
                <button class="secondary-button" onclick="cancelAppointment(${app.id})">Cancelar</button>
            </div>
        `;
    });
}

// Cancel appointment
function cancelAppointment(id) {
    let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    appointments = appointments.filter(a => a.id !== id);
    localStorage.setItem('appointments', JSON.stringify(appointments));
    loadAppointments();
    loadAdminAppointments();
    loadPendingAppointments();
    updateAdminSummary();
}

// Load schedule control with filtering
function loadScheduleControl() {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const container = document.getElementById('schedule-control-list');
    if (!container) return;
    const filterDate = document.getElementById('schedule-filter-date').value;
    let filteredAppointments = appointments;

    if (filterDate) {
        filteredAppointments = appointments.filter(app => app.data === filterDate);
    }

    container.innerHTML = '';
    if (filteredAppointments.length === 0) {
        container.innerHTML = `<p>${filterDate ? `Nenhum agendamento encontrado para ${filterDate}.` : 'Nenhum agendamento registrado.'}</p>`;
        return;
    }

    const sorted = filteredAppointments.slice().sort((a, b) => {
        if (a.data === b.data) return a.hora.localeCompare(b.hora);
        return a.data.localeCompare(b.data);
    });

    sorted.forEach(app => {
        container.innerHTML += `
            <div class="appointment-admin-item ${app.status}">
                <h4>${app.nome}</h4>
                <p><strong>Data:</strong> ${app.data}</p>
                <p><strong>Horário:</strong> ${app.hora}</p>
                <p><strong>Serviço:</strong> ${getServiceName(app.servico)}</p>
                <p><strong>Status:</strong> ${app.status === 'pending' ? 'Pendente' : 'Confirmado'}</p>
                <p><strong>Contato:</strong> ${app.telefone} | ${app.email}</p>
                <div class="admin-actions">
                    <button onclick="confirmAppointment(${app.id})">Confirmar</button>
                    <button class="secondary-button" onclick="cancelAppointment(${app.id})">Cancelar</button>
                </div>
            </div>
        `;
    });
}

// Reset schedule filter
function resetScheduleFilter() {
    const filterInput = document.getElementById('schedule-filter-date');
    if (filterInput) filterInput.value = '';
    loadScheduleControl();
}

// Add available time slot
function addAvailableTime() {
    const availableTimes = JSON.parse(localStorage.getItem('availableTimes')) || [];
    const date = document.getElementById('admin-data').value;
    const time = document.getElementById('admin-hora').value;
    if (!date || !time) return;

    let day = availableTimes.find(at => at.date === date);
    if (!day) {
        day = { date, times: [] };
        availableTimes.push(day);
    }
    if (!day.times.includes(time)) {
        day.times.push(time);
        localStorage.setItem('availableTimes', JSON.stringify(availableTimes));
        loadAvailableTimes();
    }
}

// Remove available time slot
function removeAvailableTime() {
    const availableTimes = JSON.parse(localStorage.getItem('availableTimes')) || [];
    const date = document.getElementById('admin-data').value;
    const time = document.getElementById('admin-hora').value;
    if (!date || !time) return;

    const day = availableTimes.find(at => at.date === date);
    if (day) {
        day.times = day.times.filter(t => t !== time);
        localStorage.setItem('availableTimes', JSON.stringify(availableTimes));
        loadAvailableTimes();
    }
}

// Load pending appointments
function loadPendingAppointments() {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const list = document.getElementById('pending-appointments');
    if (!list) return;
    list.innerHTML = '<h4>Consultas Pendentes</h4>';
    const pending = appointments.filter(app => app.status === 'pending');
    pending.forEach(app => {
        list.innerHTML += `
            <div class="appointment-item pending">
                <p><strong>${app.nome}</strong> - ${app.data} ${app.hora}</p>
                <button onclick="confirmAppointment(${app.id})">Confirmar</button>
            </div>
        `;
    });
}

// Confirm appointment
function confirmAppointment(id) {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const app = appointments.find(a => a.id === id);
    if (app) {
        app.status = 'confirmed';
        localStorage.setItem('appointments', JSON.stringify(appointments));
        loadAppointments();
        loadAdminAppointments();
        loadPendingAppointments();
        loadScheduleControl();
        updateAdminSummary();
    }
}

// Get service name from key
function getServiceName(service) {
    const services = {
        individual: 'Terapia Individual',
        casal: 'Terapia de Casal',
        online: 'Atendimento Online',
        orientacao: 'Orientação Psicológica'
    };
    return services[service] || service;
}

// Load available times for display
function loadAvailableTimes() {
    const availableTimes = JSON.parse(localStorage.getItem('availableTimes')) || [];
    const list = document.getElementById('available-times');
    const adminList = document.getElementById('available-times-admin');

    if (list) {
        list.innerHTML = '<h4>Horários Disponíveis</h4>';
        availableTimes.forEach(at => {
            list.innerHTML += `<p><strong>${at.date}:</strong> ${at.times.join(', ')}</p>`;
        });
    }

    if (adminList) {
        adminList.innerHTML = '';
        availableTimes.forEach(at => {
            adminList.innerHTML += `
                <div class="available-time-item">
                    <p><strong>${at.date}:</strong> ${at.times.join(', ')}</p>
                </div>
            `;
        });
    }
}

// Load appointments list (shared with main script)
function loadAppointments() {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const list = document.getElementById('appointments-list');
    if (!list) return;
    list.innerHTML = '';

    appointments.forEach(app => {
        const item = document.createElement('div');
        item.className = `appointment-item ${app.status}`;
        item.innerHTML = `
            <h4>${app.nome}</h4>
            <p><strong>Serviço:</strong> ${getServiceName(app.servico)}</p>
            <p><strong>Data:</strong> ${app.data} às ${app.hora}</p>
            <p><strong>Status:</strong> ${app.status === 'pending' ? 'Pendente' : 'Confirmado'}</p>
            <p><strong>Email:</strong> ${app.email}</p>
            <p><strong>Telefone:</strong> ${app.telefone}</p>
            ${app.mensagem ? `<p><strong>Mensagem:</strong> ${app.mensagem}</p>` : ''}
        `;
        list.appendChild(item);
    });
}

// Check admin access (for navigation)
function checkAdminAccess() {
    const adminLink = document.getElementById('admin-link');
    if (adminLink) {
        adminLink.style.display = 'inline';
    }
}

// Redirect to admin page
function showAdmin() {
    window.location.href = 'admin.html';
}