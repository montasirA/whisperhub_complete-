from django.urls import path

from .views import (
    ReactionView,
    RemoveReactionView,
)


urlpatterns = [

    path(
        "",
        ReactionView.as_view(),
        name="reaction-create",
    ),

    path(
        "<uuid:reaction_id>/",
        RemoveReactionView.as_view(),
        name="reaction-delete",
    ),

]