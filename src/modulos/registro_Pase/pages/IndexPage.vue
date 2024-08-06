<template>
  <q-page>
    <div class="row bg-grey-2">
      <div class="col-9">
        <div class="q-pa-md q-gutter-sm">
          <div class="text-gray-ieen-1 text-h6">Registro de pases</div>
          <q-breadcrumbs>
            <template v-slot:separator>
              <q-icon size="1.5em" name="chevron_right" color="primary" />
            </template>
            <q-breadcrumbs-el icon="home" label="Inicio" to="/" />
            <q-breadcrumbs-el class="text-grey-7" label="Registro de pases" />
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
    <TablaComp v-if="modulo == null ? false : modulo.leer" />
    <ModalComp />
    <ModalConsulta />
  </q-page>
</template>

<script setup>
import { useQuasar, QSpinnerFacebook } from "quasar";
import { useRegistroPaseStore } from "src/stores/registro_Pase_store";
//import { useInstitucionesStore } from "../../../stores/instituciones_store";
import { useAuthStore } from "../../../stores/auth_store";
import { onBeforeMount } from "vue";
import { storeToRefs } from "pinia";
import TablaComp from "../components/TablaComp.vue";
import ModalComp from "../components/ModalComp.vue";
import ModalConsulta from "../components/ModalConsulta.vue";

//import TablaComp from "../components/TablaComp.vue";
//import ModalComp from "../components/ModalComp.vue";

const $q = useQuasar();
const authStore = useAuthStore();
const pasesStore = useRegistroPaseStore();
const { modulo } = storeToRefs(authStore);
const siglas = "PS-REG-PAS";
onBeforeMount(() => {
  leerPermisos();
});

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
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  //pasesStore.loadInformacionPase();
  pasesStore.actualizarModal(valor);
  pasesStore.loadInformacionPase();
  $q.loading.hide();
};
</script>
