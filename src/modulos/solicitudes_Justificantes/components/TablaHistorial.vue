<template>
  <div class="row">
    <div class="col">
      <q-table
        :visible-columns="visible_columns"
        :rows="historial"
        :columns="columns"
        :filter="filter"
        :pagination="pagination"
        row-key="id"
        rows-per-page-label="Filas por pagina"
        no-data-label="No hay registros"
        class="tamanoCelda"
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
                  v-if="modulo.leer && props.row.estatus != 'Pendiente'"
                  flat
                  round
                  color="purple-ieen"
                  icon="search"
                  @click="visualizar(col.value)"
                >
                  <q-tooltip>Ver justificante</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="modulo.leer && props.row.estatus == 'Aprobado'"
                  flat
                  round
                  color="purple-ieen"
                  icon="print"
                  @click="generarVale(col.value)"
                >
                  <q-tooltip>Imprimir justificante</q-tooltip>
                </q-btn>
              </div>
              <div v-else-if="col.name == 'area'">
                <label>{{ col.value }}</label>
                <q-tooltip
                  :offset="[10, 10]"
                  v-if="col.value.length != props.row['area_Completa'].length"
                >
                  {{ props.row["area_Completa"] }}
                </q-tooltip>
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
import { useSolicitudJustificanteStore } from "src/stores/solicitudes_Justificantes_store";
import { onBeforeMount, ref } from "vue";
import { useAuthStore } from "../../../stores/auth_store";
import ValeJustificante from "src/helpers/ValeJustificante";

//-----------------------------------------------------------

const $q = useQuasar();
const authStore = useAuthStore();
const solicitudJustificanteStore = useSolicitudJustificanteStore();
const justificanteStore = useJustificanteStore();
const { modulo } = storeToRefs(authStore);
const { historial } = storeToRefs(solicitudJustificanteStore);

//-----------------------------------------------------------

onBeforeMount(() => {
  solicitudJustificanteStore.loadHistorialJustificante();
});

//-----------------------------------------------------------

const columns = [
  {
    name: "folio",
    align: "center",
    label: "Folio",
    field: "folio",
    sortable: false,
  },
  {
    name: "estatus",
    align: "center",
    label: "Estatus",
    field: "estatus",
    sortable: false,
  },
  {
    name: "solicitante",
    align: "center",
    label: "Solicitante",
    field: "solicitante",
    sortable: false,
  },
  {
    name: "responsable_Area",
    align: "center",
    label: "Responsable área",
    field: "responsable_Area",
    sortable: false,
  },
  {
    name: "capturista",
    align: "center",
    label: "Capturista",
    field: "capturista",
    sortable: false,
  },
  {
    name: "area",
    align: "center",
    label: "Área",
    field: "area",
    sortable: false,
  },
  {
    name: "fecha_Creacion",
    align: "center",
    label: "Fecha de creación",
    field: "fecha_Creacion",
    sortable: false,
  },
  {
    name: "fecha_Aprobacion_Rechazo",
    align: "center",
    label: "Fecha de aprobación o rechazo",
    field: "fecha_Aprobacion_Rechazo",
    sortable: false,
  },
  {
    name: "id",
    align: "center",
    label: "Acciones",
    field: "id",
    sortable: false,
  },
];

const visible_columns = [
  "folio",
  "estatus",
  "solicitante",
  "responsable_Area",
  "capturista",
  "area",
  "fecha_Creacion",
  "fecha_Aprobacion_Rechazo",
  "id",
];

const pagination = ref({
  page: 1,
  rowsPerPage: 25,
  sortBy: "name",
  descending: false,
});

const filter = ref("");

//-----------------------------------------------------------

const visualizar = async (id) => {
  justificanteStore.loadJustificante(id);
  justificanteStore.loadDetalleJustificantes(id);
  justificanteStore.updateVisualizar(true);
  justificanteStore.actualizarModal(true);
};

const generarVale = async (id) => {
  let resp = null;
  $q.loading.show();
  resp = await justificanteStore.loadJustificante(id);
  await justificanteStore.loadDetalleJustificantes(id);
  if (resp.success === true) {
    ValeJustificante();
  } else {
    $q.notify({
      type: "negative",
      message: msj,
    });
  }
  $q.loading.hide();
};
</script>
