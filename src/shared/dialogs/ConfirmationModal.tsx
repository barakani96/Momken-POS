import React from 'react';
import { Modal } from '@carbon/react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  heading: string;
  bodyText: React.ReactNode;
  primaryButtonText: string;
  secondaryButtonText?: string;
  danger?: boolean;
  onRequestClose: () => void;
  onRequestSubmit: () => void;
}

export default function ConfirmationModal({
  isOpen,
  title,
  heading,
  bodyText,
  primaryButtonText,
  secondaryButtonText = 'Cancel',
  danger = true,
  onRequestClose,
  onRequestSubmit
}: ConfirmationModalProps) {
  return (
    <Modal
      open={isOpen}
      modalHeading={heading}
      modalLabel={title}
      primaryButtonText={primaryButtonText}
      secondaryButtonText={secondaryButtonText}
      danger={danger}
      onRequestClose={onRequestClose}
      onRequestSubmit={onRequestSubmit}
    >
      <p style={{ marginBottom: '1rem' }}>{bodyText}</p>
    </Modal>
  );
}
