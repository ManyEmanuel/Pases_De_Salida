import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useChecadaStore = defineStore("checadas", {
  state: () => ({
    checadas: [],
    mis_checadas: [],
    empleados: [],
  }),

  actions: {
    async load_mis_checadas() {
      try {
        const resp = await api.get("/Checador/MisChecadas");
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success) {
            this.mis_checadas = data.map((element) => {
              return {
                id: element.id,
                title: element.title,
                start: element.fecha,
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
            this.checadas = data;
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
  },
});
