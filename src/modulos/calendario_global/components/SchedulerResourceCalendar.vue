<template>
  <br />
  <div class="scheduler-resource-calendar q-pr-lg q-pl-lg q-pt-lg">
    <div v-if="props.tipo == 'mes'" class="text-center">
      <div class="text-h4 text-bold text-grey">
        {{ formatMonthHeader }}
      </div>
    </div>
    <br />
    <div class="table-container">
      <div class="table-fixed">
        <table>
          <thead class="flotante">
            <tr v-if="props.tipo == 'rango'">
              <th :colspan="1">MES</th>
              <th
                v-for="(mes, index) in meses"
                :key="mes"
                :colspan="mes.filas - 1"
                :class="
                  index % 2 == 0
                    ? 'bg-purple-ieen text-white'
                    : 'bg-deep-purple-3 text-white'
                "
              >
                {{ mes.month.toUpperCase() }}
              </th>
            </tr>
            <tr>
              <th class="text-grey-8"><q-icon name="person" />PERSONAL</th>
              <th
                class="text-grey-8"
                v-for="day in currentMonthDays"
                :key="day"
              >
                {{ formatDayLetra(day) }} <br />
                {{ formatDay(day) }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="resource in resources" :key="resource.id">
              <td
                style="background-color: #ececec"
                class="text-bold text-grey-8 fixed-column"
              >
                {{ resource.title }}
              </td>
              <td v-for="day in currentMonthDays" :key="day">
                <div v-if="hasEventOnDay(resource.id, day)">
                  <div
                    v-for="event in getEventsOnDay(resource.id, day)"
                    :key="event.event_Id"
                  >
                    <q-badge
                      :class="
                        obtenColor(event.title) == 'yellow'
                          ? 'text-black'
                          : 'text-white'
                      "
                      rounded
                      :color="obtenColor(event.title)"
                    >
                      <div>
                        {{ event.title }}
                      </div>
                    </q-badge>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";
import { ref, defineProps, computed } from "vue";
import { format, addMonths, subMonths } from "date-fns";

//-----------------------------------------------------------

const $q = useQuasar();
const props = defineProps([
  "resources",
  "events",
  "currentDate",
  "año",
  "mes",
  "tipo",
  "fechaFrom",
  "fechaTo",
]);
const resources = ref(props.resources);
const events = ref(props.events);
const currentDate = ref(props.currentDate);
const daysOfWeekInSpanish = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
];
const meses = ref([]);

//-----------------------------------------------------------

const currentMonthDays = computed(() => {
  if (props.tipo == "mes") {
    const firstDay = new Date(props.año, parseInt(props.mes.value - 1), 1);
    const lastDay = new Date(props.año, parseInt(props.mes.value), 0);
    const days = [];
    for (
      let date = new Date(firstDay);
      date <= lastDay;
      date.setDate(date.getDate() + 1)
    ) {
      const formattedDate = format(date, "yyyy-MM-dd");
      const dayOfWeek = daysOfWeekInSpanish[date.getDay()].toUpperCase();
      days.push({ date: formattedDate, dayOfWeek });
    }
    return days;
  } else {
    const startYear = parseInt(props.fechaFrom.split("/")[0]);
    const endYear = parseInt(props.fechaTo.split("/")[0]);

    const days = [];
    for (let year = startYear; year <= endYear; year++) {
      for (
        let date = new Date(props.fechaFrom);
        date <= new Date(props.fechaTo);
        date.setDate(date.getDate() + 1)
      ) {
        const formattedDate = format(date, "yyyy-MM-dd");
        const dayOfWeek = daysOfWeekInSpanish[date.getDay()].toUpperCase();
        days.push({ date: formattedDate, dayOfWeek });
      }
    }
    formatMonth();
    return days;
  }
});

const obtenColor = (title) => {
  if (title.includes("Entrada") || title.includes("Salida")) {
    return "green";
  }
  if (title.includes("Retardo") || title.includes("Anticipada")) {
    return "yellow";
  }
  if (title.includes("Falta")) {
    return "red-5";
  }
  if (
    title.includes("Omisión") ||
    title.includes("Comisión oficial") ||
    title.includes("Permuta") ||
    title.includes("Permiso") ||
    title.includes("Vacaciones")
  ) {
    return "orange";
  }
};

function hasEventOnDay(resourceId, day) {
  return events.value.some((event) => {
    // Parseamos las fechas y las convertimos a objetos Date sin la hora

    const eventStartDate = new Date(event.start.split(" ")[0]);
    const eventEndDate = new Date(event.end.split(" ")[0]);
    const selectedDate = new Date(day.date.split(" ")[0]);

    // Eliminamos la hora, minutos, segundos y milisegundos de las fechas
    eventStartDate.setHours(0, 0, 0, 0);
    eventEndDate.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    return (
      event.resourceId === resourceId &&
      selectedDate >= eventStartDate &&
      selectedDate <= eventEndDate
    );
  });
}

function getEventsOnDay(resourceId, day) {
  return events.value.filter((event) => {
    const eventStartDate = new Date(event.start.split(" ")[0]);
    const eventEndDate = new Date(event.end.split(" ")[0]);
    const selectedDate = new Date(day.date.split(" ")[0]);

    // Eliminamos la hora, minutos, segundos y milisegundos de las fechas
    eventStartDate.setHours(0, 0, 0, 0);
    eventEndDate.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    // if (event.title == 'Falta' && event.dateCompare > ) {

    // }
    let fechaCompare = new Date(
      event.dateCompare.split("-")[0],
      event.dateCompare.split("-")[1],
      event.dateCompare.split("-")[2]
    );
    let fechaActual = new Date();
    return (
      event.resourceId === resourceId &&
      selectedDate >= eventStartDate &&
      selectedDate <= eventEndDate
    );
  });
}

