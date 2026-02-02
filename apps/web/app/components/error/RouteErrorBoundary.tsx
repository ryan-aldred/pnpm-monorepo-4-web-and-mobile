import {
  useRouteError,
  isRouteErrorResponse,
  useNavigate,
  Link,
} from 'react-router';
import {
  AlertCircle,
  ArrowLeft,
  Home,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { Button } from '~/components/ui/button';
import { useI18n } from '~/i18n';

interface ErrorInfo {
  title: string;
  message: string;
  status?: number;
}

function useClassifyError(error: unknown): ErrorInfo {
  const i18n = useI18n();

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

export function RouteErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();
  const i18n = useI18n();
  const [showDetails, setShowDetails] = useState(false);
  const errorInfo = useClassifyError(error);
  const errorDetails = getErrorDetails(error);
  const isDev = import.meta.env.DEV;

  const handleTryAgain = () => {
    window.location.reload();
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle className="text-lg">
          {errorInfo.status && (
            <span className="font-bold mr-2">{errorInfo.status}</span>
          )}
          {errorInfo.title}
        </AlertTitle>
        <AlertDescription className="mt-2">
          {errorInfo.message}
        </AlertDescription>
      </Alert>

      {isDev && errorDetails && (
        <div className="mb-6">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {showDetails ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            {i18n._('error.details.title')}
          </button>
          {showDetails && (
            <pre className="mt-4 p-4 bg-muted text-muted-foreground rounded-lg text-xs overflow-auto max-h-48">
              {errorDetails}
            </pre>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Button onClick={handleTryAgain} size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          {i18n._('error.action.tryAgain')}
        </Button>
        <Button variant="outline" size="sm" onClick={handleGoBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {i18n._('error.action.goBack')}
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link to="/">
            <Home className="mr-2 h-4 w-4" />
            {i18n._('error.action.goHome')}
          </Link>
        </Button>
      </div>
    </div>
  );
}
