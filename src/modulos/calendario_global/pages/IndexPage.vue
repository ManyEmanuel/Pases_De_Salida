<template>
  <q-page>
    <div class="row bg-grey-1">
      <div class="col-9">
        <div class="q-pa-md q-gutter-sm">
          <div class="text-gray-ieen-1 text-h6">Checadas</div>
          <q-breadcrumbs>
            <template v-slot:separator>
              <q-icon size="1.5em" name="chevron_right" color="primary" />
            </template>
            <q-breadcrumbs-el icon="home" label="Inicio" to="/" />
            <q-breadcrumbs-el class="text-grey-7" label="Checadas" />
          </q-breadcrumbs>
        </div>
      </div>
    </div>
    <div
      class="row q-pr-lg q-pl-lg q-pt-lg"
      style="max-width: 1500px; margin: 0 auto"
      v-if="tab == 'general'"
    >
      <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 text-center">
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
            { label: 'Mes', value: 'mes' },
            { label: 'Rango de fecha', value: 'rango' },
          ]"
        />
      </div>
      <div
        v-if="buscar_Por == 'rango'"
        class="col-lg-4 col-md-4 col-sm-6 col-xs-12"
      >
        <q-input
          v-model="fechas_texto"
          label="Rango de fechas"
          lazy-rules
          color="purple-ieen"
        >
          <template v-slot:prepend>
            <q-icon name="event" color="purple-ieen" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  color="purple-ieen"
                  v-model="fechas"
                  range
                  :options="FiltroFecha"
                  :locale="myLocale"
                />
              </q-popup-proxy>
            </q-icon>
          </template>
          <!-- <template v-slot:after>
            <q-btn
              label="Buscar"
              color="purple-ieen"
              icon-right="search"
              @click="cargar_checadas"
            />
          </template> -->
        </q-input>
      </div>
      <div
        v-if="buscar_Por == 'mes'"
        class="col-lg-2 col-md-2 col-sm-2 col-xs-12 q-pr-sm"
      >
        <q-select
          color="purple-ieen"
          v-model="año_Id"
          :options="años"
          label="Año"
        />
      </div>
      <div
        v-if="buscar_Por == 'mes'"
        class="col-lg-2 col-md-2 col-sm-2 col-xs-12"
      >
        <q-select
          color="purple-ieen"
          v-model="mes_Id"
          :options="meses"
          label="Mes"
        />
      </div>
      <!-- <div
        v-if="buscar_Por == 'mes'"
        class="col-lg-2 col-md-2 col-sm-2 col-xs-12"
      >
        <q-btn
          icon-right="search"
          color="purple-ieen"
          label="Buscar"
          @click="buscar"
        />
      </div> -->
      <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12 text-right q-pt-sm">
        <q-btn
          icon="download"
          color="purple-ieen"
          label="Excel"
          @click="obtenerExcel"
        />
      </div>
    </div>
    <br />
    <q-card class="q-ml-lg q-mr-lg">
      <q-tabs
        v-model="tab"
        class="text-grey"
        active-color="purple-ieen"
        indicator-color="purple-ieen"
        align="justify"
      >
        <q-tab name="general" label="General" />
        <q-tab name="personal" label="Por personal" />
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="general">
          <SchedulerResourceCalendar
            v-if="empleados.length > 0 && checadas.length > 0"
            :resources="empleados"
            :events="checadas"
            :currentDate="currentDate"
            :año="año_Id"
            :mes="mes_Id"
            :tipo="buscar_Por"
            :fechaFrom="fechas.from"
            :fechaTo="fechas.to"
          />
          <div v-else class="text-center text-h4 text-bold text-grey">
            <br />
            <q-icon name="warning" size="lg" />
            NO HAY REGISTROS DISPONIBLES
            <br /><br />
          </div>
        </q-tab-panel>
        <q-tab-panel name="personal">
          <q-form class="row" @submit="cargarChecadorPersonal">
            <div class="text-h6 text-bold text-grey-8 col-12">
              Seleccione el personal:
            </div>
            <div
              v-if="area_Administracion || perfilSA"
              class="col-lg-3 col-md-4 col-sm-12 col-xs-12 q-pr-xs"
            >
              <q-select
                filled
                dense
                color="purple-ieen"
                v-model="area_Id"
                :options="list_Areas"
                label="Área"
                hint="Seleccione área"
                lazy-rules
                :rules="[(val) => !!val || 'El área es requerida']"
              />
            </div>
            <div class="col-lg-3 col-md-4 col-sm-12 col-xs-12 q-pr-xs">
              <q-select
                filled
                dense
                color="purple-ieen"
                v-model="personal_Id"
                :options="list_Personal"
                label="Personal"
                hint="Seleccione personal"
                lazy-rules
                :rules="[(val) => !!val || 'El personal es requerida']"
              />
            </div>
            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12 q-pr-sm">
              <q-select
                filled
                dense
                color="purple-ieen"
                v-model="año_Personal"
                :options="años"
                label="Año"
              />
            </div>
            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12 q-pr-sm">
              <q-select
                filled
                dense
                color="purple-ieen"
                v-model="mes_Personal"
                :options="meses"
                label="Mes"
              />
            </div>
            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12 q-pl-sm">
              <q-btn
                type="submit"
                color="purple-ieen"
                label="Buscar"
                icon-right="search"
              />
            </div>
            <div class="col-12">
              <CalendarioPersonal :tipo="'global'" />
            </div>
          </q-form>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script setup>
