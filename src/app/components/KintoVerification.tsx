import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import styles from './KintoVerification.module.css'

export default function KintoVerification() {
  const [isVerified, setIsVerified] = useState(false)
  const { isConnected, address } = useAuth()

  useEffect(() => {
    // Check if user is already verified
    if (isConnected && address) {
      checkVerificationStatus(address)
    }
  }, [isConnected, address])

  const checkVerificationStatus = async (address: string) => {
    // In a real app, you'd check the verification status from your backend
    console.log('Checking Kinto verification status for', address)
    // Simulate verification check
    setIsVerified(Math.random() > 0.5)
  }

  const handleVerification = async () => {
    if (!isConnected || !address) {
      console.error('User not connected')
      return
    }
    // In a real app, you'd integrate with Kinto's SDK here
    console.log('Initiating Kinto verification process for', address)
    // Simulate verification process
    setTimeout(() => {
      setIsVerified(true)
    }, 2000)
  }

  return (
    <div className={styles.kintoVerification}>
      {isVerified ? (
        <div className={styles.verified}>
          <span className={styles.verifiedIcon}>✅</span>
          Kinto ID Verified
        </div>
      ) : (
        <button className={styles.verifyButton} onClick={handleVerification}>
          Verify Kinto ID
        </button>
      )}
    </div>
  )
}