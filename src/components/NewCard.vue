<script setup>
import { computed, defineEmits, onBeforeMount, onMounted, ref, nextTick } from "vue";

import locations from "../../data/locations.json";
import CrossIcon from "./icons/CrossIcon.vue";
import SearchIcon from "./icons/SearchIcon.vue";

const state = ref("idle");
const searchInput = ref("");
const selectedLocation = ref(null);
const emit = defineEmits(["newLocation"]);

function addLocation(location) {
  emit("newLocation", location);
  state.value = "idle";
  searchInput.value = "";
}

function handleKeyDown(event) {
  if (event.key === "Enter" && selectedLocation.value) {
    addLocation(selectedLocation.value);
  } else if (event.key === "Escape") {
    state.value = "idle";
    searchInput.value = "";
  }
}

function selectLocation(location) {
  selectedLocation.value = location;
}

const filteredLocations = computed(() => {
  if (searchInput.value === "") return [];
  return locations.filter((location) => {
    return (
      location.city.toLowerCase().startsWith(searchInput.value.toLowerCase()) ||
      location.country.toLowerCase().startsWith(searchInput.value.toLowerCase())
    );
  });
});


// custom directives
const vFocus = {
  mounted(el) {
    el.focus();
  },
};
</script>

<template>
  <div
    class="card card-compact min-h-40 m-2 text-sm w-100 bg-base-100 shadow-xl border-2 border-dashed border-gray-500 hover:border-solid hover:border-indigo-400 hover:cursor-pointer"
    @click="state = 'search'"
  >
    <div class="card-body" :class="state === 'idle' ? 'flex items-center justify-center' : ''">
      <div v-if="state === 'idle'" class="flex flex-col items-center justify-center">
        <svg width="20" height="20" fill="currentColor" aria-hidden="true">
          <path
            d="M10 5a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3H6a1 1 0 1 1 0-2h3V6a1 1 0 0 1 1-1Z"
          />
        </svg>
        <div class="">Add Location</div>
      </div>
      <div v-else-if="state === 'search'" class="dropdown">
        <label class="input input-sm flex items-center">
          <SearchIcon />
          <input
            type="text"
            class="grow"
            placeholder="Search"
            v-model="searchInput"
            v-focus="state === 'search'"
            @keydown="handleKeyDown"
          />
          <button class="rounded focus:outline-none hover:opacity-70" @click.stop="state = 'idle'">
            <CrossIcon />
          </button>
        </label>
        <ul v-if="searchInput !== ''" class="menu shadow bg-base-100 rounded-box w-100">
          <li
            v-for="location in filteredLocations"
            :key="location.city"
            @click="addLocation(location)"
            @mouseover="selectLocation(location)"
          >
            <div>{{ location.city }}, {{ location.country }}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
