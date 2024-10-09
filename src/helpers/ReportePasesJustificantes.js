import { jsPDF } from "jspdf";
import { storeToRefs } from "pinia";
import { useRegistroGeneralStore } from "src/stores/registro_General_store";
import { useSolicitudJustificanteStore } from "src/stores/solicitudes_Justificantes_store";
import autoTable from "jspdf-autotable";

const ReportePasesJustificantes = async (tipo) => {
  try {
    const generalStore = useRegistroGeneralStore();
    const solicitudesJustificantesStore = useSolicitudJustificanteStore();
    const { pasesGeneralFiltrado } = storeToRefs(generalStore);
    const { list_Justificantes_Todos_Filtrado } = storeToRefs(
      solicitudesJustificantesStore
    );
    let img = new Image();
    let totalPagesExp = "{total_pages_count_string}";
    img.src = require("../assets/IEEN300.png");
    let body = [];
    let num = 1;
    if (tipo == "pases") {
      pasesGeneralFiltrado.value.forEach((item) => {
        body.push([
          num.toString(),
          item.folio,
          item.area_Completa,
          item.solicitante,
          item.tipo_Asunto,
          item.tipo_Pase,
          item.fechaSolicitud,
          item.horaSolicitud,
          item.llegada,
          item.vehiculo,
          item.estatus,
        ]);
        num = num + 1;
      });
    } else {
      list_Justificantes_Todos_Filtrado.value.forEach((item) => {
        body.push([
          num.toString(),
          item.folio,
          item.area_Completa,
          item.solicitante,
          item.fecha_Creacion,
          item.estatus,
        ]);
        num = num + 1;
      });
    }

    jsPDF.autoTableSetDefaults({
      headStyles: { fillColor: [84, 37, 131], halign: "center" },
      styles: {
        halign: "center",
        valign: "middle",
      },
    });
    const doc = new jsPDF({
      orientation: "landscape",
      format: "letter",
    });
    doc.addImage(img, "png", 15, 8, 35, 18);
    doc.setFontSize(15);
    if (tipo == "pases") {
      doc.text(
        "PASES DE SALIDA \n" + "REPORTE GENERAL \n",
        140,
        15,
        null,
        null,
        "center",
        22
      );
    } else {
      doc.text(
        "JUSTIFICANTES \n" + "REPORTE GENERAL \n",
        140,
        15,
        null,
        null,
        "center",
        22
      );
    }
    autoTable(doc, {
      theme: "grid",
      startY: 35,
      head: [
        tipo == "pases"
          ? [
              "#",
              "Folio",
              "Área",
              "Solicitante",
              "Tipo de asunto",
              "Tipo de pase",
              "Fecha de pase",
              "Hora Ent/Sal",
              "Hora llegada",
              "Vehículo",
              "Estatus",
            ]
          : [
              "#",
              "Folio",
              "Área",
              "Solicitante",
              "Fecha de creación",
              "Estatus",
            ],
      ],
      body: body,
      didDrawPage: function (data) {
        let str = "Página " + doc.internal.getNumberOfPages();
        if (typeof doc.putTotalPages === "function") {
          str = str + " de " + totalPagesExp;
        }
        doc.setFontSize(11);
        doc.text(str, 235, 290, null, null, "right");
      },
    });
    if (typeof doc.putTotalPages === "function") {
      doc.putTotalPages(totalPagesExp);
    }

    doc.save(
      `Reporte_General_${tipo == "pases" ? "Pases_Salida" : "Justificantes"}` +
        ".pdf"
    );
  } catch (error) {
    return {
      success: false,
      data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
    };
  }
};

export default ReportePasesJustificantes;
