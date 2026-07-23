"use client";

import { memo, useCallback, useMemo, useState } from "react";
import { useDisclosure, useInterval, useLocalStorage } from "@mantine/hooks";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  ScrollShadow,
} from "@heroui/react";
import { DISCLAIMER_STORAGE_KEY, IS_BROWSER } from "@/utils/constants";
import { cn } from "@/utils/helpers";

const COUNTDOWN_DURATION = 10;
const MODAL_SIZE = "3xl";
const DISCLAIMER_CONTENT = {
  title: "Disclaimer",
  paragraphs: [
    {
      id: "welcome",
      content:
        "Welcome to filmanesia - a free and open-source movie streaming website. Please read this disclaimer carefully before using this website.",
    },
    {
      id: "purpose",
      content: "filmanesia is developed solely for",
      emphasis: "educational and learning purposes.",
      continuation:
        "This website is an open-source project intended to demonstrate web development skills and is not meant to promote or encourage digital piracy in any form.",
    },
    {
      id: "content-source",
      content:
        "All content displayed on filmanesia (including but not limited to movies, images, posters, and related information) is sourced from",
      emphasis: "third-party providers through APIs or embedding.",
      continuation:
        "I do not host, store, or distribute any media files on my servers. The website merely aggregates content that is already available on the internet.",
    },
    {
      id: "responsibility",
      content:
        "By using filmanesia, you acknowledge that I bears no responsibility for user actions, content accuracy, or any direct or indirect damages arising from the use of this website. Users are solely responsible for their actions while using this service. I respect intellectual property rights and will respond to legitimate requests from copyright holders for content removal.",
    },
    {
      id: "usage",
      content:
        "This website should only be used for learning purposes. Any illegal activities, including but not limited to unauthorized downloading, redistribution of content, or commercial use, are strictly prohibited. By using filmanesia, you agree to these terms and acknowledge that",
      emphasis: "you use the service at your own risk.",
    },
  ],
};

interface DisclaimerParagraphProps {
  content: string;
  emphasis?: string;
  continuation?: string;
}

const DisclaimerParagraph: React.FC<DisclaimerParagraphProps> = memo(
  ({ content, emphasis, continuation }) => (
    <p>
      {content}
      {emphasis && (
        <>
          {" "}
          <strong>{emphasis}</strong>
        </>
      )}
      {continuation && ` ${continuation}`}
    </p>
  ),
);

DisclaimerParagraph.displayName = "DisclaimerParagraph";

const Disclaimer: React.FC = () => {
  const [hasAgreed, setHasAgreed] = useLocalStorage<boolean>({
    key: DISCLAIMER_STORAGE_KEY,
    defaultValue: false,
    getInitialValueInEffect: false,
  });

  const [secondsRemaining, setSecondsRemaining] = useState(COUNTDOWN_DURATION);

  const shouldShowModal = useMemo(() => !hasAgreed && IS_BROWSER, [hasAgreed]);

  const [isOpen, { close }] = useDisclosure(shouldShowModal);

  useInterval(() => setSecondsRemaining((prev) => Math.max(0, prev - 1)), 1000, {
    autoInvoke: shouldShowModal && secondsRemaining > 0,
  });

  const isButtonDisabled = secondsRemaining > 0;
  const buttonText = useMemo(
    () => `Agree${isButtonDisabled ? ` (${secondsRemaining})` : ""}`,
    [isButtonDisabled, secondsRemaining],
  );

  const handleAgree = useCallback(() => {
    close();
    setHasAgreed(true);
  }, [close, setHasAgreed]);

  if (hasAgreed || !IS_BROWSER) {
    return null;
  }

  return (
    <Modal
      hideCloseButton
      isOpen={isOpen}
      placement="center"
      backdrop="blur"
      size={MODAL_SIZE}
      isDismissable={false}
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-center text-3xl uppercase">
          {DISCLAIMER_CONTENT.title}
        </ModalHeader>

        <ModalBody>
          <ScrollShadow hideScrollBar className="space-y-4">
            {DISCLAIMER_CONTENT.paragraphs.map((paragraph) => (
              <DisclaimerParagraph
                key={paragraph.id}
                content={paragraph.content}
                emphasis={paragraph.emphasis}
                continuation={paragraph.continuation}
              />
            ))}
          </ScrollShadow>
        </ModalBody>

        <ModalFooter className="justify-center">
          <Button
            className={cn(isButtonDisabled && "pointer-events-auto cursor-not-allowed")}
            isDisabled={isButtonDisabled}
            color={isButtonDisabled ? "danger" : "primary"}
            variant="shadow"
            onPress={handleAgree}
          >
            {buttonText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Disclaimer;
