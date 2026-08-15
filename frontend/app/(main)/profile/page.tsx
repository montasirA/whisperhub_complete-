"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
    Check,
    Edit3,
    Grid3X3,
    Loader2,
    Lock,
    Play,
    Sparkles,
    UserRound,
    X,
} from "lucide-react";

import { getCurrentUser, updateProfile } from "@/services/authService";
import { getPosts } from "@/services/postService";
import { useAuth } from "@/context/AuthContext";

interface User {
    id: string;
    email?: string;
    username: string;
    display_name: string;
    bio?: string | null;
    avatar?: string | null;
    emoji_avatar?: string;
    theme_color?: string;
    status_message?: string | null;
    privacy_level?: string;
    is_verified?: boolean;
    is_online?: boolean;
    date_joined?: string;
}

interface PostMedia {
    id: string;
    media_type: "image" | "video" | "gif";
    file: string;
}

interface Post {
    id: string;
    content?: string | null;
    author?: User;
    created_at?: string;
    media?: PostMedia[];
    reaction_count?: number;
    comment_count?: number;
}

function formatDate(dateString?: string) {
    if (!dateString) return "New here";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return "New here";
    }

    return date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });
}

export default function ProfilePage() {
    const { token } = useAuth();

    const [user, setUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);

    const [loading, setLoading] = useState(true);
    const [postsLoading, setPostsLoading] = useState(true);

    const [error, setError] = useState("");

    const [showEdit, setShowEdit] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState("");

    const [displayName, setDisplayName] = useState("");
    const [bio, setBio] = useState("");
    const [emojiAvatar, setEmojiAvatar] = useState("✨");
    const [themeColor, setThemeColor] = useState("#8b5cf6");
    const [statusMessage, setStatusMessage] = useState("");
    const [privacyLevel, setPrivacyLevel] = useState("public");

    useEffect(() => {
        if (!token) return;

        const loadProfile = async () => {
            try {
                setLoading(true);
                setError("");

                const currentUser = await getCurrentUser();

                setUser(currentUser);

                setDisplayName(currentUser?.display_name || "");
                setBio(currentUser?.bio || "");
                setEmojiAvatar(currentUser?.emoji_avatar || "✨");
                setThemeColor(currentUser?.theme_color || "#8b5cf6");
                setStatusMessage(currentUser?.status_message || "");
                setPrivacyLevel(currentUser?.privacy_level || "public");
            } catch (err) {
                console.error("Failed to load profile:", err);
                setError("Could not load your profile.");
            } finally {
                setLoading(false);
            }
        };

        void loadProfile();
    }, [token]);

    useEffect(() => {
        if (!token || !user?.id) return;

        const loadPosts = async () => {
            try {
                setPostsLoading(true);

                const data = await getPosts();

                let allPosts: Post[] = [];

                if (Array.isArray(data)) {
                    allPosts = data;
                } else if (Array.isArray(data?.results)) {
                    allPosts = data.results;
                }

                const ownPosts = allPosts.filter(
                    (post) => post.author?.id === user.id
                );

                setPosts(ownPosts);
            } catch (err) {
                console.error("Failed to load profile posts:", err);
                setPosts([]);
            } finally {
                setPostsLoading(false);
            }
        };

        void loadPosts();
    }, [token, user?.id]);

    const openEditProfile = () => {
        if (!user) return;

        setDisplayName(user.display_name || "");
        setBio(user.bio || "");
        setEmojiAvatar(user.emoji_avatar || "✨");
        setThemeColor(user.theme_color || "#8b5cf6");
        setStatusMessage(user.status_message || "");
        setPrivacyLevel(user.privacy_level || "public");
        setSaveMessage("");
        setShowEdit(true);
    };

    const handleSave = async () => {
        if (!user || saving) return;

        try {
            setSaving(true);
            setSaveMessage("");
            setError("");

            const updated = await updateProfile({
                display_name: displayName.trim(),
                bio: bio.trim(),
                emoji_avatar: emojiAvatar,
                theme_color: themeColor,
                status_message: statusMessage.trim(),
                privacy_level: privacyLevel,
            });

            const nextUser: User = {
                ...user,
                ...updated,
            };

            setUser(nextUser);

            setDisplayName(nextUser.display_name || "");
            setBio(nextUser.bio || "");
            setEmojiAvatar(nextUser.emoji_avatar || "✨");
            setThemeColor(nextUser.theme_color || "#8b5cf6");
            setStatusMessage(nextUser.status_message || "");
            setPrivacyLevel(nextUser.privacy_level || "public");

            setSaveMessage("Profile updated successfully.");

            setTimeout(() => {
                setShowEdit(false);
            }, 700);
        } catch (err: unknown) {
            console.error("Profile update failed:", err);

            let message = "Unable to update your profile.";

            if (axios.isAxiosError(err)) {
                const data = err.response?.data;

                if (data?.detail) {
                    message = data.detail;
                } else if (data) {
                    const firstError = Object.values(data)[0];

                    if (Array.isArray(firstError)) {
                        message = firstError.join(" ");
                    } else if (typeof firstError === "string") {
                        message = firstError;
                    }
                }
            }

            setSaveMessage(message);
        } finally {
            setSaving(false);
        }
    };

    const postCount = posts.length;

    const mediaCount = useMemo(
        () =>
            posts.reduce(
                (total, post) => total + (post.media?.length || 0),
                0
            ),
        [posts]
    );

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[var(--page-gradient)]">
                <div className="flex items-center gap-3 text-[var(--muted)]">
                    <Loader2 size={20} className="animate-spin" />
                    Loading profile...
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[var(--page-gradient)] p-5">
                <div className="w-full max-w-md rounded-[30px] border border-[var(--border)] bg-[var(--card)] p-8 text-center shadow-[var(--shadow)]">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                        <UserRound size={24} />
                    </div>

                    <h1 className="mt-4 text-xl font-bold text-[var(--text)]">
                        Profile unavailable
                    </h1>

                    <p className="mt-2 text-sm text-[var(--muted)]">
                        {error || "We couldn&apos;t load your profile."}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--page-gradient)]" role="main">
            <div className="pointer-events-none fixed left-10 top-10 h-40 w-40 rounded-full bg-[var(--page-glow-primary)] blur-3xl" />
            <div className="pointer-events-none fixed bottom-10 right-10 h-48 w-48 rounded-full bg-[var(--page-glow-secondary)] blur-3xl" />

            <div className="relative mx-auto w-full max-w-[1000px] px-3 py-5 sm:px-5 lg:py-8">

                {/* HEADER */}
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-semibold text-[var(--secondary)]">
                            WhisperHub
                        </p>

                        <h1 className="text-2xl font-bold text-[var(--text)]">
                            Your profile
                        </h1>
                    </div>

                    <button
                        type="button"
                        onClick={openEditProfile}
                        className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-semibold text-[var(--text)] shadow-[var(--shadow-soft)] transition hover:bg-[var(--surface-2)]"
                    >
                        <Edit3 size={16} />
                        <span className="hidden sm:inline">
                            Edit profile
                        </span>
                    </button>
                </div>

                {/* HERO */}
                <section className="overflow-hidden rounded-[32px] border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow)]">

                    {/* COVER */}
                    <div
                        className="relative h-44 overflow-hidden sm:h-56"
                        style={{
                            background: `linear-gradient(135deg, ${themeColor}, var(--secondary), var(--primary))`,
                        }}
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,.25),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,.18),transparent_25%)]" />

                        <div className="absolute bottom-4 left-5 rounded-full border border-white/20 bg-black/20 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-xl">
                            Anonymous by design ✨
                        </div>
                    </div>

                    {/* INFO */}
                    <div className="relative px-5 pb-6 sm:px-7">

                        <div className="-mt-14 flex items-end justify-between sm:-mt-16">
                            <div
                                className="flex h-28 w-28 items-center justify-center rounded-full border-[6px] border-[var(--card)] text-4xl shadow-xl sm:h-32 sm:w-32"
                                style={{
                                    backgroundColor:
                                        user.theme_color || "var(--primary)",
                                }}
                            >
                                {user.emoji_avatar || "✨"}
                            </div>

                            <button
                                type="button"
                                onClick={openEditProfile}
                                className="mb-2 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-4 py-2 text-sm font-semibold text-white shadow-lg"
                            >
                                Edit profile
                            </button>
                        </div>

                        <div className="mt-4">
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="text-2xl font-bold text-[var(--text)]">
                                    {user.display_name || "Anonymous"}
                                </h2>

                                {user.is_verified && (
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--primary)] text-white">
                                        <Check size={12} />
                                    </span>
                                )}
                            </div>

                            <p className="mt-1 text-sm text-[var(--muted)]">
                                @{user.username}
                            </p>
                        </div>

                        {user.status_message && (
                            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs text-[var(--muted)]">
                                <Sparkles
                                    size={13}
                                    className="text-[var(--primary)]"
                                />
                                {user.status_message}
                            </div>
                        )}

                        <p className="mt-4 max-w-2xl whitespace-pre-wrap text-sm leading-6 text-[var(--muted)]">
                            {user.bio ||
                                "No bio yet. Add a little something about yourself."}
                        </p>

                        <p className="mt-3 text-xs text-[var(--muted)]">
                            Joined {formatDate(user.date_joined)}
                        </p>

                        {/* STATS */}
                        <div className="mt-6 grid grid-cols-3 overflow-hidden rounded-[24px] border border-[var(--border)] bg-[var(--surface)]">

                            <div className="p-4 text-center">
                                <p className="text-xl font-bold text-[var(--text)]">
                                    {postCount}
                                </p>

                                <p className="mt-1 text-xs text-[var(--muted)]">
                                    Whispers
                                </p>
                            </div>

                            <div className="border-x border-[var(--border)] p-4 text-center">
                                <p className="text-xl font-bold text-[var(--text)]">
                                    {mediaCount}
                                </p>

                                <p className="mt-1 text-xs text-[var(--muted)]">
                                    Media
                                </p>
                            </div>

                            <div className="p-4 text-center">
                                <p className="flex items-center justify-center gap-1 text-xl font-bold text-[var(--text)]">
                                    {user.privacy_level === "private" ? (
                                        <Lock size={17} />
                                    ) : (
                                        "✦"
                                    )}
                                </p>

                                <p className="mt-1 text-xs text-[var(--muted)]">
                                    {user.privacy_level === "private"
                                        ? "Private"
                                        : "Public"}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* TABS */}
                <div className="mt-5 flex rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-2 shadow-[var(--shadow-soft)]">
                    <div className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[var(--primary)]/15 px-4 py-3 text-sm font-semibold text-[var(--text)]">
                        <Grid3X3
                            size={16}
                            className="text-[var(--primary)]"
                        />
                        Whispers
                    </div>

                    <div className="flex flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm text-[var(--muted)]">
                        <Sparkles
                            size={16}
                            className="text-[var(--secondary)]"
                        />
                        Highlights
                    </div>
                </div>

                {/* POSTS */}
                <section className="mt-5">
                    <div className="mb-3">
                        <h2 className="font-semibold text-[var(--text)]">
                            Your whispers
                        </h2>

                        <p className="text-xs text-[var(--muted)]">
                            Everything you&apos;ve shared with the WhisperHub
                            community.
                        </p>
                    </div>

                    {postsLoading ? (
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {[1, 2, 3, 4, 5, 6].map((item) => (
                                <div
                                    key={item}
                                    className="aspect-square animate-pulse rounded-[22px] border border-[var(--border)] bg-[var(--surface)]"
                                />
                            ))}
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="rounded-[30px] border border-[var(--border)] bg-[var(--card)] p-10 text-center shadow-[var(--shadow-soft)]">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary)]/15">
                                <Sparkles
                                    size={26}
                                    className="text-[var(--primary)]"
                                />
                            </div>

                            <h3 className="mt-4 text-lg font-semibold text-[var(--text)]">
                                No whispers yet
                            </h3>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">
                                Your thoughts, confessions, photos and little
                                moments will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {posts.map((post) => {
                                const media = post.media?.[0];

                                if (media) {
                                    return (
                                        <article
                                            key={post.id}
                                            className="group relative aspect-square overflow-hidden rounded-[22px] border border-[var(--border)] bg-[var(--surface)]"
                                        >
                                            {media.media_type === "video" ? (
                                                <video
                                                    src={media.file}
                                                    preload="metadata"
                                                    muted
                                                    playsInline
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <img
                                                    src={media.file}
                                                    alt="Whisper"
                                                    className="h-full w-full object-cover"
                                                />
                                            )}

                                            <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-b from-black/20 via-transparent to-black/70 p-3 opacity-0 transition group-hover:opacity-100">
                                                <div className="flex justify-end">
                                                    {media.media_type ===
                                                        "video" && (
                                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md">
                                                            <Play
                                                                size={14}
                                                                fill="currentColor"
                                                            />
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex justify-between text-xs text-white">
                                                    <span>
                                                        ❤️{" "}
                                                        {post.reaction_count ||
                                                            0}
                                                    </span>

                                                    <span>
                                                        💬{" "}
                                                        {post.comment_count ||
                                                            0}
                                                    </span>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                }

                                return (
                                    <article
                                        key={post.id}
                                        className="aspect-square overflow-hidden rounded-[22px] border border-[var(--border)] bg-[var(--surface)] p-5"
                                    >
                                        <div className="flex h-full flex-col justify-between">
                                            <span className="inline-flex w-fit items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--card)] px-2.5 py-1 text-[10px] text-[var(--muted)]">
                                                <Sparkles size={10} />
                                                Thought
                                            </span>

                                            <p className="line-clamp-7 whitespace-pre-wrap text-sm leading-6 text-[var(--text)]">
                                                {post.content ||
                                                    "A quiet whisper..."}
                                            </p>

                                            <div className="flex justify-between text-xs text-[var(--muted)]">
                                                <span>
                                                    ❤️{" "}
                                                    {post.reaction_count || 0}
                                                </span>

                                                <span>
                                                    💬{" "}
                                                    {post.comment_count || 0}
                                                </span>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* PRIVACY */}
                <section className="mt-5 rounded-[28px] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-soft)]">
                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--primary)]/15">
                            {user.privacy_level === "private" ? (
                                <Lock
                                    size={18}
                                    className="text-[var(--primary)]"
                                />
                            ) : (
                                <Sparkles
                                    size={18}
                                    className="text-[var(--primary)]"
                                />
                            )}
                        </div>

                        <div>
                            <h3 className="font-semibold text-[var(--text)]">
                                {user.privacy_level === "private"
                                    ? "Your profile is private"
                                    : "Your profile is visible"}
                            </h3>

                            <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                                {user.privacy_level === "private"
                                    ? "Only people you allow will be able to discover your profile and whispers."
                                    : "Your profile can be discovered by other people in the WhisperHub community."}
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            {/* EDIT MODAL */}
            {showEdit && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
                    <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[30px] border border-[var(--border)] bg-[var(--card)] p-5 shadow-2xl sm:p-6">

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--secondary)]">
                                    Profile
                                </p>

                                <h2 className="mt-1 text-xl font-bold text-[var(--text)]">
                                    Edit your profile
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowEdit(false)}
                                className="rounded-full p-2 text-[var(--muted)] hover:bg-[var(--surface-2)]"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* PREVIEW */}
                        <div className="mt-5 flex items-center gap-4 rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-4">
                            <div
                                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-2xl"
                                style={{
                                    backgroundColor: themeColor,
                                }}
                            >
                                {emojiAvatar}
                            </div>

                            <div className="min-w-0">
                                <p className="truncate font-semibold text-[var(--text)]">
                                    {displayName || "Anonymous"}
                                </p>

                                <p className="truncate text-sm text-[var(--muted)]">
                                    @{user.username}
                                </p>
                            </div>
                        </div>

                        {/* DISPLAY NAME */}
                        <div className="mt-5">
                            <label className="mb-2 block text-sm font-medium text-[var(--text)]">
                                Display name
                            </label>

                            <input
                                value={displayName}
                                onChange={(e) =>
                                    setDisplayName(e.target.value)
                                }
                                maxLength={60}
                                className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]"
                                placeholder="Your display name"
                            />
                        </div>

                        {/* BIO */}
                        <div className="mt-4">
                            <label className="mb-2 block text-sm font-medium text-[var(--text)]">
                                Bio
                            </label>

                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                maxLength={150}
                                rows={3}
                                className="w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm leading-6 text-[var(--text)] outline-none focus:border-[var(--primary)]"
                                placeholder="Tell people a little about you..."
                            />
                        </div>

                        {/* STATUS */}
                        <div className="mt-4">
                            <label className="mb-2 block text-sm font-medium text-[var(--text)]">
                                Status
                            </label>

                            <input
                                value={statusMessage}
                                onChange={(e) =>
                                    setStatusMessage(e.target.value)
                                }
                                maxLength={100}
                                className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]"
                                placeholder="e.g. Listening to late night thoughts ✨"
                            />
                        </div>

                        {/* EMOJI */}
                        <div className="mt-5">
                            <label className="mb-2 block text-sm font-medium text-[var(--text)]">
                                Avatar
                            </label>

                            <div className="grid grid-cols-8 gap-2">
                                {[
                                    "✨",
                                    "🌙",
                                    "⭐",
                                    "🌸",
                                    "🦋",
                                    "🐱",
                                    "🐼",
                                    "🪐",
                                    "☁️",
                                    "🍓",
                                    "🍀",
                                    "🌻",
                                    "🎧",
                                    "🎨",
                                    "💫",
                                    "👻",
                                ].map((emoji) => (
                                    <button
                                        key={emoji}
                                        type="button"
                                        onClick={() =>
                                            setEmojiAvatar(emoji)
                                        }
                                        className={`flex aspect-square items-center justify-center rounded-2xl border text-xl ${
                                            emojiAvatar === emoji
                                                ? "border-[var(--primary)] bg-[var(--primary)]/15"
                                                : "border-[var(--border)] bg-[var(--surface)]"
                                        }`}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* COLOR */}
                        <div className="mt-5">
                            <label className="mb-2 block text-sm font-medium text-[var(--text)]">
                                Avatar color
                            </label>

                            <div className="flex flex-wrap gap-3">
                                {[
                                    "#8b5cf6",
                                    "#ec4899",
                                    "#06b6d4",
                                    "#3b82f6",
                                    "#22c55e",
                                    "#f59e0b",
                                    "#ef4444",
                                    "#a855f7",
                                ].map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() =>
                                            setThemeColor(color)
                                        }
                                        className={`h-9 w-9 rounded-full border-2 ${
                                            themeColor === color
                                                ? "scale-110 border-white shadow-lg"
                                                : "border-transparent"
                                        }`}
                                        style={{
                                            backgroundColor: color,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* PRIVACY */}
                        <div className="mt-5">
                            <label className="mb-2 block text-sm font-medium text-[var(--text)]">
                                Profile visibility
                            </label>

                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setPrivacyLevel("public")
                                    }
                                    className={`rounded-2xl border p-4 text-left ${
                                        privacyLevel === "public"
                                            ? "border-[var(--primary)] bg-[var(--primary)]/10"
                                            : "border-[var(--border)] bg-[var(--surface)]"
                                    }`}
                                >
                                    <Sparkles
                                        size={18}
                                        className="text-[var(--primary)]"
                                    />

                                    <p className="mt-2 text-sm font-semibold text-[var(--text)]">
                                        Public
                                    </p>

                                    <p className="mt-1 text-xs text-[var(--muted)]">
                                        Discoverable by the community.
                                    </p>
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setPrivacyLevel("private")
                                    }
                                    className={`rounded-2xl border p-4 text-left ${
                                        privacyLevel === "private"
                                            ? "border-[var(--primary)] bg-[var(--primary)]/10"
                                            : "border-[var(--border)] bg-[var(--surface)]"
                                    }`}
                                >
                                    <Lock
                                        size={18}
                                        className="text-[var(--primary)]"
                                    />

                                    <p className="mt-2 text-sm font-semibold text-[var(--text)]">
                                        Private
                                    </p>

                                    <p className="mt-1 text-xs text-[var(--muted)]">
                                        Keep your profile more private.
                                    </p>
                                </button>
                            </div>
                        </div>

                        {saveMessage && (
                            <div
                                className={`mt-4 rounded-2xl px-4 py-3 text-sm ${
                                    saveMessage.includes("successfully")
                                        ? "bg-emerald-500/10 text-emerald-500"
                                        : "bg-red-500/10 text-red-500"
                                }`}
                            >
                                {saveMessage}
                            </div>
                        )}

                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setShowEdit(false)}
                                className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-2.5 text-sm font-semibold text-[var(--text)]"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
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
                    </div>
                </div>
            )}
        </div>
    );
}