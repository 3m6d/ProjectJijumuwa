# care/serializers.py
from rest_framework import serializers
from .models import (
    MedicationReminder,
    DoctorAppointment,
    EmergencyContact,
    EmergencyEvent,
    Bhajan,
    ConversationLog,
)
from authentication.models import CustomUser

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'name', 'phone_number']  # Adjust fields as needed

class MedicationReminderSerializer(serializers.ModelSerializer):
    elderly = CustomUserSerializer(read_only=True)  # Nested user info

    class Meta:
        model = MedicationReminder
        fields = ['id', 'elderly', 'medication_name', 'dosage', 'time', 'frequency', 'status']

    def create(self, validated_data):
        request = self.context.get('request')
        caretaker = request.user
        if hasattr(caretaker, 'caretaker_profile') and caretaker.caretaker_profile.elderly:
            elderly = caretaker.caretaker_profile.elderly
        else:
            raise serializers.ValidationError("No linked elderly found for this caretaker.")
        validated_data['elderly'] = elderly
        return super().create(validated_data)

class DoctorAppointmentSerializer(serializers.ModelSerializer):
    # Display the nested elderly info in responses.
    elderly = CustomUserSerializer(read_only=True)

    class Meta:
        model = DoctorAppointment
        fields = ['id', 'elderly', 'doctor_name', 'specialty', 'appointment_time', 'location']

    def create(self, validated_data):
        request = self.context.get('request')
        caretaker = request.user
        if hasattr(caretaker, 'caretaker_profile') and caretaker.caretaker_profile.elderly:
            elderly = caretaker.caretaker_profile.elderly
        else:
            raise serializers.ValidationError("No linked elderly found for this caretaker.")
        validated_data['elderly'] = elderly
        return super().create(validated_data)

class EmergencyContactSerializer(serializers.ModelSerializer):
    elderly = CustomUserSerializer(read_only=True)

    class Meta:
        model = EmergencyContact
        fields = ['id', 'elderly', 'name', 'relationship', 'phone_number', 'email']

    def create(self, validated_data):
        request = self.context.get('request')
        caretaker = request.user
        if hasattr(caretaker, 'caretaker_profile') and caretaker.caretaker_profile.elderly:
            elderly = caretaker.caretaker_profile.elderly
        else:
            raise serializers.ValidationError("No linked elderly found for this caretaker.")
        validated_data['elderly'] = elderly
        return super().create(validated_data)

class EmergencyEventSerializer(serializers.ModelSerializer):
    elderly = CustomUserSerializer(read_only=True)

    class Meta:
        model = EmergencyEvent
        fields = ['id', 'elderly', 'timestamp', 'activation_word']

    def create(self, validated_data):
        request = self.context.get('request')
        caretaker = request.user
        if hasattr(caretaker, 'caretaker_profile') and caretaker.caretaker_profile.elderly:
            elderly = caretaker.caretaker_profile.elderly
        else:
            raise serializers.ValidationError("No linked elderly found for this caretaker.")
        validated_data['elderly'] = elderly
        return super().create(validated_data)

class BhajanSerializer(serializers.ModelSerializer):
    file_path = serializers.FileField()  # Returns full URL

    class Meta:
        model = Bhajan
        fields = ['id', 'title', 'artist', 'file_path', 'duration']

class ConversationLogSerializer(serializers.ModelSerializer):
    elderly = CustomUserSerializer(read_only=True)

    class Meta:
        model = ConversationLog
        fields = ['id', 'elderly', 'timestamp', 'user_input', 'bot_response', 'is_emergency']

    def create(self, validated_data):
        request = self.context.get('request')
        caretaker = request.user
        if hasattr(caretaker, 'caretaker_profile') and caretaker.caretaker_profile.elderly:
            elderly = caretaker.caretaker_profile.elderly
        else:
            raise serializers.ValidationError("No linked elderly found for this caretaker.")
        validated_data['elderly'] = elderly
        return super().create(validated_data)
