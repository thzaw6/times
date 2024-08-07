<script setup>
import { onBeforeMount, reactive, ref, watch } from "vue";
import { DateTime } from "luxon";

import locations from "../data/locations.json";
import Card from "./components/Card.vue";
import Navbar from "./components/Navbar.vue";
import NewCard from "./components/NewCard.vue";
import { useProvideTimeFormatStore } from "./stores/useTimeStore";

const userLocations = reactive([]);
const offset = ref(0);

function addNewLocation(location) {
  userLocations.push(location);
}

function removeLocation(location) {
  const index = userLocations.findIndex((loc) => loc.city === location.city);
  userLocations.splice(index, 1);
}

onBeforeMount(() => {
  const localDateTime = DateTime.local();
  useProvideTimeFormatStore("12h"); // default to 12-hour format
  locations.find((location) => {
    if (location.timezoneIdentifier === localDateTime.zoneName) {
      userLocations.push(location);
    }
  });
});

// if user location is empty, reset the offset
watch(userLocations, (newLocations) => {
  if (newLocations.length === 0) {
    offset.value = 0;
  }
});
</script>

<template>
  <div class="container mx-auto">
    <Navbar />
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <Card
        v-for="location in userLocations"
        :key="location.city"
        :location="location"
        :offset="offset"
        @remove-location="removeLocation"
        @update-offset="offset = $event"
      />
      <NewCard :locations="locations" @new-location="addNewLocation" />
    </div>
  </div>
</template>

<style scoped></style>
