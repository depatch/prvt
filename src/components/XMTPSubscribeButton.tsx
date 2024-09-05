import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button'
import { useWeb3Auth } from '@/hooks/useWeb3Auth'
import { createConsentMessage, createConsentProofPayload } from "@xmtp/consent-proof-signature"
import { Client } from '@xmtp/xmtp-js'

interface XMTPSubscribeButtonProps {
  broadcastAddress: string;
  broadcastName: string;
}

export function XMTPSubscribeButton({ broadcastAddress, broadcastName }: XMTPSubscribeButtonProps) {
  const [loading, setLoading] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { address, provider } = useWeb3Auth();

  useEffect(() => {
    const checkSubscription = async () => {
      if (address) {
        try {
          const response = await fetch(`/api/xmtp/subscriptions?address=${address}`);
          const subscriptions = await response.json();
          setSubscriptionStatus(subscriptions.some(sub => sub.broadcastAddress === broadcastAddress));
        } catch (err) {
          console.error("Error checking subscription:", err);
        }
      }
    };

    checkSubscription();
  }, [address, broadcastAddress]);

  const handleSubscribe = useCallback(async () => {
    if (!address || !provider) {
      setError("Please connect your wallet first");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const timestamp = Date.now();
      const message = createConsentMessage(broadcastAddress, timestamp);
      const signature = await provider.getSigner().signMessage(message);
      const payloadBytes = createConsentProofPayload(signature, timestamp);
      const base64Payload = Buffer.from(payloadBytes).toString('base64');

      // Create XMTP client
      const xmtp = await Client.create(provider.getSigner(), { env: "production" });

      // Subscribe to the broadcast
      await xmtp.contacts.allow([broadcastAddress]);

      // Send subscription to server
      const response = await fetch('/api/xmtp/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address,
          broadcastAddress,
          consentProof: base64Payload,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to subscribe');
      }

      setSubscriptionStatus(true);
    } catch (err) {
      console.error("Subscription error:", err);
      setError("Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [address, provider, broadcastAddress]);

  return (
    <div>
      <Button 
        onClick={handleSubscribe} 
        disabled={loading || subscriptionStatus}
      >
        {subscriptionStatus ? "Subscribed" : loading ? "Subscribing..." : `Subscribe to ${broadcastName}`}
      </Button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}