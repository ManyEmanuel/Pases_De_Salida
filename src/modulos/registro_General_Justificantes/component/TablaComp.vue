<template>
  <div class="row">
    <div class="text-h6">{{ date.from }} - {{ date.to }}</div>
    <div class="col">
      <div class="text-right q-pa-md items-start q-gutter-md">
        <q-btn
          type="button"
          class="q-ma-sm"
          color="purple-ieen"
          icon-right="calendar_month"
          label="Filtrar"
        >
          <q-tooltip>Filtrar por rango de fechas</q-tooltip>
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date color="purple" v-model="date" range /> </q-popup-proxy
        ></q-btn>
        <q-btn
          round
          class="q-ma-sm"
          color="purple-ieen"
          icon="picture_as_pdf"
          @click="crearReporte()"
        >
          <q-tooltip>Generar reporte con la información de la tabla</q-tooltip>
        </q-btn>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col">
      <q-table
        :rows="listReporte"
        :columns="columns"
        :filter="filter"
        :pagination="pagination"
        rows-per-page-label="Filas por pagina"
        no-data-label="No hay registros"
      >
        <template v-slot:top-right>
          <q-input
            borderless
            dense
            debounce="300"
            v-model="filter"
            placeholder="Buscar.."
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <div v-if="col.name === 'permiso_Economico'">
                {{
                  `${configuracion[0].dias_Economicos - col.value}/${
                    configuracion[0].dias_Economicos
                  }`
                }}
              </div>
              <div v-else-if="col.name === 'vacaciones_P2'">
                {{
                  `${configuracion[0].dias_Segundo_Periodo - col.value}/${
                    configuracion[0].dias_Segundo_Periodo
                  }`
                }}
              </div>

              <label v-else>{{ col.value }}</label>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { useJustificanteStore } from "src/stores/justificantes_store";
import { onBeforeMount, ref, watch } from "vue";
import ReporteGeneralJustificantes from "../../../helpers/ReportGeneralJustificantes";

//-----------------------------------------------------------

const $q = useQuasar();
const justificanteStore = useJustificanteStore();
const { listReporte, configuracion } = storeToRefs(justificanteStore);
const date = ref({});

//-----------------------------------------------------------
onBeforeMount(() => {
  justificanteStore.loadAsignacionesVacaciones();
  listReporte.value = [];
});

watch(date, (val) => {
  cargarTabla(val);
});

const columns = [
  {
    name: "empleado",
    align: "center",
    label: "Empleado",
    field: "empleado",
    sortable: true,
  },
  {
    name: "omision_Entrada",
    align: "center",
    label: "Omisión de entrada",
    field: "omision_Entrada",
    sortable: true,
  },
  {
    name: "omision_Salida",
    align: "center",
    label: "Omisión de salida",
    field: "omision_Salida",
    sortable: true,
  },
  {
    name: "comision_Oficial",
    align: "center",
    label: "Comisión oficial",
    field: "comision_Oficial",
    sortable: true,
  },
  {
    name: "permuta_Laboral",
    align: "center",
    label: "Permuta por día laborado",
    field: "permuta_Laboral",
    sortable: true,
  },
  {
    name: "otros",
    align: "center",
    label: "Otros",
    field: "otros",
    sortable: true,
  },
  {
    name: "permiso_Economico",
    align: "center",
    label: "Permiso por día económico",
    field: "permiso_Economico",
    sortable: true,
  },
  {
    name: "vacaciones_P1",
    align: "center",
    label: "Vacaciones primer periodo",
    field: "vacaciones_P1",
    sortable: true,
  },
  {
    name: "vacaciones_P2",
    align: "center",
    label: "Vacaciones segundo periodo",
    field: "vacaciones_P2",
    sortable: true,
  },
];

const pagination = ref({
  page: 1,
  rowsPerPage: 25,
  sortBy: "name",
  descending: false,
});
const filter = ref("");

const cargarTabla = async (date) => {
  let resp = null;
  $q.loading.show();
  resp = await justificanteStore.reporteJustificantes(date);

  if (resp.success) {
  } else {
    $q.notify({
      position: "top-right",
      type: "negative",
      message: resp.data,
    });
  }
  $q.loading.hide();
};

const crearReporte = async () => {
  if (Object.keys(listReporte.value).length == 0) {
    $q.dialog({
      title: "Atención",
      message: "Seleccione un rango de fechas",
      icon: "Warning",
      persistent: true,
      transitionShow: "scale",
      transitionHide: "scale",
    });
  } else {
    $q.loading.show();
    ReporteGeneralJustificantes(date.value);

    $q.loading.hide();
  }
};
//-----------------------------------------------------------
</script>
