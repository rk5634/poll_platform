// app/page.tsx
"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <h1 className="text-3xl font-bold mb-6">Welcome to the Poll Platform</h1>
      <p className="text-gray-600 mb-8">Choose an action to get started:</p>

      <div className="space-y-4 w-full max-w-sm">
        <Link href="/create-user" className="block w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
          👤 Create User
        </Link>
        <Link href="/create-poll" className="block w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">
          🗳️ Create Poll
        </Link>
        <Link href="/polls" className="block w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700">
          📊 View All Polls
        </Link>
      </div>
    </div>
  );
}
