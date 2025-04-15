from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

ROLE_CHOICES = (
    ('elderly', 'Elderly'),
    ('caretaker', 'Caretaker'),
)

class CustomUserManager(BaseUserManager):
    def create_user(self, phone_number, name, password=None, role='elderly', **extra_fields):
        if not phone_number:
            raise ValueError("Users must have a phone number.")
        user = self.model(phone_number=phone_number, name=name, role=role, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, phone_number, name, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(phone_number, name, password, role='elderly', **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=10, unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='elderly')
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'phone_number'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return f"{self.phone_number} ({self.role})"

class ElderlyProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='elderly_profile')
    date_of_birth = models.DateField(null=True, blank=True)
    medical_conditions = models.TextField(null=True, blank=True)
    preferred_language = models.CharField(max_length=10, default='ne')

    def __str__(self):
        return f"Profile for {self.user.name}"

class CaretakerProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='caretaker_profile')
    elderly = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='caretaker')
    certification = models.CharField(max_length=100, null=True, blank=True)
    experience_years = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"Profile for {self.user.name}"
