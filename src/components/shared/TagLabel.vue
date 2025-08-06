<script setup lang="ts">
const { tag } = defineProps<{
  tag: {
    tagId: number;
    tagName: string;
    tagColor?: string;
  };
}>();

const fixHex = (color?: string) => {
  if (!color) return '#999';
  return color.startsWith('#') ? color : `#${color}`;
};
</script>

<template>
  <span class="tag" :style="{ backgroundColor: fixHex(tag.tagColor) }">
    {{ tag.tagName }}
  </span>
</template>

<style scoped>
.tag{
  display:inline-block; padding:2px 6px; border-radius:4px;
  margin-right:4px; color:#fff;
}
</style>
