<script>
import TripCard from "../components/TripCard.vue";

import axios from "axios";

export default {
  name: "CurrentTrips",
  components: {
    TripCard,
  },
  data() {
    return {
      currTrips: [],
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
          this.currTrips = response.data.trips.filter((trip) => {
            return new Date() < new Date(trip.endDate);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
};
</script>

<template>
  <main>
    <div class="cardGalley" v-if="currTrips.length != 0">
      <div class="cardHolder" :key="trip._id" v-for="trip in currTrips">
        <TripCard :trip="trip" />
      </div>
    </div>
  </main>
</template>

<style scoped>
.cardGalley {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
