<template>
  <div class="center">
    <div v-if="trips.length != 0 && days > 0" class="day-gallery">
      <DayCard
        :key="day.date"
        v-for="day in days"
        :day="day"
        :trips="trips"
        :days="days"
        :activityArray="activityArray"
      />
    </div>
  </div>
</template>
<script>
  import axios from "axios";
  import DayCard from "./DayCard.vue";
  export default {
    name: "DayGallery",
    components: { DayCard },

    data() {
      return {
        username: "jesskemp",
        trips: [],
        days: 0,
        activityArray: [],
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
          `https://dolphin-travel.herokuapp.com/api/trips?username=${this.username}`
        )
        .then((response) => {
          return (this.trips = response.data.trips.filter((trip) => {
            return trip._id === this.$route.params.tripId;
          }));
        })
        .then((trip) => {
          //asssign days
          this.days =
            (new Date(trip[0].endDate) - new Date(trip[0].startDate)) /
            86400000;
          return trip;
        })
        .then((trip) => {
          this.activityArray = trip[0].days;
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
    grid-template-columns: repeat(auto-fit, minmax(200px, 0.1fr));
    grid-gap: 16px;
    justify-content: center;
  }
</style>
