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
          {{
            isEditar
              ? `EDITAR JUSTIFICANTE`
              : isVisualizar
              ? "VER JUSTIFICANTE"
              : "CREAR JUSTIFICANTE"
          }}
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
        <q-form class="q-col-gutter-xs" @submit="onSubmit">
          <div class="row">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 q-pb-sm">
              <q-input
                v-if="isPersonal || isVisualizar"
                disable
                v-model="justificante.area"
                label="Área"
                color="purple-ieen"
              >
                <template v-slot:prepend> <q-icon name="apartment" /> </template
              ></q-input>
              <q-select
                v-else
                :disable="isAdmi || isEditar"
                v-model="area_Id"
                :options="areas"
                label="Área del empleado"
                hint="Seleccione un área"
                lazy-rules
                :rules="[(val) => !!val || 'El área es requerida']"
                color="purple-ieen"
              >
                <template v-slot:prepend>
                  <q-icon name="apartment" />
                </template>
              </q-select>
            </div>
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 q-pb-sm">
              <q-input
                disable
                v-model="justificante.capturista"
                label="Personal que realiza la captura de la solicitud"
                color="purple-ieen"
              >
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>
            </div>
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 q-pb-sm">
              <q-select
                v-if="!isVisualizar"
                :disable="isEditar || isPersonal"
                stack-label
                color="purple-ieen"
                v-model="empleado_Id"
                :options="listEmpleados"
                label="Solicitante"
                hint="Seleccione una opción"
                lazy-rules
                :rules="[(val) => !!val || 'El solicitante es requerido']"
              >
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-select>
              <q-input
                v-else
                disable
                v-model="justificante.solicitante"
                label="Solicitante"
                color="purple-ieen"
              >
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>
            </div>
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-input
                color="purple-ieen"
                disable
                v-model="justificante.responsable_Area"
                label="Personal que autoriza"
              >
                <template v-slot:prepend>
                  <q-icon name="supervisor_account" />
                </template>
              </q-input>
              <br /><br /><br /><br />
              <div
                class="text-h6 q-pt-xs text-bold text-center text-purple-ieen"
              >
                <q-icon name="playlist_add" />
                INCIDENCIA
              </div>
            </div>
            <div
              v-if="!isVisualizar"
              class="col-lg-3 col-md-3 col-sm-3 col-xs-12 q-pr-xs"
            >
              <q-select
                color="purple-ieen"
                v-model="tipo"
                :options="tipoJustificante"
                label="Seleccione una opción"
              />
            </div>
            <div
              v-if="!isVisualizar && tipo == 'Vacaciones'"
              class="col-lg-3 col-md-3 col-sm-3 col-xs-12 q-pr-xs"
            >
              <q-select
                color="purple-ieen"
                v-model="year"
                :options="years"
                label="Año"
              />
            </div>
            <div
              v-if="tipo == 'Vacaciones' && !isVisualizar"
              class="col-lg-3 col-md-3 col-sm-3 col-xs-12 q-pr-xs"
            >
              <q-select
                color="purple-ieen"
                v-model="periodoVacacional"
                :options="periodos_Vacacionales"
                label="Periodo vacacional"
              />
            </div>
            <div
              v-if="!isVisualizar"
              class="col-lg-3 col-md-3 col-sm-3 col-xs-12 q-pl-xs"
            >
              <q-input
                color="purple-ieen"
                label="Fecha"
                v-model="days"
                :disable="tipo == null || vacacionesFijo == true"
              >
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
                {{
                  vacacionesFijo == false
                    ? `Días disponibles: ${restanDias}`
                    : `Periodo establecido`
                }}
              </div>
            </div>
          </div>
          <div v-if="tipo == 'Otros'" class="text-caption text-red">
            Especificar concepto en el motivo.
          </div>
          <div v-if="!isVisualizar" class="col-12">
            <q-input
              color="purple-ieen"
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
                icon-right="add"
                color="secondary"
                class="q-ml-sm"
                @click="agregarIncidencia()"
              />
            </div>
          </div>
          <br />
          <TablaConceptos />
          <q-space />
          <div class="col-12">
            <div class="text-right">
              <q-btn
                label="Cerrar"
                type="reset"
                color="red"
                icon-right="close"
                @click="actualizarModal(false)"
              />
              <q-btn
                icon-right="save"
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
import { useQuasar, date, QSpinnerFacebook } from "quasar";
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
  configuracion,
} = storeToRefs(justificanteStore);
const tipoJustificante = ref([]);
const years = ref([2023, 2024]);
const year = ref(2024);
const days = ref([]);
const periodos_Vacacionales = ref([
  { value: 1, label: "Primer periodo" },
  { value: 2, label: "Segundo periodo" },
]);
const cambioDays = ref(false);
const tipo = ref(null);
const periodoVacacional = ref({ value: 1, label: "Primer periodo" });
const empleado_Id = ref(null);
const personalAutoriza = ref(null);
const area_Id = ref(null);
const motivo = ref(null);
const filtrarFecha = ref("");
const restanDias = ref(null);
const vacacionesFijo = ref(false);

