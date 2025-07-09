'use client';

import { ThemeProvider } from 'next-themes';
import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';

import { LanguageProvider } from '@/context/language-context';
import { AuthProvider } from '@/context/auth-context';

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <LanguageProvider>
          <Toaster position="top-right" />
          {children}
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}