// ── Verificar sesión ──
const { usuario, finca } = verificarSesion();

// ── Info navbar y sidebar ──
document.getElementById("user-name").textContent = usuario.nombre;
document.getElementById("user-avatar").textContent = usuario.nombre
    .charAt(0)
    .toUpperCase();

// ── Globals ──
let todosBovinos = [];
let todosPesajes = [];

// ── Mostrar panel ──
function showPanel(name) {
    document
        .querySelectorAll(".content-panel")
        .forEach((p) => p.classList.remove("active"));
    document.getElementById("panel-" + name).classList.add("active");
    document
        .querySelectorAll(".sidebar-item")
        .forEach((i) => i.classList.remove("active"));
    document.getElementById("menu-" + name).classList.add("active");

    if (name === "bovinos") cargarBovinos();
    if (name === "produccion") cargarProduccion();
    if (name === "sanitario") cargarSanitario();
    if (name === "pesajes") cargarPesajes();
}

// ── Toast ──
let toastTimer;
function showToast(msg, type = "") {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.className = "toast show " + type;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        t.className = "toast";
    }, 3000);
}

// ── Modal ──
function openModal(id) {
    document.getElementById(id).classList.add("show");
}
function closeModal(id) {
    document.getElementById(id).classList.remove("show");
}
document.querySelectorAll(".modal-overlay").forEach((o) => {
    o.addEventListener("click", (e) => {
        if (e.target === o) o.classList.remove("show");
    });
});

// ── Badge estado salud ──
function badgeEstado(estado) {
    if (estado === "Saludable")
        return `<span class="badge badge-green">${estado}</span>`;
    if (estado === "En tratamiento")
        return `<span class="badge badge-red">${estado}</span>`;
    return `<span class="badge badge-yellow">${estado}</span>`;
}

//  BOVINOS (solo lectura + ver detalle)

async function cargarBovinos() {
    const bovinos = await apiGet("bovinos", { finca_id: finca.id });
    todosBovinos = bovinos;

    // KPIs
    const toros = bovinos.filter((b) =>
        ["Toro", "Novillo", "Becerro"].includes(b.categoria),
    ).length;
    const ternitas = bovinos.filter((b) =>
        ["Ternera", "Ternero", "Vaca", "Novilla"].includes(b.categoria),
    ).length;
    const revision = bovinos.filter(
        (b) => b.estado_salud !== "Saludable",
    ).length;

    document.getElementById("stat-toros").textContent = toros;
    document.getElementById("stat-ternitas").textContent = ternitas;
    document.getElementById("stat-revision").textContent = revision;

    // Tabla
    const tbody = document.getElementById("tabla-bovinos");
    tbody.innerHTML = "";

    if (!bovinos.length) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:48px;color:var(--texto-suave)">No hay bovinos registrados</td></tr>`;
        return;
    }

    bovinos.forEach((b) => {
        tbody.innerHTML += `
            <tr>
                <td>${b.id}</td>
                <td><strong>${b.arete}</strong></td>
                <td>${b.nombre}</td>
                <td>${b.raza ? b.raza.nombre : "—"}</td>
                <td>${badgeEstado(b.estado_salud)}</td>
                <td>
                    <button class="btn-detail" onclick="verDetalle(${b.id})">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        Ver Detalle
                    </button>
                </td>
            </tr>`;
    });
}

async function verDetalle(id) {
    const b = await apiGet(`bovinos/${id}`);

    // Buscar el último pesaje registrado para este bovino
    const respuesta = await apiGet("pesajes", { finca_id: finca.id });
    const pesajes = Array.isArray(respuesta) ? respuesta : respuesta.data ?? [];
    const pesajesBovino = pesajes.filter(p => String(p.bovino_id) === String(id));
    const ultimoPesaje = pesajesBovino.length ? pesajesBovino[0] : null;

    document.getElementById("det-arete").textContent = b.arete || "—";
    document.getElementById("det-nombre").textContent = b.nombre || "—";
    document.getElementById("det-raza").textContent = b.raza
        ? b.raza.nombre
        : "—";
    document.getElementById("det-sexo").textContent = b.sexo || "—";
    document.getElementById("det-fecha").textContent =
        b.fecha_nacimiento || "—";

    // Mostrar último pesaje si existe, si no el peso inicial
    if (ultimoPesaje) {
        document.getElementById("det-peso").textContent =
            parseFloat(ultimoPesaje.peso_kg).toFixed(2) + " kg";
        document.getElementById("det-fecha-pesaje").textContent =
            "Último pesaje: " + ultimoPesaje.fecha;
    } else {
        document.getElementById("det-peso").textContent = b.peso_inicial
            ? parseFloat(b.peso_inicial).toFixed(2) + " kg"
            : "—";
        document.getElementById("det-fecha-pesaje").textContent =
            "Peso inicial (sin pesajes registrados)";
    }

    document.getElementById("det-estado").innerHTML = badgeEstado(
        b.estado_salud,
    );
    openModal("modal-detalle-bovino");
}

