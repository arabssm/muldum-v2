"use client"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Toast() {
  const handleSuccess = () => {
    toast.success("성공했습니다!");
  };
  const handleError = () => {
    toast.error("에러가 발생했습니다!");
  };
  const handlenoaccess = () => {
    toast.warning("권한이 부족합니다!")
  }
  return (
    <div>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </div>
  );
}
