'use client'
import { getStoredUTMs } from '@/hooks/get-utm-params';
import { useEffect } from 'react'

export function UTMTracker() {
  useEffect(() => {
    getStoredUTMs();
  }, []);

  return null; 
}