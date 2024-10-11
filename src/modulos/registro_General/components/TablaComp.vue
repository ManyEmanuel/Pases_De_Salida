<template>
  <div class="row">
    <div class="col">
      <q-table
        :grid="$q.screen.xs"
        :rows="
          props.tipo == 'pases'
            ? pasesGeneralFiltrado
            : list_Justificantes_Todos_Filtrado
        "
        :columns="props.tipo == 'pases' ? columnsPases : columnsJustificantes"
        :filter="filter"
        :pagination="pagination"
        :rows-per-page-options="[5, 10, 15, 20, 25, 50]"
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
        <!--TEMPLATE SCREEN XS-->
        <template v-if="$q.screen.xs" v-slot:item="props">
          <div
            class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
          >
            <q-card bordered class="no-shadow">
              <q-list dense>
                <q-item v-for="col in props.cols" :key="col.name">
                  <q-item-section>
                    <q-item-label class="text-bold"
                      >{{ col.label }}:</q-item-label
                    >
                  </q-item-section>
                  <q-item-section class="flex-center">
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
                        :color="
                          col.value == 'Aprobado'
                            ? 'green'
                            : col.value == 'Pendiente'
                            ? 'orange'
                            : 'red'
                        "
                        text-color="white"
                        :label="col.value"
                      >
                        <q-icon
                          :name="
                            col.value == 'Aprobado'
                              ? 'done'
                              : col.value == 'Pendiente'
                              ? 'warning'
                              : 'close'
                          "
                          color="white"
                        />
                      </q-badge>
                    </div>
                    <div v-else-if="col.name == 'asunto'">
                      <label>{{ col.value }}</label>
                      <q-tooltip
                        :offset="[10, 10]"
                        v-if="
                          col.value.length != props.row.asunto_Completo.length
                        "
                      >
                        {{ props.row.asunto_Completo }}
                      </q-tooltip>
                    </div>
                    <div v-else-if="col.name == 'area'">
                      <label>{{ col.value }}</label>
                      <q-tooltip
                        :offset="[10, 10]"
                        v-if="
                          col.value.length != props.row.area_Completa.length
                        "
                      >
                        {{ props.row.area_Completa }}
                      </q-tooltip>
                    </div>
                    <label v-else-if="col.name == 'folio'" class="text-bold">{{
                      col.value
                    }}</label>
                    <label v-else>{{ col.value }}</label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </div>
        </template>
        <!--TEMPLATE SCREEN DESKTOP-->
        <template v-else v-slot:body="props">
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
                  :color="
                    col.value == 'Aprobado'
                      ? 'green'
                      : col.value == 'Pendiente'
                      ? 'orange'
                      : 'red'
                  "
                  text-color="white"
                  :label="col.value"
                >
                  <q-icon
                    :name="
                      col.value == 'Aprobado'
                        ? 'done'
                        : col.value == 'Pendiente'
                        ? 'warning'
                        : 'close'
                    "
                    color="white"
                  />
                </q-badge>
              </div>
              <div v-else-if="col.name == 'asunto'">
                <label>{{ col.value }}</label>
                <q-tooltip
                  :offset="[10, 10]"
                  v-if="
                    col.value != null &&
                    col.value.length != props.row.asunto_Completo.length
                  "
                >
                  {{ props.row.asunto_Completo }}
                </q-tooltip>
              </div>
              <div v-else-if="col.name == 'area'">
                <label>{{ col.value }}</label>
                <q-tooltip
                  :offset="[10, 10]"
                  v-if="
                    col.value != null &&
                    col.value.length != props.row.area_Completa.length
                  "
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
import { useQuasar } from "quasar";
import { ref, watch } from "vue";
import { useRegistroGeneralStore } from "src/stores/registro_General_store";
import { useRegistroPaseStore } from "../../../stores/registro_Pase_store";
import { useSolicitudJustificanteStore } from "src/stores/solicitudes_Justificantes_store";
import { useJustificanteStore } from "src/stores/justificantes_store";

//-----------------------------------------------------------

const $q = useQuasar();
const generalStore = useRegistroGeneralStore();
const pasesStore = useRegistroPaseStore();
const solicitudesJustificantesStore = useSolicitudJustificanteStore();
const justificantesStore = useJustificanteStore();
const { pasesGeneralFiltrado } = storeToRefs(generalStore);
const { list_Justificantes_Todos_Filtrado } = storeToRefs(
  solicitudesJustificantesStore
);
const props = defineProps({
  tipo: {
    type: String,
  },
});

//-----------------------------------------------------------

const visualizar = async (id) => {
  if (props.tipo == "pases") {
    await pasesStore.loadPaseConsulta(id);
    pasesStore.actualizarConsulta(true);
  } else {
    await justificantesStore.loadJustificante(id);
    await justificantesStore.loadDetalleJustificantes(id);
    justificantesStore.updateVisualizar(true);
    justificantesStore.actualizarModal(true);
  }
};

const columnsPases = [
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
  },
  {
    name: "solicitante",
    align: "center",
    label: "Solicitante",
    field: "solicitante",
    sortable: true,
  },
  {
    name: "area",
    align: "center",
    label: "Área",
    field: "area",
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
    name: "id",
    align: "center",
    label: "Acciones",
    field: "id",
    sortable: false,
  },
];

const columnsJustificantes = [
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
    name: "area",
    align: "center",
    label: "Área",
    field: "area",
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
const pagination = ref({
  page: 1,
  rowsPerPage: 5,
  sortBy: "name",
  descending: false,
});
const filter = ref("");
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
