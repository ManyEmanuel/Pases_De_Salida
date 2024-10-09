<template>
  <div class="row bg-grey-1">
    <div class="col-9">
      <div class="q-pa-md q-gutter-sm">
        <div class="text-gray-ieen-1 text-h6">Mis checadas</div>
        <q-breadcrumbs>
          <template v-slot:separator>
            <q-icon size="1.5em" name="chevron_right" color="primary" />
          </template>
          <q-breadcrumbs-el icon="home" label="Inicio" to="/" />
          <q-breadcrumbs-el class="text-grey-7" label="Mis checadas" />
        </q-breadcrumbs>
      </div>
    </div>
  </div>
  <CalendarPersonal :tipo="'personal'" />
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useChecadaStore } from "src/stores/checadas_store";
import { onBeforeMount, ref } from "vue";
import { useQuasar, QSpinnerFacebook } from "quasar";
import CalendarPersonal from "../components/CalendarPersonal.vue";

//-----------------------------------------------------------

const $q = useQuasar();
const checada_store = useChecadaStore();
const { mis_checadas } = storeToRefs(checada_store);
const currentDate = ref(new Date());
const currentYear = currentDate.value.getFullYear();
const currentMonth = (currentDate.value.getMonth() + 1)
  .toString()
  .padStart(2, "0");

//-----------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

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
  mis_checadas.value = [];
  let dias_Mes = new Date(currentYear, currentMonth, 0).getDate();
  await checada_store.load_mis_checadas(
    `${currentYear}-${currentMonth}-01`,
    `${currentYear}-${currentMonth}-${dias_Mes}`
  );
  $q.loading.hide();
};
</script>
