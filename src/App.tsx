import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { supabase } from './lib/supabase';
import type { LectureNote, LectureNoteInsert } from './types/lecture-note';

const initialFormState: LectureNoteInsert = {
  title: '',
  lecture_text: '',
};

function formatCreatedAt(createdAt: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(createdAt));
}

export default function App() {
  const [formState, setFormState] = useState<LectureNoteInsert>(initialFormState);
  const [notes, setNotes] = useState<LectureNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    void fetchLectureNotes();
  }, []);

  async function fetchLectureNotes() {
    // Initial list load keeps the recent notes section in sync with the database.
    setIsLoading(true);
    setErrorMessage(null);

    const { data, error } = await supabase
      .from('lecture_notes')
      .select('id, title, lecture_text, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      setErrorMessage('강의 목록을 불러오지 못했습니다. Supabase 연결 설정을 확인해주세요.');
      setIsLoading(false);
      return;
    }

    setNotes((data ?? []) as LectureNote[]);
    setIsLoading(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const title = formState.title.trim();
    const lectureText = formState.lecture_text.trim();

    if (!title || !lectureText) {
      setErrorMessage('강의 제목과 내용을 모두 입력해주세요.');
      setSuccessMessage(null);
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const payload: LectureNoteInsert = {
      title,
      lecture_text: lectureText,
    };

    // Select the inserted row immediately so the UI can prepend it without refetching.
    const { data, error } = await supabase
      .from('lecture_notes')
      .insert(payload)
      .select('id, title, lecture_text, created_at')
      .single();

    if (error) {
      setErrorMessage('강의 노트를 저장하지 못했습니다. Supabase 테이블 설정을 확인해주세요.');
      setIsSaving(false);
      return;
    }

    setNotes((currentNotes) => (data ? [data as LectureNote, ...currentNotes] : currentNotes));
    setFormState(initialFormState);
    setSuccessMessage('강의 노트가 저장되었습니다.');
    setIsSaving(false);
  }

  async function handleDelete(noteId: string) {
    const shouldDelete = window.confirm('이 강의 노트를 삭제할까요?');

    if (!shouldDelete) {
      return;
    }

    setDeletingNoteId(noteId);
    setErrorMessage(null);
    setSuccessMessage(null);

    const { data, error } = await supabase
      .from('lecture_notes')
      .delete()
      .eq('id', noteId)
      .select('id')
      .maybeSingle();

    if (error) {
      setErrorMessage('강의 노트를 삭제하지 못했습니다. Supabase 권한 정책을 확인해주세요.');
      setDeletingNoteId(null);
      return;
    }

    if (!data) {
      setErrorMessage('강의 노트가 실제로 삭제되지 않았습니다. Supabase 삭제 정책을 다시 확인해주세요.');
      setDeletingNoteId(null);
      return;
    }

    await fetchLectureNotes();
    setSuccessMessage('강의 노트가 삭제되었습니다.');
    setDeletingNoteId(null);
  }

  return (
    <div className="app-shell">
      <main className="app-container">
        <section className="hero">
          <p className="eyebrow">StudySync AI</p>
          <h1>강의 노트를 저장하고 최근 기록을 바로 확인해보세요.</h1>
          <p className="hero-copy">
            이번 MVP는 강의 제목과 내용을 Supabase에 저장하고, 저장된 노트를 최신순으로
            조회하는 핵심 흐름에 집중합니다.
          </p>
        </section>

        <section className="panel">
          <div className="section-heading">
            <h2>강의 노트 입력</h2>
            <p>향후 PDF/PPT 업로드와 AI 요약 기능을 확장하기 쉽도록 기본 데이터 구조를 유지합니다.</p>
          </div>

          <form className="note-form" onSubmit={handleSubmit}>
            <label className="field">
              <span>강의 제목</span>
              <input
                type="text"
                name="title"
                placeholder="예: 운영체제 3주차"
                value={formState.title}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, title: event.target.value }))
                }
              />
            </label>

            <label className="field">
              <span>강의 내용</span>
              <textarea
                name="lecture_text"
                rows={8}
                placeholder="강의 핵심 내용을 입력하세요."
                value={formState.lecture_text}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    lecture_text: event.target.value,
                  }))
                }
              />
            </label>

            <div className="form-footer">
              <button type="submit" className="save-button" disabled={isSaving}>
                {isSaving ? '저장 중...' : '저장'}
              </button>
              {errorMessage ? <p className="status error">{errorMessage}</p> : null}
              {successMessage ? <p className="status success">{successMessage}</p> : null}
            </div>
          </form>
        </section>

        <section className="panel">
          <div className="section-heading">
            <h2>저장된 강의 목록</h2>
            <p>Supabase의 `lecture_notes` 테이블에서 최신순으로 데이터를 불러옵니다.</p>
          </div>

          {isLoading ? <p className="empty-state">강의 목록을 불러오는 중입니다...</p> : null}

          {!isLoading && notes.length === 0 ? (
            <p className="empty-state">아직 저장된 강의 노트가 없습니다.</p>
          ) : null}

          <div className="note-grid">
            {notes.map((note) => (
              <article key={note.id} className="note-card">
                <div className="note-card-header">
                  <h3>{note.title}</h3>
                  <time dateTime={note.created_at}>{formatCreatedAt(note.created_at)}</time>
                </div>
                <div className="note-card-footer">
                  <button
                    type="button"
                    className="delete-button"
                    disabled={deletingNoteId === note.id}
                    onClick={() => void handleDelete(note.id)}
                  >
                    {deletingNoteId === note.id ? '삭제 중...' : '삭제'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
