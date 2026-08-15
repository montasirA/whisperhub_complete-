from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import (
    Conversation,
    Message,
    Participant,
)

from .serializers import (
    ConversationSerializer,
    MessageSerializer,
)

from .services import (
    create_conversation,
    create_message,
    send_message,
)

from accounts.models import User


class ConversationListCreateView(APIView):

    permission_classes = [
        IsAuthenticated,
    ]

    def get(self, request):

        conversations = Conversation.objects.filter(
            participants__user=request.user,
        ).distinct()

        serializer = ConversationSerializer(
            conversations,
            many=True,
        )

        return Response(serializer.data)

    def post(self, request):

        participant_ids = request.data.get(
            "participants",
            [],
        )

        users = User.objects.filter(
            id__in=participant_ids,
        )

        conversation = create_conversation(
            creator=request.user,
            participants=users,
            name=request.data.get("name", ""),
            is_group=request.data.get(
                "is_group",
                False,
            ),
        )

        serializer = ConversationSerializer(
            conversation,
        )

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
        )


class MessageListCreateView(APIView):

    permission_classes = [
        IsAuthenticated,
    ]

    def get(
        self,
        request,
        conversation_id,
    ):

        conversation = get_object_or_404(
            Conversation,
            id=conversation_id,
        )

        if not Participant.objects.filter(
            conversation=conversation,
            user=request.user,
        ).exists():

            return Response(
                {
                    "detail": "Permission denied."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        messages = Message.objects.filter(
            conversation=conversation,
        )

        serializer = MessageSerializer(
            messages,
            many=True,
        )

        return Response(serializer.data)

    def post(
        self,
        request,
        conversation_id,
    ):

        conversation = get_object_or_404(
            Conversation,
            id=conversation_id,
        )

        if not Participant.objects.filter(
            conversation=conversation,
            user=request.user,
        ).exists():

            return Response(
                {
                    "detail": "Permission denied."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        message = create_message(
            conversation_id=conversation_id,
            sender=request.user,
            content=request.data.get(
                "content",
                "",
            ),
            message_type=request.data.get(
                "message_type",
                "text",
            ),
        )

        serializer = MessageSerializer(
            message,
        )

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
        )