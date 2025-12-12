import { View as RNView } from 'react-native';
import type { ReactNode } from 'react';

interface ViewProps {
  children?: ReactNode;
  className?: string;
}

export function View({ children, className = '' }: ViewProps) {
  return <RNView className={className}>{children}</RNView>;
}
