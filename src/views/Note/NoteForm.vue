<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNoteStore } from '@/stores/noteStore';
import { useFormValidation } from '@/composables/useFormValidation'; // không cần .ts ở cuối

const props = defineProps<{ mode: 'create' | 'edit' }>();
const noteStore = useNoteStore();
const router = useRouter();
const route = useRoute();

const loading = ref(false);

const form = reactive({
  title: '',
  content: ''
});

const { errors, touched, validate, validateField, resetErrors, isValid } =
  useFormValidation({
    form,
    rules: {
      title: [(v) => !!v.trim() || 'Title is required'],
      content: [
        (v) => !!v.trim() || 'Content is required',
        (v) => v.length >= 10 || 'Content must be at least 10 characters'
      ]
    },
    validateOn: 'change' // hoặc 'submit'
  });
onMounted(async () => {
  if (props.mode === 'edit') {
    const noteId = Number(route.params.id);
    loading.value = true;
    const note = noteStore.notes.find(n => n.id === noteId);
    if (note) {
      form.title = note.title;
      form.content = note.content;
    } else {
      await noteStore.fetchNotes();
      const refreshed = noteStore.notes.find(n => n.id === noteId);
      if (refreshed) {
        form.title = refreshed.title;
        form.content = refreshed.content;
      }
    }
    loading.value = false;
  }
});

const handleSubmit = async () => {
  // ✅ kiểm tra lần cuối trước khi submit
  if (!validate()) return;

  loading.value = true;
  try {
    if (props.mode === 'create') {
      await noteStore.addNote({ title: form.title, content: form.content });
    } else {
      const id = Number(route.params.id);
      await noteStore.updateNote(id, { title: form.title, content: form.content });
    }
    router.push('/note/list');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="note-form-container">
    <h2>{{ props.mode === 'create' ? '📝 Thêm ghi chú' : '✏️ Cập nhật ghi chú' }}</h2>

    <form @submit.prevent="handleSubmit" class="note-form">
      <div>
        <label for="title">Title</label>
        <input id="title" v-model="form.title" type="text" />
        <span v-if="errors.title" class="error">{{ errors.title }}</span>
      </div>

      <div>
        <label for="content">Content</label>
        <textarea id="content" v-model="form.content"></textarea>
        <span v-if="errors.content" class="error">{{ errors.content }}</span>
      </div>

      <button type="submit" :disabled="false">
        {{ props.mode === 'create' ? 'Create' : 'Update' }}
      </button>
    </form>

    <div v-if="loading">🔄 Đang tải...</div>
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
.note-form h2 { text-align: center; margin-bottom: 20px; color: #333; }
.note-form label { display: block; margin-top: 15px; font-weight: bold; }
.note-form input,
.note-form textarea {
  width: 100%; padding: 10px; margin-top: 5px;
  border: 1px solid #ccc; border-radius: 6px; font-size: 16px; font-family: inherit;
}
.note-form textarea { min-height: 120px; resize: vertical; }
.note-form button {
  margin-top: 20px; width: 100%; padding: 12px;
  border: none; border-radius: 6px; cursor: pointer; transition: background-color 0.2s ease;
  background-color: #42b983; color: #fff; font-size: 16px;
}
.note-form .error { color: red; font-size: 14px; margin-top: 5px; display: block; }
.note-form button:hover { background-color: #369f74; }
</style>
