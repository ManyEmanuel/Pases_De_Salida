<template>
  <q-page>
    <div class="row bg-grey-1">
      <div class="col-9">
        <div class="q-pa-md q-gutter-sm">
          <div class="text-gray-ieen-1 text-h6">
            Registro general de pases y justificantes
          </div>
          <q-breadcrumbs>
            <template v-slot:separator>
              <q-icon size="1.5em" name="chevron_right" color="primary" />
            </template>
            <q-breadcrumbs-el icon="home" label="Inicio" to="/" />
            <q-breadcrumbs-el
              class="text-grey-7"
              label="Registro general de pases"
            />
          </q-breadcrumbs>
        </div>
      </div>
    </div>
    <div class="row q-pa-lg">
      <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">
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
        class="col-lg-2 col-md-3 col-sm-3 col-xs-12"
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
      <div v-else class="col-lg-3 col-md-6 col-sm-4 col-xs-12">
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
      <div class="col-lg-3 col-md-2 col-sm-2 col-xs-6 text-right">
        <q-btn
          color="purple-ieen"
          icon="picture_as_pdf"
          @click="crearReporte()"
        >
          <q-tooltip>Generar reporte con la información de la tabla</q-tooltip>
        </q-btn>
      </div>
    </div>
    <div class="q-pa-lg">
      <q-card class="col">
        <q-tabs
          v-model="tab"
          align="justify"
          class="bg-grey-3 text-grey"
          active-color="purple-ieen"
          indicator-color="purple-ieen"
        >
          <q-tab name="pases" label="Solicitudes pases" />
          <q-tab name="justificantes" label="Solicitudes justificantes" />
        </q-tabs>
        <q-separator />
        <q-tab-panels v-model="tab" animated class="text-right">
          <q-tab-panel name="pases">
            <TablaComp
              :tipo="tab"
              :tab="tab"
              v-if="modulo == null ? false : modulo.leer"
            />
          </q-tab-panel>
          <q-tab-panel name="justificantes">
            <TablaComp
              :tipo="tab"
              :tab="tab"
              v-if="modulo == null ? false : modulo.leer"
            />
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
    <ModalConsulta />
    <ModalFiltro />
    <ModalComp />
  </q-page>
</template>
<script setup>
import { useQuasar, QSpinnerFacebook } from "quasar";
import { useAuthStore } from "../../../stores/auth_store";
import { onBeforeMount, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useRegistroGeneralStore } from "../../../stores/registro_General_store";
import { useSolicitudJustificanteStore } from "src/stores/solicitudes_Justificantes_store";
import TablaComp from "../components/TablaComp.vue";
import ModalConsulta from "src/modulos/registro_Pase/components/ModalConsulta.vue";
import ModalFiltro from "../components/ModalFiltro.vue";
import Swal from "sweetalert2";
import ReportePasesJustificantes from "src/helpers/ReportePasesJustificantes";
import ModalComp from "../../justificantes/components/ModalComp.vue";

//-----------------------------------------------------------

const $q = useQuasar();
const authStore = useAuthStore();
const generalStore = useRegistroGeneralStore();
const solicitudesJustificantesStore = useSolicitudJustificanteStore();
const { modulo } = storeToRefs(authStore);
const { pasesGeneral, pasesGeneralFiltrado, listAreas } =
  storeToRefs(generalStore);
const { list_Justificantes_Todos, list_Justificantes_Todos_Filtrado } =
  storeToRefs(solicitudesJustificantesStore);
const startYear = 2023;
const siglas = "PS-GEN-ADM";
const area_Id = ref({ value: 0, label: "Todos" });
const tab = ref("pases");
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
const list_Areas_Filtro = ref([]);
const años = ref([]);

//-----------------------------------------------------------

onBeforeMount(() => {
  leerPermisos();
  cargarData();
});

//-----------------------------------------------------------

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

//-----------------------------------------------------------

