<template>
  <div class="container">
    <AppHeader />
    <router-view :trips="trips" @delete-trip="deleteTrip" />
    <AppFooter />
  </div>
</template>

<script>
import AppHeader from "./components/AppHeader.vue";
import AppFooter from "./components/AppFooter.vue";

export default {
  name: "App",
  components: {
    AppHeader,
    AppFooter,
  },
  data() {
    return {
      trips: [
        {
          tripId: 1,
          countryVisiting: "Malta",
          tripName: "Wid da boyz",
          budget: 100000,
          tripStart: "17-JUL-2022",
          tripEnd: "27-JUL-2022",
          accomodation: false,
          otherUsers: [],
        },
        {
          tripId: 2,
          countryVisiting: "Greece",
          tripName: "Wid da gyalies",
          budget: 1000,
          tripStart: "20-AUG-2022",
          tripEnd: "23-AUG-2022",
          accomodation: false,
          otherUsers: [],
        },
        {
          tripId: 3,
          countryVisiting: "Turkey",
          tripName: "Summer",
          budget: 1000000,
          tripStart: "17-DEC-2022",
          tripEnd: "27-JAN-2023",
          accomodation: false,
          otherUsers: [],
        },
      ],
    };
  },
  methods: {
    deleteTrip(id) {
      alert("Are you sure you want to delete this trip?");
      console.log(id);
      this.trips = this.trips.filter((trip) => {
        return trip.tripId !== id;
      });
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400&display=swap");
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
body {
  font-family: "Poppins", sans-serif;
}
.container {
  width: 90%;
  margin: 30px auto;
  overflow: auto;
  min-height: 300px;
  border: 1px solid steelblue;
  padding: 30px;
  border-radius: 5px;
}
.btn {
  display: inline-block;
  background: #000;
  color: #fff;
  border: none;
  padding: 10px 20px;
  margin: 5px;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  font-size: 15px;
  font-family: inherit;
}
.btn:focus {
  outline: none;
}
.btn:active {
  transform: scale(0.98);
}
.btn-block {
  display: block;
  width: 100%;
}
</style>
