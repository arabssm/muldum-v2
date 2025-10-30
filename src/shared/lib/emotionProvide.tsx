'use client';

import { CacheProvider } from '@emotion/react';
import createEmotionCache from '@/shared/lib/emotionCache';
import { EmotionCache } from '@emotion/cache';
import { useState } from 'react';

interface EmotionProviderProps {
  children: React.ReactNode;
  emotionCache?: EmotionCache;
}

// This provider is now optional since we use EmotionRegistry in layout
// But keeping it for backward compatibility or specific use cases
export default function EmotionProvider({
  children,
  emotionCache,
}: EmotionProviderProps) {
  const [clientSideEmotionCache] = useState(() => emotionCache || createEmotionCache());

  return (
    <CacheProvider value={clientSideEmotionCache}>{children}</CacheProvider>
  );
}
