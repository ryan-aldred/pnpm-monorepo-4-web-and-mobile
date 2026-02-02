import type { ReactNode } from 'react';
import { Label } from './label';
import { useI18n } from '~/i18n';
import { cn } from '~/lib/utils';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
  className?: string;
}

export function FormField({
  label,
  htmlFor,
  error,
  children,
  className,
}: FormFieldProps) {
  const i18n = useI18n();

  const translatedError = error ? i18n._(error) : undefined;

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {translatedError && (
        <p className="text-sm text-destructive">{translatedError}</p>
      )}
    </div>
  );
}
