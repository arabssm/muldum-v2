'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { ModalPortalProps } from '@/shared/types';

export const ModalPortal = ({ children }: ModalPortalProps) => {
    const [mounted, setMounted] = useState(false);
    const [element, setElement] = useState<Element | null>(null);

    useEffect(() => {
        setMounted(true);
        setElement(document.getElementById('modal-root'));
    }, []);

    if (!mounted || !element) return null;
    return createPortal(children, element);
};