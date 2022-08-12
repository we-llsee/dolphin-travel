<script>
  import DayGallery from "../components/DayGallery.vue";
  export default {
    name: "TripView",
    components: {
      DayGallery,
    },
  };
</script>

<template>
  <div>
    <p>Welcome to the trip view</p>
    <DayGallery />
    <router-link :to="'/trips/' + $route.params.tripId + '/map'"
      ><button class="btn">View map</button></router-link
    >
    <router-link :to="'/trips/' + $route.params.tripId + '/activities'">
      <button class="btn">View All Activities</button></router-link
    >
  </div>
</template>
