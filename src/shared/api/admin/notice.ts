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