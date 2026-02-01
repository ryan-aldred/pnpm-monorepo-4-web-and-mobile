import { Link } from 'react-router';
import { useLingui } from '~/i18n/provider';
import { LanguageSwitcher } from './LanguageSwitcher';
import { AuthButton } from './AuthButton';

export function Header() {
  const { i18n } = useLingui();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-xl font-bold text-gray-900">
              {i18n._('Welcome')}
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {i18n._('Home')}
              </Link>
              <Link
                to="/users"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {i18n._('Users')}
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  );
}
