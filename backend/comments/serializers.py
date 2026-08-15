from rest_framework import serializers

from .models import Comment


class CommentSerializer(serializers.ModelSerializer):

    username = serializers.CharField(
        source="user.username",
        read_only=True,
    )

    author = serializers.SerializerMethodField()

    replies = serializers.SerializerMethodField()

    is_owner = serializers.SerializerMethodField()

    class Meta:

        model = Comment

        fields = [

            "id",

            "user",

            "username",

            "author",

            "post",

            "parent_comment",

            "content",

            "is_edited",

            "replies",

            "is_owner",

            "created_at",

            "updated_at",

        ]

        read_only_fields = [

            "id",
            "user",
            "username",
            "author",
            "replies",
            "is_owner",
            "created_at",
            "updated_at",

        ]

    def get_author(self, obj):

        return {

            "id": str(obj.user.id),

            "username":
                obj.user.username,

            "display_name":
                obj.user.display_name,

            "emoji_avatar":
                obj.user.emoji_avatar,

        }

    def get_replies(self, obj):

        replies = obj.replies.all()

        return CommentSerializer(
            replies,
            many=True,
            context=self.context,
        ).data

    def get_is_owner(self, obj):

        request = self.context.get(
            "request"
        )

        if not request:
            return False

        return (
            request.user.is_authenticated
            and obj.user_id == request.user.id
        )