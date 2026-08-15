from django.urls import path

from .views import BookmarkView, BookmarkDetailView

urlpatterns = [
    path("", BookmarkView.as_view(), name="bookmarks"),
    path("<uuid:bookmark_id>/", BookmarkDetailView.as_view(), name="bookmark-detail"),
]
