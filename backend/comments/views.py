from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Comment
from .serializers import CommentSerializer


class CommentView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def post(
        self,
        request
    ):

        serializer = CommentSerializer(
            data=request.data,
            context={
                "request": request
            }
        )

        if serializer.is_valid():

            serializer.save(
                user=request.user
            )

            return Response(
                serializer.data,
                status=201
            )

        return Response(
            serializer.errors,
            status=400
        )

    def get(
        self,
        request
    ):

        post_id = request.query_params.get(
            "post"
        )

        if not post_id:

            return Response(
                {
                    "detail":
                    "Post parameter is required."
                },
                status=400
            )

        comments = (
            Comment.objects
            .filter(
                post_id=post_id,
                parent_comment=None
            )
            .select_related("user")
            .prefetch_related("replies")
        )

        serializer = CommentSerializer(
            comments,
            many=True,
            context={
                "request": request
            }
        )

        return Response(
            serializer.data
        )


class CommentDeleteView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def delete(
        self,
        request,
        comment_id
    ):

        try:

            comment = Comment.objects.get(
                id=comment_id
            )

        except Comment.DoesNotExist:

            return Response(
                {
                    "detail":
                    "Comment not found."
                },
                status=404
            )

        if comment.user != request.user:

            return Response(
                {
                    "detail":
                    "You can only delete your own comment."
                },
                status=403
            )

        comment.delete()

        return Response(
            {
                "message":
                "Comment deleted."
            },
            status=200
        )