import { useQuasar, QSpinnerFacebook } from "quasar";
import { onBeforeMount, ref, watch, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { useChecadaStore } from "../../../stores/checadas_store";
import { EncryptStorage } from "storage-encryption";
import SchedulerResourceCalendar from "../components/SchedulerResourceCalendar.vue";
import * as XLSX from "xlsx";
import CalendarioPersonal from "../../calendario/components/CalendarPersonal.vue";

//-----------------------------------------------------------

const $q = useQuasar();
const checador_store = useChecadaStore();
const {
  checadas,
  empleados,
  fechaTope,
  myLocale,
  list_Areas,
  list_Personal,
  list_Checadas_Personal,
  personal_Id,
} = storeToRefs(checador_store);
const encryptStorage = new EncryptStorage("SECRET_KEY", "sessionStorage");
const currentDate = ref(new Date());
const year = currentDate.value.getFullYear();
const month = (currentDate.value.getMonth() + 1).toString().padStart(2, "0");
const day = currentDate.value.getDate().toString().padStart(2, "0");
const fechas = ref({
  from: `${year}/${month}/${day}`,
  to: `${year}/${month}/${day}`,
});
const buscar_Por = ref("mes");
const tab = ref("general");
const fechas_texto = ref(`Del ${fechas.value.from} al ${fechas.value.to}`);
const años = ref([]);
const area_Id = ref(null);
const mes_Id = ref({
  value: month,
  label: currentDate.value.toLocaleString("default", { month: "long" }),
});
const mes_Personal = ref(null);
const meses = ref([
  { value: "01", label: "Enero" },
  { value: "02", label: "Febrero" },
  { value: "03", label: "Marzo" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Mayo" },
  { value: "06", label: "Junio" },
  { value: "07", label: "Julio" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Septiembre" },
  { value: "10", label: "Octubre" },
  { value: "11", label: "Noviembre" },
  { value: "12", label: "Diciembre" },
]);
const area_Administracion = ref(
  encryptStorage.decrypt("areaLetra") == "Dirección de Administración"
    ? true
    : false
);
const perfilSA = ref(encryptStorage.decrypt("perfil") == 1 ? true : false);
const startYear = 2022;
const currentYear = currentDate.value.getFullYear();
const año_Id = ref(currentYear);
const año_Personal = ref(currentYear);
const currentMonth = (currentDate.value.getMonth() + 1)
  .toString()
  .padStart(2, "0");

//-----------------------------------------------------------

watchEffect(() => {
  fechas_texto.value = `Del ${fechas.value.from} al ${fechas.value.to}`;
});

onBeforeMount(() => {
  for (let year = startYear; year <= currentYear; year++) {
    años.value.push(year);
  }
  if (mes_Personal.value == null) {
    let mesFiltrado = meses.value.find((x) => x.value == currentMonth);
    mes_Personal.value = mesFiltrado;
  }
  cargarData();
  load_empleados();
});

watch(tab, (val) => {
  if (val != null) {
    area_Id.value = null;
    personal_Id.value = null;
    list_Checadas_Personal.value = [];
  }
});

watch(buscar_Por, (val) => {
  if (val != null) {
    getDateCurrent();
    if (val == "mes") {
      año_Id.value = year;
      mes_Id.value = {
        value: month,
        label: currentDate.value.toLocaleString("default", { month: "long" }),
      };
      buscar();
    } else {
      cargar_checadas();
    }
  }
});

watch(mes_Id, (val) => {
  if (val != null) {
    buscar();
  }
});

watch(año_Id, (val) => {
  if (val != null) {
    buscar();
  }
});

watch(fechas, (val) => {
  if (val != null) {
    cargar_checadas();
  }
});

watch(area_Id, (val) => {
  if (val != null) {
    personal_Id.value = null;
    cargarEmpleadosByArea(val.value);
  }
});

// watch(personal_Id, (val) => {
//   if (val != null) {
//     cargarChecadorPersonal();
//   }
// });

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
  await checador_store.load_Areas();
  if (!area_Administracion.value && !perfilSA.value) {
    cargarEmpleadosByArea(encryptStorage.decrypt("area_Id"));
  }
  $q.loading.hide();
};

const cargarChecadorPersonal = async () => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  list_Checadas_Personal.value = [];
  let dias_Mes = new Date(
    año_Personal.value,
    mes_Personal.value.value,
    0
  ).getDate();
  await checador_store.load_Checadas_ByPersonal(
    personal_Id.value.value,
    `${año_Personal.value}-${mes_Personal.value.value}-01`,
    `${año_Personal.value}-${mes_Personal.value.value}-${dias_Mes}`
  );
  $q.loading.hide();
};

const cargarEmpleadosByArea = async (id) => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  await checador_store.load_Personal_ByArea(id);
  $q.loading.hide();
};

