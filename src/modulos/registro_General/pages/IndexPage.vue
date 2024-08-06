<template>
  <q-page>
    <div class="row bg-grey-2">
      <div class="col-9">
        <div class="q-pa-md q-gutter-sm">
          <div class="text-gray-ieen-1 text-h6">Registro general de pases</div>
          <q-breadcrumbs>
            <template v-slot:separator>
              <q-icon size="1.5em" name="chevron_right" color="primary" />
            </template>
            <q-breadcrumbs-el icon="home" label="Inicio" to="/" />
            <q-breadcrumbs-el
              class="text-grey-7"
              label="Registro general de pases"
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
            icon-right="search"
            label="Filtrar"
            @click="actualizarModal(true)"
          />
          <q-btn
            v-if="modulo == null ? false : modulo.registrar"
            type="button"
            class="q-ma-sm"
            color="purple-ieen"
            label="Ver todos"
            @click="generalStore.loadPasesGeneral()"
          />
          <q-btn
            round
            class="q-ma-sm"
            color="purple-ieen"
            icon="picture_as_pdf"
            @click="crearReporte()"
          >
            <q-tooltip
              >Generar reporte con la información de la tabla</q-tooltip
            >
          </q-btn>
        </div>
      </div>
    </div>
    <TablaComp v-if="modulo == null ? false : modulo.leer" />
    <ModalConsulta />
    <ModalFiltro />
  </q-page>
</template>
<script setup>
import { useQuasar, QSpinnerFacebook } from "quasar";
import { useAuthStore } from "../../../stores/auth_store";
import { onBeforeMount } from "vue";
import { storeToRefs } from "pinia";
import { useRegistroGeneralStore } from "../../../stores/registro_General_store";
import TablaComp from "../components/TablaComp.vue";
import ModalConsulta from "src/modulos/registro_Pase/components/ModalConsulta.vue";
import ModalFiltro from "../components/ModalFiltro.vue";

const $q = useQuasar();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const generalStore = useRegistroGeneralStore();
const siglas = "PS-REG-GEN";
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

const crearReporte = async () => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  let resp = await generalStore.createReporte();
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
  generalStore.actualizarModalFiltro(valor);
  $q.loading.hide();
};
</script>
