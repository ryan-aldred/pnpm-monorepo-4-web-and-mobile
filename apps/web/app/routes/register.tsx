import { useState } from 'react';
import { Link, useNavigate, type MetaFunction } from 'react-router';
import { AlertCircle, Loader2 } from 'lucide-react';

export { RouteErrorBoundary as ErrorBoundary } from '~/components/error';
import { signUp } from '~/lib/auth.client';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { FormField } from '~/components/ui/form-field';
import { Alert, AlertDescription } from '~/components/ui/alert';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '~/components/ui/card';
import {
  RegisterSchema,
  validate,
  errorsToMap,
  type FieldErrors,
} from '@monorepo/core/validation';

export const meta: MetaFunction = () => {
  return [
    { title: 'Register' },
    { name: 'description', content: 'Create a new account' },
  ];
};

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        navigate('/');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Register</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Name" htmlFor="name" error={fieldErrors.name}>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                autoComplete="name"
              />
            </FormField>

            <FormField label="Email" htmlFor="email" error={fieldErrors.email}>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </FormField>

            <FormField
              label="Password"
              htmlFor="password"
              error={fieldErrors.password}
            >
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                autoComplete="new-password"
              />
            </FormField>

            <FormField
              label="Confirm Password"
              htmlFor="confirmPassword"
              error={fieldErrors.confirmPassword}
            >
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                autoComplete="new-password"
              />
            </FormField>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary hover:underline font-medium"
            >
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
