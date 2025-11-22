"use client";

import styled from "@emotion/styled";
import { useLoadingStore } from "@/shared/store/loading";
import { createPortal } from "react-dom";
import { HashLoader } from "react-spinners";

export default function Loading() {
    const { isVisible } = useLoadingStore();

    if (!isVisible) return null;

    return createPortal(
        <Dimmer>
            <LoadingContainer>
                <HashLoader size={80} />
            </LoadingContainer>
        </Dimmer>,
        document.body
    );
}

const Dimmer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 99;
`;

const LoadingContainer = styled.div`
  width: 150px;
  height: 150px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99;
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  border-radius: 4px;
`;