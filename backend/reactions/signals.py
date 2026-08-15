from django.db.models.signals import post_save

from django.dispatch import receiver

from .models import Reaction

from notifications.services import create_notification


@receiver(post_save, sender=Reaction)
def create_reaction_notification(
    sender,
    instance,
    created,
    **kwargs,
):

    if not created:
        return

    create_notification(
        recipient=instance.post.author,
        sender=instance.user,
        notification_type="like",
        message=f"{instance.user.username} reacted to your post.",
        post=instance.post,
    )