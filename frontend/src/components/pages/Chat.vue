
<script>
export default {
  name: 'About',
};
</script>

<template>
  <v-layout class="rounded rounded-md">
    <v-navigation-drawer class="text-center">
      <v-list>
        <v-list-item class="text-h2" title="Chat"></v-list-item>

          <v-card
              class="ma-2"
              max-width="344"
              title="User 1"
              variant="tonal"
          >
            <template v-slot:prepend>
              <v-icon icon="mdi-account" color="primary"></v-icon>
            </template>

          </v-card>

          <v-card
              class="ma-2"
              max-width="344"
              title="User 1"
              variant="tonal"
          >
            <template v-slot:prepend>
              <v-icon icon="mdi-account" color="primary"></v-icon>
            </template>

          </v-card>

        <v-card
            class="ma-2"
            max-width="344"
            title="User 1"
            variant="tonal"
        >
          <template v-slot:prepend>
            <v-icon icon="mdi-account" color="primary"></v-icon>
          </template>

        </v-card>


      </v-list>
    </v-navigation-drawer>

    <v-app-bar title="Name" class="mx-auto">

      <template v-slot:prepend>
        <v-icon icon="mdi-account" color="primary"></v-icon>
      </template>
    </v-app-bar>

    <v-main class="d-flex align-center justify-center" style="min-height: 300px;">
        Chat content
    </v-main>

    <v-footer
        app
        name="footer"
    >
      <v-btn
          class="mx-auto"
          variant="tonal"
          @click="print('footer')"
      >
        Senden
      </v-btn>
    </v-footer>

  </v-layout>
</template>


