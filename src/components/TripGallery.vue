<template>
  <div>
    <button></button>
    <p>These are your upcoming trips...</p>
    <div :key="trip.id" v-for="trip in trips">
      <TripCard :trip="trip" @delete-trip="$emit('delete-trip', trip.tripId)" />
    </div>
  </div>
</template>
<script>
import TripCard from "./TripCard.vue";

export default {
  name: "TripGallery",
  components: { TripCard },
  props: {
    trips: Array,
  },
  emits: ["delete-trip"],
};
</script>
