import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getNoticeDetail } from '@/shared/api';
import { getPresignedUrl, uploadFileToS3, updateNotice } from '@/shared/api/admin/notice';
import { showToast } from '@/shared/ui/toast';

interface FilePreview {
    file: File | null;
    url: string;
}

export function useNoticeEdit(noticeId: string) {
    const router = useRouter();
    const [files, setFiles] = useState<FilePreview[]>([]);
    const [title, setTitle] = useState('');
    const [deadlineDate, setDeadlineDate] = useState('');
    const [content, setContent] = useState('');
    const [initialContent, setInitialContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchNotice = async () => {
            try {
                const res = await getNoticeDetail(noticeId);
                const data = res?.data ?? res;
                
                setTitle(data.title || '');
                setDeadlineDate(data.deadlineDate || '');
                
                // content가 유효한 BlockNote JSON인지 확인
                let validContent = '';
                if (data.content) {
                    try {
                        if (data.content.startsWith('[')) {
                            const parsed = JSON.parse(data.content);
                            if (Array.isArray(parsed) && parsed.length > 0) {
                                validContent = data.content;
                            }
                        }
                    } catch (e) {
                        // BlockNote JSON 파싱 실패, 빈 에디터로 시작
                    }
                }
                
                setContent(data.content || '');
                setInitialContent(validContent);
                
                // 기존 파일들을 files 배열에 추가
                if (data.files && data.files.length > 0) {
                    const existingFiles = data.files.map((file: any) => ({
                        file: null, // 기존 파일은 File 객체가 없음
                        url: file.url
                    }));
                    setFiles(existingFiles);
                }
            } catch (err) {
                console.error('공지 불러오기 실패:', err);
                showToast.error('공지를 불러오는데 실패했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchNotice();
    }, [noticeId]);

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        addFiles(droppedFiles);
    };

    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const onClickDrop = () => {
        fileInputRef.current?.click();
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            addFiles(selectedFiles);
        }
    };

    const addFiles = (newFiles: File[]) => {
        const previews = newFiles.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));
        setFiles((prev) => [...prev, ...previews]);
    };

    const removeAt = (index: number) => {
        setFiles((prev) => {
            const updated = [...prev];
            if (updated[index].file) {
                URL.revokeObjectURL(updated[index].url);
            }
            updated.splice(index, 1);
            return updated;
        });
    };

    const handleSubmit = async () => {
        if (!title.trim()) {
            showToast.warning('제목을 입력해주세요.');
            return;
        }
        if (!content.trim()) {
            showToast.warning('내용을 입력해주세요.');
            return;
        }

        try {
            showToast.info('수정 중입니다...');

            const uploadedFiles = [];

            for (const filePreview of files) {
                // 기존 파일 (file이 null)은 그대로 유지
                if (!filePreview.file) {
                    const fileName = filePreview.url.split('/').pop()?.split('?')[0] || 'file';
                    uploadedFiles.push({ name: fileName, url: filePreview.url });
                    continue;
                }

                // 새로 추가된 파일만 업로드
                const presignedData = await getPresignedUrl(filePreview.file.name);
                
                const presignedUrl = presignedData?.presignedUrl || presignedData;
                if (!presignedUrl) {
                    throw new Error('Presigned URL을 받지 못했습니다.');
                }
                
                const fileUrl = await uploadFileToS3(presignedUrl, filePreview.file);
                uploadedFiles.push({ name: filePreview.file.name, url: fileUrl });
            }

            const result = await updateNotice(noticeId, title, content, uploadedFiles, deadlineDate);

            showToast.success('공지사항이 수정되었습니다!');
            setTimeout(() => {
                router.push(`/notice/${noticeId}`);
            }, 500);
        } catch (err) {
            console.error('공지 수정 실패:', err);
            showToast.error('공지 수정에 실패했습니다.');
        }
    };

    return {
        files,
        fileInputRef,
        onDrop,
        onDragOver,
        onClickDrop,
        onInputChange,
        removeAt,
        title,
        setTitle,
        deadlineDate,
        setDeadlineDate,
        handleSubmit,
        content,
        setContent,
        isLoading,
        initialContent,
    };
}
