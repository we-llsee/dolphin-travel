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
        @delete-day="deleteDay"
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

    };
  },

  methods: {
    deleteDay({ tripId, dayId }) {
      if (confirm("Are you sure you want to delete this trip?")) {
        axios
          .delete(
            `https://dolphin-travel.herokuapp.com/api/trips/${tripId}/${dayId}?username=${this.$store.state.loggedInUser}`
          )
          .then(() => {
            alert("Day deleted");
            this.days = this.days.filter((day) => {
              return day._id !== dayId;
            });
          });
      }
    },
  },


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
