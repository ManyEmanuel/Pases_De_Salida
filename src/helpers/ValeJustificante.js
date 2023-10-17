import { api } from "src/boot/axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { storeToRefs } from "pinia";
import { useJustificanteStore } from "src/stores/justificantes_store";

const ValeJustificante = async () => {
  try {
    const justificanteStore = useJustificanteStore();
    const { justificante, listaIncidencias } = storeToRefs(justificanteStore);

    const resp = await api.get(`/Empleados/GetResponsableByArea/${6}`);
    let { success, data } = resp.data;

    if (success) {
      justificante.value.responsable_Administracion = `${data.nombres}  ${data.apellido_Paterno} ${data.apellido_Materno}`;
    }
    //--------------------------------------------------------------------------//
    const dateActual = new Date();
    const year = dateActual.getFullYear();
    const month = String(dateActual.getMonth() + 1).padStart(2, "0");
    const monthNameLong = dateActual.toLocaleString("es-ES", { month: "long" });
    const day = String(dateActual.getDate()).padStart(2, "0");
    let img = new Image();

    img.src = require("../assets/IEEN300.png");
    let totalPagesExp = "{total_pages_count_string}";
    const doc = new jsPDF({ orientation: "portrait", format: "letter" });
    doc.addImage(img, "png", 10, 5, 35, 21);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    let area = "UNIDAD TÉCNICA DE INFORMÁTICA Y ESTADÍSTICA";
    doc.text(
      "INSTITUTO ESTATAL ELECTORAL DEL ESTADO DE NAYARIT \n \n" + area + "",
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
    doc.text(`${justificante.value.solicitante}`, 55, 80, null, null);
    doc.setDrawColor(0, 0, 0);
    doc.line(50, 81, 205, 81);
    //--------------------------------------------------------------------------//
    doc.text("Área de adscripción:", 47, 90, null, null, "right");
    doc.text(`${justificante.value.area}`, 55, 90, null, null);
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
      body: listaIncidencias.value.map((item) => [
        item.tipo_Justificantes,
        item.dias_Incidencias,
        item.motivo,
      ]),
      bodyStyles: { fontSize: 10, textColor: [0, 0, 0] },
      tableLineColor: [0, 0, 0],
      columnStyles: columnStyles,
    });

    //--------------------------------------------------------------------------//
    doc.setFont("helvetica", "normal");
    doc.text(
      `${justificante.value.solicitante}`,
      50,
      239,
      null,
      null,
      "center"
    );
    doc.line(10, 240, 90, 240);
    doc.text("Nombre y Firma", 50, 245, null, null, "center");
    doc.text("Solicitante", 50, 250, null, null, "center");
    //--------------------------------------------------------------------------//
    doc.line(125, 240, 205, 240);
    doc.text(
      `${justificante.value.responsable_Area}`,
      165,
      239,
      null,
      null,
      "center"
    );
    doc.text("Nombre y Firma", 165, 245, null, null, "center");
    doc.text("Vo. Bo, Jefe/a inmediato/a", 165, 250, null, null, "center");
    //--------------------------------------------------------------------------//
    doc.line(60, 260, 150, 260);
    doc.text(
      `${justificante.value.responsable_Administracion}`,
      105,
      259,
      null,
      null,
      "center"
    );
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
    doc.save(`Justificante-${justificante.value.solicitante}` + ".pdf");
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
