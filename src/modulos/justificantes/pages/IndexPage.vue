<template>
  <q-page padding>
    <div class="row">
      <div class="col">
        <div class="q-pa-md q-gutter-sm">
          <q-breadcrumbs>
            <q-breadcrumbs-el icon="home" to="/" />
            <q-breadcrumbs-el
              label="Registro de justificantes"
              icon="library_books"
            />
          </q-breadcrumbs>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div class="text-right q-pa-md items-start q-gutter-md">
          <q-btn
            v-if="modulo == null ? false : modulo.registrar"
            type="button"
            class="q-ma-sm"
            color="purple-ieen"
            icon-right="add_circle_outline"
            label="Nuevo"
            @click="actualizarModal(true)"
          />
        </div>
      </div>
    </div>
    <q-btn @click="descargar()">Descargar</q-btn>
    <ModalCompVue />
    <TablaComp />
  </q-page>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { store } from "quasar/wrappers";
import { useJustificanteStore } from "src/stores/justificantes_store";
import { onBeforeMount } from "vue";
import { useAuthStore } from "../../../stores/auth_store";
import ModalCompVue from "../components/ModalComp.vue";
import TablaComp from "../components/TablaComp.vue";
import ValeJustificante from "../../../helpers/ValeJustificante";

const $q = useQuasar();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const siglas = "PS-REG-JUS";
const justificanteStore = useJustificanteStore();

onBeforeMount(() => {
  leerPermisos();
});

const leerPermisos = async () => {
  $q.loading.show();
  await authStore.loadModulo(siglas);
  $q.loading.hide();
};

const actualizarModal = (valor) => {
  $q.loading.show();
  justificanteStore.actualizarModal(valor);
  $q.loading.hide();
};

const descargar = async () => {
  ValeJustificante();
};
</script>

<style></style>