//  PRODUCCIÓN DE LECHE

let editProduccionId = null;

async function cargarProduccion() {
    const registros = await apiGet("produccion-leche", { finca_id: finca.id });

    // KPIs
    const hoy = new Date().toISOString().split("T")[0];
    const prodHoy = registros
        .filter((r) => r.fecha === hoy)
        .reduce((s, r) => s + parseFloat(r.cantidad_litros || 0), 0);
    const prodTotal = registros.reduce(
        (s, r) => s + parseFloat(r.cantidad_litros || 0),
        0,
    );

    document.getElementById("stat-prod-hoy").textContent =
        prodHoy.toFixed(1) + " L";
    document.getElementById("stat-prod-total").textContent =
        prodTotal.toFixed(1) + " L";

    // Tabla
    const tbody = document.getElementById("tabla-produccion");
    tbody.innerHTML = "";

    if (!registros.length) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:48px;color:var(--texto-suave)">No hay registros de producción</td></tr>`;
        return;
    }

    registros.forEach((r) => {
        tbody.innerHTML += `
            <tr>
                <td>${r.fecha}</td>
                <td>${r.bovino ? r.bovino.arete + " - " + r.bovino.nombre : "—"}</td>
                <td>${parseFloat(r.cantidad_litros).toFixed(1)} L</td>
                <td>${r.turno}</td>
                <td>${r.usuario ? r.usuario.nombre : usuario.nombre}</td>
                <td>
                    <button class="btn-edit" onclick="editProduccion(${r.id}, '${r.bovino_id}', '${r.cantidad_litros}', '${r.turno}')">Editar</button>
                    <button class="btn-delete" onclick="eliminarProduccion(${r.id})">Eliminar</button>
                </td>
            </tr>`;
    });
}

async function openFormProduccion() {
    editProduccionId = null;
    document.getElementById("modal-prod-title").textContent = "Registrar Producción de Leche";

    // Solo bovinos hembra
    const bovinos = await apiGet("bovinos", { finca_id: finca.id });
    const hembras = bovinos.filter((b) => b.sexo === "Hembra");

    const sel = document.getElementById("prod-bovino");
    sel.innerHTML = '<option value="">Seleccionar bovino</option>';
    hembras.forEach((b) => {
        sel.innerHTML += `<option value="${b.id}">${b.arete} - ${b.nombre}</option>`;
    });

    if (!hembras.length) {
        showToast("No hay bovinos hembra registrados", "red");
        return;
    }

    document.getElementById("prod-litros").value = "";
    document.getElementById("prod-turno").value = "";
    openModal("modal-produccion");
}

async function editProduccion(id, bovino_id, litros, turno) {
    editProduccionId = id;
    document.getElementById("modal-prod-title").textContent = "Editar Registro de Producción";

    const bovinos = await apiGet("bovinos", { finca_id: finca.id });
    const hembras = bovinos.filter((b) => b.sexo === "Hembra");

    const sel = document.getElementById("prod-bovino");
    sel.innerHTML = '<option value="">Seleccionar bovino</option>';
    hembras.forEach((b) => {
        sel.innerHTML += `<option value="${b.id}">${b.arete} - ${b.nombre}</option>`;
    });

    sel.value = bovino_id;
    document.getElementById("prod-litros").value = litros;
    document.getElementById("prod-turno").value = turno;
    openModal("modal-produccion");
}

async function saveProduccion() {
    const body = {
        finca_id: finca.id,
        usuario_id: usuario.id,
        bovino_id: document.getElementById("prod-bovino").value,
        cantidad_litros: document.getElementById("prod-litros").value,
        turno: document.getElementById("prod-turno").value,
        fecha: new Date().toISOString().split("T")[0],
    };

    if (!body.bovino_id || !body.cantidad_litros || !body.turno) {
        showToast("Completa todos los campos", "red");
        return;
    }
    if (parseFloat(body.cantidad_litros) <= 0) {
        showToast("Los litros producidos deben ser mayores a 0", "red");
        return;
    }

    if (editProduccionId) {
        await apiPut("produccion-leche", editProduccionId, body);
        showToast("Producción actualizada correctamente", "green");
    } else {
        await apiPost("produccion-leche", body);
        showToast("Producción registrada correctamente", "green");
    }

    editProduccionId = null;
    closeModal("modal-produccion");
    cargarProduccion();
}

