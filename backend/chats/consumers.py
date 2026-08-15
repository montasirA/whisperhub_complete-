import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from .services import (
    create_message,
    get_conversation,
    is_member,
)


class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):

        self.user = self.scope["user"]

        if self.user.is_anonymous:
            await self.close()
            return

        self.conversation_id = self.scope["url_route"]["kwargs"]["conversation_id"]

        allowed = await self.check_membership()

        if not allowed:
            await self.close()
            return

        self.room_group_name = f"chat_{self.conversation_id}"

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name,
        )

        await self.accept()

    async def disconnect(
        self,
        close_code,
    ):

        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name,
        )

    async def receive(
        self,
        text_data,
    ):

        data = json.loads(text_data)

        message = data.get("message")

        if not message:
            return

        allowed = await self.check_membership()

        if not allowed:
            await self.close()
            return

        saved = await self.save_message(
            self.user,
            message,
        )

        await self.channel_layer.group_send(

            self.room_group_name,

            {

                "type": "chat_message",

                "id": str(saved.id),

                "message": saved.content,

                "sender": self.user.username,

                "sender_id": self.user.id,

                "created_at": saved.created_at.isoformat(),

            },

        )

    async def chat_message(
        self,
        event,
    ):

        await self.send(

            text_data=json.dumps(

                {

                    "id": event["id"],

                    "message": event["message"],

                    "sender": event["sender"],

                    "sender_id": event["sender_id"],

                    "created_at": event["created_at"],

                }

            )

        )

    @database_sync_to_async
    def save_message(
        self,
        sender,
        content,
    ):

        return create_message(

            conversation_id=self.conversation_id,

            sender=sender,

            content=content,

        )

    @database_sync_to_async
    def check_membership(self):

        conversation = get_conversation(
            self.conversation_id
        )

        return is_member(
            conversation,
            self.user,
        )