from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated

from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import UserRegistrationSerializer, LoginTokenObtainPairSerializer
import logging
from .models import CustomUser

# Set up logging
logger = logging.getLogger(__name__)

class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        logger.info(f"Received registration request: {request.data}")  # Log input data

        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            logger.info(f"User successfully saved to DB: {user.id}, {user.phone_number}")  # Log success
            
            # to verify data in PostgreSQL (Check if user exists in DB)
            db_user = CustomUser.objects.filter(id=user.id).first()
            if db_user:
                logger.info(f"User exists in DB: {db_user.phone_number}")  # Confirm DB entry
            else:
                logger.error("User was not found in the database!")

            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "Registration successful",
                "user_id": user.id,
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        
        logger.error(f"Registration failed: {serializer.errors}")  # Log errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginTokenObtainPairView(TokenObtainPairView):
    serializer_class = LoginTokenObtainPairSerializer

class SignOutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Successfully signed out."}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)