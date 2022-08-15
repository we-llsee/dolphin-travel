<template>
  <div>
    <router-link to="/">
      <button class="btn">Home</button>
    </router-link>
    <router-link to="/add-new-trip"
      ><button class="btn">Create Trip</button>
    </router-link>
    <router-link to="/current-trips">
      <button class="btn">Current Trips</button>
    </router-link>
    <router-link to="/previous-trips">
      <button class="btn">Previous Trips</button>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "NavigationBar",
};
</script>

<style scoped>
div {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
