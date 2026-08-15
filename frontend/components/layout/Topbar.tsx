"use client";

import Link from "next/link";
import {
    Bell,
    Compass,
    MessageCircleMore,
    Settings,
    UserRound,
} from "lucide-react";

import BrandLogo from "@/components/ui/BrandLogo";
import { usePathname } from "next/navigation";

const links = [
    {
        href: "/feed",
        label: "Explore",
        icon: Compass,
    },
    {
        href: "/chats",
        label: "Chats",
        icon: MessageCircleMore,
    },
    {
        href: "/notifications",
        label: "Alerts",
        icon: Bell,
    },
    {
        href: "/profile",
        label: "Profile",
        icon: UserRound,
    },
    {
        href: "/settings",
        label: "Settings",
        icon: Settings,
    },
];

export default function Topbar() {
    const pathname = usePathname();

    return (
        <div className="lg:hidden">

            {/* TOP */}
            <header className="flex items-center justify-between rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow)] backdrop-blur-2xl">

                <BrandLogo />

            </header>

            {/* MOBILE NAV */}
            <nav className="mt-3 flex items-center justify-between rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-2 shadow-[var(--shadow)]">

                {links.map(
                    ({
                        href,
                        label,
                        icon: Icon,
                    }) => {

                        const active =
                            pathname === href;

                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`flex flex-1 flex-col items-center gap-1 rounded-[18px] px-2 py-2 text-[10px] font-medium transition ${
                                    active
                                        ? "bg-[var(--primary)]/15 text-[var(--primary)]"
                                        : "text-[var(--muted)] hover:bg-[var(--surface-2)]"
                                }`}
                            >
                                <Icon size={18} />
                                {label}
                            </Link>
                        );
                    }
                )}

            </nav>

        </div>
    );
}