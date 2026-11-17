"use client";

/** Mantido só por compatibilidade — o módulo não clona mais o shell do Aptus. */
export function AptusShell({ children }: { children: React.ReactNode; crumb?: string; sky?: boolean }) {
  return <>{children}</>;
}
