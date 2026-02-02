import { LoaderFunctionArgs } from 'react-router';
import { LoaderHandler } from '~/utils/routing/handlers';

export { RouteErrorBoundary as ErrorBoundary } from '~/components/error';

export async function loader(context: LoaderFunctionArgs) {
  const handler = new LoaderHandler(context, {
    get: async (_context: LoaderFunctionArgs) => {
      return {};
    },
  });

  return await handler.perform();
}

export default function Users() {
  return <div>USERS</div>;
}
