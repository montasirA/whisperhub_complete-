from django.urls import path

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

from .views import (
    RegisterView,
    UsernameAvailability,
    LoginView,
    MeView,
    UpdateProfileView,
)


urlpatterns = [

    path(
        "register/",
        RegisterView.as_view(),
        name="register",
    ),

    path(
        "username/",
        UsernameAvailability.as_view(),
        name="username-availability",
    ),

    path(
        "login/",
        LoginView.as_view(),
        name="login",
    ),

    path(
        "refresh/",
        TokenRefreshView.as_view(),
        name="refresh",
    ),

    path(
        "me/",
        MeView.as_view(),
        name="me",
    ),

    path(
        "profile/update/",
        UpdateProfileView.as_view(),
        name="profile-update",
    ),

]