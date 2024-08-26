"use client";
import Header from "./components/Header";
import LoggedIn from "./components/ActiveSession";

export default function Home() {
  return (
    <main className="flex flex-col items-center">
      <Header />
      <ActiveSession />
    </main>
  );
}
