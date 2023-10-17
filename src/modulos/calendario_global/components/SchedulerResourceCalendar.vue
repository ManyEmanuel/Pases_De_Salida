<template>
  <div class="scheduler-resource-calendar">
    <div class="calendar-header">
      <q-btn color="secondary" label="Anterior" @click="prevMonth" />
      <h2>{{ formatMonthHeader }}</h2>
      <q-btn color="secondary" label="Siguiente" @click="nextMonth" />
    </div>
    <div class="table-container">
      <div class="table-fixed">
        <table>
          <thead>
            <tr>
              <th>Empleados</th>
              <th v-for="day in currentMonthDays" :key="day">
                {{ formatDayHeader(day) }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="resource in resources" :key="resource.id">
              <td class="resource-cell">{{ resource.title }}</td>
              <td v-for="day in currentMonthDays" :key="day">
                <div v-if="hasEventOnDay(resource.id, day)">
                  <div
                    v-for="event in getEventsOnDay(resource.id, day)"
                    :key="event.event_Id"
                  >
                    <q-badge rounded :color="obtenColor(event.title)" />
                    <div class="h6">{{ event.title }}</div>
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
import { storeToRefs } from "pinia";
import { ref, defineProps, computed } from "vue";
import { format, isWithinInterval, addMonths, subMonths } from "date-fns";

const $q = useQuasar();
const props = defineProps(["resources", "events", "currentDate"]);
const resources = ref(props.resources);
const events = ref(props.events);
const currentDate = ref(props.currentDate);

const currentMonthDays = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days = [];
  for (
    let date = new Date(firstDay);
    date <= lastDay;
    date.setDate(date.getDate() + 1)
  ) {
    days.push(format(date, "yyyy-MM-dd"));
  }
  return days;
});

const obtenColor = (title) => {
  if (title.includes("Entrada") || title.includes("Salida")) {
    return "green";
  }
  if (title.includes("Retardo") || title.includes("Anticipada")) {
    return "yellow";
  }
  if (title.includes("Falta")) {
    return "red";
  }
};

function hasEventOnDay(resourceId, day) {
  return events.value.some((event) => {
    // Parseamos las fechas y las convertimos a objetos Date sin la hora
    const eventStartDate = new Date(event.start.split(" ")[0]);
    const eventEndDate = new Date(event.end.split(" ")[0]);
    const selectedDate = new Date(day.split(" ")[0]);

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
    const selectedDate = new Date(day.split(" ")[0]);

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

function formatDayHeader(day) {
  return day.split("-")[2]; // Mostrar solo el día del mes en el encabezado
}

const formatMonthHeader = computed(() => {
  const date = currentDate.value;
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
  return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
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
    const selectedDate = new Date(day.split(" ")[0]);

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
    const selectedDate = new Date(day.split(" ")[0]);

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
    const selectedDate = new Date(day.split(" ")[0]);

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
/* Estilos personalizados */
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
  border: 1px solid #ccc;
}

th {
  position: sticky;
  top: 0;
  background-color: #ffffff;
  z-index: 2; /* Asegura que la cabecera esté por encima del contenido de la tabla */
}
.resource-cell {
  font-weight: bold;
  position: sticky;
  left: 0;
  background-color: #ffffff;
  border: 1px solid #ccc;
  z-index: 2;
}

.event-cell {
  position: relative;
}

.event-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #3490dc;
  font-size: 10px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.highlight-column {
  background-color: #f0f0f0; /* Color de sombreado para la columna resaltada */
}

.table-container {
  max-height: 500px; /* Ajusta la altura máxima según tus necesidades */
  overflow-y: auto; /* Agrega desplazamiento vertical si el contenido excede la altura */
  position: relative; /* Asegura que el contenedor sea la referencia para la posición sticky */
}
</style>
