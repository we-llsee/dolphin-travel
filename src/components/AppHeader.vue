<template>
  <header>
    <h1>Dolphin Travel Helper</h1>
    <button class="btn">Login</button>
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
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
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
</style>
