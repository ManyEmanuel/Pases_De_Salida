<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-purple-ieen">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title> Pases de salida </q-toolbar-title>
        <q-badge rounded :color="onLine == true ? 'green' : 'red'" />
        <q-btn flat round dense icon="notifications">
          <q-badge v-if="no_notificaciones > 0" color="red" floating>{{
            no_notificaciones > 5 ? "5+" : no_notificaciones
          }}</q-badge>
          <q-menu>
            <q-list style="min-width: 100px">
              <div
                class="q-pl-md q-pt-sm q-pb-sm q-pr-md text-bold text-h6 text-grey-9"
              >
                Notificaciones
              </div>
              <div>
                <q-item
                  style="max-width: 420px"
                  v-for="notificacion in notificaciones"
                  :key="notificacion.id"
                  clickable
                  v-ripple
                  @click="detalle(notificacion)"
                >
                  <q-item-section>
                    <q-item-label>{{ notificacion.titulo }}</q-item-label>
                    <q-item-label caption lines="3"
                      >{{ notificacion.mensaje }}
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    {{ notificacion.fecha_Registro }}
                    <q-badge
                      v-if="notificacion.leido == false"
                      color="blue"
                      rounded
                      class="q-mr-sm"
                    />
                  </q-item-section>
                </q-item>
              </div>
              <q-card
                class="text-center no-shadow no-border q-pa-sm"
                v-if="notificaciones.length == 0"
              >
                <div class="text-indigo-8 text-purple-ieen">
                  Sin notificaciones
                </div>
              </q-card>
              <q-separator />
              <q-card class="text-center no-shadow no-border q-pa-sm">
                <q-btn
                  label="Marcar todo como leido"
                  color="purple-ieen"
                  flat
                  class="text-indigo-8"
                  @click="marcarLeido"
                ></q-btn>
                <q-btn
                  flat
                  label="Ver todos"
                  color="purple-ieen"
                  class="text-indigo-8"
                  @click="toNotificaciones"
                ></q-btn>
              </q-card>
            </q-list>
          </q-menu>
        </q-btn>
        <q-btn flat round dense icon="apps" @click="show" />
      </q-toolbar>
    </q-header>
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :width="300"
      :breakpoint="1024"
      class="text-black"
    >
      <q-scroll-area
        style="
          height: calc(100% - 150px);
          margin-top: 150px;
          border-right: 1px solid #ddd;
        "
      >
        <q-list padding class="margin top">
          <q-expansion-item
            expand-separator
            icon="menu_book"
            label="Pases de salida"
            class="text-grey-8 text-bold"
            active-class="text-purple-ieen"
          >
            <q-item
              v-if="menuPasesList.some((element) => element == 'PS-REG-PAS')"
              :to="{ name: 'registro_Pases' }"
              class="text-grey-8 text-bold"
              active-class="text-purple-ieen"
            >
              <q-item-section avatar>
                <q-icon name="person" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Mis solicitudes</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              v-if="menuPasesList.some((element) => element == 'PS-SOL-PAS')"
              :to="{ name: 'solicitudes_Pases' }"
              class="text-grey-8 text-bold"
              active-class="text-purple-ieen"
            >
              <q-item-section avatar>
                <q-icon name="groups" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Solicitudes del área</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-badge color="purple-ieen"> {{ solicitudes.length }}</q-badge>
              </q-item-section>
            </q-item>
          </q-expansion-item>
          <q-expansion-item
            expand-separator
            icon="library_books"
            label="Justificantes"
            class="text-grey-8 text-bold"
            active-class="text-purple-ieen"
          >
            <q-item
              v-if="menuPasesList.some((element) => element == 'PS-REG-JUS')"
              :to="{ name: 'registro_Justificante' }"
              class="text-grey-8 text-bold"
              active-class="text-purple-ieen"
            >
              <q-item-section avatar>
                <q-icon name="person" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Mis solicitudes</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              v-if="menuPasesList.some((element) => element == 'PS-MIS-JUS')"
              :to="{ name: 'solicitudes_Justificantes' }"
              class="text-grey-8 text-bold"
              active-class="text-purple-ieen"
            >
              <q-item-section avatar>
                <q-icon name="groups" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Solicitudes del área</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-badge color="purple-ieen">
                  {{ solicitudesArea.length }}</q-badge
                >
              </q-item-section>
            </q-item>
          </q-expansion-item>
          <q-item
            v-if="menuPasesList.some((element) => element == 'PS-GEN-ADM')"
            :to="{ name: 'registro_General' }"
            class="text-grey-8 text-bold"
            active-class="text-purple-ieen"
          >
            <q-item-section avatar>
              <q-icon name="list_alt" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Historial general</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            v-if="
              menuPasesList.some(
                (element) =>
                  element == 'PS-REPORTES' || element == 'PS-INTERMEDIO'
              )
            "
            :to="{ name: 'reportes' }"
            class="text-grey-8 text-bold"
            active-class="text-purple-ieen"
          >
            <q-item-section avatar>
              <q-icon name="analytics" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Reportes</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            v-if="menuPasesList.some((element) => element == 'PS-MISCHECADAS')"
            :to="{ name: 'misChecadas' }"
            class="text-grey-8 text-bold"
            active-class="text-purple-ieen"
          >
            <q-item-section avatar>
              <q-icon name="calendar_month" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Mis checadas</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            v-if="menuPasesList.some((element) => element == 'PS-CHECADAS')"
            :to="{ name: 'checadas' }"
            class="text-grey-8 text-bold"
            active-class="text-purple-ieen"
          >
            <q-item-section avatar>
              <q-icon name="calendar_month" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Checadas</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            v-if="menuVehiculos"
            clickable
            @click="verDisponibilidad"
            class="text-grey-8 text-bold"
            active-class="text-purple-ieen"
          >
            <q-item-section avatar>
              <q-icon name="directions_car" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Ver disponibilidad de vehículos</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
      <q-img
        class="absolute-top"
        src="~assets/FondoIEEN.png"
        style="height: 150px"
      >
        <div class="bg-transparent">
          <div class="text-weight-bold text-black">
            <br />
            Bienvenido(a) <br />
            {{ usuario }}
          </div>
        </div>
      </q-img>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer reveal bordered class="bg-purple-ieen">
      <q-toolbar>
        <q-toolbar-title
          ><div>
            &#169; Unidad Técnica de Informática y Estadística
          </div></q-toolbar-title
        >
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { onBeforeMount } from "vue";
import { useNotificacionStore } from "../stores/notificaciones_store";
import { useAuthStore } from "../stores/auth_store";
import { storeToRefs } from "pinia";
import { useQuasar, QSpinnerFacebook } from "quasar";
import { useNotifications } from "../helpers/signalRService";
import { EncryptStorage } from "storage-encryption";
import { useSolicitudJustificanteStore } from "src/stores/solicitudes_Justificantes_store";
import { useSolicitudPaseStore } from "src/stores/solicitudes_Pase_store";
import { urlSistemas } from "src/boot/axios";

