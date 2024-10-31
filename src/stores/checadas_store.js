import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useChecadaStore = defineStore("checadas", {
  state: () => ({
    personal_Id: null,
    checadas: [],
    mis_checadas: [],
    empleados: [],
    fechaTope: [],
    list_Areas: [],
    list_Personal: [],
    list_Checadas_Personal: [],
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
    async load_mis_checadas(fecha_inicio, fecha_fin) {
      try {
        this.mis_checadas = [];
        const resp = await api.get(
          `/Checador/MisChecadas?Fecha_Inicio=${fecha_inicio}&Fecha_Fin=${fecha_fin}`
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success) {
            this.mis_checadas = data.map((element) => {
              return {
                id: element.id,
                title: element.title,
                start:
                  element.fecha != null
                    ? element.title.includes("Omisión de salida")
                      ? `${element.fecha.split("T")[0]}T16:00:00`
                      : element.title.includes("Omisión de entrada")
                      ? `${element.fecha.split("T")[0]}T08:00:00`
                      : element.fecha
                    : element.fecha,
              };
            });
            return { success };
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

    async load_empleados_calendario() {
      try {
        const resp = await api.get("/Checador/Calendario");
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success) {
            this.empleados = data.map((element) => {
              return {
                id: element.id,
                title: element.label,
              };
            });
          }
        }
      } catch (error) {}
    },

    async load_checadas(fecha_inicio, fecha_fin) {
      try {
        this.checadas = [];
        const resp = await api.get(
          `/Checador/Eventos?Fecha_Inicio=${fecha_inicio}&fecha_fin=${fecha_fin}`
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success) {
            const fechas = [];
            let fechaActual = new Date(fecha_inicio);
            const fin = new Date(fecha_fin);
            while (fechaActual <= fin) {
              const anio = fechaActual.getFullYear();
              const mes = String(fechaActual.getMonth() + 1).padStart(2, "0"); // Meses son 0-11
              const dia = String(fechaActual.getDate()).padStart(2, "0");
              fechas.push(`${anio}-${mes}-${dia}`);
              fechaActual.setDate(fechaActual.getDate() + 1);
            }
            this.fechaTope = fechas;
            let listaChecadas = data.map((checada) => {
              let fecha = checada.start.split(" ");
              return {
                end: checada.end,
                event_Id: checada.event_Id,
                id: checada.id,
                resourceId: checada.resourceId,
                start: checada.start,
                title: checada.title,
                type: checada.type,
                dateCompare: fecha[0],
              };
            });
            this.checadas = listaChecadas;
          } else {
            return { success, data };
          }
        } else {
          return {
            success: false,
            data: "Ocurrio un error intentelo de nuevo, si el error persiste comuniquese con el administrador del sistema",
          };
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrio un error intentelo de nuevo, si el error persiste comuniquese con el administrador del sistema",
        };
      }
    },

    //-----------------------------------------------------------------------
    async load_Areas() {
      try {
        let respArea = await api.get("/Areas/GetLista");
        let { data } = respArea.data;
        this.list_Areas = data.map((areas) => {
          return {
            value: areas.value,
            label: areas.label,
          };
        });
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------------------
    async load_Personal_ByArea(id) {
      try {
        let respArea = await api.get(`/Empleados/GetListaByArea/${id}`);
        let { data } = respArea.data;
        this.list_Personal = data.map((personal) => {
          return {
            value: personal.value,
            label: personal.label,
          };
        });
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------------------
    async load_Checadas_ByPersonal(id, fecha_Inicio, fecha_Fin) {
      try {
        let resp = await api.get(
          `/Checador/ByEmpleado/${id}/?Fecha_Inicio=${fecha_Inicio}&Fecha_Fin=${fecha_Fin}`
        );
        let { data } = resp.data;
        this.list_Checadas_Personal = data.map((checada) => {
          return {
            id: checada.id,
            title: checada.title,
            start: checada.title.includes("Omisión de salida")
              ? `${checada.fecha.split("T")[0]}T16:00:00`
              : checada.title.includes("Omisión de entrada")
              ? `${checada.fecha.split("T")[0]}T08:00:00`
              : checada.fecha,
          };
        });
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },
  },
});
