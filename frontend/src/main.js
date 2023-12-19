import { createApp } from "vue";
import App from "./App.vue";
import axios from "axios";  // Importiere Axios
import * as dotenv from "dotenv";

console.log(import.meta.env);

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css";

import router from "./router";

const app = createApp(App);

// Verwende Axios in der gesamten Anwendung
app.config.globalProperties.$axios = axios;

const customDarkTheme = {
  dark: true,
  colors: {
    background: "#15202b",
    surface: "#15202b",
    primary: "#15202b",
    secondary: "#00C6B5",
    third: "#EA80FC",
    error: "#f44336",
    info: "#2196F3",
    success: "#4caf50",
    warning: "#fb8c00",
  },
};

const customLightTheme = {
  dark: false,
  colors: {
    background: "#ffffff",
    surface: "#f8f8f8",
    primary: "#E2D2C4",
    secondary: "#6B9480",
    third: "#566156",
    error: "#f44336",
    info: "#2196F3",
    success: "#4caf50",
    warning: "#fb8c00",
  },
};

app.use(router);
app.use(
    createVuetify({
      components,
      directives,
      defaults: {
        VBtn: {
          color: "secondary",
          variant: "tonal",
          rounded: "xl",
        },
        VTextField: {
          outlined: true,
          color: "third",
        },
      },
      theme: {
        defaultTheme: "customLightTheme",
        themes: {
          customLightTheme,
          customDarkTheme,
        },
      },
    })
);

app.mount("#app");
//