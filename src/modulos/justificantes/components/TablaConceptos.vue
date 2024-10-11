<template>
  <div class="row">
    <div class="col">
      <q-table
        :grid="$q.screen.xs"
        :rows="listaIncidencias"
        :columns="columns"
        :filter="filter"
        :pagination="pagination"
        :visible-columns="columnasVisibles"
        row-key="id"
        rows-per-page-label="Filas por pagina"
        no-data-label="No hay registros"
      >
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
                  <q-item-section>
                    <q-badge
                      v-if="col.name == 'tipo_Justificantes'"
                      color="purple-ieen"
                    >
                      {{ col.value }}
                    </q-badge>
                    <q-btn
                      v-else-if="col.name == 'id'"
                      flat
                      round
                      color="purple-ieen"
                      icon="delete"
                      @click="eliminar(col.value)"
                    >
                      <q-tooltip>Eliminar incidencia</q-tooltip>
                    </q-btn>
                    <q-item-label v-else>{{ col.value }}</q-item-label>
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
                  icon="delete"
                  @click="eliminar(col.value)"
                >
                  <q-tooltip>Eliminar incidencia</q-tooltip>
                </q-btn>
              </div>
              <div v-else-if="col.name == 'tipo_Justificantes'">
                <q-badge color="purple-ieen">
                  {{ col.value }}
                  {{
                    col.value == "Vacaciones"
                      ? `Periodo ${props.row.periodo_Vacacional}`
                      : ""
                  }}
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
import { storeToRefs } from "pinia";
import { useQuasar, QSpinnerFacebook } from "quasar";
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
    title: "Eliminar registro",
    message: "Al aceptar, se eliminará el detalle de la incidencia",
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
    const resp = await justificanteStore.eliminarDetalleJusitifcante(id);
    if (resp.success) {
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

//-----------------------------------------------------------
</script>
