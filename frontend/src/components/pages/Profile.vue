<template>
  <v-app>
    <v-container class="d-flex justify-center align-center">
      <v-card class="profile-card">
        <!-- Profiltitel -->
        <v-card-title class="text-center">Mein Profil</v-card-title>

        <v-row>
          <v-col class="left-column">
            <v-avatar size="200">
              <img :src="userProfile.image" alt="Profilbild">
            </v-avatar>
          </v-col>

          <v-col class="right-column">
            <v-card-subtitle>Benutzerinformationen</v-card-subtitle>

            <v-card-text>
              <!-- Benutzerinformationen Textfelder -->
              <v-text-field v-model="userProfile.vorname" label="Vorname" class="narrow-text-field"></v-text-field>
              <v-text-field v-model="userProfile.nachname" label="Nachname" class="narrow-text-field"></v-text-field>
              <v-text-field v-model="userProfile.stadt" label="Stadt" class="narrow-text-field"></v-text-field>

              <!-- Speichern-Button -->
              <v-btn @click="speichern">Speichern</v-btn>
            </v-card-text>
          </v-col>
        </v-row>
      </v-card>
    </v-container>

    <!-- Neuer Container für Familieninformationen -->
    <v-container class="d-flex justify-center mt-4">
      <v-card class="profile-card">
        <v-card-title class="text-center">Meine Familie</v-card-title>
        <v-card-subtitle>Hier kannst du deine Verwandten eintragen</v-card-subtitle>

        <!-- Verwandtschaftsgrad Dropdown -->
        <v-row class="mt-4">
          <v-col>
            <v-select v-model="familienmitglied.grad" :items="verwandtschaftsgrade" label="Verwandtschaftsgrad"></v-select>
          </v-col>
        </v-row>

        <!-- Textfelder für Verwandte -->
        <v-row>
          <v-col>
            <v-text-field v-model="familienmitglied.vorname" label="Vorname"></v-text-field>
            <v-text-field v-model="familienmitglied.nachname" label="Nachname"></v-text-field>
            <v-text-field v-model="familienmitglied.stadt" label="Stadt"></v-text-field>
            <v-text-field v-model="familienmitglied.geburtsdatum" label="Geburtsdatum"></v-text-field>
          </v-col>
        </v-row>

        <!-- Speichern-Button für Familienmitglied -->
        <v-row class="mt-4">
          <v-col class="text-right">
            <v-btn @click="speichernFamilienmitglied">Speichern</v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      userProfile: {
        vorname: 'Fatih',
        nachname: 'Bozkurt',
        stadt: 'Stockelsdorf',
        image: '/../images/Bild1.jpg',
      },
      familienmitglied: {
        grad: '',
        vorname: '',
        nachname: '',
        stadt: '',
        geburtsdatum: '',
      },
      verwandtschaftsgrade: ['Elternteil', 'Geschwister'],
    };
  },
  methods: {
    speichern() {
      console.log('Benutzerinformationen gespeichert:', this.userProfile);
    },
    speichernFamilienmitglied() {
      console.log('Familienmitglied gespeichert:', this.familienmitglied);
      // Hier kannst du die Logik zum Speichern des Familienmitglieds implementieren
    },
  },
};
</script>

<style>
.profile-card {
  width: 100%; /* Füllt die Breite des Containers aus */
}
</style>