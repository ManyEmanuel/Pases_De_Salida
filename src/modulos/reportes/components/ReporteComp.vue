<template>
  <div class="row q-pt-lg">
    <div class="col-lg-2 col-md-2 col-sm-12 col-xs-12 q-pt-xs text-center">
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
      class="col-lg-2 col-md-2 col-sm-12 col-xs-12 q-pt-xs q-pr-xs text-right"
    >
      <q-select
        :options="tipos"
        color="purple-ieen"
        label="Tipo"
        filled
        dense
        v-model="tipo"
      />
    </div>
    <div
      class="col-lg-2 col-md-2 col-sm-12 col-xs-12 q-pt-xs q-pr-xs text-right"
    >
      <q-select
        v-if="buscar_Por == 'año'"
        label="Buscar por año"
        filled
        dense
        color="purple-ieen"
        v-model="year"
        :options="años"
      />
      <q-input
        v-else
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
                :options="optionsCalendar"
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
    <div class="col-lg-2 col-md-2 col-sm-6 col-xs-6 q-pt-xs">
      <q-select
        filled
        dense
        v-show="administracion == true"
        class="q-pr-xs"
        v-model="area_Id"
        :options="areas"
        color="purple-ieen"
        label="Buscar por área"
        hint="Seleccione un área"
      >
      </q-select>
    </div>
    <div class="col-lg-2 col-md-2 col-sm-6 col-xs-6 q-pt-xs q-pr-xs">
      <q-select
        filled
        dense
        v-show="administracion == true"
        v-model="empleado_Id"
        :options="listEmpleados"
        color="purple-ieen"
        label="Buscar por personal"
        hint="Seleccione personal"
      >
      </q-select>
    </div>
    <div class="col-lg-2 col-md-2 col-sm-6 col-xs-12 text-center">
      <q-btn
        label="Buscar"
        type="button"
        color="purple-ieen"
        icon-right="search"
        @click="cargarTabla"
        class="q-ma-xs"
      />
      <q-btn
        v-if="listFiltroReporte.length > 0"
        class="q-ma-xs"
        type="button"
        color="purple-ieen"
        icon-right="download"
        @click="descargarExcel"
      />
    </div>
  </div>
  <div class="row q-pt-lg">
    <div class="col">
      <q-table
        :grid="$q.screen.xs"
        :rows="listFiltroReporte"
        :columns="columns"
        :filter="filter"
        :pagination="pagination"
        rows-per-page-label="Filas por pagina"
        :rows-per-page-options="[5, 10, 15, 20, 25, 50]"
        no-data-label="No hay registros"
        :visible-columns="visible_Columns"
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
        <template v-if="$q.screen.xs" v-slot:item="props">
          <div
            class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
          >
            <q-card bordered class="no-shadow">
              <q-list dense>
                <q-item v-for="col in props.cols" :key="col.name">
                  <q-item-section>
                    <q-item-label class="text-bold"
                      >{{ col.label }}:</q-item-label
                    >
                  </q-item-section>
                  <q-item-section class="flex-center">
                    <div v-if="col.name === 'permiso_Economico'">
                      <q-badge color="purple-3">
                        {{
                          `${configuracion[0].dias_Economicos - col.value}/${
                            configuracion[0].dias_Economicos
                          }`
                        }}
                      </q-badge>
                    </div>
                    <div v-else-if="col.name === 'vacaciones_P1'">
                      <q-badge color="purple-3">
                        {{
                          `${
                            configuracion[0].dias_Primer_Periodo - col.value
                          }/${configuracion[0].dias_Primer_Periodo}`
                        }}
                      </q-badge>
                    </div>
                    <div v-else-if="col.name === 'vacaciones_P2'">
                      <q-badge color="purple-3">
                        {{
                          `${
                            configuracion[0].dias_Segundo_Periodo - col.value
                          }/${configuracion[0].dias_Segundo_Periodo}`
                        }}
                      </q-badge>
                    </div>
                    <label v-else-if="col.name == 'empleado'">{{
                      col.value
                    }}</label>
                    <label v-else>
                      <q-badge color="grey">
                        {{ col.value }}
                      </q-badge>
                    </label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </div>
        </template>
        <template v-else v-slot:body="props">
          <q-tr :props="props">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <div v-if="col.name === 'permiso_Economico'">
                <q-badge color="purple-3">
                  {{ `${col.value}/${configuracion[0].dias_Economicos}` }}
                </q-badge>
              </div>
              <div v-else-if="col.name === 'vacaciones_P1'">
                <q-badge color="purple-3">
                  {{ `${col.value}/${configuracion[0].dias_Primer_Periodo}` }}
                </q-badge>
              </div>
              <div v-else-if="col.name === 'vacaciones_P2'">
                <q-badge color="purple-3">
                  {{
                    `${col.value}/${
                      configuracion[0].dias_Segundo_Periodo == null
                        ? 10
                        : configuracion[0].dias_Segundo_Periodo
                    }`
                  }}
                </q-badge>
              </div>
              <label v-else-if="col.name == 'empleado'" class="text-bold">{{
                col.value
              }}</label>
              <div
                v-else-if="
                  col.name == 'omision_Entrada' ||
                  col.name == 'omision_Salida' ||
                  col.name == 'comision_Oficial' ||
                  col.name == 'permuta_Laboral' ||
                  col.name == 'otros' ||
                  col.name == 'justificantes'
                "
              >
                <q-badge color="purple-3">
                  {{ col.value }}
                </q-badge>
              </div>
              <label v-else>
                <q-badge color="grey">
                  {{ col.value }}
                </q-badge>
              </label>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useQuasar, QSpinnerFacebook } from "quasar";
