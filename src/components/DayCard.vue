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
          <div class="day-font" v-if="activities.length > 0">
            <div :key="activity._id" v-for="activity in activities">
              <span>{{ activity.activityName }}&nbsp; - &nbsp;</span>
              <span class="type">{{ activity.type.replace(/_/g, " ") }}</span>
            </div>
          </div>
          Click to see more activites
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
      activities: [],
    };
  },

  created() {
    this.activities = [...this.day.activities.slice(0, 3)];
  },
};
</script>

<style scoped>
.day-font {
  font-size: 13px;
}
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
  font-size: 0.8rem;
}
span {
  font-family: "Reenie Beanie";
  font-size: 1.3rem;
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
