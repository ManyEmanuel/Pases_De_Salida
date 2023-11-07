import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { storeToRefs } from "pinia";
import { useJustificanteStore } from "src/stores/justificantes_store";
import { api } from "src/boot/axios";

const ReporteGeneralJustificantes = async (date) => {
  try {
    //--------------------------------------------------------------------------//
    const justificanteStore = useJustificanteStore();
    const { configuracion, listReporte, listFiltroReporte } =
      storeToRefs(justificanteStore);
    const resp = await api.get("/Areas/AreaByUsuario");
    const { data } = resp.data;
    let img = new Image();
    img.src = require("../assets/IEEN300.png");
    const doc = new jsPDF({ orientation: "portrait", format: "letter" });
    doc.addImage(img, "png", 10, 5, 35, 21);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(
      `INSTITUTO ESTATAL ELECTORAL DE NAYARIT \n \n ${data.area.toUpperCase()}`,
      110,
      10,
      null,
      null,
      "center"
    );
    doc.setFont("helvetica", "normal");
    doc.text("REPORTE GENERAL DE INCIDENCIAS", 110, 25, null, null, "center");
    doc.text(`${date.from} hasta ${date.to}`, 110, 35, null, null, "center");

    //--------------------------------------------------------------------------//

    var header = [
      [
        { content: "Personal" },
        { content: "Omisión de entrada" },
        { content: "Omisión de salida" },
        { content: "Comisión oficial" },
        { content: "Permuta por día laborado" },
        { content: "Otros" },
        { content: "Permiso por día económico" },
        { content: "Vacaciones primer periodo" },
        { content: "Vacaciones segundo periodo" },
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
      body: listFiltroReporte.value.map((item) => [
        item.empleado,
        item.omision_Entrada,
        item.omision_Salida,
        item.comision_Oficial,
        item.permuta_Laboral,
        item.otros,
        `${configuracion.value[0].dias_Economicos - item.permiso_Economico}/${
          configuracion.value[0].dias_Economicos
        }`,
        item.vacaciones_P1,
        `${configuracion.value[0].dias_Segundo_Periodo - item.vacaciones_P2}/${
          configuracion.value[0].dias_Segundo_Periodo
        }`,
      ]),
      bodyStyles: { fontSize: 10, textColor: [0, 0, 0] },
      tableLineColor: [0, 0, 0],
    });

    //--------------------------------------------------------------------------//
    //Codigo numeración de paginas
    var footer = function () {
      var pageCount = doc.internal.getNumberOfPages();
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
