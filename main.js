// Asegúrate de obtener jsPDF desde el objeto window
const { jsPDF } = window.jspdf;

// Función para obtener el número de remito desde localStorage y sumarle 1
function getNextRemitoNumber() {
  let remitoNumber = localStorage.getItem("remitoNumber") || "000000"; // Iniciar en 000000 si no existe
  remitoNumber = (parseInt(remitoNumber) + 1).toString().padStart(6, "0"); // Incrementar y formatear con ceros
  localStorage.setItem("remitoNumber", remitoNumber); // Guardar el nuevo número en localStorage
  return remitoNumber;
}

// Función para obtener la fecha actual en formato dd/mm/yyyy
function getCurrentDate() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Los meses van de 0 a 11
  const year = today.getFullYear();
  return `${day}/${month}/${year}`;
}

$(document).ready(function () {
  // Función para mostrar el step actual y ocultar los otros
  function showStep(step) {
    $(".step").removeClass("active");
    $(`#step${step}`).addClass("active");
  }

  // Al hacer clic en "Continuar", cambiar a la segunda sección
  $("#nextToStep2").click(function () {
    showStep(2);
  });

  // Al hacer clic en "Atrás" en el Step 2, volver al Step 1
  $("#prevToStep1").click(function () {
    showStep(1);
  });

  // Al hacer clic en "Continuar" en el Step 2, ir al Step 3
  $("#nextToStep3").click(function () {
    showStep(3);
  });

  // Al hacer clic en "Atrás" en el Step 3, volver al Step 2
  $("#prevToStep2").click(function () {
    showStep(2);
  });

  // Función para agregar una nueva línea al hacer clic en el botón
  $("#addRowButton").click(function () {
    const newRow = `
            <tr>
                <td><input type="text" required></td>
                <td><input type="text" required></td>
                <td><input type="text" required></td>
                <td><input type="number" required></td>
            </tr>`;
    $("#articulosTable tbody").append(newRow);
  });

  // Función para generar el PDF
  document.getElementById("generatePdf").addEventListener("click", function () {
    const doc = new jsPDF();

    const remitoNro = getNextRemitoNumber();
    const fecha = getCurrentDate();

    const razonSocial = document.getElementById("razonSocial").value;
    const direccion = document.getElementById("direccion").value;
    const localidad = document.getElementById("localidad").value;
    const cuitDestinatario = document.getElementById("cuitDestinatario").value;
    const telefono = document.getElementById("telefono").value;
    const cp = document.getElementById("cp").value;
    const provincia = document.getElementById("provincia").value;
    const otrosDatos = document.getElementById("otrosDatos").value || "N/A";

    let articulos = [];
    $("#articulosTable tbody tr").each(function () {
      const descripcion = $(this).find("input").eq(0).val();
      const nParte = $(this).find("input").eq(1).val();
      const nSerie = $(this).find("input").eq(2).val();
      const cantidad = $(this).find("input").eq(3).val();
      articulos.push([descripcion, nParte, nSerie, cantidad]);
    });

    const transportista = document.getElementById("transportista").value;
    const vehiculo = document.getElementById("vehiculo").value;
    const lugarEntrega = document.getElementById("lugarEntrega").value;
    const horaEntrega = document.getElementById("horaEntrega").value;
    const observaciones =
      document.getElementById("observaciones").value || "Sin observaciones";

    const img = new Image();
    img.src = "logo aeroend.png";

    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      const logoBase64 = canvas.toDataURL("image/png");

      doc.addImage(logoBase64, "PNG", 15, 10, 30, 15);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`Razón Social:`, 55, 10);
      doc.text(`Teléfono:`, 55, 15);
      doc.text(`Cód. Postal:`, 55, 20);
      doc.text(`Dirección:`, 55, 25);
      doc.text(`Localidad:`, 55, 30);
      doc.text(`CUIT:`, 55, 35);

      doc.setFont("helvetica", "normal");
      doc.text(`AeroEnd`, 90, 10);
      doc.text(`59490204/1130802888`, 90, 15);
      doc.text(`1714`, 90, 20);
      doc.text(`Perez Quintana 3468`, 90, 25);
      doc.text(`Ituzaingo`, 90, 30);
      doc.text(`30-71769492-5`, 90, 35);

      doc.setFont("helvetica", "bold");
      doc.text(`REMITO ${remitoNro}`, 155, 15);
      doc.text(`FECHA`, 155, 20);

      doc.setFont("helvetica", "normal");
      doc.text(`${fecha}`, 155, 25);

      doc.rect(10, 5, 190, 35);
      doc.rect(150, 5, 50, 35);

      const margenIzq = 15;
      const margenDer = 125;

      doc.setFont("helvetica", "bold");
      doc.text("Señor/es:", margenIzq, 50);
      doc.text("Nombre:", margenIzq, 55);
      doc.text("Domicilio:", margenIzq, 60);
      doc.text("Localidad:", margenIzq, 65);
      doc.text("CUIT:", margenIzq, 70);
      doc.text("Otros Datos:", margenIzq, 75);

      doc.setFont("helvetica", "normal");
      doc.text(`${razonSocial}`, margenIzq + 30, 55);
      doc.text(`${direccion}`, margenIzq + 30, 60);
      doc.text(`${localidad}`, margenIzq + 30, 65);
      doc.text(`${cuitDestinatario}`, margenIzq + 30, 70);
      doc.text(`${otrosDatos}`, margenIzq + 30, 75);

      doc.setFont("helvetica", "bold");
      doc.text("Teléfono:", margenDer, 55);
      doc.text("C.P.:", margenDer, 60);
      doc.text("Provincia:", margenDer, 65);

      doc.setFont("helvetica", "normal");
      doc.text(`${telefono}`, margenDer + 30, 55);
      doc.text(`${cp}`, margenDer + 30, 60);
      doc.text(`${provincia}`, margenDer + 30, 65);

      doc.rect(10, 45, 190, 35);

      doc.text("Detalles del Artículo", 10, 90);
      doc.autoTable({
        head: [["Descripción", "N° Parte", "N° Serie", "Cantidad"]],
        body: articulos,
        startY: 95,
      });

      const finalY = doc.lastAutoTable.finalY;

      // Datos del transportista (colocar debajo de la tabla)
      doc.text("Datos del Transportista", 10, finalY + 10);
      doc.text(`Nombre: ${transportista}`, 10, finalY + 15);
      doc.text(`Vehículo: ${vehiculo}`, 10, finalY + 20);
      doc.text(`Lugar de Entrega: ${lugarEntrega}`, 10, finalY + 25);
      doc.text(`Hora de Entrega: ${horaEntrega}`, 10, finalY + 30);

      // Espacio para la firma
      doc.text("Recibí Conforme:", 10, finalY + 50); // A la izquierda
      doc.line(120, finalY + 55, 190, finalY + 55); // Línea para la firma, más a la derecha
      doc.text("Firma y Sello", 140, finalY + 60); // Texto a la derecha

      // Observaciones
      doc.text("Observaciones:", 10, finalY + 75);
      doc.rect(10, finalY + 80, 190, 20); // Cuadro para observaciones
      doc.text(`${observaciones}`, 15, finalY + 90);

      // Descargar el PDF
      doc.save("remito.pdf");
    }; // Cierra la función img.onload
  }); // Cierra la función addEventListener 'click'
}); // Cierra document ready
