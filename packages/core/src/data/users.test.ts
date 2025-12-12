import { describe, it, expect } from 'vitest';
import { getUsers, getUserById, createUser, deleteUser } from './users';

describe('users', () => {
  describe('getUsers', () => {
    it('should return array of users', async () => {
      const users = await getUsers();
      expect(users).toBeInstanceOf(Array);
      expect(users.length).toBeGreaterThan(0);
    });

    it('should return users with correct shape', async () => {
      const users = await getUsers();
      const user = users[0];
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('email');
    });
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      const user = await getUserById(1);
      expect(user).toBeDefined();
      expect(user?.id).toBe(1);
    });

    it('should return null for non-existent user', async () => {
      const user = await getUserById(99999);
      expect(user).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const newUser = await createUser({
        name: 'Test User',
        email: 'test@example.com',
      });

      expect(newUser).toHaveProperty('id');
      expect(newUser.name).toBe('Test User');
      expect(newUser.email).toBe('test@example.com');
    });

    it('should add user to users list', async () => {
      const beforeCount = (await getUsers()).length;
      await createUser({ name: 'New User', email: 'new@example.com' });
      const afterCount = (await getUsers()).length;

      expect(afterCount).toBe(beforeCount + 1);
    });
  });

  describe('deleteUser', () => {
    it('should delete existing user', async () => {
      const beforeCount = (await getUsers()).length;
      const result = await deleteUser(1);
      expect(result).toBe(true);

      const afterCount = (await getUsers()).length;
      expect(afterCount).toBe(beforeCount - 1);
    });

    it('should return false for non-existent user', async () => {
      const result = await deleteUser(99999);
      expect(result).toBe(false);
    });
  });
});
