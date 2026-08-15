from rest_framework import serializers

from .models import Reaction



class ReactionSerializer(serializers.ModelSerializer):


    username = serializers.CharField(
        source="user.username",
        read_only=True,
    )


    class Meta:

        model = Reaction

        fields = [
            "id",
            "user",
            "username",
            "post",
            "reaction_type",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "user",
            "created_at",
        ]