import { useState } from 'react';
import {
  Pressable,
  Text,
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
import { useLingui } from '@lingui/react';
import { LanguageSwitcher } from './LanguageSwitcher';

export function HeaderLanguageButton() {
  const { i18n } = useLingui();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <Pressable
        onPress={() => setModalVisible(true)}
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

      <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
        <ModalBackdrop />
        <ModalContent maxWidth="$96" mx="$4">
          <ModalHeader borderBottomWidth={1} borderColor="$borderLight200">
            <Heading size="md">{i18n._('Language')}</Heading>
            <ModalCloseButton>
              <Icon as={CloseIcon} size="md" />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody py="$4">
            <LanguageSwitcher onLocaleChange={() => setModalVisible(false)} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
