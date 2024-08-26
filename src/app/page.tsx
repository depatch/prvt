"use client";
import Header from "./components/Header";
import LoggedIn from "./components/LoggedIn";

export default function Home() {
  return (
    <main className="flex flex-col items-center">
      <Header />
      <LoggedIn />
    </main>
  );
}
