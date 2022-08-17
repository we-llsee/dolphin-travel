<script>
import TripCard from "../components/TripCard.vue";

import axios from "axios";

export default {
  name: "PreviousTrips",
  components: {
    TripCard,
  },
  created() {
    if (this.$store.state.loggedInUser != "GUEST") {
      this.loggedIn = true;
      axios
        .get(
          `https://dolphin-travel.herokuapp.com/api/trips?username=${this.$store.state.loggedInUser}`
        )
        .then(({ data: { trips } }) => {
          this.pTrips = trips.filter((trip) => {
            return new Date() > new Date(trip.endDate);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
  data() {
    return {
      pTrips: [],
    };
  },
};
</script>

<template>
  <div>
    <h2>Previous Trips</h2>
    <div class="cardGalley" v-if="pTrips.length != 0">
      <div class="cardHolder" :key="trip._id" v-for="trip in pTrips">
        <TripCard :trip="trip" />
      </div>
    </div>
  </div>
</template>

<style scoped>
#upcomingText {
  font-size: 14px;
  margin-top: 0.4rem;
}

.cardGalley {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
