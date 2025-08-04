<script setup lang="ts">
import { ref, watch } from 'vue'

const username = ref('')

// Dùng watch để theo dõi sự thay đổi của username
watch(username, (newValue, oldValue) => {
  console.log(`Giá trị mới: ${newValue}, giá trị cũ: ${oldValue}`)

  if (newValue.length > 10) {
    alert('Tên quá dài! Vui lòng nhập dưới 10 ký tự.')
  }
})
</script>

<template>
  <div>
    <label>Nhập tên người dùng:</label>
    <input v-model="username" placeholder="Nhập tên..." />
    <p>Tên của bạn là: {{ username }}</p>
  </div>
</template>
