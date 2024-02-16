<script setup>
import { ref, computed, onBeforeMount } from "vue";
import VueSlider from "vue-slider-component";

const currentDate = ref("");
const minuteOfDay = ref(0);
const marks = ref({
  0: "00",
  360: "06",
  720: "12",
  1080: "18",
  1435: "24",
});

function getDate () {
  const options = {
    month: "short",
    day: "numeric",
  };
  return new Date().toLocaleDateString("en-US", options);
};

onBeforeMount(() => {
  const now = new Date();
  minuteOfDay.value = now.getHours() * 60 + now.getMinutes();
  currentDate.value = getDate();
});

const time = computed(() => {
  const hours = Math.floor(minuteOfDay.value / 60);
  const minuteOfDays = minuteOfDay.value % 60;
  const period = hours < 12 || hours === 24 ? "AM" : "PM";

  let hoursIn12HourFormat = hours % 12;
  if (hoursIn12HourFormat === 0) {
    hoursIn12HourFormat = 12;
  }

  // Pad minuteOfDays with leading zero if less than 10
  const minuteOfDaysPadded = minuteOfDays < 10 ? `0${minuteOfDays}` : minuteOfDays;

  return `${hoursIn12HourFormat}:${minuteOfDaysPadded} ${period}`;
});
</script>

<template>
  <div
    class="card card-compact min-h-40 hover:border hover:border-indigo-400 w-100 bg-base-100 shadow-xl m-2"
  >
    <div class="card-body">
      <div class="flex flex-row">
        <div>London, United Kingdom</div>
        <button class="btn btn-xs ms-auto bg-dark-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-5 h-5 opacity-50 hover:opacity-100"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>
        </button>
        <button class="btn btn-xs">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-5 h-5 opacity-50 hover:opacity-100 text-error"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
        </button>
      </div>
      <div class="text-2xl font-bold">
        {{ time }}
      </div>
      <div class="text-sm">
        <span>GMT+0</span> | <span>{{ currentDate }}</span>
      </div>
      <div class="mx-1 mt-3 mb-4">
        <vue-slider
          v-model="minuteOfDay"
          :min="0"
          :max="1435"
          :tooltip="'none'"
          :interval="5"
          :marks="marks"
        />
      </div>
    </div>
  </div>
</template>
