<template>
  <q-page>
    <div class="row bg-grey-1">
      <div class="col-9">
        <div class="q-pa-md q-gutter-sm">
          <div class="text-gray-ieen-1 text-h6">Solicitudes del área</div>
          <q-breadcrumbs>
            <template v-slot:separator>
              <q-icon size="1.5em" name="chevron_right" color="primary" />
            </template>
            <q-breadcrumbs-el icon="home" label="Inicio" to="/" />
            <q-breadcrumbs-el
              class="text-grey-7"
              label="Solicitudes del área"
            />
          </q-breadcrumbs>
        </div>
      </div>
    </div>
    <div class="row q-pa-lg">
      <div class="col-lg-3 col-md-5 col-sm-6 col-xs-12">
        <b>Buscar por: </b>
        <q-btn-toggle
          v-model="buscar_Por"
          style="border: 1px solid #673e84"
          no-caps
          unelevated
          toggle-color="purple-ieen"
          color="white"
          text-color="purple-ieen"
          :options="[
            { label: 'Año', value: 'año' },
            { label: 'Rango de fecha', value: 'rango' },
          ]"
        />
      </div>
      <div
        v-if="buscar_Por == 'año'"
        class="col-lg-2 col-md-2 col-sm-3 col-xs-6"
      >
        <q-select
          filled
          dense
          color="purple-ieen"
          v-model="year"
          :options="años"
          label="Año"
        />
      </div>
      <div v-else class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
        <q-input
          dense
          color="purple-ieen"
          filled
          v-model="textoFecha"
          label="Fecha de consulta"
        >
          <template v-slot:append>
            <q-btn icon="event" color="purple-ieen" flat round>
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  :options="options"
                  v-model="rango_Fecha"
                  :locale="myLocale"
                  mask="YYYY-MM-DD"
                  color="purple-ieen"
                  range
                >
                  <div class="row items-center justify-end q-gutter-sm">
                    <q-btn
                      label="Aceptar"
                      color="purple-ieen"
                      flat
                      v-close-popup
                    />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-btn>
          </template>
        </q-input>
      </div>
      <div class="col-lg-2 col-md-3 col-sm-3 col-xs-6">
        <q-btn
          type="button"
          color="purple-ieen"
          icon-right="search"
          label="Buscar"
          @click="buscar"
        />
      </div>
    </div>
    <div class="row q-ma-lg">
      <div class="col-lg-4 col-md-3 col-sm-4 col-xs-12 q-pa-xs text-center">
        <q-card class="my-card bg-purple-1 q-ma-xs" style="border-radius: 10px">
          <q-item-label
            class="text-h6 q-pl-sm q-pt-sm purple-ieen text-bold text-purple-ieen"
          >
            Pases de entrada aprobados:
            {{
              solicitudes_Filtrado
                .concat(historial_Filtrado)
                .filter(
                  (x) => x.tipo_Pase == "Entrada" && x.estatus == "Aprobado"
                ).length
            }}</q-item-label
          ><br />
          <q-card-section horizontal>
            <div class="col-4 text-subtitle1 text-bold text-grey-8">
              Oficial:
              {{
                solicitudes_Filtrado
                  .concat(historial_Filtrado)
                  .filter(
                    (x) =>
                      x.tipo_Pase == "Entrada" &&
                      x.tipo_Asunto == "Oficial" &&
                      x.estatus == "Aprobado"
                  ).length
              }}
            </div>
            <div class="col-4 text-subtitle1 text-bold text-grey-8">
              Médico:
              {{
                solicitudes_Filtrado
                  .concat(historial_Filtrado)
                  .filter(
                    (x) =>
                      x.tipo_Pase == "Entrada" &&
                      x.tipo_Asunto == "Médico" &&
                      x.estatus == "Aprobado"
                  ).length
              }}
            </div>
            <div class="col-4 text-subtitle1 text-bold text-grey-8">
              Personal:
              {{
                solicitudes_Filtrado
                  .concat(historial_Filtrado)
                  .filter(
                    (x) =>
                      x.tipo_Pase == "Entrada" &&
                      x.tipo_Asunto == "Personal" &&
                      x.estatus == "Aprobado"
                  ).length
              }}
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-lg-4 col-md-3 col-sm-4 col-xs-12 q-pa-xs text-center">
        <q-card class="my-card bg-purple-1 q-ma-xs" style="border-radius: 10px">
          <q-item-label
            class="text-h6 q-pl-sm q-pt-sm purple-ieen text-bold text-purple-ieen"
          >
            Pases intermedios aprobados:
            {{
              solicitudes_Filtrado
                .concat(historial_Filtrado)
                .filter(
                  (x) => x.tipo_Pase == "Intermedio" && x.estatus == "Aprobado"
                ).length
            }}</q-item-label
          ><br />
          <q-card-section horizontal>
            <div class="col-4 text-subtitle1 text-bold text-grey-8">
              Oficial:
              {{
                solicitudes_Filtrado
                  .concat(historial_Filtrado)
                  .filter(
                    (x) =>
                      x.tipo_Pase == "Intermedio" &&
                      x.tipo_Asunto == "Oficial" &&
                      x.estatus == "Aprobado"
                  ).length
              }}
            </div>
            <div class="col-4 text-subtitle1 text-bold text-grey-8">
              Médico:
              {{
                solicitudes_Filtrado
                  .concat(historial_Filtrado)
                  .filter(
                    (x) =>
                      x.tipo_Pase == "Intermedio" &&
                      x.tipo_Asunto == "Médico" &&
                      x.estatus == "Aprobado"
                  ).length
              }}
            </div>
            <div class="col-4 text-subtitle1 text-bold text-grey-8">
              Personal:
              {{
                solicitudes_Filtrado
                  .concat(historial_Filtrado)
                  .filter(
                    (x) =>
                      x.tipo_Pase == "Intermedio" &&
                      x.tipo_Asunto == "Personal" &&
                      x.estatus == "Aprobado"
                  ).length
              }}
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-lg-4 col-md-3 col-sm-4 col-xs-12 q-pa-xs text-center">
        <q-card class="my-card bg-purple-1 q-ma-xs" style="border-radius: 10px">
          <q-item-label
            class="text-h6 q-pl-sm q-pt-sm purple-ieen text-bold text-purple-ieen"
          >
            Pases de salida aprobados:
            {{
              solicitudes_Filtrado
                .concat(historial_Filtrado)
                .filter(
                  (x) => x.tipo_Pase == "Salida" && x.estatus == "Aprobado"
                ).length
            }}</q-item-label
          ><br />
          <q-card-section horizontal>
            <div class="col-4 text-subtitle1 text-bold text-grey-8">
              Oficial:
              {{
                solicitudes_Filtrado
                  .concat(historial_Filtrado)
                  .filter(
                    (x) =>
                      x.tipo_Pase == "Salida" &&
                      x.tipo_Asunto == "Oficial" &&
                      x.estatus == "Aprobado"
                  ).length
              }}
            </div>
            <div class="col-4 text-subtitle1 text-bold text-grey-8">
              Médico:
              {{
                solicitudes_Filtrado
                  .concat(historial_Filtrado)
                  .filter(
                    (x) =>
                      x.tipo_Pase == "Salida" &&
                      x.tipo_Asunto == "Médico" &&
                      x.estatus == "Aprobado"
                  ).length
              }}
            </div>
            <div class="col-4 text-subtitle1 text-bold text-grey-8">
              Personal:
              {{
                solicitudes_Filtrado
                  .concat(historial_Filtrado)
                  .filter(
                    (x) =>
                      x.tipo_Pase == "Salida" &&
                      x.tipo_Asunto == "Personal" &&
                      x.estatus == "Aprobado"
                  ).length
              }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row justify-center q-pa-lg">
      <q-card class="col">
        <q-tabs
          v-model="tab"
          dense
          align="justify"
          class="bg-grey-3 text-grey"
          active-color="purple-ieen"
          indicator-color="purple-ieen"
        >
          <q-tab
            icon="pending"
            name="solicitudes"
            label="Solicitudes pendientes"
          />
          <q-tab
            icon="manage_search"
            name="historial"
            label="Historial de solicitudes"
          />
        </q-tabs>
        <q-separator />
        <q-tab-panels v-model="tab" animated class="text-right">
          <q-tab-panel name="solicitudes">
            <TablaSolicitudes />
          </q-tab-panel>
          <q-tab-panel name="historial">
            <TablaHistorial />
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
    <ModalConsulta />
  </q-page>
</template>

<script setup>
import { useQuasar, QSpinnerFacebook } from "quasar";
import { useAuthStore } from "../../../stores/auth_store";
import { onBeforeMount, ref, watch } from "vue";
import { useSolicitudPaseStore } from "src/stores/solicitudes_Pase_store";
import TablaHistorial from "../components/TablaHistorial.vue";
import TablaSolicitudes from "../components/TablaSolicitudes.vue";
import ModalConsulta from "src/modulos/registro_Pase/components/ModalConsulta.vue";
import { storeToRefs } from "pinia";

//-----------------------------------------------------------

const $q = useQuasar();
const authStore = useAuthStore();
const solicitudesPasesStore = useSolicitudPaseStore();
const {
  solicitudes,
  solicitudes_Filtrado,
  historial,
  historial_Filtrado,
  cargar,
} = storeToRefs(solicitudesPasesStore);
const tab = ref("solicitudes");
const siglas = "PS-SOL-PAS";
const hoy = new Date();
const year = ref(hoy.getFullYear());
const buscar_Por = ref("año");
const rango_Fecha = ref(null);
const textoFecha = ref(null);
const myLocale = {
  days: "Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado".split("_"),
  daysShort: "Dom_Lun_Mar_Mié_Jue_Vie_Sáb".split("_"),
  months:
    "Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre".split(
      "_"
    ),
  monthsShort: "Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic".split("_"),
  firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
  format24h: true,
  pluralDay: "dias",
};
const startYear = 2023;
const años = ref([]);

//-----------------------------------------------------------

onBeforeMount(() => {
  leerPermisos();
  cargarData();
});

watch(rango_Fecha, (val) => {
  if (val != null) {
    if (typeof val != "string") {
      let { from, to } = val;
      textoFecha.value = "del " + from + " hasta " + to;
    } else {
      textoFecha.value = val;
    }
  }
});

watch(buscar_Por, (val) => {
  if (val != null) {
    rango_Fecha.value = null;
    textoFecha.value = null;
    year.value = hoy.getFullYear();
  }
});

watch(cargar, (val) => {
  if (val == true) {
    cargarData();
    solicitudesPasesStore.actualizarCargar(false);
  }
});

//-----------------------------------------------------------

const leerPermisos = async () => {
  loading();
  await authStore.loadModulo(siglas);
  $q.loading.hide();
};

const cargarData = async () => {
  loading();
  for (let yearLit = startYear; yearLit <= year.value; yearLit++) {
    años.value.push(yearLit);
  }
  await solicitudesPasesStore.loadSolicitudes();
  await solicitudesPasesStore.loadHistorial();
  historial_Filtrado.value = historial.value.filter((element) => {
    let yearSolicitud = element.fechaSolicitud.split("-")[2];
    return yearSolicitud == year.value;
  });
  solicitudes_Filtrado.value = solicitudes.value.filter((element) => {
    let yearSolicitud = element.fechaSolicitud.split("-")[2];
    return yearSolicitud == year.value;
  });
  $q.loading.hide();
};

const loading = () => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
};

