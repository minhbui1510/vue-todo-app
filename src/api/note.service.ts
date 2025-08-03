import axios from 'axios';
import type {CreateNoteDto, Note, UpdateNoteDto} from "@/api/types/note";

const api = axios.create({
  baseURL: 'http://localhost:3000', // hoặc để '' nếu dùng Vite proxy
});

export default {
  async getAllNotes(): Promise<Note[]> {
    const res = await api.get<Note[]>('/notes');
    return res.data;
  },

  async createNote(data: CreateNoteDto): Promise<Note> {
    console.log('[📝 POST] /notes', data);
    const res = await api.post<Note>('/notes', data);
    return res.data;
  },

  async updateNote(id: number, data: UpdateNoteDto): Promise<Note> {
    console.log(`[🔁 PATCH] /notes/${id}`, data);
    const res = await api.patch<Note>(`/notes/${id}`, data);
    return res.data;
  },

  async deleteNote(id: number): Promise<void> {
    console.log(`[❌ DELETE] /notes/${id}`);
    await api.delete(`/notes/${id}`);
  },
};
