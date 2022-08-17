<template>
  <div v-if="loggedIn === false">
    <p>Please login first to view your trips</p>
    <router-link to="/login"
      ><button class="loginbtn">Login</button></router-link
    >
  </div>
  <div class="cardGalley" v-if="trips.length != 0">
    <p id="upcomingText">These are your upcoming trips...</p>
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
};
</script>

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
