// CreateNoteDto
export interface CreateNoteDto {
  title: string;
  content: string;
}

// UpdateNoteDto - optional fields
export interface UpdateNoteDto {
  title?: string;
  content?: string;
}

// Note - entity từ DB
export interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string; // ISO date string
  updatedAt: string;
}
