<script setup lang="ts">

import Input from "@/components/UI/Input/InputText.vue";
import InputNumber from "@/components/UI/Input/InputNumber.vue";
</script>

<template>
  <Input type="number"/>
  <InputNumber :step="100"/>
</template>

<style scoped>

</style>