//----------------------------------------------------------

const $q = useQuasar();
const leftDrawerOpen = ref(false);
const route = useRoute();
const router = useRouter();
const notificacionStore = useNotificacionStore();
const authStore = useAuthStore();
const encryptStorage = new EncryptStorage("SECRET_KEY", "sessionStorage");
const solicitudJustificanteStore = useSolicitudJustificanteStore();
const solicitudStore = useSolicitudPaseStore();
const { solicitudesArea } = storeToRefs(solicitudJustificanteStore);
const { solicitudes } = storeToRefs(solicitudStore);
const { startConnection, onReceiveNotification, onLine } = useNotifications();
const { notificaciones, no_notificaciones, notificaciones_all } =
  storeToRefs(notificacionStore);
const usuario = ref("");
const { modulos, apps, sistemas } = storeToRefs(authStore);
const menuPasesList = ref([]);
const menuVehiculos = ref(false);

//----------------------------------------------------------

onBeforeMount(async () => {
  if (route.query.key) {
    $q.loading.show({
      spinner: QSpinnerFacebook,
      spinnerColor: "purple-ieen",
      spinnerSize: 140,
      backgroundColor: "purple-3",
      message: "Espere un momento, por favor...",
      messageColor: "black",
    });
    encryptStorage.encrypt("key", route.query.key);
    const resp = await authStore.validarToken(
      route.query.key,
      route.query.sistema
    );
    $q.loading.hide();
    if (resp.success == false) {
      localStorage.clear();
      sessionStorage.clear();
      encryptStorage.remove("key");
      window.location = `${urlSistemas}:9271?return=false`;
    }
  }

  if (route.query.sistema) {
    encryptStorage.encrypt("sistema", route.query.sistema);
  }

  if (route.query.usr) {
    encryptStorage.encrypt("usuario", route.query.usr);
    usuario.value = encryptStorage.decrypt("usuario");
  } else {
    if (encryptStorage.decrypt("usuario") != null) {
      usuario.value = encryptStorage.decrypt("usuario");
    }
  }
  cargarData();
  conectar_signalr();
});

const conectar_signalr = async () => {
  await startConnection();
  onReceiveNotification();
};

//----------------------------------------------------------

const cargarData = async () => {
  loadMenu();
  await notificacionStore.loadNotificaciones();
  await notificacionStore.loadNotificacionesAll();
  await solicitudJustificanteStore.loadSolicitudesJustificantes();
  await solicitudStore.loadSolicitudes();
};

const toNotificaciones = () => {
  router.push({
    name: "notificaciones",
  });
};

const verDisponibilidad = () => {
  let sistema = sistemas.value.find(
    (x) => x.label == "Disponibilidad vehículo"
  );
  $q.dialog({
    title: "Ver disponibilidad de vehículos",
    style: "width: 1000px; max-width: 120vw",
    message: `<iframe
            src="${`${urlSistemas}:${
              sistema.url.split(":")[2]
            }/#/ver_Disponibilidad/?key=${encryptStorage.decrypt(
              "key"
            )}&sistema=${sistema.sistema_Id}&usr=${encryptStorage.decrypt(
              "usuario"
            )}`}"
            width="100%"
            height="650"
          ></iframe>`,
    html: true,
    ok: "Cerrar",
  });
};

