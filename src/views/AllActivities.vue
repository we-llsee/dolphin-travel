<template>
  <p id="activityPageTitle">Activities planned for the trip:</p>
  <div class="activityList">
    <div class="daybox" :key="day" v-for="day in days">
      <h3 class="dayText">Day {{ day.dayNumber }}</h3>
      <div
        class="listItem"
        :key="attraction._id"
        v-for="attraction in day.activities"
      >
        <span
          >{{ attraction.activityName }} ({{
            attraction.type.replace(/_/g, " ")
          }})
          <button class="btn" @click="deleteActivity(day._id, attraction._id)">
            Delete Activity
          </button>
        </span>
      </div>
      <hr />
    </div>
  </div>
  <div class="back-button">
    <button class="btn" @click="goBack">Go Back</button>
  </div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import axios from "axios";

export default {
  name: "AddNewActivities",
  data() {
    return {
      zoom: 14,
      iconWidth: 40,
      iconHeight: 40,
      accom: "",
      accomLong: 0,
      accomLat: 0,
      days: [],
    };
  },

  computed: {
    iconUrl() {
      return `https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Home-icon.svg/1024px-Home-icon.svg.png`;
    },
    iconSize() {
      return [this.iconWidth, this.iconHeight];
    },
  },
  methods: {
    log() {},
    deleteActivity(dayId, actId) {
      if (confirm("Are you sure you want to delete this activity?")) {
        axios
          .delete(
            `https://dolphin-travel.herokuapp.com/api/trips/${this.$route.params.tripId}/${dayId}/${actId}?username=${this.$store.state.loggedInUser}`
          )
          .then(() => {
            alert("Activity deleted");
            axios
              .get(
                `https://dolphin-travel.herokuapp.com/api/trips/${this.$route.params.tripId}?username=${this.$store.state.loggedInUser}`
              )
              .then(({ data }) => {
                this.accom = data.trip.accommodation.accommodationName;
                this.accomLong = data.trip.accommodation.longitude;
                this.accomLat = data.trip.accommodation.latitude;
                this.days = data.trip.days;
                this.days.sort((a, b) => {
                  return a.dayNumber - b.dayNumber;
                });
              });
          });
      }
    },
    goBack() {
      window.history.go(-1);
    },
  },

  created() {
    axios
      .get(
        `https://dolphin-travel.herokuapp.com/api/trips/${this.$route.params.tripId}?username=${this.$store.state.loggedInUser}`
      )
      .then(({ data }) => {
        this.accom = data.trip.accommodation.accommodationName;
        this.accomLong = data.trip.accommodation.longitude;
        this.accomLat = data.trip.accommodation.latitude;
        this.days = data.trip.days;
        this.days.sort((a, b) => {
          return a.dayNumber - b.dayNumber;
        });
      });
  },
};
</script>

<style scoped>
#activityPageTitle {
  font-family: "Reenie Beanie";
  font-size: 50px;
  color: var(--midnight-blue);
  margin-top: -0.5rem;
}

.dayText {
  font-family: "Reenie Beanie";
  font-size: 40px;
  color: var(--midnight-blue);
  margin-top: -0.5rem;
}

.activityList {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.listItem {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
}

@media (hover: hover) {
  .btn:hover {
    box-shadow: 0px 0px 0px 5px var(--light-cyan);
  }

  .btn {
    text-decoration: none;
    transition: 0.4s;
  }
}

.back-button {
  margin-top: 1rem;
  margin-left: 1rem;
}

hr {
  width: 100%;
  text-align: left;
  margin: 1rem;
}
</style>
