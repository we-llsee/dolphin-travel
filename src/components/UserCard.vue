<template>
  <div class="User">
    <router-link to="/"
      ><button class="btn" @click="loginHandler">
        <img
          class="logo"
          src="https://upload.wikimedia.org/wikipedia/commons/6/60/Dolphin-logo.svg"
          alt="Dolphin logo"
        /></button
    ></router-link>
    <p>{{ user._id }}</p>
  </div>
</template>

<script>
export default {
  name: "UserCard",
  props: {
    user: Object,
  },
  methods: {
    loginHandler() {
      this.$store.state.loggedInUser = this.user._id;
    },
  },
};
</script>

<style scoped>
.User {
  display: flex;
  padding: 1rem 0.5rem;
  border: 1px solid var(--midnight-blue);
  border-radius: 10px;
  width: 150px;
  height: 100%;
  margin-bottom: 1rem;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

a {
  padding: 15px;
}

.logo {
  width: 60px;
}

.btn {
  width: 50px;
  padding: 0;
  background: none;
}
a:hover {
  border-radius: 50%;
}
</style>
