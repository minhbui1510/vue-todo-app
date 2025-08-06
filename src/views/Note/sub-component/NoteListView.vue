<!-- components/note/NoteListView.vue -->
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
  <ul class="note-list">
    <li v-for="note in notes" :key="note.id">
      <NoteItem
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
    </li>
  </ul>
</template>

<style scoped>
.note-list {
  list-style: none;
  padding: 0;
}
.tag-list {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
</style>
