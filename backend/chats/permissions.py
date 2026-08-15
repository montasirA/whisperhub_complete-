from rest_framework.permissions import BasePermission

from .models import Participant


class IsConversationParticipant(BasePermission):

    """
    Only conversation participants can access it.
    """

    def has_permission(
        self,
        request,
        view,
    ):

        return request.user.is_authenticated

    def has_object_permission(
        self,
        request,
        view,
        obj,
    ):

        if hasattr(obj, "conversation"):

            conversation = obj.conversation

        else:

            conversation = obj

        return Participant.objects.filter(
            conversation=conversation,
            user=request.user,
        ).exists()