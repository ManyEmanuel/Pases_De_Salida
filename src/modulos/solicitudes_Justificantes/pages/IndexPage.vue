<template>
  <q-page>
    <div class="row bg-grey-2">
      <div class="col-9">
        <div class="q-pa-md q-gutter-sm">
          <div class="text-gray-ieen-1 text-h6">
            Solicitudes de justificantes
          </div>
          <q-breadcrumbs>
            <template v-slot:separator>
              <q-icon size="1.5em" name="chevron_right" color="primary" />
            </template>
            <q-breadcrumbs-el icon="home" label="Inicio" to="/" />
            <q-breadcrumbs-el
              class="text-grey-7"
              label="Solicitudes de justificantes"
            />
          </q-breadcrumbs>
        </div>
      </div>
    </div>
    <div class="row justify-center q-pa-lg">
      <q-card class="col">
        <q-tabs
          v-model="tab"
          dense
          align="justify"
          class="text-grey"
          active-color="purple-ieen"
          indicator-color="purple-ieen"
        >
          <q-tab
            icon="pending"
            name="solicitudes"
            label="Solicitudes pendientes"
          />
          <q-tab
            icon="manage_search"
            name="historial"
            label="Historial de solicitudes"
          />
        </q-tabs>
        <q-separator />
        <q-tab-panels v-model="tab" animated class="text-right">
          <q-tab-panel name="solicitudes">
            <TablaSolicitudes />
          </q-tab-panel>
          <q-tab-panel name="historial">
            <TablaHistorial />
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
    <ModalComp />
  </q-page>
</template>

<script setup>
import { useQuasar, QSpinnerFacebook } from "quasar";
import { onBeforeMount, ref } from "vue";
import { useAuthStore } from "../../../stores/auth_store";
import TablaSolicitudes from "../components/TablaSolicitudes.vue";
import TablaHistorial from "../components/TablaHistorial.vue";
import ModalComp from "../components/ModalComp.vue";

//-----------------------------------------------------------

const $q = useQuasar();
const tab = ref("solicitudes");
const authStore = useAuthStore();
const siglas = "PS-MIS-JUS";

//-----------------------------------------------------------

onBeforeMount(() => {
  leerPermisos();
});

//-----------------------------------------------------------

const leerPermisos = async () => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  await authStore.loadModulo(siglas);
  $q.loading.hide();
};
</script>
