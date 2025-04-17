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
        fields = ['id', 'elderly', 'medication_name', 'dosage', 'frequency', 'appropriate', 'duration', 'remarks']

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
    medication_reminders = serializers.SerializerMethodField()
    doctor_appointments = serializers.SerializerMethodField()
    emergency_contacts = serializers.SerializerMethodField()

    class Meta:
        model = ConversationLog
        fields = [
            'id',
            'elderly',
            'timestamp',
            'user_input',
            'bot_response',
            'is_emergency',
            'medication_reminders',
            'doctor_appointments',
            'emergency_contacts',
        ]

    def get_medication_reminders(self, obj):
        reminders = MedicationReminder.objects.filter(elderly=obj.elderly)
        return MedicationReminderSerializer(reminders, many=True).data

    def get_doctor_appointments(self, obj):
        appointments = DoctorAppointment.objects.filter(elderly=obj.elderly)
        return DoctorAppointmentSerializer(appointments, many=True).data

    def get_emergency_contacts(self, obj):
        contacts = EmergencyContact.objects.filter(elderly=obj.elderly)
        return EmergencyContactSerializer(contacts, many=True).data

    def create(self, validated_data):
        request = self.context.get('request')
        caretaker = request.user
        if hasattr(caretaker, 'caretaker_profile') and caretaker.caretaker_profile.elderly:
            elderly = caretaker.caretaker_profile.elderly
        else:
            raise serializers.ValidationError("No linked elderly found for this caretaker.")
        validated_data['elderly'] = elderly
        return super().create(validated_data)

