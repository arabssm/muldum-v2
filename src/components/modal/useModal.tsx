'use client';

import { useState } from 'react';
import { Modal } from './modal';
import type { ReactNode } from 'react';

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const ModalWrapper = ({ children }: { children: ReactNode }) => (
    <Modal isOpen={isOpen} closeModal={closeModal}>
      {children}
    </Modal>
  );

  return { isOpen, openModal, closeModal, Modal: ModalWrapper };
};