export interface Bar {
  isActive?: boolean;
}

export interface Badgeprops {
  bgColor: string;
}

export interface BtnProps {
    children: React.ReactNode;
    onClick?: () => void;
}

export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}