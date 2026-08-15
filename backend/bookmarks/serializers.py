from rest_framework import serializers


class BookmarkSerializer(serializers.Serializer):
    id = serializers.UUIDField(read_only=True)
    post = serializers.UUIDField()
    created_at = serializers.DateTimeField(read_only=True)

    def to_representation(self, instance):
        return {
            "id": str(instance.id),
            "post": str(instance.post.id),
            "created_at": instance.created_at.isoformat(),
        }
