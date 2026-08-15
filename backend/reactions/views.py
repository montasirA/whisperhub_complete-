from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .models import Reaction
from .serializers import ReactionSerializer


class ReactionView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def post(self, request):

        post_id = request.data.get(
            "post"
        )

        reaction_type = request.data.get(
            "reaction_type",
            "like"
        )

        if not post_id:

            return Response(
                {
                    "detail":
                    "Post is required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        reaction = Reaction.objects.filter(
            user=request.user,
            post_id=post_id
        ).first()

        # ==========================
        # ALREADY REACTED
        # ==========================

        if reaction:

            # Same reaction = remove it
            if reaction.reaction_type == reaction_type:

                reaction.delete()

                return Response(
                    {
                        "removed": True,
                        "message":
                        "Reaction removed."
                    },
                    status=status.HTTP_200_OK
                )

            # Different reaction = change it
            reaction.reaction_type = reaction_type
            reaction.save(
                update_fields=[
                    "reaction_type",
                    "updated_at",
                ]
            )

            return Response(
                ReactionSerializer(
                    reaction
                ).data,
                status=status.HTTP_200_OK
            )

        # ==========================
        # NEW REACTION
        # ==========================

        reaction = Reaction.objects.create(
            user=request.user,
            post_id=post_id,
            reaction_type=reaction_type,
        )

        return Response(
            ReactionSerializer(
                reaction
            ).data,
            status=status.HTTP_201_CREATED
        )


class RemoveReactionView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def delete(
        self,
        request,
        reaction_id
    ):

        try:

            reaction = Reaction.objects.get(
                id=reaction_id,
                user=request.user
            )

        except Reaction.DoesNotExist:

            return Response(
                {
                    "detail":
                    "Reaction not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        reaction.delete()

        return Response(
            {
                "message":
                "Reaction removed."
            },
            status=status.HTTP_200_OK
        )