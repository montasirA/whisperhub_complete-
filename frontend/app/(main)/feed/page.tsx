"use client";

import { useEffect, useState } from "react";
import {
    Heart,
    MessageCircle,
    MoreHorizontal,
    Play,
    RefreshCw,
    Send,
    Sparkles,
} from "lucide-react";

import { getPosts } from "@/services/postService";
import RightPanel from "@/components/layout/RightPanel";

interface User {
    id: string;
    username: string;
    display_name: string;
    emoji_avatar?: string;
    theme_color?: string;
    is_verified?: boolean;
}

interface Media {
    id: string;
    media_type: "image" | "video" | "gif";
    file: string;
}

interface Post {
    id: string;
    content?: string | null;
    author?: User;
    created_at?: string;
    media?: Media[];
    reaction_count?: number;
    comment_count?: number;
    user_reacted?: boolean;
}

export default function FeedPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const loadFeed = async () => {
        try {
            setError("");

            const data = await getPosts();

            if (Array.isArray(data)) {
                setPosts(data);
            } else if (Array.isArray(data?.results)) {
                setPosts(data.results);
            } else {
                setPosts([]);
            }
        } catch (err) {
            console.error("Failed to load feed:", err);
            setError("Couldn't load whispers.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        void loadFeed();
    }, []);

    const refreshFeed = async () => {
        setRefreshing(true);
        await loadFeed();
    };

    return (
        <div className="mx-auto flex w-full max-w-[1500px] gap-5 px-3 py-4 sm:px-4 lg:px-6 lg:py-6">

            {/* MAIN FEED */}
            <section className="min-w-0 flex-1">
                    {/* FEED HEADER */}
                    <div className="mb-5 mt-4 flex items-center justify-between">

                        <div>
                            <p className="text-sm font-semibold text-[var(--secondary)]">
                                Explore
                            </p>

                            <h1 className="text-2xl font-bold text-[var(--text)]">
                                Discover whispers
                            </h1>

                            <p className="mt-1 text-sm text-[var(--muted)]">
                                See what people are anonymously sharing.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={refreshFeed}
                            disabled={refreshing}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] transition hover:bg-[var(--surface-2)] hover:text-[var(--text)] disabled:opacity-50"
                        >
                            <RefreshCw
                                size={17}
                                className={
                                    refreshing
                                        ? "animate-spin"
                                        : ""
                                }
                            />
                        </button>

                    </div>

                    {/* DISCOVER FILTER */}
                    <div className="mb-5 flex gap-2 overflow-x-auto pb-1">

                        <button className="shrink-0 rounded-full bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-md">
                            For you
                        </button>

                        <button className="shrink-0 rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-2.5 text-sm text-[var(--muted)]">
                            Latest
                        </button>

                        <button className="shrink-0 rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-2.5 text-sm text-[var(--muted)]">
                            Trending
                        </button>

                    </div>

                    {/* LOADING */}
                    {loading && (
                        <div className="space-y-4">

                            {[1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="h-72 animate-pulse rounded-[28px] border border-[var(--border)] bg-[var(--surface)]"
                                />
                            ))}

                        </div>
                    )}

                    {/* ERROR */}
                    {!loading && error && (
                        <div className="rounded-[28px] border border-red-500/20 bg-red-500/5 p-8 text-center">

                            <p className="text-sm text-red-500">
                                {error}
                            </p>

                            <button
                                type="button"
                                onClick={refreshFeed}
                                className="mt-4 rounded-full bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-white"
                            >
                                Try again
                            </button>

                        </div>
                    )}

                    {/* EMPTY */}
                    {!loading &&
                        !error &&
                        posts.length === 0 && (
                            <div className="rounded-[30px] border border-[var(--border)] bg-[var(--card)] p-12 text-center shadow-[var(--shadow-soft)]">

                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary)]/15">
                                    <Sparkles
                                        size={27}
                                        className="text-[var(--primary)]"
                                    />
                                </div>

                                <h2 className="mt-5 text-xl font-bold text-[var(--text)]">
                                    No whispers yet
                                </h2>

                                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">
                                    The community is quiet right now.
                                    Be the first one to share something.
                                </p>

                            </div>
                        )}

                    {/* POSTS */}
                    {!loading &&
                        !error &&
                        posts.length > 0 && (
                            <div className="space-y-4">

                                {posts.map((post) => (
                                    <article
                                        key={post.id}
                                        className="overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-soft)]"
                                    >

                                        {/* AUTHOR */}
                                        <div className="flex items-center justify-between px-5 py-4">

                                            <div className="flex min-w-0 items-center gap-3">

                                                <div
                                                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl shadow-sm"
                                                    style={{
                                                        backgroundColor:
                                                            post.author
                                                                ?.theme_color ||
                                                            "var(--primary)",
                                                    }}
                                                >
                                                    {post.author
                                                        ?.emoji_avatar ||
                                                        "✨"}
                                                </div>

                                                <div className="min-w-0">

                                                    <div className="flex items-center gap-2">

                                                        <p className="truncate text-sm font-semibold text-[var(--text)]">
                                                            {post.author
                                                                ?.display_name ||
                                                                "Anonymous"}
                                                        </p>

                                                        {post.author
                                                            ?.is_verified && (
                                                            <span className="text-xs text-[var(--primary)]">
                                                                ✓
                                                            </span>
                                                        )}

                                                    </div>

                                                    <p className="text-xs text-[var(--muted)]">
                                                        @
                                                        {post.author
                                                            ?.username ||
                                                            "anonymous"}
                                                    </p>

                                                </div>

                                            </div>

                                            <button
                                                type="button"
                                                className="rounded-full p-2 text-[var(--muted)] hover:bg-[var(--surface)]"
                                            >
                                                <MoreHorizontal
                                                    size={18}
                                                />
                                            </button>

                                        </div>

                                        {/* CONTENT */}
                                        {post.content && (
                                            <div className="px-5 pb-4">

                                                <p className="whitespace-pre-wrap text-[15px] leading-7 text-[var(--text)]">
                                                    {post.content}
                                                </p>

                                            </div>
                                        )}

                                        {/* MEDIA */}
                                        {post.media &&
                                            post.media.length > 0 && (
                                                <div className="overflow-hidden bg-black/5">

                                                    {post.media.length ===
                                                    1 ? (
                                                        post.media[0]
                                                            .media_type ===
                                                        "video" ? (
                                                            <div className="relative">
                                                                <video
                                                                    src={
                                                                        post
                                                                            .media[0]
                                                                            .file
                                                                    }
                                                                    controls
                                                                    playsInline
                                                                    className="max-h-[650px] w-full object-cover"
                                                                />

                                                                <div className="pointer-events-none absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md">
                                                                    <Play
                                                                        size={
                                                                            15
                                                                        }
                                                                        fill="currentColor"
                                                                    />
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <img
                                                                src={
                                                                    post
                                                                        .media[0]
                                                                        .file
                                                                }
                                                                alt="Whisper"
                                                                className="max-h-[650px] w-full object-cover"
                                                            />
                                                        )
                                                    ) : (
                                                        <div className="grid grid-cols-2 gap-1">

                                                            {post.media
                                                                .slice(
                                                                    0,
                                                                    4
                                                                )
                                                                .map(
                                                                    (
                                                                        media
                                                                    ) =>
                                                                        media.media_type ===
                                                                        "video" ? (
                                                                            <video
                                                                                key={
                                                                                    media.id
                                                                                }
                                                                                src={
                                                                                    media.file
                                                                                }
                                                                                muted
                                                                                playsInline
                                                                                className="aspect-square w-full object-cover"
                                                                            />
                                                                        ) : (
                                                                            <img
                                                                                key={
                                                                                    media.id
                                                                                }
                                                                                src={
                                                                                    media.file
                                                                                }
                                                                                alt="Whisper"
                                                                                className="aspect-square w-full object-cover"
                                                                            />
                                                                        )
                                                                )}

                                                        </div>
                                                    )}

                                                </div>
                                            )}

                                        {/* ACTIONS */}
                                        <div className="flex items-center gap-1 border-t border-[var(--border)] px-4 py-2">

                                            <button
                                                type="button"
                                                className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm transition ${
                                                    post.user_reacted
                                                        ? "text-pink-500"
                                                        : "text-[var(--muted)] hover:bg-[var(--surface)] hover:text-pink-500"
                                                }`}
                                            >
                                                <Heart
                                                    size={18}
                                                    fill={
                                                        post.user_reacted
                                                            ? "currentColor"
                                                            : "none"
                                                    }
                                                />

                                                {post.reaction_count ||
                                                    0}
                                            </button>

                                            <button
                                                type="button"
                                                className="flex items-center gap-2 rounded-full px-4 py-2.5 text-sm text-[var(--muted)] transition hover:bg-[var(--surface)] hover:text-[var(--text)]"
                                            >
                                                <MessageCircle
                                                    size={18}
                                                />

                                                {post.comment_count ||
                                                    0}
                                            </button>

                                            <button
                                                type="button"
                                                className="ml-auto flex h-9 w-9 items-center justify-center rounded-full text-[var(--muted)] hover:bg-[var(--surface)]"
                                            >
                                                <Send size={17} />
                                            </button>

                                        </div>

                                    </article>
                                ))}

                            </div>
                        )}

            </section>

            {/* RIGHT PANEL */}
            <aside className="hidden w-[260px] shrink-0 xl:block">
                <RightPanel />
            </aside>

        </div>
    );
}