//-----------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

//-----------------------------------------------------------

watch(justificante.value, (val) => {
  if (val != null) {
    cargarArea(val);
    if (val.solicitante_Id != null && isPersonal.value == true) {
      justificanteStore.loadResponsabeAreaByEmpleado(val.solicitante_Id);
    }
  }
});

watch(area_Id, (val) => {
  if (val != null) {
    empleado_Id.value = null;
    personalAutoriza.value = null;
    justificanteStore.loadPersonalArea(val.value, false);
  }
});

watch(tipo, async (val) => {
  if (val != null) {
    await justificanteStore.loadDiasRestantes(
      empleado_Id.value.value,
      year.value
    );
    days.value = [];
    diasRestantes();
  }
});

watch(periodoVacacional, (val) => {
  if (val != null) {
    diasRestantes();
    days.value = [];
  }
});

watch(year, async (val) => {
  days.value = [];
  if (val != null) {
    await justificanteStore.loadDiasRestantes(
      empleado_Id.value.value,
      year.value
    );
    diasRestantes();
  }
});

watch(empleado_Id, (val) => {
  if (val != null) {
    empleado(val);
  }
});

watch(days, (val) => {
  if (val != null) {
    if (tipo.value == "Vacaciones") {
      //resta los dias disponibles de vacaciones
      if (periodoVacacional.value.value == 1) {
        restanDias.value = dias_restantes.value.primer_Periodo - val.length;
      } else if (periodoVacacional.value.value == 2) {
        restanDias.value = dias_restantes.value.segundo_Periodo - val.length;
      }
    } else if (tipo.value == "Permiso día económico") {
      //resta los dias disponibles de permiso economico
      restanDias.value = dias_restantes.value.dias_Economicos - val.length;
    }
  }
});

//-----------------------------------------------------------

const cargarData = async () => {
  await justificanteStore.loadInformacionJustificante();
  await justificanteStore.loadCapturista();
};

const cargarArea = async (val) => {
  if (area_Id.value == null) {
    let areaFiltrado = areas.value.find((x) => x.value == `${val.area_Id}`);
    area_Id.value = areaFiltrado;
    await justificanteStore.loadPersonalArea(val.value, false);
    cargarSolicitante(val);
  }
};

const cargarSolicitante = async (val) => {
  if (empleado_Id.value == null) {
    let solicitanteFiltrado = listEmpleados.value.find(
      (x) => x.value == val.solicitante_Id
    );
    empleado_Id.value = solicitanteFiltrado;
    personalAutoriza.value = val.responsable_Area;
  }
};

const diasRestantes = async () => {
  await justificanteStore.loadAsignacionesVacaciones(year.value);
  if (tipo.value == "Permiso día económico") {
    restanDias.value = dias_restantes.value.dias_Economicos;
  } else if (tipo.value == "Vacaciones") {
    if (periodoVacacional.value.value == 1) {
      if (configuracion.value[0].tipo_Primer_Periodo == "Fijo") {
        vacacionesFijo.value = true;
        days.value = configuracion.value[0].fechas_Primer_Periodo.split(",");
      } else {
        vacacionesFijo.value = false;
        restanDias.value = dias_restantes.value.primer_Periodo;
      }
    } else if (periodoVacacional.value.value == 2) {
      if (configuracion.value[0].tipo_Segundo_Periodo == "Fijo") {
        vacacionesFijo.value = true;
        days.value = configuracion.value[0].fechas_Segundo_Periodo.split(",");
      } else {
        vacacionesFijo.value = false;
        restanDias.value = dias_restantes.value.segundo_Periodo;
      }
    }
  }
};

const empleado = async (val) => {
  justificante.value.responsable_Area = null;
  await justificanteStore.loadResponsabeAreaByEmpleado(val.value);
  await justificanteStore.loadDiasRestantes(val.value, year.value);
  if (!tipoJustificante.value.includes("Omisión de entrada")) {
    tipoJustificante.value.push("Omisión de entrada");
  }
  if (!tipoJustificante.value.includes("Omisión de salida")) {
    tipoJustificante.value.push("Omisión de salida");
  }
  if (!tipoJustificante.value.includes("Comisión oficial")) {
    tipoJustificante.value.push("Comisión oficial");
  }
  if (!tipoJustificante.value.includes("Permuta por día laborado")) {
    tipoJustificante.value.push("Permuta por día laborado");
  }
  if (!tipoJustificante.value.includes("Otros")) {
    tipoJustificante.value.push("Otros");
  }
  if (dias_restantes.value.dias_Economicos != 0) {
    if (!tipoJustificante.value.includes("Permiso día económico")) {
      tipoJustificante.value.push("Permiso día económico");
    }
  }
  if (
    dias_restantes.value.primer_Periodo != 0 ||
    dias_restantes.value.segundo_Periodo != 0
  ) {
    if (!tipoJustificante.value.includes("Vacaciones")) {
      tipoJustificante.value.push("Vacaciones");
    }
  }

  limpiarCampos();
};

