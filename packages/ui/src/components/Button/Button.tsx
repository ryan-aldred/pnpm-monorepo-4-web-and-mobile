import clsx from 'clsx';
import type { ButtonProps } from './types';

export function Button({
  children,
  onPress,
  className,
  disabled = false,
  variant = 'primary',
}: ButtonProps) {
  const baseStyles =
    'px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-500 text-white hover:bg-gray-600',
    outline:
      'border-2 border-blue-500 text-blue-500 hover:bg-blue-50 bg-transparent',
  };

  return (
    <button
      onClick={onPress}
      disabled={disabled}
      className={clsx(baseStyles, variantStyles[variant], className)}
    >
      {children}
    </button>
  );
}
