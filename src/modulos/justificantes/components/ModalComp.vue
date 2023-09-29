<template>
  <q-dialog
    v-model="modal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section class="row">
        <div class="text-h6">Registro de justificante</div>
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
              <q-select
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
                stack-label
                v-model="justificante.responsable_Area"
                label="Empleado responsable de área"
                readonly
              >
              </q-input>
            </div>
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-input
                stack-label
                v-model="justificante.empleado"
                label="Empleado que realiza la captura de la solicitud"
                readonly
              >
              </q-input>
            </div>

            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-select
                stack-label
                v-model="empleado_Id"
                :options="listEmpleados"
                :readonly="personalRead"
                label="Solicitante"
                hint="Seleccione una opción"
                lazy-rules
                :rules="[(val) => !!val || 'El solicitante es requerido']"
              >
              </q-select>
              <br />
              <q-separator color="purple" />
              <div class="text-h6 q-pt-xs text-bold">Incidencia</div>
            </div>

            <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-pt-md">
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
            <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-pt-xs">
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
          <div class="row" v-if="tipo == 'Vacaciones'">
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
          <div class="col-12">
            <q-input
              v-model="motivo"
              label="Motivo: (Especificar en todos los casos)"
              type="textarea"
              counter
              maxlength="200"
              hint="Máximo 200 carácteres"
            />
          </div>
          <div class="col-12">
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
                :disable="listaConceptos.value == ''"
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
  listaConceptos,
  justificante,
  listEmpleados,
  areas,
  isEditar,
  listaIncidencias,
} = storeToRefs(justificanteStore);
const tipoJustificante = ref([
  "Omisión de entrada",
  "Omisión de salida",
  "Comisión oficial",
  "Permiso día económico",
  "Permuta por dia laborado",
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
  // justificanteStore.loadAreaByUsuario();
  justificanteStore.loadEmpleadosByUsuario();
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
const actualizarModal = (valor) => {
  $q.loading.show();
  justificanteStore.actualizarModal(valor);
  $q.loading.hide();
};

const onItemClick = (val) => {
  console.log(val);
  tipo.value = val;
};

const agregarIncidencia = async () => {
  const resultado = days.value.join(", ");
  console.log(resultado);
  await justificanteStore.addIncidencia(resultado, motivo.value, tipo.value);
};

const onSubmit = async () => {
  let resp = null;
  let respDetalle = null;
  $q.loading.show();
  if (listaConceptos == "") {
    $q.dialog({
      title: "Atención",
      message: "Debes de agregar minimo un concepto",
      icon: "Warning",
      persistent: true,
      transitionShow: "scale",
      transitionHide: "scale",
    });
  } else {
    console.log("empleado id", empleado_Id.value.value);
    justificante.value.solicitante_Id = empleado_Id.value.value;
    justificante.value.puesto_Solicitante_Id = 74;
    if (isEditar.value == true) {
    } else {
      resp = await justificanteStore.createJustificante(justificante.value);
      console.log("resp", resp);
      if (resp.success == true) {
        console.log("entro succes", listaIncidencias.value);
        // for (let index = 0; index < listaIncidencias.value.length; index++) {
        //   const element = array[index];
        //   respDetalle = await justificanteStore.createDetalleJustificantes(
        //     resp.idJustificante,
        //     element
        //   );
        // }
        listaIncidencias.value.forEach((element) => {
          console.log("element", element);
          respDetalle = justificanteStore.createDetalleJustificantes(
            resp.idJustificante,
            element
          );
          console.log("resp", respDetalle);
        });
      }
    }
    // if (resp.success) {
    //   $q.notify({
    //     position: "top-right",
    //     type: "positive",
    //     message: resp.data,
    //   });
    //   justificanteStore.loadJustificantes();
    //   actualizarModal(false);
    // } else {
    //   $q.notify({
    //     position: "top-right",
    //     type: "negative",
    //     message: resp.data,
    //   });
    // }
  }

  $q.loading.hide();
};
</script>

<style></style>
