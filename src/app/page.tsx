"use client"
import Link from 'next/link'
import { ErrorBoundary } from 'react-error-boundary'
import { Header } from "../components/Header" // Adjust the path as needed

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div role="alert" className="p-4 bg-red-100 text-red-700 rounded">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </div>
  )
}

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#111]" >
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <div className="min-h-screen bg-[#111] text-white flex flex-col">
          <Header />
          <main className="flex-1 flex">
            <div className="w-1/2 flex flex-col justify-center p-12">
              <h1 className="text-6xl font-bold mb-4">Chat app with <br />built-in privacy <br />& a dApp store</h1>
              <div className="flex flex-wrap gap-2 mb-6">
                {['#chat', '#clubs', '#perks', '#easy-to-use', '#AI', '#on-chain'].map((tag) => (
                  <span key={tag} className="bg-[#222] px-3 py-1 rounded-full text-sm">{tag}</span>
                ))}
              </div>
              <Link href="/signup" className="bg-white text-black font-bold py-3 px-6 rounded-full inline-block w-max">
                Launch app
              </Link>
              <div className="mt-12">
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-8 h-8 bg-gray-500 rounded-full -ml-2 first:ml-0"></div>
                  ))}
                </div>
                <p className="text-sm text-gray-400">Over 1k community clubs</p>
              </div>
            </div>
            <div className="w-1/2 flex items-center justify-center">
              <div className="w-96 h-96 border-2 border-white rounded-full relative">
                {/* Add app icons here */}
              </div>
            </div>
          </main>
          <footer className="p-4 text-center text-sm text-gray-500">
            PRVT. All right reserved. © 2024
          </footer>
        </div>
      </ErrorBoundary>
    </main>
  )
}