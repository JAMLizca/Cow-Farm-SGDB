//const API_URL = 'https://cow-farm-sgdb-production.up.railway.app/api';
const SA_API = 'http://127.0.0.1:8000/api/superadmin';
let saToken   = null;
let saUser    = null;
let saPass    = null;
let editFincaId  = null;
let deleteFincaId = null;

// Screens
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

// Toast
let toastTimer;
function showToast(msg, type = '') {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className   = 'toast show ' + type;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.className = 'toast'; }, 3000);
}

// Modal
function openModal(id)  { document.getElementById(id).classList.add('show'); }
function closeModal(id) { document.getElementById(id).classList.remove('show'); }
document.querySelectorAll('.modal-overlay').forEach(o => {
    o.addEventListener('click', e => { if (e.target === o) o.classList.remove('show'); });
});

// Headers autenticados
function saHeaders() {
    return {
        'Content-Type':        'application/json',
        'Accept':              'application/json',
        'X-SuperAdmin-User':   saUser,
        'X-SuperAdmin-Pass':   saPass,
    };
}


// LOGIN
async function saLogin() {
    const usuario  = document.getElementById('sa-usuario').value.trim();
    const password = document.getElementById('sa-password').value.trim();
    const errorEl  = document.getElementById('error-login');

    if (!usuario || !password) {
        errorEl.textContent = 'Completa todos los campos.';
        errorEl.style.display = 'block';
        return;
    }

    try {
        const res  = await fetch(`${SA_API}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ usuario, password }),
        });

        const data = await res.json();

        if (res.ok) {
            saToken = data.token;
            saUser  = usuario;
            saPass  = password;
            errorEl.style.display = 'none';
            showScreen('screen-dashboard');
            cargarFincas();
        } else {
            errorEl.textContent = data.message || 'Credenciales incorrectas.';
            errorEl.style.display = 'block';
        }
    } catch (e) {
        errorEl.textContent = 'Error al conectar con el servidor.';
        errorEl.style.display = 'block';
    }
}

function saLogout() {
    saToken = null; saUser = null; saPass = null;
    document.getElementById('sa-usuario').value  = '';
    document.getElementById('sa-password').value = '';
    showScreen('screen-login');
}

// Permitir Enter en login
document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && document.getElementById('screen-login').classList.contains('active')) {
        saLogin();
    }
});

// FINCAS
async function cargarFincas() {
    try {
        const res    = await fetch(`${SA_API}/fincas`, { headers: saHeaders() });
        const fincas = await res.json();

        // Stats
        const activas   = fincas.filter(f => f.activo).length;
        const inactivas = fincas.filter(f => !f.activo).length;
        const usuarios  = fincas.reduce((s, f) => s + (f.usuarios_count || 0), 0);

        document.getElementById('stat-total-fincas').textContent    = fincas.length;
        document.getElementById('stat-fincas-activas').textContent  = activas;
        document.getElementById('stat-fincas-inactivas').textContent = inactivas;
        document.getElementById('stat-total-usuarios').textContent  = usuarios;

        // Tabla
        const tbody = document.getElementById('tabla-fincas');
        tbody.innerHTML = '';

        if (!fincas.length) {
            tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:48px;color:var(--texto-suave)">No hay fincas registradas</td></tr>`;
            return;
        }

        fincas.forEach(f => {
            const estadoBadge = f.activo
                ? `<span class="sa-badge-activo">Activa</span>`
                : `<span class="sa-badge-inactivo">Inactiva</span>`;

            const toggleBtn = f.activo
                ? `<button class="sa-btn-toggle-on" onclick="toggleFinca(${f.id})">Desactivar</button>`
                : `<button class="sa-btn-toggle-off" onclick="toggleFinca(${f.id})">Activar</button>`;

            tbody.innerHTML += `
                <tr>
                    <td>${f.id}</td>
                    <td><strong>${f.codigo_finca}</strong></td>
                    <td>${f.nombre}</td>
                    <td>${f.propietario}</td>
                    <td>${f.telefono || '—'}</td>
                    <td>
                        <button class="sa-btn-usuarios" onclick="verUsuarios(${f.id}, '${f.nombre}')">
                            ${f.usuarios_count || 0} usuarios
                        </button>
                    </td>
                    <td>${estadoBadge}</td>
                    <td>
                        <button class="btn-edit" onclick="editFinca(${f.id})" style="margin-right:6px;">Editar</button>
                        ${toggleBtn}
                        <button class="btn-delete" onclick="prepEliminar(${f.id})" style="margin-left:6px;">Eliminar</button>
                    </td>
                </tr>`;
        });

    } catch (e) {
        showToast('Error al cargar las fincas', 'red');
    }
}

