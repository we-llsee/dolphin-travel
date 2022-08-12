<template>
  <header>
    <div class="logowrapper"></div>
    <img
      class="logo"
      src="https://upload.wikimedia.org/wikipedia/commons/6/60/Dolphin-logo.svg"
    />
    <div class="logotext">
      <span class="maintitle">Dolphin Travels</span>
      <span class="subtitle">Dive into your next adventure</span>
    </div>
    <p>Logged in as {{ $store.state.loggedInUser }}</p>
    <router-link to="/login"
      ><button class="loginbtn">Login</button></router-link
    >
  </header>
  <NavigationBar class="nav-bar" />
</template>

<script>
import NavigationBar from "./NavigationBar.vue";

export default {
  name: "AppHeader",
  components: {
    NavigationBar,
  },
};
</script>

<style scoped>
.maintitle {
  font-size: 30px;
  font-weight: bold;
  color: #002fff;
}

.logotext {
  display: flex;
  flex-direction: column;
}

.logowrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo {
  height: 200px;
}

header {
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f7f7f7;
}

.btn {
  display: inline-block;
  background: #000;
  color: #fff;
  border: none;
  padding: 10px 20px;
  margin: 5px;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  font-size: 15px;
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

.loginbtn {
}
</style>
