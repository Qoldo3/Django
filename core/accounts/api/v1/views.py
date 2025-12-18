from rest_framework import generics
from .serializers import (RegisterSerializer, CustomTokenSerializer, 
                        CustomTokenObtainPairSerializer, ChangePasswordSerializer,
                        ProfileSerializer, ResendActivationEmailSerializer, 
                        ResetPasswordSerializerConfirm, ResetPasswordSerializer
                        )
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from accounts.models import Profile
from django.shortcuts import get_object_or_404
from mail_templated import EmailMessage
from .utils import EmailThread
import jwt
from django.conf import settings




class RegisterView(generics.CreateAPIView):
    # User Registration View
    serializer_class = RegisterSerializer
    def post(self, request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            email = serializer.validated_data['email']
            data = {
                'email': email,
            }
            user_obj = get_object_or_404(get_user_model(), email=email)
            token = self.get_tokens_for_user(user_obj)

            email_obj = EmailMessage('email/Activation.tpl', {'token': token}, 
                                'noreply@qoldo.com', to = [email])
            EmailThread(email_obj).start()
            return Response({"message": "User registered successfully", 'Email': serializer.data['email']}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get_tokens_for_user(self, user):
        refresh = RefreshToken.for_user(user)
        return str(refresh.access_token)

class CurstomToken(ObtainAuthToken):
    # Custon Token View to return user data along with token
    serializer_class = CustomTokenSerializer
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'user_id': user.pk, 'email': user.email})

class LogoutView(APIView):
    # Logout View to delete the token
    permission_classes = [IsAuthenticated]
    def post(self, request):
        request.user.auth_token.delete()
        return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)
    
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class ChangePasswordApiView(generics.GenericAPIView):
    model = get_user_model()
    permission_classes = [IsAuthenticated]
    serializer_class = ChangePasswordSerializer

    def get_object(self, queryset=None):
        obj = self.request.user
        return obj

    def put(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # Check old password
            if not self.object.check_password(serializer.data.get("old_password")):
                return Response(
                    {"old_password": ["Wrong password."]},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            # set_password also hashes the password that the user will get
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            return Response(
                {"details": "password changed successfully"},
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProfileView(generics.RetrieveUpdateAPIView):
    # Profile View to get user profile data
    permission_classes = [IsAuthenticated]
    serializer_class = ProfileSerializer
    queryset = Profile.objects.all()

    def get_object(self):
        queryset = self.get_queryset()
        obj = get_object_or_404(queryset, user=self.request.user)
        return obj
    
class TestEmailView(generics.GenericAPIView):
    def get(self, request, *args, **kwargs):
        self.email = 'admin@admin.com'
        user_obj = get_object_or_404(get_user_model(), email=self.email)
        token = self.get_tokens_for_user(user_obj)

        email_obj = EmailMessage('email/hello.tpl', {'token': token}, 
                               'noreply@qoldo.com', to = ['kazem@admin.com'])
        EmailThread(email_obj).start()
        return Response({"message": "Test email sent."}, status=status.HTTP_200_OK)
    
    def get_tokens_for_user(self, user):
        refresh = RefreshToken.for_user(user)
        return str(refresh.access_token)

class ActivateAccountView(APIView):
    def get(self, request, token, *args, **kwargs):
        #decode JWT token to get user ID and activate account
        try:
            token = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return Response({"error": "Activation link has expired."}, status=status.HTTP_400_BAD_REQUEST)
        except jwt.InvalidTokenError:
            return Response({"error": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)
        user_obj = get_user_model().objects.get(id=token['user_id'])
        if  user_obj.is_verified:
            return Response({"message": "Account is already activated."}, status=status.HTTP_200_OK)
        user_obj.is_verified = True
        user_obj.save()
        return Response({"message": "Account activated successfully."}, status=status.HTTP_200_OK)
        
class ResendActivationEmailView(generics.GenericAPIView):
    serializer_class = ResendActivationEmailSerializer
    def post(self, request, *args, **kwargs):
            serializer = self.serializer_class(data=request.data)
            serializer.is_valid(raise_exception=True)
            user_obj = serializer.validated_data['user'] 
            token = self.get_tokens_for_user(user_obj)
            email_obj = EmailMessage('email/Activation.tpl', {'token': token}, 
                            'noreply@qoldo.com', to = [user_obj.email])
            EmailThread(email_obj).start()
            return Response({"message": "If the email exists, an email has been sent.."}, status=status.HTTP_200_OK)

        
    def get_tokens_for_user(self, user):
        refresh = RefreshToken.for_user(user)
        return str(refresh.access_token)

class ResetPasswordView(generics.GenericAPIView):
    serializer_class = ResetPasswordSerializer
    def post(self, request, *args, **kwargs):
            serializer = self.serializer_class(data=request.data)
            serializer.is_valid(raise_exception=True)
            user_obj = serializer.validated_data['user'] 
            token = self.get_tokens_for_user(user_obj)
            email_obj = EmailMessage('email/ResetPass.tpl', {'token': token}, 
                            'noreply@qoldo.com', to = [user_obj.email])
            EmailThread(email_obj).start()
            return Response({"message": "Reset password email resent."}, status=status.HTTP_200_OK)

        
    def get_tokens_for_user(self, user):
        refresh = RefreshToken.for_user(user)
        return str(refresh.access_token)

class ResetPasswordConfirmView(generics.GenericAPIView):
    serializer_class = ResetPasswordSerializerConfirm
    def post(self, request, token, *args, **kwargs):
        #decode JWT token to get user ID and reset password
        try:
            token = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return Response({"error": "Password reset link has expired."}, status=status.HTTP_400_BAD_REQUEST)
        except jwt.InvalidTokenError:
            return Response({"error": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)
        user_obj = get_user_model().objects.get(id=token['user_id'])
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user_obj.set_password(serializer.data.get("new_password"))
            user_obj.save()
            return Response({"message": "Password reset successfully."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)