<template>
  <v-container>
    <v-item-group mandatory>
      <v-row>
        <v-col
          v-for="familytree in familytrees"
          :key="familytree.FamilyTreeID"
          cols="5"
          md="4"
          @click="toggle(familytree.FamilyTreeID)"
        >
          <DisplayFamilyTree
            :FamilyTreeId="familytree.FamilyTreeID"
            DisplaySize="25vh"
          />
          <p>{{ familytree.FamilyTreeID }}</p>
        </v-col>
      </v-row>
    </v-item-group>
  </v-container>
</template>

<script>
import axios from "axios";
import DisplayFamilyTree from "../DisplayFamilyTree.vue";
import router from "../../router";
let backendURL = import.meta.env.VITE_BACKEND_URL;

export default {
  name: "chooseFamilyTree",

  data: () => ({
    user: {},
    loading: true,
    error: "",
    familytrees: [],
    familyTreeId: null,
  }),

  components: {
    DisplayFamilyTree,
  },

  methods: {
    toggle(familyTreeId) {
      router.push({ name: "FamilyTree", params: { familyTreeId } });
    },
  },

  async mounted() {
    try {
      const userResponse = await axios.get(
        `${backendURL}/users/yes/authenticate`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      const accessControlResponse = await axios.get(
        `${backendURL}/accessControl/user/${userResponse.data.user.id}`
      );

      this.familytrees = accessControlResponse.data;

      console.log(
        this.familytrees,
        "DisplaySize wa sa",
        this.familytrees.length,
        "familytrees.length",
        this.familytrees[0],
        "familytrees[0]",
        this.familytrees[0].FamilyTreeID
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
    this.loading = false;
    console.log("onBeforeMount");
  },
};
</script>

<style></style>
