import { Link } from 'react-router';
import { useLingui } from '~/i18n/provider';
import { LanguageSwitcher } from './LanguageSwitcher';
import { AuthButton } from './AuthButton';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const { i18n } = useLingui();

  return (
    <header className="bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-xl font-bold text-foreground">
              {i18n._('Welcome')}
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {i18n._('Home')}
              </Link>
              <Link
                to="/users"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {i18n._('Users')}
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <LanguageSwitcher />
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  );
}
