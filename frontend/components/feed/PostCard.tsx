"use client";

import {
    Bookmark,
    Heart,
    MessageCircle,
    MoreHorizontal,
    Trash2,
    Send,
    Loader2,
    Share2,
} from "lucide-react";

import {
    useState,
} from "react";

import {
    motion,
} from "framer-motion";

import GlassCard from "@/components/ui/GlassCard";
import Avatar from "@/components/ui/Avatar";

import {
    reactToPost,
    deletePost,
    getComments,
    addComment,
    deleteComment,
    savePost,
    removeSaved,
} from "@/services/postService";


// ==========================
// TYPES
// ==========================

interface Author {
    id: string;
    username: string;
    display_name: string;
    avatar?: string | null;
    emoji_avatar?: string;
}

interface PostMedia {
    id: string;
    media_type: string;
    file: string;
    created_at: string;
}

interface Comment {
    id: string;
    content: string;
    author: Author;
    is_owner?: boolean;
    created_at?: string;
}

interface Post {
    id: string;

    author: Author;

    author_username: string;

    content: string | null;

    visibility: string;

    allow_comments: boolean;

    is_edited: boolean;

    media: PostMedia[];

    reaction_count: number;

    reactions: {
        like: number;
        love: number;
        laugh: number;
        sad: number;
        angry: number;
    };

    user_reacted?: boolean;

    user_reaction_id?: string | null;

    user_reaction_type?: string | null;

    comment_count: number;

    user_bookmarked?: boolean;

    user_bookmark_id?: string | null;

    created_at: string;

    updated_at: string;
}

interface PostCardProps {
    post: Post;

    currentUserId?: string;

    onDeleted?: (
        postId: string
    ) => void;
}


// ==========================
// TIME
// ==========================

function formatTime(
    dateString: string
) {

    const date =
        new Date(dateString);

    return date.toLocaleString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
        }
    );
}


// ==========================
// COMPONENT
// ==========================

