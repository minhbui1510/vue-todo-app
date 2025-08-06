<template>
  <div class="wrap">
    <h2>{{ mode === 'create' ? '➕ Tạo ghi chú' : '✏️ Sửa ghi chú' }}</h2>

    <Form
      :key="formKey"
      :initial-values="initialValues"
      :validation-schema="schema"
      @submit="onSubmit"
      v-slot="{ values, errors, isSubmitting }"
      class="form"
    >
      <!-- Tiêu đề -->
      <div class="row">
        <label for="title">Tiêu đề</label>
        <Field name="title" id="title" as="input" />
        <ErrorMessage name="title" class="error" />
      </div>

      <!-- Nội dung -->
      <div class="row">
        <label for="content">Nội dung</label>
        <Field name="content" id="content" as="textarea" rows="5" />
        <ErrorMessage name="content" class="error" />
      </div>

      <!-- Thẻ liên quan (multi-select) -->
      <div class="row">
        <label for="tagIds">Thẻ liên quan</label>
        <!-- vee-validate hỗ trợ multi-select qua <Field as="select" multiple> -->
        <Field name="tagIds" id="tagIds" as="select" multiple size="6">
          <option
            v-for="tag in tagStore.tags"
            :key="tag.id"
            :value="String(tag.id)"
          >
            {{ tag.name }}
          </option>
        </Field>
        <small class="hint">
          Giữ Ctrl (Windows) / Command (macOS) để chọn nhiều thẻ.
        </small>
        <ErrorMessage name="tagIds" class="error" />
      </div>

      <div class="actions">
        <button type="submit" :disabled="isSubmitting">
          {{ mode === 'create' ? 'Tạo mới' : 'Cập nhật' }}
        </button>
        <button type="button" @click="goBack">Huỷ</button>
      </div>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';

import { useNoteStore } from '@/stores/noteStore';
import { useTagStore } from '@/stores/tagStore';
import type { Note } from '@/api/types/note';
// DTO gốc của bạn (chưa có tagIds); ta mở rộng tạm thời ở component này
import type { CreateNoteDto, UpdateNoteDto } from '@/api/types/note';

type CreateNoteWithTagsDto = CreateNoteDto & { tagIds: number[] };
type UpdateNoteWithTagsDto = UpdateNoteDto & { tagIds?: number[] };

const props = defineProps<{ mode: 'create' | 'edit' }>();
const mode = props.mode;

const router = useRouter();
const route = useRoute();

const noteStore = useNoteStore();
const tagStore = useTagStore();

const formKey = ref(0);
const initialValues = ref({
  title: '',
  content: '',
  // Lưu ý: Field select multiple sẽ giữ giá trị dạng string[], ta sẽ convert về number[] khi submit
  tagIds: [] as string[],
});

// Yup schema
const schema = yup.object({
  title: yup.string().trim().min(2, 'Tiêu đề tối thiểu 2 ký tự.').required('Vui lòng nhập tiêu đề.'),
  content: yup.string().trim().min(2, 'Nội dung tối thiểu 2 ký tự.').required('Vui lòng nhập nội dung.'),
  tagIds: yup
    .array()
    .of(yup.string().matches(/^\d+$/)) // giữ dạng string (id), sẽ convert số khi submit
    // .min(1, 'Chọn ít nhất 1 thẻ.') // 👉 BẬT luật này nếu bạn muốn bắt buộc phải chọn
    .optional(),
});

onMounted(async () => {
  // Tải danh sách tag cho multi-select
  if (!tagStore.tags.length) {
    await tagStore.fetchTags();
  }

  if (mode === 'edit') {
    const id = Number(route.params.id);

    // Đảm bảo đã có note để fill form
    if (!noteStore.notes.length) {
      await noteStore.fetchNotes();
    }

    const note = noteStore.notes.find((n: Note) => n.id === id);
    if (note) {
      // Dựa vào cấu trúc trước đó: note.tag = [{ tagId, ... }]
      const tagIdsStr = (note.tag ?? []).map((tn: any) => String(tn.tagId));

      initialValues.value = {
        title: note.title,
        content: note.content,
        tagIds: tagIdsStr,
      };
      formKey.value++;
    }
  }
});

const onSubmit = async (values: typeof initialValues.value) => {
  // Convert string[] -> number[]
  const tagIds = (values.tagIds ?? []).map((v) => Number(v)).filter((n) => Number.isFinite(n));

  const payload: CreateNoteWithTagsDto = {
    title: values.title.trim(),
    content: values.content.trim(),
    tagId: tagIds,
  };
  if (mode === 'create') {

    // ⚠️ Nếu noteStore.addNote vẫn chỉ nhận CreateNoteDto,
    // bạn có thể sửa type ở store hoặc cast tạm:
    await noteStore.addNote(payload as unknown as CreateNoteDto);
  } else {
    const id = Number(route.params.id);
    await noteStore.updateNote(id, payload as unknown as UpdateNoteDto);
  }

  router.push('/note/list');
};

const goBack = () => router.push('/note/list');
</script>

<style scoped>
.wrap {
  max-width: 720px;
  margin: 0 auto;
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
h2 {
  margin-bottom: 16px;
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
}
.form { display: grid; gap: 16px; }
.row { display: flex; flex-direction: column; }
label { font-weight: 500; margin-bottom: 6px; color: #444; }
input, textarea, select {
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  transition: border 0.2s;
  background: #fff;
}
textarea { resize: vertical; }
input:focus, textarea:focus, select:focus { border-color: #228be6; outline: none; }
.hint { color: #666; font-size: 0.85rem; margin-top: 4px; }
.actions { display: flex; gap: 12px; margin-top: 12px; }
button {
  padding: 10px 16px; font-size: 1rem; border-radius: 6px; border: none; cursor: pointer; transition: background 0.2s;
}
button[type="submit"] { background: #228be6; color: #fff; }
button[type="submit"]:hover { background: #1c7ed6; }
button[type="button"] { background: #dee2e6; color: #333; }
button[type="button"]:hover { background: #ced4da; }
.error { color: #e03131; font-size: 0.875rem; margin-top: 4px; }
</style>
