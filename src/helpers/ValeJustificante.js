import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const ValeJustificante = async () => {
  try {
    //--------------------------------------------------------------------------//
    const dateActual = new Date();
    const year = dateActual.getFullYear();
    const month = String(dateActual.getMonth() + 1).padStart(2, "0");
    const monthNameLong = dateActual.toLocaleString("es-ES", { month: "long" });
    const day = String(dateActual.getDate()).padStart(2, "0");
    const vacaciones = true;
    const solicitante = "Karla Gameros";
    const jefeInmediato = "Edgar Daniel Jiménez Cabrera";
    let img = new Image();

    img.src = require("../assets/IEEN300.png");
    let totalPagesExp = "{total_pages_count_string}";
    const doc = new jsPDF({ orientation: "portrait", format: "letter" });
    doc.addImage(img, "png", 10, 5, 35, 21);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    let area = "UNIDAD TÉCNICA DE INFORMÁTICA Y ESTADÍSTICA";
    doc.text(
      "INSTITULO ESTATAL ELECTORAL DEL ESTADO DE NAYARIT \n \n" + area + "",
      110,
      10,
      null,
      null,
      "center"
    );
    doc.setFont("helvetica", "normal");
    doc.text(
      "JUSTIFICANTE GENERAL DE INCIDENCIA",
      110,
      25,
      null,
      null,
      "center"
    );

    //--------------------------------------------------------------------------//
    doc.text(
      `Tepic, Nayarit a ${day} de ${monthNameLong} de ${year}.`,
      135,
      40,
      null,
      null
    );
    //--------------------------------------------------------------------------//
    doc.setFont("helvetica", "bold");
    doc.text("Mtra. Claudia Zulema Garnica Pineda", 10, 50);
    doc.text("Titular de la Dirección de Administración", 10, 55);
    doc.text("Presente.", 10, 60);
    //--------------------------------------------------------------------------//
    doc.setFillColor(134, 51, 153);
    doc.setDrawColor(134, 51, 153);
    doc.setLineWidth(0.3);

    doc.rect(10, 65, 195, 7, "FD");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Datos del Trabajdor", 105, 70, null, null, "center");
    //--------------------------------------------------------------------------//
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Nombre del solicitante:", 47, 80, null, null, "right");
    doc.text(`${solicitante}`, 55, 80, null, null);
    doc.setDrawColor(0, 0, 0);
    doc.line(50, 81, 205, 81);
    //--------------------------------------------------------------------------//
    doc.text("Área de adscripción:", 47, 90, null, null, "right");
    doc.text(`${area}`, 55, 90, null, null);
    doc.line(50, 91, 205, 91);
    //--------------------------------------------------------------------------//
    doc.setFillColor(134, 51, 153);
    doc.setDrawColor(134, 51, 153);
    doc.setLineWidth(0.3);

    doc.rect(10, 95, 195, 7, "FD");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Incidencia", 105, 100, null, null, "center");
    //--------------------------------------------------------------------------//
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Solicito a usted de la manera más atenta que se justifique en el registro de asistencia con motivo de:",
      10,
      108,
      null,
      null,
      "left"
    );
    //--------------------------------------------------------------------------//
    // doc.setFont("helvetica", "bold");
    // doc.text("Fecha o dias de incidencia:", 10, 130, null, null, "left");
    // doc.setDrawColor(0, 0, 0);
    // doc.line(60, 130, 150, 130);
    //--------------------------------------------------------------------------//
    // doc.setFont("helvetica", "normal");
    // doc.rect(10, 140, 7, 7);
    // doc.text("Omisión de entrada", 20, 145, null, null, "left");

    // doc.rect(10, 150, 7, 7);
    // doc.text("Omisión de entrada", 20, 155, null, null, "left");

    // doc.rect(10, 160, 7, 7);
    // doc.text("Comisión oficial", 20, 165, null, null, "left");

    // doc.rect(10, 170, 7, 7);
    // doc.text("Permiso día económico", 20, 175, null, null, "left");

    // doc.rect(100, 140, 7, 7);
    // doc.text("Permuta por día laborado", 110, 145, null, null, "left");

    // doc.rect(100, 150, 7, 7);
    // doc.text("Vacaciones", 110, 155, null, null, "left");

    // doc.rect(100, 160, 7, 7);
    // doc.text("Otro", 110, 165, null, null, "left");
    // doc.line(120, 166, 180, 166);
    //--------------------------------------------------------------------------//
    // doc.setFont("helvetica", "bold");
    // doc.text(
    //   "Motivo: (Especificar en todos los casos)",
    //   10,
    //   190,
    //   null,
    //   null,
    //   "left"
    // );
    // doc.rect(10, 195, 195, 30);
    //--------------------------------------------------------------------------//
    var columnStyles = {
      0: {
        cellWidth: 30,
      },
      1: {
        cellWidth: 40,
      },
    };

    var header = [
      [{ content: "Concepto" }, { content: "Fecha" }, { content: "Motivo" }],
    ];

    var rows = [
      [
        "Omisión de entrada",
        "13/09/2023",
        "Esto es una prueba de escrito para los motivos en caso de justificante, los motivos no deberán de exceder de mas de 100 caracteres, la recomendación es no pasar de ese numero de caracteres ya que no hay tanto espacio en la hoja que se imprime con",
      ],
      [
        "Omisión de salida",
        "14/09/2023",
        "Esto es una prueba de escrito para los motivos en caso de justificante, los motivos no deberán de exceder de mas de 100 caracteres, la recomendación es no pasar de ese numero de caracteres ya que no hay tanto espacio en la hoja que se imprime con",
      ],
      [
        "Comisión oficial",
        "14/09/2023",
        "Esto es una prueba de escrito para los motivos en caso de justificante, los motivos no deberán de exceder de mas de 100 caracteres, la recomendación es no pasar de ese numero de caracteres ya que no hay tanto espacio en la hoja que se imprime con",
      ],
      [
        "Permiso día económico",
        "14/09/2023",
        "Esto es una prueba de escrito para los motivos en caso de justificante, los motivos no deberán de exceder de mas de 100 caracteres, la recomendación es no pasar de ese numero de caracteres ya que no hay tanto espacio en la hoja que se imprime con",
      ],
    ];

    jsPDF.autoTableSetDefaults({
      headStyles: {
        fillColor: [134, 51, 153],
        halign: "center",
      },
      styles: {
        halign: "center",
        valign: "middle",
        fontSize: 10,
        lineColor: [0, 0, 0],
        lineWidth: 0.3,
      },
    });

    autoTable(doc, {
      theme: "grid",
      startY: 112,
      margin: { left: 10, right: 10 },
      head: header,
      body: [...rows],
      bodyStyles: { fontSize: 10, textColor: [0, 0, 0] },
      tableLineColor: [0, 0, 0],
      columnStyles: columnStyles,
    });

    //--------------------------------------------------------------------------//
    doc.setFont("helvetica", "normal");
    doc.text(`${solicitante}`, 50, 239, null, null, "center");
    doc.line(10, 240, 90, 240);
    doc.text("Nombre y Firma", 50, 245, null, null, "center");
    doc.text("Solicitante", 50, 250, null, null, "center");
    //--------------------------------------------------------------------------//
    doc.line(125, 240, 205, 240);
    doc.text(`${jefeInmediato}`, 165, 239, null, null, "center");
    doc.text("Nombre y Firma", 165, 245, null, null, "center");
    doc.text("Vo. Bo, Jefe/a inmediato/a", 165, 250, null, null, "center");
    //--------------------------------------------------------------------------//
    doc.line(60, 260, 150, 260);
    doc.text("Nombre y Firma", 105, 265, null, null, "center");
    doc.text("Dirección de Administración", 105, 270, null, null, "center");
    //--------------------------------------------------------------------------//

    //--------------------------------------------------------------------------//
    //Codigo numeracion de paginas
    var footer = function () {
      var pageCount = doc.internal.getNumberOfPages();
      for (var i = 0; i < pageCount; i++) {
        doc.setPage(i + 1);
        doc.text(
          "Página " + (i + 1) + " de " + pageCount,
          340,
          205,
          null,
          null,
          "right"
        );
      }
    };

    //--------------------------------------------------------------------------//

    footer();
    doc.save("Justificante" + ".pdf");
    return {
      success: true,
      msj: "Recibo generado con éxito",
    };

    //--------------------------------------------------------------------------//
  } catch (error) {
    return {
      success: false,
      data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
    };
  }
};

export default ValeJustificante;
