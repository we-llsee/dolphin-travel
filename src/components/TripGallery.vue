<template>
  <div v-if="loggedIn === false">
    <p>Please login first to view your trips</p>
    <router-link to="/login"
      ><button class="loginbtn">Login</button></router-link
    >
  </div>
  <div v-if="trips.length != 0">
    <p>These are your upcoming trips...</p>
    <div :key="trip._id" v-for="trip in trips">
      <TripCard :trip="trip" />
    </div>
  </div>
</template>

<script>
import TripCard from "./TripCard.vue";
import axios from "axios";
export default {
  name: "TripGallery",
  components: { TripCard },

  data() {
    return {
      trips: [],
      loggedIn: false,
    };
  },
  created() {
    if (this.$store.state.loggedInUser != "GUEST") {
      this.loggedIn = true;
      axios
        .get(
          `https://dolphin-travel.herokuapp.com/api/trips?username=${this.$store.state.loggedInUser}`
        )
        .then((response) => {
          this.trips = response.data.trips;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
  methods: {},
};
</script>
