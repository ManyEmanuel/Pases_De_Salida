<template>
  <div class="row">
    <div class="col">
      <q-table
        :rows="justificantes"
        :columns="columns"
        :filter="filter"
        :loading="loading"
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
              <div v-if="col.name === 'justificante_Id'">
                <q-btn
                  flat
                  round
                  color="purple-ieen"
                  icon="edit"
                  @click="editar(col.value)"
                >
                  <q-tooltip>Editar justificante</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  color="purple-ieen"
                  icon="cancel"
                  @click="cancelar(col.value)"
                >
                  <q-tooltip>Cancelar justificante</q-tooltip>
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
import { onBeforeMount, ref } from "vue";
import { useJustificanteStore } from "src/stores/justificantes_store";
import { storeToRefs } from "pinia";

const justificanteStore = useJustificanteStore();
const { justificantes } = storeToRefs(justificanteStore);

onBeforeMount(() => {
  justificanteStore.loadJustificantes();
});
const columns = [
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
    label: "Responsable area",
    field: "responsable_Area",
    sortable: false,
  },

  {
    name: "capturista",
    align: "center",
    label: "Campturista",
    field: "capturista",
    sortable: false,
  },
  {
    name: "area",
    align: "center",
    label: "Area",
    field: "area",
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
    label: "Fecha de aprobacion o rechazo",
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
  //********** */
  page: 1,
  rowsPerPage: 25,
  sortBy: "name",
  descending: false,
});

const filter = ref("");
</script>

<style></style>
