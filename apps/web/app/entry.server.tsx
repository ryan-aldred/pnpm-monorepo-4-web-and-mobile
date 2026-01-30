import type { AppLoadContext, EntryContext } from 'react-router';
import { ServerRouter } from 'react-router';
import { isbot } from 'isbot';
import { renderToReadableStream } from 'react-dom/server';
import { createDatabase } from '@monorepo/database';
import { I18nProvider, getServerI18n, getLocaleFromRequest } from '~/i18n';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  _loadContext: AppLoadContext
) {
  const userAgent = request.headers.get('user-agent');
  const i18n = getServerI18n(request);
  const locale = getLocaleFromRequest(request);

  const body = await renderToReadableStream(
    <I18nProvider i18n={i18n}>
      <ServerRouter context={routerContext} url={request.url} />
    </I18nProvider>,
    {
      signal: request.signal,
      onError(error: unknown) {
        console.error(error);
        responseStatusCode = 500;
      },
    }
  );

  if (isbot(userAgent)) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Language', locale);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}

export function getLoadContext(context: {
  cloudflare: AppLoadContext['cloudflare'];
}): AppLoadContext {
  const db = createDatabase(context.cloudflare.env.DB);
  return {
    cloudflare: context.cloudflare,
    db,
  };
}
