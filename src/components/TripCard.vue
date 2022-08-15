<template>
  <div>
    <router-link class="active-card" :to="'/trips/' + trip._id" :trip="trip">
      <h3>
        {{ trip.tripName }}
      </h3>
      <span>
        You're visiting {{ trip.country }} for
        {{ (new Date(trip.endDate) - new Date(trip.startDate)) / 86400000 }}
        days</span
      >
      <span class="time-stamp">{{
        timeAgo.format(new Date(trip.startDate))
      }}</span>

      <img
        v-if="trip.accommodation.address.country_code != undefined"
        :src="
          'https://countryflagsapi.com/png/' +
          trip.accommodation.address.country_code
        "
        alt=""
        class="country-flag"
      />
      <p>Trip owner: {{ trip.attending[0] }}</p>
    </router-link>

    <img
      @click="tripDelete(trip._id)"
      class="delete-button"
      src="../assets/trash.svg"
      alt="trashcan"
    />
  </div>
</template>

<script>
  import TimeAgo from "javascript-time-ago";

  import en from "javascript-time-ago/locale/en";

  TimeAgo.addDefaultLocale(en);

  export default {
    name: "TripCard",
    props: {
      trip: Object,
    },
    data() {
      return {
        timeAgo: new TimeAgo("en-US"),
      };
    },
    method: {
      // onDelete(id) {
      //   this.$emit("delete-trip", id);
      // },
    },
  };
</script>

<style scoped>
  div {
    background: #a1d8f8;
    margin: 5px;
    padding: 10px 20px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
  }

  .time-stamp {
    display: flex;
    justify-content: flex-end;
  }
  .delete-button {
    width: 15px;
    height: 20px;
    display: flex;
  }

  img:hover {
    background-color: red;
    box-shadow: 0px 0px 5px 1px rgb(255, 0, 0);
  }

  a {
    color: #2c3e50;
  }
</style>
