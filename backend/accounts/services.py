from .models import User


class AccountService:

    @staticmethod
    def username_exists(username):

        return User.objects.filter(
            username=username
        ).exists()