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
      <TripCard :trip="trip" @delete-trip="tripDelete" />
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
        componentKey: 0,
      };
    },
    methods: {
      tripDelete(id) {
        if (confirm("Are you sure you want to delete this trip?")) {
          axios
            .delete(
              `https://dolphin-travel.herokuapp.com/api/trips/${id}?username=${this.$store.state.loggedInUser}`
            )
            .then(() => {
              this.componentKey += 1;
              alert("Trip deleted");
            });
        } else {
          console.log("Trip was not deleted");
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
