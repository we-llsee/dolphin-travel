<template>
  <div class="User">
    <router-link to="/"
      ><button class="btn" @click="loginHandler">
        <img class="logo" :src="user.avatarURL" alt="Dolphin logo" /></button
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
      this.$store.state.loggedInUserObj = this.user;
    },
  },
};
</script>

<style scoped>
.User {
  display: flex;
  padding: 1rem rem;
  /* border: 1px solid lightgray; */
  border-radius: 10px;
  width: 150px;
  height: 100%;
  margin-bottom: 1rem;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

a {
  padding: 3px;
}

.logo {
  height: 100%;
  width: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.btn {
  width: 90px;
  height: 90px;
  padding: 0;
  background: none;
}
a:hover {
  border-radius: 50%;
}
</style>