// Abrir formulario nueva finca
function openFormFinca() {
    editFincaId = null;
    document.getElementById('modal-finca-title').textContent = 'Nueva Finca';
    document.getElementById('f-codigo').value          = '';
    document.getElementById('f-nombre').value          = '';
    document.getElementById('f-propietario').value     = '';
    document.getElementById('f-password').value        = '';
    document.getElementById('f-telefono').value        = '';
    document.getElementById('f-direccion').value       = '';
    document.getElementById('f-admin-nombre').value    = '';
    document.getElementById('f-admin-password').value  = '';
    document.getElementById('f-codigo').disabled       = false;
    document.getElementById('section-admin').style.display    = 'flex';
    document.getElementById('form-admin-fields').style.display = 'grid';
    openModal('modal-finca');
}

// Editar finca
async function editFinca(id) {
    try {
        const res   = await fetch(`${SA_API}/fincas`, { headers: saHeaders() });
        const fincas = await res.json();
        const finca  = fincas.find(f => f.id === id);
        if (!finca) return;

        editFincaId = id;
        document.getElementById('modal-finca-title').textContent = 'Editar Finca — ' + finca.nombre;
        document.getElementById('f-codigo').value      = finca.codigo_finca;
        document.getElementById('f-nombre').value      = finca.nombre;
        document.getElementById('f-propietario').value = finca.propietario;
        document.getElementById('f-password').value    = '';
        document.getElementById('f-telefono').value    = finca.telefono || '';
        document.getElementById('f-direccion').value   = finca.direccion || '';
        document.getElementById('f-codigo').disabled   = true;
        document.getElementById('section-admin').style.display     = 'none';
        document.getElementById('form-admin-fields').style.display = 'none';
        openModal('modal-finca');
    } catch (e) {
        showToast('Error al cargar datos de la finca', 'red');
    }
}

// Guardar finca
async function saveFinca() {
    const codigo      = document.getElementById('f-codigo').value.trim();
    const nombre      = document.getElementById('f-nombre').value.trim();
    const propietario = document.getElementById('f-propietario').value.trim();
    const password    = document.getElementById('f-password').value.trim();
    const telefono    = document.getElementById('f-telefono').value.trim();
    const direccion   = document.getElementById('f-direccion').value.trim();
    const adminNombre = document.getElementById('f-admin-nombre').value.trim();
    const adminPass   = document.getElementById('f-admin-password').value.trim();

    if (!nombre || !propietario) {
        showToast('Nombre y propietario son obligatorios', 'red');
        return;
    }

    if (!editFincaId && !codigo) {
        showToast('El codigo de finca es obligatorio', 'red');
        return;
    }

    if (!editFincaId && !password) {
        showToast('La contrasena de la finca es obligatoria', 'red');
        return;
    }

    const body = { nombre, propietario, telefono, direccion };
    if (!editFincaId) {
        body.codigo_finca  = codigo;
        body.password      = password;
        body.admin_nombre  = adminNombre || null;
        body.admin_password = adminPass || null;
    } else if (password) {
        body.password = password;
    }

    try {
        let res;
        if (editFincaId) {
            res = await fetch(`${SA_API}/fincas/${editFincaId}`, {
                method: 'PUT',
                headers: saHeaders(),
                body: JSON.stringify(body),
            });
        } else {
            res = await fetch(`${SA_API}/fincas`, {
                method: 'POST',
                headers: saHeaders(),
                body: JSON.stringify(body),
            });
        }

        const data = await res.json();

        if (res.ok) {
            showToast(data.message, 'green');
            closeModal('modal-finca');
            cargarFincas();
            // Cargar filtro de fincas en auditoría
await cargarFincasFiltro();
await cargarAuditoria();
        } else {
            showToast('Error: ' + (data.message || JSON.stringify(data.errors)), 'red');
        }
    } catch (e) {
        showToast('Error al guardar la finca', 'red');
    }
}

