<template>
  <div class="wrap">
    <h2>{{ mode === 'create' ? '➕ Tạo thẻ' : '✏️ Sửa thẻ' }}</h2>

    <Form
      :key="formKey"
      :initial-values="initialValues"
      :validation-schema="schema"
      @submit="onSubmit"
      v-slot="{ values, errors, isSubmitting, setFieldValue }"
      class="form"
    >
      <!-- Tên thẻ -->
      <div class="row">
        <label for="name">Tên thẻ</label>
        <Field name="name" id="name" as="input" />
        <ErrorMessage name="name" class="error" />
      </div>

      <!-- Màu thẻ -->
      <div class="row">
        <label for="tag_color">Màu thẻ</label>
        <div class="color-group">
          <!-- Color picker đồng bộ với field -->
          <input
            type="color"
            :value="colorToPicker(values.tag_color)"
            @input="(e:any) => setFieldValue('tag_color', e.target.value)"
          />
          <Field name="tag_color" id="tag_color" as="input" placeholder="#FF0000 hoặc FF0000" />
        </div>
        <ErrorMessage name="tag_color" class="error" />
      </div>

      <!-- Mô tả -->
      <div class="row">
        <label for="tag_content">Mô tả</label>
        <Field name="tag_content" id="tag_content" as="input" placeholder="Công việc cần làm ngay" />
        <ErrorMessage name="tag_content" class="error" />
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
import { useTagStore } from '@/stores/tagStore';
import type { CreateTagDto, Tag } from '@/api/types/tag';

const props = defineProps<{ mode: 'create' | 'edit' }>();
const mode = props.mode;

const router = useRouter();
const route = useRoute();
const tagStore = useTagStore();

const formKey = ref(0); // force remount Form khi initialValues thay đổi
const initialValues = ref<CreateTagDto>({
  name: '',
  tag_color: '#FF0000',
  tag_content: '',
});

// Schema yup
const schema = yup.object({
  name: yup.string().trim().min(2, 'Tên thẻ phải có ít nhất 2 ký tự.').required('Vui lòng nhập tên thẻ.'),
  tag_color: yup
    .string()
    .trim()
    .matches(/^#?[0-9A-Fa-f]{6}$/, 'Mã màu không hợp lệ. Ví dụ: #FF0000 hoặc FF0000')
    .required('Vui lòng nhập màu thẻ.'),
  tag_content: yup.string().required('Vui lòng nhập mô tả thẻ.')
    .trim().max(200, 'Mô tả tối đa 200 ký tự.').optional(),
});

// Load dữ liệu khi edit
onMounted(async () => {
  if (mode === 'edit') {
    const id = Number(route.params.id);
    if (!tagStore.tags.length) await tagStore.fetchTags();
    const tag = tagStore.tags.find((t: Tag) => t.id === id);
    if (tag) {
      initialValues.value = {
        name: tag.name,
        tag_color: fixHex(tag.tag_color),
        tag_content: tag.tag_content ?? '',
      };
      formKey.value++; // refresh form để set initial values
    }
  }
});

// Submit
const onSubmit = async (values: CreateTagDto) => {
  const payload: CreateTagDto = {
    name: values.name.trim(),
    tag_color: fixHex(values.tag_color),
    tag_content: values.tag_content?.trim() ?? '',
  };

  if (mode === 'create') {
    await tagStore.addTag(payload);
  } else {
    const id = Number(route.params.id);
    await tagStore.updateTag(id, payload);
  }
  router.push('/tag/list');
};

// Helpers
const fixHex = (c?: string) => {
  if (!c) return '#999999';
  return c.startsWith('#') ? c : `#${c}`;
};
const colorToPicker = (c?: string) => fixHex(c);

// Điều hướng
const goBack = () => router.push('/tags');
</script>

<style scoped>
.wrap {
  max-width: 600px;
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
input {
  padding: 10px 12px; border: 1px solid #ccc; border-radius: 6px;
  font-size: 1rem; transition: border 0.2s;
}
input:focus { border-color: #228be6; outline: none; }
.color-group { display: flex; gap: 12px; align-items: center; }
.color-group input[type="color"] { width: 48px; height: 36px; padding: 0; border: none; background: none; }
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
