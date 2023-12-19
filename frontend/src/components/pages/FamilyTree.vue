<template>
  <div>
    <DemoButtons />
  </div>
  <v-container>
    <DisplayFamilyTree />
  </v-container>
  <v-container>
    <GoogleMaps />
  </v-container>
</template>

<script>
import DisplayFamilyTree from "@/components/DisplayFamilyTree.vue";
import GoogleMaps from "@/components/GoogleMaps.vue";
import DemoButtons from "../DemoButtons.vue";
export default {
  name: "Familytree",
  components: {
    DisplayFamilyTree,
    GoogleMaps,
    DemoButtons,
  },
};
</script>

<style scoped></style>
