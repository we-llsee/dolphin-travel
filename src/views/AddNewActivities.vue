<template>
  <div>
    <p id="activityPageTitle">Activities planned for today:</p>
    <div class="activityList">
      <div class="listItem" :key="activity._id" v-for="activity in activities">
        <p class="listItemName">{{ activity.activityName }}</p>
        <button class="btn" @click="deleteActivity(activity._id)">
          Delete
        </button>
      </div>
    </div>
    <div class="map" style="height: 75vh; width: 100%">
      <l-map
        v-model="zoom"
        v-model:zoom="zoom"
        :center="[this.accomLat, this.accomLong]"
      >
        <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        ></l-tile-layer>
        <l-control-layers />
        <l-marker :lat-lng="[this.accomLat, this.accomLong]">
          <l-icon :icon-url="iconUrl" :icon-size="iconSize" />
          <l-popup> You are staying at {{ accom }} </l-popup>
        </l-marker>

        <l-marker
          :key="attraction.address.postcode"
          v-for="attraction in attractions"
          :lat-lng="[attraction.lat, attraction.lon]"
        >
          <l-popup>
            Address: {{ attraction.display_name }} <br />
            Attraction type: {{ attraction.type }} <br />{{
              attraction.distance
            }}m Away from you <br />
            <button @click="addActivities(attraction)">Add attraction</button>
          </l-popup>
        </l-marker>
      </l-map>
    </div>
  </div>
  <p>Nearby Activities</p>

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

      <l-marker
        :key="attraction.address.postcode"
        v-for="attraction in attractions"
        :lat-lng="[attraction.lat, attraction.lon]"
      >
        <l-popup>
          Address: {{ attraction.display_name }} <br />
          Attraction type: {{ attraction.type }} <br />
          <div v-if="attraction.distance != undefined">
            {{ attraction.distance }}m Away from you <br />
          </div>
          <button @click="addActivities(attraction)">Add attraction</button>
        </l-popup>
      </l-marker>
    </l-map>
    <div class="search-activities">
      <div>
        <label for="activity">Search activities nearby</label>
        <div class="boxAndButton">
          <input v-model="searchTerm" type="text" name="results" id="result" />
          <button @click="searchActivities" class="btn">Search</button>
        </div>
        <div class="back-button">
          <button class="btn" @click="goBack">Go Back</button>
        </div>
      </div>
      <select name="" id="result-select" v-show="isClicked" v-model="result">
        <option value="">Search Results</option>
        <option
          :key="result.place_id"
          v-for="result in results"
          :value="result"
        >
          {{ result.display_name }}
        </option>
      </select>
      <input
        @click="addActivities(result)"
        type="submit"
        value="Add Activity"
        class="btn btn-block"
      />
    </div>
    <h3>Today you are going to :</h3>
    <div :key="activity._id" v-for="activity in activities">
      {{ activity.activityName }}
      <button @click="deleteActivity(activity._id)">Delete Activity</button>
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
  name: "AllActivities",

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
      searchTerm: "",
      zoom: 14,
      iconWidth: 40,
      iconHeight: 40,
      accom: "",
      accomLong: 0,
      accomLat: 0,
      attractions: [],
      activities: [],
      isClicked: false,
      results: [],
      result: undefined,
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
    goBack() {
      window.history.go(-1);
    },
    searchActivities(e) {
      e.preventDefault();
      this.isClicked = true;
      axios
        .get(
          `https://eu1.locationiq.com/v1/search?key=pk.925883abdd6280b4428e57337de16f23&q=${
            this.searchTerm
          }&bounded=1&viewbox=${(this.accomLong + 0.05).toFixed(2)},${(
            this.accomLat + 0.05
          ).toFixed(2)},${(this.accomLong - 0.05).toFixed(2)},${(
            this.accomLat - 0.05
          ).toFixed(2)}&addressdetails=1&format=json&normalizeaddress=1`
        )
        .then(({ data }) => {
          console.log(data);
          this.results = data;
        });
    },
    log(a) {
      console.log(a);
    },
    changeIcon() {
      this.iconWidth += 2;
      if (this.iconWidth > this.iconHeight) {
        this.iconWidth = Math.floor(this.iconHeight / 2);
      }
    },
    addActivities(attraction) {
      axios({
        method: "post",
        url: `https://dolphin-travel.herokuapp.com/api/trips/${this.$route.params.tripId}/${this.$route.params.dayId}`,
        data: {
          username: this.$store.state.loggedInUser,
          activityName: attraction.address.name,
          latitude: Number(attraction.lat),
          longitude: Number(attraction.lon),
          address: {
            name: attraction.address.name,
            road: attraction.address.road,
            city: attraction.address.city,
            state: attraction.address.state,
            postcode: attraction.address.postcode,
            country: attraction.address.country,
            country_code: attraction.address.country_code,
          },
          type: attraction.type,
        },
      }).then(({ data: { activity } }) => {
        this.activities.push(activity);

        this.attractions.push(this.result);
      });
    },
    deleteActivity(id) {
      if (confirm("Are you sure you want to delete this activity?")) {
        axios
          .delete(
            `https://dolphin-travel.herokuapp.com/api/trips/${this.$route.params.tripId}/${this.$route.params.dayId}/${id}?username=${this.$store.state.loggedInUser}`
          )
          .then(() => {
            alert("Activity deleted");
            this.activities = this.activities.filter((activity) => {
              return activity._id !== id;
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
      })
      .then(() => {
        axios
          .get(
            `https://eu1.locationiq.com/v1/nearby?key=pk.925883abdd6280b4428e57337de16f23&lat=${this.accomLat}&lon=${this.accomLong}&tag=all&radius=1500&limit=50&format=json`
          )
          .then(({ data }) => {
            this.attractions = data;
          });
      });
    axios
      .get(
        `https://dolphin-travel.herokuapp.com/api/trips/${this.$route.params.tripId}/${this.$route.params.dayId}/activities?username=${this.$store.state.loggedInUser}`
      )
      .then(({ data: { activities } }) => {
        console.log(activities);
        this.activities = activities;
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

.map {
  padding: 1rem;
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

.btn {
  margin-left: 1rem;
}

.btn:hover {
  box-shadow: 0px 0px 5px 2px rgb(255, 0, 0);
}
</style>
