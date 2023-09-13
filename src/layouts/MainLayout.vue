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
          <q-item
            v-if="menuPasesList.some((element) => element == 'PS-REG-PAS')"
            :to="{ name: 'registro_Pases' }"
          >
            <q-item-section avatar>
              <q-icon name="person" color="purple-ieen" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-purple-ieen label-title text-bold"
                >Mis solicitudes</q-item-label
              >
            </q-item-section>
          </q-item>
          <q-item
            v-if="menuPasesList.some((element) => element == 'PS-SOL-PAS')"
            :to="{ name: 'solicitudes_Pases' }"
          >
            <q-item-section avatar>
              <q-icon name="groups" color="purple-ieen" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-purple-ieen label-title text-bold"
                >Solicitudes del área</q-item-label
              >
            </q-item-section>
          </q-item>
          <q-item
            v-if="menuPasesList.some((element) => element == 'PS-REG-GEN')"
            :to="{ name: 'registro_General' }"
          >
            <q-item-section avatar>
              <q-icon name="list_alt" color="purple-ieen" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-purple-ieen label-title text-bold"
                >Registro general</q-item-label
              >
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

<script>
import { defineComponent, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { onBeforeMount } from "vue";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { useNotificacionStore } from "../stores/notificaciones_store";
import { useAuthStore } from "../stores/auth_store";
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
//import EssentialLink from "components/EssentialLink.vue";

export default defineComponent({
  name: "MainLayout",

  components: {
    //EssentialLink,
  },

  setup() {
    const $q = useQuasar();
    const leftDrawerOpen = ref(false);
    const route = useRoute();
    const router = useRouter();
    const notificacionStore = useNotificacionStore();
    const authStore = useAuthStore();
    const { notificaciones, no_notificaciones, notificaciones_all } =
      storeToRefs(notificacionStore);
    const usuario = ref("");
    const { modulos, sistemas, apps } = storeToRefs(authStore);
    const menuPasesList = ref([]);
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

    const connection = new HubConnectionBuilder()
      .withUrl("http://sistema.ieenayarit.org:9270/hubPases", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("key")}`,
        },
      })
      .configureLogging(LogLevel.Information)
      .build();

    connection.on("notificar", (data) => {
      notificacionStore.loadNotificaciones();
      notificacionStore.loadNotificacionesAll();
      $q.notify({
        message: data,
        icon: "announcement",
      });
    });

    connection
      .start()
      .then(() => {
        console.log("connected");
      })
      .catch((err) => {
        console.log(err);
      });

    const show = () => {
      $q.bottomSheet({
        message: "Aplicaciones",
        grid: true,
        actions: apps.value,
      }).onOk((action) => {
        if (action.label == "Cerrar sesión") {
          localStorage.clear();
          window.location = "http://sistema.ieenayarit.org:9271?return=false";
        } else if (action.label == "Ir a universo") {
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

    const loadMenu = async () => {
      $q.loading.show();
      await authStore.loadSistemas();
      await authStore.loadModulos();
      await authStore.loadPerfil();
      await authStore.loadDatosEmp();
      await authStore.loadRolEmp();
      //console.log("Estos son los modulos", modulos.value);
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
        }
      });
      $q.loading.hide();
    };

    return {
      leftDrawerOpen,
      menuPasesList,
      usuario,
      show,
      no_notificaciones,
      notificaciones,
      notificaciones_all,
      detalle,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
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
