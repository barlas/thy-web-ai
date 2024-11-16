'use client';

import Form from 'next/form';
import { useTranslation } from 'react-i18next';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function AuthForm({
  action,
  children,
  defaultEmail = '',
}: {
  action: any;
  children: React.ReactNode;
  defaultEmail?: string;
}) {
  const { t } = useTranslation();
  
  return (
    <Form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="email"
          className="text-sm font-medium"
        >
          {t('login.form.email')}
        </Label>

        <Input
          id="email"
          name="email"
          className="h-11 border border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
          type="email"
          placeholder="user@acme.com"
          autoComplete="email"
          required
          autoFocus
          defaultValue={defaultEmail}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label
          htmlFor="password"
          className="text-sm font-medium"
        >
          {t('login.form.password')}
        </Label>

        <Input
          id="password"
          name="password"
          className="h-11 border border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
          type="password"
          required
        />
      </div>

      {children}
    </Form>
  );
}