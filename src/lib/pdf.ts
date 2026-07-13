const DEFAULT_MAX_SIZE_MB = 5;

export const PDF_UPLOAD_ERRORS = {
  empty: '빈 파일은 업로드할 수 없습니다.',
  type: 'PDF 파일만 업로드할 수 있습니다.',
  size: 'PDF 파일은 5MB 이하만 업로드할 수 있습니다.',
  invalid: '올바른 PDF 파일이 아닙니다.',
} as const;

export type PdfValidationResult = { valid: true } | { valid: false; error: string };

export async function validatePdfFile(
  file: File,
  maxSizeMb = DEFAULT_MAX_SIZE_MB,
): Promise<PdfValidationResult> {
  if (file.size === 0) {
    return { valid: false, error: PDF_UPLOAD_ERRORS.empty };
  }

  const hasPdfExtension = file.name.toLowerCase().endsWith('.pdf');
  const hasPdfMimeType = file.type === 'application/pdf';

  if (!hasPdfExtension || !hasPdfMimeType) {
    return { valid: false, error: PDF_UPLOAD_ERRORS.type };
  }

  const maxSizeBytes = maxSizeMb * 1024 * 1024;

  if (file.size > maxSizeBytes) {
    return { valid: false, error: PDF_UPLOAD_ERRORS.size };
  }

  const bytes = new Uint8Array(await file.slice(0, 5).arrayBuffer());
  const signature = new TextDecoder().decode(bytes);

  if (signature !== '%PDF-') {
    return { valid: false, error: PDF_UPLOAD_ERRORS.invalid };
  }

  return { valid: true };
}

export function createTextPreview(text: string, limit = 500) {
  const normalized = text.replace(/\s+/g, ' ').trim();

  if (normalized.length <= limit) {
    return normalized;
  }

  return `${normalized.slice(0, limit).trimEnd()}...`;
}
