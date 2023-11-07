<template>
  <q-dialog
    v-model="modalFiltro"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 1000px; max-width: 80vw">
      <q-card-section class="row">
        <div class="text-h6 text-center">Filtro de reporte</div>
        <q-space />
        <q-btn
          icon="close"
          @click="actualizarModal(false)"
          flat
          round
          dense
          v-close-popup
        />
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="col-6">
            <q-input
              v-model="textoFecha"
              label="Fecha de consulta"
              lazy-rules
              :rules="[(val) => !!val || 'Seleccione una fecha de consulta']"
            >
              <template v-slot:after>
                <q-btn icon="event" color="purple-ieen" flat round>
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="fecha"
                      :locale="myLocale"
                      mask="YYYY-MM-DD"
                      color="purple"
                      range
                    >
                      <div class="row items-center justify-end q-gutter-sm">
                        <q-btn
                          label="Aceptar"
                          color="primary"
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
        </div>
      </q-card-section>
      <q-card-section horizontal>
        <q-card-section class="col-6">
          <div><strong>Listado de áreas</strong></div>
          <div class="row items-start">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-checkbox
                v-model="areasTodos"
                :label="textoAreaTodos"
                color="purple"
                checked-icon="task_alt"
                unchecked-icon="highlight_off"
                :true-value="true"
                :false-value="false"
              />
            </div>

            <div
              v-for="items in listAreas"
              :key="items"
              class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
            >
              <q-checkbox
                v-model="items.select"
                :label="items.value"
                color="purple"
                checked-icon="task_alt"
                unchecked-icon="highlight_off"
                :true-value="true"
                :false-value="false"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-section class="col-3">
          <div><strong>Asunto del pase</strong></div>
          <div class="row items-start">
            <div
              v-for="items in opcionAsuntoPase"
              :key="items"
              class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
            >
              <q-checkbox
                v-model="items.select"
                :label="items.value"
                color="purple"
                checked-icon="task_alt"
                unchecked-icon="highlight_off"
                :true-value="true"
                :false-value="false"
              />
            </div>
          </div>
          <br />
          <div><strong>Tipos de pase</strong></div>
          <div class="row items-start">
            <div
              v-for="items in opcionTipoPase"
              :key="items"
              class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
            >
              <q-checkbox
                v-model="items.select"
                :label="items.value"
                color="purple"
                checked-icon="task_alt"
                unchecked-icon="highlight_off"
                :true-value="true"
                :false-value="false"
              />
            </div>
          </div>
        </q-card-section>
        <q-card-section class="col-3">
          <div><strong>Estatus del pase</strong></div>
          <div class="row items-start">
            <div
              v-for="items in opcionEstatusPase"
              :key="items"
              class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
            >
              <q-checkbox
                v-model="items.select"
                :label="items.value"
                color="purple"
                checked-icon="task_alt"
                unchecked-icon="highlight_off"
                :true-value="true"
                :false-value="false"
              />
            </div>
          </div>
        </q-card-section>
      </q-card-section>
      <q-card-actions>
        <div class="col-12">
          <div class="text-right q-gutter-xs">
            <q-btn
              label="Realizar busqueda"
              icon-right="search"
              color="purple-ieen"
              class="q-ml-xl q-mb-xl"
              @click="busquedaFiltro()"
            />
          </div>
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { onBeforeMount, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { useAuthStore } from "../../../stores/auth_store";
import { useRegistroGeneralStore } from "../../../stores/registro_General_store";
import { useRegistroPaseStore } from "../../../stores/registro_Pase_store";

const $q = useQuasar();
const pasesStore = useRegistroPaseStore();
const generalStore = useRegistroGeneralStore();
const authStore = useAuthStore();
const { modalFiltro, listAreas } = storeToRefs(generalStore);
const { myLocale } = storeToRefs(pasesStore);

const areasTodos = ref(false);
let textoAreaTodos = ref("Seleccionar todos");
let fecha = ref();
let textoFecha = ref("");
const opcionTipoPase = ref([
  { select: true, value: "Entrada" },
  { select: true, value: "Intermedio" },
  { select: true, value: "Salida" },
]);

const opcionAsuntoPase = ref([
  { select: true, value: "Oficial" },
  { select: true, value: "Médico" },
  { select: true, value: "Personal" },
]);
const opcionEstatusPase = ref([
  { select: true, value: "Aprobado" },
  { select: true, value: "Rechazado" },
  { select: true, value: "Cancelado" },
]);

watch(areasTodos, (val) => {
  if (val == true) {
    textoAreaTodos.value = "Deshabilitar todos";
    for (let i = 0; i < listAreas.value.length; i++) {
      listAreas.value[i].select = true;
    }
  } else {
    textoAreaTodos.value = "Seleccionar Todos";
    for (let i = 0; i < listAreas.value.length; i++) {
      listAreas.value[i].select = false;
    }
  }
});

watch(fecha, (val) => {
  if (typeof val != "string") {
    let { from, to } = val;
    textoFecha.value = "del " + from + " hasta " + to;
  } else {
    textoFecha.value = val;
  }
});

const busquedaFiltro = async () => {
  $q.loading.show();
  let areasTrue = listAreas.value.filter((x) => x.select == true);
  let tipoPaseTrue = opcionTipoPase.value.filter((x) => x.select == true);
  let asuntoPaseTrue = opcionAsuntoPase.value.filter((x) => x.select == true);
  let estatusPaseTrue = opcionEstatusPase.value.filter((x) => x.select == true);

  if (fecha.value != undefined) {
    if (areasTrue.length > 0) {
      if (tipoPaseTrue.length > 0) {
        if (asuntoPaseTrue.length > 0) {
          if (estatusPaseTrue.length > 0) {
            let resp = null;
            if (typeof fecha.value != "string") {
              let { from, to } = fecha.value;
              resp = await generalStore.loadFiltroBusqueda(
                listAreas.value,
                opcionTipoPase.value,
                opcionAsuntoPase.value,
                opcionEstatusPase.value,
                from,
                to
              );
            } else {
              resp = await generalStore.loadFiltroBusqueda(
                listAreas.value,
                opcionTipoPase.value,
                opcionAsuntoPase.value,
                opcionEstatusPase.value,
                fecha.value,
                0
              );
            }
            actualizarModal(false);
          } else {
            $q.notify({
              type: "negative",
              message: "Seleccione al menos un estatus de pase",
            });
          }
        } else {
          $q.notify({
            type: "negative",
            message: "Seleccione al menos un asunto",
          });
        }
      } else {
        $q.notify({
          type: "negative",
          message: "Seleccione al menos un tipo de pase",
        });
      }
    } else {
      $q.notify({
        type: "negative",
        message: "Seleccione al menos un área",
      });
    }
  } else {
    $q.notify({
      type: "negative",
      message: "Ingrese una fecha, o rango de fechas",
    });
  }

  $q.loading.hide();
};

const actualizarModal = (valor) => {
  generalStore.actualizarModalFiltro(valor);
};
</script>
