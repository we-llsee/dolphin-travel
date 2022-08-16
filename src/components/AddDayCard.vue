<template>
  <div>
    <ul>
      <li>
        <a href="#">
          <p>Add Day</p>

          <img
            src="../assets/plus-sign.svg"
            alt="plus sign"
            class="plus-sign"
          />
        </a>
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
body {
  margin: 20px auto;
  font-family: "Lato";
  background: #666;
  color: #fff;
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
ul li a {
  text-decoration: none;
  color: #000;
  background: plum;
  display: block;
  height: 15em;
  width: 15em;
  margin: 1em;
  border-radius: 5px;
}

.plus-sign {
  height: 10em;
}
</style>
