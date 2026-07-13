const DEFAULT_MAX_SIZE_MB = 5;

export function validatePdfFile(file: File, maxSizeMb = DEFAULT_MAX_SIZE_MB) {
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    return { ok: false, error: 'PDF 파일만 업로드할 수 있습니다.' } as const;
  }

  const maxSizeBytes = maxSizeMb * 1024 * 1024;

  if (file.size > maxSizeBytes) {
    return { ok: false, error: `PDF 파일은 ${maxSizeMb}MB 이하만 업로드할 수 있습니다.` } as const;
  }

  return { ok: true, error: null } as const;
}

export function createTextPreview(text: string, limit = 500) {
  const normalized = text.replace(/\s+/g, ' ').trim();

  if (normalized.length <= limit) {
    return normalized;
  }

  return `${normalized.slice(0, limit).trimEnd()}...`;
}
