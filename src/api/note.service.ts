import http from '@/api/http'; // hoặc đường dẫn đúng với file bạn cấu hình interceptor
import type {
  CreateNoteDto,
  Note,
  SearchNoteDto,
  SearchNoteResponse,
  UpdateNoteDto
} from "@/api/types/note";

export default {
  async getAllNotes(): Promise<Note[]> {
    const res = await http.get<Note[]>('/notes');
    return res.data.data;
  },

  async searchNote(search: SearchNoteDto): Promise<SearchNoteResponse[]> {
    const res = await http.post<SearchNoteResponse>('/notes/search', search);
    return res.data;
  },

  async createNote(data: CreateNoteDto): Promise<Note> {
    console.log('[📝 POST] /notes', data);
    const res = await http.post<Note>('/notes', data);
    return res.data;
  },

  async updateNote(id: number, data: UpdateNoteDto): Promise<Note> {
    console.log(`[🔁 PATCH] /notes/${id}`, data);
    const res = await http.put<Note>(`/notes/${id}`, data);
    return res.data;
  },

  async deleteNote(id: number): Promise<void> {
    console.log(`[❌ DELETE] /notes/${id}`);
    await http.delete(`/notes/${id}`);
  },
};
