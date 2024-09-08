'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function InvitePage({ params }: { params: { encryptedGroupId: string } }) {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new invite page with a mock symmetric key
    router.push(`/invite/${params.encryptedGroupId}/hacker`);
  }, [params.encryptedGroupId, router]);

  return <div>Redirecting...</div>;
}