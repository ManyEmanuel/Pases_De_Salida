<template>
  <div class="demo-app">
    <div class="demo-app-main">
      <FullCalendar class="demo-app-calendar" :options="calendarOptions">
        <template v-slot:eventContent="arg">
          <q-badge
            v-if="
              arg.event.title == 'Retardo' ||
              arg.event.title == 'Salida anticipada'
            "
            rounded
            color="yellow"
          />
          <q-badge
            v-if="arg.event.title == 'Entrada' || arg.event.title == 'Salida'"
            rounded
            color="green"
          />
          <q-badge v-if="arg.event.title == 'Falta'" rounded color="red" />
          <q-badge
            v-if="
              arg.event.title.includes('permiso') ||
              arg.event.title.includes('Pase') ||
              arg.event.title.includes('Comisión') ||
              arg.event.title.includes('Incapacidad')
            "
            rounded
            color="blue"
          />
          <b>{{ arg.timeText }}</b>
          <i>{{ arg.event.title }}</i>

          <q-tooltip :delay="500">{{ arg.event.title }}</q-tooltip>
        </template>
      </FullCalendar>
    </div>
  </div>
  <ModalFecha />
</template>

<script setup>
import { onBeforeMount, ref, defineComponent } from "vue";
import { storeToRefs } from "pinia";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useChecadaStore } from "../../../stores/checadas_store";

const checada_store = useChecadaStore();
const { mis_checadas } = storeToRefs(checada_store);

onBeforeMount(() => {
  checada_store.load_mis_checadas();
});

const calendarOptions = ref({
  plugins: [
    dayGridPlugin,
    timeGridPlugin,
    interactionPlugin, // needed for dateClick
  ],
  headerToolbar: {
    left: "prev,next today",
    center: "title",
    right: "dayGridMonth,timeGridWeek,timeGridDay",
  },

  initialView: "dayGridMonth",
  events: mis_checadas,
  editable: false,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
  locale: "es",
});

const currentEvents = ref([]);

const handleWeekendsToggle = () => {
  calendarOptions.value.weekends = !calendarOptions.value.weekends;
};
</script>

<style lang="css">
h2 {
  margin: 0;
  font-size: 16px;
}

ul {
  margin: 0;
  padding: 0 0 0 1.5em;
}

li {
  margin: 1.5em 0;
  padding: 0;
}

b {
  /* used for event dates/times */
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
  /* the calendar root */
  max-width: 1100px;
  margin: 0 auto;
}
.fc-event {
  text-align: justify;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
