"use client";
import { ErrorBoundary } from 'react-error-boundary';
import Header from "./components/Header";
// import ActiveSession from "./components/ActiveSession";

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </div>
  )
}

export default function Home() {
  return (
    <main className="flex flex-col items-center">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Header />
      </ErrorBoundary>
    </main>
  );
}