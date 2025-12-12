import type { ReactNode } from 'react';

interface ViewProps {
  children?: ReactNode;
  className?: string;
}

export function View({ children, className = '' }: ViewProps) {
  return <div className={className}>{children}</div>;
}
