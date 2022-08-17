<template>
  <div class="container">
    <AppHeader />
    <router-view />
    <AppFooter />
  </div>
</template>

<script>
import AppHeader from "./components/AppHeader.vue";
import AppFooter from "./components/AppFooter.vue";

export default {
  name: "App",
  components: {
    AppHeader,
    AppFooter,
  },
  created() {},
  data() {
    return {};
  },
  methods: {
    // deleteTrip(id) {
    //   alert("Are you sure you want to delete this trip?");
    //   this.trips = this.trips.filter((trip) => {
    //     return trip._id !== id;
    //   });
    // },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400&display=swap");

:root {
  --midnight-blue: #03045eff;
  --star-command-blue: #0077b6ff;
  --pacific-blue: #00b4d8ff;
  --middle-blue: #90e0efff;
  --light-cyan: #caf0f8ff;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: Poppins;
}

body {
  font-family: "Poppins", sans-serif;
}
.container {
  width: 90%;
  margin: 30px auto;
  overflow: auto;
  min-height: 300px;
  border: 1px solid var(--pacific-blue);
  padding: 0.5rem;
  border-radius: 5px;
}
.btn {
  display: inline-block;
  background: var(--star-command-blue);
  height: 30px;
  color: #fff;
  border: none;
  padding: 0rem 1rem 0rem 1rem;
  margin: 5px;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  font-size: 14px;
  font-family: inherit;
}

.btn:focus {
  outline: none;
}
.btn:active {
  transform: scale(0.98);
}
.btn-block {
  display: block;
  width: 100%;
}
</style>
