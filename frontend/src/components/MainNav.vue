<script>
import { ref, onMounted, getCurrentInstance, transformVNodeArgs } from "vue";
import { useTheme } from "vuetify/lib/framework";
import { authenStore } from '../store/authen.store'

export default {
  name: "MainNav",

  watch: {
    $route(to, from) {
      console.log("from", from)
      console.log("to", to)
      const token = localStorage.getItem("token");
      if(to.path === "/login" && token) {
        this.$router.push(this.Home.path);
      }
      this.checkAuthen();
    },
  },

  methods: {
    checkAuthen() {
      const token = localStorage.getItem("token");
      if ( !token ) {
        authenStore.setIsLoggedIn(false);
        authenStore.setUser(null);
      } else {
        authenStore.setIsLoggedIn(true);
        authenStore.setUser(JSON.parse(localStorage.getItem("user")));
      }
    },
    logout () {
      authenStore.setIsLoggedIn(false);
      authenStore.setUser(null);
      localStorage.clear();
    },
  },

  setup() {
    const instance = getCurrentInstance();
    const theme = useTheme();
    const darkmode = ref(false);

    function changeTheme() {
      darkmode.value = !darkmode.value;
      theme.global.name.value = darkmode.value
        ? "customDarkTheme"
        : "customLightTheme";
    }

    onMounted(() => {
      // Accessing Vuetify theme from the instance
      /*       if (instance && instance.appContext && instance.appContext.app) {
        theme.global.name.value = darkMode ? "dark" : "light";
      } */
    });

    return {
      darkmode,
      changeTheme,
      Home: {
        name: "Home",
        path: "/",
      },
      About: {
        name: "Impressum",
        path: "/about",
      },
      Stammbaum: {
        name: "Stammbaum",
        path: "/familytree",
      },
      Login: {
        name: "Login",
        path: "/login",
      },
      authenStore
    };
  },
};
</script>

<template>
  <div>
    <v-app-bar dense color="primary">
      <v-btn icon="mdi-home" :to="Home.path"></v-btn>
      <v-tabs class="navbar">
        <v-tab :to="About.path">{{ About.name }} </v-tab>
        <v-tab :to="Stammbaum.path">{{ Stammbaum.name }} </v-tab>
      </v-tabs>
      <v-spacer></v-spacer>
      <v-btn icon @click="changeTheme">
        <v-icon
          :icon="darkmode ? 'mdi-weather-sunny' : 'mdi-weather-night'"
        ></v-icon>
      </v-btn>

      <div v-if="authenStore.loggedIn" style="display: flex; gap: 10px; align-items: center">
        <span>Hello {{authenStore.user.userName}}</span>
        <v-btn variant="outlined" @click="logout" >Logout</v-btn>
      </div>
      <div v-else>
        <v-btn variant="outlined" :to="Login.path">{{ Login.name }}</v-btn>
      </div>

    </v-app-bar>
  </div>
</template>

<style>
.navbar {
  float: left !important;
}
.v-tab {
  text-transform: none !important;
}
</style>
