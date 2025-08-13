<script setup lang="ts">
import { computed, watch } from 'vue';
import {FetchType} from "@/components/UI/model/paginator.enum.ts";

interface Props<T = any> {
  currentPage: number;
  perPage: number;
  totalItems?: number;   // server mode
  totalPages?: number;   // override
  items?: T[];           // local mode
  mode?: FetchType;
  maxVisible?: number;
  showStatus?: boolean;
  statusText?: string;   // custom text, có thể dùng {{currentPage}}, {{totalPages}}
}

const props = withDefaults(defineProps<Props>(), {
  mode: FetchType.LOCAL,
  maxVisible: 5,
  perPage: 10,
  showStatus: true,
});

const emit = defineEmits<{
  (e: 'update:currentPage', value: number): void;
  (e: 'page-change', page: number): void;
  (e: 'page-items', items: any[]): void;
}>();

const totalPagesCalc = computed(() => {
  if (props.totalPages) return props.totalPages;
  if (props.mode === 'server' && props.totalItems) {
    return Math.ceil(props.totalItems / props.perPage);
  }
  if (props.mode === 'local' && props.items) {
    return Math.ceil(props.items.length / props.perPage);
  }
  return 1;
});

const pages = computed(() => {
  const half = Math.floor(props.maxVisible / 2);
  let start = Math.max(1, props.currentPage - half);
  let end = Math.min(totalPagesCalc.value, props.currentPage + half);

  if (end - start + 1 < props.maxVisible) {
    if (start === 1) end = Math.min(totalPagesCalc.value, start + props.maxVisible - 1);
    else if (end === totalPagesCalc.value) start = Math.max(1, end - props.maxVisible + 1);
  }
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

function goTo(page: number) {
  if (page < 1 || page > totalPagesCalc.value) return;
  emit('update:currentPage', page);
  if (props.mode === 'server') {
    emit('page-change', page);
  }
}

watch(
  () => [props.currentPage, props.items, props.perPage],
  () => {
    if (props.mode === 'local' && props.items) {
      const start = (props.currentPage - 1) * props.perPage;
      const pageData = props.items.slice(start, start + props.perPage);
      emit('page-items', pageData);
    }
  },
  { immediate: true }
);

const renderedStatusText = computed(() => {
  if (props.statusText) {
    return props.statusText
      .replace('{{currentPage}}', String(props.currentPage))
      .replace('{{totalPages}}', String(totalPagesCalc.value));
  }
  return `Đang hiển thị trang ${props.currentPage} / ${totalPagesCalc.value}`;
});
</script>

<template>
  <div class="ui-paginator">
    <button :disabled="currentPage===1" @click="goTo(1)">«</button>
    <button :disabled="currentPage===1" @click="goTo(currentPage-1)">‹</button>

    <template v-if="pages[0] > 1">
      <button @click="goTo(1)">1</button>
      <span class="ui-paginator__ellipsis">…</span>
    </template>

    <button
      v-for="p in pages"
      :key="p"
      :class="{ 'is-active': p===currentPage }"
      @click="goTo(p)"
    >
      {{ p }}
    </button>

    <template v-if="pages[pages.length-1] < totalPagesCalc">
      <span class="ui-paginator__ellipsis">…</span>
      <button @click="goTo(totalPagesCalc)">{{ totalPagesCalc }}</button>
    </template>

    <button :disabled="currentPage===totalPagesCalc" @click="goTo(currentPage+1)">›</button>
    <button :disabled="currentPage===totalPagesCalc" @click="goTo(totalPagesCalc)">»</button>

    <span v-if="showStatus" class="ui-paginator__status">
      {{ renderedStatusText }}
    </span>
  </div>
</template>
