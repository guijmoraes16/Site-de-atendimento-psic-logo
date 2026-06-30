// URL base da sua API backend
const API_URL = 'http://127.0.0.1:8000';

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
        const response = await fetch(`${API_URL}/usuarios/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Erro ao realizar login.');
        }

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
        // Usuário logado: mostra painel, esconde login
        loginSection.style.display = 'none';
        panelSection.style.display = 'block';
        
        // Aqui você pode chamar funções para carregar os dados iniciais do painel
        carregarDadosDoPainel();
    } else {
        // Usuário deslogado: mostra login, esconde painel
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

// Exemplo de como fazer requisições protegidas usando o token salvo
async function carregarDadosDoPainel() {
    const token = localStorage.getItem('access_token');
    
    try {
        const response = await fetch(`${API_URL}/admin/dashboard`, { // Substitua pela sua rota real de dados
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 401) {
            // Se o token expirou ou é inválido, desloga o usuário
            logoutAdmin();
            return;
        }

        const dados = await response.json();
        // Use os dados para preencher o 'total-count', 'pending-count', etc.
        
    } catch (error) {
        console.error('Erro ao buscar dados do painel:', error);
    }
}
