'use client';

import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { ModalPortal } from './modalPortal';
import type { ModalProps } from '@/shared/types';

export const Modal = ({ isOpen, closeModal, children }: ModalProps) => {
    return (
        <ModalPortal>
            <AnimatePresence>
                {isOpen && (
                    <Overlay
                        onClick={closeModal}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <Content
                            onClick={(e) => e.stopPropagation()}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                            {children}
                        </Content>
                    </Overlay>
                )}
            </AnimatePresence>
        </ModalPortal>
    );
};

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Content = styled(motion.div)`
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  max-width: 480px;
  width: 100%;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.2);
`;