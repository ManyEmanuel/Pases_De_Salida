<template>
  <div class="row">
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
                  icon="search"
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
import { useQuasar } from "quasar";
import { useAuthStore } from "src/stores/auth_store";
import ValeJustificante from "src/helpers/ValeJustificante";
//-----------------------------------------------------------

const $q = useQuasar();
const justificanteStore = useJustificanteStore();
const { justificantes } = storeToRefs(justificanteStore);
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const activar_pdf = ref(false);

//-----------------------------------------------------------

onBeforeMount(() => {
  justificanteStore.loadJustificantes();
});

//-----------------------------------------------------------

const columns = [
  {
    name: "justificante_Id",
    align: "center",
    label: "Acciones",
    field: "justificante_Id",
    sortable: false,
  },
  {
    name: "folio",
    align: "center",
    label: "Folio",
    field: "folio",
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
    name: "estatus",
    align: "center",
    label: "Estatus",
    field: "estatus",
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
];

const pagination = ref({
  page: 1,
  rowsPerPage: 25,
  sortBy: "name",
  descending: false,
});

const filter = ref("");

const visible_columns = [
  "justificante_Id",
  "folio",
  "solicitante",
  "responsable_Area",
  "capturista",
  "area",
  "estatus",
  "fecha_Creacion",
  "fecha_Aprobacion_Rechazo",
];
//-----------------------------------------------------------

const cancelar = async (id) => {
  $q.dialog({
    title: "Cancelar justificante",
    message: "Al aceptar, se cancelará el justificante",
    icon: "Warning",
    persistent: true,
    transitionShow: "scale",
    transitionHide: "scale",
    ok: {
      color: "positive",
      label: "Si, Aceptar",
    },
    cancel: {
      color: "negative",
      label: "No cancelar",
    },
  }).onOk(async () => {
    $q.loading.show();
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
  $q.loading.show();
  await justificanteStore.loadJustificante(id);
  await justificanteStore.loadDetalleJustificantes(id);
  justificanteStore.actualizarModal(true);
  justificanteStore.updateEditar(true);
  justificanteStore.updateEditarDetalle(true);
  justificanteStore.updateVisualizar(false);
  $q.loading.hide();
};

const visualizar = async (id) => {
  $q.loading.show();
  await justificanteStore.loadJustificante(id);
  await justificanteStore.loadDetalleJustificantes(id);
  justificanteStore.actualizarModal(true);
  justificanteStore.updateEditar(false);
  justificanteStore.updateVisualizar(true);
  $q.loading.hide();
};

const imprimir = async (id) => {
  let resp = null;
  $q.loading.show();
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
</script>

<style></style>
