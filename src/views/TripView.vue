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
      goBack() {
        window.history.go(-1);
      },
    toggleTrip() {
      this.isToggled = !this.isToggled;
    },
  },
  
};
</script>

<template>
  <div>
    <DayGallery />
    <EditTrip v-if="isToggled" @toggle-form="toggleTrip" />
    <router-link :to="'/trips/' + $route.params.tripId + '/map'"
      ><button class="btn">View map</button></router-link
    >
    <router-link :to="'/trips/' + $route.params.tripId + '/all-activities'">
      <button class="btn">View All Activities</button></router-link
    >
    <button class="btn" @click="toggleTrip">Edit Trip</button>
    <button class="btn" @click="goBack">Go Back</button>
  </div>
</template>
//asssign days

<style scoped>
@media (hover: hover) {
  .btn:hover {
    box-shadow: 0px 0px 0px 5px var(--light-cyan);
  }

  .btn {
    text-decoration: none;
    transition: 0.4s;
  }
}
</style>
