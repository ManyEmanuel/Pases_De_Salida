<template>
  <div class="row q-pt-lg">
    <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 text-center">
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
      class="col-lg-2 col-md-2 col-sm-4 col-xs-12"
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
    <div v-else class="col-lg-3 col-md-3 col-sm-4 col-xs-12">
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
    <div class="col-lg-3 col-md-3 col-sm-4 col-xs-6 text-left">
      <q-btn
        type="button"
        color="purple-ieen"
        icon-right="search"
        label="Buscar"
        @click="cargarTabla"
      />
    </div>
    <div
      v-if="listPasesIntermediosFiltrado.length > 0"
      class="col-lg-3 col-md-3 col-sm-4 col-xs-6 text-right q-pl-xs"
    >
      <q-btn
        type="button"
        color="purple-ieen"
        icon-right="download"
        label="Excel"
        @click="descargarExcel"
      />
    </div>
  </div>
  <div class="row q-pt-lg">
    <div class="col">
      <q-table
        :rows="listPasesIntermediosFiltrado"
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
              class="q-pr-xs"
              v-model="area_Id"
              :options="areas"
              color="purple-ieen"
              label="Buscar por área"
              hint="Seleccione un área "
              style="width: 300px"
            >
            </q-select>
            <q-select
              v-model="empleado_Id"
              :options="listEmpleados"
              color="purple-ieen"
              label="Buscar por personal"
              hint="Seleccione personal"
              style="width: 300px"
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
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <label v-if="col.name == 'folio'" class="text-bold">
                {{ col.value }}
              </label>
              <label v-else>
                {{ col.value }}
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
import { useQuasar, QSpinnerFacebook, exportFile } from "quasar";
import { useRegistroGeneralStore } from "src/stores/registro_General_store";
import { onBeforeMount, ref, watch, watchEffect } from "vue";
import { useJustificanteStore } from "src/stores/justificantes_store";

const $q = useQuasar();
const registroGeneralPasesStore = useRegistroGeneralStore();
const justificanteStore = useJustificanteStore();
const { areas, listEmpleados } = storeToRefs(justificanteStore);
const { listPasesIntermedios } = storeToRefs(registroGeneralPasesStore);
const newDate = new Date();
const year = ref(newDate.getFullYear());
const month = (newDate.getMonth() + 1).toString().padStart(2, "0");
const day = newDate.getDate().toString().padStart(2, "0");
const dateActual = ref(`${year.value}/${month}/${day}`);
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
const area_Id = ref(null);
const empleado_Id = ref(null);
const listPasesIntermediosFiltrado = ref([]);
const años = ref([]);
const startYear = 2022;

//-----------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

watch(rango_Fecha, (val) => {
  if (val != null) {
    textoFecha.value = `${val.from} hasta ${val.to}`;
  }
});

watch(buscar_Por, (val) => {
  if (val != null) {
    rango_Fecha.value = null;
    textoFecha.value = null;
  }
});

watch(area_Id, (val) => {
  if (val != null) {
    empleado_Id.value = { value: 0, label: "Todos" };
    cargarPersonal(val);
  }
});

const cargarData = async () => {
  for (let yearLit = startYear; yearLit <= year.value; yearLit++) {
    años.value.push(yearLit);
  }
  area_Id.value = { value: 0, label: "Todos" };
  empleado_Id.value = { value: 0, label: "Todos" };
  await registroGeneralPasesStore.loadPasesIntermedios();
  await justificanteStore.loadListAreas();
  cargarTabla();
};

const cargarPersonal = async (val) => {
  await justificanteStore.loadPersonalArea(val.value, true);
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
      rango_Fecha.value = {
        from: `${year.value}/01/01`,
        to: `${year.value}/12/31`,
      };
    }
    let fecha_From = Date.parse(rango_Fecha.value.from);
    let fecha_To = Date.parse(rango_Fecha.value.to);
    listPasesIntermediosFiltrado.value = listPasesIntermedios.value.filter(
      (x) => {
        const fecha_Salida = Date.parse(x.salida.split(" ")[0]);
        return fecha_Salida >= fecha_From && fecha_Salida <= fecha_To;
      }
    );
  }

  $q.loading.hide();
};

const optionsCalendar = (date) => {
  return date <= dateActual.value;
};

const filtrar = (list, filtro) => {
  listPasesIntermediosFiltrado.value = list.filter((item) => {
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
        cumple = cumple && item.solicitante_Id === filtro.empleado;
      }
    }

    return cumple;
  });
};

function wrapCsvValue(val, formatFn, row) {
  let formatted = formatFn !== void 0 ? formatFn(val, row) : val;
  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);
  formatted = formatted.split('"').join('""');
  return `"${formatted}"`;
}

const descargarExcel = () => {
  const content = [columns.map((col) => wrapCsvValue(col.label))]
    .concat(
      listPasesIntermediosFiltrado.value.map((row) =>
        columns
          .map((col) =>
            wrapCsvValue(
              typeof col.field === "function"
                ? col.field(row)
                : row[col.field === void 0 ? col.name : col.field],
              col.format,
              row
            )
          )
          .join(",")
      )
    )
    .join("\r\n");
  const bom = "\uFEFF";
  const status = exportFile(
    `PasesIntermedios_${dateActual.value}`,
    bom + content,
    "text/csv;charset=utf-8"
  );
  if (status !== true) {
    $q.notify({
      message:
        "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
      color: "negative",
      icon: "warning",
    });
  }
};

watchEffect(() => {
  const filtro = {};
  if (area_Id.value != null) filtro.area = area_Id.value.value;
  if (empleado_Id.value != null) filtro.empleado = empleado_Id.value.value;
  filtrar(listPasesIntermedios.value, filtro);
});

const columns = [
  {
    name: "folio",
    align: "center",
    label: "Folio",
    field: "folio",
    sortable: true,
  },
  {
    name: "solicitante",
    align: "center",
    label: "Solicitante",
    field: "solicitante",
    sortable: true,
  },
  {
    name: "puesto_Solicitante",
    align: "center",
    label: "Puesto solicitante",
    field: "puesto_Solicitante",
    sortable: true,
  },
  {
    name: "area",
    align: "center",
    label: "Área",
    field: "area",
    sortable: true,
  },
  {
    name: "salida",
    align: "center",
    label: "Salida",
    field: "salida",
    sortable: true,
  },
  {
    name: "llegada",
    align: "center",
    label: "Llegada",
    field: "llegada",
    sortable: true,
  },
  {
    name: "rol",
    align: "center",
    label: "Rol",
    field: "rol",
    sortable: true,
  },
  {
    name: "vehiculo",
    align: "center",
    label: "Vehiculo",
    field: "vehiculo",
    sortable: true,
  },
];

const pagination = ref({
  page: 1,
  rowsPerPage: 5,
  sortBy: "name",
  descending: false,
});
const filter = ref("");
</script>