export default function PostCard({
    post,
    currentUserId,
    onDeleted,
}: PostCardProps) {

    const [
        liked,
        setLiked
    ] = useState(
        post.user_reacted || false
    );

    const [
        bookmarked,
        setBookmarked
    ] = useState(
        post.user_bookmarked || false
    );

    const [
        bookmarkId,
        setBookmarkId
    ] = useState<string | null>(
        post.user_bookmark_id || null
    );

    const [
        reactionCount,
        setReactionCount
    ] = useState(
        post.reaction_count || 0
    );

    const [
        commentsOpen,
        setCommentsOpen
    ] = useState(false);

    const [
        comments,
        setComments
    ] = useState<Comment[]>([]);

    const [
        commentText,
        setCommentText
    ] = useState("");

    const [
        loadingComments,
        setLoadingComments
    ] = useState(false);

    const [
        sendingComment,
        setSendingComment
    ] = useState(false);

    const [
        deleting,
        setDeleting
    ] = useState(false);

    const isOwner =
        currentUserId === post.author?.id;


    // ==========================
    // REACTION
    // ==========================

    const handleReaction = async () => {

        try {

            const result =
                await reactToPost(
                    post.id,
                    "like"
                );

            if (
                result?.removed
            ) {

                setLiked(false);

                setReactionCount(
                    previous =>
                        Math.max(
                            0,
                            previous - 1
                        )
                );

            } else {

                if (!liked) {

                    setReactionCount(
                        previous =>
                            previous + 1
                    );

                }

                setLiked(true);
            }

        } catch (error) {

            console.error(
                "Reaction failed:",
                error
            );

        }
    };


    // ==========================
    // COMMENTS
    // ==========================

    const toggleComments =
        async () => {

            if (commentsOpen) {

                setCommentsOpen(
                    false
                );

                return;
            }

            setCommentsOpen(
                true
            );

            setLoadingComments(
                true
            );

            try {

                const data =
                    await getComments(
                        post.id
                    );

                if (
                    Array.isArray(data)
                ) {

                    setComments(data);

                } else {

                    setComments(
                        data?.results || []
                    );

                }

            } catch (error) {

                console.error(
                    "Comments failed:",
                    error
                );

            } finally {

                setLoadingComments(
                    false
                );
            }
        };


    // ==========================
    // ADD COMMENT
    // ==========================

    const handleAddComment =
        async () => {

            if (
                !commentText.trim()
            ) {
                return;
            }

            setSendingComment(
                true
            );

            try {

                const newComment =
                    await addComment(
                        post.id,
                        commentText.trim()
                    );

                setComments(
                    previous => [
                        newComment,
                        ...previous,
                    ]
                );

                setCommentText("");

            } catch (error) {

                console.error(
                    "Comment failed:",
                    error
                );

            } finally {

                setSendingComment(
                    false
                );
            }
        };


    // ==========================
    // DELETE COMMENT
    // ==========================

    const handleDeleteComment =
        async (
            commentId: string
        ) => {

            try {

                await deleteComment(
                    commentId
                );

                setComments(
                    previous =>
                        previous.filter(
                            comment =>
                                comment.id !==
                                commentId
                        )
                );

            } catch (error) {

                console.error(
                    "Delete comment failed:",
                    error
                );

            }
        };


    // ==========================
    // DELETE POST
    // ==========================

    const handleDeletePost =
        async () => {

            if (
                !window.confirm(
                    "Delete this post?"
                )
            ) {
                return;
            }

            setDeleting(
                true
            );

            try {

                await deletePost(
                    post.id
                );

                onDeleted?.(
                    post.id
                );

            } catch (error) {

                console.error(
                    "Delete post failed:",
                    error
                );

            } finally {

                setDeleting(
                    false
                );
            }
        };


        // ==========================
        // BOOKMARK / SAVE
        // ==========================

        const handleToggleSave = async () => {

            try {

                if (bookmarked && bookmarkId) {

                    await removeSaved(bookmarkId);

                    setBookmarked(false);

                    setBookmarkId(null);

                } else {

                    const result = await savePost(post.id);

                    // result should contain id and post
                    const id = result?.id || null;

                    setBookmarked(true);

                    setBookmarkId(id);

                }

            } catch (error) {

                console.error('Bookmark failed', error);

            }

        };


        // ==========================
        // SHARE
        // ==========================

        const handleShare = async () => {

            try {

                const url = `${window.location.origin}/feed#post-${post.id}`;

                if (navigator.share) {
                    await navigator.share({
                        title: 'WhisperHub post',
                        text: post.content || '',
                        url,
                    });
                    return;
                }

                if (navigator.clipboard) {
                    await navigator.clipboard.writeText(url);
                    alert('Post link copied');
                    return;
                }

                // fallback
                const dummy = document.createElement('textarea');
                document.body.appendChild(dummy);
                dummy.value = url;
                dummy.select();
                document.execCommand('copy');
                document.body.removeChild(dummy);
                alert('Post link copied');

            } catch (error) {
                console.error('Share failed', error);
                alert('Unable to share this post.');
            }

        };


    // ==========================
    // MEDIA
    // ==========================

    const media =
        post.media || [];


    return (

        <motion.article

            initial={{
                opacity: 0,
                y: 12,
            }}

            animate={{
                opacity: 1,
                y: 0,
            }}

            transition={{
                duration: 0.25,
            }}

            className="w-full"
        >

            <GlassCard
                className="overflow-hidden border border-[var(--border)] bg-[var(--card)] p-0"
            >

                {/* ==========================
                    HEADER
                ========================== */}

                <div className="flex items-center justify-between p-5">

                    <div className="flex items-center gap-3">

                        <Avatar
                            name={
                                post.author?.username ||
                                "Anonymous"
                            }
                            emoji={
                                post.author?.emoji_avatar ||
                                "👤"
                            }
                            color="var(--primary)"
                            size="md"
                        />

                        <div>

                            <p className="font-semibold text-[var(--text)]">

                                {
                                    post.author?.display_name ||
                                    "Anonymous"
                                }

                            </p>

                            <p className="text-xs text-[var(--muted)]">

                                @
                                {
                                    post.author?.username ||
                                    "anonymous"
                                }

                                {" · "}

                                {
                                    formatTime(
                                        post.created_at
                                    )
                                }

                            </p>

                        </div>

                    </div>


                    {isOwner && (

                        <button
                            type="button"
                            onClick={
                                handleDeletePost
                            }
                            disabled={deleting}
                            className="rounded-full p-2 text-[var(--muted)] transition hover:bg-red-500/10 hover:text-red-500"
                        >

                            {deleting ? (

                                <Loader2
                                    size={18}
                                    className="animate-spin"
                                />

                            ) : (

                                <Trash2
                                    size={18}
                                />

                            )}

                        </button>

                    )}

                </div>


                {/* ==========================
                    CONTENT
                ========================== */}

                {post.content && (

                    <div className="px-5 pb-5">

                        <p className="whitespace-pre-wrap leading-7 text-[var(--text)]">

                            {
                                post.content
                            }

                        </p>

                    </div>

                )}


                {/* ==========================
                    MEDIA
                ========================== */}

                {media.length > 0 && (

                    <div className="space-y-2">

                        {media.map(
                            item => (

                                <div
                                    key={item.id}
                                    className="overflow-hidden border-y border-[var(--border)] bg-black/5"
                                >

                                    {item.media_type ===
                                        "video" ? (

                                        <video
                                            src={item.file}
                                            controls
                                            playsInline
                                            className="max-h-[600px] w-full object-contain"
                                        />

                                    ) : (

                                        <img
                                            src={item.file}
                                            alt="Post media"
                                            className="max-h-[600px] w-full object-cover"
                                        />

                                    )}

                                </div>

                            )
                        )}

                    </div>

                )}


                {/* ==========================
                    ACTIONS
                ========================== */}

                <div className="flex items-center justify-between border-t border-[var(--border)] px-5 py-3">

                    <div className="flex items-center gap-2">

                        <motion.button
                            whileTap={{
                                scale: 0.92,
                            }}
                            type="button"
                            onClick={
                                handleReaction
                            }
                            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
                                liked
                                    ? "bg-red-500/10 text-red-500"
                                    : "text-[var(--muted)] hover:bg-[var(--surface)]"
                            }`}
                        >

                            <Heart
                                size={18}
                                fill={
                                    liked
                                        ? "currentColor"
                                        : "none"
                                }
                            />

                            {reactionCount}

                        </motion.button>


                        <button
                            type="button"
                            onClick={
                                toggleComments
                            }
                            className="flex items-center gap-2 rounded-full px-4 py-2 text-sm text-[var(--muted)] transition hover:bg-[var(--surface)]"
                        >

                            <MessageCircle
                                size={18}
                            />

                            {post.comment_count}

                        </button>

                    </div>


                    <button
                        type="button"
                        onClick={handleToggleSave}
                        aria-label={bookmarked ? "Unsave post" : "Save post"}
                        className={`rounded-full p-2 transition ${
                            bookmarked
                                ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                                : "text-[var(--muted)] hover:bg-[var(--surface)]"
                        }`}
                    >

                        <Bookmark
                            size={18}
                        />

                    </button>

                </div>


                {/* ==========================
                    COMMENTS
                ========================== */}

                {commentsOpen && (

                    <div className="border-t border-[var(--border)] bg-[var(--surface)] p-5">

                        {loadingComments ? (

                            <div className="flex items-center gap-2 text-sm text-[var(--muted)]">

                                <Loader2
                                    size={16}
                                    className="animate-spin"
                                />

                                Loading comments...

                            </div>

                        ) : (

                            <div className="space-y-3">

                                {comments.length === 0 ? (

                                    <p className="text-sm text-[var(--muted)]">

                                        No comments yet.

                                    </p>

                                ) : (

                                    comments.map(
                                        comment => (

                                            <div
                                                key={comment.id}
                                                className="rounded-2xl bg-[var(--card)] p-3"
                                            >

                                                <div className="flex items-start justify-between gap-3">

                                                    <div>

                                                        <p className="text-sm font-semibold text-[var(--text)]">

                                                            {
                                                                comment.author?.display_name ||
                                                                "Anonymous"
                                                            }

                                                        </p>

                                                        <p className="text-xs text-[var(--muted)]">

                                                            @
                                                            {
                                                                comment.author?.username ||
                                                                "anonymous"
                                                            }

                                                        </p>

                                                    </div>


                                                    {comment.is_owner && (

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDeleteComment(
                                                                    comment.id
                                                                )
                                                            }
                                                            className="text-[var(--muted)] hover:text-red-500"
                                                        >

                                                            <Trash2
                                                                size={15}
                                                            />

                                                        </button>

                                                    )}

                                                </div>


                                                <p className="mt-2 text-sm leading-6 text-[var(--text)]">

                                                    {
                                                        comment.content
                                                    }

                                                </p>

                                            </div>

                                        )
                                    )

                                )}


                                {/* ADD COMMENT */}

                                {post.allow_comments && (

                                    <div className="mt-4 flex gap-2">

                                        <input
                                            value={
                                                commentText
                                            }
                                            onChange={e =>
                                                setCommentText(
                                                    e.target.value
                                                )
                                            }
                                            onKeyDown={e => {

                                                if (
                                                    e.key ===
                                                    "Enter"
                                                ) {

                                                    handleAddComment();

                                                }

                                            }}
                                            placeholder="Write a comment..."
                                            className="min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]"
                                        />

                                        <button
                                            type="button"
                                            onClick={
                                                handleAddComment
                                            }
                                            disabled={
                                                sendingComment
                                            }
                                            className="rounded-xl bg-[var(--primary)] px-4 text-white disabled:opacity-50"
                                        >

                                            {sendingComment ? (

                                                <Loader2
                                                    size={16}
                                                    className="animate-spin"
                                                />

                                            ) : (

                                                <Send
                                                    size={16}
                                                />

                                            )}

                                        </button>

                                    </div>

                                )}

                            </div>

                        )}

                    </div>

                )}

            </GlassCard>

        </motion.article>
    );
}