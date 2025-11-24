'use client';

import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { ModalPortal } from './modalPortal';
import type { ModalProps } from '@/shared/types';

interface ExtendedModalProps extends ModalProps {
    maxWidth?: string;
}

export const Modal = ({ isOpen, closeModal, children, maxWidth = '480px' }: ExtendedModalProps) => {
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
                            style={{ maxWidth }}
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
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const Content = styled(motion.div)`
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  max-width: 480px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.2);
`;