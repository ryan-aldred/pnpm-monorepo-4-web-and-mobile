import { Pressable, Text } from 'react-native';
import clsx from 'clsx';
import type { ButtonProps } from './types';

export function Button({
  children,
  onPress,
  className,
  disabled = false,
  variant = 'primary',
}: ButtonProps) {
  const baseStyles = 'px-4 py-3 rounded-lg items-center justify-center';

  const variantStyles = {
    primary: 'bg-blue-500',
    secondary: 'bg-gray-500',
    outline: 'border-2 border-blue-500 bg-transparent',
  };

  const textStyles = {
    primary: 'text-white font-semibold',
    secondary: 'text-white font-semibold',
    outline: 'text-blue-500 font-semibold',
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={clsx(baseStyles, variantStyles[variant], className, {
        'opacity-50': disabled,
      })}
    >
      <Text className={textStyles[variant]}>{children}</Text>
    </Pressable>
  );
}
