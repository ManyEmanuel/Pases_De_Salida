<template>
  <q-dialog
    v-model="modal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section class="row">
        <div class="text-h6">
          {{
            isEditar
              ? "Editar justificante"
              : isVisualizar
              ? "Ver justificante"
              : "Crear justificante"
          }}
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
        <q-form class="q-col-gutter-xs" @submit="onSubmit">
          <div class="row">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-input
                v-if="isVisualizar"
                readonly
                v-model="justificante.area"
                label="Área"
              >
              </q-input>
              <q-select
                v-else
                v-model="area_Id"
                :options="areas"
                label="Area del empleado"
                hint="Seleccione un area"
                lazy-rules
                :readonly="areaRead"
                :rules="[(val) => !!val || 'El area es requerida']"
              >
              </q-select>
            </div>
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-input
                v-if="isVisualizar"
                readonly
                v-model="justificante.responsable_Area"
                label="Responsable del área"
              >
              </q-input>
              <q-input
                v-else
                stack-label
                v-model="justificante.responsable_Area"
                label="Responsable de área"
                readonly
              >
              </q-input>
            </div>
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-input
                readonly
                v-model="justificante.capturista"
                label="Empleado que realiza la captura de la solicitud"
              >
              </q-input>
            </div>

            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-input
                v-if="isVisualizar"
                readonly
                v-model="justificante.solicitante"
                label="Solicitante"
              >
              </q-input>
              <q-select
                v-else
                stack-label
                v-model="empleado_Id"
                :options="listEmpleados"
                label="Solicitante"
                hint="Seleccione una opción"
                lazy-rules
                :rules="[(val) => !!val || 'El solicitante es requerido']"
              >
              </q-select>
              <br />
              <div class="text-h6 q-pt-xs text-bold">Incidencia</div>
            </div>

            <div
              v-if="!isVisualizar"
              class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-pt-md"
            >
              <q-btn-dropdown
                class="bg-purple-ieen-3 text-white"
                :label="tipo == null ? 'Seleccione una opcion' : tipo"
                dropdown-icon="change_history"
              >
                <q-list>
                  <q-item
                    clickable
                    v-close-popup
                    @click="onItemClick(tipo)"
                    v-for="tipo in tipoJustificante"
                    :key="tipo"
                  >
                    <q-item-section>
                      <q-item-label>{{ tipo }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </div>
            <div
              v-if="!isVisualizar"
              class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-pt-xs"
            >
              <q-input label="Fecha" v-model="days">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date color="purple" v-model="days" multiple />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
          <div class="row" v-if="tipo == 'Vacaciones' && !isVisualizar">
            <text-body2 class="text-bold q-pt-xs"
              >Periodo vacacional</text-body2
            >
            <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <q-radio
                v-model="periodoVacacional"
                checked-icon="task_alt"
                unchecked-icon="panorama_fish_eye"
                val="Primero"
                label="Primero"
              />
              <q-radio
                v-model="periodoVacacional"
                checked-icon="task_alt"
                unchecked-icon="panorama_fish_eye"
                val="Segundo"
                label="Segundo"
              />
            </div>
          </div>
          <div v-if="!isVisualizar" class="col-12">
            <q-input
              v-model="motivo"
              label="Motivo: (Especificar en todos los casos)"
              type="textarea"
              counter
              maxlength="200"
              hint="Máximo 200 carácteres"
            />
          </div>
          <div v-if="!isVisualizar" class="col-12">
            <div class="text-right">
              <q-btn
                label="Agregar"
                icon="add"
                color="secondary"
                size="sm"
                class="q-ml-sm"
                @click="agregarIncidencia()"
              />
            </div>
          </div>
          <br />
          <q-card-section>
            <TablaConceptos />
          </q-card-section>
          <q-space />
          <div class="col-12">
            <div class="text-right">
              <q-btn
                label="Cancelar"
                type="reset"
                color="red"
                @click="actualizarModal(false)"
              />
              <q-btn
                :disable="listaIncidencias.value == ''"
                label="Guardar"
                type="submit"
                color="secondary"
                class="q-ml-sm"
              />
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { useJustificanteStore } from "src/stores/justificantes_store";
import { onBeforeMount, ref, watch } from "vue";
import TablaConceptos from "./TablaConceptos.vue";

//-----------------------------------------------------------

const $q = useQuasar();
const justificanteStore = useJustificanteStore();
const {
  modal,
  justificante,
  listEmpleados,
  areas,
  isEditar,
  isVisualizar,
  listaIncidencias,
  detalle,
  editarDetalle,
} = storeToRefs(justificanteStore);
const tipoJustificante = ref([
  "Omisión de entrada",
  "Omisión de salida",
  "Comisión oficial",
  "Permiso día económico",
  "Permuta por día laborado",
  "Vacaciones",
]);
const days = ref([]);
const tipo = ref(null);
const periodoVacacional = ref("Primero");
const empleado_Id = ref(null);
const area_Id = ref(null);
const motivo = ref(null);
let areaRead = ref(false);
let personalRead = ref(false);

//-----------------------------------------------------------

onBeforeMount(() => {
  justificanteStore.loadInformacionJustificante();
  justificanteStore.loadEmpleadosByUsuario();
});

//-----------------------------------------------------------
watch(justificante.value, (val) => {
  if (val.id != null) {
    cargarArea(val);
    cargarSolicitante(val);
  }
});

watch(detalle.value, (val) => {
  if (val.id != null) {
    cargarTipoJustificante(val);
    motivo.value = val.motivo;
    days.value = val.dias_Incidencias;
  }
});

watch(justificante.value, (val) => {
  if (val.area_Id != null) {
    let areaFiltrada = areas.value.find((x) => x.value == val.area_Id);
    area_Id.value = areaFiltrada;
    areaRead.value = true;
  }
  if (val.solicitante_Id != null) {
    let personalFiltrado = listEmpleados.value.find(
      (x) => x.value == val.solicitante_Id
    );
    empleado_Id.value = personalFiltrado;
    personalRead.value = true;
  }
});

watch(area_Id, (val) => {
  if (area_Id.value != null) {
    empleado_Id.value = null;
    justificanteStore.loadPersonalArea(area_Id.value.value);
  }
});
watch(empleado_Id, (val) => {
  if (empleado_Id.value != null) {
    justificanteStore.loadResponsabeArea(val.value);
  }
});

//-----------------------------------------------------------

const cargarTipoJustificante = async (val) => {
  if (tipo.value == null) {
    let tipoFiltrado = tipoJustificante.value.find(
      (x) => x == `${val.tipo_Justificantes}`
    );
    tipo.value = tipoFiltrado;
  }
};

const cargarArea = async (val) => {
  if (area_Id.value == null) {
    let areaFiltrado = areas.value.find((x) => x.value == `${val.area_Id}`);
    area_Id.value = areaFiltrado;
  }
};

const cargarSolicitante = async (val) => {
  if (empleado_Id.value == null) {
    let solicitanteFiltrado = listEmpleados.value.find(
      (x) => x.label == `${val.solicitante}`
    );
    empleado_Id.value = solicitanteFiltrado;
  }
};

const actualizarModal = (valor) => {
  $q.loading.show();
  justificanteStore.actualizarModal(valor);
  justificanteStore.updateVisualizar(false);
  justificanteStore.updateEditar(false);
  limpiarCampos();
  listaIncidencias.value = [];
  empleado_Id.value = null;
  $q.loading.hide();
};

const onItemClick = (val) => {
  tipo.value = val;
};

const agregarIncidencia = async () => {
  let resp = null;
  if (listaIncidencias.value.length == 4) {
    $q.dialog({
      title: "Atención",
      message: "Solo puedes agregar maximo 4 incidencias por justificante",
      icon: "Warning",
      persistent: true,
      transitionShow: "scale",
      transitionHide: "scale",
    });
  } else {
    if (tipo.value == null || motivo.value == null || days.value == "") {
      $q.notify({
        position: "top-right",
        type: "negative",
        message: "Campos incompletos",
      });
    } else {
      if (editarDetalle.value == true) {
        detalle.value.dias_Incidencias = days.value;
        detalle.value.tipo_Justificantes = tipo.value;
        detalle.value.motivo = motivo.value;
        detalle.value.primer_Periodo = 0;
        detalle.value.segundo_Periodo = 0;
        detalle.value.dias_Economicos = 0;
        resp = await justificanteStore.updateDetalle(detalle.value);
        if (resp.success) {
          justificanteStore.loadDetalleJustificantes(justificante.value.id);
        }
        limpiarCampos();
      } else {
        if (tipo.value == "Vacaciones") {
          let periodo;
          if (periodoVacacional.value == "Primero") {
            periodo = 1;
          } else {
            periodo = 2;
          }
          const resultado = days.value.join(", ");
          await justificanteStore.addIncidencia(
            resultado,
            motivo.value,
            tipo.value,
            periodo
          );
        } else {
          const resultado = days.value.join(", ");
          await justificanteStore.addIncidencia(
            resultado,
            motivo.value,
            tipo.value,
            0
          );
        }

        limpiarCampos();
      }
    }
  }
};

const limpiarCampos = () => {
  tipo.value = null;
  days.value = null;
  motivo.value = null;
};

const onSubmit = async () => {
  let resp = null;

  $q.loading.show();
  if (listaIncidencias.value == "") {
    $q.dialog({
      title: "Atención",
      message: "Debes de agregar minimo una incidencia",
      icon: "Warning",
      persistent: true,
      transitionShow: "scale",
      transitionHide: "scale",
    });
  } else {
    justificante.value.area_Id = area_Id.value.value;
    justificante.value.solicitante_Id = empleado_Id.value.value;
    justificante.value.solicitante = empleado_Id.value.label;
    justificante.value.puesto_Capturista_Id = empleado_Id.value.puesto_Id;
    justificante.value.puesto_Solicitante_Id = empleado_Id.value.puesto_Id;
    justificante.value.capturista = justificante.value.capturista;
    justificante.value.capturista_Id = justificante.value.capturista_Id;
    if (isEditar.value == true) {
      resp = await justificanteStore.updateJustificante(justificante.value);
    } else {
      resp = await justificanteStore.createJustificante(justificante.value);

      if (resp.success == true) {
        listaIncidencias.value.forEach(async (element) => {
          await justificanteStore.createDetalleJustificantes(
            resp.idJustificante,
            element
          );
        });
      }
    }
  }

  if (resp.success === true) {
    $q.notify({
      position: "top-right",
      type: "positive",
      message: "Se creo con exito",
    });
    justificanteStore.loadJustificantes();
    actualizarModal(false);
  } else {
    $q.notify({
      position: "top-right",
      type: "negative",
      message: resp.data,
    });
  }
  $q.loading.hide();
};
</script>

<style></style>
