import { EmotionCache } from '@emotion/cache';


export default interface EmotionProviderProps {
  children: React.ReactNode;
  emotionCache?: EmotionCache;
}