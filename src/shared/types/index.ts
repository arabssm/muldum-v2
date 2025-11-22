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

export interface BlockNoteEditorProps {
    initialContent: string;
    onChange?: (content: string) => void;
    editable?: boolean;
}

export interface ModalPortalProps {
  children: React.ReactNode;
}

export interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  children: React.ReactNode;
}

export interface ProvidersProps {
  children: React.ReactNode;
}

export interface Event {
    title: string;
    from: number;
    to: number;
    color: string;
}

export interface MonthlyTestProps {
  sections: any[];
}