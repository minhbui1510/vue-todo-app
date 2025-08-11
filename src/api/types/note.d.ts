// CreateNoteDto
import type {Tag} from "@/api/types/tag";

export interface CreateNoteDto {
  title: string;
  content: string;
  tagsId: number[];
}

// UpdateNoteDto - optional fields
export interface UpdateNoteDto {
  title?: string;
  content?: string;
  tagsId: number[];
}

// Note - entity từ DB
export interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string; // ISO date string
  updatedAt: string;
  tag: Tag[]
}
export interface SearchNoteDto {
  keyword: string;
  pageIndex: number;
  pageSize: number;
}

export interface SearchNoteResponse {
  items: Note[];
  pageIndex: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
