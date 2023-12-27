<template>
  <v-row justify="center">
    <v-col cols="6">
      <v-card color="surface" class="pa-6 mx-auto">
        <v-card-title class="text-h5">Konto erstellen</v-card-title>

        <v-card-item>
          <v-form @submit.prevent>
            <v-text-field v-model="userName" :rules="rules" label="Username">
            </v-text-field>
            <v-text-field
              prepend-inner-icon="mdi-email"
              v-model="email"
              :rules="emailRules"
              label="E-Mail"
            >
            </v-text-field>
            <v-text-field
              prepend-inner-icon="mdi-lock"
              v-model="password"
              :rules="passwordRules"
              label="Passwort"
              type="password"
            >
            </v-text-field>
            <v-text-field
              prepend-inner-icon="mdi-lock"
              v-model="confirmPassword"
              :rules="confirmPasswordRules"
              label="Passwort bestätigen"
              type="password"
            >
            </v-text-field>

            <v-btn @click="createAcount" type="submit" block class="mt-2"
              >KONTO ERSTELLEN
            </v-btn>

            <v-row class="mt-2">
              <v-col>
                Du hast bereits ein Konto?
                <span @click="redirectToLogin" class="text-h6 link">LOGIN</span>
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
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    rules: [(value) => !!value || "Bitte gib einen Vornamen ein."],
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
    confirmPasswordRules: [
      (value) =>
        value === this.password || "Die Passwörter stimmen nicht überein.",
    ],
  }),
  methods: {
    redirectToLogin() {
      // Hier kannst du den Code hinzufügen, um zur Loginseite zu navigieren
      this.$router.push("/login");
    },
    createAcount() {
      // Hier kannst du den Code hinzufügen, um ein Konto zu erstellen
      axios
        .post(`${backendURL}/users`, {
          UserName: this.userName,
          Email: this.email,
          Password: this.password,
        })
        .then((response) => {
          console.log(response.data);
          this.$router.push("/login");
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
/* Füge hier deine benutzerdefinierten Styles hinzu */
</style>
