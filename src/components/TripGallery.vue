<template>
  <div v-if="loggedIn === false">
    <p id="loginReminder">Please login to view your trips.</p>
  </div>
  <div class="cardGalley" v-if="trips.length != 0">
    <p id="upcomingText">All Trips</p>
    <div class="cardHolder" :key="trip._id" v-for="trip in trips">
      <TripCard :trip="trip" @delete-trip="deleteTrip" />
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
  methods: {
    deleteTrip(id) {
      if (confirm("Are you sure you want to delete this trip?")) {
        axios
          .delete(
            `https://dolphin-travel.herokuapp.com/api/trips/${id}?username=${this.$store.state.loggedInUser}`
          )
          .then(() => {
            this.trips = this.trips.filter((trip) => {
              return trip._id != id;
            });
            alert("Trip deleted");
          });
      }
    },
  },

  created() {
    if (this.$store.state.loggedInUser != "Guest") {
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
};
</script>

<style scoped>
#upcomingText {
  font-family: "Reenie Beanie";
  font-size: 50px;
  color: var(--midnight-blue);
  margin-top: -0.5rem;
  margin-bottom: -1rem;
  width: 60%;
}

.cardGalley {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#loginReminder {
  font-size: 14px;
  margin: 5rem;
}
</style>
