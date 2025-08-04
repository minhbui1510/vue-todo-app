<script setup lang="ts">
import {ref} from "vue";
const MODE_NAME = {
  light: 'Light Mode',
  dark: 'Dark Mode',
}
const mode = ref(MODE_NAME.light);
const toggleTheme = () => {
  if (mode.value === MODE_NAME.light) {
    mode.value = MODE_NAME.dark;
    document.documentElement.classList.add('dark');
  } else {
    mode.value = MODE_NAME.light;
    document.documentElement.classList.remove('dark');
  }
};
</script>

<template>
<button @click="toggleTheme" :class="mode === MODE_NAME.light ? 'light' : 'dark'">
  Change {{ mode }} Theme
</button>
</template>

<style scoped>
.light {
  background-color: white;
  color: black;
}
.dark {
  background-color: black;
  color: white;
}
</style>
