<template>
  <div class="row">
    <div class="col">
      <q-table
        :grid="$q.screen.xs"
        :visible-columns="visisble_columns"
        :rows="solicitudes_Filtrado"
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
                  <q-item-section>
                    <q-item-label class="text-bold"
                      >{{ col.label }}:</q-item-label
                    >
                  </q-item-section>
                  <q-item-section class="flex-center">
                    <div v-if="col.name === 'id'">
                      <q-btn
                        v-if="modulo.actualizar"
                        flat
                        round
                        color="purple-ieen"
                        icon="check_circle"
                        @click="aceptar(col.value)"
                      >
                        <q-tooltip>Aceptar pase</q-tooltip>
                      </q-btn>
                      <q-btn
                        v-if="modulo.eliminar"
                        flat
                        round
                        color="purple-ieen"
                        icon="cancel"
                        @click="rechazar(col.value)"
                      >
                        <q-tooltip>Rechazar pase</q-tooltip>
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
                    <div v-else-if="col.name == 'estatus'">
                      <q-badge
                        color="orange"
                        text-color="white"
                        :label="col.value"
                      >
                        <q-icon name="warning" color="white" />
                      </q-badge>
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
                  v-if="modulo.actualizar"
                  flat
                  round
                  color="purple-ieen"
                  icon="check_circle"
                  @click="aceptar(col.value)"
                >
                  <q-tooltip>Aceptar pase</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="modulo.eliminar"
                  flat
                  round
                  color="purple-ieen"
                  icon="cancel"
                  @click="rechazar(col.value)"
                >
                  <q-tooltip>Rechazar pase</q-tooltip>
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
              <div v-else-if="col.name == 'estatus'">
                <q-badge color="orange" text-color="white" :label="col.value">
                  <q-icon name="warning" color="white" />
                </q-badge>
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
import { ref } from "vue";
import { useAuthStore } from "../../../stores/auth_store";
import { useSolicitudPaseStore } from "../../../stores/solicitudes_Pase_store";
import { useRegistroPaseStore } from "src/stores/registro_Pase_store";

const $q = useQuasar();
const solicitudStore = useSolicitudPaseStore();
const pasesStore = useRegistroPaseStore();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const { solicitudes_Filtrado } = storeToRefs(solicitudStore);

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
    label: "Acciones",
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
  rowsPerPage: 5,
  sortBy: "name",
  descending: false,
});

const filter = ref("");

const visualizar = async (id) => {
  pasesStore.loadPaseConsulta(id);
  pasesStore.actualizarConsulta(true);
};

const aceptar = async (id) => {
  $q.dialog({
    title: "Aceptar pase",
    message: "¿Está seguro de aceptar el pase?",
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
      label: "Regresar",
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
    const resp = await solicitudStore.aceptarSolicitud(id);
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
      solicitudStore.actualizarCargar(true);
    } else {
      $q.loading.hide();
      $q.notify({
        type: "negative",
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
    }
  });
};

const rechazar = async (id) => {
  $q.dialog({
    title: "Rechazar pase",
    message: "¿Está seguro de rechazar el pase?",
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
      label: "Regresar",
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
    const resp = await solicitudStore.rechazarSolicitud(id);
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
      solicitudStore.actualizarCargar(true);
    } else {
      $q.loading.hide();
      $q.notify({
        type: "negative",
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
