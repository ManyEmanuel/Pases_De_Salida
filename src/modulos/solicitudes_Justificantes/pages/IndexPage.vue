<template>
  <q-page padding>
    <div class="row">
      <div class="col">
        <div class="q-pa-md q-gutter-sm">
          <q-breadcrumbs>
            <q-breadcrumbs-el icon="home" to="/" />
            <q-breadcrumbs-el
              label="Solicitudes de justificantes"
              icon="library_books"
            />
          </q-breadcrumbs>
        </div>
      </div>
    </div>
    <div class="row justify-center">
      <q-card class="col">
        <q-tabs
          v-model="tab"
          dense
          align="justify"
          class="text-purple-ieen"
          active-color="purple-ieen-1"
          indicator-color="pink-ieen-1"
        >
          <q-tab name="solicitudes" label="Solicitudes pendientes" />
          <q-tab name="historial" label="Historial de solicitudes" />
        </q-tabs>
        <q-separator />
        <q-tab-panels v-model="tab" animated class="text-right">
          <q-tab-panel name="solicitudes">
            <TablaSolicitudes />
          </q-tab-panel>
          <q-tab-panel name="historial">
            <TablaHistorial />
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
    <ModalComp />
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import TablaSolicitudes from "../components/TablaSolicitudes.vue";
import TablaHistorial from "../components/TablaHistorial.vue";
import ModalComp from "../components/ModalComp.vue";

//-----------------------------------------------------------

const tab = ref("solicitudes");
</script>
