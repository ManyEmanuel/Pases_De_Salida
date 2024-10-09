<template>
  <q-page>
    <div class="row bg-grey-1">
      <div class="col-9">
        <div class="q-pa-md q-gutter-sm">
          <div class="text-gray-ieen-1 text-h6">Reportes</div>
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
    <div class="row justify-center q-pa-lg">
      <q-card class="col">
        <q-tabs
          v-model="tab"
          dense
          align="justify"
          class="bg-grey-3 text-grey"
          active-color="purple-ieen"
          indicator-color="purple-ieen"
        >
          <q-tab  v-if="menuPasesList.some((element) =>  element == 'PS-GEN-JUS')" icon="density_small" name="reporte" label="Reporte general" />
          <q-tab
             v-if="menuPasesList.some((element) => element == 'PS-REG-GEN' )"
            icon="drag_handle"
            name="intermedio"
            label="Pases intermedios"
          />
        </q-tabs>
        <q-separator />
        <q-tab-panels v-model="tab" animated class="text-right">
          <q-tab-panel  v-if="menuPasesList.some((element) =>  element == 'PS-GEN-JUS')" name="reporte">
            <ReporteComp :tipo="'pases'" />
          </q-tab-panel>
          <q-tab-panel  v-if="menuPasesList.some((element) => element == 'PS-REG-GEN' )" name="intermedio">
            <PasesIntermedios />
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar, QSpinnerFacebook } from "quasar";
import { onBeforeMount, ref } from "vue";
import { useAuthStore } from "stores/auth_store";
import { storeToRefs } from "pinia";
import { useSolicitudJustificanteStore } from "src/stores/solicitudes_Justificantes_store";
import ReporteComp from "../components/ReporteComp.vue";
import PasesIntermedios from "src/modulos/reportes/components/PasesIntermedios.vue";

//-----------------------------------------------------------

const $q = useQuasar();
const authStore = useAuthStore();
const solicitudesJustificantesStore = useSolicitudJustificanteStore();
const {  modulos } = storeToRefs(authStore);
const tab = ref("reporte");
const menuPasesList = ref([])

//-----------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

//-----------------------------------------------------------



const cargarData = async () => {
  await authStore.loadModulos();

  modulos.value.forEach((element) => {
    switch (element.siglas_Modulo) {
      case "PS-GEN-JUS":
        menuPasesList.value.push("PS-GEN-JUS");
        break;
      case "PS-REG-GEN":
        menuPasesList.value.push("PS-REG-GEN");
        break;

    }
  }); 
  await solicitudesJustificantesStore.loadJustificantesTodos();
};
</script>
