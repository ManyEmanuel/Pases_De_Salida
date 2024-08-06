<template>
  <q-page>
    <div class="row bg-grey-2">
      <div class="col-9">
        <div class="q-pa-md q-gutter-sm">
          <div class="text-gray-ieen-1 text-h6">Registro de justificantes</div>
          <q-breadcrumbs>
            <template v-slot:separator>
              <q-icon size="1.5em" name="chevron_right" color="primary" />
            </template>
            <q-breadcrumbs-el icon="home" label="Inicio" to="/" />
            <q-breadcrumbs-el class="text-grey-7" label="Mis solicitudes" />
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
    <ModalCompVue />
    <TablaComp />
  </q-page>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useQuasar, QSpinnerFacebook } from "quasar";
import { useJustificanteStore } from "src/stores/justificantes_store";
import { onBeforeMount } from "vue";
import { useAuthStore } from "../../../stores/auth_store";
import ModalCompVue from "../components/ModalComp.vue";
import TablaComp from "../components/TablaComp.vue";

//-----------------------------------------------------------

const $q = useQuasar();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const siglas = "PS-REG-JUS";
const justificanteStore = useJustificanteStore();

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

const actualizarModal = (valor) => {
  justificanteStore.actualizarModal(valor);
};
</script>
