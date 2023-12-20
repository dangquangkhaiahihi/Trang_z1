<script setup>
import { h, ref } from "vue";
import { Background } from "@vue-flow/background";
import { Controls } from "@vue-flow/controls";
import { MiniMap } from "@vue-flow/minimap";
import { VueFlow, useVueFlow } from "@vue-flow/core";
import CustomNode from "./CustomNode.vue";
import CustomEdge from "./CustomEdge.vue";
import axios from "axios";

let backendURL = import.meta.env.VITE_BACKEND_URL;

const { onConnect, addEdges, toObject } = useVueFlow();

const sqlData = ref("");

const nodes = ref([]);

const edges = ref([]);

const flowKey = "example-flow";

const position = ref();
const familyTreeId = 5;
const onSave = () => {
  const nodePosition = JSON.stringify(toObject());

  axios
    .post(`${backendURL}/familyTree/nodes/${familyTreeId}`, {
      NodePosition: nodePosition,
    })
    .then((response) => {
      console.log(response.data);
      // Handle the response as needed
    })
    .catch((error) => {
      console.error("Error saving node positions:", error);
    });
};

const onRestore = () => {
  axios
    .get(`${backendURL}/familyTree/nodes/${familyTreeId}`)
    .then((response) => {
      console.log(response.data);
      // Handle the response as needed
      const nodePositionString = response.data.NodePosition;

      try {
        const flow = JSON.parse(nodePositionString);
        position.value = flow;
        nodes.value = flow.nodes;
        edges.value = flow.edges;
      } catch (error) {
        console.error("Error parsing NodePosition:", error);
      }
    })
    .catch((error) => {
      console.error("Error fetching node positions:", error);
    });
};

const getDatabase = () => {
  // replace this with the actual family tree ID
  axios
    .get(`${backendURL}/persons/familyTree/${familyTreeId}`)
    .then((response) => {
      // Handle the response here
      console.log(response.data);
      sqlData.value = response.data;

      const startY = 100; // Adjust the starting Y position
      const spacingY = 100; // Adjust the spacing between rows

      const generations = new Map();
      const generationHeights = {
        "The Greatest Generation": 0,
        "The Silent Generation": 1,
        "The Baby Boomer Generation": 2,
        "Generation X": 3,
        Millennials: 4,
        "Generation Z": 5,
        "Gen Alpha": 6,
      };

      // Use a dynamic variable to track the current X position for each generation
      const startXByGeneration = {};

      response.data.forEach((person, index) => {
        const birthYear = new Date(person.BirthDate).getFullYear();
        let generation;
        if (birthYear >= 1901 && birthYear <= 1927) {
          generation = "The Greatest Generation";
        } else if (birthYear >= 1928 && birthYear <= 1945) {
          generation = "The Silent Generation";
        } else if (birthYear >= 1946 && birthYear <= 1964) {
          generation = "The Baby Boomer Generation";
        } else if (birthYear >= 1965 && birthYear <= 1980) {
          generation = "Generation X";
        } else if (birthYear >= 1981 && birthYear <= 1996) {
          generation = "Millennials";
        } else if (birthYear >= 1996 && birthYear <= 2012) {
          generation = "Generation Z";
        } else {
          generation = "Gen Alpha";
        }

        // Set Y position for each generation
        const newY = startY + generationHeights[generation] * spacingY;

        // Set X position for each person within the same generation
        const startX =
          startXByGeneration[generation] ||
          (startXByGeneration[generation] = 250);

        console.log(newY, "newY");
        nodes.value.push({
          id: person.PersonID.toString(),
          type: "output",
          label: person.Firstname,
          position: { x: startX, y: newY },
        });

        // Update the X position for the next person in the same generation
        startXByGeneration[generation] += 170; // Adjust spacingX as needed

        // Store the generation for later use
        generations.set(person.PersonID, generation);
      });
      generations.forEach((generation, personID) => {
        console.log(`Person ID: ${personID}, Generation: ${generation}`);
      }); // Map of PersonID and generation
    });
  axios
    .get(`${backendURL}/relationsships/familyTree/${familyTreeId}`)
    .then((response) => {
      // Handle the response here
      console.log(response.data);

      // Map relationships to nodes and edges
      response.data.forEach((relationship) => {
        const sourcePerson = nodes.value.find(
          (node) => node.id === relationship.PersonOneID.toString()
        );
        const targetPerson = nodes.value.find(
          (node) => node.id === relationship.PersonTwoID.toString()
        );

        if (sourcePerson && targetPerson) {
          edges.value.push({
            id: `e${relationship.RelationshipID}`,
            source: sourcePerson.id,
            target: targetPerson.id,
          });
        }
      });
    });
};
</script>

<template>
  <div class="getPersons">
    <v-btn @click="getDatabase()">Get Database Query</v-btn>
    <p>{{ sqlData }}</p>
  </div>
  <div class="saveFlow">
    <v-btn @click="onSave()">Save Flow</v-btn>
    <p>{{ flowKey }}</p>
  </div>
  <div style="height: 100vh">
    <VueFlow
      v-model:nodes="nodes"
      v-model:edges="edges"
      fit-view-on-init
      class="vue-flow-basic-example"
      :default-zoom="1.5"
      :min-zoom="0.2"
      :max-zoom="4"
    >
      <Background pattern-color="#aaa" :gap="8" />

      <MiniMap />

      <Controls />

      <template #node-custom="nodeProps">
        <CustomNode v-bind="nodeProps" />
      </template>

      <template #edge-custom="edgeProps">
        <CustomEdge v-bind="edgeProps" />
      </template>
    </VueFlow>
  </div>
  <div class="restoreFlow">
    <v-btn @click="onRestore()">Restore Flow</v-btn>
    <p>{{ flowKey }}</p>
  </div>
</template>

<style>
/* import the necessary styles for Vue Flow to work */
@import "@vue-flow/core/dist/style.css";

/* import the default theme, this is optional but generally recommended */
@import "@vue-flow/core/dist/theme-default.css";
</style>
