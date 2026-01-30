import { useState, useEffect, type ReactNode } from "react";
import { I18nProvider as LinguiProvider } from "@lingui/react";
import type { I18n } from "@lingui/core";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { initializeI18n, getI18n } from "./setup";

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [i18n, setI18n] = useState<I18n | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeI18n()
      .then((instance) => {
        setI18n(instance);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Failed to initialize i18n:", error);
        // Fall back to uninitialized instance
        setI18n(getI18n());
        setIsLoading(false);
      });
  }, []);

  if (isLoading || !i18n) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return <LinguiProvider i18n={i18n}>{children}</LinguiProvider>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
});
