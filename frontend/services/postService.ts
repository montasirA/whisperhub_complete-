import api from "@/lib/api";


// =====================================================
// GET POSTS
// =====================================================

export const getPosts = async () => {
    const response = await api.get(
        "/posts/"
    );

    return response.data;
};


// =====================================================
// CREATE POST
// =====================================================

export const createPost = async (
    data: FormData
) => {
    const response = await api.post(
        "/posts/",
        data,
    );

    return response.data;
};


// =====================================================
// DELETE POST
// =====================================================

export const deletePost = async (
    postId: string
) => {
    const response = await api.delete(
        `/posts/${postId}/`
    );

    return response.data;
};


// =====================================================
// ADD / CHANGE REACTION
// =====================================================

export const reactToPost = async (
    postId: string,
    reactionType: string = "like"
) => {
    const response = await api.post(
        "/reactions/",
        {
            post: postId,
            reaction_type: reactionType,
        }
    );

    return response.data;
};


// =====================================================
// REMOVE REACTION
// =====================================================

export const removeReaction = async (
    reactionId: string
) => {
    const response = await api.delete(
        `/reactions/${reactionId}/`
    );

    return response.data;
};


// =====================================================
// BOOKMARK / SAVE
// =====================================================

export const savePost = async (
    postId: string
) => {
    const response = await api.post(
        "/bookmarks/",
        {
            post: postId,
        }
    );

    return response.data;
};


export const removeSaved = async (
    bookmarkId: string
) => {
    const response = await api.delete(
        `/bookmarks/${bookmarkId}/`
    );

    return response.data;
};


export const getSavedPosts = async () => {
    const response = await api.get(
        "/bookmarks/"
    );

    return response.data;
};


// =====================================================
// GET COMMENTS
// =====================================================

export const getComments = async (
    postId: string
) => {
    const response = await api.get(
        "/comments/",
        {
            params: {
                post: postId,
            },
        }
    );

    return response.data;
};


// =====================================================
// ADD COMMENT
// =====================================================

export const addComment = async (
    postId: string,
    content: string
) => {
    const response = await api.post(
        "/comments/",
        {
            post: postId,
            content,
        }
    );

    return response.data;
};


// =====================================================
// DELETE COMMENT
// =====================================================

export const deleteComment = async (
    commentId: string
) => {
    const response = await api.delete(
        `/comments/${commentId}/`
    );

    return response.data;
};