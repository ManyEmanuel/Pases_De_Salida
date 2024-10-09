<template>
  <div class="row q-pa-md">
    <div
      class="col-lg-10 col-md-10 col-sm-12 col-xs-12 text-right text-h6 text-grey-7"
    >
      <b>Seleccione un rango de fechas:</b> {{ nombreDate }}
    </div>
    <div class="col-lg-2 col-md-2 col-sm-12 col-xs-12 text-right">
      <q-btn
        type="button"
        color="purple-ieen"
        icon-right="calendar_month"
        label="Filtrar"
      >
        <q-tooltip>Filtrar por rango de fechas</q-tooltip>
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-date :options="optionsCalendar" color="purple" v-model="date" range
            ><div class="row items-center justify-end">
              <q-btn v-close-popup label="Cerrar" color="black" flat /></div
          ></q-date> </q-popup-proxy
      ></q-btn>
      <q-btn
        class="q-ml-sm q-mr-sm"
        color="purple-ieen"
        icon="picture_as_pdf"
        @click="crearReporte()"
      >
        <q-tooltip>Generar reporte con la información de la tabla</q-tooltip>
      </q-btn>
    </div>
  </div>
  <div class="row q-pr-lg q-pl-lg">
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
      >
        <template v-slot:top-left>
          <div class="row">
            <q-select
              v-show="administracion == true"
              class="q-pr-xs"
              v-model="area_Id"
              :options="areas"
              label="Selecciona un catalogo"
              hint="Seleccione un estatus de inventarios a mostrar"
              style="width: 260px"
            >
            </q-select>
            <q-select
              v-show="administracion == true"
              v-model="empleado_Id"
              :options="listEmpleados"
              label="Selecciona un estatus"
              hint="Seleccione un catalogo de inventarios a mostrar"
              style="width: 260px"
            >
            </q-select>
          </div>
        </template>
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
        <!--TEMPLATE SCREEN XS-->
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
        <!--TEMPLATE SCREEN DESKTOP-->
        <template v-else v-slot:body="props">
          <q-tr :props="props">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
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
                    `${configuracion[0].dias_Primer_Periodo - col.value}/${
                      configuracion[0].dias_Primer_Periodo
                    }`
                  }}
                </q-badge>
              </div>
              <div v-else-if="col.name === 'vacaciones_P2'">
                <q-badge color="purple-3">
                  {{
                    `${configuracion[0].dias_Segundo_Periodo - col.value}/${
                      configuracion[0].dias_Segundo_Periodo == null
                        ? 10
                        : configuracion[0].dias_Segundo_Periodo
                    }`
                  }}
                </q-badge>
              </div>
              <label v-else-if="col.name == 'empleado'">{{ col.value }}</label>
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
import { onBeforeMount, ref, watch, watchEffect } from "vue";
import ReporteGeneralJustificantes from "../../../helpers/ReportGeneralJustificantes";

//-----------------------------------------------------------

const $q = useQuasar();
const justificanteStore = useJustificanteStore();
const {
  listFiltroReporte,
  listReporte,
  configuracion,
  administracion,
  areas,
  listEmpleados,
} = storeToRefs(justificanteStore);
const date = ref({});
const nombreDate = ref("");
const area_Id = ref(null);
const empleado_Id = ref(null);
//-----------------------------------------------------------
//Get fecha actual
const newDate = new Date();
const year = newDate.getFullYear();
const month = String(newDate.getMonth() + 1).padStart(2, "0");
const day = String(newDate.getDate()).padStart(2, "0");
const dateActual = ref(`${year}/${month}/${day}`);

//-----------------------------------------------------------

onBeforeMount(() => {
  cargarData();
  listReporte.value = [];
  area_Id.value = { value: 0, label: "Todos" };
  empleado_Id.value = { value: 0, label: "Todos" };
});

//-----------------------------------------------------------

watch(date, (val) => {
  if (val == null) {
    $q.dialog({
      title: "Atención",
      message: "Seleccione un rango de fechas",
      icon: "Warning",
      persistent: true,
      transitionShow: "scale",
      transitionHide: "scale",
    });
  } else {
    cargarTabla(val);
    nombreDate.value = `${val.from} hasta ${val.to}`;
  }
});

watch(area_Id, (val) => {
  if (val != null) {
    justificanteStore.loadPersonalArea(val.value, true);
  }
});

//-----------------------------------------------------------

const cargarData = async () => {
  await justificanteStore.loadAsignacionesVacaciones(year);
  await justificanteStore.loadListAreas();
  justificanteStore.isAdministracion();
};

const optionsCalendar = (date) => {
  return date <= dateActual.value;
};

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

const cargarTabla = async (date) => {
  let resp = null;
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  resp = await justificanteStore.reporteJustificantes(date);

  if (resp.success) {
  } else {
    $q.notify({
      position: "top-right",
      type: "negative",
      message: resp.data,
      actions: [
        {
          icon: "close",
          color: "white",
          round: true,
          handler: () => {},
        },
      ],
    });
  }
  $q.loading.hide();
};

const crearReporte = async () => {
  if (Object.keys(listReporte.value).length == 0) {
    $q.dialog({
      title: "Atención",
      message: "Seleccione un rango de fechas",
      icon: "Warning",
      persistent: true,
      transitionShow: "scale",
      transitionHide: "scale",
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
    ReporteGeneralJustificantes(date.value);

    $q.loading.hide();
  }
};

//-----------------------------------------------------------

watchEffect(() => {
  const filtro = {};
  if (area_Id.value != null) filtro.area = area_Id.value.value;
  if (empleado_Id.value != null) filtro.empleado = empleado_Id.value.value;
  filtrar(listReporte.value, filtro);
});

//-----------------------------------------------------------

const columns = [
  {
    name: "empleado",
    align: "center",
    label: "Empleado",
    field: "empleado",
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