import { useJustificanteStore } from "src/stores/justificantes_store";
import { useSolicitudJustificanteStore } from "src/stores/solicitudes_Justificantes_store";
import { onBeforeMount, ref, watch, watchEffect } from "vue";
import { useRegistroGeneralStore } from "src/stores/registro_General_store";
import Swal from "sweetalert2";

const $q = useQuasar();
const solicitudesJustificantesStore = useSolicitudJustificanteStore();
const registroGeneralStore = useRegistroGeneralStore();
const justificanteStore = useJustificanteStore();
const {
  listFiltroReporte,
  listReporte,
  configuracion,
  administracion,
  areas,
  listEmpleados,
} = storeToRefs(justificanteStore);
const { list_Justificantes_Todos } = storeToRefs(solicitudesJustificantesStore);
const props = defineProps({
  tipo: {
    type: String,
  },
});
const tipo = ref("Todos");
const tipos = ref(["Todos", "Pases de salida", "Justificantes"]);
const area_Id = ref(null);
const empleado_Id = ref(null);
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
const startYear = 2022;
const visible_Columns = ref([
  "empleado",
  "pases",
  "pases_Oficial_Entrada",
  "pases_Medico_Entrada",
  "pases_Personales_Entrada",
  "pases_Oficial_Salida",
  "pases_Medico_Salida",
  "pases_Personal_Salida",
  "pases_Oficial_Intermedio",
  "pases_Medico_Intermedio",
  "pases_Personal_Intermedio",
  "justificantes",
  "omision_Entrada",
  "omision_Salida",
  "comision_Oficial",
  "permuta_Laboral",
  "otros",
  "permiso_Economico",
  "vacaciones_P1",
  "vacaciones_P2",
]);
//-----------------------------------------------------------
//Get fecha actual
const newDate = new Date();
const year = ref(newDate.getFullYear());
const month = String(newDate.getMonth() + 1).padStart(2, "0");
const day = String(newDate.getDate()).padStart(2, "0");
const dateActual = ref(`${year.value}/${month}/${day}`);
const date = ref({ from: `${year.value}/01/01`, to: `${year.value}/12/31` });

//-----------------------------------------------------------

onBeforeMount(() => {
  cargarData();
  listReporte.value = [];
  area_Id.value = { value: 0, label: "Todos" };
  empleado_Id.value = { value: 0, label: "Todos" };
});

//-----------------------------------------------------------

watch(rango_Fecha, (val) => {
  if (val != null) {
    textoFecha.value = `${val.from} hasta ${val.to}`;
  }
});

watch(area_Id, (val) => {
  if (val != null) {
    justificanteStore.loadPersonalArea(val.value, true);
  }
});

