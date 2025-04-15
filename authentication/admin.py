from django.contrib import admin
from .models import CustomUser, ElderlyProfile, CaretakerProfile
# Register your models here.
from unfold.admin import ModelAdmin

admin.site.register(CustomUser, ModelAdmin)
admin.site.register(ElderlyProfile, ModelAdmin)
admin.site.register(CaretakerProfile, ModelAdmin)
