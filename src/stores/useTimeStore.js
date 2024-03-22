import { ref } from "vue";
import { createInjectionState } from "@vueuse/core";

const [useProvideTimeStore, useTimeStore] = createInjectionState((initalValue) => {
  const minuteOfDay = ref(initalValue);

  const setMinuteOfDay = (newMinuteOfDay) => {
    minuteOfDay.value = newMinuteOfDay;
  };
  return { minuteOfDay, setMinuteOfDay };
});

const [useProvideTimeFormatStore, useTimeFormatStore] = createInjectionState((initialValue) => {
  const timeFormat = ref(initialValue);

  const setTimeFormat = (newTimeFormat) => {
    timeFormat.value = newTimeFormat;
  };
  return { timeFormat, setTimeFormat };
});

export { useProvideTimeStore, useTimeStore };
export { useProvideTimeFormatStore, useTimeFormatStore };
