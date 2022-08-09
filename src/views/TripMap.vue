<script>
import { latLng } from "leaflet/dist/leaflet-src.esm";
import { LMap, LTileLayer, LMarker } from "vue-leaflet";
export default {
  name: "TripMap",
  components: {
    LMap,
    LTileLayer,
    LMarker,
  },
};
</script>

<template>
  <div>
    <h1>Welcome to the trip map</h1>
  </div>
</template>
