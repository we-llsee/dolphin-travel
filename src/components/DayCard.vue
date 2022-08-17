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
          <h2>Day {{ day.dayNumber }}</h2>
          <div v-if="activities.length > 0">
            <ul>
              <li :key="activity._id" v-for="activity in activities">
                <p>
                  <span class="activity">{{ activity.activityName }} </span>
                  <span class="type"> ({{ activity.type }})</span>
                </p>
              </li>
            </ul>
          </div>
        </router-link>
      </li>
      <button
        @click="
          $emit('deleteDay', {
            tripId: this.$route.params.tripId,
            dayId: this.day._id,
          })
        "
        class="btn"
      >
        Delete Day
      </button>
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
* {
  margin: 0;
  padding: 0;
}
h2 {
  font-family: "Poppins", sans-serif;
  font-weight: bold;
  font-size: 20px;
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
  overflow: scroll;
  height: 80%;
}

ul {
  height: 90%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}

.day-card {
  text-decoration: none;
  color: #000;
  background: var(--light-cyan);
  display: block;
  padding: 0.5rem;
  max-width: 300px;
  min-height: 250px;
  width: 100%;
  height: 100%;
  border-radius: 5px;
}
ul {
  margin: 0.5rem;
  list-style: none;
}
.btn {
  display: inline-block;
  background: var(--star-command-blue);
  height: 30px;
  width: 60%;
  color: #fff;
  border: none;
  padding: 0rem 1rem 0rem 1rem;
  margin: 0px 5px 5px 5px;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  font-size: 14px;
  font-family: inherit;
  align-self: center;
}

.day-card:hover {
  box-shadow: 0px 0px 5px 2px var(--pacific-blue);
}

.btn:hover {
  box-shadow: 0px 0px 5px 2px rgb(255, 0, 0);
}

.activity {
  font-family: "Reenie Beanie";
  font-size: 2rem;
  font-size: 25px;
}
.type {
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  color: saddlebrown;
}
</style>
