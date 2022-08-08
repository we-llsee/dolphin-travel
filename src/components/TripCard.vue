<template>
  <div>
    <p>{{ tripName }}</p>
  </div>
</template>

<script>
// import { defineComponent } from '@vue/composition-api'

export default {
  name: "TripCard",
  props: ["tripName"],
};
</script>
