<template>
  <div class="row q-pr-lg q-pl-lg">
    <div class="col">
      <q-table
        :visible-columns="visisble_columns"
        :rows="pasesGeneral"
        :columns="columns"
        :filter="filter"
        :loading="loading"
        :pagination="pagination"
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
              <div v-else-if="col.name == 'estatus'">
                <q-badge
                  :color="col.value == 'Aprobado' ? 'green' : 'red'"
                  text-color="white"
                  :label="col.value"
                >
                  <q-icon
                    :name="col.value == 'Aprobado' ? 'done' : 'close'"
                    color="white"
                  />
                </q-badge>
              </div>
              <div v-else-if="col.name == 'asunto'">
                <label>{{ col.value }}</label>
                <q-tooltip
                  :offset="[10, 10]"
                  v-if="col.value.length != props.row.asunto_Completo.length"
                >
                  {{ props.row.asunto_Completo }}
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
import { useQuasar } from "quasar";
import { onBeforeMount, ref } from "vue";
import { useAuthStore } from "../../../stores/auth_store";
import { useRegistroGeneralStore } from "src/stores/registro_General_store";
import { useRegistroPaseStore } from "../../../stores/registro_Pase_store";

const $q = useQuasar();
const generalStore = useRegistroGeneralStore();
const pasesStore = useRegistroPaseStore();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const { pasesGeneral } = storeToRefs(generalStore);

onBeforeMount(() => {
  cargarData();
});

const columns = [
  {
    name: "folio",
    align: "center",
    label: "Folio del pase",
    field: "folio",
    sortable: true,
  },
  {
    name: "estatus",
    align: "center",
    label: "Estatus del pase",
    field: "estatus",
    sortable: true,
  },
  {
    name: "fechaSolicitud",
    align: "center",
    label: "Fecha del pase",
    field: "fechaSolicitud",
    sortable: true,
  },
  {
    name: "tipo_Pase",
    align: "center",
    label: "Tipo de pase",
    field: "tipo_Pase",
    sortable: true,
  },
  {
    name: "tipo_Asunto",
    align: "center",
    label: "Asunto del pase",
    field: "tipo_Asunto",
    sortable: true,
  },
  {
    name: "asunto",
    align: "center",
    label: "Motivo de pase",
    field: "asunto",
    sortable: true,
  },
  {
    name: "asunto_Completo",
    align: "center",
    label: "Motivo de pase",
    field: "asunto_Completo",
    sortable: true,
  },
  {
    name: "solicitante",
    align: "center",
    label: "Solicitante",
    field: "solicitante",
    sortable: true,
  },
  {
    name: "capturista",
    align: "center",
    label: "Quien tramita",
    field: "capturista",
    sortable: true,
  },

  {
    name: "id",
    align: "center",
    label: "Opciones",
    field: "id",
    sortable: false,
  },
];

const visisble_columns = [
  "folio",
  "fechaSolicitud",
  "estatus",
  "tipo_Pase",
  "tipo_Asunto",
  "asunto",
  "solicitante",
  "capturista",
  "id",
];

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  sortBy: "name",
  descending: false,
});
const filter = ref("");

const cargarData = async () => {
  await generalStore.loadPasesGeneral();
  await generalStore.loadAreasList();
};

const visualizar = async (id) => {
  pasesStore.loadPaseConsulta(id);
  pasesStore.actualizarConsulta(true);
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
