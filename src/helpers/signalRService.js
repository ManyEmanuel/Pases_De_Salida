import { ref } from "vue";
import { useQuasar } from "quasar";
import { EncryptStorage } from "storage-encryption";
import * as signalR from "@microsoft/signalr";

const encryptStorage = new EncryptStorage("SECRET_KEY", "sessionStorage");
const onLine = ref(false);
const connection = new signalR.HubConnectionBuilder()
  .withUrl("http://sistema.ieenayarit.org:9170/hubUniverso", {
    accessTokenFactory: () => encryptStorage.decrypt("key"),
  })
  .withAutomaticReconnect()
  .configureLogging(signalR.LogLevel.Information)
  .build();

export function useNotifications() {
  const $q = useQuasar();

  const startConnection = async () => {
    try {
      await connection.start();
      onLine.value = true;
      console.info("SignalR Connected.");
    } catch (err) {
      onLine.value = false;
      console.error("SignalR Connection Error: ", err);
      setTimeout(startConnection, 5000);
    }
  };

  const onReceiveNotification = () => {
    connection.on("notificarUsuario", (data) => {
      $q.notify({
        message: data.titulo,
        icon: "announcement",
        color: "purple",
        caption: data.sistema,
      });
    });
  };

  return { startConnection, onReceiveNotification, onLine };
}
