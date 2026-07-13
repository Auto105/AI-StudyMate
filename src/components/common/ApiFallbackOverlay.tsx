interface ApiFallbackOverlayProps {
  isVisible: boolean;
  onRetry: () => void;
}

export function ApiFallbackOverlay({ isVisible, onRetry }: ApiFallbackOverlayProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#f3f4f6]/40 p-6">
      <div className="flex w-full max-w-sm flex-col items-center rounded-2xl border border-[#c3c6d7] bg-white p-8 text-center shadow-sm">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#ffdad6] text-[#ba1a1a]">
          <span className="material-symbols-outlined text-3xl">error</span>
        </div>
        <h3 className="mb-2 text-xl font-bold leading-snug text-[#191b23]">데이터를 불러오지 못했어요.</h3>
        <p className="mb-8 text-sm leading-relaxed text-[#434655]">
          네트워크 연결이 불안정하거나 서버에 문제가 발생했습니다. 데모 데이터로 흐름을 이어갑니다.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#2563eb] py-3 text-sm font-medium text-white shadow-sm transition hover:opacity-90"
        >
          <span className="material-symbols-outlined text-sm">refresh</span>
          다시 시도하기
        </button>
      </div>
    </div>
  );
}
