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
      <label for="attending">Add user: </label>
      <textarea v-model="attendee" type="text" id="attending" />
      <button class="btn" @click="addAttendee">Add</button>
    </div>

    <div class="form-control form-control-check">
      <label for="remove-user">Remove user: </label>
      <textarea v-model="REMOVE_USER" type="text" id="remove-user" />
      <button class="btn" @click="removeUser">Remove</button>
    </div>
    <div class="blue-container">
      <span>Currently attending: </span>
      <span :key="users" v-for="users in attending">{{ users }}, </span>
    </div>

    <div class="form-control form-control-check">
      <label for="new-creator">Pass ownership to another user: </label>
      <input type="text" id="new-creator" v-model="newCreator" />
    </div>
    <div class="form-control">
      <label for="budget">Budget in GBP: </label>
      <input
        type="text"
        name="budget"
        placeholder="£0.00"
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
        v-model="startDate"
      />
    </div>
    <div class="form-control form-control-check">
      <label for="trip-end">Trip end date: </label>
      <input
        type="text"
        name="trip-end"
        placeholder="YYYY/MM/DD"
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
      <button class="btn" @click="patchTrip">Save</button>
      <button class="btn" @click="resetForm">Reset Form</button>
     
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
      budgetGBP: undefined,
      startDate: undefined,
      endDate: undefined,
      accommodationName: "",
      isClicked: false,
      accommodations: [],
      country: "",
      accom: "",
      lookupAttendee: [],
      users: [],
      REMOVE_USER: "",
      removeUsers: [],
    };
  },
  methods: {
    resetForm(e) {
      e.preventDefault();
      this.tripName = "";
      this.attendee = "";
      this.attending = [];
      this.trip = {};
      this.budgetGBP = undefined;
      this.startDate = undefined;
      this.endDate = undefined;
      this.accommodationName = "";
      this.isClicked = false;
      this.accommodations = [];
      this.country = "";
      this.accom = "";
      this.lookupAttendee = [];
      this.users = [];
      this.REMOVE_USER = "";
      this.removeUsers = [];
      this.newCreator = "";
      this._id = this.$route.params.tripId;
    },
    patchTrip(e) {
      e.preventDefault();
      axios
        .patch(
          `https://dolphin-travel.herokuapp.com/api/trips/${this.$route.params.tripId}?username=${this.$store.state.loggedInUser}`,
          {
            tripName: this.tripName,
            budgetGBP: this.budgetGBP,
            startDate: this.startDate,
            endDate: this.endDate,
            ...(this.accom.display_name
              ? {
                  accommodation: {
                    accommodationName: this.accom.display_name,
                    latitude: this.accom.lat,
                    longitude: this.accom.lon,
                    address: {},
                  },
                }
              : {}),
          }
        )
        .then(() => {
          this.$emit("toggle-form");
        });
    },
    removeUser(e) {
      e.preventDefault();

      const attendingRemoved = this.attending.filter((user) => {
        return user !== this.REMOVE_USER;
      });

      if (this.attending !== attendingRemoved) {
        this.attending = [...attendingRemoved];
      } else
        alert(
          `${this.REMOVE_USER} is not on the attending list.Please try again.`
        );
    },

    addAttendee(e) {
      e.preventDefault();
      const lookupAttendee = this.attending.filter((attendee) => {
        return attendee === this.attendee;
      });
      // length > 0 return warning
      const validUsers = this.users.map((userObj) => {
        return userObj._id;
      });
      //length > 0 push
      const lookupUsers = validUsers.filter((attendee) => {
        return attendee === this.attendee;
      });
      if (lookupUsers.length > 0 && lookupAttendee.length === 0) {
        this.attending.push(this.attendee);
      } else if (lookupUsers.length > 0 && lookupAttendee.length > 0) {
        return alert(`${this.attendee} is already attending.`);
      } else if (lookupUsers.length === 0) {
        return alert(`${this.attendee} is not an existing user.`);
      }
    },
    getAccommodation(e) {
      e.preventDefault();
      this.isClicked = true;

      axios
        .get(
          `https://dolphin-travel.netlify.app/.netlify/functions/locationSearch?q=${this.accommodationName}&countrycodes=${this.country.code}`
        )
        .then((res) => {
          this.accommodations = res.data.msg;
          // console.log(res.data.msg);
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
          this.country = trip.accommodation.address.country;
          this.accommodationName = trip.accommodationName;
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get("https://dolphin-travel.herokuapp.com/api/users?username=alexrong")
        .then(({ data: { users } }) => {
          this.users = users;
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
