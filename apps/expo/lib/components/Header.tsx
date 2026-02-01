import { useState } from 'react';
import {
  Box,
  HStack,
  Text,
  Pressable,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Heading,
  Icon,
  CloseIcon,
} from '@gluestack-ui/themed';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLingui } from '@lingui/react';
import { LanguageSwitcher } from './LanguageSwitcher';

interface HeaderProps {
  title?: string;
  showLanguageSwitcher?: boolean;
}

export function Header({ title, showLanguageSwitcher = true }: HeaderProps) {
  const insets = useSafeAreaInsets();
  const { i18n } = useLingui();
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  return (
    <>
      <Box bg="$primary600" pt={insets.top}>
        <HStack
          px="$4"
          py="$3"
          alignItems="center"
          justifyContent="space-between"
        >
          <Text color="$white" fontSize="$xl" fontWeight="$bold">
            {title || 'Monorepo'}
          </Text>
          {showLanguageSwitcher && (
            <Pressable
              onPress={() => setLanguageModalVisible(true)}
              bg="$white"
              opacity={0.9}
              px="$3"
              py="$1.5"
              borderRadius="$full"
              accessibilityLabel={i18n._('Language')}
            >
              <Text color="$primary600" fontWeight="$semibold" fontSize="$sm">
                {i18n.locale.toUpperCase()}
              </Text>
            </Pressable>
          )}
        </HStack>
      </Box>

      <Modal
        isOpen={languageModalVisible}
        onClose={() => setLanguageModalVisible(false)}
      >
        <ModalBackdrop />
        <ModalContent maxWidth="$96" mx="$4">
          <ModalHeader borderBottomWidth={1} borderColor="$borderLight200">
            <Heading size="md">{i18n._('Language')}</Heading>
            <ModalCloseButton>
              <Icon as={CloseIcon} size="md" />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody py="$4">
            <LanguageSwitcher
              onLocaleChange={() => setLanguageModalVisible(false)}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
