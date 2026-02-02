import { Text } from '@gluestack-ui/themed';
import { useLingui } from '@lingui/react';

interface FormFieldErrorProps {
  error?: string;
}

export function FormFieldError({ error }: FormFieldErrorProps) {
  const { i18n } = useLingui();

  if (!error) return null;

  const translatedError = i18n._(error);

  return (
    <Text color="$error500" size="sm" mt="$1">
      {translatedError}
    </Text>
  );
}
