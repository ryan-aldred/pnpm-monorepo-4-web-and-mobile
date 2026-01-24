import type { User } from '@monorepo/types';

// Mock DB - replace with real database later
export const users: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
];

export async function getUsers(): Promise<User[]> {
  return users;
}

export async function getUserById(id: number): Promise<User | null> {
  return users.find((u) => u.id === id) || null;
}

export async function createUser(data: Omit<User, 'id'>): Promise<User> {
  const newUser = { id: Date.now(), ...data };
  users.push(newUser);
  return newUser;
}

export async function deleteUser(id: number): Promise<boolean> {
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return false;
  users.splice(index, 1);
  return true;
}
