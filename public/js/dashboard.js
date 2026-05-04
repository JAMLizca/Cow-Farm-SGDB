// Verificar sesión 
const { usuario, finca } = verificarSesion();

// ── Info navbar y sidebar ──
document.getElementById('navbar-user') && (document.getElementById('navbar-user').textContent = finca.nombre);
document.getElementById('user-name').textContent   = usuario.nombre;
document.getElementById('user-avatar').textContent = usuario.nombre.charAt(0).toUpperCase();

// Var globales
let editBovinoId  = null;
let editUsuarioId = null;
let deleteTarget  = null;
let deleteType    = null;
let chartLeche    = null;
let chartEstado   = null;
let chartPeso     = null;
let chartSan      = null;

// Mostrar panel
function showPanel(name) {
    document.querySelectorAll('.content-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('panel-' + name).classList.add('active');
    document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
    document.getElementById('menu-' + name).classList.add('active');
    if (name === 'bovinos')   cargarBovinos();
    if (name === 'usuarios')  cargarUsuarios();
    if (name === 'sanitario') cargarSanitario();
    if (name === 'reportes')  cargarReportes();
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

// Badge estado salud
function badgeEstado(estado) {
    if (estado === 'Saludable')       return `<span class="badge badge-green">${estado}</span>`;
    if (estado === 'En tratamiento')  return `<span class="badge badge-red">${estado}</span>`;
    return `<span class="badge badge-yellow">${estado}</span>`;
}

//  BOVINOS

async function cargarBovinos() {
    const bovinos = await apiGet('bovinos', { finca_id: finca.id });

    // KPIs por categoría y estado
    const toros    = bovinos.filter(b => ['Toro','Novillo','Becerro'].includes(b.categoria)).length;
    const terneras = bovinos.filter(b => ['Ternera','Ternero','Vaca','Novilla'].includes(b.categoria)).length;
    const obs      = bovinos.filter(b => b.estado_salud === 'En observación').length;
    const trat     = bovinos.filter(b => b.estado_salud === 'En tratamiento').length;

    document.getElementById('stat-toro').textContent    = toros;
    document.getElementById('stat-ternera').textContent = terneras;
    document.getElementById('stat-obs').textContent     = obs;
    document.getElementById('stat-trat').textContent    = trat;

    // Tabla
    const tbody = document.getElementById('tabla-bovinos');
    tbody.innerHTML = '';

    if (!bovinos.length) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:48px;color:var(--texto-suave)">No hay bovinos registrados</td></tr>`;
        return;
    }

    bovinos.forEach(b => {
        tbody.innerHTML += `
            <tr>
                <td>${b.id}</td>
                <td><strong>${b.arete}</strong></td>
                <td>${b.nombre}</td>
                <td>${b.raza ? b.raza.nombre : '—'}</td>
                <td>${badgeEstado(b.estado_salud)}</td>
                <td>
                    <button class="btn-edit" onclick="editBovino(${b.id})">Editar</button>
                    <button class="btn-delete" onclick="prepDelete(${b.id},'bovino')">Eliminar</button>
                </td>
            </tr>`;
    });
}

async function cargarRazas() {
    const razas = await apiGet('razas');
    const sel   = document.getElementById('f-raza');
    sel.innerHTML = '<option value="">Seleccionar raza</option>';
    razas.forEach(r => {
        sel.innerHTML += `<option value="${r.id}">${r.nombre}</option>`;
    });
}

function openFormBovino() {
    editBovinoId = null;
    document.getElementById('form-bovino-title').textContent = 'Registrar Bovino';
    ['f-arete','f-nombre','f-peso'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('f-sexo').value      = '';
    document.getElementById('f-categoria').value = '';
    document.getElementById('f-proposito').value = '';
    document.getElementById('f-fecha').value     = '';
    document.getElementById('f-estado').value    = '';
    cargarRazas();
    document.getElementById('form-bovino-card').style.display = 'block';
    document.getElementById('form-bovino-card').scrollIntoView({ behavior: 'smooth' });
}

async function editBovino(id) {
    const b = await apiGet(`bovinos/${id}`);
    editBovinoId = id;
    document.getElementById('form-bovino-title').textContent = 'Editar Bovino — ' + b.nombre;
    document.getElementById('f-arete').value     = b.arete;
    document.getElementById('f-nombre').value    = b.nombre;
    document.getElementById('f-sexo').value      = b.sexo;
    document.getElementById('f-categoria').value = b.categoria;
    document.getElementById('f-proposito').value = b.proposito;
    document.getElementById('f-fecha').value     = b.fecha_nacimiento;
    document.getElementById('f-peso').value      = b.peso_inicial;
    document.getElementById('f-estado').value    = b.estado_salud;
    await cargarRazas();
    document.getElementById('f-raza').value = b.raza_id;
    document.getElementById('form-bovino-card').style.display = 'block';
    document.getElementById('form-bovino-card').scrollIntoView({ behavior: 'smooth' });
}

async function saveBovino() {
    const body = {
        finca_id:         finca.id,
        raza_id:          document.getElementById('f-raza').value,
        arete:            document.getElementById('f-arete').value.trim(),
        nombre:           document.getElementById('f-nombre').value.trim(),
        sexo:             document.getElementById('f-sexo').value,
        categoria:        document.getElementById('f-categoria').value,
        proposito:        document.getElementById('f-proposito').value,
        fecha_nacimiento: document.getElementById('f-fecha').value,
        peso_inicial:     document.getElementById('f-peso').value,
        estado_salud:     document.getElementById('f-estado').value,
    };

    if (!body.arete || !body.nombre || !body.sexo || !body.categoria || !body.raza_id || !body.estado_salud || !body.proposito) {
        showToast('Completa todos los campos obligatorios', 'red');
        return;
    }
    if (body.peso_inicial !== '' && parseFloat(body.peso_inicial) <= 0) {
        showToast('El peso inicial debe ser mayor a 0', 'red');
        return;
    }

    if (editBovinoId) {
        await apiPut('bovinos', editBovinoId, body);
        showToast('Bovino actualizado correctamente', 'green');
    } else {
        await apiPost('bovinos', body);
        showToast('Bovino registrado correctamente', 'green');
    }

    cancelFormBovino();
    cargarBovinos();
}

function cancelFormBovino() {
    document.getElementById('form-bovino-card').style.display = 'none';
    editBovinoId = null;
}


// USER

async function cargarUsuarios() {
    const usuarios = await apiGet('usuarios', { finca_id: finca.id });
    const tbody    = document.getElementById('tabla-usuarios');
    tbody.innerHTML = '';

    if (!usuarios.length) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:48px;color:var(--texto-suave)">No hay usuarios registrados</td></tr>`;
        return;
    }

    usuarios.forEach(u => {
        const rolBadge    = u.rol === 'admin' ? `<span class="badge badge-admin">ADMIN</span>` : `<span class="badge badge-emp">EMPLEADO</span>`;
        const estadoBadge = u.activo ? `<span class="badge badge-green">Activo</span>` : `<span class="badge badge-red">Inactivo</span>`;
        tbody.innerHTML += `
            <tr>
                <td>${u.id}</td>
                <td>${u.nombre}</td>
                <td>${rolBadge}</td>
                <td>${estadoBadge}</td>
                <td>
                    <button class="btn-edit" onclick="editUsuario(${u.id})">Editar</button>
                    <button class="btn-delete" onclick="prepDelete(${u.id},'usuario')">Eliminar</button>
                </td>
            </tr>`;
    });
}

function openFormUsuario() {
    editUsuarioId = null;
    document.getElementById('form-usuario-title').textContent = 'Agregar Usuario';
    document.getElementById('u-nombre').value   = '';
    document.getElementById('u-password').value = '';
    document.getElementById('u-rol').value      = 'empleado';
    document.getElementById('form-usuario-card').style.display = 'block';
}

async function editUsuario(id) {
    const u = await apiGet(`usuarios/${id}`);
    editUsuarioId = id;
    document.getElementById('form-usuario-title').textContent = 'Editar Usuario — ' + u.nombre;
    document.getElementById('u-nombre').value = u.nombre;
    document.getElementById('u-rol').value    = u.rol;
    document.getElementById('form-usuario-card').style.display = 'block';
}

async function saveUsuario() {
    const body = {
        finca_id: finca.id,
        nombre:   document.getElementById('u-nombre').value.trim(),
        password: document.getElementById('u-password').value.trim(),
        rol:      document.getElementById('u-rol').value,
    };

    if (!body.nombre || (!editUsuarioId && !body.password)) {
        showToast('Completa todos los campos obligatorios', 'red');
        return;
    }

    if (editUsuarioId) {
        await apiPut('usuarios', editUsuarioId, body);
        showToast('Usuario actualizado correctamente', 'green');
    } else {
        await apiPost('usuarios', body);
        showToast('Usuario creado correctamente', 'green');
    }

    cancelFormUsuario();
    cargarUsuarios();
}

function cancelFormUsuario() {
    document.getElementById('form-usuario-card').style.display = 'none';
    editUsuarioId = null;
}


//  SANATARIO

async function cargarSanitario() {
    const eventos   = await apiGet('eventos-sanitarios', { finca_id: finca.id });
    const contenido = document.getElementById('sanitario-contenido');

    if (!eventos.length) {
        contenido.innerHTML = `
            <div class="empty-sanitario">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d69e2e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                <p>Sin eventos registrados</p>
            </div>`;
        return;
    }

    contenido.innerHTML = `
        <div class="table-wrap">
            <table>
                <thead>
                    <tr>
                        <th>ID</th><th>Bovino</th><th>Tipo</th>
                        <th>Producto</th><th>Fecha</th><th>Estado</th><th>Acciones</th>
                    </tr>
                </thead>
                <tbody id="tabla-sanitario"></tbody>
            </table>
        </div>`;

    const tbody = document.getElementById('tabla-sanitario');
    eventos.forEach(e => {
        const estadoClass = e.estado === 'Ejecutado' ? 'badge-green' : e.estado === 'Cancelado' ? 'badge-red' : 'badge-yellow';
        tbody.innerHTML += `
            <tr>
                <td>${e.id}</td>
                <td>${e.bovino ? e.bovino.nombre : '—'}</td>
                <td><span class="badge badge-blue">${e.tipo}</span></td>
                <td>${e.producto}</td>
                <td>${e.fecha}</td>
                <td><span class="badge ${estadoClass}">${e.estado}</span></td>
                <td><button class="btn-delete" onclick="prepDelete(${e.id},'sanitario')">Eliminar</button></td>
            </tr>`;
    });
}

async function openFormSanitario() {
    const bovinos = await apiGet('bovinos', { finca_id: finca.id });
    const sel     = document.getElementById('s-bovino');
    sel.innerHTML = bovinos.map(b => `<option value="${b.id}">${b.arete} — ${b.nombre}</option>`).join('');
    document.getElementById('s-fecha').value = new Date().toISOString().split('T')[0];
    document.getElementById('form-sanitario-card').style.display = 'block';
}

async function saveSanitario() {
    const body = {
        finca_id:      finca.id,
        bovino_id:     document.getElementById('s-bovino').value,
        usuario_id:    usuario.id,
        tipo:          document.getElementById('s-tipo').value,
        producto:      document.getElementById('s-producto').value.trim(),
        dosis:         document.getElementById('s-dosis').value.trim(),
        fecha:         document.getElementById('s-fecha').value,
        proxima_fecha: document.getElementById('s-proxima-fecha').value,
        estado:        document.getElementById('s-estado').value,
    };

    if (!body.producto || !body.fecha) {
        showToast('Completa todos los campos obligatorios', 'red');
        return;
    }

    await apiPost('eventos-sanitarios', body);
    showToast('Evento registrado correctamente', 'green');
    cancelFormSanitario();
    cargarSanitario();
}

function cancelFormSanitario() {
    document.getElementById('form-sanitario-card').style.display = 'none';
}


//  REPORTES

async function cargarReportes() {
    const bovinos = await apiGet('bovinos', { finca_id: finca.id });
    const eventos = await apiGet('eventos-sanitarios', { finca_id: finca.id });

    // KPIs
    const pesoPromedio = bovinos.length
        ? Math.round(bovinos.reduce((s, b) => s + parseFloat(b.peso_inicial || 0), 0) / bovinos.length)
        : 0;
    document.getElementById('rep-peso').textContent    = pesoPromedio + ' kg';
    document.getElementById('rep-vacunas').textContent = eventos.filter(e => e.tipo === 'Vacunación').length;
    document.getElementById('rep-alertas').textContent = bovinos.filter(b => b.estado_salud !== 'Saludable').length;
    document.getElementById('hato-total').textContent  = bovinos.length;

    // Donut estado del hato
    const sanos = bovinos.filter(b => b.estado_salud === 'Saludable').length;
    const obs   = bovinos.filter(b => b.estado_salud === 'En observación').length;
    const trat  = bovinos.filter(b => b.estado_salud === 'En tratamiento').length;

    const leyenda = document.getElementById('estado-leyenda');
    leyenda.innerHTML = [
        { label: 'Saludable',      val: sanos, color: '#1a8f3c' },
        { label: 'En observación', val: obs,   color: '#d69e2e' },
        { label: 'En tratamiento', val: trat,  color: '#e53e3e' },
    ].map(i => `
        <div style="display:flex;align-items:center;justify-content:space-between;font-size:12px;">
            <div style="display:flex;align-items:center;gap:6px;">
                <div style="width:10px;height:10px;border-radius:50%;background:${i.color};flex-shrink:0"></div>
                <span>${i.label}</span>
            </div>
            <strong>${i.val}</strong>
        </div>`).join('');

    if (chartEstado) chartEstado.destroy();
    chartEstado = new Chart(document.getElementById('chart-estado'), {
        type: 'doughnut',
        data: {
            labels: ['Saludable', 'En observación', 'En tratamiento'],
            datasets: [{
                data: [sanos, obs, trat],
                backgroundColor: ['#1a8f3c', '#d69e2e', '#e53e3e'],
                borderWidth: 0,
                hoverOffset: 4,
            }]
        },
        options: {
            cutout: '70%',
            plugins: { legend: { display: false } },
        }
    });

    // Barras peso por raza
    const razasUnicas = [...new Set(bovinos.map(b => b.raza ? b.raza.nombre : 'Sin raza'))];
    const pesosPorRaza = razasUnicas.map(r => {
        const grupo = bovinos.filter(b => (b.raza ? b.raza.nombre : 'Sin raza') === r);
        return Math.round(grupo.reduce((s, b) => s + parseFloat(b.peso_inicial || 0), 0) / grupo.length);
    });

    if (chartPeso) chartPeso.destroy();
    chartPeso = new Chart(document.getElementById('chart-peso'), {
        type: 'bar',
        data: {
            labels: razasUnicas,
            datasets: [{
                label: 'Peso (kg)',
                data: pesosPorRaza,
                backgroundColor: ['#1a8f3c','#3182ce','#d69e2e','#e53e3e','#718096'],
                borderRadius: 6,
                borderSkipped: false,
            }]
        },
        options: {
            indexAxis: 'y',
            plugins: { legend: { display: false } },
            scales: {
                x: { beginAtZero: false, grid: { color: '#f0f0f0' } },
                y: { grid: { display: false } }
            }
        }
    });

    // Barras eventos sanitarios
    const tipos   = ['Vacunación', 'Desparasitación', 'Tratamiento', 'Revisión'];
    const counts  = tipos.map(t => eventos.filter(e => e.tipo === t).length);

    if (chartSan) chartSan.destroy();
    chartSan = new Chart(document.getElementById('chart-sanitario-rep'), {
        type: 'bar',
        data: {
            labels: tipos,
            datasets: [{
                label: 'Eventos',
                data: counts,
                backgroundColor: ['#1a8f3c','#3182ce','#e53e3e','#d69e2e'],
                borderRadius: 6,
                borderSkipped: false,
            }]
        },
        options: {
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: '#f0f0f0' } },
                x: { grid: { display: false } }
            }
        }
    });

    // Producción leche (placeholder con datos vacíos por ahora)
    if (chartLeche) chartLeche.destroy();
    const dias = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
    chartLeche = new Chart(document.getElementById('chart-leche'), {
        type: 'bar',
        data: {
            labels: dias,
            datasets: [{
                label: 'Litros',
                data: [0, 0, 0, 0, 0, 0, 0],
                backgroundColor: 'rgba(26,143,60,0.15)',
                borderColor: '#1a8f3c',
                borderWidth: 2,
                borderRadius: 6,
                borderSkipped: false,
            }]
        },
        options: {
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, grid: { color: '#f0f0f0' } },
                x: { grid: { display: false } }
            }
        }
    });
}


// DELETE

function prepDelete(id, type) {
    deleteTarget = id;
    deleteType   = type;
    openModal('modal-eliminar');
}

async function confirmarEliminar() {
    if (deleteType === 'bovino') {
        await apiDelete('bovinos', deleteTarget);
        showToast('Bovino eliminado correctamente', 'red');
        cargarBovinos();
    } else if (deleteType === 'usuario') {
        await apiDelete('usuarios', deleteTarget);
        showToast('Usuario eliminado correctamente', 'red');
        cargarUsuarios();
    } else if (deleteType === 'sanitario') {
        await apiDelete('eventos-sanitarios', deleteTarget);
        showToast('Evento eliminado correctamente', 'red');
        cargarSanitario();
    }
    closeModal('modal-eliminar');
}

// Cargar a inicio 
cargarBovinos();