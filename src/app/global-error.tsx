'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '2rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}>
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '3rem',
            maxWidth: '600px',
            width: '100%',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          }}>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '1rem',
            }}>
              심각한 오류가 발생했습니다
            </h1>
            <p style={{
              fontSize: '1.1rem',
              color: '#666',
              marginBottom: '2rem',
              lineHeight: '1.6',
            }}>
              애플리케이션에 문제가 발생했습니다. 페이지를 새로고침하거나 잠시 후 다시 시도해주세요.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={reset}
                style={{
                  flex: 1,
                  padding: '0.875rem 1.5rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: '#667eea',
                  color: 'white',
                }}
              >
                다시 시도
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                style={{
                  flex: 1,
                  padding: '0.875rem 1.5rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: '#48bb78',
                  color: 'white',
                }}
              >
                홈으로 이동
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
