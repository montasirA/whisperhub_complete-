from .models import Notification


def create_notification(
    *,
    recipient,
    sender,
    notification_type,
    message,
    post=None,
):

    if recipient == sender:
        return None

    return Notification.objects.create(
        recipient=recipient,
        sender=sender,
        post=post,
        notification_type=notification_type,
        message=message,
    )