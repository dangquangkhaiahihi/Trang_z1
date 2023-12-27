<template>
  <v-row justify="center">
    <v-col cols="6">
      <v-card color="surface" class="pa-6 mx-auto">
        <v-card-title class="text-h5">Login</v-card-title>

        <v-card-item>
          <v-form @submit.prevent>
            <v-text-field
              prepend-inner-icon="mdi-email"
              v-model="email"
              :rules="emailRules"
              label="E-Mail"
            >
              <!-- to see other icons just https://fonts.google.com/icons -->
            </v-text-field>
            <v-text-field
              prepend-inner-icon="mdi-lock"
              v-model="password"
              :rules="passwordRules"
              label="Passwort"
              type="password"
            >
            </v-text-field>
            <v-checkbox v-model="checkbox" label="remember me" />

            <v-btn @click="Login" type="submit" block class="mt-2">LOGIN</v-btn>

            <v-row class="mt-2">
              <v-col>
                Kein Konto?
                <span @click="redirectToRegister" class="text-h6 link"
                  >ERSTELL DIR EINES</span
                >
              </v-col>
            </v-row>

            <v-row class="mt-2">
              <v-col class="text-caption">
                <span @click="redirectToRegister" class="text-h6 link"
                  >Passwort vergessen?</span
                >
              </v-col>
            </v-row>
          </v-form>
        </v-card-item>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import axios from "axios";
let backendURL = import.meta.env.VITE_BACKEND_URL;
export default {
  data: () => ({
    email: "",
    password: "",
    checkbox: false,
    emailRules: [
      (value) => !!value || "Bitte gib eine E-Mail-Adresse ein.",
      (value) => /.+@.+\..+/.test(value) || "Ungültige E-Mail-Adresse.",
    ],
    passwordRules: [
      (value) => !!value || "Bitte gib ein Passwort ein.",
      (value) =>
        (value && value.length >= 8) ||
        "Das Passwort muss mindestens 8 Zeichen lang sein.",
    ],
  }),
  methods: {
    redirectToRegister() {
      const token = localStorage.getItem("token");
      axios
        .get(`${backendURL}/users/yes/authenticate`, {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          console.log(response.data);
          this.sqlData = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    Login() {
      axios
        .post(`${backendURL}/users/login`, {
          Email: this.email,
          Password: this.password,
        })
        .then((response) => {
          console.log(response);
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          this.$router.push("/");
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style>
.link {
  cursor: pointer;
  color: hotpink;
  text-decoration: underline;
}

.text-caption {
  font-size: 0.75rem; /* Kleine Schriftgröße */
  margin-top: -8px; /* Negative margin, um den Abstand zu verringern */
}
/* Add your custom styles here */
</style>
