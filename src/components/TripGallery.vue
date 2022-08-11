<template>
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
      username: "jesskemp",
      password: "mohamed123",
      trips: [],
    };
  },
  created() {
    axios
      .get(
        `https://dolphin-travel.herokuapp.com/api/trips?username=${this.username}`
      )
      .then((response) => {
        console.log(response);
        this.trips = response.data.trips;
      })
      .catch((err) => {
        console.log(err);
      });
  },
  methods: {
    // deleteTrip(id) {
    //   this.$emit("delete-trip", id);
    // },
  },
};
</script>
