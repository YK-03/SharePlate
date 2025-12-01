from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import get_user_model

# Assuming your donation model is in a 'donations' app
# and your user model is a custom one.
from donations.models import Donation

User = get_user_model()

@receiver(post_save, sender=Donation)
def send_donation_notification(sender, instance, created, **kwargs):
    """
    Sends an email notification to all volunteers when a new donation is created.
    """
    if created:
        # Get all volunteers
        volunteers = User.objects.filter(is_volunteer=True, is_active=True)
        volunteer_emails = [volunteer.email for volunteer in volunteers if volunteer.email]

        if volunteer_emails:
            subject = 'New Donation Available for Pickup!'
            message = f"""
            Hello Volunteers,

            A new donation has just been posted on SharePlate!

            Donation: {instance.title}
            Description: {instance.description}

            Please log in to the platform to see more details and arrange for pickup.

            Thank you for your support!

            - The SharePlate Team
            """
            
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                volunteer_emails,
                fail_silently=False, # Set to True in production to not block the request if email fails
            )