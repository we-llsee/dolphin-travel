<template>
  <div>
    <p>{{ accommodation.latitude }}</p>
  </div>
  <div style="height: 75vh; width: 50vw">
    <l-map
      v-model="zoom"
      v-model:zoom="zoom"
      :center="[
        accommodation.latitude.toString(),
        accommodation.longitude.toString(),
      ]"
    >
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      ></l-tile-layer>
      <l-control-layers />

      <l-marker
        :lat-lng="[
          accommodation.latitude.toString(),
          accommodation.longitude.toString(),
        ]"
      >
        <l-popup> {{ accommodation.accommodationName }} </l-popup>
      </l-marker>
      
      <li :key="activity._id" v-for="activity in allActivities">
        <l-marker
          :lat-lng="[
            activity.latitude.toString(),
            activity.longitude.toString(),
          ]"
        >
          <l-popup> {{ activity.activityName }} </l-popup>
        </l-marker>
      </li>
    </l-map>
  </div>
</template>
<script>
import {
  LMap,
  LTileLayer,
  LMarker,
  LControlLayers,
  LPopup,
} from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
export default {
  props: ["day"],
  components: {
    LMap,

    LTileLayer,
    LMarker,
    LControlLayers,

    LPopup,
  },
  data() {
    return {
      zoom: 13,
      iconWidth: 25,
      iconHeight: 40,
      trip: Object,
      accommodation: Object,
      allActivities: Array,
    };
  },

  computed: {
    iconUrl() {
      return `https://placekitten.com/${this.iconWidth}/${this.iconHeight}`;
    },
    iconSize() {
      return [this.iconWidth, this.iconHeight];
    },
  },
  methods: {
    log(a) {
      console.log(a);
    },
    changeIcon() {
      this.iconWidth += 2;
      if (this.iconWidth > this.iconHeight) {
        this.iconWidth = Math.floor(this.iconHeight / 2);
      }
    },
  },
  created() {
    return axios
      .get(
        `https://dolphin-travel.herokuapp.com/api/trips/${this.$route.params.tripId}?username=${this.$store.state.loggedInUser}`
      )
      .then(({ data: { trip } }) => {
        this.trip = trip;
        this.accommodation = trip.accommodation;
        const allActivities = [];
        const days = trip.days;
        for (let i = 0; i < days.length; i++) {
          for (let j = 0; j < days[i].activities.length; j++) {
            allActivities.push(days[i].activities[j]);
          }
        }
        this.allActivities = allActivities;
        return;
      });
  },
};
</script>
