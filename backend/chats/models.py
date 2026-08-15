import uuid

from django.db import models
from django.conf import settings


class Conversation(models.Model):

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    name = models.CharField(
        max_length=120,
        blank=True,
    )

    is_group = models.BooleanField(
        default=False,
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="created_conversations",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:

        ordering = [
            "-updated_at",
        ]

    def __str__(self):

        if self.is_group:
            return self.name or f"Group {self.id}"

        return f"Conversation {self.id}"


class Participant(models.Model):

    ROLE_CHOICES = [

        ("admin", "Admin"),

        ("member", "Member"),

    ]

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name="participants",
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="chat_participations",
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default="member",
    )

    joined_at = models.DateTimeField(
        auto_now_add=True,
    )

    is_muted = models.BooleanField(
        default=False,
    )

    last_read_message = models.ForeignKey(
        "Message",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="+",
    )

    class Meta:

        unique_together = (
            "conversation",
            "user",
        )

        ordering = [
            "joined_at",
        ]

    def __str__(self):

        return f"{self.user.username} - {self.conversation.id}"


class Message(models.Model):

    MESSAGE_TYPES = [

        ("text", "Text"),

        ("image", "Image"),

        ("video", "Video"),

        ("file", "File"),

        ("voice", "Voice"),

        ("gif", "GIF"),

        ("system", "System"),

    ]

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name="messages",
    )

    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="sent_messages",
    )

    content = models.TextField(
        blank=True,
    )

    message_type = models.CharField(
        max_length=20,
        choices=MESSAGE_TYPES,
        default="text",
    )

    reply_to = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="replies",
    )

    is_edited = models.BooleanField(
        default=False,
    )

    is_deleted = models.BooleanField(
        default=False,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:

        ordering = [
            "created_at",
        ]

    def __str__(self):

        return f"{self.sender.username}: {self.message_type}"