const API_BASE_URL = 'http://127.0.0.1:8000';

function setAuthMessage(message, type = 'success') {
    const feedback = document.getElementById('auth-feedback');
    if (!feedback) return;

    feedback.textContent = message;
    feedback.style.display = 'block';
    feedback.style.color = type === 'error' ? '#b42318' : '#155724';
    feedback.style.backgroundColor = type === 'error' ? '#fee4e2' : '#e8f5ee';
    feedback.style.border = type === 'error' ? '1px solid #fecdca' : '1px solid #c3e6cb';
    feedback.style.padding = '12px 14px';
    feedback.style.borderRadius = '10px';
    feedback.style.marginTop = '12px';
}

async function requestJson(url, options = {}) {
    const response = await fetch(url, options);
    let data = null;

    try {
        data = await response.json();
    } catch (error) {
        data = null;
    }

    if (!response.ok) {
        throw new Error(data?.detail || data?.message || 'Erro ao comunicar com a API.');
    }

    return data;
}

document.addEventListener('DOMContentLoaded', () => {
    const cadastroForm = document.getElementById('cadastro-form');
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const nome = document.getElementById('cadastro-nome').value.trim();
            const email = document.getElementById('cadastro-email').value.trim();
            const telefone = document.getElementById('cadastro-telefone').value.trim();
            const senha = document.getElementById('cadastro-senha').value;
            const confirmarSenha = document.getElementById('cadastro-confirmar-senha').value;

            if (!nome || !email || !senha) {
                setAuthMessage('Preencha nome, e-mail e senha.', 'error');
                return;
            }

            if (senha !== confirmarSenha) {
                setAuthMessage('As senhas não coincidem.', 'error');
                return;
            }

            try {
                await requestJson(`${API_BASE_URL}/auth/cadastro`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nome, email, senha, telefone })
                });

                setAuthMessage('Cadastro realizado com sucesso! Redirecionando para o login...');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1200);
            } catch (error) {
                setAuthMessage(error.message, 'error');
            }
        });
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const email = document.getElementById('login-email').value.trim();
            const senha = document.getElementById('login-senha').value;

            if (!email || !senha) {
                setAuthMessage('Informe e-mail e senha para entrar.', 'error');
                return;
            }

            try {
                const data = await requestJson(`${API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, senha })
                });

                localStorage.setItem('auth_token', data.access_token || '');
                localStorage.setItem('auth_email', email);
                setAuthMessage('Login realizado com sucesso! Redirecionando...');

                setTimeout(() => {
                    window.location.href = 'agendar.html';
                }, 1000);
            } catch (error) {
                setAuthMessage(error.message, 'error');
            }
        });
    }
});
