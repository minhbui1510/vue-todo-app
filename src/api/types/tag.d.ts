export interface CreateTagDto {
  name: string;
  tag_color: string;
  tag_content: string;
}
export interface UpdateTagDto {
  name?: string;
  tag_color?: string;
  tag_content?: string;
}
export interface Tag {
  id: number;
  name: string;
  tag_color: string;
  tag_content: string;
  createdAt: string; // ISO date
}
