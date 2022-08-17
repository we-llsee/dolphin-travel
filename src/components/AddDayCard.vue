<template>
  <div class="newCard">
    <ul>
      <li>
        <router-link :to="'/trips/' + $route.params.tripId + '/add-day/'">
          <p>Add Day</p>
          <img
            src="../assets/plus-sign.svg"
            alt="plus sign"
            class="plus-sign"
          />
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "AddActivityCard",
};
</script>

<style scoped>
h2 {
  font-weight: bold;
  font-size: 2rem;
}
p {
  font-family: "Reenie Beanie";
  font-size: 2rem;
}

* {
  margin: 0;
  padding: 0;
}

ul,
li {
  list-style: none;
}
ul {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.newCard {
  text-decoration: none;
  color: #000;
  background: var(--middle-blue);
  display: block;
  padding: 0.5rem;
  border-radius: 5px;
  max-width: 300px;
}

.plus-sign {
  height: 10em;
}
</style>
