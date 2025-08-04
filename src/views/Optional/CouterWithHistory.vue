<script setup lang="ts">
import { reactive } from 'vue'

const state = reactive({
  count: 0,
  history: [] as object[]
})

const increment = () => {
  state.count++
  state.history.push({count :state.count, time: Date.now()})
}

const reset = () => {
  state.count = 0
  state.history = []
}
</script>

<template>
  <div class="counter">
    <h2>Giá trị hiện tại: {{ state.count }}</h2>
    <button @click="increment">Tăng</button>
    <button @click="reset">Reset</button>

    <h3>Lịch sử:</h3>
    <ul>
      <li v-for="(item, index) in state.history" :key="index">
        Lần {{ index + 1 }}: Vào lúc {{ new Date(item?.time) }} - Giá trị: {{ item?.count }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.counter {
  font-family: sans-serif;
  max-width: 300px;
}
button {
  margin-right: 10px;
}
</style>
