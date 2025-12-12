import { useLoaderData, type MetaFunction } from 'react-router';
import { getUsers } from '@monorepo/core/data';

export const meta: MetaFunction = () => {
  return [
    { title: 'Expo + React Router 7 Monorepo' },
    { name: 'description', content: 'Welcome to the monorepo!' },
  ];
};

export async function loader() {
  const users = await getUsers();
  return {
    greeting: 'Hello fuckface',
    users,
  };
}

export default function Home() {
  const { greeting, users } = useLoaderData<typeof loader>();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to the Monorepo!
          {greeting}
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          This is your React Router 7 web app powered by Vite. It shares
          components and logic with the Expo mobile app.
        </p>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h2 className="font-semibold text-blue-900 mb-2">Features:</h2>
            <ul className="list-disc list-inside text-blue-800 space-y-1">
              <li>React Router 7 with SSR</li>
              <li>Tailwind CSS styling</li>
              <li>TypeScript strict mode</li>
              <li>Shared components via @monorepo/ui</li>
              <li>API routes for Expo app</li>
            </ul>
          </div>
        </div>
        <div>
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                {user.name} - {user.email}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