watch(buscar_Por, (val) => {
  if (val != null) {
    rango_Fecha.value = null;
    textoFecha.value = null;
  }
});

//-----------------------------------------------------------

const cargarData = async () => {
  for (let yearLit = startYear; yearLit <= year.value; yearLit++) {
    años.value.push(yearLit);
  }
  await justificanteStore.loadAsignacionesVacaciones(year.value);
  await justificanteStore.loadListAreas();
  justificanteStore.isAdministracion();
  tipo.value = "Todos";
  cargarTabla();
};

const optionsCalendar = (date) => {
  return date <= dateActual.value;
};

const cargarTabla = async () => {
  if (buscar_Por.value == "rango" && rango_Fecha.value == null) {
    Swal.fire({
      title: "Atención",
      text: "No seleccionó rango de fecha",
      icon: "warning",
      showConfirmButton: true,
      confirmButtonText: "Regresar",
    });
  } else {
    $q.loading.show({
      spinner: QSpinnerFacebook,
      spinnerColor: "purple-ieen",
      spinnerSize: 140,
      backgroundColor: "purple-3",
      message: "Espere un momento, por favor...",
      messageColor: "black",
    });
    if (buscar_Por.value == "año") {
      date.value = { from: `${year.value}/01/01`, to: `${year.value}/12/31` };
    }
    await justificanteStore.reporteJustificantes(
      buscar_Por.value == "año" ? date.value : rango_Fecha.value
    );
  }
  const filtro = {};
  if (area_Id.value != null) filtro.area = area_Id.value.value;
  if (empleado_Id.value != null) filtro.empleado = empleado_Id.value.value;
  filtrar(listReporte.value, filtro);
  cargarColumnas();
  $q.loading.hide();
};

const cargarColumnas = () => {
  switch (tipo.value) {
    case "Todos":
      visible_Columns.value = [
        "empleado",
        "pases",
        "pases_Oficial_Entrada",
        "pases_Medico_Entrada",
        "pases_Personales_Entrada",
        "pases_Oficial_Salida",
        "pases_Medico_Salida",
        "pases_Personal_Salida",
        "pases_Oficial_Intermedio",
        "pases_Medico_Intermedio",
        "pases_Personal_Intermedio",
        "justificantes",
        "omision_Entrada",
        "omision_Salida",
        "comision_Oficial",
        "permuta_Laboral",
        "otros",
        "permiso_Economico",
        "vacaciones_P1",
        "vacaciones_P2",
      ];
      break;
    case "Pases de salida":
      visible_Columns.value = [
        "empleado",
        "pases",
        "pases_Oficial_Entrada",
        "pases_Medico_Entrada",
        "pases_Personales_Entrada",
        "pases_Oficial_Salida",
        "pases_Medico_Salida",
        "pases_Personal_Salida",
        "pases_Oficial_Intermedio",
        "pases_Medico_Intermedio",
        "pases_Personal_Intermedio",
      ];
      break;
    case "Justificantes":
      visible_Columns.value = [
        "empleado",
        "justificantes",
        "omision_Entrada",
        "omision_Salida",
        "comision_Oficial",
        "permuta_Laboral",
        "otros",
        "permiso_Economico",
        "vacaciones_P1",
        "vacaciones_P2",
      ];
      break;
    default:
      break;
  }
};

// const crearReporte = async () => {
//   if (Object.keys(listReporte.value).length == 0) {
//     $q.dialog({
//       title: "Atención",
//       message: "Seleccione un rango de fechas",
//       icon: "Warning",
//       persistent: true,
//       transitionShow: "scale",
//       transitionHide: "scale",
//     });
//   } else {
//     $q.loading.show({
//       spinner: QSpinnerFacebook,
//       spinnerColor: "purple-ieen",
//       spinnerSize: 140,
//       backgroundColor: "purple-3",
//       message: "Espere un momento, por favor...",
//       messageColor: "black",
//     });
//     ReporteGeneralJustificantes(date.value);
//     $q.loading.hide();
//   }
// };

//-----------------------------------------------------------

