from django.urls import path

from .views import (
    CommentView,
    CommentDeleteView,
)


urlpatterns = [

    path(
        "",
        CommentView.as_view(),
        name="comments",
    ),

    path(
        "<uuid:comment_id>/",
        CommentDeleteView.as_view(),
        name="comment-delete",
    ),

]