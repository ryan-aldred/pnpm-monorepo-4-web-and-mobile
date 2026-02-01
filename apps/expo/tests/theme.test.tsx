import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider, useTheme } from '../lib/theme';

// Get mocked functions
const mockedUseColorScheme = useColorScheme as jest.MockedFunction<
  typeof useColorScheme
>;
const mockedAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('Theme Provider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseColorScheme.mockReturnValue('light');
    mockedAsyncStorage.getItem.mockResolvedValue(null);
  });

  it('provides theme context values', async () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    await waitFor(() => {
      expect(result.current.theme).toBeDefined();
    });

    expect(result.current.theme).toBeDefined();
    expect(result.current.resolvedTheme).toBeDefined();
    expect(result.current.isDark).toBeDefined();
    expect(result.current.setTheme).toBeDefined();
  });

  it('defaults to system theme', async () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    await waitFor(() => {
      expect(result.current.theme).toBe('system');
    });
  });

  it('resolves to light when system is light and theme is system', async () => {
    mockedUseColorScheme.mockReturnValue('light');

    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    await waitFor(() => {
      expect(result.current.resolvedTheme).toBe('light');
    });

    expect(result.current.isDark).toBe(false);
  });

  it('resolves to dark when system is dark and theme is system', async () => {
    mockedUseColorScheme.mockReturnValue('dark');

    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    await waitFor(() => {
      expect(result.current.resolvedTheme).toBe('dark');
    });

    expect(result.current.isDark).toBe(true);
  });

  it('allows setting theme to dark', async () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    await waitFor(() => {
      expect(result.current.theme).toBe('system');
    });

    act(() => {
      result.current.setTheme('dark');
    });

    expect(result.current.theme).toBe('dark');
    expect(result.current.resolvedTheme).toBe('dark');
    expect(result.current.isDark).toBe(true);
    expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith('@theme', 'dark');
  });

  it('allows setting theme to light', async () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    await waitFor(() => {
      expect(result.current.theme).toBe('system');
    });

    act(() => {
      result.current.setTheme('light');
    });

    expect(result.current.theme).toBe('light');
    expect(result.current.resolvedTheme).toBe('light');
    expect(result.current.isDark).toBe(false);
    expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith('@theme', 'light');
  });

  it('loads saved theme from AsyncStorage', async () => {
    mockedAsyncStorage.getItem.mockResolvedValue('dark');

    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    await waitFor(() => {
      expect(result.current.theme).toBe('dark');
    });
  });

  it('throws error when useTheme is used outside provider', () => {
    expect(() => {
      renderHook(() => useTheme());
    }).toThrow('useTheme must be used within a ThemeProvider');
  });
});
