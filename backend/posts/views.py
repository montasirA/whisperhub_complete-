from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

from .models import Post
from .serializers import PostSerializer


class PostView(APIView):

    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def get(self, request):

        posts = (
            Post.objects
            .select_related("author")
            .prefetch_related(
                "media",
                "reactions",
                "comments",
            )
            .all()
        )

        serializer = PostSerializer(
            posts,
            many=True,
            context={
                "request": request
            }
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    def post(self, request):

        serializer = PostSerializer(
            data=request.data,
            context={
                "request": request
            }
        )

        if serializer.is_valid():

            post = serializer.save(
                author=request.user
            )

            response_serializer = PostSerializer(
                post,
                context={
                    "request": request
                }
            )

            return Response(
                response_serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class PostDetailView(APIView):

    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def delete(
        self,
        request,
        post_id
    ):

        try:

            post = Post.objects.get(
                id=post_id
            )

        except Post.DoesNotExist:

            return Response(
                {
                    "detail": "Post not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        if post.author != request.user:

            return Response(
                {
                    "detail":
                    "You can only delete your own post."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        post.delete()

        return Response(
            {
                "detail": "Post deleted."
            },
            status=status.HTTP_200_OK
        )