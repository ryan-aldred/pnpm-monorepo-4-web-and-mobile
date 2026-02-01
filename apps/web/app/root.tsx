import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from 'react-router';
import type { LinksFunction, LoaderFunctionArgs } from 'react-router';
import {
  I18nProvider,
  getI18nInstance,
  getLocaleFromRequest,
  DEFAULT_LOCALE,
  type SupportedLocale,
} from '~/i18n';
import { ThemeProvider } from '~/theme';
import { Header } from '~/components/Header';
import './tailwind.css';

export async function loader({ request }: LoaderFunctionArgs) {
  const locale = getLocaleFromRequest(request);
  console.log(
    'Root loader - detected locale:',
    locale,
    'Cookie:',
    request.headers.get('Cookie')
  );
  return { locale };
}

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  // Use DEFAULT_LOCALE as fallback for error pages where loader doesn't run
  let locale: SupportedLocale = DEFAULT_LOCALE;
  try {
    const data = useLoaderData<typeof loader>();
    if (data?.locale) {
      locale = data.locale;
    }
  } catch {
    // Loader didn't run (error boundary, etc.)
  }

  return (
    <html lang={locale}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme'),d=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(t!=='light'&&d))document.documentElement.classList.add('dark')})();`,
          }}
        />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { locale } = useLoaderData<typeof loader>();

  // Get i18n instance - creates fresh on server, uses singleton on client
  const i18n = getI18nInstance(locale);

  return (
    <ThemeProvider>
      <I18nProvider i18n={i18n}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </I18nProvider>
    </ThemeProvider>
  );
}
