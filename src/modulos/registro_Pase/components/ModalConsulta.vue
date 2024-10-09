<template>
  <q-dialog
    v-model="modalconsulta"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 900px; max-width: 90vw">
      <q-card-section class="row">
        <q-img
          src="../../../assets/IEEN300.png"
          :width="$q.screen.xs ? '60px' : '90px'"
        />
        <div
          class="text-h6 text-gray-ieen-1 text-bold absolute-center text-center"
        >
          VER PASE
          <p class="text-purple-ieen text-subtitle1 text-center text-bold">
            {{ paseConsulta.folio }}
          </p>
        </div>

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
        <div class="row q-col-gutter-md">
          <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <q-input v-model="paseConsulta.folio" readonly label="Folio">
            </q-input>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <q-input v-model="paseConsulta.estatus" readonly label="Estatus">
            </q-input>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <q-input
              v-model="paseConsulta.tipo_Pase"
              readonly
              label="Tipo de pase"
            >
            </q-input>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <q-input
              v-model="paseConsulta.tipo_Asunto"
              readonly
              label="Tipo de asunto"
            >
            </q-input>
          </div>

          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-input
              v-model="paseConsulta.area"
              readonly
              label="Área del solicitante"
            >
            </q-input>
          </div>
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-input
              v-model="paseConsulta.responsable_Area"
              readonly
              label="Persona que autoriza"
            >
            </q-input>
          </div>
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-input
              v-model="paseConsulta.solicitante"
              readonly
              label="Solicitante"
            >
            </q-input>
          </div>
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-input
              v-model="paseConsulta.puesto_Solicitante"
              readonly
              label="Puesto del solicitante"
            >
            </q-input>
          </div>
          <div
            v-if="paseConsulta.tipo_Pase == 'Entrada'"
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
          >
            <q-input
              v-model="paseConsulta.entrada"
              readonly
              label="Fecha y hora de entrada"
            >
            </q-input>
          </div>
          <div
            v-if="paseConsulta.tipo_Pase == 'Salida'"
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
          >
            <q-input
              v-model="paseConsulta.salida"
              readonly
              label="Fecha y hora de salida"
            >
            </q-input>
          </div>
          <div
            v-if="paseConsulta.tipo_Pase == 'Intermedio'"
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
          >
            <q-input
              v-model="paseConsulta.salida"
              readonly
              label="Fecha y hora de salida"
            >
            </q-input>
          </div>
          <div
            v-if="paseConsulta.tipo_Pase == 'Intermedio'"
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
          >
            <q-input
              v-model="paseConsulta.llegada"
              readonly
              label="Hora estimada de llegada"
            >
            </q-input>
          </div>
          <div
            v-if="
              paseConsulta.tipo_Pase == 'Intermedio' &&
              paseConsulta.vehiculo_Id != null
            "
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
          >
            <q-input
              v-model="paseConsulta.vehiculo"
              readonly
              label="Vehículo oficial"
            >
            </q-input>
          </div>
          <div
            v-if="
              paseConsulta.tipo_Pase == 'Intermedio' && paseConsulta.rol != null
            "
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
          >
            <q-input
              v-model="paseConsulta.rol"
              readonly
              label="Rol en el vehículo"
            >
            </q-input>
          </div>
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-input
              v-model="paseConsulta.asunto"
              readonly
              autogrow
              label="Asunto del pase"
            >
            </q-input>
          </div>
          <br />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { onBeforeMount, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { useAuthStore } from "../../../stores/auth_store";
import { useRegistroPaseStore } from "../../../stores/registro_Pase_store";

const $q = useQuasar();
const pasesStore = useRegistroPaseStore();
const authStore = useAuthStore();
const { paseConsulta, modalconsulta } = storeToRefs(pasesStore);

const actualizarModal = (valor) => {
  pasesStore.actualizarConsulta(valor);
  pasesStore.initPaseConsulta();
};
</script>
