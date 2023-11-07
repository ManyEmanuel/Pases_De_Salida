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
      aprobar: {
        encabezado_Detalle_Justificantes_Id: 0,
      },
    }),
    actions: {
      //-----------------------------------------------------------------------

      async loadSolicitudesJustificantes() {
        try {
          let resp = await api.get("/Justificantes/Pendientes");
          let { data } = resp.data;
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
              area:
                justificante.area.length >= 30
                  ? justificante.area.slice(0, 30) + "..."
                  : justificante.area,
              area_Completa: justificante.area,
              area_Id: justificante.area_Id,
            };
          });
          this.solicitudes = listPendientesArea.filter(
            (x) =>
              x.solicitante_Id != parseInt(localStorage.getItem("empleado"))
          );
        } catch (error) {
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
              area:
                justificante.area.length >= 30
                  ? justificante.area.slice(0, 30) + "..."
                  : justificante.area,
              area_Completa: justificante.area,
              area_Id: justificante.area_Id,
            };
          });
          this.historial = listHistorialArea.filter(
            (x) => x.estatus != "Pendiente"
          );
        } catch (error) {
          return {
            success: false,
            data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
          };
        }
      },

      //-----------------------------------------------------------------------

      async aprobarJustificante(id) {
        try {
          const resp = await api.post(
            `/Justificantes/Aprobar/${id}`,
            this.aprobar
          );
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
