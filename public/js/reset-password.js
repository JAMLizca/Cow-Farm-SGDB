    const API_URL = 'http://127.0.0.1:8000/api';

    // Obtener parámetros de la URL
    const params  = new URLSearchParams(window.location.search);
    const token   = params.get('token');
    const email   = params.get('email');
    const finca   = params.get('finca');

    // Verificar que existan los parámetros
    if (!token || !email) {
        document.getElementById('step-reset').style.display  = 'none';
        document.getElementById('step-error').style.display  = 'block';
    }

    async function restablecerPassword() {
        const password        = document.getElementById('new-password').value.trim();
        const confirmPassword = document.getElementById('confirm-password').value.trim();
        const errorEl         = document.getElementById('error-reset');

        if (!password || !confirmPassword) {
            errorEl.textContent    = 'Completa todos los campos.';
            errorEl.style.display  = 'block';
            return;
        }

        if (password.length < 6) {
            errorEl.textContent    = 'La contraseña debe tener al menos 6 caracteres.';
            errorEl.style.display  = 'block';
            return;
        }

        if (password !== confirmPassword) {
            errorEl.textContent    = 'Las contraseñas no coinciden.';
            errorEl.style.display  = 'block';
            return;
        }

        try {
            const res  = await fetch(`${API_URL}/password/restablecer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept':       'application/json',
                },
                body: JSON.stringify({ token, email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                document.getElementById('step-reset').style.display   = 'none';
                document.getElementById('step-success').style.display = 'block';
            } else {
                if (data.message.includes('expirado') || data.message.includes('invalido')) {
                    document.getElementById('step-reset').style.display = 'none';
                    document.getElementById('step-error').style.display = 'block';
                } else {
                    errorEl.textContent   = data.message;
                    errorEl.style.display = 'block';
                }
            }
        } catch (e) {
            errorEl.textContent   = 'Error al conectar con el servidor.';
            errorEl.style.display = 'block';
        }
    }

    document.addEventListener('keydown', e => {
        if (e.key === 'Enter') restablecerPassword();
    });
