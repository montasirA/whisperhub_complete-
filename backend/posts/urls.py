from django.urls import path

from .views import (
    PostView,
    PostDetailView,
)


urlpatterns = [

    path(
        "",
        PostView.as_view(),
        name="post",
    ),

    path(
        "<uuid:post_id>/",
        PostDetailView.as_view(),
        name="post-detail",
    ),

]
