<script setup>
import { onBeforeMount, reactive, ref, watch } from "vue";
import { DateTime } from "luxon";

import locations from "../data/locations.json";
import Card from "./components/Card.vue";
import Navbar from "./components/Navbar.vue";
import NewCard from "./components/NewCard.vue";

const userLocation = locations.find((location) => location.timezoneIdentifier === DateTime.local().zoneName);
const addedLocations = reactive([]);
const offset = ref(0);
const isTwelveHourFormat = ref(true);

function addNewLocation(location) {
  addedLocations.push(location);
}

function removeLocation(location) {
  const index = addedLocations.findIndex((loc) => loc.city === location.city);
  addedLocations.splice(index, 1);
}

function setTheme(isDarkMode) {
  const theme = isDarkMode ? "dark" : "light";
  document.getElementById("base-html").setAttribute("data-theme", theme);
}

function setTimeFormat(format) {
  isTwelveHourFormat.value = format === "12hr";
}

onBeforeMount(() => {
  const localDateTime = DateTime.local();
  locations.find((location) => {
    if (location.timezoneIdentifier === localDateTime.zoneName) {
      addedLocations.push(location);
    }
  });
});

// if user location is empty, reset the offset
watch(addedLocations, (newLocations) => {
  if (newLocations.length === 0) {
    offset.value = 0;
  }
});
</script>

<template>
  <Navbar :is-twelve-hour-format="isTwelveHourFormat" @toggle-time-format="setTimeFormat" @theme-changed="setTheme" />
  <div class="container mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <Card
        v-for="location in addedLocations"
        :key="location.city"
        :location="location"
        :is-twelve-hour-format="isTwelveHourFormat"
        :offset="offset"
        :user-location="userLocation"
        @remove-location="removeLocation"
        @update-offset="offset = $event"
      />
      <NewCard :locations="locations" @new-location="addNewLocation" />
    </div>
  </div>
</template>

<style scoped></style>
