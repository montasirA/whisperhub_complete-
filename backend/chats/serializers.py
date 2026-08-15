from rest_framework import serializers

from .models import (
    Conversation,
    Participant,
    Message,
)


class ParticipantSerializer(serializers.ModelSerializer):

    username = serializers.CharField(
        source="user.username",
        read_only=True,
    )

    class Meta:

        model = Participant

        fields = [
            "id",
            "user",
            "username",
            "role",
            "joined_at",
        ]


class MessageSerializer(serializers.ModelSerializer):

    sender_username = serializers.CharField(
        source="sender.username",
        read_only=True,
    )

    class Meta:

        model = Message

        fields = [
            "id",
            "conversation",
            "sender",
            "sender_username",
            "content",
            "message_type",
            "reply_to",
            "is_edited",
            "is_deleted",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "sender",
            "is_edited",
            "is_deleted",
            "created_at",
            "updated_at",
        ]


class ConversationSerializer(serializers.ModelSerializer):

    participants = ParticipantSerializer(
        many=True,
        read_only=True,
    )

    class Meta:

        model = Conversation

        fields = [
            "id",
            "name",
            "is_group",
            "created_by",
            "participants",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_by",
            "created_at",
            "updated_at",
        ]