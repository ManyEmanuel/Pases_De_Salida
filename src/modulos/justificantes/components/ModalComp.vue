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
                v-if="isEditar || isPersonal || isVisualizar"
                readonly
                v-model="justificante.area"
                label="Área"
              ></q-input>
              <q-select
                v-else
                :readonly="isAdmi"
                v-model="area_Id"
                :options="areas"
                label="Área del empleado"
                hint="Seleccione un área"
                lazy-rules
                :rules="[(val) => !!val || 'El área es requerida']"
              >
              </q-select>
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
                v-if="isVisualizar || isEditar || isPersonal"
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
            </div>

            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-input
                readonly
                v-model="justificante.responsable_Area"
                label="Personal que autoriza"
              >
              </q-input>
              <br />
              <div class="text-h6 q-pt-xs text-bold">Incidencia</div>
            </div>

            <div
              v-if="!isVisualizar"
              class="col-lg-4 col-md-4 col-sm-4 col-xs-12"
            >
              <!-- <q-btn-dropdown
                class="bg-purple-ieen-3 text-white"
                :label="tipo == null ? 'Seleccione una opción' : tipo"
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
              </q-btn-dropdown> -->
              <q-select
                v-model="tipo"
                :options="tipoJustificante"
                label="Seleccione una opción"
              />
            </div>

            <div
              v-if="!isVisualizar"
              class="col-lg-4 col-md-4 col-sm-4 col-xs-12 q-pl-xs q-pr-xs"
            >
              <q-select
                @click="elegirYear"
                v-model="year"
                :options="years"
                label="Año"
              />
            </div>

            <div
              v-if="!isVisualizar"
              class="col-lg-4 col-md-4 col-sm-4 col-xs-12"
            >
              <q-input label="Fecha" v-model="days" :disable="tipo == null">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-if="
                          tipo == 'Omisión de entrada' ||
                          tipo == 'Omisión de salida'
                        "
                        color="purple"
                        v-model="days"
                        multiple
                        :locale="myLocale"
                        :options="FiltroFecha"
                      >
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Cerrar"
                            color="black"
                            flat
                          /></div
                      ></q-date>
                      <q-date
                        v-else
                        color="purple"
                        v-model="days"
                        multiple
                        :locale="myLocale"
                        @click="validateDates"
                      >
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Cerrar"
                            color="black"
                            flat
                          /></div
                      ></q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <div
                class="text-body2 q-pt-md"
                v-show="tipo == 'Vacaciones' || tipo == 'Permiso día económico'"
              >
                Días disponibles:
                {{ restanDias }}
              </div>
            </div>
          </div>
          <div v-if="tipo == 'Otros'" class="text-caption text-red">
            Especificar concepto en el motivo.
          </div>
          <div class="row" v-if="tipo == 'Vacaciones' && !isVisualizar">
            <div class="text-bold q-pt-xs text-body2">Periodo vacacional</div>
            <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <q-radio
                v-model="periodoVacacional"
                checked-icon="task_alt"
                unchecked-icon="panorama_fish_eye"
                val="2"
                :label="
                  periodoVacacional == '2'
                    ? 'Segundo periodo'
                    : 'Primer periodo'
                "
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
                v-if="!isVisualizar && !isEditar"
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
import { useQuasar, date } from "quasar";
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
  myLocale,
  isPersonal,
  isAdmi,
  dias_restantes,
} = storeToRefs(justificanteStore);
const tipoJustificante = ref([
  "Omisión de entrada",
  "Omisión de salida",
  "Comisión oficial",
  "Permuta por día laborado",
  "Otros",
  "Permiso día económico",
  "Vacaciones",
]);
const years = ref([2023, 2024]);
const year = ref();
const days = ref([]);
const cambioDays = ref(false);
const tipo = ref(null);
const periodoVacacional = ref("2");
const empleado_Id = ref(null);
const personalAutoriza = ref(null);
const area_Id = ref(null);
const motivo = ref(null);
const filtrarFecha = ref("");
const restanDias = ref(null);

//-----------------------------------------------------------

onBeforeMount(() => {
  justificanteStore.loadInformacionJustificante();
  justificanteStore.loadEmpleadosByUsuario();
});

