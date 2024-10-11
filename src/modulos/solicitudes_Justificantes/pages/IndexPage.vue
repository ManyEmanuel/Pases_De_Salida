<template>
  <q-page>
    <div class="row bg-grey-1">
      <div class="col-9">
        <div class="q-pa-md q-gutter-sm">
          <div class="text-gray-ieen-1 text-h6">
            Solicitudes de justificantes
          </div>
          <q-breadcrumbs>
            <template v-slot:separator>
              <q-icon size="1.5em" name="chevron_right" color="primary" />
            </template>
            <q-breadcrumbs-el icon="home" label="Inicio" to="/" />
            <q-breadcrumbs-el
              class="text-grey-7"
              label="Solicitudes de justificantes"
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
    <ModalComp />
  </q-page>
</template>

<script setup>
import { useQuasar, QSpinnerFacebook } from "quasar";
import { onBeforeMount, ref, watch } from "vue";
import { useAuthStore } from "../../../stores/auth_store";
import { useSolicitudJustificanteStore } from "src/stores/solicitudes_Justificantes_store";
import { storeToRefs } from "pinia";
import TablaSolicitudes from "../components/TablaSolicitudes.vue";
import TablaHistorial from "../components/TablaHistorial.vue";
import ModalComp from "../components/ModalComp.vue";
import Swal from "sweetalert2";

//-----------------------------------------------------------

const $q = useQuasar();
const tab = ref("solicitudes");
const authStore = useAuthStore();
const solicitudJustificanteStore = useSolicitudJustificanteStore();
const {
  historial,
  historial_Filtrado,
  solicitudesArea,
  solicitudesArea_Filtrado,
  cargar,
} = storeToRefs(solicitudJustificanteStore);
const startYear = 2023;
const siglas = "PS-MIS-JUS";
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
      textoFecha.value = "de" + from + " hasta " + to;
    } else {
      textoFecha.value = val;
    }
  }
});

watch(cargar, (val) => {
  if (val == true) {
    cargarData();
    solicitudJustificanteStore.actualizarCargar(false);
  }
});

//-----------------------------------------------------------

const leerPermisos = async () => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  await authStore.loadModulo(siglas);
  $q.loading.hide();
};

const cargarData = async () => {
  for (let yearLit = startYear; yearLit <= year.value; yearLit++) {
    años.value.push(yearLit);
  }
  await solicitudJustificanteStore.loadSolicitudesJustificantes();
  await solicitudJustificanteStore.loadHistorialJustificante();
  historial_Filtrado.value = historial.value.filter((element) => {
    let yearSolicitud = element.fecha_Creacion.split(" ")[0].split("/")[2];
    return yearSolicitud == year.value;
  });
  solicitudesArea_Filtrado.value = solicitudesArea.value.filter((element) => {
    let yearSolicitud = element.fecha_Creacion.split(" ")[0].split("/")[2];
    return yearSolicitud == year.value;
  });
};

const buscar = async () => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  if (buscar_Por.value == "año") {
    historial_Filtrado.value = historial.value.filter((element) => {
      let yearSolicitud = element.fecha_Creacion.split(" ")[0].split("/")[2];
      return yearSolicitud == year.value;
    });
    solicitudesArea_Filtrado.value = solicitudesArea.value.filter((element) => {
      let yearSolicitud = element.fecha_Creacion.split(" ")[0].split("/")[2];
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
        let fecha = element.fecha_Creacion.split(" ")[0];
        const fechaSolicitud = Date.parse(
          `${fecha.split("/")[2]}-${fecha.split("/")[1]}-${fecha.split("/")[0]}`
        );
        return fechaSolicitud >= fecha_Inicio && fechaSolicitud <= fecha_Fin;
      });

      solicitudesArea_Filtrado.value = solicitudesArea.value.filter(
        (element) => {
          let fecha = element.fecha_Creacion.split(" ")[0];
          const fechaSolicitud = Date.parse(
            `${fecha.split("/")[2]}-${fecha.split("/")[1]}-${
              fecha.split("/")[0]
            }`
          );
          return fechaSolicitud >= fecha_Inicio && fechaSolicitud <= fecha_Fin;
        }
      );
    }
  }
  $q.loading.hide();
};

const descargarExcel = async () => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  await solicitudJustificanteStore.downloadExcel();
  const link = document.createElement("a");
  link.href = solicitudJustificanteStore.documentoExcel;
  link.setAttribute("download", "REPORTE_JUSTIFICANTE.xlsx");
  document.body.appendChild(link);
  link.click();
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
