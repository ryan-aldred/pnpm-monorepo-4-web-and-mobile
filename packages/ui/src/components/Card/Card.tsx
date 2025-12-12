import { View } from '../../primitives';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <View className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      {children}
    </View>
  );
}
