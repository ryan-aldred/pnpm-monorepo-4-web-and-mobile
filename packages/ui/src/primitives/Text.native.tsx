import { Text as RNText } from 'react-native';
import type { ReactNode } from 'react';

interface TextProps {
  children?: ReactNode;
  className?: string;
}

export function Text({ children, className = '' }: TextProps) {
  return <RNText className={className}>{children}</RNText>;
}
