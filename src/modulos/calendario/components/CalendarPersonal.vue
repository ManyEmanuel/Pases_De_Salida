<template>
  <template
    v-if="
      props.tipo == 'personal'
        ? mis_checadas.length > 0
        : list_Checadas_Personal.length > 0
    "
  >
    <div class="demo-app">
      <div class="demo-app-main">
        <FullCalendar
          ref="calendar"
          class="demo-app-calendar"
          :options="calendarOptions"
        >
          <template v-slot:eventContent="arg">
            <q-badge
              v-if="arg.event.title != ''"
              :color="getColor(arg.event.title)"
              rounded
              class="text-black"
            >
              <b
                v-if="
                  !arg.event.title.includes('Omisión de salida') &&
                  !arg.event.title.includes('Omisión de entrada')
                "
                >{{ arg.timeText }}</b
              >
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
import { ref, watch } from "vue";
import { useChecadaStore } from "../../../stores/checadas_store";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { ar } from "date-fns/locale";

//-----------------------------------------------------------

const $q = useQuasar();
const checada_store = useChecadaStore();
const { mis_checadas, list_Checadas_Personal } = storeToRefs(checada_store);
const currentDate = ref(new Date());
currentDate.value.setDate(currentDate.value.getDate() + 1);
const props = defineProps({
  tipo: {
    type: String,
  },
});

//-----------------------------------------------------------

watch(mis_checadas, (val) => {
  if (val.length != 0) {
    buscar();
  }
});

watch(list_Checadas_Personal, (val) => {
  if (val.length != 0) {
    buscar();
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
  editable: false,
  selectable: false,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
  locale: "es",
  dayHeaderFormat: { weekday: "long" },
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
  if (
    (props.tipo == "personal" && mis_checadas.value.length > 0) ||
    (props.tipo != "personal" && list_Checadas_Personal.value.length > 0)
  ) {
    let dias_Mes = new Date(
      props.tipo == "personal"
        ? mis_checadas.value[0].start.split("-")[0]
        : list_Checadas_Personal.value[0].start.split("-")[0],
      props.tipo == "personal"
        ? mis_checadas.value[0].start.split("-")[1]
        : list_Checadas_Personal.value[0].start.split("-")[1],
      0
    ).getDate();
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
        end: `${
          props.tipo == "personal"
            ? mis_checadas.value[0].start.split("-")[0]
            : list_Checadas_Personal.value[0].start.split("-")[0]
        }-${
          props.tipo == "personal"
            ? mis_checadas.value[0].start.split("-")[1]
            : list_Checadas_Personal.value[0].start.split("-")[1]
        }-${dias_Mes + 1}`,
      },
    };
  }

  $q.loading.hide();
};

const getColor = (title) => {
  if (title != "") {
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
      return "primary";
    } else {
      return "orange";
    }
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
