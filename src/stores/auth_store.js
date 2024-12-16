import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { EncryptStorage } from "storage-encryption";
import { urlSistemas } from "src/boot/axios";

const encryptStorage = new EncryptStorage("SECRET_KEY", "sessionStorage");
export const useAuthStore = defineStore("auth", {
  state: () => ({
    modulos: [],
    sistemas: [],
    apps: [],
    modulo: null,
  }),
  actions: {
    //-----------------------------------------------------------
    async validarToken(token, sistemaId) {
      try {
        const resp = await api.get(
          `/Accesos/ValidaToken/?token=${token}&SistemaId=${sistemaId}`
        );
        if (resp.status == 200) {
          const {
            success,
            empleado,
            perfil,
            perfil_Id,
            area,
            area_Id,
            puesto,
            puesto_Id,
          } = resp.data;
          if (success === true) {
            encryptStorage.encrypt("empleado", empleado);
            encryptStorage.encrypt("perfil", perfil);
            encryptStorage.encrypt("perfil_Id", perfil_Id);
            encryptStorage.encrypt("area", area);
            encryptStorage.encrypt("areaLetra", area);
            encryptStorage.encrypt("area_Id", area_Id);
            encryptStorage.encrypt("puesto", puesto);
            encryptStorage.encrypt("puesto_Id", puesto_Id);
            return success;
          } else {
            return { success };
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

    async loadDatosEmp() {
      try {
        const resp = await api.get(`/Empleados/ByUsuario`);
        if (resp.status == 200) {
          const { success, data } = resp.data; 
          if (success === true) {
            if (data) {
              encryptStorage.encrypt("empleado", data.id);
              if (data.area_Id == 13) {
                const emp = await api.get("/ResponsablesAreas");
                let datosEmp = emp.data.data;
                let numEmp = datosEmp.find((x) => x.empleado_Id == data.id);
                encryptStorage.encrypt("area", numEmp.area_Id);
              } else {
                encryptStorage.encrypt("area", data.area_Id);
              }
            }
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

    async loadRolEmp() {
      try {
        //if (parseInt(localStorage.getItem("area")) != 13) {
        const resp = await api.get(`/ResponsablesAreas/ResposableByUsuario`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            if (data != null) {
              if (
                data.empleado_Id == parseInt(encryptStorage.decrypt("empleado"))
              ) {
                encryptStorage.encrypt("tipoEmp", "JefeArea");
              } else {
                encryptStorage.encrypt("tipoEmp", "Empleado");
              }
            } else {
              encryptStorage.encrypt("tipoEmp", "JefeArea");
            }
          } else {
            return { success, data };
          }
        } else {
          return {
            success: false,
            data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
          };
        }
        //} else {
        //localStorage.setItem("tipoEmp", "ConsejeroElectoral");
        // }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async loadSistemas() {
      try {
        const resp = await api.get(`/SistemasUsuarios/ByUSuario`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            if (data) {
              this.sistemas = data.map((sistema) => {
                return {
                  sistema_Id: sistema.sistema_Id,
                  sistema: sistema.sistema,
                  url: sistema.url,
                  label: sistema.sistema,
                  value: sistema.sistema_Id,
                };
              });

              const appsArray = data.map((app) => {
                return {
                  id: app.sistema_Id,
                  label: app.sistema,
                  avatar:
                    app.logo_Url == null
                      ? "http://sistema.ieenayarit.org:9270/Imagenes/Sistemas/67cfdabe-0538-4324-b711-93bcb6cb9a60.png"
                      : `${urlSistemas}:9270${app.logo_Url.split("9270")[1]}`,
                  url: app.url,
                };
              });
              const logOut = {
                id: 0,
                label: "Cerrar sesión",
                avatar: `${urlSistemas}:9270/Imagenes/Sistemas/dbb9640f-dd18-4fc3-b530-7041d8594240.png`,
                url: "",
              };
              const universoIEEN = {
                id: 0,
                label: "Ir a universo",
                avatar: `${urlSistemas}:9270/Imagenes/Sistemas/67cfdabe-0538-4324-b711-93bcb6cb9a60.png`,
                url: "",
              };

              appsArray.push(universoIEEN);
              appsArray.push(logOut);
              this.apps = appsArray;
            }
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

    async loadModulos() {
      try {
        const sistema = encryptStorage.decrypt("sistema");
        const resp = await api.get(
          `/PermisosModulosUsuarios/Bysuario/${sistema}`
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            if (data) {
              const modulosArray = data.map((modulo) => {
                return {
                  siglas_Modulo: modulo.siglas_Modulo,
                  registrar: modulo.registrar,
                  actualizar: modulo.actualizar,
                  eliminar: modulo.eliminar,
                  leer: modulo.leer,
                };
              });
              this.modulos = modulosArray;
            }
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

    async loadModulo(siglas) {
      try {
        if ((this.modulos = [])) await this.loadModulos();
        this.modulo = this.modulos.find((x) => x.siglas_Modulo == siglas);
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async loadPerfil() {
      try {
        const resp = await api.get("/SistemasUsuarios/ByUSuario");
        let { data } = resp.data;
        let filtro = data.find(
          (x) => x.sistema_Id == parseInt(encryptStorage.decrypt("sistema"))
        );
        encryptStorage.encrypt("perfil", filtro.perfil_Id);
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },
  },
});