const filtrar = (listReporte, filtro) => {
  listFiltroReporte.value = listReporte.filter((item) => {
    let cumple = true;
    if (filtro.area !== undefined) {
      if (filtro.area == 0) {
        cumple = cumple && item.area_Id === item.area_Id;
      } else {
        cumple = cumple && item.area_Id == filtro.area;
      }
    }
    if (filtro.empleado !== undefined) {
      if (filtro.empleado == 0) {
        cumple = cumple && item.empleado_Id === item.empleado_Id;
      } else {
        cumple = cumple && item.empleado_Id === filtro.empleado;
      }
    }
    return cumple;
  });
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
  await registroGeneralStore.downloadExcel(
    tipo.value == "Pases de salida" ? "Pases" : tipo.value,
    date.value.from,
    date.value.to
  );
  const link = document.createElement("a");
  link.href = registroGeneralStore.documentoExcel;
  link.setAttribute("download", `ReporteGeneral${tipo.value}.xlsx`);
  document.body.appendChild(link);
  link.click();
  $q.loading.hide();
};

//-----------------------------------------------------------

const columns = [
  {
    name: "empleado",
    align: "center",
    label: "Empleado",
    field: "empleado",
    sortable: true,
  },
  /*--------------*/
  {
    name: "pases",
    align: "center",
    label: "Total pases",
    field: "pases",
    sortable: true,
  },
  {
    name: "pases_Oficial_Entrada",
    align: "center",
    label: "Entrada oficial",
    field: "pases_Oficial_Entrada",
    sortable: true,
  },
  {
    name: "pases_Medico_Entrada",
    align: "center",
    label: "Entrada médico",
    field: "pases_Medico_Entrada",
    sortable: true,
  },
  {
    name: "pases_Personales_Entrada",
    align: "center",
    label: "Entrada personal",
    field: "pases_Personales_Entrada",
    sortable: true,
  },
  {
    name: "pases_Oficial_Salida",
    align: "center",
    label: "Salida oficial",
    field: "pases_Oficial_Salida",
    sortable: true,
  },
  {
    name: "pases_Medico_Salida",
    align: "center",
    label: "Salida médico",
    field: "pases_Medico_Salida",
    sortable: true,
  },
  {
    name: "pases_Personal_Salida",
    align: "center",
    label: "Salida personal",
    field: "pases_Personal_Salida",
    sortable: true,
  },
  {
    name: "pases_Oficial_Intermedio",
    align: "center",
    label: "Intermedio oficial",
    field: "pases_Oficial_Intermedio",
    sortable: true,
  },
  {
    name: "pases_Medico_Intermedio",
    align: "center",
    label: "Intermedio médico",
    field: "pases_Medico_Intermedio",
    sortable: true,
  },
  {
    name: "pases_Personal_Intermedio",
    align: "center",
    label: "Intermedio personal",
    field: "pases_Personal_Intermedio",
    sortable: true,
  },
  /*----*/
  {
    name: "justificantes",
    align: "center",
    label: "Total Justificaciones",
    field: "justificantes",
    sortable: true,
  },
  {
    name: "omision_Entrada",
    align: "center",
    label: "Omisión de entrada",
    field: "omision_Entrada",
    sortable: true,
  },
  {
    name: "omision_Salida",
    align: "center",
    label: "Omisión de salida",
    field: "omision_Salida",
    sortable: true,
  },
  {
    name: "comision_Oficial",
    align: "center",
    label: "Comisión oficial",
    field: "comision_Oficial",
    sortable: true,
  },
  {
    name: "permuta_Laboral",
    align: "center",
    label: "Permuta por día laborado",
    field: "permuta_Laboral",
    sortable: true,
  },
  {
    name: "otros",
    align: "center",
    label: "Otros",
    field: "otros",
    sortable: true,
  },
  {
    name: "permiso_Economico",
    align: "center",
    label: "Permiso por día económico",
    field: "permiso_Economico",
    sortable: true,
  },
  {
    name: "vacaciones_P1",
    align: "center",
    label: "Vacaciones primer periodo",
    field: "vacaciones_P1",
    sortable: true,
  },
  {
    name: "vacaciones_P2",
    align: "center",
    label: "Vacaciones segundo periodo",
    field: "vacaciones_P2",
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
