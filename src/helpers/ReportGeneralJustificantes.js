import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { storeToRefs } from "pinia";
import { useJustificanteStore } from "src/stores/justificantes_store";

const ReporteGeneralJustificantes = async () => {
  try {
    //--------------------------------------------------------------------------//
    const justificanteStore = useJustificanteStore();
    const { configuracion } = storeToRefs(justificanteStore);
    let img = new Image();
    img.src = require("../assets/IEEN300.png");
    const doc = new jsPDF({ orientation: "portrait", format: "letter" });
    doc.addImage(img, "png", 10, 5, 35, 21);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    let area = "UNIDAD TÉCNICA DE INFORMÁTICA Y ESTADÍSTICA";
    doc.text(
      "INSTITUTO ESTATAL ELECTORAL DE NAYARIT \n \n" + area + "",
      110,
      10,
      null,
      null,
      "center"
    );
    doc.setFont("helvetica", "normal");
    doc.text("REPORTE GENERAL DE INCIDENCIAS", 110, 25, null, null, "center");
    doc.text("04/07/2023 hasta 05/07/2023", 110, 35, null, null, "center");

    //--------------------------------------------------------------------------//

    var header = [
      [
        { content: "Area" },
        { content: "Personal" },
        { content: "Omisión de entrada" },
        { content: "Omisión de salida" },
        { content: "Comisión oficial" },
        { content: "Permuta por día laborado" },
        { content: "Permiso por día económico" },
        { content: "Vacaciones" },
      ],
    ];

    var rows = [
      [
        "areaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        "personal",
        "1",
        "1",
        "1",
        "1",
        `1/${configuracion.value.dias_Economicos}`,
        `1/${configuracion.value.dias_Segundo_Periodo}`,
      ],
      [
        "areaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        "personal",
        "1",
        "1",
        "1",
        "1",
        `1/${configuracion.value.dias_Economicos}`,
        `1/${configuracion.value.dias_Segundo_Periodo}`,
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
      startY: 45,
      margin: { left: 10, right: 10 },
      head: header,
      body: [...rows],
      bodyStyles: { fontSize: 10, textColor: [0, 0, 0] },
      tableLineColor: [0, 0, 0],
    });
    //--------------------------------------------------------------------------//
    //Codigo numeración de paginas
    var footer = function () {
      var pageCount = doc.internal.getNumberOfPages();
      console.log("pageCount", pageCount);
      for (var i = 0; i < pageCount; i++) {
        doc.setPage(i + 1);
        doc.text(
          "Página " + (i + 1) + " de " + pageCount,
          205,
          270,
          null,
          null,
          "right"
        );
      }
    };

    //--------------------------------------------------------------------------//

    footer();
    doc.save("ReporteGeneralJustificantes" + ".pdf");
    return {
      success: true,
      msj: "Recibo generado con éxito",
    };
  } catch (error) {
    return {
      success: false,
      data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
    };
  }
};

export default ReporteGeneralJustificantes;
