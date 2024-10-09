<template>
  <div class="row flex-center q-pt-lg">
    <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12 q-pr-sm">
      <q-select
        filled
        dense
        color="purple-ieen"
        v-model="año_Id"
        :options="años"
        label="Año"
      />
    </div>
    <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12">
      <q-select
        filled
        dense
        color="purple-ieen"
        v-model="mes_Id"
        :options="meses"
        label="Mes"
      />
    </div>
    <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12 q-pl-sm">
      <q-btn
        @click="buscar"
        color="purple-ieen"
        label="Buscar"
        icon-right="search"
      />
    </div>
  </div>
  <template
    v-if="
      props.tipo == 'personal'
        ? mis_checadas.length > 0
        : list_Checadas_Personal.length > 0
    "
  >
    <div class="demo-app">
      <div class="demo-app-main">
        <FullCalendar class="demo-app-calendar" :options="calendarOptions">
          <template v-slot:eventContent="arg">
            <q-badge
              v-if="arg.event.title != ''"
              :color="getColor(arg.event.title)"
              rounded
              class="text-black"
            >
              <b>{{ arg.timeText }}</b>
              <i>{{ arg.event.title }}</i>
              <q-tooltip :delay="500">{{ arg.event.title }}</q-tooltip>
            </q-badge>
          </template>
        </FullCalendar>
      </div>
    </div>
  </template>
  <template v-else>
    <div class="text-center text-h4 text-bold text-grey">
      <br />
      <q-icon name="warning" size="lg" />
      NO HAY REGISTROS DISPONIBLES
    </div>
  </template>
</template>

<script setup>
import { useQuasar, QSpinnerFacebook } from "quasar";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { useChecadaStore } from "../../../stores/checadas_store";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

//-----------------------------------------------------------

const $q = useQuasar();
const checada_store = useChecadaStore();
const { mis_checadas, list_Checadas_Personal, personal_Id } =
  storeToRefs(checada_store);
const currentDate = ref(new Date()); 
currentDate.value.setDate(currentDate.value.getDate() + 1);
const props = defineProps({
  tipo: {
    type: String,
  },
});
const startYear = 2022;
const currentYear = currentDate.value.getFullYear();
const currentMonth = (currentDate.value.getMonth() + 1)
  .toString()
  .padStart(2, "0");
const año_Id = ref(currentYear);
const años = ref([]);
const mes_Id = ref(null);
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

//-----------------------------------------------------------

onBeforeMount(() => {
  for (let year = startYear; year <= currentYear; year++) {
    años.value.push(year);
  }
  if (mes_Id.value == null) {
    let mesFiltrado = meses.value.find((x) => x.value == currentMonth);
    mes_Id.value = mesFiltrado;
  }
});

const calendarOptions = ref({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  headerToolbar: {
    left: "prev,next today",
    center: "title",
    right: "dayGridMonth,timeGridWeek,timeGridDay",
  },
  buttonText: {
    today: "Hoy",
    month: "Mes",
    week: "Semana",
    day: "Día",
    list: "list",
  },
  initialView: "dayGridMonth",
  initialDate:
    props.tipo == "personal" && mis_checadas.value.length > 0
      ? mis_checadas.value[0].start
      : props.tipo != "personal" && list_Checadas_Personal.value.length > 0
      ? list_Checadas_Personal.value[0].start
      : `${año_Id.value}-${currentMonth}-01`,
  events: props.tipo == "personal" ? mis_checadas : list_Checadas_Personal,
  editable: false,
  selectable: false,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
  locale: "es",
  dayHeaderFormat: { weekday: "long" },
  validRange: {
    start:
      props.tipo == "personal" && mis_checadas.value.length > 0
        ? mis_checadas.value[0].start
        : props.tipo != "personal" && list_Checadas_Personal.value.length > 0
        ? list_Checadas_Personal.value[0].start
        : `${año_Id.value}-${currentMonth}-01`,
  },
});

const buscar = async () => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  if (mes_Id.value == null) {
    let mesFiltrado = meses.value.find((x) => x.value == currentMonth);
    mes_Id.value = mesFiltrado;
  }
  let dias_Mes = new Date(año_Id.value, mes_Id.value.value, 0).getDate();
  if (props.tipo == "personal") {
    await checada_store.load_mis_checadas(
      `${año_Id.value}-${mes_Id.value.value}-01`,
      `${año_Id.value}-${mes_Id.value.value}-${dias_Mes}`
    );
  } else {
    await checada_store.load_Checadas_ByPersonal(
      personal_Id.value.value,
      `${año_Id.value}-${mes_Id.value.value}-01`,
      `${año_Id.value}-${mes_Id.value.value}-${dias_Mes}`
    );
  }
  if (
    (props.tipo == "personal" && mis_checadas.value.length > 0) ||
    (props.tipo != "personal" && list_Checadas_Personal.value.length > 0)
  ) {
    calendarOptions.value = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      },
      buttonText: {
        today: "Hoy",
        month: "Mes",
        week: "Semana",
        day: "Día",
        list: "list",
      },
      initialView: "dayGridMonth",
      initialDate:
        props.tipo == "personal"
          ? mis_checadas.value[0].start
          : list_Checadas_Personal.value[0].start,
      events: props.tipo == "personal" ? mis_checadas : list_Checadas_Personal,
      editable: false,
      selectable: false,
      selectMirror: true,
      dayMaxEvents: true,
      weekends: true,
      locale: "es",
      dayHeaderFormat: { weekday: "long" },
      validRange: {
        start:
          props.tipo == "personal"
            ? mis_checadas.value[0].start
            : list_Checadas_Personal.value[0].start,
        end: `${año_Id.value}-${mes_Id.value.value}-${dias_Mes + 1}`,
      },
    };
  }
  $q.loading.hide();
};

const getColor = (title) => {
  if (title.includes("Retardo") || title.includes("Salida anticipada")) {
    return "yellow";
  } else if (title.includes("Entrada") || title.includes("Salida")) {
    return "green-4";
  } else if (title.includes("Falta")) {
    return "red-5";
  } else if (
    title.includes("permiso") ||
    title.includes("Pase") ||
    title.includes("Comisión") ||
    title.includes("Incapacidad")
  ) {
    return "red";
  } else {
    return "orange";
  }
};
</script>

<style lang="css">
b {
  margin-right: 3px;
}

.demo-app {
  display: flex;
  min-height: 100%;
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  font-size: 14px;
}

.demo-app-sidebar {
  width: 300px;
  line-height: 1.5;
  background: #eaf9ff;
  border-right: 1px solid #d3e2e8;
}

.demo-app-sidebar-section {
  padding: 2em;
}

.demo-app-main {
  flex-grow: 1;
  padding: 3em;
}

.fc {
  max-width: 1200px;
  margin: 0 auto;
}

.fc-event {
  text-align: justify;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
