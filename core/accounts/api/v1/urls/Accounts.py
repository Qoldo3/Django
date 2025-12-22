from django.urls import path
from .. import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    # register API
    path("register/", views.RegisterView.as_view(), name="register"),
    path("token/login/", views.CurstomToken.as_view(), name="token-login"),
    # token
    path("token/logout/", views.LogoutView.as_view(), name="token-logout"),
    path("token/login/", views.CurstomToken.as_view(), name="token-login"),
    # password change API
    path(
        "password-change/",
        views.ChangePasswordApiView.as_view(),
        name="password-change",
    ),
    # Reset Password
    path("password-reset/", views.ResetPasswordView.as_view(), name="password-reset"),
    path(
        "password-reset/confirm/<str:token>",
        views.ResetPasswordConfirmView.as_view(),
        name="password-reset-confirm",
    ),
    # login jwt API
    path("jwt/create/", views.CustomTokenObtainPairView.as_view(), name="jwt-create"),
    path("jwt/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("jwt/verify/", TokenVerifyView.as_view(), name="token_verify"),
    # Account verification API
    path(
        "activate/<str:token>",
        views.ActivateAccountView.as_view(),
        name="activate-account",
    ),
    # Resend verification email API
    path(
        "resend-activation/",
        views.ResendActivationEmailView.as_view(),
        name="resend-activation",
    ),
    # test mail
    path("test-mail/", views.TestEmailView.as_view(), name="test-mail"),
]
