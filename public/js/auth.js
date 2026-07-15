const API_URL = 'http://127.0.0.1:8000/api';
//const API_URL = 'https://cow-farm-sgdb-production.up.railway.app/api';

document.getElementById('btn-login').addEventListener('click', async () => {

    const codigo_finca = document.getElementById('codigo_finca').value.trim();
    const nombre       = document.getElementById('nombre').value.trim();
    const password     = document.getElementById('password').value.trim();
    const errorMsg     = document.getElementById('error-msg');

    // Validar campos vacíos
    if (!codigo_finca || !nombre || !password) {
        errorMsg.textContent = 'Todos los campos son obligatorios';
        errorMsg.style.display = 'block';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept':       'application/json',
            },
            body: JSON.stringify({ codigo_finca, nombre, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // Guardar datos de sesión
            localStorage.setItem('usuario', JSON.stringify(data.usuario));
            localStorage.setItem('finca',   JSON.stringify(data.finca));

            // Redirigir según rol
            if (data.usuario.rol === 'admin') {
                window.location.href = 'dashboard-admin.html';
            } else {
                window.location.href = 'dashboard-empleado.html';
            }
        } else {
            errorMsg.textContent = data.message || 'Credenciales incorrectas';
            errorMsg.style.display = 'block';
        }

    } catch (error) {
        errorMsg.textContent = 'Error al conectar con el servidor';
        errorMsg.style.display = 'block';
    }
});

// Permitir login con Eter
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('btn-login').click();
    }
});

//Nueva funcionalidad
// Recuperación de contraseña
function openRecovery() {
    document.getElementById('recovery-step-1').style.display = 'block';
    document.getElementById('recovery-step-2').style.display = 'none';
    document.getElementById('recovery-error').style.display  = 'none';
    document.getElementById('recovery-finca').value  = '';
    document.getElementById('recovery-email').value  = '';
    document.getElementById('modal-recovery').classList.add('show');
}

function closeRecovery() {
    document.getElementById('modal-recovery').classList.remove('show');
}

async function solicitarRecovery() {
    const codigoFinca = document.getElementById('recovery-finca').value.trim();
    const email       = document.getElementById('recovery-email').value.trim();
    const errorEl     = document.getElementById('recovery-error');

    if (!codigoFinca || !email) {
        errorEl.textContent   = 'Completa todos los campos.';
        errorEl.style.display = 'block';
        return;
    }

    const btn = document.querySelector('#recovery-step-1 .btn-save');
    btn.textContent  = 'Enviando...';
    btn.disabled     = true;

    try {
        const res  = await fetch(`${API_URL}/password/solicitar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept':       'application/json',
            },
            body: JSON.stringify({
                codigo_finca: codigoFinca,
                email:        email,
            }),
        });

        const data = await res.json();

        if (res.ok) {
            document.getElementById('recovery-step-1').style.display = 'none';
            document.getElementById('recovery-step-2').style.display = 'block';
        } else {
            errorEl.textContent   = data.message || 'Error al enviar el correo.';
            errorEl.style.display = 'block';
        }
    } catch (e) {
        errorEl.textContent   = 'Error al conectar con el servidor.';
        errorEl.style.display = 'block';
    } finally {
        btn.textContent = 'Enviar enlace';
        btn.disabled    = false;
    }
}

// Cerrar modal al hacer clic fuera
document.getElementById('modal-recovery').addEventListener('click', function(e) {
    if (e.target === this) closeRecovery();
});