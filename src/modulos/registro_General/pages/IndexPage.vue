<template>
  <q-page padding>
    <div class="row">
      <div class="col">
        <div class="q-pa-md q-gutter-sm">
          <q-breadcrumbs>
            <q-breadcrumbs-el icon="home" to="/" />
            <q-breadcrumbs-el
              label="Registro general de pases"
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
import { useQuasar } from "quasar";
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
  $q.loading.show();
  await authStore.loadModulo(siglas);
  $q.loading.hide();
};

const crearReporte = async () => {
  $q.loading.show();
  let resp = await generalStore.createReporte();
  $q.loading.hide();
};
const actualizarModal = (valor) => {
  $q.loading.show();
  generalStore.actualizarModalFiltro(valor);
  $q.loading.hide();
};
</script>
