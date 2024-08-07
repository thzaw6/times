import { computed, ref } from "vue";
import { createInjectionState } from "@vueuse/core";

const [useProvideTimeFormatStore, useTimeFormatStore] = createInjectionState((initialValue) => {
  const timeFormat = ref(initialValue);

  const isTwelveHourFormat = computed(() => timeFormat.value === "12h");

  return { timeFormat, isTwelveHourFormat };
});

export { useProvideTimeFormatStore, useTimeFormatStore };
