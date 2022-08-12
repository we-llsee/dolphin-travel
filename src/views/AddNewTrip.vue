<template>
  <form class="add-form">
    <div class="form-control">
      <label for="trip-name">Trip Name: </label>
      <input
        type="text"
        name="text"
        placeholder="Trip Name"
        id="trip-name"
        v-model="tripName"
      />
    </div>
    <div class="form-control">
      <label for="country-select">Country Visiting: </label>
      <select v-model="country" name="countries" id="country-select">
        <option disabled>Please select a country</option>
        <option
          :key="country.code"
          v-for="country in $options.COUNTRIES"
          :value="country"
        >
          {{ country.name }}
        </option>
      </select>
    </div>
    <div class="form-control">
      <label for="budget">Budget in GBP: </label>
      <input
        type="text"
        name="budget"
        placeholder="e.g. 1200"
        id="budget"
        v-model="budgetGBP"
      />
    </div>
    <div class="form-control form-control-check">
      <label for="trip-start">Trip Start Date: </label>
      <input
        type="text"
        name="trip-start"
        placeholder="YYYY/MM/DD"
        id="trip-start"
        v-model="tripStart"
      />
    </div>
    <div class="form-control form-control-check">
      <label for="trip-end">Trip end date: </label>
      <input
        type="text"
        name="trip-end"
        placeholder="YYYY/MM/DD"
        id="trip-end"
        v-model="tripEnd"
      />
    </div>
    <div class="form-control form-control-check">
      <label for="accom">Accommodation: </label>
      <input v-model="hotelName" type="text" name="accommodation" id="accom" />
    </div>
    <div class="form-control form-control-check">
      <button @click="getAccommodation" class="btn">
        Search Accommodation
      </button>
    </div>
    <select name="" id="accom-select" v-show="isClicked" v-model="accom">
      <option value="">Choose Accommodation</option>
      <option
        :key="accom.place_id"
        v-for="accom in accommodations"
        :value="accom"
      >
        {{ accom.display_name }}
      </option>
    </select>
    <div class="form-control form-control-check">
      <label for="attending">Add Attendees: </label>
      <input v-model="attendee" type="text" id="attending" />
      <button class="btn" @click="addAttendee">Add</button>
    </div>
    <div class="blue-container">
      <span>Currently Attending: </span>
      <span :key="people" v-for="people in attending">{{ people }}, </span>
    </div>
    <router-link :to="'/trips/' + $route.params.tripId">
      <input
        @click="saveTrip"
        type="submit"
        value="Save trip"
        class="btn btn-block"
    /></router-link>
  </form>
</template>

<script>
import countries from "../assets/data.js";
import axios from "axios";
export default {
  name: "AddNewTrip",
  COUNTRIES: countries,
  data() {
    return {
      hotelName: "",
      accommodations: [],
      accom: "",
      country: "",
      isClicked: false,
      attendee: "",
      attending: [],
      isAttending: false,
      tripName: "",
      budgetGBP: 0,
      tripStart: "",
      tripEnd: "",
    };
  },
  methods: {
    saveTrip() {
      //store accom object on save
      //accom.lat accom.lon
      //addressDetails =
      axios({
        method: "post",
        url: "https://dolphin-travel.herokuapp.com/api/trips",
        data: {
          tripName: this.tripName,
          attending: this.attending,
          budgetGBP: Number(this.budgetGBP),
          startDate: new Date(this.tripStart).toISOString(),
          endDate: new Date(this.tripEnd).toISOString(),
          country: this.country.name,
          accommodation: {
            accommodationName: this.hotelName,
            latitude: Number(this.accom.lat),
            longitude: Number(this.accom.lon),
            address: {
              hotel: this.accom.address.hotel,
              road: this.accom.address.road,
              suburb: this.accom.address.suburb,
              city: this.accom.address.city,
              state: this.accom.address.state,
              postcode: this.accom.address.postcode,
              country: this.accom.address.country,
              country_code: this.accom.address.country_code,
            },
          },
        },
      });
    },

    addAttendee(e) {
      e.preventDefault();

      this.attending.push(this.attendee);
    },
    getAccommodation(e) {
      e.preventDefault();
      this.isClicked = true;
      axios
        .get(
          `https://eu1.locationiq.com/v1/search?key=pk.925883abdd6280b4428e57337de16f23&q=${this.hotelName}&addressdetails=1&countrycodes=${this.country.code}&format=json`
        )
        .then(({ data }) => {
          this.accommodations = data;
        })
        .catch((err) => {
          if (err.code === "ERR_BAD_REQUEST") {
            alert(
              "This accommodation is not available in this country, please try another location."
            );
          }
        });
    },
  },
};
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
