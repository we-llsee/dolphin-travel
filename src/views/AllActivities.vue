<template>
  <p>All Activity page</p>

  <div style="height: 75vh; width: 59vw">
    <l-map
      v-model="zoom"
      v-model:zoom="zoom"
      :center="[this.accomLat, this.accomLong]"
      @move="log('move')"
    >
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      ></l-tile-layer>
      <l-control-layers />
      <l-marker :lat-lng="[this.accomLat, this.accomLong]">
        <l-icon :icon-url="iconUrl" :icon-size="iconSize" />
        <l-popup> You are staying at {{ accom }} </l-popup>
      </l-marker>
      <div :key="day" v-for="day in days">
        <l-marker
          :key="attraction._id"
          v-for="attraction in day.activities"
          :lat-lng="[attraction.latitude, attraction.longitude]"
        >
          <l-popup>
            Day: {{ day.dayNumber }}<br />
            Attraction : {{ attraction.activityName }} <br />
            Attraction type: {{ attraction.type.replace(/_/g, " ") }}
            <button @click="deleteActivity(day._id, attraction._id)">
              Delete Activity
            </button>
          </l-popup>
        </l-marker>
      </div>
    </l-map>
    <div class="daybox" :key="day" v-for="day in days">
      <h3>Day {{ day.dayNumber }}</h3>
      <div :key="attraction._id" v-for="attraction in day.activities">
        <span
          >• {{ attraction.activityName }} ({{
            attraction.type.replace(/_/g, " ")
          }}) at
          {{ attraction.address.address }}
          -
          <button @click="deleteActivity(day._id, attraction._id)">
            Delete Activity
          </button>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import {
  LMap,
  LTileLayer,
  LMarker,
  LControlLayers,
  LPopup,
  LIcon,
} from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

export default {
  name: "AddNewActivities",

  components: {
    LMap,
    LTileLayer,
    LMarker,
    LControlLayers,
    LPopup,
    LIcon,
  },
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
    log(a) {
      console.log(a);
    },
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
