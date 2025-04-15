from django.contrib import admin
from .models import MedicationReminder, DoctorAppointment, EmergencyContact, EmergencyEvent, Bhajan, ConversationLog    
from unfold.admin import ModelAdmin
# Register your models here.

admin.site.register(MedicationReminder, ModelAdmin)
admin.site.register(DoctorAppointment, ModelAdmin)
admin.site.register(EmergencyContact, ModelAdmin)
admin.site.register(EmergencyEvent, ModelAdmin)
admin.site.register(Bhajan, ModelAdmin)
admin.site.register(ConversationLog, ModelAdmin)