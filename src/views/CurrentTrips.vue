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
    if (this.$store.state.loggedInUser != "Guest") {
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
    } else {
      this.loggedIn = false;
    }
  },
};
</script>

<template>
  <main>
    <div v-if="loggedIn === false">
      <p id="loginReminder">Please login to view your trips.</p>
    </div>
    <div v-if="loggedIn === true">
      <div class="cardGalley" v-if="currTrips.length != 0">
        <p id="upcomingText">Current Trips</p>
        <div class="cardHolder" :key="trip._id" v-for="trip in currTrips">
          <TripCard :trip="trip" />
        </div>
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