//-----------------------------------------------------------

watch(justificante.value, (val) => {
  if (
    isEditar.value == true ||
    isAdmi.value == true ||
    isPersonal.value == true
  ) {
    cargarArea(val);
    cargarSolicitante(val);
  }
});

watch(area_Id, (val) => {
  if (area_Id.value != null) {
    empleado_Id.value = null;
    personalAutoriza.value = null;
    justificanteStore.loadPersonalArea(val.value, false);
  }
});

// watch(detalle.value, async (val) => {
//   if (val.id != null) {
//     cargarTipo(val);
//     motivo.value = val.motivo;
//     if (val.tipo_Justificantes == "Permiso día económico") {
//       days.value = val.dias_Incidencias;
//     } else if (val.tipo_Justificantes == "Vacaciones") {
//       var diasArray = val.dias_Incidencias.split(", ");
//       days.value = diasArray;
//     } else {
//       days.value = val.dias_Incidencias;
//     }
//     await justificanteStore.loadDiasRestantes(empleado_Id.value.value);
//     diasRestantes();
//   }
// });

//-----------------------------------------------------------

// const diasRestantes = () => {
//   if (tipo.value == "Permiso día económico") {
//     restanDias.value = dias_restantes.value.dias_Economicos;
//   } else if (tipo.value == "Vacaciones") {
//     restanDias.value = dias_restantes.value.segundo_Periodo;
//   }
// };

const cargarArea = async (val) => {
  if (area_Id.value == null) {
    let areaFiltrado = areas.value.find((x) => x.value == `${val.area_Id}`);
    area_Id.value = areaFiltrado;
    //justificanteStore.loadPersonalArea(val.area_Id);
  }
};

const cargarSolicitante = async (val) => {
  if (empleado_Id.value == null) {
    let solicitanteFiltrado = listEmpleados.value.find(
      (x) => x.label == `${val.solicitante}`
    );
    empleado_Id.value = solicitanteFiltrado;
    personalAutoriza.value = val.responsable_Area;
  }
};

watch(modal, (val) => {
  if (val == true) {
    justificanteStore.loadInformacionJustificante();
    cargarArea(justificante.value);
  }
  tipoJustificante.value = [
    "Omisión de entrada",
    "Omisión de salida",
    "Comisión oficial",
    "Permuta por día laborado",
    "Otros",
    "Permiso día económico",
    "Vacaciones",
  ];
});

watch(empleado_Id, async (val) => {
  if (empleado_Id.value != null) {
    empleado(val);
    if (isPersonal == false) {
      justificante.value.responsable_Area = null;
    }
  }
});

watch(year, async (val) => {
  if (val != null) {
    await justificanteStore.loadDiasRestantes(empleado_Id.value.value);

    await justificanteStore.loadAsignacionesVacaciones(val);
    days.value = null;
    if (tipo.value == "Permiso día económico") {
      restanDias.value = dias_restantes.value.dias_Economicos;
    } else if (tipo.value == "Vacaciones") {
      restanDias.value = dias_restantes.value.segundo_Periodo;
      console.log("restanDiasrestanDias", restanDias.value);
    }
  }
});

const empleado = async (val) => {
  await justificanteStore.loadResponsabeArea(val.value);
  await justificanteStore.loadDiasRestantes(val.value);
  // if (
  //   dias_restantes.value.dias_Economicos == 0 &&
  //   dias_restantes.value.segundo_Periodo != 0
  // ) {
  //   tipoJustificante.value = [
  //     "Omisión de entrada",
  //     "Omisión de salida",
  //     "Comisión oficial",
  //     "Permuta por día laborado",
  //     "Otros",
  //     "Vacaciones",
  //   ];
  // } else if (
  //   dias_restantes.value.dias_Economicos == 0 &&
  //   dias_restantes.value.segundo_Periodo == 0
  // ) {
  //   tipoJustificante.value = [
  //     "Omisión de entrada",
  //     "Omisión de salida",
  //     "Comisión oficial",
  //     "Permuta por día laborado",
  //     "Otros",
  //   ];
  // } else if (
  //   dias_restantes.value.segundo_Periodo == 0 &&
  //   dias_restantes.value.dias_Economicos != 0
  // ) {
  //   tipoJustificante.value = [
  //     "Omisión de entrada",
  //     "Omisión de salida",
  //     "Comisión oficial",
  //     "Permuta por día laborado",
  //     "Otros",
  //     "Permiso día económico",
  //   ];
  // } else {
  //   tipoJustificante.value = [
  //     "Omisión de entrada",
  //     "Omisión de salida",
  //     "Comisión oficial",
  //     "Permuta por día laborado",
  //     "Otros",
  //     "Permiso día económico",
  //     "Vacaciones",
  //   ];
  // }
  limpiarCampos();
};

