from django.urls import path

from .views import (
    NotificationView,
    MarkNotificationReadView,
    MarkAllNotificationsReadView,
)

urlpatterns = [

    path(
        "",
        NotificationView.as_view(),
        name="notifications",
    ),

    path(
        "<uuid:notification_id>/read/",
        MarkNotificationReadView.as_view(),
        name="notification-read",
    ),

    path(
        "read-all/",
        MarkAllNotificationsReadView.as_view(),
        name="notification-read-all",
    ),

]