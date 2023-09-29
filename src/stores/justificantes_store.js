import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useJustificanteStore = defineStore("justificante", {
  state: () => ({
    modal: false,
    isEditar: false,
    listaConceptos: [],
    listEmpleados: [],
    areas: [],
    listaIncidencias: [],
    justificantes: [],
    justificante: {
      id: null,
      responsable_Area_Id: null,
      responsable_Area: null,
      puesto_Responsable_Area_Id: null,
      puesto_Solicitante_Id: null,
      puesto_Solicitante: null,
      solicitante_Id: null,
      solicitante: null,
      area_Id: null,
      area: null,
      capturista_Id: null,
      capturista: null,
      puesto_Capturista_Id: null,
      puesto_Capturista: null,
      estatus: null,
      folio: null,
      fecha_Creacion: null,
      fecha_Aprobacion_Rechazo: null,
    },
  }),
  actions: {
    actualizarModal(valor) {
      this.modal = valor;
    },

    //-----------------------------------------------------------
    async loadJustificantes() {
      try {
        const resp = await api.get("/Justificantes_/ObtenTodos");
        let { data } = resp.data;
        let listJustificantes = data.map((justificante) => {
          return {
            justificante_Id: justificante.id,
            responsable_Area_Id: justificante.responsable_Area_Id,
            responsable_Area: justificante.responsable_Area,
            puesto_Responsable_Area_Id: justificante.puesto_Responsable_Area_Id,
            puesto_Responsable_Area: justificante.puesto_Responsable_Area,
            solicitante_Id: justificante.solicitante_Id,
            solicitante: justificante.solicitante,
            puesto_Solicitante_Id: justificante.puesto_Solicitante_Id,
            puesto_Solicitante: justificante.puesto_Solicitante,
            folio: justificante.folio,
            estatus: justificante.estatus,
            fecha_Creacion: justificante.fecha_Creacion,
            capturista: justificante.capturista,
            puesto_Capturista: justificante.puesto_Capturista,
          };
        });
        this.justificantes = listJustificantes;
        console.log("this", this.justificantes);
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------

    async createJustificante(justificante) {
      try {
        console.log("justificante", justificante);
        const resp = await api.post("/Justificantes_", justificante);
        if (resp.status == 200) {
          const { success, data, idJustificante } = resp.data;
          if (success === true) {
            return { success, data, idJustificante };
          } else {
            return { success, data, idJustificante };
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

    //-----------------------------------------------------------

    async createDetalleJustificantes(id, detalle) {
      try {
        console.log("id", id);
        console.log("detalle", detalle);
        const resp = await api.post(`/Detalle_Justificates_/${id}`, detalle);
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

    //-----------------------------------------------------------

    async loadInformacionJustificante() {
      try {
        let perfil = parseInt(localStorage.getItem("perfil"));
        let area = parseInt(localStorage.getItem("area"));
        let resp = await api.get("/ResponsablesAreas/ResposableByUsuario");
        let dataResp = resp.data.data;
        console.log("----", dataResp);
        if (perfil == 1) {
          let respArea = await api.get("/Areas/GetLista");
          let { data } = respArea.data;
          this.areas = data.map((areas) => {
            return {
              value: areas.value,
              label: areas.label,
            };
          });
        } else if (perfil == 2) {
          let respArea = await api.get("/Areas/AreaByUsuario");
          let { data } = respArea.data;

          let listAreas = [{ value: data.area_Id, label: data.area }];

          let respPer = await api.get(`/Empleados/ByArea/${area}`);
          let data2 = respPer.data.data;
          let listPersonal = data2.map((personal) => {
            return {
              value: personal.id,
              label:
                personal.nombres +
                " " +
                personal.apellido_Paterno +
                " " +
                personal.apellido_Materno,
            };
          });
          this.areas = listAreas;
          this.justificante.area_Id = data.area_Id;
          this.justificante.area = data.area;
          this.listEmpleados = listPersonal;
          this.justificante.responsable_Area_Id = dataResp.empleado_Id;
          this.justificante.responsable_Area = dataResp.empleado;
          this.justificante.puesto_Responsable_Area_Id = dataResp.puesto_Id;
        } else if (perfil == 3) {
          let respArea = await api.get("/Areas/AreaByUsuario");
          let { data } = respArea.data;
          let listAreas = [{ value: data.area_Id, label: data.area }];

          let respPer = await api.get("/Empleados/ByUsuario");
          let data2 = respPer.data.data;
          let listPersonal = [
            {
              value: data2.id,
              label:
                data2.nombres +
                " " +
                data2.apellido_Paterno +
                " " +
                data2.apellido_Materno,
            },
          ];
          this.justificante.area_Id = data.area_Id;
          this.justificante.area = data.area;
          this.justificante.solicitante_Id = data2.id;
          this.justificante.puesto_Responsable_Area_Id = dataResp.puesto_Id;
          this.areas = listAreas;
          this.listEmpleados = listPersonal;
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------

    async loadPersonalArea(id) {
      try {
        this.empleados = null;
        let resp = await api.get(`/Empleados/ByArea/${id}`);
        let { data } = resp.data;
        this.listEmpleados = data.map((personal) => {
          return {
            value: personal.id,
            label:
              personal.nombres +
              " " +
              personal.apellido_Paterno +
              " " +
              personal.apellido_Materno,
          };
        });
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------

    async loadEmpleadosByUsuario() {
      try {
        const resp = await api.get("/Empleados/ByUsuario");
        let { success, data } = resp.data;
        if (success) {
          this.justificante.empleado_Id = data.id;
          this.justificante.empleado = `${data.nombres}  ${data.apellido_Paterno} ${data.apellido_Materno}`;
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------

    async loadResponsabeArea(id) {
      const resp = await api.get(`/Empleados/GetResponsableByEmpleado/${id}`);
      let { success, data } = resp.data;
      if (success) {
        this.justificante.responsable_Area_Id = data.id;
        this.justificante.responsable_Area = data.nombre_Completo;
      }
    },

    //-----------------------------------------------------------

    async addIncidencia(dias_Incidencias, motivo, tipo_Justificantes) {
      let day = null;

      try {
        this.listaIncidencias.push({
          tipo_Justificantes: tipo_Justificantes,
          dias_Incidencias: dias_Incidencias,
          motivo: motivo,
        });
        console.log("listaIncidencias", this.listaIncidencias);
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },
  },
});
