import {defineStore} from 'pinia';
import type {
  CreateNoteDto,
  Note,
  SearchNoteDto,
  SearchNoteResponse,
  UpdateNoteDto
} from '@/api/types/note';
import noteService from '@/api/note.service.ts';
import {normalizeError} from '@/api/http.ts';
import {useCenterModalStore} from "@/stores/center-modal.store.ts";

export const useNoteStore = defineStore('note', {
  state: () => ({
    notes: [] as Note[],
    notesList: {} as SearchNoteResponse,
    loading: false,
    error: '' as string | null,
  }),

  actions: {
    async fetchNotes() {
      this.loading = true;
      try {
        this.notes = await noteService.getAllNotes();
        console.log(this.notes)
      } catch (err) {
        this.error = 'Lỗi khi tải ghi chú';
        normalizeError(err)
      } finally {
        this.loading = false;
      }
    },

    async searchNote(search: SearchNoteDto) {
      this.loading = true;
      try {
        this.notesList = await noteService.searchNote(search);
      } catch (err) {
        this.error = 'Lỗi khi tải ghi chú';
        normalizeError(err)
      } finally {
        this.loading = false;
      }
    },

    async addNote(newNote: CreateNoteDto) {
      try {
        const created = await noteService.createNote(newNote);
        this.notes?.unshift(created); // thêm vào đầu danh sách
      } catch (err) {
        normalizeError(err);
      }
    },

    async updateNote(id: number, data: UpdateNoteDto) {
      try {
        const updated = await noteService.updateNote(id, data);
        const idx = this.notes.findIndex(n => n.id === id);
        if (idx !== -1) this.notes[idx] = updated;
      } catch (err) {
        normalizeError(err);
      }
    },

    async deleteNote(id: number) {
      try {
        await noteService.deleteNote(id);
        this.notes = this.notes.filter(n => n.id !== id);
      } catch (err) {
        normalizeError(err);
      }
    },
  }
});
