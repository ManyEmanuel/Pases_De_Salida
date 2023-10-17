const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      {
        path: "/registro_Pases",
        name: "registro_Pases",
        component: () => import("../modulos/registro_Pase/pages/IndexPage"),
      },
      {
        path: "/solicitudes_Pases",
        name: "solicitudes_Pases",
        component: () => import("../modulos/solicitudes_Pase/pages/IndexPage"),
      },
      {
        path: "/registro_General",
        name: "registro_General",
        component: () => import("../modulos/registro_General/pages/IndexPage"),
      },
      {
        path: "/registro_Justificante",
        name: "registro_Justificante",
        component: () => import("../modulos/justificantes/pages/IndexPage"),
      },
      {
        path: "/solicitudes_Justificantes",
        name: "solicitudes_Justificantes",
        component: () =>
          import("../modulos/solicitudes_Justificantes/pages/IndexPage"),
      },
      {
        path: "/misChecadas",
        name: "misChecadas",
        component: () =>
          import("../modulos/solicitudes_Justificantes/pages/IndexPage"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
