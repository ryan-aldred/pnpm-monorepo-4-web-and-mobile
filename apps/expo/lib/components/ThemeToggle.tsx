import { Pressable, Icon } from '@gluestack-ui/themed';
import { Sun, Moon } from 'lucide-react-native';
import { useLingui } from '@lingui/react';
import { useTheme } from '../theme';

export function ThemeToggle() {
  const { i18n } = useLingui();
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Pressable
      onPress={toggleTheme}
      bg="$white"
      opacity={0.9}
      p="$2"
      borderRadius="$full"
      accessibilityLabel={
        resolvedTheme === 'dark'
          ? i18n._('Switch to light mode')
          : i18n._('Switch to dark mode')
      }
    >
      <Icon
        as={resolvedTheme === 'dark' ? Sun : Moon}
        size="sm"
        color="$primary600"
      />
    </Pressable>
  );
}
