"use client"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const handleSuccess = () => {
  toast.success("성공했습니다!");
};

export const handleError = () => {
  toast.error("에러가 발생했습니다!");
};

export const handlenoaccess = () => {
  toast.warning("권한이 부족합니다!")
};


export default function Toast() {
  return (
    <ToastContainer 
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
    />
  );
}
