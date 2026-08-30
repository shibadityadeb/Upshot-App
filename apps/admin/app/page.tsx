'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Spinner } from '@/components/ui';

export default function Index() {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === 'signed-in') router.replace('/dashboard');
    if (status === 'signed-out') router.replace('/login');
  }, [status, router]);

  return <Spinner label="Loading Upshot Admin…" />;
}
