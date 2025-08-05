<script setup lang="ts">
import {onMounted} from 'vue';
import {useRouter} from 'vue-router';
import {useNoteStore} from '@/stores/noteStore';

const noteStore = useNoteStore();
const router = useRouter();

onMounted(noteStore.fetchNotes);

const goToCreate = () => {
  router.push({name: 'note-create'}); // /note/form
};

const goToEdit = (id: number) => {
  router.push({name: 'note-edit', params: {id}}); // /note/edit/:id
};

const confirmDelete = async (id: number) => {
  if (confirm('Bạn có chắc chắn muốn xoá ghi chú này?')) {
    await noteStore.deleteNote(id);
  }
};
const fixHex = (color?: string) => {
  if (!color) return '#999';
  return color.startsWith('#') ? color : `#${color}`;
};

</script>

<template>
  <div class="note-list-container">
    <h2>📒 Danh sách ghi chú</h2>

    <button class="create-button" @click="goToCreate">➕ Tạo ghi chú mới</button>

    <div v-if="noteStore.loading">🔄 Đang tải...</div>

    <ul v-else class="note-list">
      <li v-for="note in noteStore.notes" :key="note.id" class="note-item">
        <div class="note-info">
          <h3>{{ note.title }}</h3>
          <p>{{ note.content }}</p>
          <small>🕒 {{ new Date(note.updatedAt).toLocaleString() }}</small>
          <p v-if="note.tag.length === 0">Không có thẻ</p>
          <div class="note-tag">
            <p v-for="tag in note.tag" :key="tag.tagId">
  <span
    :style="{ backgroundColor: fixHex(tag.tagColor), color: '#fff', padding: '2px 6px', borderRadius: '4px', marginRight: '4px', display: 'inline-block' }">
    {{ tag.tagName }}
  </span>
            </p>

          </div>
        </div>
        <div class="note-actions">
          <button @click="goToEdit(note.id)">✏️ Sửa</button>
          <button @click="confirmDelete(note.id)">🗑️ Xoá</button>
        </div>
      </li>
    </ul>
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
