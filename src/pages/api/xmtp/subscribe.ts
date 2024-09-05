import { NextApiRequest, NextApiResponse } from 'next'
import { Client } from '@xmtp/xmtp-js'
import { createConsentMessage } from '@xmtp/consent-proof-signature'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { address, broadcastAddress, consentProof } = req.body

  if (!address || !broadcastAddress || !consentProof) {
    return res.status(400).json({ message: 'Missing required parameters' })
  }

  try {
    // Verify the consent proof
    const isValid = await createConsentMessage(consentProof, broadcastAddress)

    if (!isValid) {
      return res.status(400).json({ message: 'Invalid consent proof' })
    }

    // TODO: Store the subscription in your database
    // This is where you'd typically save the subscription details

    // For demonstration purposes, we'll just log the subscription
    console.log(`User ${address} subscribed to ${broadcastAddress}`)

    return res.status(200).json({ message: 'Subscription successful' })
  } catch (error) {
    console.error('Subscription error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}