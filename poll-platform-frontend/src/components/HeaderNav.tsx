// src/components/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HeaderNav() {
    const pathname = usePathname();

    const linkClass = (href: string) =>
        `hover:underline ${pathname === href ? "text-blue-600 font-semibold" : ""}`;

    return (
        <header className="bg-white shadow p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">🗳️ Poll Platform</h1>
            <nav className="space-x-4">
                <Link href="/" className={linkClass("/")}>
                    Home
                </Link>
                <Link href="/create-user" className={linkClass("/create-user")}>
                    Create User
                </Link>
                <Link href="/create-poll" className={linkClass("/create-poll")}>
                    Create Poll
                </Link>
                <Link href="/polls" className={linkClass("/polls")}>
                    View Polls
                </Link>
            </nav>
        </header>
    );
}
