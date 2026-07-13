const EMPTY_TEXT_ERROR = 'PDF에서 텍스트를 추출하지 못했습니다.';

export async function extractTextFromPdfFile(file: File) {
  const pdfParse = (await import('pdf-parse')).default;
  const arrayBuffer = await file.arrayBuffer();
  const data = await pdfParse(Buffer.from(arrayBuffer));
  const text = data.text.trim();

  if (!text) {
    throw new Error(EMPTY_TEXT_ERROR);
  }

  return text;
}
