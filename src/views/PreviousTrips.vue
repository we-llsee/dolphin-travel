<script>
import TripCard from "../components/TripCard.vue";

import axios from "axios";

export default {
  name: "PreviousTrips",
  components: {
    TripCard,
  },
  created() {
    if (this.$store.state.loggedInUser != "Guest") {
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
        .catch(() => {});
    } else {
      this.loggedIn = false;
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
  <div v-if="loggedIn === false">
    <p id="loginReminder">Please login to view your trips.</p>
  </div>
  <div v-if="loggedIn === true">
    <div class="cardGalley" v-if="pTrips.length != 0">
      <p id="upcomingText">Previous Trips</p>
      <div class="cardHolder" :key="trip._id" v-for="trip in pTrips">
        <TripCard :trip="trip" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.cardGalley {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#upcomingText {
  font-family: "Reenie Beanie";
  font-size: 50px;
  color: var(--midnight-blue);
  margin-top: -0.5rem;
  margin-bottom: -1rem;
  width: 60%;
}

#loginReminder {
  font-size: 14px;
  margin: 5rem;
}
</style>
