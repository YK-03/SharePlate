import logging
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.base_user import BaseUserManager
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut

logger = logging.getLogger(__name__)

class CustomUserManager(BaseUserManager):
    """
    Custom user manager where email is the unique identifiers
    for authentication instead of usernames.
    """
    def create_user(self, email, password, **extra_fields):
        """
        Create and save a User with the given email and password.
        """
        if not email:
            raise ValueError(_('The Email must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        """
        Create and save a SuperUser with the given email and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))
        return self.create_user(email, password, **extra_fields)


class UserProfile(AbstractUser):
    """
    Custom user model extending Django's AbstractUser.
    """
    username = None
    email = models.EmailField(_('email address'), unique=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    ROLE_CHOICES = [
        ('donor', 'Donor'),
        ('recipient', 'Recipient'),
        ('volunteer', 'Volunteer'),
    ]
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, blank=True, null=True, help_text="User's role in the platform")
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    email_notifications_enabled = models.BooleanField(default=True, help_text="Enable email notifications for this user")
    
    objects = CustomUserManager()

    class Meta:
        verbose_name = "User Profile"
        verbose_name_plural = "User Profiles"

class Item(models.Model):
    """
    Represents a food item available for sharing.
    """
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    address = models.CharField(max_length=255, help_text="The address where the item is located.")
    quantity = models.PositiveIntegerField(default=1)
    expiry_date = models.DateField()
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    donor = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='donated_items')

    # Location stored as simple coordinates instead of GIS Point
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    def save(self, *args, **kwargs):
        """
        Overrides the default save method to geocode the address
        and populate the latitude/longitude fields.
        """
        # To avoid re-geocoding on every save, we check if the address has changed.
        old_instance = None
        if self.pk:
            try:
                old_instance = Item.objects.get(pk=self.pk)
            except Item.DoesNotExist:
                pass

        # Geocode if the address is set and either it's a new item or the address has changed.
        if self.address and (not old_instance or old_instance.address != self.address):
            geolocator = Nominatim(user_agent="shareplate_backend/1.0")
            try:
                location_data = geolocator.geocode(self.address, timeout=10)
                if location_data:
                    self.latitude = location_data.latitude
                    self.longitude = location_data.longitude
            except GeocoderTimedOut:
                logger.warning("Geocoding service timed out for address: %s", self.address)
            except Exception as e:
                logger.error("An error occurred during geocoding for address %s: %s", self.address, e)

        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Request(models.Model):
    """
    Represents a request made by a user for an item.
    """
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='requests')
    requester = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='requests_made')
    status = models.CharField(max_length=20, choices=[('Pending', 'Pending'), ('Accepted', 'Accepted'), ('Rejected', 'Rejected')], default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        # Use email since username is None
        return f"Request for {self.item.name} by {self.requester.email}"