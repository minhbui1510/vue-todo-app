import http from '@/api/http'; // hoặc đường dẫn đúng với file bạn cấu hình interceptor
import type { CreateNoteDto, Note, UpdateNoteDto } from "@/api/types/note";

export default {
  async getAllNotes(): Promise<Note[]> {
    const res = await http.get<Note[]>('/notes');
    return res.data.data;
  },

  async createNote(data: CreateNoteDto): Promise<Note> {
    console.log('[📝 POST] /notes', data);
    const res = await http.post<Note>('/notes', data);
    return res.data;
  },

  async updateNote(id: number, data: UpdateNoteDto): Promise<Note> {
    console.log(`[🔁 PATCH] /notes/${id}`, data);
    const res = await http.patch<Note>(`/notes/${id}`, data);
    return res.data;
  },

  async deleteNote(id: number): Promise<void> {
    console.log(`[❌ DELETE] /notes/${id}`);
    await http.delete(`/notes/${id}`);
  },
};
