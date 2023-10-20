<template>
  <div class="row">
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
            <q-date color="purple" v-model="model" range /> </q-popup-proxy
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
              <div v-if="col.name === 'id'">
                <q-btn
                  flat
                  round
                  color="purple-ieen"
                  icon="search"
                  @click="visualizar(col.value)"
                >
                  <q-tooltip>Ver pase</q-tooltip>
                </q-btn>
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
import { useQuasar } from "quasar";
import { useJustificanteStore } from "src/stores/justificantes_store";
import { ref } from "vue";
import ReporteGeneralJustificantes from "../../../helpers/ReportGeneralJustificantes";

//-----------------------------------------------------------

const $q = useQuasar();
const model = ref({ from: "2020/07/08", to: "2020/07/17" });
const justificanteStore = useJustificanteStore();
//-----------------------------------------------------------

const columns = [
  {
    name: "empleado",
    align: "center",
    label: "Empleado",
    field: "empleado",
    sortable: true,
  },
  {
    name: "entrada",
    align: "center",
    label: "Omisión de entrada",
    field: "entrada",
    sortable: true,
  },
  {
    name: "salida",
    align: "center",
    label: "Omisión de salida",
    field: "salida",
    sortable: true,
  },
  {
    name: "comision",
    align: "center",
    label: "Comisión oficial",
    field: "comision",
    sortable: true,
  },
  {
    name: "permuta",
    align: "center",
    label: "Permuta por día laborado",
    field: "permuta",
    sortable: true,
  },
  {
    name: "economico",
    align: "center",
    label: "Permiso por día económico",
    field: "economico",
    sortable: true,
  },
  {
    name: "vacaciones",
    align: "center",
    label: "Vacaciones",
    field: "vacaciones",
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

const crearReporte = async () => {
  await justificanteStore.loadAsignacionesVacaciones();
  $q.loading.show();
  ReporteGeneralJustificantes();
  $q.loading.hide();
};
//-----------------------------------------------------------
</script>
