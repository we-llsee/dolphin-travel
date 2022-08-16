<template>
  <div class="day-card">
    <ul>
      <li>
        <router-link
          :to="
            '/trips/' + $route.params.tripId + '/' + day._id + '/add-activities'
          "
          :day="day"
        >
          <h2>Day #{{ day.dayNumber }}</h2>
          <div v-if="day.activities.length > 0">
            <p>{{ day.activities[0].activityName }}</p>
            <p class="type">{{ day.activities[0].type }}</p>
          </div>
        </router-link>
        <button
          @click="
            $emit('deleteDay', {
              tripId: this.$route.params.tripId,
              dayId: this.day._id,
            })
          "
        >
          Delete Day
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "DayCard",
  props: ["trips", "days", "day"],

  data() {
    return {
      isBooked: false,
    };
  },
};
</script>

<style scoped>
body {
  margin: 20px auto;
  font-family: "Lato";
  background: #666;
  color: #fff;
}

* {
  margin: 0;
  padding: 0;
}
h2 {
  font-weight: bold;
  font-size: 1rem;
}
p {
  font-family: "Reenie Beanie";
  font-size: 2rem;
}
ul,
li {
  list-style: none;
}
ul {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
ul li a {
  text-decoration: none;
  color: #000;
  background: skyblue;
  display: block;
  height: 15em;
  width: 15em;
  padding: 1em;
  border-radius: 5px;
}
ul li {
  margin: 1em;
}

.type {
  color: saddlebrown;
}
</style>
