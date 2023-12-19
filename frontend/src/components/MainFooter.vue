<template>
  <v-footer color="primary" height="auto" class="secondary d-flex flex-column">
    <v-card
      flat
      tile
      color="primary"
      class="lighten-1 white--text text sx-center flex"
    >
      <v-spacer></v-spacer>
      <v-btn
        color="second"
        v-for="icon in icons"
        :key="icon"
        class="mx-4"
        :icon="icon"
        variant="plain"
        size="small"
        :aria-label="getSocialMediaLabel(icon)"
      ></v-btn>
    </v-card>
    <v-card flat color="primary" class="year">
      {{ new Date().getFullYear() }}
    </v-card>
  </v-footer>
</template>

<script>
export default {
  data: () => ({
    icons: ["mdi-facebook", "mdi-twitter", "mdi-linkedin", "mdi-instagram"],
  }),
  methods: {
    getSocialMediaLabel(icon) {
      // Provide descriptive labels for each social media icon
      switch (icon) {
        case "mdi-facebook":
          return "Facebook";
        case "mdi-twitter":
          return "Twitter";
        case "mdi-linkedin":
          return "LinkedIn";
        case "mdi-instagram":
          return "Instagram";
        default:
          return "";
      }
    },
  },
};
</script>

<style>
.flexbox {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: stretch;
  align-content: center;
}
.year {
  margin-top: auto;
  text-color: white;
}
</style>
