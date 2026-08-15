from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .models import Bookmark
from .serializers import BookmarkSerializer


class BookmarkView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        bookmarks = Bookmark.objects.filter(user=request.user).select_related("post")
        data = [BookmarkSerializer(b).data for b in bookmarks]
        return Response(data)

    def post(self, request):
        post_id = request.data.get("post")

        if not post_id:
            return Response({"detail": "Post is required."}, status=status.HTTP_400_BAD_REQUEST)

        bookmark, created = Bookmark.objects.get_or_create(
            user=request.user,
            post_id=post_id,
        )

        return Response(BookmarkSerializer(bookmark).data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


class BookmarkDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, bookmark_id):
        try:
            bookmark = Bookmark.objects.get(id=bookmark_id, user=request.user)
        except Bookmark.DoesNotExist:
            return Response({"detail": "Bookmark not found."}, status=status.HTTP_404_NOT_FOUND)

        bookmark.delete()

        return Response({"message": "Bookmark removed."}, status=status.HTTP_200_OK)
