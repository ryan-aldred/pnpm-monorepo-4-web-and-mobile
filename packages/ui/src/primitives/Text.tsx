import type { ReactNode } from 'react';

interface TextProps {
  children?: ReactNode;
  className?: string;
}

export function Text({ children, className = '' }: TextProps) {
  return <span className={className}>{children}</span>;
}
