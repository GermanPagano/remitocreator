const { jsPDF } = window.jspdf;

// Función para obtener el número de remito desde localStorage y sumarle 1
function getNextRemitoNumber() {
    let remitoNumber = localStorage.getItem('remitoNumber') || '000000'; // Iniciar en 000000 si no existe
    remitoNumber = (parseInt(remitoNumber) + 1).toString().padStart(6, '0'); // Incrementar y formatear con ceros
    localStorage.setItem('remitoNumber', remitoNumber); // Guardar el nuevo número en localStorage
    return remitoNumber;
}

// Función para obtener la fecha actual en formato dd/mm/yyyy
function getCurrentDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
}

document.getElementById('generatePdf').addEventListener('click', function() {
    const doc = new jsPDF();

    // Obtener el número de remito y la fecha actual
    const remitoNro = getNextRemitoNumber();  // Generar automáticamente el número de remito
    const fecha = getCurrentDate();  // Usar la fecha de hoy

    // Obtener los valores del formulario (Datos del destinatario)
    const razonSocial = document.getElementById('razonSocial').value;
    const direccion = document.getElementById('direccion').value;
    const localidad = document.getElementById('localidad').value;
    const cuitDestinatario = document.getElementById('cuitDestinatario').value;
    const telefono = document.getElementById('telefono').value;
    const cp = document.getElementById('cp').value;
    const provincia = document.getElementById('provincia').value;
    const otrosDatos = document.getElementById('otrosDatos').value || "N/A"; // Campo opcional

    // Obtener los valores del formulario (Detalles del artículo y transportista)
    const descripcion = document.getElementById('descripcion').value;
    const nParte = document.getElementById('nParte').value;
    const nSerie = document.getElementById('nSerie').value;
    const cantidad = document.getElementById('cantidad').value;
    const transportista = document.getElementById('transportista').value;
    const vehiculo = document.getElementById('vehiculo').value;

    // Cargar el logo
    const img = new Image();
    img.src = 'logo aeroend.png';  // Asegúrate de que el logo esté en la misma carpeta

    img.onload = function() {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const logoBase64 = canvas.toDataURL('image/png');

        // Ajustamos la posición del logo
        doc.addImage(logoBase64, 'PNG', 15, 10, 30, 15);  // Ajusta posición y tamaño

        // Parte superior: Detalles del remito y empresa
        doc.setFontSize(12);

        // Texto en negrita (con doc.setFont)
        doc.setFont('helvetica', 'bold');
        doc.text(`Razón Social:`, 55, 10);
        doc.text(`Teléfono:`, 55, 15);
        doc.text(`Cód. Postal:`, 55, 20);
        doc.text(`Dirección:`, 55, 25);
        doc.text(`Localidad:`, 55, 30);
        doc.text(`CUIT:`, 55, 35);

        // Texto en normal para los datos
        doc.setFont('helvetica', 'normal');
        doc.text(`AeroEnd`, 90, 10);
        doc.text(`59490204/1130802888`, 90, 15);
        doc.text(`1714`, 90, 20);
        doc.text(`Perez Quintana 3468`, 90, 25);
        doc.text(`Ituzaingo`, 90, 30);
        doc.text(`30-71769492-5`, 90, 35);

        // Datos del remito (a la derecha)
        doc.setFont('helvetica', 'bold');
        doc.text(`REMITO ${remitoNro}`, 155, 15);  // Ajuste en la posición
        doc.text(`FECHA`, 155, 20);

        doc.setFont('helvetica', 'normal');
        doc.text(`${fecha}`, 155, 25);

        // Dibujar bordes
        doc.rect(10, 5, 190, 35);  // Borde exterior
        doc.rect(150, 5, 50, 35);  // Borde para el número de remito y fecha

        // Sección de los datos del destinatario con más margen
        const margenIzq = 15;  // Ajuste de margen izquierdo para que no quede pegado
        const margenDer = 125; // Ajuste de margen derecho para la segunda columna

        doc.setFont('helvetica', 'bold');
        doc.text('Señor/es:', margenIzq, 50);
        doc.text('Nombre:', margenIzq, 55);
        doc.text('Domicilio:', margenIzq, 60);
        doc.text('Localidad:', margenIzq, 65);
        doc.text('CUIT:', margenIzq, 70);
        doc.text('Otros Datos:', margenIzq, 75);

        doc.setFont('helvetica', 'normal');
        doc.text(`${razonSocial}`, margenIzq + 30, 55);  // Desplazamos más a la derecha
        doc.text(`${direccion}`, margenIzq + 30, 60);
        doc.text(`${localidad}`, margenIzq + 30, 65);
        doc.text(`${cuitDestinatario}`, margenIzq + 30, 70);
        doc.text(`${otrosDatos}`, margenIzq + 30, 75);

        // Datos complementarios del destinatario (a la derecha)
        doc.setFont('helvetica', 'bold');
        doc.text('Teléfono:', margenDer, 55);
        doc.text('C.P.:', margenDer, 60);
        doc.text('Provincia:', margenDer, 65);

        doc.setFont('helvetica', 'normal');
        doc.text(`${telefono}`, margenDer + 30, 55);
        doc.text(`${cp}`, margenDer + 30, 60);
        doc.text(`${provincia}`, margenDer + 30, 65);

        // Dibujar bordes para la sección del destinatario
        doc.rect(10, 45, 190, 35);

        // Detalles del artículo
        doc.text('Detalles del Artículo', 10, 90);
        doc.autoTable({
            head: [['Descripción', 'N° Parte', 'N° Serie', 'Cantidad']],
            body: [[descripcion, nParte, nSerie, cantidad]],
            startY: 95,
        });

        // Datos del transportista
        doc.text('Datos del Transportista', 10, 125);
        doc.text(`Nombre: ${transportista}`, 10, 130);
        doc.text(`Vehículo: ${vehiculo}`, 10, 135);

        // Descargar el PDF
        doc.save('remito.pdf');
    };
});
