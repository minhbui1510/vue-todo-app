<script setup lang="ts">
import { ref, computed } from 'vue'

// 1. Khởi tạo timestamp
const timestamp = ref(Date.now())

// 2. computed để format lại
const formattedDate = computed(() => new Date(timestamp.value).toLocaleString())

// 3. Nút "Reset" để quay lại thời gian hiện tại
const resetTime = () => {
  timestamp.value = Date.now()
}

</script>

<template>
  <div class="clock">
    <p>🕒 Thời gian: {{ formattedDate }}</p>
    <button @click="resetTime">Reset về thời gian hiện tại</button>
  </div>
</template>

<style scoped>
.clock {
  font-family: sans-serif;
  padding: 1rem;
}
button {
  margin-top: 10px;
}
</style>
