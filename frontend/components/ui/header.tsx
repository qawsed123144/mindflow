'use client';

import { User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { useTheme } from 'next-themes';
import { useLanguage } from '@/context/language-context';
import { MoonIcon, SunIcon, LanguagesIcon } from 'lucide-react';

interface HeaderProps {
  user: User;
}

export function Header({ user }: HeaderProps) {
  const { signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'zh' ? 'en' : 'zh');
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold">MindFlow</h1>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            className="h-9 w-9"
          >
            <LanguagesIcon className="h-4 w-4" />
            <span className="sr-only">
              {language === 'zh' ? '切換語言' : 'Toggle language'}
            </span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9"
          >
            <SunIcon className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">{t.toggleTheme}</span>
          </Button>

          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.image} alt={user.email} />
              <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium hidden sm:inline-block">{user.email}</span>
          </div>

          <Button variant="outline" size="sm" onClick={signOut}>
            {t.signOut}
          </Button>
        </div>
      </div>
    </header>
  );
}