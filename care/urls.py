# care/urls.py
from django.urls import path
from .views import (
    DoctorAppointmentCreateView,
    DoctorAppointmentDetailView,
    EmergencyContactCreateView,   # Added for CRUD detail operations
    EmergencyContactDetailView,
    EmergencyEventListView,
    MedicationReminderListView,
    MedicationReminderDetailView,
    BhajanListCreateView,
    BhajanDetailView,              # Added for CRUD detail operations
    ConversationLogListView
)

urlpatterns = [
    path('medication-reminders/', MedicationReminderListView.as_view(), name='medication-reminder-list'),
    path('medication-reminders/<int:pk>/', MedicationReminderDetailView.as_view(), name='medication-reminder-detail'),
    
    path('doctor-appointments/', DoctorAppointmentCreateView.as_view(), name='doctor-appointment-list'),
    path('doctor-appointments/<int:pk>/', DoctorAppointmentDetailView.as_view(), name='doctor-appointment-detail'),
    
    path('emergency-contacts/', EmergencyContactCreateView.as_view(), name='emergency-contact-list'),
    path('emergency-contacts/<int:pk>/', EmergencyContactDetailView.as_view(), name='emergency-contact-detail'),
    
    path('emergency-events/', EmergencyEventListView.as_view(), name='emergency-event-list'),
    
    path('bhajans/', BhajanListCreateView.as_view(), name='bhajan-list'),
    path('bhajans/<int:pk>/', BhajanDetailView.as_view(), name='bhajan-detail'),
    
    path('conversation-logs/', ConversationLogListView.as_view(), name='conversation-log-list'),
    
]
