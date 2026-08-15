from django.db import models

# Create your models here.
import uuid

from django.db import models
from django.conf import settings


class Reaction(models.Model):

    REACTION_TYPES = [

        ("like", "Like"),
        ("love", "Love"),
        ("laugh", "Laugh"),
        ("sad", "Sad"),
        ("angry", "Angry"),

    ]


    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )


    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="reactions",
    )


    post = models.ForeignKey(
        "posts.Post",
        on_delete=models.CASCADE,
        related_name="reactions",
    )


    reaction_type = models.CharField(
        max_length=20,
        choices=REACTION_TYPES,
        default="like",
    )


    created_at = models.DateTimeField(
        auto_now_add=True,
    )


    updated_at = models.DateTimeField(
        auto_now=True,
    )



    class Meta:

        unique_together = (
            "user",
            "post",
        )

        ordering = [
            "-created_at"
        ]



    def __str__(self):

        return f"{self.user.username} - {self.reaction_type}"