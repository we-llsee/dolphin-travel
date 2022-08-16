<template>
  <div class="card">
    <router-link class="active-card" :to="'/trips/' + trip._id" :trip="trip">
      <div class="tripHeader">
        <p id="tripName">
          {{ trip.tripName }}
        </p>
         <p id="tripOwner">Trip owner: {{ trip.attending[0] }}</p>
      </div>
      <div class="tripSummary">

      <img
        v-if="trip.accommodation.address.country_code != undefined"
        :src="
          'https://countryflagsapi.com/png/' +
          trip.accommodation.address.country_code
        "
        alt=""
        class="country-flag"
      />
      <div class="keyTripInfo">
        <div>
        <span>
        You're visiting {{ trip.country }} for
       <span id="daysUntilTrip">{{ (new Date(trip.endDate) - new Date(trip.startDate)) / 86400000 }}
        days</span> </span
      >
      <span class="time-stamp">{{
        timeAgo.format(new Date(trip.startDate))
      }}</span>
      </div>  
        <img
      @click="$emit('deleteTrip', trip._id)"
      class="delete-button"
      src="../assets/trash.svg"
      alt="trashcan"
      />
  </div>
      </div>

    </router-link>


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
};
</script>

<style scoped>
h2 {
  font-weight: bold;
  font-size: 2rem;
}
p {
  font-family: "Reenie Beanie";
  font-size: 2rem;
}
.card{
  display: flex;
  flex-direction: column;
  border: 3px solid var(--pacific-blue);
  margin: 20px;
  cursor: pointer;
  border-radius: 10px;
}

.tripHeader{
  display: flex;
  background-color: var(--pacific-blue);
  color: white;
  height: 50%;
  justify-content: space-between;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  align-items: center;
}

#tripName{
  font-size: 40px;
}

#tripOwner{
  font-size: 30px;
}

.tripSummary{
  display: flex;
  justify-content: space-between;
}

.country-flag{
  height: 120px;
  margin: 1.5rem;
  margin-left: 2rem;
}

.keyTripInfo{
  display: flex;
  flex-direction: column;
  justify-content:space-between;
  align-items:flex-end;
  font-size: 16px;
  margin-top: 1rem;
  margin-right: 1.5rem;
  margin-bottom: 1rem;
}

#daysUntilTrip{
  color: var(--pacific-blue);
  font-weight: bold;
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
  background-color: var(--pacific-blue);
  box-shadow: 0px 0px 5px 1px var(--pacific-blue);
}

.delete-button:hover{
  background-color: red;
  box-shadow: 0px 0px 5px 1px rgb(255, 0, 0);
}

a {
  color: #2c3e50;
}
</style>
