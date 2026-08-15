import uuid

from django.db import models
from django.conf import settings


class Notification(models.Model):

    TYPE_CHOICES = [
        ("like", "Like"),
        ("comment", "Comment"),
        ("reply", "Reply"),
        ("follow", "Follow"),
        ("mention", "Mention"),
        ("system", "System"),
    ]

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications",
    )

    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="sent_notifications",
    )

    post = models.ForeignKey(
        "posts.Post",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )

    notification_type = models.CharField(
        max_length=20,
        choices=TYPE_CHOICES,
    )

    message = models.CharField(
        max_length=255,
    )

    is_read = models.BooleanField(
        default=False,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:

        ordering = [
            "-created_at",
        ]

    def __str__(self):

        return f"{self.sender} -> {self.recipient}"