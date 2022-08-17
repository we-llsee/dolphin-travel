<script>
import DayGallery from "../components/DayGallery.vue";
import EditTrip from "../components/EditTrip.vue";

export default {
  name: "TripView",
  components: {
    DayGallery,
    EditTrip,
  },
  data() {
    return {
      isToggled: false,
    };
  },
  methods: {
    toggleTrip() {
      this.isToggled = !this.isToggled;
    },
  },
};
</script>

<template>
  <div>
    <p>Welcome to the trip view</p>
    <DayGallery />
    <EditTrip v-if="isToggled" @toggle-form="toggleTrip" />
    <router-link :to="'/trips/' + $route.params.tripId + '/map'"
      ><button class="btn">View map</button></router-link
    >
    <router-link :to="'/trips/' + $route.params.tripId + '/activities'">
      <button class="btn">View All Activities</button></router-link
    >
    <button class="btn" @click="toggleTrip">Edit Trip</button>
  </div>
</template>
//asssign days
