from django.db import models
from authentication.models import CustomUser

class MedicationReminder(models.Model):
    elderly = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='medication_reminders')
    medication_name = models.CharField(max_length=100)
    dosage = models.CharField(max_length=50)
    frequency = models.CharField(max_length=50)
    appropriate = models.CharField(max_length=30, choices=[('Before Food', 'Before Food'), ('After Food', 'After Food')])
    duration = models.CharField(max_length=50)
    remarks = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return f"{self.medication_name} for {self.elderly.name}"

class DoctorAppointment(models.Model):
    elderly = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='appointments')
    doctor_name = models.CharField(max_length=100)
    specialty = models.CharField(max_length=50)
    appointment_time = models.DateTimeField()
    location = models.CharField(max_length=200)

    def __str__(self):
        return f"Appointment with {self.doctor_name} for {self.elderly.name}"

class EmergencyContact(models.Model):
    elderly = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='emergency_contacts')
    name = models.CharField(max_length=100)
    relationship = models.CharField(max_length=50)
    phone_number = models.CharField(max_length=15)
    email = models.EmailField(null=True, blank=True)

    def __str__(self):
        return f"{self.name} for {self.elderly.name}"

class EmergencyEvent(models.Model):
    elderly = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='emergency_events')
    timestamp = models.DateTimeField(auto_now_add=True)
    activation_word = models.CharField(max_length=50)

    def __str__(self):
        return f"Emergency at {self.timestamp} for {self.elderly.name}"

class Bhajan(models.Model):
    title = models.CharField(max_length=100)
    artist = models.CharField(max_length=100, null=True, blank=True)
    file_path = models.FileField(upload_to='bhajans/')
    duration = models.DurationField(null=True, blank=True)

    def __str__(self):
        return self.title


class ConversationLog(models.Model):
    elderly = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='conversation_logs')
    timestamp = models.DateTimeField(auto_now_add=True)
    user_input = models.TextField()
    bot_response = models.TextField()
    is_emergency = models.BooleanField(default=False)
    sentiment = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return f"Log at {self.timestamp} for {self.elderly.name}"