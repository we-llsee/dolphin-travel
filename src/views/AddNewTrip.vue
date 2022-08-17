<template>
  <div v-if="loggedIn === false">
    <p>Please login first to create trips</p>
    <router-link to="/login"
      ><button class="loginbtn">Login</button></router-link
    >
  </div>
  <form v-if="loggedIn === true" class="add-form">
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
      <div class="boxAndButton">
        <input
          v-model="hotelName"
          type="text"
          name="accommodation"
          id="accom"
        />
        <button @click="getAccommodation" class="btn">Search</button>
      </div>
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
      <label for="attending">Add Username: </label>
      <div class="boxAndButton">
        <input v-model="attendee" type="text" id="attending" />
        <button class="btn" @click="addAttendee">Add</button>
      </div>
    </div>
    <div class="blue-container">
      <p id="currAttText">Currently Attending:</p>
      <ul class="userAdded">
        <li class="userAttending" :key="people" v-for="people in attending">
          {{ people }}
        </li>
      </ul>
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
      attending: [this.$store.state.loggedInUser],
      isAttending: false,
      tripName: "",
      budgetGBP: 0,
      tripStart: "",
      tripEnd: "",
      loggedIn: false,
    };
  },

  created() {
    if (this.$store.state.loggedInUser != "GUEST") {
      this.loggedIn = true;
    }
  },
  methods: {
    saveTrip() {
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
          `https://dolphin-travel.netlify.app/.netlify/functions/locationSearch?q=${this.hotelName}&countrycodes=${this.country.code}`
        )
        .then((res) => {
          this.accommodations = res.data.msg;
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

<style scoped>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}

* {
  font-size: 14px;
}

.add-form {
  display: flex;
  flex-direction: column;
  text-align: left;
  padding: 1rem;
  padding-left: 12rem;
  width: 80%;
}

.form-control {
  display: flex;
  justify-content: space-between;
  padding: 0.2rem;
}

#trip-name,
#budget,
#trip-start,
#trip-end {
  width: 68%;
  height: 30px;
  padding: 0.2rem;
  border: 1px solid lightgray;
}

#accom-select {
  width: 100%;
  height: 30px;
  margin: 0.2rem;
  padding: 0.2rem;
  border: 1px solid lightgray;
}

#accom,
#attending {
  width: 70%;
  height: 30px;
  padding: 0.2rem;
  border: 1px solid lightgray;
}

#country-select {
  width: 68%;
  height: 30px;
  border: 1px solid lightgray;
}

.boxAndButton {
  display: flex;
  width: 68%;
  height: 30px;
}
.btn {
  display: inline-block;
  background: var(--star-command-blue);
  height: 30px;
  width: 30%;
  color: #fff;
  border: none;
  padding: 0rem 1rem 0rem 1rem;
  margin: 0px 5px 5px 5px;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  font-size: 14px;
  font-family: inherit;
}

.btn:hover {
  background-color: var(--pacific-blue);
}

.blue-container {
  width: 80%;
  align-self: center;
  border: 1px solid var(--midnight-blue);
  border-radius: 10px;
  margin-top: 1rem;
}

#currAttText {
  padding: 0.5rem;
}

.userAdded {
  display: flex;
  flex-wrap: wrap;
  padding-left: 0.5rem;
  padding-bottom: 1rem;
}

.userAttending {
  background: var(--light-cyan);
  list-style: none;
  padding: 0.2rem 0.5rem 0.2rem 0.5rem;
  border-radius: 10px;
  margin: 0.2rem;
}

input:focus,
textarea:focus,
select:focus {
  outline: 1px solid var(--pacific-blue);
}
</style>
