import axiosInstance from "@/shared/lib/axiosInstance";
import type { FilePayload } from "@/shared/types/notice";
import axios from "axios";

export const getNotices = async () => {
  const res = await axiosInstance.get("/ara/notice");
  return res.data;
};

export const getPresignedUrl = async (fileName: string) => {
  const res = await axiosInstance.get(`/files/presigned?fileName=${encodeURIComponent(fileName)}`);
  return res.data;
};

export const uploadFileToS3 = async (presignedUrl: string, file: File) => {
  console.log('uploadFileToS3 호출 - presignedUrl:', presignedUrl);
  console.log('uploadFileToS3 호출 - file:', file.name);
  
  if (!presignedUrl) {
    throw new Error('presignedUrl이 undefined입니다.');
  }
  
  await axios.put(presignedUrl, file, {
    headers: {
      'Content-Type': file.type,
    },
  });
  // presigned URL에서 실제 파일 URL 추출 (쿼리 파라미터 제거)
  return presignedUrl.split('?')[0];
};

export const createNoticeGeneral = async (
  title: string,
  content: string,
  files: FilePayload[],
  deadlineDate: string
) => {
  const { data, status } = await axiosInstance.post("/tch/notice", { title, content, files, deadlineDate });
  if (status < 200 || status >= 300) throw new Error(`업로드 실패 (status: ${status})`);
  return data;
};

export const updateNotice = async (
  noticeId: string,
  title: string,
  content: string,
  files: FilePayload[],
  deadlineDate: string
) => {
  console.log('updateNotice API 호출');
  console.log('URL:', `/tch/notice/${noticeId}`);
  console.log('요청 데이터:', { title, content, files, deadlineDate });
  
  const { data, status } = await axiosInstance.patch(`/tch/notice/${noticeId}`, { title, content, files, deadlineDate });
  
  console.log('응답 status:', status);
  console.log('응답 data:', data);
  
  if (status < 200 || status >= 300) throw new Error(`수정 실패 (status: ${status})`);
  return data;
};