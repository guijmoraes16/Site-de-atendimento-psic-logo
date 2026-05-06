// Global variables
let currentStep = 1;
let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
let services = JSON.parse(localStorage.getItem('services')) || [
    { key: 'individual', label: 'Terapia Individual', price: 'R$ 120', active: true },
    { key: 'casal', label: 'Terapia de Casal', price: 'R$ 180', active: true },
    { key: 'online', label: 'Atendimento Online', price: 'R$ 100', active: true },
    { key: 'orientacao', label: 'Orientação Psicológica', price: 'R$ 80', active: true }
];

// Selected date and time
let selectedDate = null;
let selectedTime = null;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('equipe')) {
        generateTeamProfiles();
    }

    if (document.getElementById('agendamento-intro')) {
        showStep(1);
        loadAppointments();
        loadAvailableTimes();
        updateServiceOptions();
        generateCalendar();
    }

    if (document.getElementById('admin-page')) {
        // Load admin script dynamically
        const script = document.createElement('script');
        script.src = 'admin.js';
        script.onload = function() {
            initAdminPage();
        };
        document.head.appendChild(script);
    }

    checkAdminAccess();
});

// Multi-step form functions
function showStep(step) {
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    document.getElementById(`step-${step}`).classList.add('active');
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
        return document.getElementById('servico').value !== '';
    } else if (step === 2) {
        return document.getElementById('nome').value !== '' &&
               document.getElementById('email').value !== '' &&
               document.getElementById('telefone').value !== '';
    } else if (step === 3) {
        return selectedDate !== null && selectedTime !== null;
    }
    return true;
}

// Random User API
async function generateRandomUser() {
    try {
        const response = await fetch('https://randomuser.me/api/');
        const data = await response.json();
        const user = data.results[0];
        document.getElementById('nome').value = `${user.name.first} ${user.name.last}`;
        document.getElementById('email').value = user.email;
        document.getElementById('telefone').value = user.phone;
    } catch (error) {
        showFeedback('Erro ao gerar dados aleatórios', 'error');
    }
}

// Submit form
function submitForm() {
    if (!validateStep(3)) return;

    const formData = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
        servico: document.getElementById('servico').value,
        data: selectedDate,
        hora: selectedTime,
        mensagem: document.getElementById('mensagem').value,
        status: 'pending',
        id: Date.now()
    };

    // Check if time is available
    if (!isTimeAvailable(formData.data, formData.hora)) {
        showFeedback('Horário não disponível', 'error');
        return;
    }

    appointments.push(formData);
    localStorage.setItem('appointments', JSON.stringify(appointments));
    localStorage.setItem('last-user-email', formData.email);

    showConfirmation(formData);
    loadAppointments();
    resetForm();
    showFeedback('Agendamento realizado com sucesso!', 'success');
}

// Check if time is available
function isTimeAvailable(date, time) {
    const existing = appointments.find(app => app.data === date && app.hora === time);
    if (existing) return false;

    const available = availableTimes.find(at => at.date === date);
    return available && available.times.includes(time);
}

// Show confirmation
function showConfirmation(data) {
    const content = `
        <h3>Consulta agendada com sucesso!</h3>
        <p><strong>Nome:</strong> ${data.nome}</p>
        <p><strong>Data:</strong> ${data.data}</p>
        <p><strong>Hora:</strong> ${data.hora}</p>
        <p><strong>Serviço:</strong> ${getServiceName(data.servico)}</p>
        <p><strong>Status:</strong> Pendente</p>
    `;
    document.getElementById('confirmacao-content').innerHTML = content;
    document.getElementById('confirmacao').style.display = 'block';
    showFeedback('Agendamento realizado com sucesso!', 'success');
}

// Get service name
function getServiceName(service) {
    const services = {
        individual: 'Terapia Individual',
        casal: 'Terapia de Casal',
        online: 'Atendimento Online',
        orientacao: 'Orientação Psicológica'
    };
    return services[service] || service;
}

