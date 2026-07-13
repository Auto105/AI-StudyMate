import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <section
      className={`rounded-[28px] border border-slate-900/10 bg-white/85 p-6 shadow-[0_18px_40px_rgba(20,33,61,0.08)] backdrop-blur md:p-7 ${className}`}
    >
      {children}
    </section>
  );
}
