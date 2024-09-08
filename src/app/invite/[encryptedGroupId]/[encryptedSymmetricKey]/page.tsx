'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useXmtp } from '@/hooks/useXMTP';
import { decryptGroupId } from '@/utils/encryption';

export default function InvitePage({ params }: { params: { encryptedGroupId: string, encryptedSymmetricKey: string } }) {
  const router = useRouter();
  const { xmtpClient } = useXmtp();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const joinGroup = async () => {
      if (!xmtpClient) {
        setError('XMTP client not initialized. Please connect your wallet.');
        return;
      }

      try {
        const groupId = decryptGroupId(params.encryptedGroupId, params.encryptedSymmetricKey);
        console.log('Decrypted Group ID:', groupId);
        
        // Actually join the group using XMTP
        const conversation = await xmtpClient.conversations.newConversation(groupId);
        await conversation.send("Hello, I've joined the group!");
        
        console.log('Joined group:', groupId);
        
        router.push('/home'); // Redirect to home or group chat page
      } catch (err) {
        console.error('Failed to join group:', err);
        setError('Failed to join the group. The invite might be invalid or expired.');
      }
    };

    joinGroup();
  }, [xmtpClient, params.encryptedGroupId, params.encryptedSymmetricKey, router]);

  if (error) {
    return <div>{error}</div>;
  }

  return <div>Joining group...</div>;
}