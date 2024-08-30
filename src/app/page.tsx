"use client"
import Link from 'next/link'
import Image from 'next/image'
import { ErrorBoundary } from 'react-error-boundary'
import { Header } from "../components/Header"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ConnectWalletButton } from "@/components/ConnectWalletButton"

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div role="alert" className="p-4 bg-red-100 text-red-700 rounded">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </div>
  )
}

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const isConnected = localStorage.getItem('isConnected')
    const isProfileCompleted = localStorage.getItem('isProfileCompleted')

    if (isConnected === 'true') {
      if (isProfileCompleted === 'true') {
        router.replace('/home')
      } else {
        router.replace('/complete-profile')
      }
    }
  }, [router])

  return (
    <main className="flex flex-col min-h-screen bg-[#111] text-white">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Header />
        <div className="flex-1 flex flex-col md:flex-row items-center justify-center px-4 md:px-12 py-8 md:py-16 relative">
          <div className="w-full md:w-1/2 flex flex-col justify-center mb-8 md:mb-0 z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              Chat app with <br />built-in privacy <br />& a dApp store
            </h1>
            <div className="flex flex-wrap gap-2 mb-6">
              {['#chat', '#clubs', '#perks', '#easy-to-use', '#AI', '#on-chain'].map((tag) => (
                <span key={tag} className="bg-[#222] px-3 py-1 rounded-full text-sm">{tag}</span>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <ConnectWalletButton className="w-full sm:w-auto" />
              <Button
                className="w-full sm:w-auto bg-white text-black hover:bg-gray-200"
                onClick={() => router.push('/learn-more')}
              >
                Learn More
              </Button>
            </div>
            <div className="flex items-center mb-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-8 h-8 bg-gray-500 rounded-full -ml-2 first:ml-0"></div>
              ))}
              <span className="ml-3 text-sm text-gray-400">Over 1k community clubs</span>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex items-center justify-center">
            <div className="relative w-80 h-80 md:w-96 md:h-96">
              <Image
                src="/circle-image.png"
                alt="Circle Image"
                layout="fill"
                objectFit="contain"
                priority
              />
            </div>
          </div>
        </div>
        <div className="absolute top-1/2 right-0 transform -translate-y-1/2 -translate-x-1/4 opacity-30 z-0">
          <div className="w-96 h-96 md:w-[600px] md:h-[600px] rounded-full bg-gradient-to-r from-purple-500 to-pink-500 blur-3xl"></div>
        </div>
        <footer className="p-4 text-center text-sm text-gray-500">
          PRVT. All rights reserved. © 2024
        </footer>
      </ErrorBoundary>
    </main>
  )
}