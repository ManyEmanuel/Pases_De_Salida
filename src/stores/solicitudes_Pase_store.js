import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import moment from "moment-timezone";
import jsPDF from "jspdf";

export const useSolicitudPaseStore = defineStore("solicitudPase", {
  state: () => ({
    solicitudes: [],
    historial: [],
    solicitud: {
      id: null,
      responsable_Area_Id: null,
      responsable_Area: null,
      solicitante_Id: null,
      solicitante: null,
      puesto_Solicitante_Id: null,
      puesto_Solicitante: null,
      capturista_Id: null,
      capturista: null,
      vehiculo_Id: null,
      vehiculo: null,
      area_Id: null,
      area: null,
      estatus: null,
      folio: null,
      entrada: null,
      salida: null,
      llegada: null,
      fecha_Aprobacion_Rechazo: null,
      tipo_Asunto: null,
      tipo_Pase: null,
      asunto: null,
      fecha_Creacion: null,
    },
  }),
  actions: {
    async loadSolicitudes() {
      try {
        let resp = await api.get("/PasesSalida/Pendientes");
        let { success, data } = resp.data;
        let listPendientes = null;
        let listPendientesArea = data.map((pases) => {
          let fechaPase = null;
          if (pases.tipo_Pase == "Entrada") {
            fechaPase = pases.entrada.split(" ");
          } else {
            fechaPase = pases.salida.split(" ");
          }
          let fechaFinal = fechaPase[0].split("-");
          return {
            id: pases.id,
            solicitante: pases.solicitante,
            solicitante_Id: pases.solicitante_Id,
            tipo_Asunto: pases.tipo_Asunto,
            tipo_Pase: pases.tipo_Pase,
            area: pases.area,
            area_Id: pases.area_Id,
            estatus: pases.estatus,
            folio: pases.folio,
            asunto: pases.asunto,
            fechaSolicitud:
              fechaFinal[2] + "-" + fechaFinal[1] + "-" + fechaFinal[0],
            responsable_Area: pases.responsable_Area,
            responsable_Area_Id: pases.responsable_Area_Id,
            capturista: pases.capturista,
          };
        });
        if (localStorage.getItem("tipoEmp").toString() == "JefeArea") {
          let respTodos = await api.get("/PasesSalida/ObtenTodos");
          let listTodos = respTodos.data.data;
          console.log("Esto es todos", listTodos);
          let listPendientesTodos = listTodos.map((todos) => {
            let fechaPase = null;
            if (todos.tipo_Pase == "Entrada") {
              fechaPase = todos.entrada.split(" ");
            } else {
              fechaPase = todos.salida.split(" ");
            }
            let fechaFinal = fechaPase[0].split("-");
            return {
              id: todos.id,
              solicitante: todos.solicitante,
              solicitante_Id: todos.solicitante_Id,
              tipo_Asunto: todos.tipo_Asunto,
              tipo_Pase: todos.tipo_Pase,
              area: todos.area,
              area_Id: todos.area_Id,
              estatus: todos.estatus,
              folio: todos.folio,
              asunto: todos.asunto,
              fechaSolicitud:
                fechaFinal[2] + "-" + fechaFinal[1] + "-" + fechaFinal[0],
              responsable_Area: todos.responsable_Area,
              responsable_Area_Id: todos.responsable_Area_Id,
              capturista: todos.capturista,
            };
          });
          let listFiltro = listPendientesTodos.filter(
            (x) =>
              x.area_Id != parseInt(localStorage.getItem("area")) &&
              x.estatus === "Pendiente" &&
              x.responsable_Area_Id ==
                parseInt(localStorage.getItem("empleado"))
          );
          listPendientes = listPendientesArea.concat(listFiltro);
        } else {
          listPendientes = listPendientesArea;
        }
        this.solicitudes = listPendientes.filter(
          (x) => x.solicitante_Id != parseInt(localStorage.getItem("empleado"))
        );
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async loadHistorial() {
      try {
        let resp = await api.get("/PasesSalida/ByArea");
        let { success, data } = resp.data;
        let listHistorial = null;
        let listHistorialArea = data.map((pases) => {
          let fechaPase = null;
          if (pases.tipo_Pase == "Entrada") {
            fechaPase = pases.entrada.split(" ");
          } else {
            fechaPase = pases.salida.split(" ");
          }
          let fechaFinal = fechaPase[0].split("-");
          return {
            id: pases.id,
            solicitante: pases.solicitante,
            solicitante_Id: pases.solicitante_Id,
            tipo_Asunto: pases.tipo_Asunto,
            tipo_Pase: pases.tipo_Pase,
            area: pases.area,
            area_Id: pases.area_Id,
            estatus: pases.estatus,
            folio: pases.folio,
            asunto: pases.asunto,
            fechaSolicitud:
              fechaFinal[2] + "-" + fechaFinal[1] + "-" + fechaFinal[0],
            responsable_Area: pases.responsable_Area,
            responsable_Area_Id: pases.responsable_Area_Id,
            capturista: pases.capturista,
          };
        });
        if (localStorage.getItem("tipoEmp").toString() == "JefeArea") {
          let respTodos = await api.get("/PasesSalida/ObtenTodos");
          let listTodos = respTodos.data.data;
          let listHistorialTodos = listTodos.map((todos) => {
            let fechaPase = null;
            if (todos.tipo_Pase == "Entrada") {
              fechaPase = todos.entrada.split(" ");
            } else {
              fechaPase = todos.salida.split(" ");
            }
            let fechaFinal = fechaPase[0].split("-");
            return {
              id: todos.id,
              solicitante: todos.solicitante,
              solicitante_Id: todos.solicitante_Id,
              tipo_Asunto: todos.tipo_Asunto,
              tipo_Pase: todos.tipo_Pase,
              area: todos.area,
              area_Id: todos.area_Id,
              estatus: todos.estatus,
              folio: todos.folio,
              asunto: todos.asunto,
              fechaSolicitud:
                fechaFinal[2] + "-" + fechaFinal[1] + "-" + fechaFinal[0],
              responsable_Area: todos.responsable_Area,
              responsable_Area_Id: todos.responsable_Area_Id,
              capturista: todos.capturista,
            };
          });
          let listFiltro = listHistorialTodos.filter(
            (x) =>
              x.area_Id != parseInt(localStorage.getItem("area")) &&
              x.estatus != "Pendiente" &&
              x.responsable_Area_Id ==
                parseInt(localStorage.getItem("empleado"))
          );
          listHistorial = listHistorialArea.concat(listFiltro);
        } else {
          listHistorial = listHistorialArea;
        }
        this.historial = listHistorial.filter((x) => x.estatus != "Pendiente");
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async aceptarSolicitud(id) {
      try {
        let resp = await api.get(`/PasesSalida/Aprobar/${id}`);
        let { success, data } = resp.data;
        if (success === true) {
          return { success, data };
        } else {
          return { success, data };
        }
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async rechazarSolicitud(id) {
      try {
        let resp = await api.get(`/PasesSalida/Rechazar/${id}`);
        let { success, data } = resp.data;
        if (success === true) {
          return { success, data };
        } else {
          return { success, data };
        }
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },
    async crearPase(id) {
      try {
        let resp = await api.get(`/PasesSalida/${id}`);
        let { success, data } = resp.data;
        let img = new Image();
        img.src = require("../assets/IEEN300.png");
        if (success == true) {
          const doc = new jsPDF();
          doc.addImage(img, "png", 10, 8, 35, 20);
          doc.addImage(img, "png", 10, 142, 35, 20);
          //-----------------------------------------------------------------------------------
          doc.setFontSize(9);
          doc.text("POR HORARIO:", 53, 35, null, null, "right");
          doc.setLineWidth(0.1);
          doc.line(56, 36, 140, 36);
          doc.text(data.tipo_Pase, 56, 35, null, null);

          doc.setFontSize(9);
          doc.text("POR HORARIO:", 53, 169, null, null, "right");
          doc.setLineWidth(0.1);
          doc.line(56, 170, 140, 170);
          doc.text(data.tipo_Pase, 56, 169, null, null);

          //-----------------------------------------------------------------------------------
          doc.text("TIPO DE ASUNTO:", 170, 35, null, null, "right");
          doc.setLineWidth(0.1);
          doc.line(171, 36, 185, 36);
          doc.text(data.tipo_Asunto, 178, 35, null, null, "center");

          doc.text("TIPO DE ASUNTO:", 170, 169, null, null, "right");
          doc.setLineWidth(0.1);
          doc.line(171, 170, 185, 170);
          doc.text(data.tipo_Asunto, 178, 169, null, null, "center");

          //------------------------------------------------------------------------------------------
          if (data.tipo_Pase == "Entrada") {
            doc.text(
              "FECHA Y HORA\n" + "DE ENTRADA:",
              53,
              41,
              null,
              null,
              "right"
            );
            doc.setLineWidth(0.1);
            doc.line(56, 46, 185, 46);
            doc.text(data.entrada, 56, 45, null, null);

            doc.text(
              "FECHA Y HORA\n" + "DE ENTRADA:",
              53,
              175,
              null,
              null,
              "right"
            );
            doc.setLineWidth(0.1);
            doc.line(56, 180, 185, 180);
            doc.text(data.entrada, 56, 179, null, null);
            //------------------------------------------------------------------------------------------------
          } else if (data.tipo_Pase == "Salida") {
            doc.text(
              "FECHA Y HORA\n" + "DE SALIDA:",
              53,
              41,
              null,
              null,
              "right"
            );
            doc.setLineWidth(0.1);
            doc.line(56, 46, 185, 46);
            doc.text(data.salida, 56, 45, null, null);

            doc.text(
              "FECHA Y HORA\n" + "DE SALIDA:",
              53,
              175,
              null,
              null,
              "right"
            );
            doc.setLineWidth(0.1);
            doc.line(56, 180, 185, 180);
            doc.text(data.salida, 56, 179, null, null);
          }
          //-----------------------------------------------------------------------------------------------------
          else if (data.tipo_Pase == "Intermedio") {
            doc.text(
              "FECHA Y HORA\n" + "DE SALIDA:",
              53,
              41,
              null,
              null,
              "right"
            );
            doc.setLineWidth(0.1);
            doc.line(56, 46, 140, 46);
            doc.text(data.salida, 56, 45, null, null);
            doc.text(
              "HORA ESTIMADA \n" + "DE LLEGADA:",
              170,
              41,
              null,
              null,
              "right"
            );
            let llega = moment(data.llegada).format("HH:mm");
            doc.setLineWidth(0.1);
            doc.line(171, 46, 185, 46);
            doc.text(llega, 178, 45, null, null, "center");

            doc.text(
              "FECHA Y HORA\n" + "DE SALIDA:",
              53,
              175,
              null,
              null,
              "right"
            );
            doc.setLineWidth(0.1);
            doc.line(56, 180, 140, 180);
            doc.text(data.salida, 56, 179, null, null);
            doc.text(
              "HORA ESTIMADA \n" + "DE LLEGADA:",
              170,
              175,
              null,
              null,
              "right"
            );
            doc.setLineWidth(0.1);
            doc.line(171, 180, 185, 180);
            doc.text(llega, 178, 179, null, null, "center");
          }
          //-----------------------------------------------------------------------------------------------------------------

          doc.text("NOMBRE:", 53, 51, null, null, "right");
          doc.setLineWidth(0.1);
          doc.line(56, 52, 185, 52);
          doc.text(data.solicitante, 56, 51, null, null);

          doc.text("NOMBRE:", 53, 185, null, null, "right");
          doc.setLineWidth(0.1);
          doc.line(56, 186, 185, 186);
          doc.text(data.solicitante, 56, 185, null, null);
          //----------------------------------------------------------------------------------------------------------------

          doc.text("PUESTO / CARGO:", 53, 57, null, null, "right");
          doc.setLineWidth(0.1);
          doc.line(56, 58, 185, 58);
          doc.text(data.puesto_Solicitante, 56, 57, null, null);

          doc.text("PUESTO / CARGO:", 53, 191, null, null, "right");
          doc.setLineWidth(0.1);
          doc.line(56, 192, 185, 192);
          doc.text(data.puesto_Solicitante, 56, 191, null, null);

          //----------------------------------------------------------------------------------------------------------------
          doc.text("DIRECCIÓN / ÁREA:", 53, 63, null, null, "right");
          doc.setLineWidth(0.1);
          doc.line(56, 64, 185, 64);
          doc.text(data.area, 56, 63, null, null);

          doc.text("DIRECCIÓN / ÁREA:", 53, 197, null, null, "right");
          doc.setLineWidth(0.1);
          doc.line(56, 198, 185, 198);
          doc.text(data.area, 56, 197, null, null);

          //----------------------------------------------------------------------------------------------------------------
          if (data.tipo_Pase == "Intermedio" && data.vehiculo_Id != null) {
            doc.setLineWidth(0.1);
            doc.line(56, 70, 185, 70);
            doc.text("VEHÍCULO:", 53, 69, null, null, "right");
            if (data.rol == "Chofer") {
              doc.text(data.vehiculo, 56, 69, null, null);
            } else {
              doc.text("Vehículo Oficial", 56, 69, null, null);
            }
            doc.text("ASUNTO:", 53, 75, null, null, "right");
            //doc.rect(56, 72, 129, 25);
            let texto = data.asunto;
            var lines = doc.splitTextToSize(texto, 128); // 80 is the maximum width of line (you can change it according to your needs)
            var y = 75;
            for (var i = 0; i < lines.length; i++) {
              doc.text(57, y, lines[i], {
                align: "justify",
              });
              y = y + 4; // Change this value to increase or decrease the vertical space between lines
            }
            doc.rect(56, 72, 129, y - 71);

            doc.setLineWidth(0.1);
            doc.line(56, 204, 185, 204);
            doc.text("VEHÍCULO:", 53, 203, null, null, "right");
            if (data.rol == "Chofer") {
              doc.text(data.vehiculo, 56, 203, null, null);
            } else {
              doc.text("Vehículo Oficial", 56, 203, null, null);
            }
            doc.text("ASUNTO:", 53, 209, null, null, "right");
            //doc.rect(56, 72, 129, 25);
            var lines = doc.splitTextToSize(texto, 128); // 80 is the maximum width of line (you can change it according to your needs)
            var y = 209;
            for (var i = 0; i < lines.length; i++) {
              doc.text(57, y, lines[i], {
                align: "justify",
              });
              y = y + 4; // Change this value to increase or decrease the vertical space between lines
            }
            doc.rect(56, 206, 129, y - 205);
          }
          //----------------------------------------------------------------------------------------------------------------------------------------------
          else if (data.tipo_Pase == "Intermedio" && data.vehiculo_Id == null) {
            doc.setLineWidth(0.1);
            doc.line(56, 70, 185, 70);
            doc.text("VEHÍCULO:", 53, 69, null, null, "right");
            if (data.rol == "Pasajero") {
              doc.text("Vehículo Oficial", 56, 69, null, null);
            } else {
              doc.text("Sin vehículo requerido", 56, 69, null, null);
            }

            doc.text("ASUNTO:", 53, 75, null, null, "right");
            let texto = data.asunto;
            var lines = doc.splitTextToSize(texto, 130); // 80 is the maximum width of line (you can change it according to your needs)
            var y = 75;
            for (var i = 0; i < lines.length; i++) {
              doc.text(57, y, lines[i], {
                align: "justify",
              });
              y = y + 4; // Change this value to increase or decrease the vertical space between lines
            }
            doc.rect(56, 72, 129, y - 71);

            doc.setLineWidth(0.1);
            doc.line(56, 204, 185, 204);
            doc.text("VEHÍCULO:", 53, 203, null, null, "right");
            if (data.rol == "Pasajero") {
              doc.text("Vehículo Oficial", 56, 203, null, null);
            } else {
              doc.text("Sin vehículo requerido", 56, 203, null, null);
            }
            doc.text("ASUNTO:", 53, 209, null, null, "right");
            var lines = doc.splitTextToSize(texto, 130); // 80 is the maximum width of line (you can change it according to your needs)
            var y = 209;
            for (var i = 0; i < lines.length; i++) {
              doc.text(57, y, lines[i], {
                align: "justify",
              });
              y = y + 4; // Change this value to increase or decrease the vertical space between lines
            }
            doc.rect(56, 206, 129, y - 205);
          }
          //--------------------------------------------------------------------------------------------------------------------------------------------
          else {
            doc.text("ASUNTO:", 53, 69, null, null, "right");
            let texto = data.asunto;
            var lines = doc.splitTextToSize(texto, 130); // 80 is the maximum width of line (you can change it according to your needs)
            var y = 69;
            for (var i = 0; i < lines.length; i++) {
              doc.text(57, y, lines[i], {
                align: "justify",
              });
              y = y + 4; // Change this value to increase or decrease the vertical space between lines
            }
            doc.rect(56, 66, 129, y - 65);

            doc.text("ASUNTO:", 53, 203, null, null, "right");
            var lines = doc.splitTextToSize(texto, 130); // 80 is the maximum width of line (you can change it according to your needs)
            var y = 203;
            for (var i = 0; i < lines.length; i++) {
              doc.text(57, y, lines[i], {
                align: "justify",
              });
              y = y + 4; // Change this value to increase or decrease the vertical space between lines
            }
            doc.rect(56, 200, 129, y - 199);
          }
          //--------------------------------------------------------------------------------------------------------------------------
          doc.setLineWidth(0.1);
          doc.line(25, 121, 85, 121);
          doc.text(data.solicitante, 55, 125, null, null, "center");
          doc.text(
            "NOMBRE Y FIRMA \n" + "SOLICITANTE",
            55,
            130,
            null,
            null,
            "center"
          );

          doc.setLineWidth(0.1);
          doc.line(25, 255, 85, 255);
          doc.text(data.solicitante, 55, 259, null, null, "center");
          doc.text(
            "NOMBRE Y FIRMA \n" + "SOLICITANTE",
            55,
            264,
            null,
            null,
            "center"
          );

          //-------------------------------------------------------------------------------------------------------------------------------
          doc.setLineWidth(0.1);
          doc.line(120, 121, 180, 121);
          doc.text(
            "Aprobó: " + data.fecha_Aprobacion_Rechazo,
            150,
            120,
            null,
            null,
            "center"
          );
          let responsable = "N/A";
          if (data.responsable_Area != null) {
            responsable = data.responsable_Area;
          }
          doc.text(responsable, 150, 125, null, null, "center");
          doc.text(
            "NOMBRE Y FIRMA \n" + "AUTORIZA",
            150,
            130,
            null,
            null,
            "center"
          );

          doc.setLineWidth(0.1);
          doc.line(120, 255, 180, 255);
          doc.text(
            "Aprobó: " + data.fecha_Aprobacion_Rechazo,
            150,
            254,
            null,
            null,
            "center"
          );

          doc.text(responsable, 150, 259, null, null, "center");
          doc.text(
            "NOMBRE Y FIRMA \n" + "AUTORIZA",
            150,
            264,
            null,
            null,
            "center"
          );

          //--------------------------------------------------------------------------------------------------------------------------------------
          doc.text("FOLIO: " + data.folio, 185, 29, null, null, "right");
          doc.text("FOLIO: " + data.folio, 185, 163, null, null, "right");
          doc.setFont("times", "normal");
          doc.setFontSize(12);
          doc.text(
            "INSTITUTO ESTATAL ELECTORAL DE NAYARIT \n" + data.area,
            105,
            20,
            null,
            null,
            "center"
          );

          doc.setFont("times", "normal");
          doc.setFontSize(12);
          doc.text(
            "INSTITUTO ESTATAL ELECTORAL DE NAYARIT \n" + data.area,
            105,
            154,
            null,
            null,
            "center"
          );
          doc.setLineDash([2.5]);
          doc.line(5, 140, 205, 140);
          doc.setTextColor(150);
          doc.text(
            "Copia para la Dirección de Administración",
            10,
            113,
            null,
            90
          );
          doc.text("Copia del solicitante", 10, 240, null, 90);
          doc.save(data.folio + ".pdf");
          return {
            success,
            msj: "Pase generado con éxito",
          };
        } else {
          return {
            success,
            msj: "Error al generar el pase",
          };
        }
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },
  },
});