// Toggle activo/inactivo
async function toggleFinca(id) {
    try {
        const res  = await fetch(`${SA_API}/fincas/${id}/toggle`, {
            method: 'PATCH',
            headers: saHeaders(),
        });
        const data = await res.json();
        showToast(data.message, 'green');
        cargarFincas();
    } catch (e) {
        showToast('Error al cambiar estado', 'red');
    }
}

// Eliminar finca
function prepEliminar(id) {
    deleteFincaId = id;
    openModal('modal-eliminar');
}

async function confirmarEliminar() {
    try {
        const res  = await fetch(`${SA_API}/fincas/${deleteFincaId}`, {
            method: 'DELETE',
            headers: saHeaders(),
        });
        const data = await res.json();
        showToast(data.message, 'red');
        closeModal('modal-eliminar');
        cargarFincas();
    } catch (e) {
        showToast('Error al eliminar la finca', 'red');
    }
}

// Ver usuarios de una finca
async function verUsuarios(id, nombre) {
    try {
        const res      = await fetch(`${SA_API}/fincas/${id}/usuarios`, { headers: saHeaders() });
        const usuarios = await res.json();

        document.getElementById('modal-usuarios-title').textContent = `Usuarios — ${nombre}`;

        const tbody = document.getElementById('tabla-usuarios-finca');
        tbody.innerHTML = '';

        if (!usuarios.length) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:32px;color:var(--texto-suave)">No hay usuarios registrados</td></tr>`;
        } else {
            usuarios.forEach(u => {
                const rol    = u.rol === 'admin'
                    ? `<span class="badge badge-admin">ADMIN</span>`
                    : `<span class="badge badge-emp">EMPLEADO</span>`;
                const estado = u.activo
                    ? `<span class="sa-badge-activo">Activo</span>`
                    : `<span class="sa-badge-inactivo">Inactivo</span>`;
                tbody.innerHTML += `
                    <tr>
                        <td>${u.id}</td>
                        <td>${u.nombre}</td>
                        <td>${rol}</td>
                        <td>${estado}</td>
                    </tr>`;
            });
        }

        openModal('modal-usuarios');
    } catch (e) {
        showToast('Error al cargar usuarios', 'red');
    }
}

