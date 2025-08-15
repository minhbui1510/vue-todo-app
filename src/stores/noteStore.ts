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
import {useToast} from "@/components/UI/toast/useToast.ts";

const cm = useCenterModalStore();
export const useNoteStore = defineStore('note', {
  state: () => ({
    notes: [] as Note[],
    notesList: {} as SearchNoteResponse,
    loading: false,
    error: '' as string | null,
  }),

  actions: {
    async fetchNotes() {
      const {toast} = useToast();
      this.loading = true;
      cm.startLoading('Đang lấy dữ liệu');
      try {
        this.notes = await noteService.getAllNotes();
        toast.success('Đã lưu thành công!', {duration: 2000});
      } catch (err) {
        this.error = 'Lỗi khi tải ghi chú';
        normalizeError(err)
      } finally {
        this.loading = false;
        cm.stopLoading();
      }
    },

    async searchNote(search: SearchNoteDto) {
      const {toast} = useToast();
      this.loading = true;
      cm.startLoading('Đang lấy dữ liệu');
      try {
        this.notesList = await noteService.searchNote(search);
        toast.success('Đã lưu thành công!', {duration: 2000});
      } catch (err) {
        this.error = 'Lỗi khi tải ghi chú';
        normalizeError(err)
      } finally {
        this.loading = false;
        cm.stopLoading();
      }
    },

    async addNote(newNote: CreateNoteDto) {
      cm.startLoading('Đang lưu');
      try {
        const created = await noteService.createNote(newNote);
        this.notes?.unshift(created); // thêm vào đầu danh sách
      } catch (err) {
        normalizeError(err);
      } finally {
        cm.stopLoading();

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
