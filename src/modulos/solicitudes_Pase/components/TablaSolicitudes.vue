<template>
  <div class="row">
    <div class="col">
      <q-table
        :rows="solicitudes"
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
const { solicitudes } = storeToRefs(solicitudStore);

onBeforeMount(() => {
  solicitudStore.loadSolicitudes();
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

const pagination = ref({
  //********** */
  page: 1,
  rowsPerPage: 25,
  sortBy: "name",
  descending: false,
});

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
      color: "positive",
      label: "¡Sí!, aceptar",
    },
    cancel: {
      color: "negative",
      label: "Cancelar",
    },
  }).onOk(async () => {
    $q.loading.show();
    const resp = await solicitudStore.aceptarSolicitud(id);
    if (resp.success == true) {
      $q.loading.hide();
      $q.notify({
        type: "positive",
        message: resp.data,
      });
      solicitudStore.loadSolicitudes();
    } else {
      $q.loading.hide();
      $q.notify({
        type: "negative",
        message: resp.data,
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
      color: "positive",
      label: "¡Sí!, rechazar",
    },
    cancel: {
      color: "negative",
      label: "Cancelar",
    },
  }).onOk(async () => {
    $q.loading.show();
    const resp = await solicitudStore.rechazarSolicitud(id);
    if (resp.success == true) {
      $q.loading.hide();
      $q.notify({
        type: "positive",
        message: resp.data,
      });
      solicitudStore.loadSolicitudes();
    } else {
      $q.loading.hide();
      $q.notify({
        type: "negative",
        message: resp.data,
      });
    }
  });
};
</script>
