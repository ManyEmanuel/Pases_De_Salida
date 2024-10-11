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
          <q-tab
            v-if="menuPasesList.some((element) => element == 'PS-REPORTES')"
            icon="density_small"
            name="reporte"
            label="Reporte general"
          />
          <q-tab
            v-if="menuPasesList.some((element) => element == 'PS-INTERMEDIO')"
            icon="drag_handle"
            name="intermedio"
            label="Pases intermedios"
          />
        </q-tabs>
        <q-separator />
        <q-tab-panels v-model="tab" animated class="text-right">
          <q-tab-panel
            v-if="menuPasesList.some((element) => element == 'PS-REPORTES')"
            name="reporte"
          >
            <ReporteComp :tipo="'pases'" />
          </q-tab-panel>
          <q-tab-panel
            v-if="menuPasesList.some((element) => element == 'PS-INTERMEDIO')"
            name="intermedio"
          >
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
const { modulos } = storeToRefs(authStore);
const tab = ref("reporte");
const menuPasesList = ref([]);
const tipo = ref("Todos");
const tipos = ref(["Todos", "Pases de salida", "Justificantes"]);
const buscar_Por = ref("año");
const rango_Fecha = ref(null);
const textoFecha = ref(null);
const myLocale = {
  days: "Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado".split("_"),
  daysShort: "Dom_Lun_Mar_Mié_Jue_Vie_Sáb".split("_"),
  months:
    "Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre".split(
      "_"
    ),
  monthsShort: "Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic".split("_"),
  firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
  format24h: true,
  pluralDay: "dias",
};
//-----------------------------------------------------------
//Get fecha actual
const newDate = new Date();
const year = ref(newDate.getFullYear());
const month = String(newDate.getMonth() + 1).padStart(2, "0");
const day = String(newDate.getDate()).padStart(2, "0");
const dateActual = ref(`${year.value}/${month}/${day}`);
const date = ref({ from: `${year.value}/01/01`, to: `${year.value}/12/31` });
const años = ref([]);
const startYear = 2022;
//-----------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

//-----------------------------------------------------------

const cargarData = async () => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  await authStore.loadModulos();
  modulos.value.forEach((element) => {
    switch (element.siglas_Modulo) {
      case "PS-REPORTES":
        menuPasesList.value.push("PS-REPORTES");
        break;
      case "PS-INTERMEDIO":
        menuPasesList.value.push("PS-INTERMEDIO");
        break;
    }
  });
  if (menuPasesList.value.some((element) => element == "PS-REPORTES")) {
    tab.value = "reporte";
  } else {
    tab.value = "intermedio";
  }
  await solicitudesJustificantesStore.loadJustificantesTodos();
  $q.loading.hide();
};
</script>
