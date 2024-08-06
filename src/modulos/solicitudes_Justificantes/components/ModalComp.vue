<template>
  <q-dialog
    v-model="modal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 900px; max-width: 90vw">
      <q-card-section class="row">
        <q-img src="../../../assets/IEEN300.png" width="90px" />
        <div class="text-h5 text-gray-ieen-1 text-bold absolute-center">
          VER JUSTIFICANTE
          <div class="text-subtitle1 text-purple-ieen text-center text-bold">
            {{ justificante.folio }}
          </div>
        </div>
        <q-space />
        <q-btn
          icon="close"
          @click="actualizarModal(false)"
          flat
          round
          dense
          v-close-popup
        />
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 q-pb-sm">
            <q-input disable v-model="justificante.area" label="Área">
              <template v-slot:prepend>
                <q-icon name="apartment" />
              </template>
            </q-input>
          </div>
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 q-pb-sm">
            <q-input
              disable
              v-model="justificante.capturista"
              label="Personal que realiza la captura de la solicitud"
            >
              <template v-slot:prepend>
                <q-icon name="person" />
              </template>
            </q-input>
          </div>
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 q-pb-sm">
            <q-input
              disable
              v-model="justificante.solicitante"
              label="Solicitante"
            >
              <template v-slot:prepend>
                <q-icon name="person" />
              </template>
            </q-input>
          </div>
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-input
              disable
              v-model="justificante.responsable_Area"
              label="Personal que autoriza"
            >
              <template v-slot:prepend>
                <q-icon name="supervisor_account" />
              </template>
            </q-input>
            <br /><br /><br />
            <div class="text-h6 q-pt-xs text-bold text-center text-purple-ieen">
              <q-icon name="playlist_add" />
              INCIDENCIA
            </div>
            <br />
          </div>
        </div>
        <div class="row">
          <div class="col">
            <q-table
              :rows="listaIncidencias"
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
                  placeholder="Buscar.."
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </template>
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                  >
                    <label>{{ col.value }}</label>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
        </div>
        <q-space />
        <br />
        <div class="col-12">
          <div class="text-right">
            <q-btn
              label="Cerrar"
              type="reset"
              color="red"
              icon-right="close"
              @click="actualizarModal(false)"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useJustificanteStore } from "src/stores/justificantes_store";
import { useSolicitudJustificanteStore } from "src/stores/solicitudes_Justificantes_store";
import { ref } from "vue";

//-----------------------------------------------------------

const justificanteStore = useJustificanteStore();
const solicitudesStore = useSolicitudJustificanteStore();
const { justificante, listaIncidencias } = storeToRefs(justificanteStore);
const { modal } = storeToRefs(solicitudesStore);

//-----------------------------------------------------------

const actualizarModal = (valor) => {
  solicitudesStore.actualizarModal(valor);
};

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
];

const pagination = ref({
  page: 1,
  rowsPerPage: 25,
  sortBy: "name",
  descending: false,
});

const filter = ref("");
</script>
