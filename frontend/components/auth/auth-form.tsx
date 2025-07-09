'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { useAuth } from '@/context/auth-context';
import { useLanguage } from '@/context/language-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const isDemoUser = formData.email === 'demo@domain.com'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        if (!formData.email) {
          toast.error(t.nameRequired);
          setIsLoading(false);
          return;
        }
        const user = await signUp(formData.email, formData.password);
        if (user) {
          toast.success(t.accountCreatedSuccess);
        } else {
          toast.error(t.failedCreateAccount);
        }
      } else {
        const user = await signIn(formData.email, formData.password);
        if (user) {
          toast.success(t.signedInSuccess);
        } else {
          toast.error(t.invalidCredentials);
        }
      }
    } catch (error) {
      toast.error(t.errorOccurred);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg dark:bg-gray-800">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          {isSignUp ? t.createAccount : t.signInToAccount}
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {isSignUp ? t.alreadyHaveAccount : t.dontHaveAccount}{' '}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="font-medium text-primary hover:text-primary/80 transition-colors"
          >
            {isSignUp ? t.signIn : t.signUp}
          </button>
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {/* 帳號 */}
        <div className="space-y-2">
          <Label htmlFor="email">{t.emailAddress}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder={t.yourEmail}
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        {/*密碼 （demo 不顯示） */}
        {!isDemoUser && (
          <div className="space-y-2">
            <Label htmlFor="password">{t.password}</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder={t.yourPassword}
              value={formData.password}
              onChange={handleChange}
            />
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t.processing}
            </span>
          ) : (
            isSignUp ? t.createAccount : t.signIn
          )}
        </Button>

        {/* Demo Button*/}
        {!isSignUp && (
          <div className="mt-4">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                setFormData({
                  email: 'demo@domain.com',
                  password: 'demopassword',
                });
              }}
            >
              {t.fillDemoCredentials}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}