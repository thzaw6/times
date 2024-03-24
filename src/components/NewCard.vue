<script setup>
import { computed, defineEmits, ref } from "vue";

import locations from "../../data/locations.json";

const state = ref("idle");
const searchInput = ref("");
const emit = defineEmits(["new-location"]);

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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            class="w-4 h-4 opacity-70 me-2 ms-0"
          >
            <path
              fill-rule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clip-rule="evenodd"
            />
          </svg>
          <input
            type="text"
            class="grow"
            placeholder="Search"
            v-model="searchInput"
            v-focus="state === 'search'"
          />
          <button class="rounded focus:outline-none hover:opacity-70" @click.stop="state = 'idle'">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-4 h-4"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </label>
        <ul v-if="searchInput !== ''" class="menu shadow bg-base-100 rounded-box w-100">
          <li v-for="location in filteredLocations">
            <a href="#">{{ location.city }}, {{ location.country }}</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
