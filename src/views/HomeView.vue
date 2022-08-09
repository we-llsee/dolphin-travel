<script>
import TripGallery from "../components/TripGallery.vue";

export default {
  name: "HomeView",
  components: {
    TripGallery,
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
      this.trips = this.trips.filter((trip) => {
        return trip.tripId !== id;
      });
    },
  },
};
</script>

<template>
  <main>
    <TripGallery :trips="trips" @delete-trip="deleteTrip" />
  </main>
</template>
