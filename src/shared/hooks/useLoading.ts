"use client";

import { useState, useEffect } from 'react';

interface UseLoadingOptions {
  delay?: number;
  minLoadingTime?: number;
}

export function useLoading(options: UseLoadingOptions = {}) {
  const { delay = 0, minLoadingTime = 500 } = options;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const startTime = Date.now();
    
    const timer = setTimeout(() => {
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsed);
      
      setTimeout(() => {
        setIsLoading(false);
      }, remainingTime);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, minLoadingTime]);

  return { isLoading, setIsLoading };
}

export function useAsyncLoading<T>(
  asyncFunction: () => Promise<T>,
  dependencies: any[] = []
) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await asyncFunction();
        
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return { isLoading, data, error, setIsLoading };
}