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
    <router-link id="loginButton" to="/login"
      ><button class="loginBtn">Login</button></router-link
    >
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

.loginBtn {
  display: inline-block;
  background: var(--pacific-blue);
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
</style>
