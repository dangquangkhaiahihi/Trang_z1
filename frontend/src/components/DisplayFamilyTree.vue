<script setup>
import { h, ref } from "vue";
import { Background } from "@vue-flow/background";
import { Controls } from "@vue-flow/controls";
import { MiniMap } from "@vue-flow/minimap";
import { VueFlow, useVueFlow } from "@vue-flow/core";
import CustomNode from "./CustomNode.vue";
import CustomEdge from "./CustomEdge.vue";
import axios from "axios";
import { onMounted, defineProps } from "vue";
import { onBeforeMount } from "vue";
let backendURL = import.meta.env.VITE_BACKEND_URL;
const props = defineProps(["FamilyTreeId", "DisplaySize", "ReloadFamilyTree"]);

const { toObject } = useVueFlow();

const sqlData = ref("");
const displaySize = ref(props.DisplaySize);
const nodes = ref([]);

const edges = ref([]);
const loading = ref(true);
const flowKey = ref("test");

const position = ref();

const familyTreeAccess = ref("");
const user = ref([]);

const nodePositionString = ref();
const DisplaySize = displaySize.value.split("vh")[0];

onBeforeMount(async () => {
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
      `${backendURL}/accessControl/${props.FamilyTreeId}/${userResponse.data.user.id}`
    );

    familyTreeAccess.value = accessControlResponse.data;
    const FamilytreeResponse = await axios.get(
      `${backendURL}/familyTree/${props.FamilyTreeId}`
    );
    flowKey.value = FamilytreeResponse.data.FamilyTreeName;
    console.log(props.DisplaySize, "DisplaySize");
  } catch (error) {
    console.error(error);
    throw error;
  }
  loading.value = false;
  console.log("onBeforeMount", DisplaySize);
  onRestore();
  console.log("flowname", this.flowKey);
});
onMounted(async () => {
  if (nodePositionString.length === 0) {
    const displayFamilyTree = async () => {
      try {
        axios
          .get(`${backendURL}/persons/familyTree/${props.FamilyTreeId}`)
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

              /*         axios
          .get(`${backendURL}/relationsships/${person.PersonID}`)
          .then((response) => {
            // Handle the response here
            console.log(response.data);
          });
 */
              console.log(newY, "newY");
              nodes.value.push({
                id: person.PersonID.toString(),
                label: person.Firstname,
                position: { x: startX, y: newY },
                style: { backgroundColor: "green" },
              });

              // Update the X position for the next person in the same generation
              startXByGeneration[generation] += 170; // Adjust spacingX as needed

              // Store the generation for later use
              generations.set(person.PersonID, generation);
            });
            generations.forEach((generation, personID) => {
              console.log(`Person ID: ${personID}, Generation: ${generation}`);
            }); // Map of PersonID and generation

            axios
              .get(
                `${backendURL}/relationsships/familyTree/${props.FamilyTreeId}`
              )
              .then((response) => {
                // Handle the response here
                console.log(response.data, "relationships");

                // Map relationships to nodes and edges
                response.data.forEach((relationship) => {
                  const sourcePerson = nodes.value.find(
                    (node) => node.id === relationship.PersonOneID?.toString()
                  );
                  const targetPerson = nodes.value.find(
                    (node) => node.id === relationship.PersonTwoID?.toString()
                  );

                  if (sourcePerson && targetPerson) {
                    edges.value.push({
                      id: `e${relationship.RelationshipID}`,
                      source: targetPerson.id,
                      target: sourcePerson.id,
                    });
                  }
                });
              });
          });
        console.log("flowname", this.flowKey.value);
        loading.value = false;
      } catch (error) {
        console.error(error);
        throw error;
      }
    };
    displayFamilyTree();
  }
});

const onSave = () => {
  loading.value = true;
  const nodePosition = JSON.stringify(toObject());

  axios
    .post(`${backendURL}/familyTree/nodes/${props.FamilyTreeId}`, {
      NodePosition: nodePosition,
    })
    .then((response) => {
      console.log(response.data);
      loading.value = false;
      // Handle the response as needed
    })
    .catch((error) => {
      console.error("Error saving node positions:", error);
    });
};

const onRestore = () => {
  console.log("onRestore", props.ReloadFamilyTree);
  axios
    .get(`${backendURL}/familyTree/nodes/${props.FamilyTreeId}`)
    .then((response) => {
      console.log(response.data);
      // Handle the response as needed
      nodePositionString.value = response.data.NodePosition;
      console.log(props.DisplaySize, "DisplaySizes");

      try {
        const flow = JSON.parse(nodePositionString.value);
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
  watch(
    () => props.ReloadFamilyTree,
    (newValue, oldValue) => {
      if (newValue !== oldValue) {
        console.log("Reloading component...");
        displayFamilyTree();
        onRestore();
      }
    }
  );
};
</script>

<template>
  <v-skeleton-loader
    :loading="loading"
    :elevation="1"
    type="card"
    class="vue-flow-wrapper"
  >
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

      <MiniMap v-if="DisplaySize > 70" />
      <Controls />

      <template #node-custom="nodeProps">
        <CustomNode v-bind="nodeProps" />
      </template>

      <template #edge-custom="edgeProps">
        <CustomEdge v-bind="edgeProps" />
      </template>
    </VueFlow>

    <div
      v-if="familyTreeAccess === 'edit' && DisplaySize > 70"
      class="controls"
    >
      <div class="saveFlow">
        <v-btn @click="onSave()">Save Flow</v-btn>
      </div>

      <div class="restoreFlow">
        <v-btn @click="onRestore()">Restore Flow</v-btn>
      </div>
    </div>
    <div class="flowname">
      <p>{{ flowKey }}</p>
    </div>
  </v-skeleton-loader>
</template>

<style>
/* import the necessary styles for Vue Flow to work */
@import "@vue-flow/core/dist/style.css";

/* import the default theme, this is optional but generally recommended */
@import "@vue-flow/core/dist/theme-default.css";

.flowname {
  display: flex;
  align-items: center;
  background-color: white;
  padding: 10px;
  border-radius: 10px;
}

.vue-flow-wrapper {
  position: relative;
  height: v-bind("displaySize");
  width: relative;
}

.saveFlow {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 100;
}

.restoreFlow {
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 100;
}
</style>
