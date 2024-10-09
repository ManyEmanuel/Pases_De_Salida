<template>
  <template v-if="modulo == null">
    <div class="absolute-center">Cargando...</div>
  </template>
  <template v-else>
    <div class="row">
      <div class="col">
        <q-table
          :grid="$q.screen.xs"
          :visible-columns="visible_columns"
          :rows="historial_Filtrado"
          :columns="columns"
          :filter="filter"
          :pagination="pagination"
          :rows-per-page-options="[5, 10, 15, 20, 25, 50]"
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
                    <q-item-section class="text-left">
                      <q-item-label class="text-bold"
                        >{{ col.label }}:</q-item-label
                      >
                    </q-item-section>
                    <q-item-section class="flex-center">
                      <q-btn
                        v-if="col.name == 'vermas'"
                        size="sm"
                        :color="props.expand ? 'grey' : 'purple-ieen'"
                        round
                        dense
                        @click="props.expand = !props.expand"
                        :icon="props.expand ? 'remove' : 'add'"
                      />
                      <div v-else-if="col.name === 'id'">
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
                      <q-item-label
                        class="text-bold"
                        v-else-if="col.name == 'folio'"
                        >{{ col.value }}</q-item-label
                      >
                      <q-item-label v-else>{{ col.value }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-separator v-show="props.expand" />
                  <q-item v-show="props.expand" :props="props">
                    <q-item-label class="text-bold">
                      <b>Indicencia(s):</b>
                      {{ props.row.detalles }}</q-item-label
                    >
                  </q-item>
                </q-list>
              </q-card>
            </div>
          </template>
          <!--TEMPLATE SCREEN DESKTOP-->
          <template v-else v-slot:body="props">
            <q-tr :props="props">
              <q-td auto-width>
                <q-btn
                  size="sm"
                  :color="props.expand ? 'grey' : 'purple-ieen'"
                  round
                  dense
                  @click="props.expand = !props.expand"
                  :icon="props.expand ? 'remove' : 'add'"
                  class="absolute-center"
                />
              </q-td>
              <q-td
                v-for="col in props.cols.filter((x) => x.name !== 'vermas')"
                :key="col.name"
                :props="props"
              >
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
            <q-tr v-show="props.expand" :props="props">
              <q-td colspan="100%">
                <div class="text-left q-pa-xs">
                  <b>Indicencia(s):</b>
                  {{ props.row.detalles }}
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>
  </template>
</template>
<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useQuasar, QSpinnerFacebook } from "quasar";
import { useJustificanteStore } from "src/stores/justificantes_store";
import { useSolicitudJustificanteStore } from "src/stores/solicitudes_Justificantes_store";
import { useAuthStore } from "../../../stores/auth_store";
import ValeJustificante from "src/helpers/ValeJustificante";

//-----------------------------------------------------------

const $q = useQuasar();
const authStore = useAuthStore();
const solicitudJustificanteStore = useSolicitudJustificanteStore();
const justificanteStore = useJustificanteStore();
const { modulo } = storeToRefs(authStore);
const { historial_Filtrado } = storeToRefs(solicitudJustificanteStore);

//-----------------------------------------------------------

const visualizar = async (id) => {
  await justificanteStore.loadJustificante(id);
  await justificanteStore.loadDetalleJustificantes(id);
  justificanteStore.updateVisualizar(true);
  solicitudJustificanteStore.actualizarModal(true);
};

const generarVale = async (id) => {
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
  } else {
    $q.notify({
      position: "top-right",
      type: "negative",
      message: msj,
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
  $q.loading.hide();
};

//-----------------------------------------------------------

const columns = [
  {
    name: "vermas",
    align: "center",
    label: "Ver más",
    sortable: true,
  },
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
    name: "detalles",
    align: "center",
    label: "Detalles",
    field: "detalles",
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
  "vermas",
  "folio",
  "estatus",
  "solicitante",
  "responsable_Area",
  "capturista",
  "area",
  "fecha_Creacion",
  "fecha_Aprobacion_Rechazo",
  "detalles",
  "id",
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
