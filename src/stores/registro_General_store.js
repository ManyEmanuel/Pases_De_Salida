import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const useRegistroGeneralStore = defineStore("registroGeneral", {
  state: () => ({
    modalFiltro: null,
    textoReporte: null,
    pasesGeneral: [],
    listAreas: [],
  }),
  actions: {
    async loadPasesGeneral() {
      try {
        this.textoReporte = null;
        let resp = await api.get("/PasesSalida/ObtenTodos");
        let { data } = resp.data;
        let listPases = data.map((pases) => {
          let fechaSolicitud = "";
          let horaSolicitud = "";
          let llegadaSolicitud = "";
          let vehiculoSolicitud = "";
          if (pases.tipo_Pase == "Entrada") {
            let filtro = pases.entrada.split(" ");
            fechaSolicitud = filtro[0];
            horaSolicitud = filtro[1];
            llegadaSolicitud = "N/A";
            vehiculoSolicitud = "N/A";
          } else if (pases.tipo_Pase == "Salida") {
            let filtro = pases.salida.split(" ");
            fechaSolicitud = filtro[0];
            horaSolicitud = filtro[1];
            llegadaSolicitud = "N/A";
            vehiculoSolicitud = "N/A";
          } else if (pases.tipo_Pase == "Intermedio") {
            let filtro = pases.salida.split(" ");
            fechaSolicitud = filtro[0];
            horaSolicitud = filtro[1];
            let filtro2 = pases.llegada.split(" ");
            llegadaSolicitud = filtro2[1];
            if (pases.vehiculo != null) {
              vehiculoSolicitud = pases.vehiculo;
            } else {
              vehiculoSolicitud = "N/A";
            }
          }
          let fechaFinal = fechaSolicitud.split("-");
          return {
            id: pases.id,
            solicitante: pases.solicitante,
            tipo_Asunto: pases.tipo_Asunto,
            tipo_Pase: pases.tipo_Pase,
            area: pases.area,
            estatus: pases.estatus,
            folio: pases.folio,
            asunto: pases.asunto,
            asunto:
              pases.asunto.length >= 30
                ? pases.asunto.slice(0, 30) + "..."
                : pases.asunto,
            asunto_Completo: pases.asunto,
            responsable_Area: pases.responsable_Area,
            capturista: pases.capturista,
            area: pases.area,
            entrada: pases.entrada,
            salida: pases.salida,
            fechaSolicitud:
              fechaFinal[2] + "-" + fechaFinal[1] + "-" + fechaFinal[0],
            horaSolicitud: horaSolicitud,
            llegada: llegadaSolicitud,
            vehiculo: vehiculoSolicitud,
          };
        });
        this.pasesGeneral = listPases
          .filter((x) => x.estatus != "Pendiente")
          .reverse();
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async loadAreasList() {
      try {
        const resp = await api.get("/Areas");
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            if (data) {
              let areaArray = data.map((area) => {
                return {
                  value: area.nombre,
                  select: false,
                };
              });
              this.listAreas = areaArray;
            }
          } else {
            return { success, data };
          }
        } else {
          return {
            success: false,
            data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
          };
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async loadFiltroBusqueda(
      areas,
      tipoPase,
      asuntoPase,
      estatusPase,
      inicio,
      fin
    ) {
      try {
        const resp = await api.get("/PasesSalida/ObtenTodos");
        let pasesArray = null;
        let inicial = "";
        let final = "";
        let areasTrue = areas.filter((x) => x.select == true);
        let tipoPaseTrue = tipoPase.filter((x) => x.select == true);
        let asuntoPaseTrue = asuntoPase.filter((x) => x.select == true);
        let estatusPaseTrue = estatusPase.filter((x) => x.select == true);
        let listaPorFecha = [];
        let listaPorArea = [];
        let listaPorTipo = [];
        let listaPorAsunto = [];
        let listaPorEstatus = [];
        let listaFina = [];
        let { success, data } = resp.data;
        if (fin != 0) {
          inicial = new Date(inicio);
          inicial.setMinutes(
            inicial.getMinutes() + inicial.getTimezoneOffset()
          );
          final = new Date(fin);
          final.setMinutes(final.getMinutes() + final.getTimezoneOffset());

          this.textoReporte = "Del " + inicio + " al " + fin;
          //-----------------------------------------------------------------------------------------------//
        } else {
          inicial = new Date(inicio);
          inicial.setMinutes(
            inicial.getMinutes() + inicial.getTimezoneOffset()
          );
          this.textoReporte = "Del " + inicio;
        }
        pasesArray = data.map((pases) => {
          let valorFiltro = false;
          let fechaSolicitud = "";
          let horaSolicitud = "";
          let llegadaSolicitud = "";
          let vehiculoSolicitud = "";
          let entradaFecha = "";
          let salidaFecha = "";
          if (pases.entrada != "") {
            let filtro = pases.entrada.split(" ");
            entradaFecha = new Date(filtro[0]);
            entradaFecha.setMinutes(
              entradaFecha.getMinutes() + entradaFecha.getTimezoneOffset()
            );
            if (fin != 0) {
              if (entradaFecha >= inicial && entradaFecha <= final) {
                valorFiltro = true;
              } else {
                valorFiltro = false;
              }
            } else {
              if (entradaFecha.getTime() == inicial.getTime()) {
                valorFiltro = true;
              } else {
                valorFiltro = false;
              }
            }
          }
          if (pases.salida != "") {
            let filtro = pases.salida.split(" ");
            salidaFecha = new Date(filtro[0]);
            salidaFecha.setMinutes(
              salidaFecha.getMinutes() + salidaFecha.getTimezoneOffset()
            );
            if (fin != 0) {
              if (salidaFecha >= inicial && salidaFecha <= final) {
                valorFiltro = true;
              } else {
                valorFiltro = false;
              }
            } else {
              if (salidaFecha.getTime() == inicial.getTime()) {
                valorFiltro = true;
              } else {
                valorFiltro = false;
              }
            }
          }
          if (pases.tipo_Pase == "Entrada") {
            let filtro = pases.entrada.split(" ");
            fechaSolicitud = filtro[0];
            horaSolicitud = filtro[1];
            llegadaSolicitud = "N/A";
            vehiculoSolicitud = "N/A";
          } else if (pases.tipo_Pase == "Salida") {
            let filtro = pases.salida.split(" ");
            fechaSolicitud = filtro[0];
            horaSolicitud = filtro[1];
            llegadaSolicitud = "N/A";
            vehiculoSolicitud = "N/A";
          } else if (pases.tipo_Pase == "Intermedio") {
            let filtro = pases.salida.split(" ");
            fechaSolicitud = filtro[0];
            horaSolicitud = filtro[1];
            let filtro2 = pases.llegada.split(" ");
            llegadaSolicitud = filtro2[1];
            if (pases.vehiculo != null) {
              vehiculoSolicitud = pases.vehiculo;
            } else {
              vehiculoSolicitud = "N/A";
            }
          }
          let fechaFinal = fechaSolicitud.split("-");
          //["Entrada", "Intermedio", "Salida"]
          return {
            id: pases.id,
            solicitante: pases.solicitante,
            tipo_Asunto: pases.tipo_Asunto,
            tipo_Pase: pases.tipo_Pase,
            area: pases.area,
            estatus: pases.estatus,
            folio: pases.folio,
            asunto: pases.asunto,
            responsable_Area: pases.responsable_Area,
            capturista: pases.capturista,
            area: pases.area,
            entrada: pases.entrada,
            salida: pases.salida,
            fechaSolicitud:
              fechaFinal[2] + "-" + fechaFinal[1] + "-" + fechaFinal[0],
            horaSolicitud: horaSolicitud,
            llegada: llegadaSolicitud,
            vehiculo: vehiculoSolicitud,
            filtro: valorFiltro,
          };
        });
        listaPorFecha = pasesArray
          .filter((x) => x.filtro == true && x.estatus != "Pendiente")
          .reverse();

        if (areas.length == areasTrue.length) {
          listaPorArea = listaPorFecha;
        } else {
          for (let i = 0; i < areasTrue.length; i++) {
            let filtro = listaPorFecha.filter(
              (x) => x.area == areasTrue[i].value
            );
            if (filtro.length > 0) {
              if (i == 0) {
                listaPorArea = filtro;
              } else {
                listaPorArea = listaPorArea.concat(filtro);
              }
            }
          }
        }

        if (tipoPase.length == tipoPaseTrue.length) {
          listaPorTipo = listaPorArea;
        } else {
          for (let i = 0; i < tipoPaseTrue.length; i++) {
            let filtro = listaPorArea.filter(
              (x) => x.tipo_Pase == tipoPaseTrue[i].value
            );
            if (filtro.length > 0) {
              if (i == 0) {
                listaPorTipo = filtro;
              } else {
                listaPorTipo = listaPorTipo.concat(filtro);
              }
            }
          }
        }

        if (asuntoPase.length == asuntoPaseTrue.length) {
          listaPorAsunto = listaPorTipo;
        } else {
          for (let i = 0; i < asuntoPaseTrue.length; i++) {
            let filtro = listaPorTipo.filter(
              (x) => x.tipo_Asunto == asuntoPaseTrue[i].value
            );
            if (filtro.length > 0) {
              if (i == 0) {
                listaPorAsunto = filtro;
              } else {
                listaPorAsunto = listaPorAsunto.concat(filtro);
              }
            }
          }
        }
        if (estatusPase.length == estatusPaseTrue.length) {
          listaPorEstatus = listaPorAsunto;
        } else {
          for (let i = 0; i < estatusPaseTrue.length; i++) {
            let filtro = listaPorAsunto.filter(
              (x) => x.estatus == estatusPaseTrue[i].value
            );
            if (filtro.length > 0) {
              if (i == 0) {
                listaPorEstatus = filtro;
              } else {
                listaPorEstatus = listaPorEstatus.concat(filtro);
              }
            }
          }
        }

        this.pasesGeneral = listaPorEstatus;
        return {
          success: true,
          data: "Filtro correctamente aplicado",
        };
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async createReporte() {
      try {
        let img = new Image();
        let totalPagesExp = "{total_pages_count_string}";
        img.src = require("../assets/IEEN300.png");
        let body = [];
        if (this.textoReporte == null) {
          this.textoReporte = "";
        }
        let num = 1;
        this.pasesGeneral.forEach((item) => {
          body.push([
            num.toString(),
            item.folio,
            item.area,
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
        doc.text(
          "Pases de salida \n" + "Reporte general \n" + this.textoReporte,
          140,
          15,
          null,
          null,
          "center",
          22
        );
        autoTable(doc, {
          theme: "grid",
          startY: 35,
          head: [
            [
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

        doc.save("Reporte_General_Pases_Salida" + ".pdf");
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    actualizarModalFiltro(valor) {
      this.modalFiltro = valor;
    },
  },
});
