import {
  ActionFunctionArgs,
  Form,
  LoaderFunctionArgs,
  useLoaderData,
} from 'react-router';
import { LoaderHandler, ActionHandler } from '~/utils/routing/handlers';

export { RouteErrorBoundary as ErrorBoundary } from '~/components/error';

export async function loader(context: LoaderFunctionArgs) {
  const loaderHandler = new LoaderHandler(context, {
    get: async (_context: LoaderFunctionArgs) => {
      return Promise.resolve({
        greeting: 'bruh fuck im in costa rica - i want a woman',
        tits: 'are great',
      });
    },
  });

  const data = await loaderHandler.perform();
  return data;
}

export async function action(context: ActionFunctionArgs) {
  const actionHanlder = new ActionHandler(context, {
    put: async (_context: ActionFunctionArgs) => {
      return Promise.resolve(console.log('put something'));
    },
    post: async (_context: ActionFunctionArgs) => {
      return Promise.resolve(console.log('post something'));
    },
    delete: async (_context: ActionFunctionArgs) => {
      return Promise.resolve(console.log('delete something'));
    },
  });

  await actionHanlder.perform();
}

export default function Route() {
  const { greeting } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>{greeting}</h1>
      <div>User:</div>
      <Form method="post">
        <input type="hidden" name="_method" value="post" />
        <button type="submit">click me</button>
      </Form>
    </div>
  );
}
