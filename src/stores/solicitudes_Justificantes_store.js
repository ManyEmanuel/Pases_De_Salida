import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { EncryptStorage } from "storage-encryption";

const encryptStorage = new EncryptStorage("SECRET_KEY", "sessionStorage");
export const useSolicitudJustificanteStore = defineStore(
  "solicitudJustifcante",
  {
    state: () => ({
      modal: false,
      cargar: false,
      solicitudesArea: [],
      solicitudesArea_Filtrado: [],
      historial: [],
      historial_Filtrado: [],
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
      list_Justificantes_Todos: [],
      list_Justificantes_Todos_Filtrado: [],
      documentoExcel: null,
    }),
    actions: {
      actualizarModal(valor) {
        this.modal = valor;
      },

      actualizarCargar(valor) {
        this.cargar = valor;
      },

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
              detalles: justificante.detalles,
            };
          });
          this.solicitudesArea = listPendientesArea.filter(
            (x) =>
              x.solicitante_Id != parseInt(encryptStorage.decrypt("empleado"))
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
              detalles: justificante.detalles,
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

      //-----------------------------------------------------------------------
      async downloadExcel() {
        try {
          this.documentoExcel = "";
          const resp = await api.get(
            "/Justificantes/Excel_Reporte_Justificantes",
            {
              responseType: "blob",
            }
          );
          if (resp.status == 200) {
            let blob = new window.Blob([resp.data], {
              type: "application/xlsx",
            });
            this.documentoExcel = window.URL.createObjectURL(blob);
            return { success: true };
          } else {
            return {
              success: false,
              data: "Error al descargar archivo, intentelo de nuevo",
            };
          }
        } catch (error) {
          return {
            success: false,
            data: "Ocurrio un error, intentelo de nuevo. Si el error persiste contacte a soporte",
          };
        }
      },

      //-----------------------------------------------------------------------

      async loadJustificantesTodos() {
        try {
          let resp = await api.get("/Justificantes/ObtenTodos");
          let { data } = resp.data;
          let list = data.map((justificante) => {
            return {
              id: justificante.id,
              responsable_Area_Id: justificante.responsable_Area_Id,
              responsable_Area: justificante.responsable_Area,
              solicitante_Id: justificante.solicitante_Id,
              solicitante: justificante.solicitante,
              puesto_Solicitante_Id: justificante.puesto_Solicitante_Id,
              puesto_Solicitante: justificante.puesto_Solicitante,
              capturista_Id: justificante.capturista_Id,
              capturista: justificante.capturista,
              puesto_Capturista_Id: justificante.puesto_Capturista_Id,
              puesto_Capturista: justificante.puesto_Capturista,
              area_Id: justificante.area_Id,
              estatus: justificante.estatus,
              folio: justificante.folio,
              fecha_Creacion: justificante.fecha_Creacion,
              fecha_Aprobacion_Rechazo: justificante.fecha_Aprobacion_Rechazo,
              area:
                justificante.area.length >= 30
                  ? justificante.area.slice(0, 30) + "..."
                  : justificante.area,
              area_Completa: justificante.area,
            };
          });
          this.list_Justificantes_Todos = list.sort(
            (a, b) => b.id - a.id
          );
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
