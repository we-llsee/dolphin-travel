<template>
  <div>
    <router-link :to="'/trips/' + trip.tripId" :trip="trip">
      <h3>
        {{ trip.tripName }}
        {{ trip.tripId }}
      </h3>
      <p>You're visiting {{ trip.countryVisiting }}!</p>
    </router-link>
    <img
      @click="$emit('delete-trip', trip.tripId)"
      class="delete-button"
      src="../assets/trash.svg"
      alt="trashcan"
    />
  </div>
</template>

<script>
export default {
  name: "TripCard",
  props: {
    trip: Object,
  },
  method: {
    onDelete(id) {
      this.$emit("delete-trip", id);
    },
  },
};
</script>

<style scoped>
div {
  background: #a1d8f8;
  margin: 5px;
  padding: 10px 20px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
}
div h3 {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.delete-button {
  height: 20px;
}

img:hover {
  background-color: red;
  box-shadow: 0px 0px 5px 1px rgb(255, 0, 0);
}

a {
  color: #2c3e50;
}
</style>
