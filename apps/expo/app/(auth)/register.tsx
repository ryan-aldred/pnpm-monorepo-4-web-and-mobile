import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';
import {
  Box,
  VStack,
  Heading,
  Text,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Input,
  InputField,
  Button,
  ButtonText,
  ButtonSpinner,
  Alert,
  AlertIcon,
  AlertText,
  HStack,
  Pressable,
} from '@gluestack-ui/themed';
import { AlertCircle } from 'lucide-react-native';
import { signUp } from '../../lib/auth-client';
import { useTheme } from '../../lib/theme';
import { FormFieldError } from '../../components/FormFieldError';
import {
  RegisterSchema,
  validate,
  errorsToMap,
  type FieldErrors,
} from '@monorepo/core/validation';

export default function Register() {
  const { isDark } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    setError('');
    setFieldErrors({});

    const result = validate(RegisterSchema, {
      name,
      email,
      password,
      confirmPassword,
    });
    if (!result.success) {
      setFieldErrors(errorsToMap(result.errors!));
      return;
    }

    setIsLoading(true);

    try {
      const signUpResult = await signUp.email({
        name,
        email,
        password,
      });

      if (signUpResult.error) {
        setError(signUpResult.error.message || 'Registration failed');
      } else {
        router.replace('/');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: isDark ? '#1a1a2e' : '#f0f4f8',
      }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          padding: 20,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Box
          bg={isDark ? '$backgroundDark800' : '$white'}
          borderRadius="$2xl"
          p="$6"
          shadowColor="$black"
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={isDark ? 0.3 : 0.1}
          shadowRadius={8}
          elevation={4}
        >
          <VStack space="lg">
            <Heading
              size="2xl"
              textAlign="center"
              color={isDark ? '$textDark50' : '$textDark900'}
            >
              Register
            </Heading>

            {error ? (
              <Alert action="error" variant="solid">
                <AlertIcon as={AlertCircle} mr="$3" />
                <AlertText>{error}</AlertText>
              </Alert>
            ) : null}

            <FormControl isInvalid={!!fieldErrors.name}>
              <FormControlLabel>
                <FormControlLabelText>Name</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  value={name}
                  onChangeText={setName}
                  placeholder="Your name"
                  autoCapitalize="words"
                  textContentType="name"
                />
              </Input>
              <FormFieldError error={fieldErrors.name} />
            </FormControl>

            <FormControl isInvalid={!!fieldErrors.email}>
              <FormControlLabel>
                <FormControlLabelText>Email</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="emailAddress"
                />
              </Input>
              <FormFieldError error={fieldErrors.email} />
            </FormControl>

            <FormControl isInvalid={!!fieldErrors.password}>
              <FormControlLabel>
                <FormControlLabelText>Password</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  value={password}
                  onChangeText={setPassword}
                  placeholder="At least 8 characters"
                  secureTextEntry
                  textContentType="none"
                  autoComplete="off"
                />
              </Input>
              <FormFieldError error={fieldErrors.password} />
            </FormControl>

            <FormControl isInvalid={!!fieldErrors.confirmPassword}>
              <FormControlLabel>
                <FormControlLabelText>Confirm Password</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm your password"
                  secureTextEntry
                  textContentType="none"
                  autoComplete="off"
                />
              </Input>
              <FormFieldError error={fieldErrors.confirmPassword} />
            </FormControl>

            <Button onPress={handleRegister} isDisabled={isLoading} size="lg">
              {isLoading && <ButtonSpinner mr="$2" />}
              <ButtonText>
                {isLoading ? 'Creating account...' : 'Create Account'}
              </ButtonText>
            </Button>

            <HStack justifyContent="center" space="xs">
              <Text color={isDark ? '$textDark400' : '$textLight500'}>
                Already have an account?
              </Text>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <Link href={'/(auth)/login' as any} asChild>
                <Pressable>
                  <Text color="$primary500" fontWeight="$medium">
                    Login
                  </Text>
                </Pressable>
              </Link>
            </HStack>
          </VStack>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
