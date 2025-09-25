import styled from '@emotion/styled';
import { PaginationProps } from '@/types';

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    return (
        <PaginationWrapper>
            <PageButton onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
                {'<'}
            </PageButton>
            {Array.from({ length: totalPages }, (_, i) => (
                <PageButton
                    key={i}
                    onClick={() => onPageChange(i + 1)}
                    active={currentPage === i + 1}
                >
                    {i + 1}
                </PageButton>
            ))}
            <PageButton onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                {'>'}
            </PageButton>
        </PaginationWrapper>
    );
}

const PaginationWrapper = styled.div`
    display: flex;
    justify-content: center;
    margin-top: auto;
    background-color: transparent;
    gap: 0.2rem;
`;

export const PageButton = styled.button<{ active?: boolean }>`
    color: #909090;
    background-color: transparent;
    border: none;
    border-radius: 20rem;
    padding: 0.7% 1%;
    cursor: pointer;

    ${({ active }) =>
        active &&
        `
        background-color: #FFF5EF;
        color: #FF9B62;
    `}
`;