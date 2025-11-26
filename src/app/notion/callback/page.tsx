'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axiosInstance from '@/shared/lib/axiosInstance';
import Loading from '@/shared/ui/loading';
import { showToast } from '@/shared/ui/toast';

export default function NotionCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      showToast.error('Notion 연동이 취소되었습니다.');
      router.push('/');
      return;
    }

    if (code) {
      handleCallback(code, state);
    }
  }, [searchParams, router]);

  const handleCallback = async (code: string, state: string | null) => {
    try {
      await axiosInstance.post('/api/notion/oauth/callback', { 
        code, 
        state 
      });
      
      showToast.success('Notion 연동이 완료되었습니다!');
      
      // state에서 teamId 추출하여 리다이렉트
      if (state) {
        try {
          const stateData = JSON.parse(state);
          if (stateData.teamId) {
            router.push(`/team/${stateData.teamId}`);
            return;
          }
        } catch (e) {
          console.error('State 파싱 실패:', e);
        }
      }
      
      router.push('/');
    } catch (error: any) {
      console.error('Notion 연동 실패:', error);
      showToast.error('Notion 연동에 실패했습니다.');
      router.push('/');
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      gap: '1rem'
    }}>
      <Loading />
      <p>Notion 연동 중...</p>
    </div>
  );
}
