from django.db.models.signals import post_save

from django.dispatch import receiver

from .models import Comment

from notifications.services import create_notification


@receiver(post_save, sender=Comment)
def create_comment_notification(
    sender,
    instance,
    created,
    **kwargs,
):

    if not created:
        return

    if instance.parent_comment:

        create_notification(
            recipient=instance.parent_comment.user,
            sender=instance.user,
            notification_type="reply",
            message=f"{instance.user.username} replied to your comment.",
            post=instance.post,
        )

    else:

        create_notification(
            recipient=instance.post.author,
            sender=instance.user,
            notification_type="comment",
            message=f"{instance.user.username} commented on your post.",
            post=instance.post,
        )