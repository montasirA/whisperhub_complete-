import re
from django.core.exceptions import ValidationError


def validate_username(username):

    if len(username) < 4:
        raise ValidationError("Username must be at least 4 characters.")

    if len(username) > 30:
        raise ValidationError("Username cannot exceed 30 characters.")

    if not re.match(r"^[a-zA-Z0-9_]+$", username):
        raise ValidationError(
            "Username may contain only letters, numbers and underscores."
        )