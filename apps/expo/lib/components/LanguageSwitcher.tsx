import { useState, useCallback } from 'react';
import { VStack, HStack, Text, Pressable, Box } from '@gluestack-ui/themed';
import { useLingui } from '@lingui/react';
import { SUPPORTED_LOCALES, type SupportedLocale } from '@monorepo/i18n';
import { changeLocale, getCurrentLocale } from '../i18n';

const LOCALE_LABELS: Record<SupportedLocale, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
};

interface LanguageSwitcherProps {
  onLocaleChange?: (locale: SupportedLocale) => void;
}

export function LanguageSwitcher({ onLocaleChange }: LanguageSwitcherProps) {
  const { i18n } = useLingui();
  const [selectedLocale, setSelectedLocale] =
    useState<SupportedLocale>(getCurrentLocale());

  const handleLocaleSelect = useCallback(
    async (locale: SupportedLocale) => {
      setSelectedLocale(locale);
      await changeLocale(locale);
      i18n.activate(locale);
      onLocaleChange?.(locale);
    },
    [i18n, onLocaleChange]
  );

  return (
    <VStack space="md">
      {SUPPORTED_LOCALES.map((locale, index) => (
        <Pressable
          key={locale}
          onPress={() => handleLocaleSelect(locale)}
          accessibilityRole="button"
          accessibilityLabel={`Select ${LOCALE_LABELS[locale]}`}
        >
          <Box
            bg={selectedLocale === locale ? '$primary50' : '$white'}
            borderWidth={1}
            borderColor={
              selectedLocale === locale ? '$primary300' : '$borderLight200'
            }
            borderTopLeftRadius={index === 0 ? '$lg' : '$none'}
            borderTopRightRadius={index === 0 ? '$lg' : '$none'}
            borderBottomLeftRadius={
              index === SUPPORTED_LOCALES.length - 1 ? '$lg' : '$none'
            }
            borderBottomRightRadius={
              index === SUPPORTED_LOCALES.length - 1 ? '$lg' : '$none'
            }
            borderTopWidth={index === 0 ? 1 : 0}
            px="$4"
            py="$3.5"
          >
            <HStack justifyContent="space-between" alignItems="center">
              <Text
                color={
                  selectedLocale === locale ? '$primary600' : '$textDark700'
                }
                fontWeight={selectedLocale === locale ? '$semibold' : '$normal'}
                fontSize="$md"
              >
                {LOCALE_LABELS[locale]}
              </Text>
              {selectedLocale === locale && (
                <Text color="$primary600" fontWeight="$bold" fontSize="$md">
                  ✓
                </Text>
              )}
            </HStack>
          </Box>
        </Pressable>
      ))}
    </VStack>
  );
}
