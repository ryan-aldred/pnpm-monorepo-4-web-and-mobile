import { describe, it, expect } from '@jest/globals';

// Simple utility function to test
function add(a: number, b: number): number {
  return a + b;
}

function multiply(a: number, b: number): number {
  return a * b;
}

describe('Expo testing setup verification', () => {
  it('Jest is configured correctly', () => {
    expect(true).toBe(true);
  });

  it('can run basic TypeScript tests', () => {
    const result = add(2, 3);
    expect(result).toBe(5);
  });

  it('can test multiple functions', () => {
    expect(add(10, 20)).toBe(30);
    expect(multiply(5, 6)).toBe(30);
  });

  it('has access to Jest mocking', () => {
    const mockFn = jest.fn(() => 'mocked');
    expect(mockFn()).toBe('mocked');
    expect(mockFn).toHaveBeenCalled();
  });
});

describe('Test utilities are available', () => {
  it('has expo-router mocks available', () => {
    const { useRouter } = require('expo-router');
    const router = useRouter();

    expect(router).toBeDefined();
    expect(router.push).toBeDefined();
    expect(router.back).toBeDefined();
  });
});
