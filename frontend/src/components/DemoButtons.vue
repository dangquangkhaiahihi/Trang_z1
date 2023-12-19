<script>
import axios from "axios";

let backendURL = import.meta.env.VITE_BACKEND_URL;

export default {
  data() {
    return {
      clockData: "-",
      sqlData: "",
    };
  },
  methods: {
    getClock(event) {
      /*       console.log(backendURL);
      fetch(backendURL + "/clock", { crossDomain: true })
        .then((response) => response.json())
        .then(
          (data) =>
            (this.clockData =
              "Most recent date-time from rest endpoint: " + data.someDateTime)
        )
        .catch((reason) => console.log(reason)); */
      axios.get(`${backendURL}/clock`).then((response) => {
        // Handle die Antwort hier
        console.log(response.data);
        this.clockData = response.data.someDateTime;
      });
    },
    getDatabase(event) {
      axios.get(`${backendURL}/users`).then((response) => {
        // Handle die Antwort hier
        console.log(response.data);
        this.sqlData = response.data;
      });
    },
  },
};
</script>

<template>
  <div class="">
    <button @click="getClock()">Get Clock</button>
    <p>{{ clockData }}</p>
    <br />
    <button @click="getDatabase()">Get Database Query</button>
    <p>{{ sqlData }}</p>
  </div>
</template>
