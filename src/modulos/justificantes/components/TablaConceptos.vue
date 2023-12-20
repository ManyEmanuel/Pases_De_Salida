<template>
  <div class="row">
    <div class="col">
      <q-table
        :rows="listaIncidencias"
        :columns="columns"
        :filter="filter"
        :pagination="pagination"
        :visible-columns="columnasVisibles"
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
                <!-- <q-btn
                  v-if="isEditar"
                  flat
                  round
                  color="purple-ieen"
                  icon="edit"
                  @click="editar(col.value)"
                >
                  <q-tooltip>Editar incidencia</q-tooltip>
                </q-btn> -->
                <q-btn
                  flat
                  round
                  color="purple-ieen"
                  icon="cancel"
                  @click="eliminar(col.value)"
                >
                  <q-tooltip>Eliminar incidencia</q-tooltip>
                </q-btn>
              </div>
              <!-- <div
                v-else-if="
                  (isEditar || isVisualizar) && col.name == 'dias_Incidencias'
                "
              >
                <label>{{ col.value }}</label>
                <q-tooltip
                  :offset="[10, 10]"
                  v-if="
                    col.value.length !=
                    props.row['dias_Incidencias_Completo'].length
                  "
                >
                  {{ props.row["dias_Incidencias_Completo"] }}
                </q-tooltip>
              </div>
              <div
                v-else-if="(isEditar || isVisualizar) && col.name == 'motivo'"
              >
                <label>{{ col.value }}</label>
                <q-tooltip
                  :offset="[10, 10]"
                  v-if="col.value.length != props.row['motivo_Completo'].length"
                >
                  {{ props.row["motivo_Completo"] }}
                </q-tooltip>
              </div> -->
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
import { onBeforeMount, ref } from "vue";

//-----------------------------------------------------------

const $q = useQuasar();
const justificanteStore = useJustificanteStore();
const { listaIncidencias, isVisualizar, isEditar } =
  storeToRefs(justificanteStore);
let columnasVisibles = [];

//-----------------------------------------------------------

onBeforeMount(() => {
  cargarColumnas();
});

//-----------------------------------------------------------

const columns = [
  {
    name: "tipo_Justificantes",
    align: "center",
    label: "Concepto",
    field: "tipo_Justificantes",
    sortable: true,
  },
  {
    name: "dias_Incidencias",
    align: "center",
    label: "Fecha",
    field: "dias_Incidencias",
    sortable: true,
  },
  {
    name: "dias_Incidencias_Completo",
    align: "center",
    label: "Fecha",
    field: "dias_Incidencias_Completo",
    sortable: true,
  },
  {
    name: "motivo",
    align: "center",
    label: "Motivo",
    field: "motivo",
    sortable: true,
  },
  {
    name: "motivo_Completo",
    align: "center",
    label: "Motivo",
    field: "motivo_Completo",
    sortable: true,
  },
  {
    name: "id",
    align: "center",
    label: "Acciones",
    field: "id",
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

//-----------------------------------------------------------

const cargarColumnas = async () => {
  if (isVisualizar.value == true) {
    columnasVisibles = ["tipo_Justificantes", "dias_Incidencias", "motivo"];
  } else {
    columnasVisibles = [
      "tipo_Justificantes",
      "dias_Incidencias",
      "motivo",
      "id",
    ];
  }
};

const eliminar = async (id) => {
  $q.dialog({
    title: "Eliminar asignación",
    message: "Al aceptar, se eliminara el detalle de la incidencia",
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
    const resp = await justificanteStore.eliminarDetalleJusitifcante(id);
    if (resp.success) {
      $q.loading.hide();
      $q.notify({
        position: "top-right",
        type: "positive",
        message: resp.data,
      });
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
  await justificanteStore.loadDetalle(id);
  justificanteStore.updateEditarDetalle(true);
  $q.loading.hide();
};

//-----------------------------------------------------------
</script>

<style></style>
