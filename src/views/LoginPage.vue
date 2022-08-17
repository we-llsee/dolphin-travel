<template>
  <h2 id="loginAs">Login as...</h2>
  <div class="users" v-if="users.length != 0">
    <div class="userCard" :key="user.id" v-for="user in users.users">
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
  margin: 1rem;
}

#loginAs {
  padding-top: 1rem;
  font-size: 14px;
}
</style>