watch(days, (val) => {
  if (val != null) {
    if (tipo.value == "Vacaciones") {
      restanDias.value = dias_restantes.value.segundo_Periodo - val.length;
    } else if (tipo.value == "Permiso día económico") {
      restanDias.value = dias_restantes.value.dias_Economicos - val.length;
    }
  } else {
    if (tipo.value == "Vacaciones" && periodoVacacional.value == 1) {
      restanDias.value = dias_restantes.value.primer_Periodo;
    } else if (tipo.value == "Permiso día económico") {
      restanDias.value = dias_restantes.value.dias_Economicos;
    } else if (tipo.value == "Vacaciones" && periodoVacacional.value == 2) {
      restanDias.value = dias_restantes.value.segundo_Periodo;
    }
  }
});

const cargarTipo = async (val) => {
  if (tipo.value == null) {
    let tipoFiltrado = tipoJustificante.value.find(
      (x) => x == `${val.tipo_Justificantes}`
    );
    tipo.value = tipoFiltrado;
  }
};

const validateDates = () => {
  if (days.value != null) {
    if (
      days.value.length > dias_restantes.value.dias_Economicos &&
      tipo.value == "Permiso día económico"
    ) {
      days.value = days.value.slice(0, dias_restantes.value.dias_Economicos);
    } else if (
      days.value.length > dias_restantes.value.segundo_Periodo &&
      tipo.value == "Vacaciones"
    ) {
      days.value = days.value.slice(0, dias_restantes.value.segundo_Periodo);
    }
  }
};

const esObjeto = (variable) => {
  return variable !== null && typeof variable === "object";
};

const FiltroFecha = (fecha) => {
  const today = new Date();
  let diaSemana = today.getDay();
  let diasContar = 3;
  if (diaSemana <= 3) {
    diasContar = 5;
  }
  filtrarFecha.value = date.formatDate(today, "YYYY/MM/DD");
  let filtro = calcularFechaNueva(filtrarFecha.value, diasContar);
  return fecha >= filtro;
};

const calcularFechaNueva = (fecha, dias) => {
  const [anio, mes, dia] = fecha.split("/");
  const fechaFormato = new Date(anio, mes - 1, dia);
  fechaFormato.setDate(fechaFormato.getDate() - dias);
  let mesFiltro = fechaFormato.getMonth() + 1;
  let diaFiltro = fechaFormato.getDate();
  let formatoMes = mesFiltro <= 9 ? "0" + mesFiltro : mesFiltro;
  let formatoDia = diaFiltro <= 9 ? "0" + diaFiltro : diaFiltro;
  const anioPrevio = fechaFormato.getFullYear();
  const mesPrevio = formatoMes;
  const diaPrevio = formatoDia;

  const fechaLimite = `${anioPrevio}/${mesPrevio}/${diaPrevio}`;
  return fechaLimite;
};

const actualizarModal = (valor) => {
  $q.loading.show();
  justificanteStore.actualizarModal(valor);
  justificanteStore.updateVisualizar(false);
  justificanteStore.updateEditar(false);
  justificanteStore.updateEditarDetalle(false);
  justificanteStore.loadEmpleadosByUsuario();
  limpiarCampos();
  justificante.value.solicitante = null;
  listaIncidencias.value = [];
  empleado_Id.value = null;
  justificante.value.responsable_Area = null;
  area_Id.value = null;
  $q.loading.hide();
};

