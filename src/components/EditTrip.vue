<template>
  <form v-if="loggedIn === true" class="add-form">
    <div class="form-control">
      <label for="trip-name">Trip Name: </label>
      <input
        type="text"
        name="text"
        :placeholder="tripName"
        id="trip-name"
        v-model="tripName"
      />
    </div>
    <div class="form-control form-control-check">
      <label for="attending">Add Attendee's Username: </label>
      <input v-model="attendee" type="text" id="attending" />
      <button class="btn" @click="addAttendee">Add</button>
    </div>
    <div class="blue-container">
      <span>Currently Attending: </span>
      <span :key="users" v-for="users in attending">{{ users }}, </span>
    </div>

    <div class="form-control">
      <label for="budget">Budget in GBP: </label>
      <input
        type="text"
        name="budget"
        :placeholder="budgetGBP"
        id="budget"
        v-model="budgetGBP"
      />
    </div>
    <div class="form-control form-control-check">
      <label for="trip-start">Trip Start Date: </label>
      <input
        type="text"
        name="trip-start"
        :placeholder="startDate"
        id="trip-start"
        v-model="startDate"
      />
    </div>
    <div class="form-control form-control-check">
      <label for="trip-end">Trip end date: </label>
      <input
        type="text"
        name="trip-end"
        :placeholder="endDate"
        id="trip-end"
        v-model="endDate"
      />
    </div>
    <div class="form-control form-control-check">
      <label for="accom">Change accommodation: </label>
      <input
        v-model="accommodationName"
        type="text"
        name="accommodation"
        id="accom"
      />
    </div>
    <div class="form-control form-control-check">
      <button @click="getAccommodation" class="btn">
        Search Accommodation
      </button>
    </div>
    <div>
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
    </div>
  </form>
</template>

<script>
  import axios from "axios";

  export default {
    name: "EditTrip",
    data() {
      return {
        tripName: "",
        attendee: "",
        attending: [],
        trip: {},
        budgetGBP: 0,
        startDate: "",
        endDate: "",
        accommodationName: "",
        isClicked: false,
        accommodations: [],
        country: "",
        accom: "",
      };
    },
    methods: {
      addAttendee(e) {
        e.preventDefault();

        this.attending.push(this.attendee);
      },
      getAccommodation(e) {
        e.preventDefault();
        this.isClicked = true;

        axios
          .get(
            `https://eu1.locationiq.com/v1/search?key=pk.925883abdd6280b4428e57337de16f23&q=${this.accommodationName}&addressdetails=1&countrycodes=${this.country.code}&format=json`
          )
          .then(({ data }) => {
            this.accommodations = data;
            console.log(data);
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
    created() {
      if (this.$store.state.loggedInUser != "GUEST") {
        this.loggedIn = true;
        axios
          .get(
            `https://dolphin-travel.herokuapp.com/api/trips/${this.$route.params.tripId}?username=${this.$store.state.loggedInUser}`
          )
          .then(({ data: { trip } }) => {
            this.trip = trip;
            this.attending = trip.attending;
            this._id = trip._id;
            this.budgetGBP = trip.budgetGBP;
            this.startDate = trip.startDate;
            this.endDate = trip.endDate;
            this.country = trip.accommodation.address.country;
            this.accommodationName = trip.accommodationName;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
  };
</script>

<style scoped>
  div {
    background-color: bisque;
  }
  .blue-container {
    background-color: skyblue;
  }
</style>
