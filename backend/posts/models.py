import uuid

from django.db import models
from django.conf import settings


class Post(models.Model):

    VISIBILITY_CHOICES = [
        ("public", "Public"),
        ("friends", "Friends"),
        ("private", "Private"),
    ]

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="posts",
    )

    content = models.TextField(
        blank=True,
        null=True,
    )

    visibility = models.CharField(
        max_length=20,
        choices=VISIBILITY_CHOICES,
        default="public",
    )

    allow_comments = models.BooleanField(
        default=True,
    )

    is_edited = models.BooleanField(
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
            "-created_at",
        ]


    def __str__(self):

        return f"{self.author.username} - {self.id}"



class PostMedia(models.Model):

    MEDIA_TYPES = [
        ("image", "Image"),
        ("video", "Video"),
        ("gif", "GIF"),
    ]


    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )


    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name="media",
    )


    file = models.FileField(
        upload_to="posts/media/",
    )


    media_type = models.CharField(
        max_length=10,
        choices=MEDIA_TYPES,
    )


    created_at = models.DateTimeField(
        auto_now_add=True,
    )


    def __str__(self):

        return f"{self.post.id} - {self.media_type}"