const onItemClick = async (val) => {
  if (empleado_Id.value == null) {
    $q.dialog({
      title: "Atención",
      message: "Seleccione un solicitante",
      icon: "Warning",
      persistent: true,
      transitionShow: "scale",
      transitionHide: "scale",
    });
  } else {
    tipo.value = val;
    await justificanteStore.loadAsignacionesVacaciones(year.value);
    days.value = null;
    if (tipo.value == "Permiso día económico") {
      restanDias.value = dias_restantes.value.dias_Economicos;
    } else if (tipo.value == "Vacaciones") {
      restanDias.value = dias_restantes.value.segundo_Periodo;
      console.log("restanDiasrestanDias", restanDias.value);
    }
  }
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
    if (
      tipo.value == null ||
      motivo.value == null ||
      days.value == "" ||
      empleado_Id.value == null
    ) {
      $q.dialog({
        title: "Atención",
        message: "Campos incompletos",
        icon: "Warning",
        persistent: true,
        transitionShow: "scale",
        transitionHide: "scale",
      });
    } else {
      if (editarDetalle.value == true) {
        let respObjeto = esObjeto(days.value);
        if (tipo.value == "Vacaciones") {
          let periodo;
          if (respObjeto == true) {
            const resultado = days.value.join(", ");
            detalle.value.dias_Incidencias = resultado;
          } else {
            detalle.value.dias_Incidencias = detalle.value.dias_Incidencias;
          }

          if (periodoVacacional.value == 1) {
            periodo = 1;
          } else if (periodoVacacional.value == 2) {
            periodo = 2;
          }
          detalle.value.tipo_Justificantes = tipo.value;
          detalle.value.motivo = motivo.value;
          detalle.value.primer_Periodo = 0;
          detalle.value.segundo_Periodo = 0;
          detalle.value.dias_Economicos = 0;
          detalle.value.periodo_Vacacional = periodo;
          resp = await justificanteStore.createDetalleJustificantes(
            justificante.value.id,
            detalle.value
          );
          if (resp.success) {
            await justificanteStore.loadDetalleJustificantes(
              justificante.value.id
            );
          }
        } else {
          if (respObjeto == true) {
            const resultado = days.value.join(", ");
            detalle.value.dias_Incidencias = resultado;
          } else {
            detalle.value.dias_Incidencias = detalle.value.dias_Incidencias;
          }
          detalle.value.tipo_Justificantes = tipo.value;
          detalle.value.motivo = motivo.value;
          detalle.value.primer_Periodo = 0;
          detalle.value.segundo_Periodo = 0;
          detalle.value.dias_Economicos = 0;
          detalle.value.periodo_Vacacional = 0;
          resp = await justificanteStore.createDetalleJustificantes(
            justificante.value.id,
            detalle.value
          );
          if (resp.success) {
            await justificanteStore.loadDetalleJustificantes(
              justificante.value.id
            );
          }
        }

        justificanteStore.updateEditarDetalle(false);
        limpiarCampos();
      } else {
        if (tipo.value == "Vacaciones") {
          let periodo;
          if (periodoVacacional.value == 1) {
            periodo = 1;
          } else if (periodoVacacional.value == 2) {
            periodo = 2;
          }
          const resultado = days.value.join(", ");
          detalle.value.dias_Incidencias = resultado;
          detalle.value.tipo_Justificantes = tipo.value;
          detalle.value.motivo = motivo.value;
          detalle.value.periodo_Vacacional = periodo;
          detalle.value.dias_Economicos = 0;
          await justificanteStore.addIncidencia(
            resultado,
            motivo.value,
            tipo.value,
            periodo
          );
        } else {
          const resultado = days.value.join(", ");
          detalle.value.dias_Incidencias = resultado;
          detalle.value.tipo_Justificantes = tipo.value;
          detalle.value.motivo = motivo.value;
          detalle.value.periodo_Vacacional = 0;
          detalle.value.primer_Periodo = 0;
          detalle.value.segundo_Periodo = 0;
          detalle.value.dias_Economicos = 0;
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
  cambioDays.value = false;
  restanDias.value = null;
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
    justificante.value.area = area_Id.value.label;
    justificante.value.solicitante_Id = empleado_Id.value.value;
    justificante.value.puesto_Solicitante_Id = empleado_Id.value.puesto_Id;
    if (isEditar.value == true) {
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
  }

  $q.loading.hide();
};
</script>

<style></style>
