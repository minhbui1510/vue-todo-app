import { defineStore } from 'pinia';
import type { Tag, CreateTagDto, UpdateTagDto } from '@/api/types/tag';
import tagService from "@/api/tag.service.ts";

export const useTagStore = defineStore('tag', {
  state: () => ({
    tags: [] as Tag[],
    loading: false,
    error: '' as string | null,
  }),

  actions: {
    async fetchTags() {
      this.loading = true;
      try {
        this.tags = await tagService.getAllTags();
      } catch (err) {
        this.error = 'Lỗi khi tải thẻ';
      } finally {
        this.loading = false;
      }
    },

    async addTag(data: CreateTagDto) {
      const created = await tagService.createTag(data);
      this.tags.unshift(created);
    },

    async updateTag(id: number, data: UpdateTagDto) {
      const updated = await tagService.updateTag(id, data);
      const index = this.tags.findIndex(t => t.id === id);
      if (index !== -1) this.tags[index] = updated;
    },

    async deleteTag(id: number) {
      await tagService.deleteTag(id);
      this.tags = this.tags.filter(t => t.id !== id);
    },
  },
});
