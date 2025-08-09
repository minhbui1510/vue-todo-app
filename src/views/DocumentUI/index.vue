<script setup lang="ts">
 import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
 <h1>Index UI input</h1>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/input">Input</RouterLink>

      </nav>
    </div>
  </header>
  <RouterView></RouterView>
</template>

<style scoped>

</style>
