<template>
  <div class="row">
    <div class="col">
      <q-table
        :visible-columns="visisble_columns"
        :rows="historial"
        :columns="columns"
        :filter="filter"
        :loading="loading"
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
              <div
                v-if="
                  col.name === 'id' &&
                  (props.row.estatus == 'Rechazado' ||
                    props.row.estatus == 'Cancelado')
                "
              >
                <q-btn
                  v-if="modulo.eliminar"
                  flat
                  round
                  color="purple-ieen"
                  icon="search"
                  @click="visualizar(col.value)"
                >
                  <q-tooltip>Ver pase</q-tooltip>
                </q-btn>
              </div>
              <div
                v-else-if="col.name === 'id' && props.row.estatus == 'Aprobado'"
              >
                <q-btn
                  v-if="modulo.actualizar"
                  flat
                  round
                  color="purple-ieen"
                  icon="print"
                  @click="generarPase(col.value)"
                >
                  <q-tooltip>Imprimir pase</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="modulo.eliminar"
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
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { onBeforeMount, ref } from "vue";
import { useAuthStore } from "../../../stores/auth_store";
import { useSolicitudPaseStore } from "../../../stores/solicitudes_Pase_store";
import { useRegistroPaseStore } from "src/stores/registro_Pase_store";

const $q = useQuasar();
const solicitudStore = useSolicitudPaseStore();
const pasesStore = useRegistroPaseStore();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const { historial } = storeToRefs(solicitudStore);

onBeforeMount(() => {
  solicitudStore.loadHistorial();
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
    name: "fechaSolicitud",
    align: "center",
    label: "Fecha del pase",
    field: "fechaSolicitud",
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
  //********** */
  page: 1,
  rowsPerPage: 25,
  sortBy: "name",
  descending: false,
});

const filter = ref("");

const editar = async (id) => {
  $q.loading.show();
  await pasesStore.loadPase(id);
  pasesStore.updateEditar(true);
  pasesStore.actualizarModal(true);
  $q.loading.hide();
};

const visualizar = async (id) => {
  pasesStore.loadPaseConsulta(id);
  pasesStore.actualizarConsulta(true);
};

const generarPase = async (id) => {
  $q.loading.show();
  let resp = await solicitudStore.crearPase(id);
  let { success, msj } = resp;
  if (success == true) {
    $q.notify({
      type: "positive",
      message: msj,
    });
  } else {
    $q.notify({
      type: "negative",
      message: msj,
    });
  }
  $q.loading.hide();
};
</script>
