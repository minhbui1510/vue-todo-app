<template>
  <div class="">
    <div class="header">
      <h2>🏷️ Danh sách Thẻ</h2>
      <button class="primary" @click="goCreate">➕ Thêm mới</button>
    </div>

    <p v-if="tagStore.loading">Đang tải thẻ...</p>
    <p v-else-if="!tagStore.tags.length">Chưa có thẻ nào.</p>

    <ul v-else class="grid grid-cols-auto gap-3 ">
      <li
        v-for="tag in tagStore.tags"
        :key="tag.id"
        class="tag-item"
        :style="{
          backgroundColor: fixHex(tag.tag_color),
          color: getTextColor(tag.tag_color)
        }"
      >
        <div class="tag-info">
          <strong>{{ tag.name }}</strong>
          <small v-if="tag.tag_content">— {{ tag.tag_content }}</small>
        </div>

        <div class="actions">
          <button @click="goEdit(tag.id)">✏️ Sửa</button>
          <button class="danger" @click="onDelete(tag.id)">🗑️ Xoá</button>
        </div>
      </li>
    </ul>

    <p v-if="tagStore.error" class="err">{{ tagStore.error }}</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTagStore } from '@/stores/tagStore';

const router = useRouter();
const tagStore = useTagStore();

onMounted(() => {
  // chỉ fetch lần đầu, tuỳ nhu cầu có thể bỏ điều kiện
  if (!tagStore.tags.length) tagStore.fetchTags();
});

const goCreate = () => {
  router.push({ name: 'tag-create' });
};
const goEdit = (id: number) => {
  router.push({name: 'tag-edit', params: {id}});
};
const onDelete = async (id: number) => {
  if (!confirm('Bạn có chắc chắn muốn xoá thẻ này?')) return;
  await tagStore.deleteTag(id);
};

// Helpers màu
const fixHex = (color?: string) => {
  if (!color) return '#cccccc';
  return color.startsWith('#') ? color : `#${color}`;
};
const getTextColor = (hex?: string): string => {
  if (!hex) return '#000';
  const fixed = fixHex(hex).slice(1);
  if (!/^[0-9a-fA-F]{6}$/.test(fixed)) return '#000';
  const r = parseInt(fixed.substring(0, 2), 16);
  const g = parseInt(fixed.substring(2, 4), 16);
  const b = parseInt(fixed.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 150 ? '#000' : '#fff';
};
</script>

<style scoped>
.header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 12px;
}
.primary { background: #228be6; color: #fff; border: none; padding: 8px 12px; border-radius: 8px; cursor: pointer; }
.tag-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 12px; margin-bottom: 8px; border-radius: 10px;
}
.tag-info small { opacity: 0.9; margin-left: 6px; }
.actions { display: flex; gap: 8px; }
button { padding: 6px 10px; border-radius: 6px; border: none; cursor: pointer; }
button.danger { background: #e03131; color: #fff; }
.err { color: #e03131; margin-top: 8px; }
</style>
