import uuid

from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    PermissionsMixin,
    BaseUserManager,
)


class UserManager(BaseUserManager):

    def create_user(self, email, username, password=None, **extra_fields):

        if not email:
            raise ValueError("Email is required.")

        email = self.normalize_email(email)

        user = self.model(
            email=email,
            username=username,
            **extra_fields,
        )

        user.set_password(password)

        user.save(using=self._db)

        return user

    def create_superuser(self, email, username, password=None, **extra_fields):

        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        return self.create_user(
            email,
            username,
            password,
            **extra_fields,
        )


class User(AbstractBaseUser, PermissionsMixin):

    PRIVACY_CHOICES = [
        ("public", "Public"),
        ("friends", "Friends"),
        ("private", "Private"),
    ]

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    email = models.EmailField(
        unique=True,
    )

    username = models.CharField(
        max_length=30,
        unique=True,
    )

    display_name = models.CharField(
        max_length=50,
    )

    bio = models.TextField(
        blank=True,
    )

    avatar = models.ImageField(
        upload_to="avatars/",
        blank=True,
        null=True,
    )

    emoji_avatar = models.CharField(
        max_length=10,
        default="🐱",
    )

    theme_color = models.CharField(
        max_length=20,
        default="#7C5CFC",
    )

    status_message = models.CharField(
        max_length=100,
        blank=True,
    )

    profile_banner = models.ImageField(
        upload_to="banners/",
        blank=True,
        null=True,
    )

    privacy_level = models.CharField(
        max_length=20,
        choices=PRIVACY_CHOICES,
        default="public",
    )

    is_verified = models.BooleanField(default=False)

    is_online = models.BooleanField(default=False)

    is_active = models.BooleanField(default=True)

    is_staff = models.BooleanField(default=False)

    last_seen = models.DateTimeField(
        auto_now=True,
    )

    date_joined = models.DateTimeField(
        auto_now_add=True,
    )

    objects = UserManager()

    USERNAME_FIELD = "email"

    REQUIRED_FIELDS = [
        "username",
    ]

    def __str__(self):
        return self.username