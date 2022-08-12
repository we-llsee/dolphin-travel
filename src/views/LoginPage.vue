<template>
  <div class="users" v-if="users.length != 0">
    <h2>Login as...</h2>
    <div :key="user.id" v-for="user in users.users">
      <UserCard :user="user" />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import UserCard from "../components/UserCard.vue";
export default {
  name: "LoginPage",
  components: { UserCard },

  data() {
    return {
      users: [],
    };
  },

  mounted() {
    axios
      .get("https://dolphin-travel.herokuapp.com/api/users?username=alexrong")
      .then(({ data }) => {
        this.users = data;
      });
  },
};
</script>

<style scoped>
.users {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
}
</style>
