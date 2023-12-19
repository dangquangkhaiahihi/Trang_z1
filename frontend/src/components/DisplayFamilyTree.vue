<script lang="ts" setup>
import { h, ref } from "vue";
import { Background } from "@vue-flow/background";
import { Controls } from "@vue-flow/controls";
import { MiniMap } from "@vue-flow/minimap";
import { VueFlow, useVueFlow, type Node, type Edge } from "@vue-flow/core";
import CustomNode from "./CustomNode.vue";
import CustomEdge from "./CustomEdge.vue";

const { onConnect, addEdges } = useVueFlow();

const nodes = ref<Node[]>([
  { id: "1", type: "input", label: "Mehdi", position: { x: 250, y: 5 } },
  { id: "2", type: "output", label: "Maeee", position: { x: 100, y: 100 } },
  { id: "3", type: "output", label: "Zey", position: { x: 400, y: 100 } },
  { id: "5", type: "output", label: "Tiara", position: { x: 250, y: 200 } },
  {
    id: "4",
    type: "custom",
    label: "bichescounter:",
    position: { x: 100, y: 300 },
  },
]);

const edges = ref<Edge[]>([
  { id: "e1-2", source: "1", target: "2" },
  { id: "e2-1", source: "2", target: "1" },
  { id: "e1-4", source: "2", target: "4" },
  { id: "e1-3", source: "1", target: "3" },
  { id: "e1-5", source: "1", target: "5" },
]);

onConnect((params) => {
  addEdges([params]);
});
</script>

<template>
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
</template>

<style>
/* import the necessary styles for Vue Flow to work */
@import "@vue-flow/core/dist/style.css";

/* import the default theme, this is optional but generally recommended */
@import "@vue-flow/core/dist/theme-default.css";
</style>
