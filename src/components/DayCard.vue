<template>
  <div class="day-card">
    <!-- <span>{{ trips }}</span> -->
    <p></p>
    <span></span>
    <ul>
      <li>
        <a href="#">
          <span>Day {{ day }}</span>
          <h3 v-show="isBooked">Booked</h3>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "DayCard",
  props: ["trips", "day", "activityArray"],

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
  font-size: 2rem;
}

p {
  font-size: 1rem;
  font-weight: normal;
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
  background: #ffc;
  display: block;
  height: 10em;
  width: 10em;
  padding: 1em;
}
ul li {
  margin: 1em;
}
</style>
