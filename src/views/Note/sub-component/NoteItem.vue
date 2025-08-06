<script setup lang="ts">
defineProps<{
  note: {
    id: number;
    title: string;
    content: string;
    updatedAt: string;
    tag: { tagId: number; tagName: string; tagColor?: string }[];
  };
}>();
const emit = defineEmits(['edit', 'delete']);
</script>

<template>
  <div class="note-item">
    <div class="note-info">
      <h3>{{ note.title }}</h3>
      <p>{{ note.content }}</p>
      <small>🕒 {{ new Date(note.updatedAt).toLocaleString() }}</small>
      <div v-if="note.tag.length === 0">Không có thẻ</div>
      <div class="note-tag">
        <slot name="tags" :tags="note.tag" />
      </div>
    </div>
    <div class="note-actions">
      <slot name="actions" :note="note">
        <button @click="$emit('edit', note.id)">✏️ Sửa</button>
        <button @click="$emit('delete', note.id)">🗑️ Xoá</button>
      </slot>
    </div>
  </div>
</template>
<style scoped>
.note-list-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
}

.create-button {
  padding: 10px 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 6px;
  margin-bottom: 20px;
  cursor: pointer;
}

.create-button:hover {
  background-color: #369f74;
}

.note-list {
  list-style: none;
  padding: 0;
}

.note-item {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.note-info h3 {
  margin: 0;
  font-size: 18px;
}

.note-info p {
  margin: 4px 0;
  color: #555;
}

.note-tag {
  display: flex;
  gap: 1;
  margin-right: 8px;
  padding: 2px 6px;
  border-radius: 4px;
  color: #fff;
}

.note-actions button {
  margin-left: 8px;
  padding: 6px 10px;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.note-actions button:first-of-type {
  background-color: #ffa500;
  color: white;
}

.note-actions button:last-of-type {
  background-color: #e74c3c;
  color: white;
}

.note-actions button:hover {
  opacity: 0.9;
}
</style>
