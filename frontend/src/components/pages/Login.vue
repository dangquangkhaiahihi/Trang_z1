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

            <v-btn type="submit" block class="mt-2">LOGIN</v-btn>

            <v-row class="mt-2">
              <v-col>
                Kein Konto? <span @click="redirectToRegister" class="text-h6 link">ERSTELL DIR EINES</span>
              </v-col>
            </v-row>

            <v-row class="mt-2">
              <v-col class="text-caption">
                <router-link to="/forgot-password" class="link">Passwort vergessen?</router-link>
              </v-col>
            </v-row>

          </v-form>
        </v-card-item>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
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
      (value) => (value && value.length >= 8) || "Das Passwort muss mindestens 8 Zeichen lang sein.",
    ],
  }),
  methods: {
    redirectToRegister() {
      this.$router.push('/register');
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
