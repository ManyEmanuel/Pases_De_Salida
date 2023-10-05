<template>
  <q-dialog
    v-model="modal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section class="row">
        <div class="text-h6">Registro de pase</div>
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
        <q-form class="row q-col-gutter-xs" @submit="onSubmit">
          <div
            v-if="isEditar == true"
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
          >
            <q-input v-model="pase.folio" readonly label="Folio"> </q-input>
          </div>
          <div
            v-if="isEditar == true"
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
          >
            <q-input v-model="pase.estatus" readonly label="Estatus"> </q-input>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-select
              v-model="pase.tipo_Pase"
              :options="opcionTipoPase"
              label="Tipo de pase"
              hint="Seleccione un tipo de pase"
              lazy-rules
              :rules="[(val) => !!val || 'El tipo de pase es requerido']"
            >
            </q-select>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-select
              v-model="pase.tipo_Asunto"
              :options="opcionAsuntoPase"
              label="Asunto de pase"
              hint="Seleccione un asunto de pase"
              lazy-rules
              :rules="[(val) => !!val || 'El asunto de pase es requerido']"
            >
            </q-select>
          </div>
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
              v-model="pase.responsable_Area"
              disable
              label="Persona que autoriza"
            >
            </q-input>
          </div>
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-select
              v-model="empleado_Id"
              :options="empleados"
              :readonly="personalRead"
              label="Nombre del empleado"
              hint="Seleccione un empleado"
              lazy-rules
              :rules="[(val) => !!val || 'El empleado es requerido']"
            >
            </q-select>
          </div>
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-input v-model="pase.puesto_Solicitante" disable label="Puesto">
            </q-input>
          </div>

          <div
            v-if="verEntrada == true"
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
          >
            <q-input
              label="Fecha y hora de entrada"
              hint="Ingrese fecha y hora (Formato 24 horas)"
              v-model="pase.entrada"
              lazy-rules
              :rules="[
                (val) => !!val || 'La hora y fecha de entrada es requerida',
              ]"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="pase.entrada"
                      :locale="myLocale"
                      mask="YYYY-MM-DD HH:mm"
                      :options="FiltroFecha"
                      color="purple"
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Cerrar"
                          color="black"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-time
                      v-model="pase.entrada"
                      mask="YYYY-MM-DD HH:mm"
                      :hour-options="horasHabiles"
                      color="purple"
                      format24h
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Cerrar"
                          color="black"
                          flat
                        />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div
            v-if="verSalida == true"
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
          >
            <q-input
              label="Fecha y hora de salida"
              hint="Ingrese fecha y hora (Formato 24 horas)"
              v-model="pase.salida"
              lazy-rules
              :rules="[
                (val) => !!val || 'La hora y fecha de salia es requerida',
              ]"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="pase.salida"
                      :locale="myLocale"
                      mask="YYYY-MM-DD HH:mm"
                      color="purple"
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Cerrar"
                          color="black"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-time
                      v-model="pase.salida"
                      :hour-options="horasHabiles"
                      mask="YYYY-MM-DD HH:mm"
                      color="purple"
                      format24h
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Cerrar"
                          color="black"
                          flat
                        />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div
            v-if="verLlegada == true"
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
          >
            <q-input
              label="Hora estimada de llegada"
              hint="Ingrese hora estimada de llegada (Formato 24 horas)"
              v-model="pase.llegada"
              lazy-rules
              :rules="[(val) => !!val || 'La hora estimada es requerida']"
            >
              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-time
                      v-model="pase.llegada"
                      mask="HH:mm"
                      :hour-options="horasLlegada"
                      color="purple"
                      format24h
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Cerrar"
                          color="black"
                          flat
                        />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

          <div
            v-if="verCombo == true"
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12 text-center"
          >
            <q-checkbox
              v-model="verVehiculo"
              size="lg"
              color="green"
              label="Solicitar vehículo oficial (Chofer o pasajero)"
            />
            <br />
            <q-option-group
              v-if="verVehiculo == true"
              v-model="rol"
              :options="opcionesRol"
              color="purple"
              left-label
              inline
            />
          </div>
          <div
            v-if="verVehiculo == true && rol == 'Chofer'"
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
          >
            <q-select
              v-model="vehiculo_Id"
              :options="vehiculos"
              label="Vehiculos disponibles"
              hint="Seleccione un vehiculo"
              :loading="loadingVehiculo"
            >
            </q-select>
          </div>
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-input
              v-model="pase.asunto"
              label="Asunto"
              autogrow
              counter
              maxlength="500"
              hint="Máximo 500 carácteres"
            >
            </q-input>
          </div>
          <q-space />
          <div class="col-12 justify-end">
            <div class="text-right q-gutter-xs">
              <q-btn
                label="Cancelar"
                type="reset"
                color="negative"
                @click="actualizarModal(false)"
              />
              <q-btn
                label="Guardar"
                type="submit"
                color="positive"
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
import { onBeforeMount, ref, watch, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { useQuasar, date } from "quasar";
import { useAuthStore } from "../../../stores/auth_store";
import { useRegistroPaseStore } from "../../../stores/registro_Pase_store";

const $q = useQuasar();
const pasesStore = useRegistroPaseStore();
const authStore = useAuthStore();
let verLlegada = ref(false);
let verEntrada = ref(false);
let verSalida = ref(false);
let verVehiculo = ref(false);
let verCombo = ref(false);
let areaRead = ref(false);
let personalRead = ref(false);
let rol = ref("Chofer");
let opcionesRol = ref([
  { label: "Chofer", value: "Chofer" },
  { label: "Pasajero", value: "Pasajero" },
]);
const tipoPase = ref(null);
const asuntoPase = ref(null);
const filtrarFecha = ref("");
const opcionTipoPase = ref(["Entrada", "Intermedio", "Salida"]);
const opcionAsuntoPase = ref(["Oficial", "Médico", "Personal"]);
const area_Id = ref(null);
const horasHabiles = [8, 9, 10, 11, 12, 13, 14, 15, 16];
const horasLlegada = [
  8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
];
const empleado_Id = ref(null);
const vehiculo_Id = ref(null);
const loadingVehiculo = ref(false);

const { pase, modal, areas, empleados, myLocale, vehiculos, isEditar } =
  storeToRefs(pasesStore);

const actualizarModal = (valor) => {
  pasesStore.actualizarModal(valor);
  pasesStore.initPase();
  empleado_Id.value = null;
  area_Id.value = null;
  vehiculo_Id.value = null;
  verVehiculo.value = false;
};

onBeforeMount(() => {
  pasesStore.loadInformacionPase();
  //pasesStore.loadVehiculos();
});

watch(area_Id, (val) => {
  if (area_Id.value != null) {
    empleado_Id.value = null;
    pase.value.puesto_Solicitante = null;
    pasesStore.loadPersonalArea(area_Id.value.value);
    pasesStore.loadResponsabeArea(area_Id.value.value);
  }
});

watch(empleado_Id, (val) => {
  if (val != null) {
    pasesStore.loadPuestoPersonal(empleado_Id.value.value);
  }
});

watchEffect(async () => {
  if (pase.value.llegada != null) {
    loadingVehiculo.value = true;
    let fecha = pase.value.salida.split(" ");
    let fechaRegreso = fecha[0] + " " + pase.value.llegada;
    await pasesStore.loadVehiculos(pase.value.salida, fechaRegreso);
    loadingVehiculo.value = false;
  }
});

const FiltroFecha = (fechha) => {
  const today = new Date();
  let diaSemana = today.getDay();
  let diasContar = 3;
  if (diaSemana <= 3) {
    diasContar = 5;
  }

  filtrarFecha.value = date.formatDate(today, "YYYY/MM/DD");
  let filtro = calcularFechaNueva(filtrarFecha.value, diasContar);
  return fechha >= filtro;
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

watch(pase.value, (val) => {
  if (val.tipo_Pase != null) {
    if (val.tipo_Pase == "Entrada") {
      verEntrada.value = true;
      verLlegada.value = false;
      verSalida.value = false;
      verCombo.value = false;
    } else if (val.tipo_Pase == "Intermedio") {
      verEntrada.value = false;
      verLlegada.value = true;
      verSalida.value = true;
      verCombo.value = true;
    } else if (val.tipo_Pase == "Salida") {
      verEntrada.value = false;
      verLlegada.value = false;
      verSalida.value = true;
      verCombo.value = false;
    }
  }
  if (val.id != null) {
    cargarArea(val);
    cargarEmpleado(val);
    cargarVehiculo(val);
    if (val.rol != null) {
      rol.value = val.rol;
    }
  }
  if (val.area_Id != null) {
    let areaFiltrada = areas.value.find((x) => x.value == val.area_Id);
    area_Id.value = areaFiltrada;
    areaRead.value = true;
  }
  if (val.solicitante_Id != null) {
    let personalFiltrado = empleados.value.find(
      (x) => x.value == val.solicitante_Id
    );
    empleado_Id.value = personalFiltrado;
    personalRead.value = true;
  }
});
//empleado_Id.value = null;
//area_Id.value = null;
//vehiculo_Id.value = null;
const cargarArea = async (val) => {
  if (area_Id.value == null) {
    let areaFiltrado = areas.value.find((x) => x.value == `${val.area_Id}`);
    area_Id.value = areaFiltrado;
  }
};

const cargarEmpleado = async (val) => {
  if (empleado_Id.value == null) {
    let empleadoFiltrado = empleados.value.find(
      (x) => x.value == `${val.solicitante_Id}`
    );
    empleado_Id.value = empleadoFiltrado;
  }
};

const cargarVehiculo = async (val) => {
  if (vehiculo_Id.value == null) {
    if (val.vehiculo_Id != null) {
      console.log("Si entro al vehiculo");
      verVehiculo.value = true;
      let vehiculoFiltrado = vehiculos.value.find(
        (x) => x.value == `${val.vehiculo_Id}`
      );
      vehiculo_Id.value = vehiculoFiltrado;
    } else {
      verVehiculo.value = false;
    }
  }
};

const onSubmit = async () => {
  let resp = null;
  $q.loading.show();
  pase.value.solicitante_Id = empleado_Id.value.value;
  pase.value.area_Id = area_Id.value.value;
  if (verVehiculo.value == true) {
    pase.value.rol = rol.value;
  }
  if (vehiculo_Id.value != null) {
    if (rol.value == "Chofer") {
      pase.value.vehiculo_Id = vehiculo_Id.value.value;
    }
  }
  if (pase.value.tipo_Pase != "Intermedio") {
    if (isEditar.value == true) {
      resp = await pasesStore.updatePase(pase.value);
    } else {
      resp = await pasesStore.createPase(pase.value);
    }

    if (resp.success) {
      $q.notify({
        type: "positive",
        message: resp.data,
      });
      pasesStore.loadPases();
      actualizarModal(false);
    } else {
      $q.notify({
        type: "negative",
        message: resp.data,
      });
      //loading.value = false;
    }
  } else {
    let comparacion;
    comparacion = await pasesStore.compareHoras();
    if (comparacion.success == true) {
      if (isEditar.value == true) {
        resp = await pasesStore.updatePase(pase.value);
      } else {
        resp = await pasesStore.createPase(pase.value);
      }
      if (resp.success) {
        $q.notify({
          type: "positive",
          message: resp.data,
        });
        pasesStore.loadPases();
        actualizarModal(false);
      } else {
        $q.notify({
          type: "negative",
          message: resp.data,
        });
        //loading.value = false;
      }
    } else {
      $q.notify({
        type: "negative",
        message: comparacion.data,
      });
    }
  }

  $q.loading.hide();
};
</script>
