'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { AuthForm } from '@/components/custom/auth-form';
import { TurkishAirlinesLogo } from '@/components/custom/icons';
import { LanguageSelector } from '@/components/custom/language-selector';
import { SubmitButton } from '@/components/custom/submit-button';
import { ThemeSelector } from '@/components/custom/theme-selector';

import { login, LoginActionState } from '../actions';

export default function Page() {
  const { t } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [state, formAction] = useActionState<LoginActionState, FormData>(
    login,
    {
      status: 'idle',
    }
  );

  useEffect(() => {
    if (state.status === 'failed') {
      toast.error(t('login.error.invalidCredentials'));
    } else if (state.status === 'invalid_data') {
      toast.error(t('login.error.invalidData'));
    } else if (state.status === 'success') {
      setIsSuccessful(true);
      router.refresh();
    }
  }, [state.status, router, t]);

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get('email') as string);
    formAction(formData);
  };

  return (
    <div className="min-h-dvh bg-background">
      <div className="min-h-dvh">
        <div className="container mx-auto flex min-h-dvh flex-col items-center justify-center px-4">
          <div className="fixed inset-x-0 top-0 flex items-center justify-between border-b bg-background/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-2">
              <TurkishAirlinesLogo />
            </div>
            <div className="flex items-center gap-2">
              <ThemeSelector />
              <LanguageSelector className="border bg-background hover:bg-accent" />
            </div>
          </div>

          <div className="w-full max-w-md rounded-lg border bg-card p-8 shadow-sm">
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-2xl font-bold text-foreground">
                {t('login.form.signIn')}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t('login.form.signInTitle')}
              </p>
            </div>
            <AuthForm action={handleSubmit} defaultEmail={email}>
              <SubmitButton isSuccessful={isSuccessful}>
                {t('login.form.signIn')}
              </SubmitButton>

              <p className="mt-4 text-center text-sm text-muted-foreground">
                {t('login.form.signUpPrompt')}{' '}
                <Link
                  href="/register"
                  className="font-semibold text-primary hover:text-primary/90"
                >
                  {t('login.form.signUpCta')}
                </Link>
                {t('login.form.signInCtaContent')}
              </p>
            </AuthForm>
          </div>
        </div>
      </div>
    </div>
  );
}
