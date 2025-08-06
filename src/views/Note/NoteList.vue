<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import {useNoteStore} from "@/stores/noteStore.ts";
import NoteListView from "@/views/Note/sub-component/NoteListView.vue";
import NoteCardView from "@/views/Note/sub-component/NoteCardView.vue";
import {showAlert, showConfirm} from "@/composables/showModal.ts";

const noteStore = useNoteStore();
const router = useRouter();

const viewMode = ref<'list' | 'card'>('list');
const currentView = computed(() =>
  viewMode.value === 'list' ? NoteListView : NoteCardView
);

onMounted(noteStore.fetchNotes);

const goToCreate = () => router.push({ name: 'note-create' });
const goToEdit = (id: number) => router.push({ name: 'note-edit', params: { id } });

const handleDelete = async (id: number) => {
  const confirmed = await showConfirm({
    title: 'Xác nhận xoá ghi chú',
    message: 'Bạn có chắc chắn muốn xoá ghi chú này?'
  });

  if (confirmed) {
    await noteStore.deleteNote(id);
    await showAlert({ message: '🗑️ Ghi chú đã được xoá.' });
  }
};
</script>

<template>
  <div class="note-list-container">
    <h2>📒 Danh sách ghi chú</h2>

    <div class="note-controls">
      <button class="create-button" @click="goToCreate">➕ Tạo ghi chú mới</button>
      <select v-model="viewMode">
        <option value="list">📃 Danh sách</option>
        <option value="card">📦 Thẻ</option>
      </select>
    </div>

    <div v-if="noteStore.loading">🔄 Đang tải...</div>

    <component
      v-else
      :is="currentView"
      :notes="noteStore.notes"
      @edit="goToEdit"
      @delete="handleDelete"
    />
  </div>
</template>

<style scoped>
.note-list-container {
  max-width: 900px;
  margin: 40px auto;
  padding: 20px;
}

.note-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.create-button {
  padding: 10px 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.create-button:hover {
  background-color: #369f74;
}

select {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
}
</style>
