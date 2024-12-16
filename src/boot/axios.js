import { boot } from "quasar/wrappers";
import { EncryptStorage } from "storage-encryption";
import axios from "axios";

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)

const encryptStorage = new EncryptStorage("SECRET_KEY", "sessionStorage");
const urlActual = window.location.href;
//const isLocal = urlActual.includes("sistema.ieenayarit.org") ? false : true;
let arrUrl = urlActual.split(":");
let urlSistemas = arrUrl[0] + ":" + arrUrl[1];

let urlAxios = "";
if (urlActual.includes("localhost")) {
  urlAxios = "http://192.168.2.110:9270/api";
  urlSistemas = "http://192.168.2.110";
} else {
  urlAxios = arrUrl[0] + ":" + arrUrl[1] + ":9270/api";
}

const api = axios.create({ baseURL: urlAxios });

// const api = axios.create({
//   baseURL: "https://xdxd2lf8-7289.usw3.devtunnels.ms/api",
// });

api.interceptors.request.use((config) => {
  config.headers = {
    Authorization: `Bearer ${encryptStorage.decrypt("key")}`,
  };
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status == 401) {
      alert("Su sesión ha expirado, sera redireccionado al logín");
      localStorage.clear();
      window.location = urlSistemas + ":9271?return=false";
    }
    return Promise.reject();
  }
);

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api, urlSistemas };
