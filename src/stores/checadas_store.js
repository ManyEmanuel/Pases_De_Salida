import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useChecadaStore = defineStore("checadas", {
  state: () => ({
    checadas: [],
    mis_checadas: [],
  }),
  actions: {
    async load_checadas() {
      try {
        const resp = await api.get("/Checador");
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success) {
            this.checadas = data.map((element) => {
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
        console.log(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async load_mis_checadas() {
      try {
        const resp = await api.get("/Checador/MisChecadas");
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success) {
            this.mis_checadas = data.map((element) => {
              console.log(element);
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
        console.log(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },
  },
});
