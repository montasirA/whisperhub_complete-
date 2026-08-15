from django.db.models.signals import post_save

from django.dispatch import receiver

from .models import Message

from notifications.services import create_notification


@receiver(post_save, sender=Message)
def message_notification(
    sender,
    instance,
    created,
    **kwargs,
):

    if not created:
        return

    participants = instance.conversation.participants.exclude(
        user=instance.sender,
    )

    for participant in participants:

        create_notification(
            recipient=participant.user,
            sender=instance.sender,
            notification_type="message",
            message=f"{instance.sender.username} sent you a message.",
        )