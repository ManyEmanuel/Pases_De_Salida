<template>
  <q-page padding>
    <div class="row">
      <div class="col">
        <div class="q-pa-md q-gutter-sm">
          <q-breadcrumbs>
            <q-breadcrumbs-el icon="home" to="/" />
            <q-breadcrumbs-el
              label="Registro general de pases"
              icon="library_books"
            />
          </q-breadcrumbs>
        </div>
      </div>
    </div>

    <TablaComp />
  </q-page>
</template>
<script setup>
import { useQuasar } from "quasar";
import { useAuthStore } from "../../../stores/auth_store";
import { onBeforeMount } from "vue";
import { storeToRefs } from "pinia";
import TablaComp from "../component/TablaComp.vue";

//-----------------------------------------------------------

const $q = useQuasar();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const siglas = "PS-REG-GEN";

//-----------------------------------------------------------

onBeforeMount(() => {
  leerPermisos();
});

//-----------------------------------------------------------

const leerPermisos = async () => {
  $q.loading.show();
  await authStore.loadModulo(siglas);
  $q.loading.hide();
};
</script>
