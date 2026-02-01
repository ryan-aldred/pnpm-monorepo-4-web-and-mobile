import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { View, Text } from 'react-native';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';
import { useSession } from '../lib/auth-client';
import { I18nProvider } from '../lib/i18n';
import { HeaderLanguageButton } from '../lib/components/HeaderLanguageButton';
import { HeaderAuthButton } from '../lib/components/HeaderAuthButton';
import '../global.css';

// Initialize mocks before the app renders
async function initMocks() {
  if (__DEV__ && process.env.EXPO_PUBLIC_USE_MOCKS === 'true') {
    const { startMockServer } = await import('@monorepo/mocks/native');
    await startMockServer();
  }
}

function useProtectedRoute() {
  const segments = useSegments();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (isPending) return;

    const inAuthGroup = segments[0] === ('(auth)' as any);

    if (!session && !inAuthGroup) {
      // Redirect to login if not authenticated and not on auth screens
      router.replace('/(auth)/login' as any);
    } else if (session && inAuthGroup) {
      // Redirect to home if authenticated and on auth screens
      router.replace('/');
    }
  }, [session, segments, isPending, router]);
}

export default function RootLayout() {
  const [isReady, setIsReady] = useState(
    !__DEV__ || process.env.EXPO_PUBLIC_USE_MOCKS !== 'true'
  );

  useProtectedRoute();

  useEffect(() => {
    if (!isReady) {
      initMocks().then(() => setIsReady(true));
    }
  }, [isReady]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Starting mock server...</Text>
      </View>
    );
  }

  return (
    <GluestackUIProvider config={config}>
      <I18nProvider>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#f4511e',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerRight: () => (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <HeaderAuthButton />
                <HeaderLanguageButton />
              </View>
            ),
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              title: 'Home',
            }}
          />
          <Stack.Screen
            name="(auth)"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </I18nProvider>
    </GluestackUIProvider>
  );
}
