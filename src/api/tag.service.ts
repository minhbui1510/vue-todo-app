import http from '@/api/http';
import type { CreateTagDto, UpdateTagDto, Tag } from '@/api/types/tag';

export default {
  async getAllTags(): Promise<Tag[]> {
    const res = await http.get<Tag[]>('/tags');
    return res.data.data;
  },

  async createTag(data: CreateTagDto): Promise<Tag> {
    console.log('[🏷️ POST] /tags', data);
    const res = await http.post<Tag>('/tags', data);
    return res.data;
  },

  async updateTag(id: number, data: UpdateTagDto): Promise<Tag> {
    console.log(`[🔁 PATCH] /tags/${id}`, data);
    const res = await http.put<Tag>(`/tags/${id}`, data);
    return res.data;
  },

  async deleteTag(id: number): Promise<void> {
    console.log(`[❌ DELETE] /tags/${id}`);
    await http.delete(`/tags/${id}`);
  },
};
