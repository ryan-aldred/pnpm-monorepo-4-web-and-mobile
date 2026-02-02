import { ScrollView } from 'react-native';
import {
  Box,
  VStack,
  Text,
  Heading,
  Button,
  ButtonText,
  ButtonIcon,
  Pressable,
  HStack,
} from '@gluestack-ui/themed';
import {
  AlertTriangle,
  RefreshCw,
  Home,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';
import { useLingui } from '@lingui/react';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from '../theme';

interface ErrorFallbackScreenProps {
  error: Error;
  resetError?: () => void;
}

export function ErrorFallbackScreen({
  error,
  resetError,
}: ErrorFallbackScreenProps) {
  const { i18n } = useLingui();
  const { isDark } = useTheme();
  const router = useRouter();
  const [showDetails, setShowDetails] = useState(false);

  const handleTryAgain = () => {
    if (resetError) {
      resetError();
    }
  };

  const handleGoHome = () => {
    if (resetError) {
      resetError();
    }
    router.replace('/');
  };

  const bgColor = isDark ? '$backgroundDark900' : '$backgroundLight0';
  const cardBgColor = isDark ? '$backgroundDark800' : '$white';
  const textColor = isDark ? '$textLight0' : '$textDark900';
  const mutedTextColor = isDark ? '$textLight400' : '$textDark500';
  const errorBgColor = isDark ? '$error900' : '$error50';
  const detailsBgColor = isDark ? '$backgroundDark700' : '$backgroundLight100';

  return (
    <Box
      flex={1}
      bg={bgColor}
      justifyContent="center"
      alignItems="center"
      p="$4"
    >
      <Box
        bg={cardBgColor}
        borderRadius="$2xl"
        p="$6"
        w="$full"
        maxWidth={400}
        shadowColor="$black"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.1}
        shadowRadius={8}
        elevation={5}
      >
        <VStack space="md" alignItems="center">
          <Box bg={errorBgColor} p="$4" borderRadius="$full">
            <AlertTriangle size={32} color={isDark ? '#fca5a5' : '#dc2626'} />
          </Box>

          <Heading size="xl" color={textColor} textAlign="center">
            {i18n._('error.unexpected.title')}
          </Heading>

          <Text color={mutedTextColor} textAlign="center">
            {i18n._('error.unexpected.message')}
          </Text>

          {__DEV__ && (
            <Box w="$full" mt="$2">
              <Pressable
                onPress={() => setShowDetails(!showDetails)}
                flexDirection="row"
                alignItems="center"
                justifyContent="center"
              >
                <HStack space="xs" alignItems="center">
                  {showDetails ? (
                    <ChevronUp
                      size={16}
                      color={isDark ? '#9ca3af' : '#6b7280'}
                    />
                  ) : (
                    <ChevronDown
                      size={16}
                      color={isDark ? '#9ca3af' : '#6b7280'}
                    />
                  )}
                  <Text size="sm" color={mutedTextColor}>
                    {i18n._('error.details.title')}
                  </Text>
                </HStack>
              </Pressable>

              {showDetails && (
                <Box
                  mt="$3"
                  p="$3"
                  bg={detailsBgColor}
                  borderRadius="$md"
                  maxHeight={150}
                >
                  <ScrollView>
                    <Text size="xs" color={mutedTextColor} fontFamily="$mono">
                      {error.stack || error.message}
                    </Text>
                  </ScrollView>
                </Box>
              )}
            </Box>
          )}

          <VStack space="sm" w="$full" mt="$4">
            {resetError && (
              <Button onPress={handleTryAgain} w="$full">
                <ButtonIcon as={RefreshCw} mr="$2" />
                <ButtonText>{i18n._('error.action.tryAgain')}</ButtonText>
              </Button>
            )}

            <Button variant="outline" onPress={handleGoHome} w="$full">
              <ButtonIcon as={Home} mr="$2" />
              <ButtonText>{i18n._('error.action.goHome')}</ButtonText>
            </Button>
          </VStack>
        </VStack>
      </Box>
    </Box>
  );
}
