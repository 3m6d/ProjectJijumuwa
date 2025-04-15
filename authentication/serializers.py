from rest_framework import serializers
from .models import CustomUser, ElderlyProfile, CaretakerProfile
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


# Serializer for elderly user details
class ElderlyUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['name', 'phone_number', 'password']
        extra_kwargs = {'password': {'write_only': True}}  # Hide password in response

    def validate_password(self, value):
        # Check if elderly PIN is 4 digits
        if not (len(value) == 4 and value.isdigit()):
            raise serializers.ValidationError("Elderly PIN must be exactly 4 digits.")
        return value

# Serializer for user registration (caretaker or elderly)
class UserRegistrationSerializer(serializers.ModelSerializer):
    elderly_user = ElderlyUserSerializer(required=False)  # Optional field for caretakers

    class Meta:
        model = CustomUser
        fields = ['name', 'phone_number', 'password', 'role', 'elderly_user']
        extra_kwargs = {'password': {'write_only': True}}  # Hide password in response

    def validate(self, attrs):
        role = attrs.get('role', 'elderly')  # Default role is elderly
        caretaker_phone = attrs.get('phone_number')  # Caretaker’s phone number

        if role == 'elderly':
            # Ensure elderly PIN is 4 digits
            password = attrs.get('password')
            if not (password and len(password) == 4 and password.isdigit()):
                raise serializers.ValidationError("For elderly users, PIN must be exactly 4 digits.")
        elif role == 'caretaker':
            # Check if elderly user details are provided
            if 'elderly_user' not in attrs:
                raise serializers.ValidationError("Caretakers must provide elderly user details.")
            elderly_phone = attrs['elderly_user'].get('phone_number')  # Elderly phone number

            # Prevent caretaker and elderly from using the same phone number
            if caretaker_phone == elderly_phone:
                raise serializers.ValidationError("Caretaker and elderly user cannot have the same phone number.")

            # Check if caretaker’s phone number is already used
            if CustomUser.objects.filter(phone_number=caretaker_phone).exists():
                raise serializers.ValidationError(
                    f"The phone number {caretaker_phone} is already in use by another user. Please choose a different number for the caretaker."
                )

            # Check if elderly phone number already exists (we’ll handle this in create)
            # No need to raise an error here; we’ll link to existing elderly user if found

        return attrs

    def create(self, validated_data):
        role = validated_data.get('role', 'elderly')  # Get the user’s role

        if role == 'caretaker':
            elderly_data = validated_data.pop('elderly_user')  # Remove elderly data from main data
            elderly_phone = elderly_data.get('phone_number')  # Get elderly phone number

            # Check if elderly user already exists
            try:
                elderly_user = CustomUser.objects.get(phone_number=elderly_phone, role='elderly')
                # If found, we’ll link to this existing elderly user
            except CustomUser.DoesNotExist:
                # If not found, create a new elderly user
                elderly_user = CustomUser.objects.create_user(
                    phone_number=elderly_phone,
                    name=elderly_data.get('name', 'Default Elderly'),
                    password=elderly_data.get('password', '0000'),  # Default PIN if not provided
                    role='elderly'
                )
                ElderlyProfile.objects.create(user=elderly_user)  # Create elderly profile
            else:
                # Verify the existing user is an elderly user
                if elderly_user.role != 'elderly':
                    raise serializers.ValidationError(
                        f"The phone number {elderly_phone} belongs to a non-elderly user. Please use a different number."
                    )

            # Create the caretaker user
            caretaker_user = CustomUser.objects.create_user(**validated_data)
            # Link caretaker to the elderly user
            CaretakerProfile.objects.create(user=caretaker_user, elderly=elderly_user)
            return caretaker_user
        else:
            # Create a standalone elderly user
            user = CustomUser.objects.create_user(**validated_data)
            ElderlyProfile.objects.create(user=user)  # Create elderly profile
            return user


class LoginTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # Call the parent class's validate() method, which returns token data.
        data = super().validate(attrs)
        # Add role and name from the logged-in user
        data['role'] = self.user.role
        data['name'] = self.user.name

        # If the user is a caretaker, include the linked elderly ID
        if self.user.role == 'caretaker':
            try:
                elderly_id = self.user.caretaker_profile.elderly.id
                data['elderly_id'] = elderly_id
            except Exception:
                raise serializers.ValidationError("No linked elderly found for this caretaker.")
        
        return data