const show = () => {
  $q.bottomSheet({
    message: "Aplicaciones",
    grid: true,
    actions: apps.value,
  }).onOk((action) => {
    if (action.label == "Cerrar sesión") {
      localStorage.clear();
      sessionStorage.clear();
      encryptStorage.remove("key");
      window.location = `${urlSistemas}:9271?return=false`;
    } else if (action.label == "Ir a universo") {
      window.location = `${urlSistemas}:9271?return=true`;
    } else {
      window.location = `${urlSistemas}:${
        action.url.split(":")[2]
      }/#/?key=${encryptStorage.decrypt("key")}&sistema=${
        action.id
      }&usr=${encryptStorage.decrypt("usuario")}`;
    }
  });
};

const detalle = async (row) => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  let resp = await notificacionStore.leerNotificacion(row.id);
  if (resp.success == true) {
    await notificacionStore.loadNotificaciones();
  }
  let url = sistemas.value.find((x) => x.value == row.sistema_Id);
  if (row.sistema_Id == encryptStorage.decrypt("sistema")) {
    router.push({
      name: "misSolicitudes",
    });
  } else {
    window.location =
      url.url +
      `/#/?key=${encryptStorage.decrypt("key")}&sistema=${
        row.sistema_Id
      }&usr=${encryptStorage.decrypt("usuario")}`;
  }
  $q.loading.hide();
};

const marcarLeido = async () => {
  let resp = await notificacionStore.leerTodas();
  if (resp.success) {
    $q.notify({
      position: "top-right",
      type: "positive",
      message: resp.data,
      actions: [
        {
          icon: "close",
          color: "white",
          round: true,
          handler: () => {},
        },
      ],
    });
    await notificacionStore.loadNotificaciones();
    await notificacionStore.loadNotificacionesAll();
  } else {
    $q.notify({
      position: "top-right",
      type: "negative",
      message: resp.data,
      actions: [
        {
          icon: "close",
          color: "white",
          round: true,
          handler: () => {},
        },
      ],
    });
  }
};

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const loadMenu = async () => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  await authStore.loadSistemas();
  await authStore.loadModulos();
  await authStore.loadPerfil();
  await authStore.loadDatosEmp();
  await authStore.loadRolEmp();
  modulos.value.forEach((element) => {
    switch (element.siglas_Modulo) {
      case "PS-REG-PAS":
        menuPasesList.value.push("PS-REG-PAS");
        break;
      case "PS-SOL-PAS":
        menuPasesList.value.push("PS-SOL-PAS");
        break;
      case "PS-REG-JUS":
        menuPasesList.value.push("PS-REG-JUS");
        break;
      case "PS-MIS-JUS":
        menuPasesList.value.push("PS-MIS-JUS");
        break;
      case "PS-MISCHECADAS":
        menuPasesList.value.push("PS-MISCHECADAS");
        break;
      case "PS-CHECADAS":
        menuPasesList.value.push("PS-CHECADAS");
        break;
      case "PS-REPORTES":
        menuPasesList.value.push("PS-REPORTES");
        break;
      case "PS-GEN-ADM":
        menuPasesList.value.push("PS-GEN-ADM");
        break;
      case "PS-INTERMEDIO":
        menuPasesList.value.push("PS-INTERMEDIO");
        break;
    }
  });
  let sistema = sistemas.value.find(
    (x) => x.label == "Disponibilidad vehículo"
  );
  if (sistema == undefined) {
    menuVehiculos.value = false;
  } else {
    menuVehiculos.value = true;
  }
  $q.loading.hide();
};
</script>
<style lang="scss">
.text-purple-ieen {
  color: #673e84 !important;
}
.bg-purple-ieen {
  background: #673e84 !important;
}
.text-purple-ieen-1 {
  color: #863399 !important;
}
.bg-purple-ieen-1 {
  background: #863399 !important;
}
.text-purple-ieen-2 {
  color: #a25eb5 !important;
}
.bg-purple-ieen-2 {
  background: #a25eb5 !important;
}
.text-purple-ieen-3 {
  color: #bb83ca !important;
}
.bg-purple-ieen-3 {
  background: #bb83ca !important;
}
.text-pink-ieen-1 {
  color: #b32572 !important;
}
.bg-pink-ieen-1 {
  background: #b32572 !important;
}
.text-pink-ieen-2 {
  color: #cc5599 !important;
}
.bg-pink-ieen-2 {
  background: #cc5599 !important;
}
.text-pink-ieen-3 {
  color: #dd85ba !important;
}
.bg-pink-ieen-3 {
  background: #dd85ba !important;
}
.text-gray-ieen-1 {
  color: #76777a !important;
}
.bg-gray-ieen-1 {
  background: #76777a !important;
}
.text-gray-ieen-2 {
  color: #98989a !important;
}
.bg-gray-ieen-2 {
  background: #98989a !important;
}
.text-gray-ieen-3 {
  color: #b1b1b1 !important;
}
.bg-gray-ieen-3 {
  background: #b1b1b1 !important;
}
</style>
