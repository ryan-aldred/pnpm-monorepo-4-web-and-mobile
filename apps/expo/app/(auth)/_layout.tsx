import { View } from 'react-native';
import { Stack } from 'expo-router';
import { useTheme } from '../../lib/theme';
import { ThemeToggle } from '../../lib/components/ThemeToggle';
import { HeaderLanguageButton } from '../../lib/components/HeaderLanguageButton';
import { ExpoErrorBoundary } from '../../lib/components/ExpoErrorBoundary';

export { ExpoErrorBoundary as ErrorBoundary };

export default function AuthLayout() {
  const { isDark } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: isDark ? '#1a1a2e' : '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerRight: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <ThemeToggle />
            <HeaderLanguageButton />
          </View>
        ),
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          title: 'Login',
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          title: 'Register',
        }}
      />
    </Stack>
  );
}