const getDateCurrent = () => {
  let currentDate = ref(new Date());
  let year = currentDate.value.getFullYear();
  let month = (currentDate.value.getMonth() + 1).toString().padStart(2, "0");
  let day = currentDate.value.getDate().toString().padStart(2, "0");
  fechas.value = {
    from: `${year}/${month}/${day}`,
    to: `${year}/${month}/${day}`,
  };
};

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

const buscar = async () => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  const year = parseInt(año_Id.value, 10);
  const month = parseInt(mes_Id.value.value, 10) - 1;
  const daysInMonth = getDaysInMonth(year, month);
  fechas.value = {
    from: `${año_Id.value}/${mes_Id.value.value}/01`,
    to: `${año_Id.value}/${mes_Id.value.value}/${daysInMonth}`,
  };
  await checador_store.load_checadas(
    `${año_Id.value}/${mes_Id.value.value}/01`,
    `${año_Id.value}/${mes_Id.value.value}/${daysInMonth}`
  );
  $q.loading.hide();
};

const FiltroFecha = (fechha) => {
  let hoy = new Date();
  let fechaHoy = hoy.toISOString().split("T");
  let FechaFormato = fechaHoy[0];
  let FechaFinal = FechaFormato.replace(/-/g, "/");
  return fechha <= FechaFinal;
};

const load_empleados = async () => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  let currentDate = ref(new Date());
  let day = currentDate.value.getDate().toString().padStart(2, "0");
  await checador_store.load_empleados_calendario();
  await checador_store.load_checadas(
    `${año_Id.value}/${mes_Id.value.value}/01`,
    `${año_Id.value}/${mes_Id.value.value}/${day}`
  );
  $q.loading.hide();
};

const cargar_checadas = async () => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  await checador_store.load_checadas(fechas.value.from, fechas.value.to);
  $q.loading.hide();
};

const obtenerExcel = async () => {
  let encabezado = ["Empleado"];
  let datos = [];
  for (let fecha of fechaTope.value) {
    encabezado.push(fecha);
  }
  for (let empleado of empleados.value) {
    let objeto = {};
    fechaTope.value.forEach((fecha) => {
      let filtro = checadas.value.filter(
        (x) => x.resourceId == empleado.id && x.dateCompare == fecha
      );
      let texto = "";
      for (let registro of filtro) {
        texto = texto + " " + registro.title;
      }
      objeto[fecha] = texto;
    });
    datos.push({ Empleado: empleado.title, ...objeto });
  }
  const worksheet = XLSX.utils.json_to_sheet(datos, { header: encabezado });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Checador");
  XLSX.writeFile(workbook, "Reporte_Checador_Fechas.xlsx");
};
</script>