// Load appointments
function loadAppointments() {
    const list = document.getElementById('appointments-list');
    if (!list) return;
    list.innerHTML = '';

    const userEmail = localStorage.getItem('last-user-email');
    const visibleAppointments = userEmail
        ? appointments.filter(app => app.email === userEmail)
        : appointments;

    if (visibleAppointments.length === 0) {
        const message = userEmail
            ? 'Você ainda não tem agendamentos registrados com este email.'
            : 'Nenhum agendamento registrado.';
        list.innerHTML = `<p>${message}</p>`;
        return;
    }

    if (userEmail) {
        const userMessage = document.createElement('p');
        userMessage.textContent = `Mostrando agenda para: ${userEmail}`;
        userMessage.style.marginBottom = '16px';
        list.appendChild(userMessage);
    }

    visibleAppointments.forEach(app => {
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

// Reset form
function resetForm() {
    document.getElementById('servico').value = '';
    document.getElementById('nome').value = '';
    document.getElementById('email').value = '';
    document.getElementById('telefone').value = '';
    document.getElementById('mensagem').value = '';
    showStep(1);

    // Reset selected date and time
    selectedDate = null;
    selectedTime = null;
    updateSelectedAppointmentDisplay();
    generateCalendar(); // Regenerate calendar to clear selections
}

// Show feedback
function showFeedback(message, type) {
    // Simple alert replacement - in a real app, use a toast library
    alert(message);
}

// Admin functions (redirect to admin.js)
function checkAdminAccess() {
    const adminLink = document.getElementById('admin-link');
    if (adminLink) {
        adminLink.style.display = 'inline';
    }
}

function showAdmin() {
    window.location.href = 'admin.html';
}

function loadAvailableTimes() {
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

function updateServiceOptions() {
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

// Generate team profiles using Random User API
async function generateTeamProfiles() {
    try {
        const response = await fetch('https://randomuser.me/api/?results=3&nat=br');
        const data = await response.json();
        const users = data.results;

        const titles = ['Psicóloga clínica', 'Psicólogo', 'Psicóloga'];
        const bios = [
            'Profissional formada em psicologia pela USP e pós-graduação pela UniCatólica, com especialização em terapia cognitivo-comportamental, atendimento a adolescentes e orientação emocional.',
            'Profissional formado em psicologia pela UFBA e pós-graduação pela Faculdade de Psicologia, com especialização em terapia de casal e orientação familiar.',
            'Profissional formada em psicologia pela UFRJ e pós-graduação pela Escola de Psicologia, com especialização em terapia cognitivo-comportamental e atendimento a adolescentes.'
        ];

        users.forEach((user, index) => {
            const num = index + 1;
            document.getElementById(`img-${num}`).src = user.picture.large;
            document.getElementById(`img-${num}`).alt = `Dr(a). ${user.name.first} ${user.name.last}`;
            // Use consistent names for the detailed profiles
            const consistentNames = ['Ana Silva', 'Carlos Souza', 'Juliana Costa'];
            document.getElementById(`name-${num}`).textContent = `Dr(a). ${consistentNames[index]}`;
            document.getElementById(`title-${num}`).textContent = `${titles[index]} (${generateRandomCRP()})`;
            document.getElementById(`bio-${num}`).textContent = bios[index];
        });
    } catch (error) {
        console.error('Erro ao gerar perfis da equipe:', error);
        // Fallback to static profiles if API fails
        setFallbackProfiles();
    }
}

function setFallbackProfiles() {
    const profiles = [
        {
            img: 'https://img.freepik.com/fotos-gratis/mulher-terapeuta-com-prancheta_23-2148759113.jpg',
            name: 'Dra. Ana Silva',
            title: `Psicóloga clínica (${generateRandomCRP()})`,
            bio: 'Profissional formada em psicologia pela USP e pós-graduação pela UniCatólica, com especialização em terapia cognitivo-comportamental, atendimento a adolescentes e orientação emocional.'
        },
        {
            img: 'https://img.freepik.com/fotos-gratis/homem-terapeuta-sorridente_23-2148759114.jpg',
            name: 'Dr. Carlos Souza',
            title: `Psicólogo (${generateRandomCRP()})`,
            bio: 'Profissional formado em psicologia pela UFBA e pós-graduação pela Faculdade de Psicologia, com especialização em terapia de casal e orientação familiar.'
        },
        {
            img: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600',
            name: 'Dra. Juliana Costa',
            title: `Psicóloga (${generateRandomCRP()})`,
            bio: 'Profissional formada em psicologia pela UFRJ e pós-graduação pela Escola de Psicologia, com especialização em terapia cognitivo-comportamental e atendimento a adolescentes.'
        }
    ];

    profiles.forEach((profile, index) => {
        const num = index + 1;
        document.getElementById(`img-${num}`).src = profile.img;
        document.getElementById(`img-${num}`).alt = profile.name;
        document.getElementById(`name-${num}`).textContent = profile.name;
        document.getElementById(`title-${num}`).textContent = profile.title;
        document.getElementById(`bio-${num}`).textContent = profile.bio;
    });
}

function generateRandomCRP() {
    const part1 = String(Math.floor(Math.random() * 90) + 10).padStart(2, '0');
    const part2 = String(Math.floor(Math.random() * 90000) + 10000).padStart(5, '0');
    return `CRP ${part1}/${part2}`;
}

// Psychologist details data
const psychologistDetails = [
    {
        name: "Dra. Ana Silva",
        title: "Psicóloga Clínica",
        crp: "CRP 06/12345",
        education: [
            "Graduação em Psicologia - USP (Universidade de São Paulo)",
            "Pós-graduação em Terapia Cognitivo-Comportamental - UniCatólica",
            "Especialização em Psicologia Clínica - SBP (Sociedade Brasileira de Psicologia)"
        ],
        specializations: [
            "Terapia Cognitivo-Comportamental (TCC)",
            "Atendimento a adolescentes e jovens adultos",
            "Orientação emocional e desenvolvimento pessoal",
            "Ansiedade e depressão",
            "Transtornos de humor"
        ],
        experience: [
            "8 anos de experiência clínica",
            "Supervisora de estágio em psicologia",
            "Palestrante em eventos sobre saúde mental",
            "Atendimento em clínicas particulares e instituições"
        ],
        approaches: [
            "Terapia Cognitivo-Comportamental",
            "Abordagem Humanista",
            "Psicologia Positiva",
            "Mindfulness e técnicas de relaxamento"
        ]
    },
    {
        name: "Dr. Carlos Souza",
        title: "Psicólogo",
        crp: "CRP 07/23456",
        education: [
            "Graduação em Psicologia - UFBA (Universidade Federal da Bahia)",
            "Pós-graduação em Terapia de Casal e Família - Faculdade de Psicologia",
            "Especialização em Psicologia Sistêmica - ABRAPSI (Associação Brasileira de Psicologia Sistêmica)"
        ],
        specializations: [
            "Terapia de Casal e Família",
            "Orientação familiar e conflitos conjugais",
            "Psicologia do desenvolvimento",
            "Transtornos relacionais",
            "Mediação familiar"
        ],
        experience: [
            "10 anos de experiência em terapia familiar",
            "Coordenador de grupos de apoio familiar",
            "Consultor em empresas para programas de qualidade de vida",
            "Atendimento em centros de saúde mental"
        ],
        approaches: [
            "Terapia Sistêmica",
            "Terapia Cognitivo-Comportamental",
            "Abordagem Familiar Estrutural",
            "Técnicas de comunicação não-violenta"
        ]
    },
    {
        name: "Dra. Juliana Costa",
        title: "Psicóloga",
        crp: "CRP 08/34567",
        education: [
            "Graduação em Psicologia - UFRJ (Universidade Federal do Rio de Janeiro)",
            "Pós-graduação em Terapia Cognitivo-Comportamental - Escola de Psicologia",
            "Especialização em Neuropsicologia - ABNeuro (Associação Brasileira de Neuropsicologia)"
        ],
        specializations: [
            "Terapia Cognitivo-Comportamental",
            "Neuropsicologia e avaliação cognitiva",
            "Atendimento a adolescentes e jovens",
            "Transtornos de aprendizagem",
            "Orientação vocacional"
        ],
        experience: [
            "7 anos de experiência clínica especializada",
            "Avaliadora neuropsicológica em instituições educacionais",
            "Orientadora vocacional em centros universitários",
            "Pesquisadora em psicologia do desenvolvimento"
        ],
        approaches: [
            "Terapia Cognitivo-Comportamental",
            "Neuropsicologia",
            "Abordagem Desenvolvimento",
            "Orientação Vocacional Sistemática"
        ]
    }
];

// Show psychologist details modal
function showPsychologistDetails(index) {
    const psychologist = psychologistDetails[index - 1];

    // Use specific images for women
    let imgSrc;
    if (psychologist.name.includes('Ana') || psychologist.name.includes('Juliana')) {
        // Use a professional woman image for female psychologists
        imgSrc = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80';
    } else {
        // Use a professional man image for male psychologists
        imgSrc = 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80';
    }

    const detailsHTML = `
        <div class="psychologist-detail">
            <img src="${imgSrc}" alt="${psychologist.name}" style="display: block; margin: 0 auto;">
            <h2>${psychologist.name}</h2>
            <p class="title">${psychologist.title} - ${psychologist.crp}</p>

            <div class="scroll-controls" style="text-align: center; margin-bottom: 20px;">
                <button onclick="scrollToSection('education')" class="scroll-btn">📚 Formação</button>
                <button onclick="scrollToSection('specializations')" class="scroll-btn">🧠 Especialidades</button>
                <button onclick="scrollToSection('experience')" class="scroll-btn">💼 Experiência</button>
                <button onclick="scrollToSection('approaches')" class="scroll-btn">🔍 Abordagens</button>
            </div>

            <div id="education" class="detail-section">
                <h3>🎓 Formação Acadêmica</h3>
                <ul>
                    ${psychologist.education.map(edu => `<li>${edu}</li>`).join('')}
                </ul>
            </div>

            <div id="specializations" class="detail-section">
                <h3>🧠 Especialidades</h3>
                <ul>
                    ${psychologist.specializations.map(spec => `<li>${spec}</li>`).join('')}
                </ul>
            </div>

            <div id="experience" class="detail-section">
                <h3>💼 Experiência Profissional</h3>
                <ul>
                    ${psychologist.experience.map(exp => `<li>${exp}</li>`).join('')}
                </ul>
            </div>

            <div id="approaches" class="detail-section">
                <h3>🔍 Abordagens Terapêuticas</h3>
                <ul>
                    ${psychologist.approaches.map(app => `<li>${app}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;

    document.getElementById('psychologist-details').innerHTML = detailsHTML;
    document.getElementById('psychologist-modal').style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

// Close psychologist details modal
function closePsychologistModal() {
    document.getElementById('psychologist-modal').style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
}

// Scroll to specific section in modal
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('psychologist-modal');
    if (event.target === modal) {
        closePsychologistModal();
    }
}

// Backend integration note
/*
Para integrar com backend, substitua localStorage por chamadas API:

- Salvar agendamento: POST /api/appointments
- Listar agendamentos: GET /api/appointments
- Confirmar agendamento: PUT /api/appointments/{id}/confirm

Exemplo:
async function saveAppointment(data) {
    const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
}
*/

// Calendar functions
function generateCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
    if (!calendarGrid) return;

    calendarGrid.innerHTML = '';

    // Get next 21 days starting from today, but skip Sundays
    const today = new Date();
    let daysAdded = 0;
    let currentDate = new Date(today);

    while (daysAdded < 14) {
        // Skip Sundays (0 = Sunday)
        if (currentDate.getDay() !== 0) {
            const dateString = currentDate.toISOString().split('T')[0];
            const dayName = currentDate.toLocaleDateString('pt-BR', { weekday: 'short' });
            const dayNumber = currentDate.getDate();
            const monthName = currentDate.toLocaleDateString('pt-BR', { month: 'short' });
            const dayOfWeek = currentDate.getDay(); // 1 = Monday, 6 = Saturday

            // Generate available times based on day of week
            let availableTimesForDay = [];
            if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Monday to Friday
                availableTimesForDay = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
            } else if (dayOfWeek === 6) { // Saturday
                availableTimesForDay = ['09:00', '10:00', '11:00'];
            }

            // Check if this date has available times (considering existing appointments)
            const existingAppointments = appointments.filter(app => app.data === dateString);
            const availableTimesFiltered = availableTimesForDay.filter(time =>
                !existingAppointments.some(app => app.hora === time)
            );

            const isAvailable = availableTimesFiltered.length > 0;
            const isSelected = selectedDate === dateString;

            const dayElement = document.createElement('div');
            dayElement.className = `calendar-day ${isAvailable ? 'available' : 'unavailable'} ${isSelected ? 'selected' : ''}`;
            dayElement.innerHTML = `
                <div>${dayName}</div>
                <div style="font-size: 24px; font-weight: bold;">${dayNumber}</div>
                <div style="font-size: 12px;">${monthName}</div>
            `;

            if (isAvailable) {
                dayElement.onclick = () => selectDate(dateString);
            }

            calendarGrid.appendChild(dayElement);
            daysAdded++;
        }

        currentDate.setDate(currentDate.getDate() + 1);
    }
}

function selectDate(dateString) {
    selectedDate = dateString;
    selectedTime = null; // Reset time when date changes

    // Update calendar display
    generateCalendar();

    // Show time slots for selected date
    showTimeSlots(dateString);

    // Update confirmation display
    updateSelectedAppointmentDisplay();
}

function showTimeSlots(dateString) {
    const timeSlotsDiv = document.getElementById('time-slots');
    const selectedDateSpan = document.getElementById('selected-date');
    const timeButtonsDiv = document.getElementById('time-buttons');

    const selectedDate = new Date(dateString);
    const dayOfWeek = selectedDate.getDay(); // 0 = Sunday, 1 = Monday, 6 = Saturday

    // Generate available times based on day of week
    let availableTimesForDay = [];
    if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Monday to Friday
        availableTimesForDay = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
    } else if (dayOfWeek === 6) { // Saturday
        availableTimesForDay = ['09:00', '10:00', '11:00'];
    }

    selectedDateSpan.textContent = selectedDate.toLocaleDateString('pt-BR');
    timeButtonsDiv.innerHTML = '';

    availableTimesForDay.forEach(time => {
        const isAvailable = isTimeAvailable(dateString, time);
        const isSelected = selectedTime === time;

        const button = document.createElement('button');
        button.className = `time-button ${isAvailable ? '' : 'unavailable'} ${isSelected ? 'selected' : ''}`;
        button.textContent = time;
        button.disabled = !isAvailable;

        if (isAvailable) {
            button.onclick = () => selectTime(time);
        }

        timeButtonsDiv.appendChild(button);
    });

    timeSlotsDiv.style.display = 'block';
}

function selectTime(time) {
    selectedTime = time;

    // Update time buttons display
    const timeButtons = document.querySelectorAll('.time-button');
    timeButtons.forEach(button => {
        button.classList.remove('selected');
        if (button.textContent === time) {
            button.classList.add('selected');
        }
    });

    // Update confirmation display
    updateSelectedAppointmentDisplay();
}

function updateSelectedAppointmentDisplay() {
    const confirmDate = document.getElementById('confirm-date');
    const confirmTime = document.getElementById('confirm-time');

    if (confirmDate && confirmTime) {
        confirmDate.textContent = selectedDate ? new Date(selectedDate).toLocaleDateString('pt-BR') : '-';
        confirmTime.textContent = selectedTime || '-';
    }
}