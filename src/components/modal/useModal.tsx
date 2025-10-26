'use client';

import React, { useState } from 'react';
import { Modal } from './modal';

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const ModalWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Modal isOpen={isOpen} closeModal={closeModal}>
      {children}
    </Modal>
  );

  return { isOpen, openModal, closeModal, Modal: ModalWrapper };
};
