<template>
  <div class="center">
    <div class="tripHeader">
      <p id="tripName">{{ trip.tripName }}</p>
      <p id="budgetGBP">Budget: £{{ trip.budgetGBP }}</p>
    </div>
    <div class="day-gallery">
      <DayCard
        :key="day.date"
        v-for="day in days"
        :trips="trips"
        :days="days"
        :day="day"
        @delete-day="deleteDay"
      />
      <AddDayCard />
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
      trip: { type: Object },
    };
  },

  methods: {
    deleteDay({ tripId, dayId }) {
      if (confirm("Are you sure you want to delete this day?")) {
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
          if (trip._id === this.$route.params.tripId) {
            this.trip = trip;
            return trip._id === this.$route.params.tripId;
          }
        }));
      })
      .then((trip) => {
        const days = trip[0].days.sort((a, b) => a.dayNumber - b.dayNumber);
        this.days = days;
      })

      .catch((err) => {
        console.log(err);
      });
  },
};
</script>

<style scoped>
.tripHeader {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.day-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 300px));
  grid-gap: 16px;
  justify-content: center;
  margin-top: -1rem;
  padding: 1rem;
}

#tripName {
  font-family: "Reenie Beanie";
  font-size: 50px;
  color: var(--midnight-blue);
  margin-top: -0.5rem;
  width: 60%;
}

#budgetGBP {
  width: 20%;
  color: var(--midnight-blue);
}
</style>
