<!-- components/note/NoteCardView.vue -->
<script setup lang="ts">
import NoteItem from './NoteItem.vue';
import TagLabel from "@/components/shared/TagLabel.vue";

defineProps<{
  notes: {
    id: number;
    title: string;
    content: string;
    updatedAt: string;
    tag: { tagId: number; tagName: string; tagColor?: string }[];
  }[];
}>();

const emit = defineEmits<{
  (e: 'edit', id: number): void;
  (e: 'delete', id: number): void;
}>();
</script>

<template>
  <div class="card-grid">
    <NoteItem
      v-for="note in notes"
      :key="note.id"
      :note="note"
      @edit="emit('edit', $event)"
      @delete="emit('delete', $event)"
    >
      <template #tags="{ tags }">
        <div class="tag-list">
          <TagLabel v-for="tag in tags" :key="tag.tagId" :tag="tag" />
        </div>
      </template>
    </NoteItem>
  </div>
</template>

<style scoped>
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
</style>
