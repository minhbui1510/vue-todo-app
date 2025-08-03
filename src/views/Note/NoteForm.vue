<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNoteStore } from '@/stores/noteStore';

const props = defineProps<{ mode: 'create' | 'edit' }>();
const noteStore = useNoteStore();
const router = useRouter();
const route = useRoute();

const title = ref('');
const content = ref('');
const loading = ref(false);

onMounted(async () => {
  if (props.mode === 'edit') {
    const noteId = Number(route.params.id);
    loading.value = true;
    const note = noteStore.notes.find(n => n.id === noteId);
    if (note) {
      title.value = note.title;
      content.value = note.content;
    } else {
      await noteStore.fetchNotes(); // nếu chưa có
      const refreshed = noteStore.notes.find(n => n.id === noteId);
      if (refreshed) {
        title.value = refreshed.title;
        content.value = refreshed.content;
      }
    }
    loading.value = false;
  }
});

const handleSubmit = async () => {
  if (props.mode === 'create') {
    await noteStore.addNote({ title: title.value, content: content.value });
  } else {
    const id = Number(route.params.id);
    await noteStore.updateNote(id, { title: title.value, content: content.value });
  }
  router.push('/note/list');
};
</script>

<template>
  <div class="note-form-container">
    <h2>{{ props.mode === 'create' ? '📝 Thêm ghi chú' : '✏️ Cập nhật ghi chú' }}</h2>

    <form @submit.prevent="handleSubmit" class="note-form" v-if="!loading">
      <label for="title">Tiêu đề</label>
      <input id="title" v-model="title" type="text" required placeholder="Nhập tiêu đề" />

      <label for="content">Nội dung</label>
      <textarea id="content" v-model="content" required placeholder="Nhập nội dung"></textarea>

      <button type="submit">
        {{ props.mode === 'create' ? '➕ Thêm ghi chú' : '💾 Cập nhật ghi chú' }}
      </button>
    </form>

    <p v-else>🔄 Đang tải ghi chú...</p>

    <router-link to="/note/list">← Quay lại danh sách</router-link>
  </div>
</template>

<style scoped>
.note-form-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  border-radius: 12px;
  background-color: #fefefe;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.note-form h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.note-form label {
  display: block;
  margin-top: 15px;
  font-weight: bold;
}

.note-form input,
.note-form textarea {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  font-family: inherit;
}

.note-form textarea {
  min-height: 120px;
  resize: vertical;
}

.note-form button {
  margin-top: 20px;
  width: 100%;
  padding: 12px;
  background-color: #42b983;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.note-form button:hover {
  background-color: #369f74;
}
</style>
