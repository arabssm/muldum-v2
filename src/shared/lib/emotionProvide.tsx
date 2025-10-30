'use client';

import { CacheProvider } from '@emotion/react';
import createEmotionCache from '@/shared/lib/emotionCache';
import EmotionProviderProps from './type'
import { useState } from 'react';



export default function EmotionProvider({
  children,
  emotionCache,
}: EmotionProviderProps) {
  const [clientSideEmotionCache] = useState(() => emotionCache || createEmotionCache());

  return (
    <CacheProvider value={clientSideEmotionCache}>{children}</CacheProvider>
  );
}
