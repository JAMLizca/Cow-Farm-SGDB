const API_URL = 'http://127.0.0.1:8000/api';
//const API_URL = 'https://cow-farm-sgdb-production.up.railway.app/api';

// Obtener sesión
function getUsuario() {
    return JSON.parse(localStorage.getItem('usuario'));
}

function getFinca() {
    return JSON.parse(localStorage.getItem('finca'));
}

// Verificar sesión activa
function verificarSesion() {
    const usuario = getUsuario();
    const finca   = getFinca();
    if (!usuario || !finca) {
        window.location.href = 'index.html';
    }
    return { usuario, finca };
}

// Cerrar sesión
function cerrarSesion() {
    localStorage.removeItem('usuario');
    localStorage.removeItem('finca');
    window.location.href = 'index.html';
}

// Petición GET
async function apiGet(endpoint, params = {}) {
    const query = new URLSearchParams(params).toString();
    const url   = query ? `${API_URL}/${endpoint}?${query}` : `${API_URL}/${endpoint}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept':       'application/json',
        },
    });

    return response.json();
}

// Petición POST
async function apiPost(endpoint, body = {}) {
    const response = await fetch(`${API_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept':       'application/json',
        },
        body: JSON.stringify(body),
    });

    return response.json();
}

// Petición PUT
async function apiPut(endpoint, id, body = {}) {
    const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept':       'application/json',
        },
        body: JSON.stringify(body),
    });

    return response.json();
}

// Petición DELETE
async function apiDelete(endpoint, id) {
    const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Accept':       'application/json',
        },
    });

    return response.json();
}

// Registrar auditoría
async function registrarAuditoria(accion, modulo, descripcion) {
    const usr = getUsuario();
    const fnc = getFinca();

    if (!usr || !fnc) return;

    try {
        await fetch(`${API_URL}/auditoria`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept':       'application/json',
            },
            body: JSON.stringify({
                finca_id:       fnc.id,
                usuario_id:     usr.id,
                nombre_usuario: usr.nombre,
                rol_usuario:    usr.rol,
                accion:         accion,
                modulo:         modulo,
                descripcion:    descripcion,
            }),
        });
    } catch (e) {
        console.log('Error al registrar auditoria:', e);
    }
}
