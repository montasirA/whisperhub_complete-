from rest_framework import serializers

from .models import User
from .validators import validate_username


# =====================================================
# REGISTER
# =====================================================

class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True,
        min_length=8,
    )

    username = serializers.CharField(
        validators=[validate_username]
    )

    class Meta:
        model = User

        fields = (
            "email",
            "username",
            "display_name",
            "password",
        )

    def create(self, validated_data):

        password = validated_data.pop("password")

        user = User(**validated_data)

        user.set_password(password)

        user.save()

        return user


# =====================================================
# USER
# =====================================================

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User

        fields = [
            "id",
            "email",
            "username",
            "display_name",
            "bio",
            "avatar",
            "emoji_avatar",
            "theme_color",
            "profile_banner",
            "privacy_level",
            "is_verified",
            "is_online",
            "status_message",
            "date_joined",
        ]


# =====================================================
# LOGIN
# =====================================================

class LoginSerializer(serializers.Serializer):

    email = serializers.EmailField()

    password = serializers.CharField(
        write_only=True
    )


# =====================================================
# UPDATE PROFILE
# =====================================================

class UpdateProfileSerializer(serializers.ModelSerializer):

    username = serializers.CharField(
        validators=[validate_username],
        required=False,
    )

    class Meta:
        model = User

        fields = [
            "username",
            "display_name",
            "bio",
            "avatar",
            "profile_banner",
            "emoji_avatar",
            "theme_color",
            "status_message",
            "privacy_level",
        ]

        extra_kwargs = {
            "username": {
                "required": False,
            },

            "display_name": {
                "required": False,
            },

            "bio": {
                "required": False,
            },

            "avatar": {
                "required": False,
            },

            "profile_banner": {
                "required": False,
            },

            "emoji_avatar": {
                "required": False,
            },

            "theme_color": {
                "required": False,
            },

            "status_message": {
                "required": False,
            },

            "privacy_level": {
                "required": False,
            },
        }