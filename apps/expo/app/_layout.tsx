import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { View, Text } from 'react-native';
import '../global.css';

// Initialize mocks before the app renders
async function initMocks() {
  if (__DEV__ && process.env.EXPO_PUBLIC_USE_MOCKS === 'true') {
    const { startMockServer } = await import('@monorepo/mocks/native');
    await startMockServer();
  }
}

export default function RootLayout() {
  const [isReady, setIsReady] = useState(
    !__DEV__ || process.env.EXPO_PUBLIC_USE_MOCKS !== 'true'
  );

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
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
    </Stack>
  );
}
