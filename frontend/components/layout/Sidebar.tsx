"use client";

import Link from "next/link";
import {
    Compass,
    MessageCircleMore,
    Bell,
    Settings,
    UserRound,
    Sparkles,
} from "lucide-react";

import BrandLogo from "@/components/ui/BrandLogo";
import Avatar from "@/components/ui/Avatar";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const links = [
    { href: "/feed", label: "Explore", icon: Compass },
    { href: "/chats", label: "Chats", icon: MessageCircleMore },
    { href: "/notifications", label: "Alerts", icon: Bell },
    { href: "/profile", label: "Profile", icon: UserRound },
    { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { user } = useAuth();

    return (
        <aside className="hidden w-72 shrink-0 flex-col justify-between rounded-[34px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)] backdrop-blur-2xl lg:flex">

            <div className="space-y-6">

                {/* LOGO */}
                <div className="rounded-[26px] border border-[var(--border)] bg-[linear-gradient(135deg,var(--surface-2),var(--card))] p-4 shadow-[var(--shadow)]">
                    <BrandLogo />
                </div>

                {/* USER */}
                {user && (
                    <Link
                        href="/profile"
                        className="block rounded-[24px] border border-[var(--border)] bg-[linear-gradient(135deg,var(--card),var(--surface-2))] p-4 transition hover:bg-[var(--surface-2)]"
                    >
                        <div className="flex items-center gap-3">

                            <Avatar
                                name={user.username}
                                emoji={user.emoji_avatar || "🐱"}
                                color={user.theme_color || "var(--accent)"}
                            />

                            <div className="min-w-0">
                                <p className="truncate font-semibold text-[var(--text)]">
                                    {user.display_name || user.username}
                                </p>

                                <p className="truncate text-sm text-[var(--muted)]">
                                    @{user.username}
                                </p>
                            </div>

                        </div>
                    </Link>
                )}

                {/* NAVIGATION */}
                <nav className="space-y-2">

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
                                    className={`flex items-center gap-3 rounded-[20px] px-4 py-3 text-sm font-medium transition-all duration-300 ${
                                        active
                                            ? "bg-gradient-to-r from-[var(--primary)]/15 to-[var(--secondary)]/15 text-[var(--text)] shadow-[var(--shadow-glow)]"
                                            : "text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
                                    }`}
                                >

                                    <div
                                        className={`rounded-2xl p-2 ${
                                            active
                                                ? "bg-[var(--surface-2)] text-[var(--primary)]"
                                                : "bg-[var(--surface)] text-[var(--secondary)]"
                                        }`}
                                    >
                                        <Icon size={16} />
                                    </div>

                                    {label}

                                </Link>
                            );
                        }
                    )}

                </nav>

            </div>

            {/* FOOTER */}
            <div className="rounded-[24px] border border-[var(--border)] bg-[linear-gradient(135deg,var(--glow),var(--surface-2),var(--glow-secondary))] p-4 shadow-[var(--shadow)]">

                <div className="mb-3 flex items-center gap-2 text-[var(--text)]">
                    <Sparkles
                        size={16}
                        className="text-[var(--primary)]"
                    />

                    <p className="text-sm font-semibold">
                        Safe with strangers
                    </p>
                </div>

                <p className="text-sm leading-6 text-[var(--muted)]">
                    Your anonymous world stays playful,
                    private, and kind.
                </p>

            </div>

        </aside>
    );
}