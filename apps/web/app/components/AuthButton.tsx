import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { useLingui } from '~/i18n/provider';
import { Button } from '~/components/ui/button';

export function AuthButton() {
  const { i18n } = useLingui();
  const location = useLocation();
  const [mounted, setMounted] = useState(false);
  const [session, setSession] = useState<{ user: { name: string } } | null>(
    null
  );
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Refetch session on mount and when location changes
  useEffect(() => {
    if (!mounted) return;

    import('~/lib/auth.client').then(({ authClient }) => {
      authClient.getSession().then((result) => {
        setSession(result.data);
        setIsPending(false);
      });
    });
  }, [mounted, location.pathname]);

  const handleSignOut = async () => {
    const { signOut } = await import('~/lib/auth.client');
    await signOut();
    setSession(null);
  };

  if (!mounted || isPending) {
    return null;
  }

  if (session) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">{session.user.name}</span>
        <Button variant="ghost" size="sm" onClick={handleSignOut}>
          {i18n._('Sign out')}
        </Button>
      </div>
    );
  }

  return (
    <Button variant="ghost" size="sm" asChild>
      <Link to="/login">{i18n._('Sign in')}</Link>
    </Button>
  );
}
