<script>
import axios from "axios";
let backendURL = import.meta.env.VITE_BACKEND_URL;
export default {
  data: () => ({
    authorised: true,
    user: [],
    familyTreeAccess: "",
    flowKey: "",
    loading: true,
    nodes: [],
    firstName: "",
    lastName: "",
    birthDate: "",
    gender: ["W", "M", "D"],
    hometown: "",
    hometownCoordinates: "",
    autocomplete: null,
  }),
  props: {
    FamilyTreeId: {
      type: Number,
      required: true,
    },
    reloadFamilyTree: {
      type: Boolean,
      required: true,
    },
  },
  /*   mounted() {
    this.autocomplete = new google.maps.places.Autocomplete(
      document.getElementById("hometown"),
      { types: ["geocode"] }
    );

    this.autocomplete.addListener("place_changed", this.handlePlaceSelect);
  }, */
  methods: {
    mapGenderToCode(gender) {
      // Map the selected gender value to the corresponding code (W, M, D)
      const genderMap = {
        Weiblich: "W",
        Männlich: "M",
        Divers: "D",
      };
      return genderMap[gender] || null;
    },
    async submitForm() {
      // Use genderCode in your logic or API call

      // Add logic to handle form submission
      // You can access form data using this.firstName, this.lastName, etc.
      // Example: console.log(this.firstName, this.lastName, this.birthDate, this.gender, this.hometown);
      this.$emit("reload-family-tree", true);
      console.log(
        "firstname",
        this.firstName,
        "lastname",
        this.lastName,
        "birthdate",
        this.birthDate,
        "Hometown",
        this.hometown,
        "gender",
        this.mapGenderToCode(this.gender)
      );
      try {
        const response = await axios.post(
          `${backendURL}/persons/${this.FamilyTreeId}`,
          {
            FirstName: this.firstName,
            LastName: this.lastName,
            BirthDate: this.birthDate,
            Hometown: this.hometown,
            Gender: this.mapGenderToCode(this.gender),
          }
        );

        console.log(response.data);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  },
};

/*     handlePlaceSelect() {
      const place = this.autocomplete.getPlace();

      // Extract the coordinates (latitude and longitude) from the selected place
      const location = place.geometry.location;

      // Update the hometown field with the coordinates
      if (location) {
        this.hometownCoordinates = {
          latitude: location.lat(),
          longitude: location.lng(),
        };
      }
    },
  },
}; */
</script>

<template>
  <v-container>
    <h1>Füge deine Verwandten hinzu!</h1>
    <v-form @submit.prevent="submitForm">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="firstName"
            label="Vorname"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="lastName"
            label="Nachname"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="birthDate"
            label="Geburtsdatum"
            type="date"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            v-model="gender"
            :items="['Weiblich', 'Männlich', 'Divers']"
            label="Geschlecht"
            required
          ></v-select>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="hometown"
            label="Stadt"
            required
            id="hometown"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-btn type="submit">Erstellen</v-btn>
    </v-form>
  </v-container>
</template>

<style></style>
