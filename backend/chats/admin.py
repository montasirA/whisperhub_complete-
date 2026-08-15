from django.contrib import admin

from .models import (
    Conversation,
    Participant,
    Message,
)


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "name",
        "is_group",
        "created_by",
        "created_at",
    )

    search_fields = (
        "name",
        "created_by__username",
    )

    list_filter = (
        "is_group",
    )


@admin.register(Participant)
class ParticipantAdmin(admin.ModelAdmin):

    list_display = (
        "conversation",
        "user",
        "role",
        "joined_at",
    )

    search_fields = (
        "user__username",
    )

    list_filter = (
        "role",
    )


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):

    list_display = (
        "sender",
        "conversation",
        "message_type",
        "created_at",
    )

    search_fields = (
        "sender__username",
        "content",
    )

    list_filter = (
        "message_type",
    )