import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI-StudyMate',
  description: '저장된 과목, 시험일, 학습자료를 바탕으로 오늘의 공부 계획을 먼저 제안하는 AI 학습 도우미 POC',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