//  AUDITORÍA
async function cargarAuditoria() {
    const fincaId   = document.getElementById('filtro-finca-auditoria').value;
    const modulo    = document.getElementById('filtro-modulo-auditoria').value;
    const accion    = document.getElementById('filtro-accion-auditoria').value;
    const fechaDesde = document.getElementById('filtro-fecha-desde').value;
    const fechaHasta = document.getElementById('filtro-fecha-hasta').value;

    const params = new URLSearchParams();
    if (fincaId)    params.append('finca_id',    fincaId);
    if (modulo)     params.append('modulo',      modulo);
    if (accion)     params.append('accion',      accion);
    if (fechaDesde) params.append('fecha_desde', fechaDesde);
    if (fechaHasta) params.append('fecha_hasta', fechaHasta);

    try {
        const res      = await fetch(`${SA_API.replace('/superadmin', '')}/auditoria?${params.toString()}`, {
            headers: saHeaders(),
        });
        const registros = await res.json();

        // Stats
        document.getElementById('audit-total').textContent   = registros.length;
        document.getElementById('audit-logins').textContent  = registros.filter(r => r.accion === 'LOGIN').length;
        document.getElementById('audit-crear').textContent   = registros.filter(r => r.accion === 'CREAR').length;
        document.getElementById('audit-editar').textContent  = registros.filter(r => r.accion === 'EDITAR').length;
        document.getElementById('audit-eliminar').textContent = registros.filter(r => r.accion === 'ELIMINAR').length;

        // Tabla
        const tbody = document.getElementById('tabla-auditoria');
        tbody.innerHTML = '';

        if (!registros.length) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:48px;color:#5a6a7e;">No hay registros de actividad</td></tr>`;
            return;
        }

        registros.forEach(r => {
            const fecha = new Date(r.created_at).toLocaleString('es-CO', {
                year:   'numeric',
                month:  '2-digit',
                day:    '2-digit',
                hour:   '2-digit',
                minute: '2-digit',
            });

            const accionClass = {
                'LOGIN':    'badge-login',
                'CREAR':    'badge-crear',
                'EDITAR':   'badge-editar',
                'ELIMINAR': 'badge-eliminar',
            }[r.accion] || 'badge-crear';

            const rolBadge = r.rol_usuario === 'admin'
                ? `<span class="badge badge-admin">ADMIN</span>`
                : `<span class="badge badge-emp">EMPLEADO</span>`;

            tbody.innerHTML += `
                <tr>
                    <td style="white-space:nowrap;font-size:12px;">${fecha}</td>
                    <td style="font-size:12px;">${r.finca ? r.finca.nombre : '—'}</td>
                    <td style="font-size:12px;font-weight:600;">${r.nombre_usuario}</td>
                    <td>${rolBadge}</td>
                    <td><span class="badge ${accionClass}">${r.accion}</span></td>
                    <td style="font-size:12px;">${r.modulo}</td>
                    <td style="font-size:12px;color:#5a6a7e;">${r.descripcion || '—'}</td>
                </tr>`;
        });

    } catch (e) {
        showToast('Error al cargar el historial', 'red');
    }
}

function limpiarFiltros() {
    document.getElementById('filtro-finca-auditoria').value   = '';
    document.getElementById('filtro-modulo-auditoria').value  = '';
    document.getElementById('filtro-accion-auditoria').value  = '';
    document.getElementById('filtro-fecha-desde').value       = '';
    document.getElementById('filtro-fecha-hasta').value       = '';
    cargarAuditoria();
}

async function limpiarHistorial() {
    const fincaId = document.getElementById('filtro-finca-auditoria').value;

    if (!fincaId) {
        showToast('Selecciona una finca para limpiar su historial', 'red');
        return;
    }

    if (!confirm('¿Estás seguro de que deseas eliminar todo el historial de esta finca?')) return;

    try {
        const res  = await fetch(`${SA_API.replace('/superadmin', '')}/auditoria/${fincaId}`, {
            method: 'DELETE',
            headers: saHeaders(),
        });
        const data = await res.json();
        showToast(data.message, 'green');
        cargarAuditoria();
    } catch (e) {
        showToast('Error al limpiar el historial', 'red');
    }
}

// Cargar fincas en filtro de auditoría
async function cargarFincasFiltro() {
    try {
        const res    = await fetch(`${SA_API}/fincas`, { headers: saHeaders() });
        const fincas = await res.json();
        const sel    = document.getElementById('filtro-finca-auditoria');
        sel.innerHTML = '<option value="">Todas las fincas</option>';
        fincas.forEach(f => {
            sel.innerHTML += `<option value="${f.id}">${f.nombre}</option>`;
        });
    } catch (e) {
        console.log('Error al cargar fincas filtro:', e);
    }
}

