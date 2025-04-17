# care/views.py

import logging
from datetime import datetime

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import (
    MedicationReminder,
    DoctorAppointment,
    EmergencyContact,
    EmergencyEvent,
    Bhajan,
    ConversationLog,
)
from .serializers import (
    MedicationReminderSerializer,
    DoctorAppointmentSerializer,
    EmergencyContactSerializer,
    EmergencyEventSerializer,
    BhajanSerializer,
    ConversationLogSerializer,
)
from authentication.models import CaretakerProfile

logger = logging.getLogger(__name__)


def get_linked_elderly(request):
    """
    Return the elderly user linked to the current caretaker.
    If none, returns None.
    """
    cp = getattr(request.user, 'caretaker_profile', None)
    return getattr(cp, 'elderly', None)


# -----------------------------------------------------------------------------
# DoctorAppointment CRUD (for this caretaker’s linked elderly only)
# -----------------------------------------------------------------------------

class DoctorAppointmentCreateView(generics.ListCreateAPIView):
    """
    GET  /doctor-appointments/      → list this elderly’s appointments
    POST /doctor-appointments/      → create a new appointment for this elderly
    """
    permission_classes = [IsAuthenticated]
    serializer_class = DoctorAppointmentSerializer

    def get_queryset(self):
        elder = get_linked_elderly(self.request)
        return DoctorAppointment.objects.filter(elderly=elder) if elder else DoctorAppointment.objects.none()

    def perform_create(self, serializer):
        elder = get_linked_elderly(self.request)
        serializer.save(elderly=elder)


class DoctorAppointmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /doctor-appointments/{pk}/   → retrieve one appointment
    PUT    /doctor-appointments/{pk}/   → update
    DELETE /doctor-appointments/{pk}/   → delete
    (only if it belongs to this elderly)
    """
    permission_classes = [IsAuthenticated]
    serializer_class = DoctorAppointmentSerializer

    def get_queryset(self):
        elder = get_linked_elderly(self.request)
        return DoctorAppointment.objects.filter(elderly=elder) if elder else DoctorAppointment.objects.none()


# -----------------------------------------------------------------------------
# EmergencyContact CRUD (for this caretaker’s linked elderly only)
# -----------------------------------------------------------------------------

class EmergencyContactCreateView(generics.ListCreateAPIView):
    """
    GET  /emergency-contacts/   → list this elderly’s contacts
    POST /emergency-contacts/   → create a new contact for this elderly
    """
    permission_classes = [IsAuthenticated]
    serializer_class = EmergencyContactSerializer

    def get_queryset(self):
        elder = get_linked_elderly(self.request)
        return EmergencyContact.objects.filter(elderly=elder) if elder else EmergencyContact.objects.none()

    def perform_create(self, serializer):
        elder = get_linked_elderly(self.request)
        serializer.save(elderly=elder)


class EmergencyContactDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /emergency-contacts/{pk}/
    PUT    /emergency-contacts/{pk}/
    DELETE /emergency-contacts/{pk}/
    """
    permission_classes = [IsAuthenticated]
    serializer_class = EmergencyContactSerializer

    def get_queryset(self):
        elder = get_linked_elderly(self.request)
        return EmergencyContact.objects.filter(elderly=elder) if elder else EmergencyContact.objects.none()


# -----------------------------------------------------------------------------
# MedicationReminder CRUD (for this caretaker’s linked elderly only)
# -----------------------------------------------------------------------------

class MedicationReminderListView(generics.ListCreateAPIView):
    """
    GET  /medication-reminders/   → list this elderly’s reminders
    POST /medication-reminders/   → create a new reminder for this elderly
    """
    permission_classes = [IsAuthenticated]
    serializer_class = MedicationReminderSerializer

    def get_queryset(self):
        elder = get_linked_elderly(self.request)
        return MedicationReminder.objects.filter(elderly=elder) if elder else MedicationReminder.objects.none()

    def perform_create(self, serializer):
        elder = get_linked_elderly(self.request)
        serializer.save(elderly=elder)


class MedicationReminderDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /medication-reminders/{pk}/
    PUT    /medication-reminders/{pk}/
    DELETE /medication-reminders/{pk}/
    """
    permission_classes = [IsAuthenticated]
    serializer_class = MedicationReminderSerializer

    def get_queryset(self):
        elder = get_linked_elderly(self.request)
        return MedicationReminder.objects.filter(elderly=elder) if elder else MedicationReminder.objects.none()


# -----------------------------------------------------------------------------
# EmergencyEvent (list only, filtered by elderly)
# -----------------------------------------------------------------------------

class EmergencyEventListView(generics.ListAPIView):
    """
    GET /emergency-events/  → list emergency events for this elderly
    """
    permission_classes = [IsAuthenticated]
    serializer_class = EmergencyEventSerializer

    def get_queryset(self):
        elder = get_linked_elderly(self.request)
        return EmergencyEvent.objects.filter(elderly=elder) if elder else EmergencyEvent.objects.none()


# -----------------------------------------------------------------------------
# Bhajan (open to all or add auth if needed)
# -----------------------------------------------------------------------------

class BhajanListCreateView(generics.ListCreateAPIView):
    """
    GET  /bhajans/      → list bhajans
    POST /bhajans/      → add new bhajan (if permitted)
    """
    # permission_classes = [IsAuthenticated]  # enable if restricted
    serializer_class = BhajanSerializer
    queryset = Bhajan.objects.all()


class BhajanDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /bhajans/{pk}/
    PUT    /bhajans/{pk}/
    DELETE /bhajans/{pk}/
    """
    # permission_classes = [IsAuthenticated]
    serializer_class = BhajanSerializer
    queryset = Bhajan.objects.all()


# -----------------------------------------------------------------------------
# ConversationLog (list only, filtered by elderly)
# -----------------------------------------------------------------------------

class ConversationLogListView(generics.ListAPIView):
    """
    GET /conversation-logs/  → list conversation logs for this elderly
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ConversationLogSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'elderly':
            return ConversationLog.objects.filter(elderly=user).order_by('-timestamp')
        return ConversationLog.objects.none()


# -----------------------------------------------------------------------------
# Bulk endpoint for chatbot: pull all 3 data types in 1 call
# -----------------------------------------------------------------------------

class ElderlyDataView(APIView):
    """
    GET /elderly-data/
    → returns a combined JSON payload:
      { appointments, medication_reminders, emergency_contacts }
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        elder = get_linked_elderly(request)
        if not elder:
            return Response(
                {"detail": "No linked elderly found."},
                status=status.HTTP_400_BAD_REQUEST
            )

        appointments = DoctorAppointment.objects.filter(elderly=elder)
        reminders     = MedicationReminder.objects.filter(elderly=elder)
        contacts      = EmergencyContact.objects.filter(elderly=elder)

        return Response({
            "appointments":         DoctorAppointmentSerializer(appointments, many=True).data,
            "medication_reminders": MedicationReminderSerializer(reminders, many=True).data,
            "emergency_contacts":   EmergencyContactSerializer(contacts, many=True).data,
        }, status=status.HTTP_200_OK)
