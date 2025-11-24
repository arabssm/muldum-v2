"use client";

import styled from "@emotion/styled";
import { HashLoader } from "react-spinners";

export default function Loading() {
    return (
        <Dimmer>
            <LoadingContainer>
                <HashLoader size={80} />
            </LoadingContainer>
        </Dimmer>
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