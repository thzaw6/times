<script setup>
import { computed, ref } from "vue";

import CrossIcon from "./icons/CrossIcon.vue";
import PlusIcon from "./icons/PlusIcon.vue";
import SearchIcon from "./icons/SearchIcon.vue";

// props
const props = defineProps({
  locations: Array,
});

// emits
const emit = defineEmits(["newLocation"]);

// reactive data
const state = ref("idle");
const searchInput = ref("");
const selectedLocation = ref(null);

// methods
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

// computed
const filteredLocations = computed(() => {
  if (searchInput.value === "") return [];
  return props.locations.filter((location) => {
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
        <PlusIcon />
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
