<template>
  <div v-if="loggedIn === true">
    Which day do you want to add to your trip?
    <div :key="day" v-for="day in difference">
      <button type="button" @click="saveDay(day)" class="btn">
        Day: {{ day }}
      </button>
    </div>
    <button class="btn" @click="goBack">Go Back</button>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "AddNewDay",
  data() {
    return {
      days: [],
      loggedIn: false,
      daysBetween: 0,
      daysAvailable: [],
      difference: [],
      newDayId: "",
    };
  },

  created() {
    if (this.$store.state.loggedInUser != "GUEST") {
      this.loggedIn = true;
      axios
        .get(
          `https://dolphin-travel.herokuapp.com/api/trips/${this.$route.params.tripId}?username=${this.$store.state.loggedInUser}`
        )
        .then(({ data }) => {
          this.days = data.trip.days.map((day) => {
            return day.dayNumber;
          });
          // eslint-disable-next-line prettier/prettier
          console.log(this.days);
          this.daysBetween =
            (new Date(data.trip.endDate) - new Date(data.trip.startDate)) /
            (1000 * 3600 * 24);
        })
        .then(() => {
          for (let i = 1; i <= this.daysBetween; i++) {
            this.daysAvailable.push(i);
          }
          this.difference = this.daysAvailable.filter((day) => {
            return !this.days.includes(day);
          });
          console.log(this.difference);
        });
    }
  },

  methods: {
      goBack() {
        window.history.go(-1);
      },
    saveDay(day) {
      axios({
        method: "post",
        url: `https://dolphin-travel.herokuapp.com/api/trips/${this.$route.params.tripId}`,
        data: {
          username: this.$store.state.loggedInUser,
          dayNumber: day,
        },
      })
        .then(({ data }) => {
          this.newDayId = data.day._id;
          this.$router.push(
            `/trips/${this.$route.params.tripId}/${this.newDayId}/add-activities`
          );
        })
        .catch((err) => {
          console.log(this.day);
          console.log(err);
        });
    },
  },
};
</script>
