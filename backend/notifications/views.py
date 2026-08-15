from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Notification
from .serializers import NotificationSerializer


class NotificationView(APIView):

    permission_classes = [
        IsAuthenticated,
    ]


    def get(
        self,
        request,
    ):

        notifications = Notification.objects.filter(
            recipient=request.user
        )

        serializer = NotificationSerializer(
            notifications,
            many=True,
        )

        return Response(serializer.data)



class MarkNotificationReadView(APIView):

    permission_classes = [
        IsAuthenticated,
    ]


    def patch(
        self,
        request,
        notification_id,
    ):

        try:

            notification = Notification.objects.get(
                id=notification_id,
                recipient=request.user,
            )

        except Notification.DoesNotExist:

            return Response(
                {
                    "error": "Notification not found",
                },
                status=404,
            )


        notification.is_read = True

        notification.save()

        return Response(
            {
                "message": "Notification marked as read",
            }
        )



class MarkAllNotificationsReadView(APIView):

    permission_classes = [
        IsAuthenticated,
    ]


    def patch(
        self,
        request,
    ):

        Notification.objects.filter(
            recipient=request.user,
            is_read=False,
        ).update(
            is_read=True,
        )

        return Response(
            {
                "message": "All notifications marked as read",
            }
        )