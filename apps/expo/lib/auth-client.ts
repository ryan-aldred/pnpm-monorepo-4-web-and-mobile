import { createAuthClient } from 'better-auth/react';
import { expoClient } from '@better-auth/expo/client';
import * as SecureStore from 'expo-secure-store';
import { getApiBaseUrl } from '@monorepo/core';

export const authClient = createAuthClient({
  baseURL: getApiBaseUrl(),
  plugins: [
    expoClient({
      scheme: 'monorepo',
      storagePrefix: 'monorepo-auth',
      storage: SecureStore,
    }),
  ],
});

export const { signIn, signUp, signOut, useSession } = authClient;