const cargarData = async () => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  for (let yearLit = startYear; yearLit <= year.value; yearLit++) {
    años.value.push(yearLit);
  }
  await generalStore.loadPasesGeneral();
  await generalStore.loadAreasList();
  await solicitudesJustificantesStore.loadJustificantesTodos();
  let list = listAreas.value;
  list_Areas_Filtro.value = list.splice(0, 0, {
    value: 0,
    label: "Todos",
  });
  buscar();
  $q.loading.hide();
};

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

const crearReporte = async () => {
  Swal.fire({
    title: "¿Cuál reporte desea generar?",
    text: "Se generará un reporte con la información de la tabla correspondiente",
    showDenyButton: true,
    confirmButtonText: "Pases de salida",
    denyButtonText: "Justificantes",
    confirmButtonColor: "purple",
    denyButtonColor: "purple",
  }).then(async (result) => {
    if (result.isConfirmed) {
      $q.loading.show({
        spinner: QSpinnerFacebook,
        spinnerColor: "purple-ieen",
        spinnerSize: 140,
        backgroundColor: "purple-3",
        message: "Espere un momento, por favor...",
        messageColor: "black",
      });
      await ReportePasesJustificantes("pases");
      $q.loading.hide();
    } else if (result.isDenied) {
      $q.loading.show({
        spinner: QSpinnerFacebook,
        spinnerColor: "purple-ieen",
        spinnerSize: 140,
        backgroundColor: "purple-3",
        message: "Espere un momento, por favor...",
        messageColor: "black",
      });
      await ReportePasesJustificantes("justificantes");
      $q.loading.hide();
    }
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
    list_Justificantes_Todos_Filtrado.value =
      list_Justificantes_Todos.value.filter((element) => {
        let yearSolicitud = element.fecha_Creacion.split(" ")[0].split("/")[2];
        if (area_Id.value.value == 0) {
          return yearSolicitud == year.value;
        } else {
          return (
            yearSolicitud == year.value &&
            element.area_Id == area_Id.value.value
          );
        }
      });
    pasesGeneralFiltrado.value = pasesGeneral.value.filter((element) => {
      let yearSolicitud = element.fechaSolicitud.split("-")[2];
      if (area_Id.value.value == 0) {
        return yearSolicitud == year.value;
      } else {
        return (
          yearSolicitud == year.value && element.area_Id == area_Id.value.value
        );
      }
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
      list_Justificantes_Todos_Filtrado.value =
        list_Justificantes_Todos.value.filter((element) => {
          let fecha = element.fecha_Creacion.split(" ")[0];
          const fechaSolicitud = Date.parse(
            `${fecha.split("/")[2]}-${fecha.split("/")[1]}-${
              fecha.split("/")[0]
            }`
          );
          if (area_Id.value.value == 0) {
            return (
              fechaSolicitud >= fecha_Inicio && fechaSolicitud <= fecha_Fin
            );
          } else {
            return (
              fechaSolicitud >= fecha_Inicio &&
              fechaSolicitud <= fecha_Fin &&
              element.area_Id == area_Id.value.value
            );
          }
        });

      pasesGeneralFiltrado.value = pasesGeneral.value.filter((element) => {
        let fecha = element.fechaSolicitud.split("-");
        const fechaSolicitud = Date.parse(
          `${fecha[2]}-${fecha[1]}-${fecha[0]}`
        );
        if (area_Id.value.value == 0) {
          return fechaSolicitud >= fecha_Inicio && fechaSolicitud <= fecha_Fin;
        } else {
          return (
            fechaSolicitud >= fecha_Inicio &&
            fechaSolicitud <= fecha_Fin &&
            element.area_Id == area_Id.value.value
          );
        }
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

// const actualizarModal = (valor) => {
//   $q.loading.show({
//     spinner: QSpinnerFacebook,
//     spinnerColor: "purple-ieen",
//     spinnerSize: 140,
//     backgroundColor: "purple-3",
//     message: "Espere un momento, por favor...",
//     messageColor: "black",
//   });
//   generalStore.actualizarModalFiltro(valor);
//   $q.loading.hide();
// };
</script>
