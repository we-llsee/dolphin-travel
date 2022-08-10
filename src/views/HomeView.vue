<script>
import TripGallery from "../components/TripGallery.vue";

export default {
  name: "HomeView",
  components: {
    TripGallery,
  },
  props: {
    trips: Array,
  },
  emits: ["delete-trip"],
};
</script>

<template>
  <main>
    <TripGallery
      :trips="trips"
      @delete-trip="$emit('delete-trip', trip.tripId)"
    />
  </main>
</template>
