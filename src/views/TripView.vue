<script>
export default {
  name: "TripView",
};
</script>

<template>
  <div>
    <p>Welcome to the trip view</p>
    <router-link :to="'/trips/' + trip.tripId + '/map'"
      ><button class="btn">View map</button></router-link
    >
  </div>
</template>