const buscar = async () => {
  loading();
  if (buscar_Por.value == "año") {
    historial_Filtrado.value = historial.value.filter((element) => {
      let yearSolicitud = element.fechaSolicitud.split("-")[2];
      return yearSolicitud == year.value;
    });
    solicitudes_Filtrado.value = solicitudes.value.filter((element) => {
      let yearSolicitud = element.fechaSolicitud.split("-")[2];
      return yearSolicitud == year.value;
    });
  } else {
    if (rango_Fecha.value == null || rango_Fecha.value == undefined) {
      Swal.fire({
        title: "Atención",
        text: "No seleccionó rango de fecha",
        icon: "warning",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      const fecha_Inicio = new Date(rango_Fecha.value.from);
      const fecha_Fin = new Date(rango_Fecha.value.to);
      historial_Filtrado.value = historial.value.filter((element) => {
        let fecha = element.fechaSolicitud.split("-");
        const fechaSolicitud = Date.parse(
          `${fecha[2]}-${fecha[1]}-${fecha[0]}`
        );
        return fechaSolicitud >= fecha_Inicio && fechaSolicitud <= fecha_Fin;
      });

      solicitudes_Filtrado.value = solicitudes.value.filter((element) => {
        let fecha = element.fechaSolicitud.split("-");
        const fechaSolicitud = Date.parse(
          `${fecha[2]}-${fecha[1]}-${fecha[0]}`
        );
        return fechaSolicitud >= fecha_Inicio && fechaSolicitud <= fecha_Fin;
      });
    }
  }
  $q.loading.hide();
};

const options = (date) => {
  const dateActual = new Date();
  const year = dateActual.getFullYear();
  const month = String(dateActual.getMonth() + 1).padStart(2, "0");
  const day = String(dateActual.getDate()).padStart(2, "0");
  const dateA = `${year}/${month}/${day}`;
  return date <= dateA;
};
</script>