async function eliminarProduccion(id) {
    if (!confirm("¿Eliminar este registro de producción?")) return;
    await apiDelete("produccion-leche", id);
    showToast("Registro eliminado", "red");
    cargarProduccion();
}


//  SANITARIO (solo marcar completado)

async function cargarSanitario() {
    const eventos = await apiGet("eventos-sanitarios", { finca_id: finca.id });

    const pendientes = eventos.filter((e) => e.estado === "Pendiente").length;
    const completados = eventos.filter(
        (e) => e.estado === "Ejecutado" || e.estado === "Completado",
    ).length;

    document.getElementById("stat-san-pendientes").textContent = pendientes;
    document.getElementById("stat-san-completados").textContent = completados;

    const tbody = document.getElementById("tabla-sanitario");
    tbody.innerHTML = "";

    if (!eventos.length) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:48px;color:var(--texto-suave)">No hay eventos sanitarios programados</td></tr>`;
        return;
    }

    eventos.forEach((e) => {
        const completado =
            e.estado === "Ejecutado" || e.estado === "Completado";
        const estadoBadge = completado
            ? `<span class="badge badge-green">Completado</span>`
            : `<span class="badge badge-yellow">Pendiente</span>`;

        const accionBtn = completado
            ? `<span style="color:var(--texto-suave);font-size:13px;">Completado</span>`
            : `<button class="btn-completar" onclick="marcarCompletado(${e.id})">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                Marcar completado
              </button>`;

        const tipoIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m18 2 4 4"/><path d="m17 7 3-3"/><path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5"/><path d="m9 11 4 4"/></svg>`;

        const calIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;

        tbody.innerHTML += `
            <tr>
                <td><span style="display:flex;align-items:center;gap:6px;">${tipoIcon} ${e.tipo}</span></td>
                <td>${e.bovino ? e.bovino.arete + " - " + e.bovino.nombre : "—"}</td>
                <td><span class="fecha-cell">${calIcon} ${e.fecha}</span></td>
                <td>${e.producto || "—"}</td>
                <td>${e.usuario ? e.usuario.nombre : "—"}</td>
                <td>${estadoBadge}</td>
                <td>${accionBtn}</td>
            </tr>`;
    });
}

async function marcarCompletado(id) {
    await apiPut("eventos-sanitarios", id, { estado: "Ejecutado" });
    showToast("Evento marcado como completado", "green");
    cargarSanitario();
}


//  PESAJES

let editPesajeId = null;

async function cargarPesajes() {
    try {
        const respuesta = await apiGet("pesajes", { finca_id: finca.id });
        const pesajes = Array.isArray(respuesta) ? respuesta : respuesta.data ?? [];
        todosPesajes = pesajes;

        // KPIs
        if (pesajes.length) {
            const ultimo = pesajes[0];
            const promedio =
                pesajes.reduce((s, p) => s + parseFloat(p.peso_kg || 0), 0) /
                pesajes.length;
            document.getElementById("stat-ultimo-pesaje").textContent =
                parseFloat(ultimo.peso_kg).toFixed(0) + " kg";
            document.getElementById("stat-peso-promedio").textContent =
                promedio.toFixed(1) + " kg";
        } else {
            document.getElementById("stat-ultimo-pesaje").textContent = "— kg";
            document.getElementById("stat-peso-promedio").textContent = "— kg";
        }

        // Llenar filtro de bovinos
        const bovinos = [
            ...new Map(pesajes.map((p) => [p.bovino_id, p.bovino])).values(),
        ].filter(Boolean);
        const filtroSel = document.getElementById("filtro-bovino-pesaje");
        const valActual = filtroSel.value;
        filtroSel.innerHTML = '<option value="">Todos los bovinos</option>';
        bovinos.forEach((b) => {
            filtroSel.innerHTML += `<option value="${b.id}">${b.arete} - ${b.nombre}</option>`;
        });
        filtroSel.value = valActual;

        renderPesajes(pesajes);

    } catch (error) {
        console.error("Error cargando pesajes:", error);
        showToast("Error al cargar pesajes", "red");
    }
}

function renderPesajes(pesajes) {
    const tbody = document.getElementById("tabla-pesajes");
    tbody.innerHTML = "";

    if (!pesajes.length) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:48px;color:var(--texto-suave)">No hay pesajes registrados</td></tr>`;
        return;
    }

    pesajes.forEach((p) => {
        const pesoVal = parseFloat(p.peso_kg);
        const pesoStr = isNaN(pesoVal) ? "—" : pesoVal.toFixed(0) + " kg";
        tbody.innerHTML += `
            <tr>
                <td>${p.fecha}</td>
                <td>${p.bovino ? p.bovino.arete + " - " + p.bovino.nombre : "—"}</td>
                <td>${pesoStr}</td>
                <td>${p.usuario ? p.usuario.nombre : usuario.nombre}</td>
                <td>
                    <button class="btn-edit" onclick="editPesaje(${p.id}, '${p.bovino_id}', '${p.peso_kg}', '${p.fecha}')">Editar</button>
                    <button class="btn-delete" onclick="eliminarPesaje(${p.id})">Eliminar</button>
                </td>
            </tr>`;
    });
}

