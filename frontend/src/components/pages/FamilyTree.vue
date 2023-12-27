<template>
  <!--   
  <div>
    <DemoButtons />
  </div> -->

  <v-container v-if="!isAuthorized">
    <h1>Bitte logge dich ein!</h1>
    <span to="/login"></span>
  </v-container>

  <v-container v-if="isAuthorized">
    <DisplayFamilyTree FamilyTreeId="5" DisplaySize="100vh" />
  </v-container>
  <v-container>
    <GoogleMaps />
  </v-container>
</template>

<script>
import DisplayFamilyTree from "@/components/DisplayFamilyTree.vue";
import GoogleMaps from "@/components/GoogleMaps.vue";
import DemoButtons from "../DemoButtons.vue";
import axios from "axios";
let backendURL = import.meta.env.VITE_BACKEND_URL;

export default {
  name: "Familytree",
  components: {
    DisplayFamilyTree,
    GoogleMaps,
    DemoButtons,
  },
  data: () => ({
    isAuthorized: false,
  }),
  mounted() {
    axios
      .get(`${backendURL}/users/yes/authenticate`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        console.log(response.data);
        this.isAuthorized = true;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>

<style scoped></style>
