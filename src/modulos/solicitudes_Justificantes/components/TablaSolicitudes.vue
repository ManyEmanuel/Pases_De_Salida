<template>
  <div class="row">
    <div class="col">
      <q-table
        class="my-sticky-last-column-table"
        :visible-columns="visible_columns"
        :rows="solicitudes"
        :columns="columns"
        :filter="filter"
        :pagination="pagination"
        row-key="id"
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
                  v-if="modulo.actualizar"
                  flat
                  round
                  color="purple-ieen"
                  icon="check_circle"
                  @click="aceptar(col.value)"
                >
                  <q-tooltip>Aceptar justificante</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="modulo.eliminar"
                  flat
                  round
                  color="purple-ieen"
                  icon="cancel"
                  @click="rechazar(col.value)"
                >
                  <q-tooltip>Rechazar justificante</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="modulo.leer"
                  flat
                  round
                  color="purple-ieen"
                  icon="search"
                  @click="visualizar(col.value)"
                >
                  <q-tooltip>Ver justificante</q-tooltip>
                </q-btn>
              </div>
              <div v-else-if="col.name == 'estatus'">
                <q-badge color="orange" text-color="white" :label="col.value">
                  <q-icon name="warning" color="white" />
                </q-badge>
              </div>
              <div v-else-if="col.name == 'area'">
                <label>{{ col.value }}</label>
                <q-tooltip
                  :offset="[10, 10]"
                  v-if="col.value.length != props.row.area_Completa.length"
                >
                  {{ props.row.area_Completa }}
                </q-tooltip>
              </div>
              <label v-else-if="col.name == 'folio'" class="text-bold">{{
                col.value
              }}</label>
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
import { useQuasar, QSpinnerFacebook } from "quasar";
import { useJustificanteStore } from "src/stores/justificantes_store";
import { onBeforeMount, ref } from "vue";
import { useAuthStore } from "../../../stores/auth_store";
import { useSolicitudJustificanteStore } from "../../../stores/solicitudes_Justificantes_store";

//-----------------------------------------------------------

const $q = useQuasar();
const solicitudJustificanteStore = useSolicitudJustificanteStore();
const justificanteStore = useJustificanteStore();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const { solicitudes } = storeToRefs(solicitudJustificanteStore);

//-----------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

//-----------------------------------------------------------

const cargarData = async () => {
  await solicitudJustificanteStore.loadSolicitudesJustificantes();
};

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
    name: "area_Completa",
    align: "center",
    label: "Área",
    field: "area_Completa",
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
  await justificanteStore.loadJustificante(id);
  await justificanteStore.loadDetalleJustificantes(id);
  solicitudJustificanteStore.actualizarModal(true);
};

const aceptar = async (id) => {
  $q.dialog({
    title: "Aceptar justificante",
    message: "¿Está seguro de aceptar el justificante?",
    icon: "Warning",
    persistent: true,
    transitionShow: "scale",
    transitionHide: "scale",
    ok: {
      color: "secondary",
      label: "¡Sí!, aceptar",
    },
    cancel: {
      color: "red",
      label: "Cancelar",
    },
  }).onOk(async () => {
    $q.loading.show({
      spinner: QSpinnerFacebook,
      spinnerColor: "purple-ieen",
      spinnerSize: 140,
      backgroundColor: "purple-3",
      message: "Espere un momento, por favor...",
      messageColor: "black",
    });
    const resp = await solicitudJustificanteStore.aprobarJustificante(id);
    if (resp.success == true) {
      $q.loading.hide();
      $q.notify({
        type: "positive",
        message: resp.data,
        position: "top-right",
        actions: [
          {
            icon: "close",
            color: "white",
            round: true,
            handler: () => {},
          },
        ],
      });
      solicitudJustificanteStore.loadSolicitudesJustificantes();
    } else {
      $q.loading.hide();
      $q.notify({
        position: "top-right",
        type: "negative",
        message: resp.data,
        actions: [
          {
            icon: "close",
            color: "white",
            round: true,
            handler: () => {},
          },
        ],
      });
    }
  });
};

const rechazar = async (id) => {
  $q.dialog({
    title: "Rechazar justificante",
    message: "¿Está seguro de rechazar el justificante?",
    icon: "Warning",
    persistent: true,
    transitionShow: "scale",
    transitionHide: "scale",
    ok: {
      color: "secondary",
      label: "¡Sí!, rechazar",
    },
    cancel: {
      color: "red",
      label: "Cancelar",
    },
  }).onOk(async () => {
    $q.loading.show({
      spinner: QSpinnerFacebook,
      spinnerColor: "purple-ieen",
      spinnerSize: 140,
      backgroundColor: "purple-3",
      message: "Espere un momento, por favor...",
      messageColor: "black",
    });
    const resp = await solicitudJustificanteStore.rechazarJustificante(id);
    if (resp.success == true) {
      $q.loading.hide();
      $q.notify({
        position: "top-right",
        type: "positive",
        message: resp.data,
        actions: [
          {
            icon: "close",
            color: "white",
            round: true,
            handler: () => {},
          },
        ],
      });
      solicitudJustificanteStore.loadSolicitudesJustificantes();
    } else {
      $q.loading.hide();
      $q.notify({
        position: "top-right",
        type: "negative",
        message: resp.data,
        actions: [
          {
            icon: "close",
            color: "white",
            round: true,
            handler: () => {},
          },
        ],
      });
    }
  });
};
</script>
<style lang="sass">
.my-sticky-last-column-table
  thead tr:last-child th:last-child
    /* bg color is important for th; just specify one */
    background-color: white

  td:last-child
    background-color: white

  th:last-child,
  td:last-child
    position: sticky
    right: 0
    z-index: 1
</style>
