import { useState, useCallback } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useLingui } from "@lingui/react";
import { SUPPORTED_LOCALES, type SupportedLocale } from "@monorepo/i18n";
import { changeLocale, getCurrentLocale } from "../i18n";

const LOCALE_LABELS: Record<SupportedLocale, string> = {
  en: "English",
  es: "Espanol",
  fr: "Francais",
};

interface LanguageSwitcherProps {
  onLocaleChange?: (locale: SupportedLocale) => void;
}

export function LanguageSwitcher({ onLocaleChange }: LanguageSwitcherProps) {
  const { i18n } = useLingui();
  const [selectedLocale, setSelectedLocale] = useState<SupportedLocale>(
    getCurrentLocale()
  );

  const handleLocaleSelect = useCallback(
    async (locale: SupportedLocale) => {
      setSelectedLocale(locale);
      await changeLocale(locale);
      // Force re-render by triggering i18n change
      i18n.activate(locale);
      onLocaleChange?.(locale);
    },
    [i18n, onLocaleChange]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Language</Text>
      <View style={styles.optionsContainer}>
        {SUPPORTED_LOCALES.map((locale) => (
          <Pressable
            key={locale}
            style={[
              styles.option,
              selectedLocale === locale && styles.optionSelected,
            ]}
            onPress={() => handleLocaleSelect(locale)}
            accessibilityRole="button"
            accessibilityLabel={`Select ${LOCALE_LABELS[locale]}`}
            accessibilityState={{ selected: selectedLocale === locale }}
          >
            <Text
              style={[
                styles.optionText,
                selectedLocale === locale && styles.optionTextSelected,
              ]}
            >
              {LOCALE_LABELS[locale]}
            </Text>
            {selectedLocale === locale && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  optionsContainer: {
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  optionSelected: {
    backgroundColor: "#f0f7ff",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  optionTextSelected: {
    color: "#0066cc",
    fontWeight: "500",
  },
  checkmark: {
    fontSize: 16,
    color: "#0066cc",
    fontWeight: "bold",
  },
});
