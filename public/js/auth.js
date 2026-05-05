const API_URL = 'https://tu-app-production.up.railway.app/api';

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
