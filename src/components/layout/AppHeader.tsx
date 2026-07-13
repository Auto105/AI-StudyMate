export function AppHeader() {
  return (
    <header className="rounded-[32px] border border-slate-900/10 bg-white/85 p-6 shadow-[0_18px_40px_rgba(20,33,61,0.08)] backdrop-blur md:p-8">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
        AI-StudyMate POC
      </p>
      <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-slate-950 md:text-5xl">
            앱을 열면 오늘 공부할 것을 먼저 제안합니다.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            저장된 과목, 시험일, 학습자료를 바탕으로 학습 우선순위를 제안하는 대학생용 AI 학습 도우미입니다.
            이번 버전은 팀 병렬 개발을 위한 UI, 타입, Mock API 계약을 정리합니다.
          </p>
        </div>
        <div className="rounded-2xl bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-800">
          Mock API mode
        </div>
      </div>
    </header>
  );
}
