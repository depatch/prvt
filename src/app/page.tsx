import Link from 'next/link';
import dynamic from 'next/dynamic';
import styles from './page.module.css';

const DynamicConnectWalletButton = dynamic(() => import('../components/ConnectWalletButton'), { ssr: false });

export default function Home() {
  return (
    <main className={`${styles.main} flex min-h-screen flex-col items-center justify-between p-24`}>
      <div className={`${styles.contentContainer} z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex`}>
        <h1 className={`${styles.welcomeHeader} text-4xl font-bold mb-8`}>Welcome to PRVT Chat App</h1>
        <p className={`${styles.description} mb-4`}>Secure, blockchain-integrated communication</p>
        <div className={`${styles.buttonContainer} flex space-x-4`}>
          <Link href="/home" className={`${styles.launchAppButton} bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`}>
            Launch App
          </Link>
        </div>
      </div>
    </main>
  );
}