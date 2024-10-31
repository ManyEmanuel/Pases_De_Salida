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
        @click="cargarData"
        color="purple-ieen"
        label="Buscar"
        icon-right="search"
      />
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
const startYear = 2022;
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
  if (mes_Id.value == null) {
    let mesFiltrado = meses.value.find((x) => x.value == currentMonth);
    mes_Id.value = mesFiltrado;
  }
  let dias_Mes = new Date(año_Id.value, mes_Id.value.value, 0).getDate();
  await checada_store.load_mis_checadas(
    `${año_Id.value}-${mes_Id.value.value}-01`,
    `${año_Id.value}-${mes_Id.value.value}-${dias_Mes}`
  );
  $q.loading.hide();
};
</script>
