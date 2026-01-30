import { Link } from 'react-router';
import { useLingui } from '~/i18n/provider';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Header() {
  const { i18n } = useLingui();

  // Debug: show current locale
  const homeTranslation = i18n._('Home');
  const usersTranslation = i18n._('Users');

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
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
                {homeTranslation}
              </Link>
              <Link
                to="/users"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {usersTranslation}
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500">[{i18n.locale}]</span>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
