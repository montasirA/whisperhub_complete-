from .models import (
    Conversation,
    Participant,
    Message,
)


def get_conversation(conversation_id):
    return Conversation.objects.get(
        id=conversation_id,
    )


def is_member(conversation, user):
    return Participant.objects.filter(
        conversation=conversation,
        user=user,
    ).exists()


def create_conversation(
    creator,
    participants,
    name="",
    is_group=False,
):
    conversation = Conversation.objects.create(
        name=name,
        is_group=is_group,
        created_by=creator,
    )

    Participant.objects.create(
        conversation=conversation,
        user=creator,
        role="admin",
    )

    for user in participants:
        if user.id != creator.id:
            Participant.objects.get_or_create(
                conversation=conversation,
                user=user,
                defaults={
                    "role": "member",
                },
            )

    return conversation


def create_message(
    conversation_id,
    sender,
    content,
    message_type="text",
):
    conversation = get_conversation(
        conversation_id,
    )

    message = Message.objects.create(
        conversation=conversation,
        sender=sender,
        content=content,
        message_type=message_type,
    )

    conversation.save(
        update_fields=["updated_at"],
    )

    return message


def send_message(
    conversation,
    sender,
    content,
    message_type="text",
):
    message = Message.objects.create(
        conversation=conversation,
        sender=sender,
        content=content,
        message_type=message_type,
    )

    conversation.save(
        update_fields=["updated_at"],
    )

    return message