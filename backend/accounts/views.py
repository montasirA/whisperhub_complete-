from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from django.contrib.auth import authenticate

from rest_framework_simplejwt.tokens import RefreshToken

from .models import User

from .serializers import (
    RegisterSerializer,
    UpdateProfileSerializer,
    UserSerializer,
)

from .services import AccountService


# ==========================
# REGISTER
# ==========================

class RegisterView(generics.CreateAPIView):

    queryset = User.objects.all()

    serializer_class = RegisterSerializer

    permission_classes = [AllowAny]


# ==========================
# USERNAME AVAILABILITY
# ==========================

class UsernameAvailability(APIView):

    permission_classes = [AllowAny]

    def get(self, request):

        username = request.GET.get(
            "username",
            ""
        ).strip()

        exists = AccountService.username_exists(
            username
        )

        return Response({
            "available": not exists
        })


# ==========================
# LOGIN
# ==========================

class LoginView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        email = request.data.get("email")

        password = request.data.get(
            "password"
        )

        user = authenticate(
            request,
            email=email,
            password=password,
        )

        if not user:

            return Response(
                {
                    "message": "Invalid credentials."
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )

        refresh = RefreshToken.for_user(user)

        return Response({

            "access": str(
                refresh.access_token
            ),

            "refresh": str(
                refresh
            ),

            "user": UserSerializer(
                user
            ).data,

        })


# ==========================
# CURRENT USER
# ==========================

class MeView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):

        return Response(
            UserSerializer(
                request.user
            ).data
        )


# ==========================
# UPDATE PROFILE
# ==========================

class UpdateProfileView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    parser_classes = [
        MultiPartParser,
        FormParser,
        JSONParser,
    ]

    def patch(self, request):

        serializer = UpdateProfileSerializer(
            request.user,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        return Response(
            UserSerializer(
                request.user
            ).data
        )
