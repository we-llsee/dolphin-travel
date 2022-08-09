<template>
  <form class="add-form">
    <div class="form-control">
      <label>Trip Name</label>
      <input type="text" name="text" placeholder="Trip Name" />
    </div>
    <div class="form-control">
      <label>Country Visiting</label>
      <input type="text" name="country" placeholder="Choose a country" />
    </div>
    <div class="form-control">
      <label>Budget</label>
      <input type="text" name="budget" placeholder="$0.00" />
    </div>
    <div class="form-control form-control-check">
      <label>Trip start date</label>
      <input type="text" name="trip-start" placeholder="DD/MM/YYYY" />
    </div>
    <div class="form-control form-control-check">
      <label>Trip end date</label>
      <input type="text" name="trip-end" placeholder="DD/MM/YYYY" />
    </div>
    <router-link to="/trip-view">
      <input type="submit" value="Save trip" class="btn btn-block"
    /></router-link>
  </form>
</template>

<script>
export default {
  name: "AddNewTrip",
};
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
