<!-- src/components/LoadingOverlay.vue -->
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useCenterModalStore } from '@/stores/center-modal.store';
const s = useCenterModalStore();
const { loading, loadingText } = storeToRefs(s);
</script>

<template>
  <transition name="fade">
    <div v-if="loading" class="co-loading">
      <div class="co-card">
        <span class="co-spin" aria-hidden="true" />
        <span class="co-text">{{ loadingText }}</span>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.co-loading{position:fixed;inset:0;background:rgba(0,0,0,.35);display:grid;place-items:center;z-index:1000}

.co-card{background:#fff;border-radius:12px;padding:16px 20px;display:flex;align-items:center;gap:10px;box-shadow:0 10px 30px rgba(0,0,0,.2)}
.co-spin{width:4rem;height:4rem;border:3px solid rgba(0,0,0,.15);border-top-color:#111;border-radius:50%;animation:spin 1s linear infinite}
.co-text{font-weight:600}
.co-card {
  background: #fff;
  border-radius: 12px;
  width: 170px;         /* chiều ngang và dọc bằng nhau */
  height: 170px;
  display: flex;
  flex-direction: column; /* icon trên, text dưới */
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 10px 30px rgba(0,0,0,.2);
}

.co-text {
  font-weight: 600;
  text-align: center;
  font-size: 14px;
}

@keyframes spin{to{transform:rotate(360deg)}}
.fade-enter-active,.fade-leave-active{transition:opacity .15s}
.fade-enter-from,.fade-leave-to{opacity:0}
</style>