function formatDay(day) {
  return day.date.split("-")[2];
}

function formatDayLetra(day) {
  return day.dayOfWeek;
}

function formatMonth() {
  const startDate = new Date(props.fechaFrom);
  const endDate = new Date(props.fechaTo);

  const months = [];
  let current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  const end = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);

  while (current <= end) {
    let monthNames = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    const firstDayOfMonth = new Date(
      current.getFullYear(),
      current.getMonth(),
      1
    );
    const lastDayOfMonth = new Date(
      current.getFullYear(),
      current.getMonth() + 1,
      0
    );

    const startOfMonth =
      startDate > firstDayOfMonth ? startDate : firstDayOfMonth;

    const endOfMonth = endDate < lastDayOfMonth ? endDate : lastDayOfMonth;

    const numDaysInMonth = Math.max(
      0,
      (endOfMonth - startOfMonth) / (1000 * 60 * 60 * 24) + 1
    );

    months.push({
      year: current.getFullYear(),
      month: monthNames[current.getMonth()],
      filas: numDaysInMonth + 1,
    });
    current.setMonth(current.getMonth() + 1);
  }
  meses.value = months;
}

const formatMonthHeader = computed(() => {
  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  return `${monthNames[parseInt(props.mes.value - 1)]} ${props.año}`;
});

function nextMonth() {
  currentDate.value = addMonths(currentDate.value, 1);
}

function prevMonth() {
  currentDate.value = subMonths(currentDate.value, 1);
}

function getEventBadgeText(resourceId, day) {
  const event = events.value.find((event) => {
    // Parseamos las fechas en el mismo formato de cadena "YYYY-MM-DD HH:mm"
    const eventStartDate = new Date(event.start.split(" ")[0]);
    const eventEndDate = new Date(event.end.split(" ")[0]);
    const selectedDate = new Date(day.date.split(" ")[0]);

    // Eliminamos la hora, minutos, segundos y milisegundos de las fechas
    eventStartDate.setHours(0, 0, 0, 0);
    eventEndDate.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    return (
      event.resourceId === resourceId &&
      selectedDate >= eventStartDate &&
      selectedDate <= eventEndDate
    );
  });
  return event ? event.title : "";
}

function getEventType(resourceId, day) {
  const event = events.value.find((event) => {
    // Parseamos las fechas en el mismo formato de cadena "YYYY-MM-DD HH:mm"
    const eventStartDate = new Date(event.start.split(" ")[0]);
    const eventEndDate = new Date(event.end.split(" ")[0]);
    const selectedDate = new Date(day.date.split(" ")[0]);

    // Eliminamos la hora, minutos, segundos y milisegundos de las fechas
    eventStartDate.setHours(0, 0, 0, 0);
    eventEndDate.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    return (
      event.resourceId === resourceId &&
      selectedDate >= eventStartDate &&
      selectedDate <= eventEndDate
    );
  });
  return event ? event.type : "";
}

const highlightedColumn = ref(null);

function highlightColumn(columnIndex) {
  highlightedColumn.value = columnIndex;
}

function clearHighlight() {
  highlightedColumn.value = null;
}

function isCurrentColumn(columnIndex) {
  return highlightedColumn.value === columnIndex;
}

const evaluateEvent = async (resourceId, day) => {
  const event = events.value.find((event) => {
    // Parseamos las fechas en el mismo formato de cadena "YYYY-MM-DD HH:mm"
    const eventStartDate = new Date(event.start.split(" ")[0]);
    const eventEndDate = new Date(event.end.split(" ")[0]);
    const selectedDate = new Date(day.date.split(" ")[0]);

    // Eliminamos la hora, minutos, segundos y milisegundos de las fechas
    eventStartDate.setHours(0, 0, 0, 0);
    eventEndDate.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    return (
      event.resourceId === resourceId &&
      selectedDate >= eventStartDate &&
      selectedDate <= eventEndDate
    );
  });

  $q.loading.show();
  if (event.type == "res") {
    reservacionStore.loadReservacion(event.event_Id);
    reservacionStore.updateEditar(true);
    reservacionStore.updateModal(true);
  } else {
    checkInStore.loadCheckIn(event.event_Id);
    checkInStore.updateEditar(true);
    checkInStore.updateModalEditar(true);
  }
  $q.loading.hide();
};
</script>

<style scoped>
.flotante {
  position: sticky;
  top: 1px;
  z-index: 999;
  background-color: white;
}

.fixed-column {
  position: sticky;
  left: 0;
  z-index: 1;
  background-color: #ececec;
}

.scheduler-resource-calendar {
  font-family: Arial, sans-serif;
  max-width: 1500px;
  margin: 0 auto;
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  position: sticky;
  top: 0;
  z-index: 1;
}

th,
td {
  padding: 8px;
  text-align: center;
  border: 1px solid #eeeeee;
}

th {
  position: sticky;
  top: 0;
  background-color: #ececec;
  z-index: 2;
}

.resource-cell {
  font-weight: bold;
  position: sticky;
  left: 0;
  background-color: #ffffff;
  border: 1px solid #ccc;
  z-index: 2;
}

.highlight-column {
  background-color: #f0f0f0;
}

.table-container {
  max-height: 650px;
  overflow-y: auto;
  position: relative;
}
</style>
