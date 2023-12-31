<template>
  <GoogleMap
    api-key="AIzaSyBbV9XvfLHwGRnyaX0EbJNmqGfhMZaiQbU"
    style="width: 1200px; height: 850px"
    :center="center"
    :zoom="15"
    :api-promise="apiPromise"
  >
    <Marker :options="{ position: center }" />
  </GoogleMap>
</template>

<script>
//https://github.com/inocan-group/vue3-google-map/issues/185
import { defineComponent } from "vue";
import { GoogleMap, Marker } from "vue3-google-map";

export default defineComponent({
  components: { GoogleMap, Marker },
  setup() {
    const center = { lat: 40.689247, lng: -74.044502 };

    return { center };
  },
  data() {
    return {
      apiPromise: null,
    };
  },
});
</script>
