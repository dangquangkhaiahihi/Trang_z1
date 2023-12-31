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
    <DisplayFamilyTree
      :FamilyTreeId="this.familyTreeId"
      DisplaySize="100vh"
      :ReloadFamilyTree="this.shouldReloadFamilyTree"
    />
  </v-container>
  <v-container>
    <addPersons
      :FamilyTreeId="this.familyTreeId"
      @reload-family-tree="handleReloadFamilyTree"
    />
  </v-container>
</template>

<script>
import DisplayFamilyTree from "@/components/DisplayFamilyTree.vue";
import GoogleMaps from "@/components/GoogleMaps.vue";
import addPersons from "@/components/addPersons.vue";
import axios from "axios";
let backendURL = import.meta.env.VITE_BACKEND_URL;

export default {
  name: "Familytree",
  components: {
    DisplayFamilyTree,
    GoogleMaps,
    addPersons,
  },
  props: {
    familyTreeId: {
      type: Number,
      required: true,
    },
  },

  data: () => ({
    isAuthorized: false,
    shouldReloadFamilyTree: false,
  }),
  methods: {
    handleReloadFamilyTree(value) {
      this.shouldReloadFamilyTree = value;
      console.log(this.shouldReloadFamilyTree);
    },
  },
  mounted() {
    console.log("mounted", this.familyTreeId);
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
