<template>
  <q-page padding>
    <div class="row q-pa-md q-gutter-sm">
      <div class="col-12 col-xs-6 col-md-3">
        <q-input
          v-model="fechas_texto"
          label="Rango de fechas"
          hint="Rango de fechas a revisar"
          lazy-rules
        >
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="fechas" range />
              </q-popup-proxy>
            </q-icon>
          </template>
          <template v-slot:after>
            <q-btn
              square
              color="primary"
              icon="search"
              @click="cargar_checadas"
            />
          </template>
        </q-input>
      </div>
    </div>
    <SchedulerResourceCalendar
      v-if="empleados.length > 0 && checadas.length > 0"
      :resources="empleados"
      :events="checadas"
      :currentDate="currentDate"
    />
    <div v-else class="fixed-center">
      <div class="text-center h-1">NO HAY REGISTROS DISPONIBLES</div>
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar, QSpinnerFacebook } from "quasar";
import { onBeforeMount, onMounted, ref, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { useChecadaStore } from "../../../stores/checadas_store";
import SchedulerResourceCalendar from "../components/SchedulerResourceCalendar.vue";

const $q = useQuasar();
const checador_store = useChecadaStore();
const { checadas, empleados } = storeToRefs(checador_store);
const currentDate = ref(new Date());
const year = currentDate.value.getFullYear();
const month = (currentDate.value.getMonth() + 1).toString().padStart(2, "0");
const day = currentDate.value.getDate().toString().padStart(2, "0");
const fechas = ref({
  from: `${year}/${month}/${day}`,
  to: `${year}/${month}/${day}`,
});

const fechas_texto = ref(`Del ${fechas.value.from} al ${fechas.value.to}`);

watchEffect(() => {
  fechas_texto.value = `Del ${fechas.value.from} al ${fechas.value.to}`;
});

onMounted(() => {
  load_empleados();
});

const load_empleados = async () => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  await checador_store.load_empleados_calendario();
  await checador_store.load_checadas(fechas.value.from, fechas.value.from);
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
</script>

<style></style>
