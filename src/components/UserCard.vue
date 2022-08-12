<template>
  <div class="User">
    <p>{{ user._id }}</p>
    <router-link to="/"
      ><button class="loginbtn" @click="loginHandler">
        Login as {{ user._id }}
      </button></router-link
    >
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
  background: lightblue;
  width: 100%;
  margin-bottom: 1rem;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
