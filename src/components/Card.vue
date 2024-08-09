<script setup>
import { ref, computed, onBeforeMount, watchEffect } from "vue";
import { DateTime } from "luxon";
import VueSlider from "vue-slider-component";

import EditIcon from "./icons/EditIcon.vue";
import TrashIcon from "./icons/TrashIcon.vue";
import { useTimeFormatStore } from "../stores/useTimeStore";

// props
const props = defineProps({
  location: Object,
  offset: Number,
});

// emits
const emit = defineEmits(["removeLocation", "updateOffset"]);

// stores
const { isTwelveHourFormat } = useTimeFormatStore();

// reactive data
const changedLocationDateTime = ref(null);
const initialLocationDateTime = ref(null);
const marks = ref({
  0: "00",
  360: "06",
  720: "12",
  1080: "18",
  1435: "24",
});

// methods
function removeLocation() {
  emit("removeLocation", props.location);
}

function minuteOfDayToDateTime(minuteOfDay) {
  const hours = Math.floor(minuteOfDay / 60);
  const minutes = minuteOfDay % 60;
  return DateTime.local().setLocale("en-US").setZone(props.location.timezoneIdentifier).set({ hours, minutes });
}

// lifecycle hooks
onBeforeMount(() => {
  initialLocationDateTime.value = DateTime.local()
    .setLocale("en-US")
    .setZone(props.location.timezoneIdentifier)
    .plus({ minutes: props.offset });
  changedLocationDateTime.value = initialLocationDateTime.value;
});

// computed
const locationMinuteOfDay = computed({
  get() {
    const dt = DateTime.local().setZone(props.location.timezoneIdentifier).plus({ minutes: props.offset });
    return Math.round(dt.hour * 60 + dt.minute);
  },
  set(value) {
    const newDateTime = minuteOfDayToDateTime(value);
    const diff = newDateTime.diff(initialLocationDateTime.value, "minutes").minutes.toFixed(0);
    emit("updateOffset", parseInt(diff));
  },
});

const locationDateTimeFromMinuteOfDay = computed(() => {
  return minuteOfDayToDateTime(locationMinuteOfDay.value);
});

const formattedLocationTime = computed(() => {
  const format = isTwelveHourFormat.value ? DateTime.TIME_SIMPLE : DateTime.TIME_24_SIMPLE;
  return locationDateTimeFromMinuteOfDay.value.toLocaleString(format);
});

const formattedUTCOffset = computed(() => {
  const utcOffset = locationDateTimeFromMinuteOfDay.value.offset / 60;
  return utcOffset > 0 ? `UTC+${utcOffset}` : `UTC${utcOffset}`;
});

const formattedLocationDate = computed(() => {
  return changedLocationDateTime.value.toLocaleString(DateTime.DATE_MED);
});

// watchers
watchEffect(() => {
  changedLocationDateTime.value = DateTime.local()
    .setZone(props.location.timezoneIdentifier)
    .plus({ minutes: props.offset });
});
</script>

<template>
  <div class="card card-compact min-h-40 w-100 bg-base-100 shadow-xl m-2 hover:border hover:border-indigo-400">
    <div class="card-body">
      <div class="flex flex-row">
        <div>{{ location.city }}, {{ location.country }}</div>
        <button class="btn btn-xs ms-auto bg-dark-100">
          <EditIcon />
        </button>
        <button class="btn btn-xs" @click="removeLocation">
          <TrashIcon />
        </button>
      </div>
      <div class="text-2xl font-bold">
        {{ formattedLocationTime }}
      </div>
      <div class="text-sm">
        <span>{{ formattedUTCOffset }}</span> | <span>{{ formattedLocationDate }}</span>
      </div>
      <div class="mx-1 mt-3 mb-4">
        <vue-slider v-model="locationMinuteOfDay" :min="0" :max="1439" :tooltip="'none'" :interval="1" :marks="marks" />
      </div>
    </div>
  </div>
</template>
