<template>
<div>
  <p>{{accommodation}}</p>
</div>
  <div style="height: 75vh; width: 50vw">
    <l-map
      v-model="zoom"
      v-model:zoom="zoom"
      :center="[Number(accommodation.latitude), Number(accommodation.longitude)]"
      @move="log('move')"
    >
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      ></l-tile-layer>
      <l-control-layers />

      <l-marker :lat-lng="[Number(accommodation.latitude), Number(accommodation.longitude)]">
        <l-popup> accommodation.accommodationName </l-popup>
      </l-marker>
    </l-map>
    <button @click="changeIcon">New kitten icon</button>
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
      axios
        .get(
          `https://dolphin-travel.herokuapp.com/api/trips/${this.$route.params.tripId}?username=${this.$store.state.loggedInUser}`
        )
        .then(({ data: { trip } }) => {
          this.trip=trip;
          this.accommodation = trip.accommodation;
          });
    }
  };
</script>
