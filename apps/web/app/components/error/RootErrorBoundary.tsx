import { useRouteError, isRouteErrorResponse, Link } from 'react-router';
import {
  AlertTriangle,
  Home,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '~/components/ui/card';
import { getI18nInstance, DEFAULT_LOCALE } from '~/i18n';

interface ErrorInfo {
  title: string;
  message: string;
  status?: number;
}

function classifyError(error: unknown): ErrorInfo {
  const i18n = getI18nInstance(DEFAULT_LOCALE);

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return {
        title: i18n._('error.notFound.title'),
        message: i18n._('error.notFound.message'),
        status: 404,
      };
    }
    if (error.status === 401 || error.status === 403) {
      return {
        title: i18n._('error.unauthorized.title'),
        message: i18n._('error.unauthorized.message'),
        status: error.status,
      };
    }
    return {
      title: i18n._('error.unexpected.title'),
      message: error.statusText || i18n._('error.unexpected.message'),
      status: error.status,
    };
  }

  if (error instanceof Error) {
    if (
      error.message.includes('fetch') ||
      error.message.includes('network') ||
      error.message.includes('Network')
    ) {
      return {
        title: i18n._('error.network.title'),
        message: i18n._('error.network.message'),
      };
    }
  }

  return {
    title: i18n._('error.unexpected.title'),
    message: i18n._('error.unexpected.message'),
  };
}

function getErrorDetails(error: unknown): string | null {
  if (isRouteErrorResponse(error)) {
    return error.data ? JSON.stringify(error.data, null, 2) : null;
  }
  if (error instanceof Error) {
    return error.stack || error.message;
  }
  return String(error);
}

export function RootErrorBoundary() {
  const error = useRouteError();
  const [showDetails, setShowDetails] = useState(false);
  const i18n = getI18nInstance(DEFAULT_LOCALE);
  const errorInfo = classifyError(error);
  const errorDetails = getErrorDetails(error);
  const isDev = import.meta.env.DEV;

  const handleTryAgain = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md bg-card text-card-foreground border-border">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          {errorInfo.status && (
            <div className="text-5xl font-bold text-destructive mb-2">
              {errorInfo.status}
            </div>
          )}
          <CardTitle className="text-2xl text-foreground">
            {errorInfo.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-6">{errorInfo.message}</p>

          {isDev && errorDetails && (
            <div className="mt-4">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mx-auto"
              >
                {showDetails ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                {i18n._('error.details.title')}
              </button>
              {showDetails && (
                <pre className="mt-4 p-4 bg-muted text-muted-foreground rounded-lg text-xs text-left overflow-auto max-h-48">
                  {errorDetails}
                </pre>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button onClick={handleTryAgain} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            {i18n._('error.action.tryAgain')}
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              {i18n._('error.action.goHome')}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
