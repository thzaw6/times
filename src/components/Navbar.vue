<script setup>
import ThemeController from "./ThemeController.vue";

const props = defineProps({
  isTwelveHourFormat: Boolean,
});

const emit = defineEmits(["themeChanged", "toggleTimeFormat"]);
</script>

<template>
  <div class="navbar bg-base-100">
    <div class="flex-1 lg:flex-none">
      <div class="btn btn-ghost text-xl">Timezones</div>
    </div>
    <div class="flex flex-1 justify-end px-2">
      <div class="flex items-stretch">
        <div class="dropdown dropdown-hover dropdown-end">
          <div tabindex="0" role="button" class="btn btn-sm mr-3">
            <template v-if="props.isTwelveHourFormat">12 hr</template>
            <template v-else>24 hr</template>
          </div>
          <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-24 p-2 shadow">
            <li><a @click="emit('toggleTimeFormat', '12hr')">12 hr</a></li>
            <li><a @click="emit('toggleTimeFormat'), '24hr'">24 hr</a></li>
          </ul>
        </div>
        <ThemeController @theme-changed="emit('themeChanged', $event)" />
      </div>
    </div>
  </div>
</template>
