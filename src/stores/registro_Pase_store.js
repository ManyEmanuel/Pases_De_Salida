import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import moment from "moment-timezone";

export const useRegistroPaseStore = defineStore("registroPase", {
  state: () => ({
    modal: false,
    modalconsulta: false,
    isEditar: false,
    pases: [],
    areas: [],
    empleados: [],
    vehiculos: [],
    pase: {
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
      rol: null,
    },
    paseConsulta: {
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
      rol: null,
    },
    myLocale: {
      days: "Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado".split("_"),
      daysShort: "Dom_Lun_Mar_Mié_Jue_Vie_Sáb".split("_"),
      months:
        "Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre".split(
          "_"
        ),
      monthsShort: "Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic".split("_"),
      firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
      format24h: true,
      pluralDay: "dias",
    },
  }),
  actions: {
    initPase() {
      this.pase.id = null;
      this.pase.responsable_Area_Id = null;
      this.pase.responsable_Area = null;
      this.pase.solicitante_Id = null;
      this.pase.solicitante = null;
      this.pase.puesto_Solicitante_Id = null;
      this.pase.puesto_Solicitante = null;
      this.pase.capturista_Id = null;
      this.pase.capturista = null;
      this.pase.vehiculo_Id = null;
      this.pase.vehiculo = null;
      this.pase.area_Id = null;
      this.pase.area = null;
      this.pase.estatus = null;
      this.pase.folio = null;
      this.pase.entrada = null;
      this.pase.salida = null;
      this.pase.llegada = null;
      this.pase.fecha_Aprobacion_Rechazo = null;
      this.pase.tipo_Asunto = null;
      this.pase.tipo_Pase = null;
      this.pase.asunto = null;
      this.pase.fecha_Creacion = null;
      this.pase.rol = null;
    },
    initPaseConsulta() {
      this.paseConsulta.id = null;
      this.paseConsulta.responsable_Area_Id = null;
      this.paseConsulta.responsable_Area = null;
      this.paseConsulta.solicitante_Id = null;
      this.paseConsulta.solicitante = null;
      this.paseConsulta.puesto_Solicitante_Id = null;
      this.paseConsulta.puesto_Solicitante = null;
      this.paseConsulta.capturista_Id = null;
      this.paseConsulta.capturista = null;
      this.paseConsulta.vehiculo_Id = null;
      this.paseConsulta.vehiculo = null;
      this.paseConsulta.area_Id = null;
      this.paseConsulta.area = null;
      this.paseConsulta.estatus = null;
      this.paseConsulta.folio = null;
      this.paseConsulta.entrada = null;
      this.paseConsulta.salida = null;
      this.paseConsulta.llegada = null;
      this.paseConsulta.fecha_Aprobacion_Rechazo = null;
      this.paseConsulta.tipo_Asunto = null;
      this.paseConsulta.tipo_Pase = null;
      this.paseConsulta.asunto = null;
      this.paseConsulta.fecha_Creacion = null;
      this.paseConsulta.rol = null;
    },

    async loadInformacionPase() {
      try {
        let perfil = parseInt(localStorage.getItem("perfil"));
        let area = parseInt(localStorage.getItem("area"));
        let resp = await api.get("/ResponsablesAreas/ResposableByUsuario");
        let dataresp = resp.data.data;

        if (perfil == 1) {
          let respArea = await api.get("Areas/GetLista");
          let { data } = respArea.data;
          let listAreas = data.map((areas) => {
            return {
              value: areas.value,
              label: areas.label,
            };
          });
          this.areas = listAreas.filter((x) => x.value != 13 && x.value != 21);
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
          this.pase.area_Id = data.area_Id;
          this.pase.area = data.area;
          this.empleados = listPersonal;
          this.pase.responsable_Area = dataresp.empleado;
          this.pase.responsable_Area_Id = dataresp.empleado_Id;
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
          //this.pase.puesto_Solicitante = data2.puesto;
          this.pase.area_Id = data.area_Id;
          this.pase.area = data.area;
          this.pase.solicitante_Id = data2.id;
          //this.pase.responsable_Area = dataresp.empleado;
          //this.pase.responsable_Area_Id = dataresp.empleado_Id;
          this.areas = listAreas;
          this.empleados = listPersonal;
          await this.loadPuestoPersonal(data2.id);
        }
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async loadPases() {
      try {
        let perfil = parseInt(localStorage.getItem("perfil"));
        let area = parseInt(localStorage.getItem("area"));
        let resp = null;
        let listPases = null;
        if (perfil == 1) {
          resp = await api.get("/PasesSalida/ObtenTodos");
          let { success, data } = resp.data;
          listPases = data.map((pases) => {
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
              tipo_Asunto: pases.tipo_Asunto,
              tipo_Pase: pases.tipo_Pase,
              area: pases.area,
              estatus: pases.estatus,
              folio: pases.folio,
              asunto: pases.asunto,
              fechaSolicitud:
                fechaFinal[2] + "-" + fechaFinal[1] + "-" + fechaFinal[0],
              responsable_Area: pases.responsable_Area,
              capturista: pases.capturista,
            };
          });
        } else if (perfil == 2) {
          resp = await api.get("/PasesSalida/ByArea");
          let { success, data } = resp.data;
          listPases = data.map((pases) => {
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
              tipo_Asunto: pases.tipo_Asunto,
              tipo_Pase: pases.tipo_Pase,
              area: pases.area,
              estatus: pases.estatus,
              folio: pases.folio,
              asunto: pases.asunto,
              fechaSolicitud:
                fechaFinal[2] + "-" + fechaFinal[1] + "-" + fechaFinal[0],
              responsable_Area: pases.responsable_Area,
              capturista: pases.capturista,
            };
          });
        } else if (perfil == 3) {
          resp = await api.get("/PasesSalida/MisPases");
          let { success, data } = resp.data;
          listPases = data.map((pases) => {
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
              tipo_Asunto: pases.tipo_Asunto,
              tipo_Pase: pases.tipo_Pase,
              area: pases.area,
              estatus: pases.estatus,
              folio: pases.folio,
              asunto: pases.asunto,
              fechaSolicitud:
                fechaFinal[2] + "-" + fechaFinal[1] + "-" + fechaFinal[0],
              responsable_Area: pases.responsable_Area,
              capturista: pases.capturista,
            };
          });
        }
        this.pases = listPases;
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async loadPase(id) {
      try {
        let resp = null;
        resp = await api.get(`/PasesSalida/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
            this.pase.id = data.id;
            this.pase.responsable_Area_Id = data.responsable_Area_Id;
            this.pase.responsable_Area = data.responsable_Area;
            this.pase.solicitante_Id = data.solicitante_Id;
            this.pase.solicitante = data.solicitante;
            this.pase.puesto_Solicitante_Id = data.puesto_Solicitante_Id;
            this.pase.puesto_Solicitante = data.puesto_Solicitante;
            this.pase.capturista_Id = data.capturista_Id;
            this.pase.capturista = data.capturista;
            this.pase.vehiculo_Id = data.vehiculo_Id;
            this.pase.vehiculo = data.vehiculo;
            this.pase.area_Id = data.area_Id;
            this.pase.area = data.area;
            this.pase.estatus = data.estatus;
            this.pase.folio = data.folio;
            this.pase.entrada = data.entrada;
            this.pase.salida = data.salida;
            this.pase.llegada = data.llegada;
            this.pase.fecha_Aprobacion_Rechazo = data.fecha_Aprobacion_Rechazo;
            this.pase.tipo_Asunto = data.tipo_Asunto;
            this.pase.tipo_Pase = data.tipo_Pase;
            this.pase.asunto = data.asunto;
            this.pase.fecha_Creacion = data.fecha_Creacion;
            this.pase.rol = data.rol;
          }
        }
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async loadPaseConsulta(id) {
      try {
        let resp = null;
        resp = await api.get(`/PasesSalida/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
            this.paseConsulta.id = data.id;
            this.paseConsulta.responsable_Area_Id = data.responsable_Area_Id;
            this.paseConsulta.responsable_Area = data.responsable_Area;
            this.paseConsulta.solicitante_Id = data.solicitante_Id;
            this.paseConsulta.solicitante = data.solicitante;
            this.paseConsulta.puesto_Solicitante_Id =
              data.puesto_Solicitante_Id;
            this.paseConsulta.puesto_Solicitante = data.puesto_Solicitante;
            this.paseConsulta.capturista_Id = data.capturista_Id;
            this.paseConsulta.capturista = data.capturista;
            this.paseConsulta.vehiculo_Id = data.vehiculo_Id;
            this.paseConsulta.vehiculo = data.vehiculo;
            this.paseConsulta.area_Id = data.area_Id;
            this.paseConsulta.area = data.area;
            this.paseConsulta.estatus = data.estatus;
            this.paseConsulta.folio = data.folio;
            this.paseConsulta.entrada = data.entrada;
            this.paseConsulta.salida = data.salida;
            this.paseConsulta.llegada = data.llegada;
            this.paseConsulta.fecha_Aprobacion_Rechazo =
              data.fecha_Aprobacion_Rechazo;
            this.paseConsulta.tipo_Asunto = data.tipo_Asunto;
            this.paseConsulta.tipo_Pase = data.tipo_Pase;
            this.paseConsulta.asunto = data.asunto;
            this.paseConsulta.fecha_Creacion = data.fecha_Creacion;
            this.paseConsulta.rol = data.rol;
          }
        }
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async loadPersonalArea(id) {
      try {
        this.empleados = null;
        let resp = await api.get(`/Empleados/ByArea/${id}`);
        let { data } = resp.data;
        let listPersonal = data.map((personal) => {
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
        this.empleados = listPersonal;
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async loadResponsabeArea(id) {
      const resp = await api.get("/ResponsablesAreas");
      let { success, data } = resp.data;
      let filtro = data.find((x) => x.area_Id == id);

      this.pase.responsable_Area = filtro.empleado;
      this.pase.responsable_Area_Id = filtro.empleado_Id;
    },

    async loadPuestoPersonal(id) {
      const per = await api.get("/ResponsablesAreas");
      let listResponsable = per.data.data;
      const resp = await api.get(`/Empleados/${id}`);
      let { success, data } = resp.data;

      this.pase.puesto_Solicitante = data.puesto;
      this.pase.puesto_Solicitante_Id = data.puesto_Id;
      let filtro = listResponsable.find((x) => x.empleado_Id == id);
      if (filtro != null) {
        let Area = await api.get(`Areas/${filtro.area_Id}`);
        let listArea = Area.data.data;
        let filtro2 = listResponsable.find(
          (x) => x.area_Id == parseInt(listArea.area_Padre_Id)
        );
        this.pase.responsable_Area = filtro2.empleado;
        this.pase.responsable_Area_Id = filtro2.empleado_Id;
      } else {
        let filtro2 = listResponsable.find((x) => x.area_Id == data.area_Id);

        this.pase.responsable_Area = filtro2.empleado;
        this.pase.responsable_Area_Id = filtro2.empleado_Id;
      }
    },

    async loadVehiculos(inicio, fin) {
      this.vehiculos = [];
      const resp = await api.post("/Vehiculos/GetListaDisponible", {
        fecha_Inicio: inicio,
        fecha_Fin: fin,
      });

      let { success, data } = resp.data;
      let listVehiculo = data.map((vehiculo) => {
        return {
          label: vehiculo.label,
          value: vehiculo.value,
        };
      });
      this.vehiculos = listVehiculo;
    },

    async createPase(pase) {
      try {
        const resp = await api.post("/PasesSalida", pase);
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
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async updatePase(pase) {
      try {
        const resp = await api.put(`/PasesSalida/${pase.id}`, pase);
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
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async deletePase(id) {
      try {
        const resp = await api.get(`/PasesSalida/Cancelar/${id}`);
        if (resp.status == 200) {
          let { success, data } = resp.data;

          if (success === true) {
            return { success, data };
          } else {
            return { success, data };
          }
        } else {
          return {
            success: false,
            data: "Ocurrio un error, intentelo de nuevo",
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

    async compareHoras() {
      try {
        let llegada = new Date("2022-05-05 " + this.pase.llegada);
        let salida = new Date(this.pase.salida);
        if (llegada.getHours() > salida.getHours()) {
          return {
            success: true,
            data: "Hora bien",
          };
        } else if (llegada.getHours() == salida.getHours()) {
          if (llegada.getMinutes() > salida.getMinutes()) {
            return {
              success: true,
              data: "Hora bien",
            };
          } else {
            return {
              success: false,
              data: "La hora estimada de llegada, debe ser mayor a la hora de salida",
            };
          }
        } else {
          return {
            success: false,
            data: "La hora estimada de llegada, debe ser mayor a la hora de salida",
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

    /*async loadFolio() {
      const resp = await api.get("/RecepcionDocumentos");
      let fecha = new Date();
      let anio = fecha.getFullYear();
      if (resp.status == 200) {
        const { success, data } = resp.data;
        if (success === true) {
          console.log("Este es el data", data.length);
          if (data.length > 0) {
            let listado = data[data.length - 1];
            let folio = listado.folio;
            let numfolio = folio.split("-");
            if (anio == Number(numfolio[2])) {
              let num = Number(numfolio[1]) + 1;
              if (num <= 9) {
                this.recepcion.folio = "OP-000" + num + "-" + anio;
              } else if (num >= 10 && num <= 99) {
                this.recepcion.folio = "OP-00" + num + "-" + anio;
              } else if (num >= 100 && num <= 999) {
                this.recepcion.folio = "OP-0" + num + "-" + anio;
              } else {
                this.recepcion.folio = "OP-" + num + "-" + anio;
              }
            } else {
              this.recepcion.folio = "OP-0001-" + anio;
            }
          } else {
            this.recepcion.folio = "OP-0001-" + anio;
          }
        }
        console.log("Este es el nuevo folio", this.recepcion.folio);
      }
    },*/

    actualizarModal(valor) {
      this.modal = valor;
    },

    actualizarConsulta(valor) {
      this.modalconsulta = valor;
    },

    updateEditar(valor) {
      this.isEditar = valor;
    },
  },
});
