// CreateNoteDto
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
}
