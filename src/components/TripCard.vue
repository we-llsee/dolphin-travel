<template>
  <div>
    <h3>
      {{ trip.tripName
      }}<img
        @click="$emit('delete-trip', trip.tripId)"
        class="delete-button"
        src="../assets/trash.svg"
        alt="trashcan"
      />
    </h3>
    <p>You're visiting {{ trip.countryVisiting }}!</p>
  </div>
</template>

<script>
export default {
  name: "TripCard",
  props: {
    trip: Object,
  },
};
</script>

<style scoped>
div {
  background: #a1d8f8;
  margin: 5px;
  padding: 10px 20px;
  cursor: pointer;
}
div h3 {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.delete-button {
  height: 20px;
}
</style>
