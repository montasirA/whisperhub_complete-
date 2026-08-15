from rest_framework.exceptions import ValidationError


def validate_message_content(content):

    if not content:

        raise ValidationError(
            "Message cannot be empty."
        )

    if len(content.strip()) == 0:

        raise ValidationError(
            "Message cannot be empty."
        )

    if len(content) > 5000:

        raise ValidationError(
            "Message is too long."
        )

    return content