const validateDates = () => {
  if (days.value != null) {
    if (tipo.value == "Permiso día económico") {
      if (days.value.length > dias_restantes.value.dias_Economicos) {
        days.value = days.value.slice(0, dias_restantes.value.dias_Economicos);
      }
    } else if (tipo.value == "Vacaciones") {
      if (periodoVacacional.value.value == 1) {
        if (days.value.length > dias_restantes.value.primer_Periodo) {
          days.value = days.value.slice(0, dias_restantes.value.primer_Periodo);
        }
      } else if (periodoVacacional.value.value == 2) {
        if (days.value.length > dias_restantes.value.segundo_Periodo) {
          days.value = days.value.slice(
            0,
            dias_restantes.value.segundo_Periodo
          );
        }
      }
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

const actualizarModal = async (valor) => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  justificanteStore.actualizarModal(valor);
  justificanteStore.updateVisualizar(false);
  justificanteStore.updateEditar(false);
  justificanteStore.updateEditarDetalle(false);
  await justificanteStore.loadCapturista();
  justificanteStore.initJustificante();
  limpiarCampos();
  listaIncidencias.value = [];
  empleado_Id.value = null;
  justificante.value.responsable_Area = null;
  area_Id.value = null;
  $q.loading.hide();
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
      vacacionesFijo.value == true
        ? tipo.value == null ||
          motivo.value == null ||
          empleado_Id.value == null
        : tipo.value == null ||
          motivo.value == null ||
          empleado_Id.value == null ||
          days.value == ""
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

          if (periodoVacacional.value.value == 1) {
            periodo = 1;
          } else if (periodoVacacional.value.value == 2) {
            periodo = 2;
          }
          detalle.value.tipo_Justificantes = tipo.value;
          detalle.value.motivo = motivo.value;
          detalle.value.primer_Periodo = 0;
          detalle.value.segundo_Periodo = 0;
          detalle.value.dias_Economicos = 0;
          detalle.value.periodo_Vacacional = periodo;
          detalle.value.year = year.value;
          resp = await justificanteStore.createDetalleJustificantes(
            justificante.value.id,
            detalle.value
          );
          if (resp.success === true) {
            $q.notify({
              position: "top-right",
              type: "positive",
              message: "Se creo con exito",
            });
            await justificanteStore.loadDetalleJustificantes(
              justificante.value.id
            );
          } else {
            $q.notify({
              position: "top-right",
              type: "negative",
              message: resp.data,
            });
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
          detalle.value.year = year.value;
          resp = await justificanteStore.createDetalleJustificantes(
            justificante.value.id,
            detalle.value
          );
          if (resp.success === true) {
            $q.notify({
              position: "top-right",
              type: "positive",
              message: "Se creo con exito",
            });
            await justificanteStore.loadDetalleJustificantes(
              justificante.value.id
            );
          } else {
            $q.notify({
              position: "top-right",
              type: "negative",
              message: resp.data,
            });
          }
        }

        justificanteStore.updateEditarDetalle(false);
        limpiarCampos();
      } else {
        if (tipo.value == "Vacaciones") {
          let periodo;
          if (periodoVacacional.value.value == 1) {
            periodo = 1;
          } else if (periodoVacacional.value.value == 2) {
            periodo = 2;
          }
          const resultado = days.value.join(", ");
          detalle.value.dias_Incidencias = resultado;
          detalle.value.tipo_Justificantes = tipo.value;
          detalle.value.motivo = motivo.value;
          detalle.value.periodo_Vacacional = periodo;
          detalle.value.dias_Economicos = 0;
          detalle.value.year = year.value;
          await justificanteStore.addIncidencia(
            resultado,
            motivo.value,
            tipo.value,
            periodo,
            year.value
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
          detalle.value.year = year.value;
          await justificanteStore.addIncidencia(
            resultado,
            motivo.value,
            tipo.value,
            0,
            year.value
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

  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
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
    if (isPersonal.value != true) {
      justificante.value.puesto_Solicitante_Id = empleado_Id.value.puesto_Id;
    }
    if (isEditar.value == true) {
    } else {
      resp = await justificanteStore.createJustificante(justificante.value);
      if (resp.success == true) {
        listaIncidencias.value.forEach(async (element) => {
          await justificanteStore.createDetalleJustificantes(resp.id, element);
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
