<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";

import { useTimeFormatStore } from "../stores/useTimeStore";

const currentTime = ref("");
const { timeFormat } = useTimeFormatStore();

function getTime() {
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: timeFormat.value === "12h",
  };
  return new Date().toLocaleTimeString("en-US", options);
};

function toggleTimeFormat () {
  timeFormat.value = timeFormat.value === "12h" ? "24h" : "12h";
  currentTime.value = getTime();
};

let intervalId;

onMounted(() => {
  currentTime.value = getTime();
  intervalId = setInterval(() => {
    currentTime.value = getTime();
  }, 1000);
});

onBeforeUnmount(() => {
  clearInterval(intervalId);
});
</script>

<template>
  <div class="navbar">
    <div class="navbar-start">
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </div>
        <ul
          tabindex="0"
          class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-300 rounded-box w-52"
        >
          <li><a>Item 1</a></li>
          <li><a>Item 2</a></li>
        </ul>
      </div>
      <a class="btn btn-ghost text-xl">Timezones</a>
    </div>
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1">
        <li><a>Item 1</a></li>
        <li><a>Item 2</a></li>
      </ul>
    </div>
    <div class="navbar-end">
      <a class="btn btn-sm btn-ghost pointer-events-none">{{ currentTime }}</a>
      <button class="btn btn-sm btn-ghost" @click="toggleTimeFormat">
        <template v-if="timeFormat === '12h'"> 24 Hr </template>
        <template v-else> 12 Hr </template>
      </button>
    </div>
  </div>
</template>
