"use client";

import { useEffect, useState } from "react";
import {
    ArrowLeft,
    Check,
    Loader2,
    LogOut,
    Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import { updateProfile } from "@/services/authService";

export default function SettingsPage() {
    const router = useRouter();

    const {
        user,
        refreshUser,
        logout,
    } = useAuth();

    const [username, setUsername] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [bio, setBio] = useState("");
    const [statusMessage, setStatusMessage] = useState("");
    const [emojiAvatar, setEmojiAvatar] = useState("🐱");
    const [themeColor, setThemeColor] = useState("#7C5CFC");
    const [privacyLevel, setPrivacyLevel] = useState("public");

    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (!user) return;

        setUsername(user.username || "");
        setDisplayName(user.display_name || "");
        setBio(user.bio || "");
        setStatusMessage(user.status_message || "");
        setEmojiAvatar(user.emoji_avatar || "🐱");
        setThemeColor(user.theme_color || "#7C5CFC");
        setPrivacyLevel(user.privacy_level || "public");
    }, [user]);

    const handleSave = async () => {
        setSaving(true);
        setSuccess("");
        setError("");

        try {
            const formData = new FormData();

            formData.append("username", username.trim());
            formData.append("display_name", displayName.trim());
            formData.append("bio", bio.trim());
            formData.append(
                "status_message",
                statusMessage.trim()
            );
            formData.append("emoji_avatar", emojiAvatar);
            formData.append("theme_color", themeColor);
            formData.append("privacy_level", privacyLevel);

            await updateProfile(formData);

            await refreshUser();

            setSuccess("Changes saved successfully.");

        } catch (err: any) {
            console.error("Settings update failed:", err);

            const data = err?.response?.data;

            if (data?.username) {
                setError(
                    Array.isArray(data.username)
                        ? data.username.join(" ")
                        : data.username
                );
            } else {
                setError(
                    data?.detail ||
                    "Could not save your changes."
                );
            }
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    if (!user) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[var(--page-gradient)]">
                <Loader2
                    className="animate-spin text-[var(--primary)]"
                    size={24}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--page-gradient)]" role="main">

            <div className="mx-auto w-full max-w-[900px] px-4 py-6 sm:px-6">

                {/* HEADER */}
                <div className="mb-5 flex items-center gap-3">

                    <button
                        type="button"
                        onClick={() => router.push("/feed")}
                        className="rounded-full p-2 text-[var(--muted)] transition hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
                    >
                        <ArrowLeft size={20} />
                    </button>

                    <div>
                        <div className="flex items-center gap-2">
                            <Settings
                                size={20}
                                className="text-[var(--primary)]"
                            />

                            <h1 className="text-xl font-bold text-[var(--text)]">
                                Settings
                            </h1>
                        </div>

                        <p className="text-sm text-[var(--muted)]">
                            Manage your WhisperHub profile.
                        </p>
                    </div>

                </div>


                {/* PROFILE */}
                <section className="rounded-[28px] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-soft)] sm:p-6">

                    <h2 className="text-lg font-semibold text-[var(--text)]">
                        Profile
                    </h2>

                    <p className="mt-1 text-sm text-[var(--muted)]">
                        Change how people see you on WhisperHub.
                    </p>


                    {/* AVATAR */}
                    <div className="mt-6 flex items-center gap-4">

                        <div
                            className="flex h-16 w-16 items-center justify-center rounded-full text-3xl shadow-sm"
                            style={{
                                backgroundColor: themeColor,
                            }}
                        >
                            {emojiAvatar}
                        </div>

                        <div>
                            <p className="font-medium text-[var(--text)]">
                                Your avatar
                            </p>

                            <p className="text-xs text-[var(--muted)]">
                                Choose an emoji below.
                            </p>
                        </div>

                    </div>


                    {/* EMOJI */}
                    <div className="mt-5">

                        <label className="mb-2 block text-sm font-medium text-[var(--text)]">
                            Emoji avatar
                        </label>

                        <div className="flex flex-wrap gap-2">

                            {[
                                "🐱",
                                "🐶",
                                "🦊",
                                "🐼",
                                "🐸",
                                "🐨",
                                "🐰",
                                "🦄",
                                "🌸",
                                "✨",
                                "🌙",
                                "⭐",
                            ].map((emoji) => (
                                <button
                                    key={emoji}
                                    type="button"
                                    onClick={() =>
                                        setEmojiAvatar(emoji)
                                    }
                                    className={`flex h-11 w-11 items-center justify-center rounded-xl border text-xl transition ${
                                        emojiAvatar === emoji
                                            ? "border-[var(--primary)] bg-[var(--primary)]/15"
                                            : "border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)]"
                                    }`}
                                >
                                    {emoji}
                                </button>
                            ))}

                        </div>

                    </div>


                    {/* USERNAME */}
                    <div className="mt-5">

                        <label className="mb-2 block text-sm font-medium text-[var(--text)]">
                            Username
                        </label>

                        <input
                            value={username}
                            onChange={(e) =>
                                setUsername(e.target.value)
                            }
                            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)]"
                        />

                    </div>


                    {/* DISPLAY NAME */}
                    <div className="mt-4">

                        <label className="mb-2 block text-sm font-medium text-[var(--text)]">
                            Display name
                        </label>

                        <input
                            value={displayName}
                            onChange={(e) =>
                                setDisplayName(e.target.value)
                            }
                            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)]"
                        />

                    </div>


                    {/* BIO */}
                    <div className="mt-4">

                        <label className="mb-2 block text-sm font-medium text-[var(--text)]">
                            Bio
                        </label>

                        <textarea
                            value={bio}
                            onChange={(e) =>
                                setBio(e.target.value)
                            }
                            rows={3}
                            placeholder="Tell people a little about yourself..."
                            className="w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm leading-6 text-[var(--text)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--primary)]"
                        />

                    </div>


                    {/* STATUS */}
                    <div className="mt-4">

                        <label className="mb-2 block text-sm font-medium text-[var(--text)]">
                            Status message
                        </label>

                        <input
                            value={statusMessage}
                            onChange={(e) =>
                                setStatusMessage(e.target.value)
                            }
                            maxLength={100}
                            placeholder="What's your mood?"
                            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--primary)]"
                        />

                    </div>


                    {/* THEME COLOR */}
                    <div className="mt-5">

                        <label className="mb-2 block text-sm font-medium text-[var(--text)]">
                            Theme color
                        </label>

                        <div className="flex flex-wrap gap-3">

                            {[
                                "#7C5CFC",
                                "#EC4899",
                                "#06B6D4",
                                "#10B981",
                                "#F59E0B",
                                "#EF4444",
                            ].map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() =>
                                        setThemeColor(color)
                                    }
                                    className="flex h-10 w-10 items-center justify-center rounded-full"
                                    style={{
                                        backgroundColor: color,
                                    }}
                                >
                                    {themeColor === color && (
                                        <Check
                                            size={18}
                                            className="text-white"
                                        />
                                    )}
                                </button>
                            ))}

                        </div>

                    </div>


                    {/* PRIVACY */}
                    <div className="mt-5">

                        <label className="mb-2 block text-sm font-medium text-[var(--text)]">
                            Privacy
                        </label>

                        <select
                            value={privacyLevel}
                            onChange={(e) =>
                                setPrivacyLevel(e.target.value)
                            }
                            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]"
                        >
                            <option value="public">
                                Public
                            </option>

                            <option value="friends">
                                Friends
                            </option>

                            <option value="private">
                                Private
                            </option>
                        </select>

                    </div>


                    {/* MESSAGES */}
                    {success && (
                        <div className="mt-5 rounded-2xl bg-green-500/10 px-4 py-3 text-sm text-green-500">
                            {success}
                        </div>
                    )}

                    {error && (
                        <div className="mt-5 rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-500">
                            {error}
                        </div>
                    )}


                    {/* SAVE */}
                    <div className="mt-6 flex justify-end">

                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                        >
                            {saving ? (
                                <>
                                    <Loader2
                                        size={16}
                                        className="animate-spin"
                                    />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Check size={16} />
                                    Save changes
                                </>
                            )}
                        </button>

                    </div>

                </section>


                {/* ACCOUNT */}
                <section className="mt-5 rounded-[28px] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-soft)] sm:p-6">

                    <h2 className="text-lg font-semibold text-[var(--text)]">
                        Account
                    </h2>

                    <div className="mt-4">

                        <p className="text-xs text-[var(--muted)]">
                            Email
                        </p>

                        <p className="mt-1 text-sm text-[var(--text)]">
                            {user.email}
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={handleLogout}
                        className="mt-6 flex items-center gap-2 rounded-full border border-red-500/20 px-5 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-500/10"
                    >
                        <LogOut size={16} />
                        Logout
                    </button>

                </section>

            </div>

        </div>
    );
}