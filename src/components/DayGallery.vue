<template>
  <div class="center">
    <div class="day-gallery">
      <AddDayCard />

      <DayCard
        :key="day.date"
        v-for="day in days"
        :trips="trips"
        :days="days"
        :day="day"
      />
    </div>
  </div>
</template>
<script>
  import axios from "axios";
  import DayCard from "./DayCard.vue";
  import AddDayCard from "./AddDayCard.vue";

  export default {
    name: "DayGallery",
    components: { DayCard, AddDayCard },

    data() {
      return {
        trips: [],
        days: [],
        day: { type: Object },

        // days: (new Date(trip.endDate) - new Date(trip.startDate)) / 86400000,
      };
    },
    //  mounted(){
    //   splitActivity(){
    //     if (this.activityArray.length >= 0 && this.days > 0){
    //       for (let i = 0;i <= this.days; i++ ){
    //         return this.activity = [...]
    //       }
    //     }
    //   }

    created() {
      axios
        .get(
          `https://dolphin-travel.herokuapp.com/api/trips?username=${this.$store.state.loggedInUser}`
        )
        .then(({ data: { trips } }) => {
          return (this.trips = trips.filter((trip) => {
            return trip._id === this.$route.params.tripId;
          }));
        })
        .then((trip) => {
          this.days = trip[0].days;
          console.log(trip);
        })

        .catch((err) => {
          console.log(err);
        });
    },
  };
</script>

<style scoped>
  .day-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    grid-gap: 16px;
    justify-content: center;
  }
</style>
