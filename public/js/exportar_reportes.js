//Nueva funcioanlidad de exportar reportes PDF
async function exportarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const verde   = [26, 143, 60];
    const navy    = [26, 35, 50];
    const gris    = [90, 106, 126];
    const blanco  = [255, 255, 255];
    const bgGris  = [244, 246, 248];

    const hoy     = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
    const pageW   = doc.internal.pageSize.getWidth();

    // Encabezado
    doc.setFillColor(...verde);
    doc.rect(0, 0, pageW, 30, 'F');

    doc.setFillColor(...verde);
    doc.rect(0, 28, pageW, 2, 'F');

    doc.setTextColor(...blanco);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('SGDB: Reporte de la Finca', 14, 13);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(finca.nombre + '  |  Generado: ' + hoy, 14, 22);

    let y = 40;

    // Indicadores
    doc.setFillColor(...bgGris);
    doc.roundedRect(10, y, pageW - 20, 8, 2, 2, 'F');
    doc.setTextColor(...navy);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('INDICADORES PRINCIPALES', 14, y + 5.5);
    y += 14;

    const bovinos    = await apiGet('bovinos', { finca_id: finca.id });
    const eventos    = await apiGet('eventos-sanitarios', { finca_id: finca.id });
    const produccion = await apiGet('produccion-leche', { finca_id: finca.id });
    const pesajes    = await apiGet('pesajes', { finca_id: finca.id });

    const hoyStr     = new Date().toISOString().split('T')[0];
    const prodHoy    = produccion.filter(r => r.fecha === hoyStr).reduce((s, r) => s + parseFloat(r.cantidad_litros || 0), 0);
    const pesoPromedio = bovinos.length ? Math.round(bovinos.reduce((s, b) => s + parseFloat(b.peso_inicial || 0), 0) / bovinos.length) : 0;
    const alertas    = bovinos.filter(b => b.estado_salud !== 'Saludable').length;
    const vacunas    = eventos.filter(e => e.tipo === 'Vacunación').length;

    const kpis = [
        ['Total Bovinos',     bovinos.length],
        ['Produccion hoy',    prodHoy.toFixed(1) + ' L'],
        ['Peso promedio',     pesoPromedio + ' kg'],
        ['Vacunaciones',      vacunas],
        ['Alertas activas',   alertas],
        ['Total pesajes',     pesajes.length],
    ];

    const colW   = (pageW - 20) / 3;
    const rowH   = 20;
    kpis.forEach((kpi, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x   = 10 + col * colW;
        const cy  = y + row * (rowH + 4);

        doc.setFillColor(...blanco);
        doc.setDrawColor(...[224, 228, 234]);
        doc.roundedRect(x, cy, colW - 4, rowH, 2, 2, 'FD');

        doc.setTextColor(...verde);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text(String(kpi[1]), x + (colW - 4) / 2, cy + 9, { align: 'center' });

        doc.setTextColor(...gris);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text(kpi[0], x + (colW - 4) / 2, cy + 15, { align: 'center' });
    });

    y += Math.ceil(kpis.length / 3) * (rowH + 4) + 10;

    // Tabla de bovinos
    doc.setFillColor(...bgGris);
    doc.roundedRect(10, y, pageW - 20, 8, 2, 2, 'F');
    doc.setTextColor(...navy);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('LISTADO DE BOVINOS', 14, y + 5.5);
    y += 12;

    doc.autoTable({
        startY: y,
        margin: { left: 10, right: 10 },
        head: [['ID', 'Arete', 'Nombre', 'Raza', 'Categoria', 'Estado de Salud', 'Peso Inicial']],
        body: bovinos.map(b => [
            b.id,
            b.arete,
            b.nombre,
            b.raza ? b.raza.nombre : '—',
            b.categoria || '—',
            b.estado_salud,
            b.peso_inicial ? b.peso_inicial + ' kg' : '—',
        ]),
        headStyles: {
            fillColor: navy,
            textColor: blanco,
            fontStyle: 'bold',
            fontSize: 8,
        },
        bodyStyles: {
            fontSize: 8,
            textColor: navy,
        },
        alternateRowStyles: {
            fillColor: bgGris,
        },
        columnStyles: {
            0: { cellWidth: 10 },
            1: { cellWidth: 22 },
            2: { cellWidth: 28 },
            3: { cellWidth: 25 },
            4: { cellWidth: 25 },
            5: { cellWidth: 35 },
            6: { cellWidth: 22 },
        },
    });

    y = doc.lastAutoTable.finalY + 12;

    // Tabla de eventos sanitarios
    if (y > 240) { doc.addPage(); y = 20; }

    doc.setFillColor(...bgGris);
    doc.roundedRect(10, y, pageW - 20, 8, 2, 2, 'F');
    doc.setTextColor(...navy);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('EVENTOS SANITARIOS', 14, y + 5.5);
    y += 12;

    doc.autoTable({
        startY: y,
        margin: { left: 10, right: 10 },
        head: [['ID', 'Bovino', 'Tipo', 'Producto', 'Fecha', 'Estado']],
        body: eventos.map(e => [
            e.id,
            e.bovino ? e.bovino.nombre : '—',
            e.tipo,
            e.producto,
            e.fecha,
            e.estado,
        ]),
        headStyles: {
            fillColor: navy,
            textColor: blanco,
            fontStyle: 'bold',
            fontSize: 8,
        },
        bodyStyles: {
            fontSize: 8,
            textColor: navy,
        },
        alternateRowStyles: {
            fillColor: bgGris,
        },
    });

    y = doc.lastAutoTable.finalY + 12;

    // Tabla producción
    if (y > 240) { doc.addPage(); y = 20; }

    doc.setFillColor(...bgGris);
    doc.roundedRect(10, y, pageW - 20, 8, 2, 2, 'F');
    doc.setTextColor(...navy);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('PRODUCCION DE LECHE', 14, y + 5.5);
    y += 12;

    doc.autoTable({
        startY: y,
        margin: { left: 10, right: 10 },
        head: [['Fecha', 'Bovino', 'Litros', 'Turno', 'Registrado por']],
        body: produccion.map(p => [
            p.fecha,
            p.bovino ? p.bovino.arete + ' — ' + p.bovino.nombre : '—',
            parseFloat(p.cantidad_litros).toFixed(1) + ' L',
            p.turno,
            p.usuario ? p.usuario.nombre : '—',
        ]),
        headStyles: {
            fillColor: navy,
            textColor: blanco,
            fontStyle: 'bold',
            fontSize: 8,
        },
        bodyStyles: {
            fontSize: 8,
            textColor: navy,
        },
        alternateRowStyles: {
            fillColor: bgGris,
        },
    });

    y = doc.lastAutoTable.finalY + 12;

    // Tabala pesajes
    if (y > 240) { doc.addPage(); y = 20; }

    doc.setFillColor(...bgGris);
    doc.roundedRect(10, y, pageW - 20, 8, 2, 2, 'F');
    doc.setTextColor(...navy);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('HISTORIAL DE PESAJES', 14, y + 5.5);
    y += 12;

    doc.autoTable({
        startY: y,
        margin: { left: 10, right: 10 },
        head: [['Fecha', 'Bovino', 'Peso (kg)', 'Registrado por']],
        body: pesajes.map(p => [
            p.fecha,
            p.bovino ? p.bovino.arete + ' — ' + p.bovino.nombre : '—',
            parseFloat(p.peso_kg).toFixed(1) + ' kg',
            p.usuario ? p.usuario.nombre : '—',
        ]),
        headStyles: {
            fillColor: navy,
            textColor: blanco,
            fontStyle: 'bold',
            fontSize: 8,
        },
        bodyStyles: {
            fontSize: 8,
            textColor: navy,
        },
        alternateRowStyles: {
            fillColor: bgGris,
        },
    });

    // Pide de pagina en todas las páginas
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFillColor(...navy);
        doc.rect(0, 287, pageW, 10, 'F');
        doc.setTextColor(...blanco);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text('SGDB — ' + finca.nombre + '  |  ' + hoy, 14, 293);
        doc.text('Pagina ' + i + ' de ' + totalPages, pageW - 14, 293, { align: 'right' });
    }

    // Descargar
    const nombreArchivo = `Reporte_${finca.nombre.replace(/\s+g/, '_')}_${hoyStr}.pdf`;
    doc.save(nombreArchivo);

    showToast('Reporte exportado correctamente', 'green');
}
