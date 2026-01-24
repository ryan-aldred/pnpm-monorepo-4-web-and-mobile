import {
  LoaderFunctionArgs,
  ActionFunctionArgs,
  redirect,
  data,
} from 'react-router';
import { GATED_ROUTES } from './config';

interface HandlerConfig {
  gatedRoutes?: string[];
}

type RequestHandler<T> = (args: any) => Promise<T>;

class BaseHandler<T> {
  constructor(
    protected context: LoaderFunctionArgs | ActionFunctionArgs,
    protected handlers: Record<string, RequestHandler<T> | undefined>,
    protected config: HandlerConfig = {}
  ) {}

  protected async validateAccess() {
    const url = new URL(this.context.request.url);
    // Use provided routes if any, otherwise fall back to central config
    const gatedRoutes = this.config.gatedRoutes ?? GATED_ROUTES;

    if (gatedRoutes.includes(url.pathname)) {
      throw redirect('/');
    }
  }

  async perform(): Promise<T> {
    await this.validateAccess();

    const method = this.context.request.method.toUpperCase();
    const handler = this.handlers[method];

    if (handler) {
      return await handler(this.context);
    }

    throw data({ message: `Method ${method} not allowed` }, { status: 405 });
  }
}

export class LoaderHandler<T> extends BaseHandler<T> {
  constructor(
    context: LoaderFunctionArgs,
    handlers: {
      get: (context: LoaderFunctionArgs) => Promise<T>;
    },
    config?: HandlerConfig
  ) {
    super(context, { GET: handlers.get }, config);
  }
}

export class ActionHandler<T> extends BaseHandler<T> {
  constructor(
    context: ActionFunctionArgs,
    handlers: {
      post?: (context: ActionFunctionArgs) => Promise<T>;
      put?: (context: ActionFunctionArgs) => Promise<T>;
      delete?: (context: ActionFunctionArgs) => Promise<T>;
    },
    config?: HandlerConfig
  ) {
    super(
      context,
      {
        POST: handlers.post,
        PUT: handlers.put,
        DELETE: handlers.delete,
      },
      config
    );
  }
}
