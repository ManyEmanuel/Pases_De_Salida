<template>
  <q-page padding>
    <div class="row">
      <div class="col">
        <div class="q-pa-md q-gutter-sm">
          <q-breadcrumbs>
            <q-breadcrumbs-el icon="home" to="/" />
            <q-breadcrumbs-el
              label="Solicitudes de pase"
              icon="library_books"
            />
          </q-breadcrumbs>
        </div>
      </div>
    </div>
    <div class="row justify-center">
      <q-card class="col">
        <q-tabs
          v-model="tab"
          dense
          align="justify"
          class="text-purple-ieen"
          active-color="purple-ieen-1"
          indicator-color="pink-ieen-1"
        >
          <q-tab name="solicitudes" label="Solicitudes pendientes" />
          <q-tab name="historial" label="Historial de solicitudes" />
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
    <ModalConsulta />
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { useAuthStore } from "../../../stores/auth_store";
import { onBeforeMount, ref } from "vue";
import { storeToRefs } from "pinia";
import TablaSolicitudes from "../components/TablaSolicitudes.vue";
import TablaHistorial from "../components/TablaHistorial.vue";
import ModalConsulta from "../../justificantes/components/ModalComp.vue";

const $q = useQuasar();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const tab = ref("solicitudes");
const siglas = "PS-SOL-PAS";

onBeforeMount(() => {
  leerPermisos();
});

const leerPermisos = async () => {
  $q.loading.show();
  await authStore.loadModulo(siglas);
  $q.loading.hide();
};
</script>
