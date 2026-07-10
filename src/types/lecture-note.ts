export interface LectureNote {
  id: string;
  title: string;
  lecture_text: string;
  created_at: string;
}

export interface LectureNoteInsert {
  title: string;
  lecture_text: string;
}
