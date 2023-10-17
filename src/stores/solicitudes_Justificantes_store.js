import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useSolicitudJustificanteStore = defineStore(
  "solicitudJustifcante",
  {
    state: () => ({
      solicitudes: [],
      historial: [],
      solicitudJustificante: {
        id: null,
        responsable_Area_Id: null,
        responsable_Area: null,
        puesto_Responsable_Area_Id: null,
        solicitante: null,
        solicitante_Id: null,
        puesto_Solicitante_Id: null,
        puesto_Solicitante: null,
        capturista_Id: null,
        capturista: null,
        puesto_Capturista: null,
        puesto_Capturista_Id: null,
        area_Id: null,
        area: null,
        estatus: null,
        folio: null,
        fecha_Aprobacion_Rechazo: null,
        fecha_Creacion: null,
        responsable_Administracion: null,
      },
    }),
    actions: {
      //-----------------------------------------------------------------------

      async loadSolicitudesJustificantes() {
        try {
          let resp = await api.get("/Justificantes/Pendientes");
          let { data } = resp.data;
          let listPendientes = null;
          let listPendientesArea = data.map((justificante) => {
            return {
              id: justificante.id,
              responsable_Area_Id: justificante.responsable_Area_Id,
              responsable_Area: justificante.responsable_Area,
              puesto_Responsable_Area_Id:
                justificante.puesto_Responsable_Area_Id,
              puesto_Responsable_Area: justificante.puesto_Responsable_Area,
              solicitante_Id: justificante.solicitante_Id,
              solicitante: justificante.solicitante,
              puesto_Solicitante_Id: justificante.puesto_Solicitante_Id,
              puesto_Solicitante: justificante.puesto_Solicitante,
              folio: justificante.folio,
              estatus: justificante.estatus,
              fecha_Creacion: justificante.fecha_Creacion,
              fecha_Aprobacion_Rechazo: justificante.fecha_Aprobacion_Rechazo,
              capturista: justificante.capturista,
              puesto_Capturista: justificante.puesto_Capturista,
              area: justificante.area,
              area_Id: justificante.area_Id,
            };
          });
          if (localStorage.getItem("tipoEmp").toString() == "JefeArea") {
            let respTodos = await api.get("/Justificantes/ObtenTodos");
            let listTodos = respTodos.data.data;
            let listPendientesTodos = listTodos.map((justificante) => {
              return {
                id: justificante.id,
                responsable_Area_Id: justificante.responsable_Area_Id,
                responsable_Area: justificante.responsable_Area,
                puesto_Responsable_Area_Id:
                  justificante.puesto_Responsable_Area_Id,
                puesto_Responsable_Area: justificante.puesto_Responsable_Area,
                solicitante_Id: justificante.solicitante_Id,
                solicitante: justificante.solicitante,
                puesto_Solicitante_Id: justificante.puesto_Solicitante_Id,
                puesto_Solicitante: justificante.puesto_Solicitante,
                folio: justificante.folio,
                estatus: justificante.estatus,
                fecha_Creacion: justificante.fecha_Creacion,
                fecha_Aprobacion_Rechazo: justificante.fecha_Aprobacion_Rechazo,
                capturista: justificante.capturista,
                puesto_Capturista: justificante.puesto_Capturista,
                area: justificante.area,
                area_Id: justificante.area_Id,
              };
            });
            console.log("Lista de pendientes", listPendientesTodos);
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
            (x) =>
              x.solicitante_Id != parseInt(localStorage.getItem("empleado"))
          );
        } catch (error) {
          console.error(error);
          return {
            success: false,
            data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
          };
        }
      },
      //-----------------------------------------------------------------------

      async loadHistorialJustificante() {
        try {
          let resp = await api.get("/Justificantes/ByArea");
          let { data } = resp.data;
          let listHistorial = null;
          let listHistorialArea = data.map((justificante) => {
            return {
              id: justificante.id,
              responsable_Area_Id: justificante.responsable_Area_Id,
              responsable_Area: justificante.responsable_Area,
              puesto_Responsable_Area_Id:
                justificante.puesto_Responsable_Area_Id,
              puesto_Responsable_Area: justificante.puesto_Responsable_Area,
              solicitante_Id: justificante.solicitante_Id,
              solicitante: justificante.solicitante,
              puesto_Solicitante_Id: justificante.puesto_Solicitante_Id,
              puesto_Solicitante: justificante.puesto_Solicitante,
              folio: justificante.folio,
              estatus: justificante.estatus,
              fecha_Creacion: justificante.fecha_Creacion,
              fecha_Aprobacion_Rechazo: justificante.fecha_Aprobacion_Rechazo,
              capturista: justificante.capturista,
              puesto_Capturista: justificante.puesto_Capturista,
              area: justificante.area,
              area_Id: justificante.area_Id,
            };
          });
          if (localStorage.getItem("tipoEmp").toString() == "JefeArea") {
            let respTodos = await api.get("/Justificantes/ObtenTodos");
            let listTodos = respTodos.data.data;
            let listHistorialTodos = listTodos.map((todos) => {
              return {
                id: justificante.id,
                responsable_Area_Id: justificante.responsable_Area_Id,
                responsable_Area: justificante.responsable_Area,
                puesto_Responsable_Area_Id:
                  justificante.puesto_Responsable_Area_Id,
                puesto_Responsable_Area: justificante.puesto_Responsable_Area,
                solicitante_Id: justificante.solicitante_Id,
                solicitante: justificante.solicitante,
                puesto_Solicitante_Id: justificante.puesto_Solicitante_Id,
                puesto_Solicitante: justificante.puesto_Solicitante,
                folio: justificante.folio,
                estatus: justificante.estatus,
                fecha_Creacion: justificante.fecha_Creacion,
                fecha_Aprobacion_Rechazo: justificante.fecha_Aprobacion_Rechazo,
                capturista: justificante.capturista,
                puesto_Capturista: justificante.puesto_Capturista,
                area: justificante.area,
                area_Id: justificante.area_Id,
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
          this.historial = listHistorial.filter(
            (x) => x.estatus != "Pendiente"
          );
        } catch (error) {
          console.error(error);
          return {
            success: false,
            data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
          };
        }
      },

      //-----------------------------------------------------------------------

      async aprobarJustificante(id) {
        try {
          const resp = await api.get(`/Justificantes/Aprobar/${id}`);
          if (resp.status == 200) {
            const { success, data } = resp.data;
            if (success === true) {
              return { success, data };
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

      //-----------------------------------------------------------------------

      async rechazarJustificante(id) {
        try {
          const resp = await api.get(`/Justificantes/Rechazar/${id}`);
          if (resp.status == 200) {
            const { success, data } = resp.data;
            if (success === true) {
              return { success, data };
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
    },
  }
);