function filtrarPesajes() {
    const val = document.getElementById("filtro-bovino-pesaje").value;
    if (!val) {
        renderPesajes(todosPesajes);
    } else {
        renderPesajes(
            todosPesajes.filter((p) => String(p.bovino_id) === String(val)),
        );
    }
}

async function openFormPesaje() {
    editPesajeId = null;
    document.getElementById("modal-pesaje-title").textContent = "Registrar Pesaje";

    const bovinos = await apiGet("bovinos", { finca_id: finca.id });
    const sel = document.getElementById("pesaje-bovino");
    sel.innerHTML = '<option value="">Seleccionar bovino</option>';
    bovinos.forEach((b) => {
        sel.innerHTML += `<option value="${b.id}">${b.arete} - ${b.nombre}</option>`;
    });
    document.getElementById("pesaje-peso").value = "";
    document.getElementById("pesaje-fecha").value = new Date()
        .toISOString()
        .split("T")[0];
    openModal("modal-pesaje");
}

async function editPesaje(id, bovino_id, peso_kg, fecha) {
    editPesajeId = id;
    document.getElementById("modal-pesaje-title").textContent = "Editar Pesaje";

    const bovinos = await apiGet("bovinos", { finca_id: finca.id });
    const sel = document.getElementById("pesaje-bovino");
    sel.innerHTML = '<option value="">Seleccionar bovino</option>';
    bovinos.forEach((b) => {
        sel.innerHTML += `<option value="${b.id}">${b.arete} - ${b.nombre}</option>`;
    });

    sel.value = bovino_id;
    document.getElementById("pesaje-peso").value = peso_kg;
    document.getElementById("pesaje-fecha").value = fecha;
    openModal("modal-pesaje");
}

async function savePesaje() {
    const body = {
        finca_id: finca.id,
        usuario_id: usuario.id,
        bovino_id: document.getElementById("pesaje-bovino").value,
        peso_kg: document.getElementById("pesaje-peso").value,
        fecha: document.getElementById("pesaje-fecha").value,
    };

    if (!body.bovino_id || !body.peso_kg || !body.fecha) {
        showToast("Completa todos los campos", "red");
        return;
    }
    if (parseFloat(body.peso_kg) <= 0) {
        showToast("El peso debe ser mayor a 0", "red");
        return;
    }

    try {
        if (editPesajeId) {
            await apiPut("pesajes", editPesajeId, body);
            showToast("Pesaje actualizado correctamente", "green");
        } else {
            const res = await apiPost("pesajes", body);
            console.log("Respuesta guardar pesaje:", res);
            if (res.pesaje || res.id || res.success || res.message === "Pesaje registrado correctamente") {
                showToast("Pesaje registrado correctamente", "green");
            } else {
                showToast(res.message || "Error al guardar", "red");
                return;
            }
        }
        editPesajeId = null;
        closeModal("modal-pesaje");
        cargarPesajes();
    } catch (error) {
        console.error("Error guardando pesaje:", error);
        showToast("Error al conectar con el servidor", "red");
    }
}

async function eliminarPesaje(id) {
    if (!confirm("¿Eliminar este registro de pesaje?")) return;
    await apiDelete("pesajes", id);
    showToast("Pesaje eliminado", "red");
    cargarPesajes();
}



// ── Cargar al inicio ──
cargarBovinos();

// ── Menú hamburguesa ──
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('show');
}

function closeSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
}
