import { useRouter } from 'expo-router';
import {
  HStack,
  Text,
  Pressable,
} from '@gluestack-ui/themed';
import { useSession, signOut } from '../auth-client';

export function HeaderAuthButton() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  if (isPending) {
    return null;
  }

  if (session) {
    return (
      <HStack space="sm" alignItems="center">
        <Text color="$white" fontSize="$sm">
          {session.user.name}
        </Text>
        <Pressable
          onPress={() => signOut()}
          px="$3"
          py="$1.5"
        >
          <Text color="$white" fontSize="$sm" fontWeight="$medium">
            Sign out
          </Text>
        </Pressable>
      </HStack>
    );
  }

  return (
    <Pressable
      onPress={() => router.push('/(auth)/login' as never)}
      px="$3"
      py="$1.5"
    >
      <Text color="$white" fontSize="$sm" fontWeight="$medium">
        Sign in
      </Text>
    </Pressable>
  );
}
