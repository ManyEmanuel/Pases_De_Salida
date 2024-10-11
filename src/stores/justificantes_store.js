import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { EncryptStorage } from "storage-encryption";

const encryptStorage = new EncryptStorage("SECRET_KEY", "sessionStorage");
export const useJustificanteStore = defineStore("justificante", {
  state: () => ({
    modal: false,
    isEditar: false,
    isVisualizar: false,
    isPersonal: false,
    isAdmi: false,
    isSuperAdmi: false,
    jefeArea: false,
    administracion: false,
    listaConceptos: [],
    listEmpleados: [],
    areas: [],
    listaIncidencias: [],
    justificantes: [],
    listReporte: [],
    listFiltroReporte: [],
    detalle: {
      id: null,
      dias_Incidencias: null,
      dias_Indicencias_Completos: null,
      tipo_Justificantes: null,
      motivo: null,
      periodo_Vacacional: null,
      primer_Periodo: null,
      segundo_Periodo: null,
      dias_Economicos: null,
      year: null,
    },
    justificante: {
      id: null,
      responsable_Area_Id: null,
      responsable_Area: null,
      puesto_Responsable_Area_Id: null,
      puesto_Responsable_Area: null,
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
      recursos_Humanos_Id: null,
      recursos_Humanos: null,
      puesto_Recursos_Humanos_Id: null,
      puesto_Recursos_Humanos: null,
      puesto_Responsable_Administracion_Id: null,
      puesto_Responsable_Administracion: null,
      responsable_Admistracion_Id: null,
      responsable_Administracion: null,
    },
    myLocale: {
      days: "Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado".split("_"),
      daysShort: "Dom_Lun_Mar_Mié_Jue_Vie_Sáb".split("_"),
      months:
        "Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre".split(
          "_"
        ),
      monthsShort: "Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic".split("_"),
      firstDayOfWeek: 1,
      format24h: true,
      pluralDay: "dias",
    },
    dias_restantes: {
      primer_Periodo: null,
      segundo_Periodo: null,
      dias_Economicos: null,
    },
    configuracion: [],
  }),
  actions: {
    actualizarModal(valor) {
      this.modal = valor;
    },

    updateEditar(valor) {
      this.isEditar = valor;
    },

    updateVisualizar(valor) {
      this.isVisualizar = valor;
    },

    initJustificante() {
      this.justificante.id = null;
      this.justificante.solicitante = null;
      this.justificante.solicitante_Id = null;
      this.justificante.folio = null;
      //this.justificante.responsable_Area = null;
      this.justificante.area = null;
      this.justificante.area_Id = null;
      this.justificante.capturista = null;
      this.justificante.capturista_Id = null;
      this.justificante.estatus = null;
      this.justificante.folio = null;
      this.justificante.fecha_Aprobacion_Rechazo = null;
      this.justificante.fecha_Creacion = null;
      this.justificante.puesto_Solicitante_Id = null;
      this.justificante.puesto_Solicitante = null;
      this.listaIncidencias = [];
    },

    //-----------------------------------------------------------
    async isAdministracion() {
      let area = parseInt(encryptStorage.decrypt("area"));
      let perfil = parseInt(encryptStorage.decrypt("perfil"));
      if (area == 6 || perfil == 1) {
        this.administracion = true;
      } else {
        this.administracion = false;
      }
    },

    //-----------------------------------------------------------
    async loadJustificantes() {
      try {
        let tipoEmp = encryptStorage.decrypt("tipoEmp").toString();
        tipoEmp == "JefeArea"
          ? (this.jefeArea = true)
          : (this.jefeArea = false);
        let perfil = parseInt(encryptStorage.decrypt("perfil"));
        let resp = null;
        let listJustificantes = null;
        if (perfil == 1) {
          resp = await api.get("/Justificantes/ObtenTodos");
          let { data } = resp.data;

          listJustificantes = data.map((justificante) => {
            return {
              justificante_Id: justificante.id,
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
          this.isSuperAdmi = true;
        } else if (perfil == 2) {
          resp = await api.get("/Justificantes/ByArea");
          let { data } = resp.data;
          listJustificantes = data.map((justificante) => {
            return {
              justificante_Id: justificante.id,
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
          this.isAdmi = true;
        } else if (perfil == 3) {
          resp = await api.get("/Justificantes/MisJustificantes");
          let { data } = resp.data;

          listJustificantes = data.map((justificante) => {
            return {
              justificante_Id: justificante.id,
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
          this.isPersonal = true;
        }
        this.justificantes = listJustificantes.sort(
          (a, b) => b.justificante_Id - a.justificante_Id
        );
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
        const resp = await api.post("/Justificantes", justificante);
        if (resp.status == 200) {
          const { success, data, id } = resp.data;
          if (success === true) {
            return { success, data, id };
          } else {
            return { success, data, id };
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
    async updateJustificante(justificante) {
      try {
        const resp = await api.put(
          `/Justificantes/${justificante.id}`,
          justificante
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

    //-----------------------------------------------------------
    async loadJustificante(id) {
      try {
        let resp = null;
        resp = await api.get(`/Justificantes/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
            this.justificante.id = data.id;
            this.justificante.responsable_Area_Id = data.responsable_Area_Id;
            this.justificante.responsable_Area = data.responsable_Area;
            this.justificante.puesto_Responsable_Area_Id =
              data.puesto_Responsable_Area_Id;
            this.justificante.puesto_Responsable_Area =
              data.puesto_Responsable_Area;
            this.justificante.puesto_Solicitante = data.puesto_Solicitante;
            this.justificante.solicitante = data.solicitante;
            this.justificante.solicitante_Id = data.solicitante_Id;
            this.justificante.capturista_Id = data.capturista_Id;
            this.justificante.capturista = data.capturista;
            this.justificante.puesto_Capturista = data.puesto_Capturista;
            this.justificante.puesto_Capturista_Id = data.puesto_Capturista_Id;
            this.justificante.area_Id = data.area_Id;
            this.justificante.area = data.area;
            this.justificante.estatus = data.estatus;
            this.justificante.folio = data.folio;
            this.justificante.fecha_Aprobacion_Rechazo =
              data.fecha_Aprobacion_Rechazo;
            this.justificante.fecha_Creacion = data.fecha_Creacion;
            this.justificante.recursos_Humanos_Id = data.recursos_Humanos_Id;
            this.justificante.recursos_Humanos = data.recursos_Humanos;
            this.justificante.puesto_Recursos_Humanos_Id =
              data.puesto_Recursos_Humanos_Id;
            this.justificante.puesto_Recursos_Humanos =
              data.puesto_Recursos_Humanos;
            this.justificante.puesto_Responsable_Administracion_Id =
              data.puesto_Responsable_Administracion_Id;
            this.justificante.puesto_Responsable_Administracion =
              data.puesto_Responsable_Administracion;
            this.justificante.responsable_Admistracion_Id =
              data.responsable_Admistracion_Id;
            this.justificante.responsable_Administracion =
              data.responsable_Administracion;
            return { success, data };
          }
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
        let perfil = parseInt(encryptStorage.decrypt("perfil"));
        let area = parseInt(encryptStorage.decrypt("area"));
        let resp = await api.get("/ResponsablesAreas/ResposableByUsuario");
        let dataResp = resp.data.data;
        if (perfil == 1) {
          let respArea = await api.get("/Areas/GetLista");
          let { data } = respArea.data;
          this.areas = data.map((areas) => {
            return {
              value: areas.value,
              label: areas.label,
            };
          });
          this.isSuperAdmi = true;
          this.isAdmi = false;
          this.personal = false;
        } else if (perfil == 2) {
          let respArea = await api.get("/Areas/AreaByUsuario");
          let { data } = respArea.data;
          let listAreas = [{ value: data.area_Id, label: data.area }];

          this.isSuperAdmi = false;
          this.isAdmi = true;
          this.personal = false;
          this.areas = listAreas;
          this.justificante.area_Id = data.area_Id;
          this.justificante.area = data.area;
          this.justificante.responsable_Area_Id = dataResp.empleado_Id;
          this.justificante.responsable_Area = dataResp.empleado;
          this.justificante.puesto_Responsable_Area_Id = dataResp.puesto_Id;
        } else if (perfil == 3) {
          this.listEmpleados = [];
          let respArea = await api.get("/Areas/AreaByUsuario");
          let { data } = respArea.data;
          let listAreas = [{ value: data.area_Id, label: data.area }];
          let respPer = await api.get("/Empleados/ByUsuario");
          let data2 = respPer.data.data;
          let listPersonal = [
            {
              value: data2.id,
              label: `${data2.nombres} ${data2.apellido_Paterno} ${data2.apellido_Materno}`,
            },
          ];
          this.justificante.area_Id = data.area_Id;
          this.justificante.area = data.area;
          this.justificante.solicitante_Id = data2.id;
          this.justificante.puesto_Responsable_Area_Id = dataResp.puesto_Id;
          this.areas = listAreas;
          this.justificante.solicitante = `${data2.nombres} ${data2.apellido_Paterno} ${data2.apellido_Materno}`;
          this.listEmpleados = listPersonal;
          this.justificante.puesto_Solicitante_Id = data2.puesto_Id;
          this.isPersonal = true;
          this.isSuperAdmi = false;
          this.isAdmi = false;
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async cancelarJustificante(id) {
      try {
        const resp = await api.get(`/Justificantes/Cancelar/${id}`);
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

    //-----------------------------------------------------------
    async aprobarJustificante(id) {
      try {
        const resp = await api.post(`/Justificantes/Aprobar/${id}`, 0);
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
    async addIncidencia(
      dias_Incidencias,
      motivo,
      tipo_Justificantes,
      periodo_Vacacional,
      year
    ) {
      let incidenciaExistente = this.listaIncidencias.find(
        (incidencia) =>
          incidencia.tipo_Justificantes === "Vacaciones" &&
          incidencia.year == year &&
          incidencia.periodo_Vacacional == periodo_Vacacional
      );

      if (incidenciaExistente) {
        if (this.isEditar == true) {
          incidenciaExistente.dias_Incidencias += `, ${dias_Incidencias}`;
        } else {
          incidenciaExistente.dias_Incidencias = `${dias_Incidencias}`;
        }
        incidenciaExistente.motivo = motivo;
      } else {
        var ultimoId =
          this.listaIncidencias.length > 0
            ? this.listaIncidencias[this.listaIncidencias.length - 1].id
            : 0;
        var nuevoId = ultimoId + 1;

        try {
          this.listaIncidencias.push({
            id: nuevoId,
            tipo_Justificantes: tipo_Justificantes,
            dias_Incidencias: dias_Incidencias,
            motivo: motivo,
            periodo_Vacacional: periodo_Vacacional,
            primer_Periodo: 0,
            segundo_Periodo: 0,
            dias_Economicos: 0,
            year: year,
          });
        } catch (error) {
          return {
            success: false,
            data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
          };
        }
      }

      return {
        success: true,
        data: "Incidencia añadida o actualizada correctamente",
      };
    },

    //-----------------------------------------------------------
    async loadDetalleJustificantes(id) {
      try {
        let resp = await api.get(
          `/Detalle_Justificantes/ByJustificantes/${id}`
        );
        let { data } = resp.data;
        this.listaIncidencias = data.map((incidencia) => {
          return {
            id: incidencia.id,
            tipo_Justificantes: incidencia.tipo_Justificantes,
            dias_Incidencias: incidencia.dias_Incidencias,
            periodo_Vacacional: incidencia.periodo_Vacacional,
            primer_Periodo: incidencia.primer_Periodo,
            segundo_Periodo: incidencia.segundo_Periodo,
            dias_Economicos: incidencia.dias_Economicos,
            motivo: incidencia.motivo,
            motivo_Completo: incidencia.motivo,
            year: incidencia.year,
          };
        });
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async loadDetalle(id) {
      try {
        let resp = await api.get(`/Detalle_Justificantes/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
            this.detalle.id = data.id;
            this.detalle.dias_Incidencias = data.dias_Incidencias;
            this.detalle.dias_Indicencias_Completos = data.dias_Incidencias;
            this.detalle.tipo_Justificantes = data.tipo_Justificantes;
            this.detalle.motivo = data.motivo;
            this.detalle.periodo_Vacacional = data.periodo_Vacacional;
          }
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
        const resp = await api.post(`/Detalle_Justificantes/${id}`, detalle);
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
    async eliminarDetalleJusitifcante(id) {
      try {
        let nIndex = this.listaIncidencias.find((x) => x.id == id);
        if (nIndex.id <= 4) {
          let nIndex = this.listaIncidencias.findIndex((x) => x.id == id);
          this.listaIncidencias.splice(nIndex, 1);
          return { success: true, data: "Se elimino de la lista" };
        } else {
          const resp = await api.delete(`/Detalle_Justificantes/${id}`);
          if (resp.status == 200) {
            const { success, data } = resp.data;
            if (success === true) {
              let nIndex = this.listaIncidencias.findIndex((x) => x.id == id);
              this.listaIncidencias.splice(nIndex, 1);
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
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async updateDetalle(detalle) {
      try {
        const resp = await api.put(
          `/Detalle_Justificantes/${detalle.id}`,
          detalle
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

    //-----------------------------------------------------------
    async loadPersonalArea(id, especial) {
      try {
        let area = parseInt(encryptStorage.decrypt("area"));
        let idNuevo;
        id == undefined ? (idNuevo = area) : (idNuevo = id);

        this.empleados = null;
        let resp = await api.get(`/Empleados/ByArea/${idNuevo}`);
        let { data } = resp.data;
        let list = data.map((personal) => {
          return {
            value: personal.id,
            label: `${personal.nombres} ${personal.apellido_Paterno} ${personal.apellido_Materno}`,
            puesto_Id: personal.puesto_Id,
            area_Id: personal.area_Id,
          };
        });
        if (especial == true) {
          list.splice(0, 0, {
            value: 0,
            label: "Todos",
          });
        }
        this.listEmpleados = list;
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async loadCapturista() {
      try {
        const resp = await api.get("/Empleados/ByUsuario");
        let { success, data } = resp.data;
        if (success) {
          this.justificante.puesto_Capturista_Id = data.puesto_Id;
          this.justificante.puesto_Capturista = data.puesto;
          this.justificante.capturista_Id = data.id;
          this.justificante.capturista = `${data.nombres}  ${data.apellido_Paterno} ${data.apellido_Materno}`;
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async loadResponsabeAreaByEmpleado(id) {
      try {
        const resp = await api.get(`/Empleados/GetResponsableByEmpleado/${id}`);
        let { success, data } = resp.data;
        if (success) {
          this.justificante.responsable_Area_Id = data.id;
          this.justificante.responsable_Area = `${data.nombres} ${data.apellido_Paterno} ${data.apellido_Materno}`;
          this.justificante.puesto_Responsable_Area_Id = data.puesto_Id;
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async loadDiasRestantes(id, año) {
      try {
        this.dias_restantes.dias_Economicos = null;
        this.dias_restantes.primer_Periodo = null;
        this.dias_restantes.segundo_Periodo = null;
        const resp = await api.get(
          `/Justificantes/Dias_Restantes/${id}?A%C3%B1o=${año}`
        );
        let { success, data } = resp.data;
        if (success) {
          this.dias_restantes.dias_Economicos = data.dias_Economicos;
          this.dias_restantes.primer_Periodo =
            data.primer_Periodo == undefined
              ? data.dias_Primer_Periodo
              : data.primer_Periodo;
          this.dias_restantes.segundo_Periodo =
            data.segundo_Periodo == undefined
              ? data.dias_Segundo_Periodo
              : data.segundo_Periodo;
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async loadAsignacionesVacaciones(year) {
      try {
        const resp = await api.get("/Asignaciones_Vacaciones/ObtenTodos");
        let { data } = resp.data;
        let listconfiguracion = data.map((config) => {
          return {
            periodo_Vacacional: config.periodo_Vacacional,
            año: config.año,
            dias_Primer_Periodo: config.dias_Primer_Periodo,
            tipo_Primer_Periodo: config.tipo_Primer_Periodo,
            fechas_Primer_Periodo: config.fechas_Primer_Periodo,
            dias_Segundo_Periodo: config.dias_Segundo_Periodo,
            tipo_Segundo_Periodo: config.tipo_Segundo_Periodo,
            fechas_Segundo_Periodo: config.fechas_Segundo_Periodo,
            dias_Economicos: config.dias_Economicos,
            fecha_Creacion: config.fecha_Creacion,
          };
        });
        this.configuracion = listconfiguracion.filter((x) => x.año == year);
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------------------
    async loadListAreas() {
      try {
        let respArea = await api.get("/Areas/GetLista");
        let { data } = respArea.data;
        let listArea = data.map((areas) => {
          return {
            value: areas.value,
            label: areas.label,
          };
        });
        listArea.splice(0, 0, {
          value: 0,
          label: "Todos",
        });
        this.areas = listArea;
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------------------
    async reporteJustificantes(date) {
      try {
        const resp = await api.get(
          `/Justificantes/Justificantes_Solicitados_ByArea?Fecha_Inicio=${date.from}&Fecha_Fin=${date.to}`
        );
        let { data, success } = resp.data;

        let listReporte = data.map((reporte) => {
          return {
            id: reporte.id,
            empleado_Id: reporte.empleado_Id,
            empleado: reporte.empleado,
            vacaciones_P1: reporte.vacaciones_P1,
            vacaciones_P2: reporte.vacaciones_P2,
            permiso_Economico: reporte.permiso_Economico,
            omision_Entrada: reporte.omision_Entrada,
            omision_Salida: reporte.omision_Salida,
            comision_Oficial: reporte.comision_Oficial,
            permuta_Laboral: reporte.permuta_Laboral,
            otros: reporte.otros,
            area_Id: reporte.area_Id,
            area: reporte.area,
            vacaciones_P1: reporte.vacaciones_P1,
            vacaciones_P2: reporte.vacaciones_P2,
            permiso_Economico: reporte.permiso_Economico,
            omision_Entrada: reporte.omision_Entrada,
            omision_Salida: reporte.omision_Salida,
            comision_Oficial: reporte.comision_Oficial,
            permuta_Laboral: reporte.permuta_Laboral,
            otros: reporte.otros,
            pases_Oficiales: reporte.pases_Oficiales,
            pases_Oficial_Entrada: reporte.pases_Oficial_Entrada,
            pases_Oficial_Intermedio: reporte.pases_Oficial_Intermedio,
            pases_Oficial_Salida: reporte.pases_Oficial_Salida,
            pases_Personal: reporte.pases_Personal,
            pases_Personales_Entrada: reporte.pases_Personales_Entrada,
            pases_Personal_Intermedio: reporte.pases_Personal_Intermedio,
            pases_Personal_Salida: reporte.pases_Personal_Salida,
            pases_Medico: reporte.pases_Medico,
            pases_Medico_Entrada: reporte.pases_Medico_Entrada,
            pases_Medico_Intermedio: reporte.pases_Medico_Intermedio,
            pases_Medico_Salida: reporte.pases_Medico_Salida,
            pases: reporte.pases,
            justificantes: reporte.justificantes,
          };
        });
        this.listReporte = listReporte;
        return { success };
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },
  },
});
