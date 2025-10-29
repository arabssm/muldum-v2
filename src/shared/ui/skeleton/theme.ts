export const skeletonTheme = {
  light: {
    background: 'linear-gradient(90deg, #f8f9fa 25%, #e9ecef 50%, #f8f9fa 75%)',
    shimmer: 'rgba(255,255,255,0.6)',
    border: '#e9ecef'
  },
  dark: {
    background: 'linear-gradient(90deg, #2d3748 25%, #4a5568 50%, #2d3748 75%)',
    shimmer: 'rgba(255,255,255,0.1)',
    border: '#4a5568'
  }
};

export type SkeletonTheme = keyof typeof skeletonTheme;