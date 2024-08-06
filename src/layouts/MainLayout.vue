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
              <div>
                <q-item
                  style="max-width: 420px"
                  v-for="notificacion in notificaciones_all"
                  :key="notificacion.id"
                  clickable
                  v-ripple
                  @click="detalle(notificacion.id, notificacion.titulo)"
                >
                  <q-item-section>
                    <q-item-label>{{ notificacion.titulo }}</q-item-label>
                    <q-item-label caption lines="3"
                      >{{ notificacion.descripcion }}
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
                v-if="notificaciones.length > 0"
                class="text-center no-shadow no-border"
              >
                <q-btn
                  label="Ver todos"
                  color="purple-ieen"
                  style="max-width: 120px !important"
                  flat
                  dense
                  class="text-indigo-8"
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
            </q-item>
            <q-item
              v-if="menuPasesList.some((element) => element == 'PS-REG-GEN')"
              :to="{ name: 'registro_General' }"
              class="text-grey-8 text-bold"
              active-class="text-purple-ieen"
            >
              <q-item-section avatar>
                <q-icon name="list_alt" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Registro general</q-item-label>
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
            </q-item>
            <q-item
              v-if="menuPasesList.some((element) => element == 'PS-GEN-JUS')"
              :to="{ name: 'registro_general_justificantes' }"
              class="text-grey-8 text-bold"
              active-class="text-purple-ieen"
            >
              <q-item-section avatar>
                <q-icon name="list_alt" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Registro general</q-item-label>
              </q-item-section>
            </q-item>
          </q-expansion-item>
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
            Bienvenido(a) {{ usuario }}
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
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { onBeforeMount } from "vue";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { useNotificacionStore } from "../stores/notificaciones_store";
import { useAuthStore } from "../stores/auth_store";
import { storeToRefs } from "pinia";
import { useQuasar, QSpinnerFacebook } from "quasar";

//----------------------------------------------------------

const $q = useQuasar();
const leftDrawerOpen = ref(false);
const route = useRoute();
const router = useRouter();
const notificacionStore = useNotificacionStore();
const authStore = useAuthStore();
const { notificaciones, no_notificaciones, notificaciones_all } =
  storeToRefs(notificacionStore);
const usuario = ref("");
const { modulos, apps } = storeToRefs(authStore);
const menuPasesList = ref([]);
const onLine = ref(false);

//----------------------------------------------------------

onBeforeMount(async () => {
  if (route.query.key) {
    localStorage.setItem("key", route.query.key);
  }

  if (route.query.sistema) {
    localStorage.setItem("sistema", route.query.sistema);
  }

  if (route.query.usr) {
    localStorage.setItem("usuario", route.query.usr);
    usuario.value = localStorage.getItem("usuario");
  } else {
    if (localStorage.getItem("usuario") != null) {
      usuario.value = localStorage.getItem("usuario");
    }
  }
  await loadMenu();
  notificacionStore.loadNotificaciones();
  notificacionStore.loadNotificacionesAll();
});

onMounted(() => {
  const connection = new HubConnectionBuilder()
    .withUrl("http://sistema.ieenayarit.org:9270/hubUniverso", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("key")}`,
      },
    })
    .configureLogging(LogLevel.Information)
    .build();
  connection
    .start()
    .then(() => {
      onLine.value = true;
    })
    .catch((err) => {
      onLine.value = false;
    });
  connection.on("notificarUsuario", (data) => {
    notificacionStore.loadNotificaciones();
    notificacionStore.loadNotificacionesAll();
    $q.notify({
      message: data,
      icon: "announcement",
    });
  });
});

//----------------------------------------------------------

const show = () => {
  $q.bottomSheet({
    message: "Aplicaciones",
    grid: true,
    actions: apps.value,
  }).onOk((action) => {
    if (action.label == "Cerrar sesión") {
      localStorage.clear();
      //window.location = "http://sistema.ieenayarit.org:9271?return=false";
      window.location = "http://sistema.ieenayarit.org:9271?return=false";
    } else if (action.label == "Ir a universo") {
      //window.location = "http://sistema.ieenayarit.org:9271?return=true";
      window.location = "http://sistema.ieenayarit.org:9271?return=true";
    } else {
      window.location =
        action.url +
        `/#/?key=${localStorage.getItem("key")}&sistema=${
          action.id
        }&usr=${localStorage.getItem("usuario")}`;
    }
  });
};

const detalle = async (id, tipoSolicitud) => {
  await notificacionStore.leerNotificacion(id);
  notificacionStore.loadNotificaciones();
  notificacionStore.loadNotificacionesAll();
  if (tipoSolicitud == "Tiene una nueva solicitud") {
    router.push({ name: "solicitudes_Pases" });
  } else {
    router.push({ name: "registro_Pases" });
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
      case "PS-REG-GEN":
        menuPasesList.value.push("PS-REG-GEN");
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
      case "PS-GEN-JUS":
        menuPasesList.value.push("PS-GEN-JUS");
        break;
    }
  });
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
