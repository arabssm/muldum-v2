"use client"

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import useGoogleLogin from "@/shared/hooks/useGoogleLogin";

function GoogleLoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { handleGoogleCallback } = useGoogleLogin();

  useEffect(() => {
    const processLogin = async () => {
      try {
        const code = searchParams?.get('code');
        
        if (!code) {
          console.warn('No authorization code found');
          router.replace('/');
          return;
        }
        
        console.log('Google OAuth code detected:', code);
        await handleGoogleCallback(code);
        console.log('Google login successful');
        router.replace('/');
      } catch (error) {
        console.error('Google 로그인 실패:', error);
        router.replace('/');
      }
    };

    processLogin();
  }, [searchParams, handleGoogleCallback, router]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <div>로그인 처리 중...</div>
    </div>
  );
}

export default function GoogleLoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GoogleLoginContent />
    </Suspense>
  );
}
