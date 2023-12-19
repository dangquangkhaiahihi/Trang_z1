<script>
import axios from 'axios';

export default {
  data() {
    return {
      people: [],
    };
  },
  mounted() {
    this.fetchPeople();
  },
  methods: {
    async fetchPeople() {
      try {
        const response = await axios.get('/api/people');
        this.people = response.data;
      } catch (error) {
        console.error('Error fetching persons:', error);
      }
    },
  },
};
</script>

<template>
  <div class="pa-md-10 text-center">
    <h1>
      Entdecken Sie Ihre Familiengeschichte
    </h1>
    <div class="text-h5 pa-md-4 text-grey text-center">
      Suchen Sie in FamilySearch nach einem bestimmten Vorfahren.
      Sogar Ihre beste Vermutung reicht aus.
    </div>
  </div>


  <v-layout class="rounded rounded-md">

    <v-card
        class="text-center pa-md-5 pa-4 rounded-e-xl"
        style="background-color: antiquewhite;"
        min-width="400" min-height="400"
        title="Search"
    >
      <form>
        <v-text-field label="Firstname"></v-text-field>

        <v-text-field label="Lastname"></v-text-field>

        <v-text-field label="Date of birth"></v-text-field>

        <v-select label="Hometown"></v-select>

        <v-btn class="me-4" type="submit"> submit </v-btn>
      </form>
    </v-card>


    <v-main class="d-flex justify-center md-10" style="min-height: 300px;" >

      <v-container>
        <v-row align="center" justify="center">
          <div v-for="persons in people" :key ="persons.id">
            <v-card
                class="mx-auto"
                max-width="344"
                title={{persons.title}}
                subtitle={{persons.BirthDate}}
                prepend-icon="mdi-account"
                variant="outlined"
            >
              <v-card-text>{{persons.Gender}}</v-card-text>
              <v-card-text>{{persons.Hometown}}</v-card-text>
              <v-card-actions>
                <v-btn variant="text" @click="reveal1 = true"> View </v-btn>
              </v-card-actions>

            </v-card>
          </div>
        </v-row>
      </v-container>



    </v-main>
  </v-layout>
</template>





