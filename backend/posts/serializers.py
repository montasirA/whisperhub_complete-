from rest_framework import serializers

from .models import Post, PostMedia


class PostMediaSerializer(serializers.ModelSerializer):

    file = serializers.SerializerMethodField()

    class Meta:
        model = PostMedia

        fields = [
            "id",
            "media_type",
            "file",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
        ]

    def get_file(self, obj):

        request = self.context.get("request")

        if not obj.file:
            return None

        try:
            url = obj.file.url
        except Exception:
            return None

        try:
            if request:
                return request.build_absolute_uri(url)

            return url
        except Exception:
            return url


class PostSerializer(serializers.ModelSerializer):

    author = serializers.SerializerMethodField()

    author_username = serializers.CharField(
        source="author.username",
        read_only=True,
    )

    media = PostMediaSerializer(
        many=True,
        read_only=True,
    )

    reaction_count = serializers.SerializerMethodField()

    reactions = serializers.SerializerMethodField()

    user_reacted = serializers.SerializerMethodField()

    user_reaction_id = serializers.SerializerMethodField()

    user_reaction_type = serializers.SerializerMethodField()

    user_bookmarked = serializers.SerializerMethodField()

    user_bookmark_id = serializers.SerializerMethodField()

    comment_count = serializers.SerializerMethodField()

    # --------------------------------
    # UPLOAD FIELDS
    # --------------------------------

    image = serializers.ImageField(
        write_only=True,
        required=False,
        allow_null=True,
    )

    video = serializers.FileField(
        write_only=True,
        required=False,
        allow_null=True,
    )

    class Meta:

        model = Post

        fields = [

            "id",

            "author",
            "author_username",

            "content",

            "visibility",
            "allow_comments",
            "is_edited",

            "media",

            "image",
            "video",

            "reaction_count",
            "reactions",

            "user_reacted",
            "user_reaction_id",
            "user_reaction_type",

            "user_bookmarked",
            "user_bookmark_id",

            "comment_count",

            "created_at",
            "updated_at",
        ]

        read_only_fields = [

            "id",

            "author",
            "author_username",

            "media",

            "reaction_count",
            "reactions",

            "user_reacted",
            "user_reaction_id",
            "user_reaction_type",
            "user_bookmarked",
            "user_bookmark_id",

            "comment_count",

            "created_at",
            "updated_at",
        ]

    # ==========================================
    # AUTHOR
    # ==========================================

    def get_author(self, obj):

        return {
            "id": str(obj.author.id),

            "username": obj.author.username,

            "display_name": obj.author.display_name,

            "avatar": None if not getattr(obj.author, "avatar", None) else (getattr(obj.author.avatar, "url", None)),

            "emoji_avatar": obj.author.emoji_avatar,
        }

    # ==========================================
    # REACTION COUNT
    # ==========================================

    def get_reaction_count(self, obj):

        return obj.reactions.count()

    # ==========================================
    # REACTION TYPES
    # ==========================================

    def get_reactions(self, obj):

        reaction_data = {

            "like": 0,
            "love": 0,
            "laugh": 0,
            "sad": 0,
            "angry": 0,

        }

        for reaction in obj.reactions.all():

            if reaction.reaction_type in reaction_data:

                reaction_data[
                    reaction.reaction_type
                ] += 1

        return reaction_data

    # ==========================================
    # CURRENT USER REACTION
    # ==========================================

    def get_user_reacted(self, obj):

        request = self.context.get("request")

        if not request:
            return False

        if not request.user.is_authenticated:
            return False

        return obj.reactions.filter(
            user=request.user
        ).exists()

    # ==========================================
    # CURRENT USER REACTION ID
    # ==========================================

    def get_user_reaction_id(self, obj):

        request = self.context.get("request")

        if not request:
            return None

        if not request.user.is_authenticated:
            return None

        reaction = obj.reactions.filter(
            user=request.user
        ).first()

        if reaction:
            return str(reaction.id)

        return None

    # ==========================================
    # CURRENT USER REACTION TYPE
    # ==========================================

    def get_user_reaction_type(self, obj):

        request = self.context.get("request")

        if not request:
            return None

        if not request.user.is_authenticated:
            return None

        reaction = obj.reactions.filter(
            user=request.user
        ).first()

        if reaction:
            return reaction.reaction_type

        return None

    # ==========================================
    # COMMENT COUNT
    # ==========================================

    def get_comment_count(self, obj):

        return obj.comments.count()


    def get_user_bookmarked(self, obj):

        request = self.context.get("request")

        if not request:
            return False

        if not request.user.is_authenticated:
            return False

        try:
            from django.apps import apps

            Bookmark = apps.get_model("bookmarks", "Bookmark")

            return Bookmark.objects.filter(
                user=request.user,
                post=obj,
            ).exists()
        except Exception:
            return False


    def get_user_bookmark_id(self, obj):

        request = self.context.get("request")

        if not request:
            return None

        if not request.user.is_authenticated:
            return None

        try:
            from django.apps import apps

            Bookmark = apps.get_model("bookmarks", "Bookmark")

            bookmark = Bookmark.objects.filter(
                user=request.user,
                post=obj,
            ).first()

            if bookmark:
                return str(bookmark.id)

            return None
        except Exception:
            return None

    # ==========================================
    # VALIDATION
    # ==========================================

    def validate(self, attrs):

        image = attrs.get("image")

        video = attrs.get("video")

        # --------------------------------------
        # IMAGE + VIDEO TOGETHER NOT ALLOWED
        # --------------------------------------

        if image and video:

            raise serializers.ValidationError(
                "A post can contain either an image or a video, not both."
            )

        # --------------------------------------
        # VIDEO VALIDATION
        # --------------------------------------

        if video:

            content_type = getattr(
                video,
                "content_type",
                "",
            )

            if not content_type.startswith("video/"):

                raise serializers.ValidationError(
                    {
                        "video":
                        "Please upload a valid video file."
                    }
                )

            import subprocess
            import tempfile
            import os

            temp_path = None

            try:

                # ----------------------------------
                # TEMP VIDEO FILE
                # ----------------------------------

                with tempfile.NamedTemporaryFile(
                    delete=False,
                    suffix=".mp4",
                ) as temp_file:

                    for chunk in video.chunks():

                        temp_file.write(chunk)

                    temp_path = temp_file.name

                # ----------------------------------
                # CHECK VIDEO DURATION
                # ----------------------------------

                result = subprocess.run(

                    [
                        "ffprobe",

                        "-v",
                        "error",

                        "-show_entries",
                        "format=duration",

                        "-of",
                        "default=noprint_wrappers=1:nokey=1",

                        temp_path,
                    ],

                    capture_output=True,

                    text=True,

                    timeout=15,
                )

                # ----------------------------------
                # FFMPEG / FFPROBE ERROR
                # ----------------------------------

                if result.returncode != 0:

                    raise serializers.ValidationError(
                        {
                            "video":
                            "Could not read the video file."
                        }
                    )

                duration_text = result.stdout.strip()

                if not duration_text:

                    raise serializers.ValidationError(
                        {
                            "video":
                            "Could not determine video duration."
                        }
                    )

                duration = float(
                    duration_text
                )

                # ----------------------------------
                # MAX 20 SECONDS
                # ----------------------------------

                if duration > 20:

                    raise serializers.ValidationError(
                        {
                            "video":
                            "Video must be 20 seconds or shorter."
                        }
                    )

            except serializers.ValidationError:

                raise

            except Exception as error:

                print(
                    "Video validation error:",
                    error,
                )

                raise serializers.ValidationError(
                    {
                        "video":
                        "Could not validate video duration."
                    }
                )

            finally:

                if (
                    temp_path
                    and os.path.exists(temp_path)
                ):

                    os.remove(
                        temp_path
                    )

            # Reset file pointer after ffprobe
            video.seek(0)

        return attrs

    # ==========================================
    # CREATE POST
    # ==========================================

    def create(self, validated_data):

        image = validated_data.pop(
            "image",
            None,
        )

        video = validated_data.pop(
            "video",
            None,
        )

        # --------------------------------------
        # CREATE POST
        # --------------------------------------

        post = Post.objects.create(
            **validated_data
        )

        # --------------------------------------
        # IMAGE
        # --------------------------------------

        if image:

            PostMedia.objects.create(

                post=post,

                file=image,

                media_type="image",
            )

        # --------------------------------------
        # VIDEO
        # --------------------------------------

        if video:

            PostMedia.objects.create(

                post=post,

                file=video,

                media_type="video",
            )

        return post