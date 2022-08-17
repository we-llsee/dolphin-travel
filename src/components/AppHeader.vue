<template>
  <header>
    <img
      class="logo"
      src="https://upload.wikimedia.org/wikipedia/commons/6/60/Dolphin-logo.svg"
      alt="Dolphin logo"
    />
    <div class="logotext">
      <span class="maintitle">Dolphin Travels</span>
      <span class="subtitle">Dive into your next adventure</span>
    </div>
    <div class="loginInfo">
      <UserCard :user="this.$store.state.loggedInUserObj" />
      <p id="loggedinDesc">Logged in as {{ $store.state.loggedInUser }}</p>
    </div>
  </header>
  <NavigationBar class="nav-bar" />
</template>

<script>
import NavigationBar from "./NavigationBar.vue";
import UserCard from "./UserCard.vue"
// import axios from 'axios'

export default {
  name: "AppHeader",
  components: {
    NavigationBar,
    UserCard
  }
};
</script>

<style scoped>
.maintitle {
  font-family: "Reenie Beanie";
  font-size: 50px;
  font-weight: bold;
  color: var(--midnight-blue);
}

.logotext {
  font-size: 14px;
  display: flex;
  flex-direction: column;
}

.logo {
  height: 150px;
}

header {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

#loggedinDesc {
  padding-bottom: 0.5rem;
  font-size: 14px;
  padding-top: 1rem;
}

.loginInfo {
  padding-top: 1.5rem;
}

.nav-bar {
  display: flex;
  margin-top: -1.2rem;
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
