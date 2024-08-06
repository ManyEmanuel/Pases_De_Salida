<template>
  <div class="row q-pr-lg q-pl-lg">
    <div class="col">
      <q-table
        :visible-columns="visible_columns"
        :rows="justificantes"
        :columns="columns"
        :filter="filter"
        :pagination="pagination"
        row-key="id"
        rows-per-page-label="Filas por pagina"
        no-data-label="No hay registros"
        class="my-sticky-last-column-table"
      >
        <template v-slot:top-right>
          <q-input
            borderless
            dense
            debounce="300"
            v-model="filter"
            placeholder="Buscar..."
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <div v-if="col.name === 'justificante_Id'">
                <q-btn
                  v-show="modulo.leer && props.row.estatus != 'Pendiente'"
                  flat
                  round
                  color="purple-ieen"
                  icon="visibility"
                  @click="visualizar(col.value)"
                >
                  <q-tooltip>Ver justificante</q-tooltip>
                </q-btn>
                <q-btn
                  :disable="activar_pdf"
                  v-show="modulo.leer && props.row.estatus == 'Aprobado'"
                  flat
                  round
                  color="purple-ieen"
                  icon="print"
                  @click="imprimir(col.value)"
                >
                  <q-tooltip>Imprimir justificante</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="modulo.actualizar && props.row.estatus == 'Pendiente'"
                  flat
                  round
                  color="purple-ieen"
                  icon="edit"
                  @click="editar(col.value)"
                >
                  <q-tooltip>Editar justificante</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="modulo.actualizar && props.row.estatus == 'Pendiente'"
                  flat
                  round
                  color="purple-ieen"
                  icon="cancel"
                  @click="cancelar(col.value)"
                >
                  <q-tooltip>Cancelar justificante</q-tooltip>
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
              <label v-else-if="col.name == 'folio'" class="text-bold">{{
                col.value
              }}</label>
              <div v-else-if="col.name === 'estatus'">
                <q-badge
                  :color="
                    col.value == 'Pendiente'
                      ? 'orange'
                      : col.value == 'Aprobado'
                      ? 'green'
                      : 'red'
                  "
                >
                  {{ col.value }}
                  <q-icon
                    :name="
                      col.value == 'Aprobado'
                        ? 'done'
                        : col.value == 'Pendiente'
                        ? 'warning'
                        : 'close'
                    "
                  />
                </q-badge>
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
import { onBeforeMount, ref } from "vue";
import { useJustificanteStore } from "src/stores/justificantes_store";
import { storeToRefs } from "pinia";
import { useQuasar, QSpinnerFacebook } from "quasar";
import { useAuthStore } from "src/stores/auth_store";
import ValeJustificante from "src/helpers/ValeJustificante";

//-----------------------------------------------------------

const $q = useQuasar();
const authStore = useAuthStore();
const justificanteStore = useJustificanteStore();
const { justificantes } = storeToRefs(justificanteStore);
const { modulo } = storeToRefs(authStore);
const activar_pdf = ref(false);

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
  await justificanteStore.loadJustificantes();
  $q.loading.hide();
};

const cancelar = async (id) => {
  $q.dialog({
    title: "Cancelar justificante",
    message: "Al aceptar, se cancelará el justificante",
    icon: "Warning",
    persistent: true,
    transitionShow: "scale",
    transitionHide: "scale",
    ok: {
      color: "secondary",
      label: "Si, Aceptar",
    },
    cancel: {
      color: "red",
      label: "No cancelar",
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
    const resp = await justificanteStore.cancelarJustificante(id);
    if (resp.success) {
      $q.loading.hide();
      $q.notify({
        position: "top-right",
        type: "positive",
        message: resp.data,
      });
      justificanteStore.loadJustificantes();
    } else {
      $q.loading.hide();
      $q.notify({
        position: "top-right",
        type: "negative",
        message: resp.data,
      });
    }
  });
};

const editar = async (id) => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  await justificanteStore.loadJustificante(id);
  await justificanteStore.loadDetalleJustificantes(id);
  justificanteStore.actualizarModal(true);
  justificanteStore.updateEditar(true);
  justificanteStore.updateEditarDetalle(true);
  justificanteStore.updateVisualizar(false);
  $q.loading.hide();
};

const visualizar = async (id) => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  await justificanteStore.loadJustificante(id);
  await justificanteStore.loadDetalleJustificantes(id);
  justificanteStore.actualizarModal(true);
  justificanteStore.updateEditar(false);
  justificanteStore.updateVisualizar(true);
  $q.loading.hide();
};

const imprimir = async (id) => {
  let resp = null;
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  resp = await justificanteStore.loadJustificante(id);
  await justificanteStore.loadDetalleJustificantes(id);
  if (resp.success === true) {
    ValeJustificante();
    activar_pdf.value = true;
    setTimeout(() => {
      activar_pdf.value = false;
      justificanteStore.initJustificante();
    }, 2000);
  }
  $q.loading.hide();
};

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
    name: "justificante_Id",
    align: "center",
    label: "Acciones",
    field: "justificante_Id",
    sortable: false,
  },
];

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  sortBy: "name",
  descending: false,
});

const filter = ref("");

const visible_columns = [
  "justificante_Id",
  "folio",
  "solicitante",
  "responsable_Area",
  "area_Completa",
  "estatus",
  "fecha_Creacion",
  "fecha_Aprobacion_Rechazo",
];
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
