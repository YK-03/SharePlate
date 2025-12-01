"""
Notification service for sending notifications to volunteers when donations are created.
Uses Django's email backend for sending notifications.
"""
import logging
from django.core.mail import send_mail
from django.conf import settings
from .models import UserProfile, Item

logger = logging.getLogger(__name__)


def send_donation_notification_to_volunteers(donation: Item):
    """
    Send email notifications to all active volunteers when a new donation is created.
    
    Args:
        donation: The Item (donation) that was just created
    """
    try:
        # Get all volunteers who have email notifications enabled
        volunteers = UserProfile.objects.filter(
            role='volunteer',
            email_notifications_enabled=True,
            is_active=True
        ).exclude(email='')
        
        if not volunteers.exists():
            logger.info("No active volunteers with email notifications enabled")
            return
        
        # Prepare email content
        subject = f"New Donation Available: {donation.name}"
        
        # Create email context
        context = {
            'donation': donation,
            'donor_name': donation.donor.get_full_name() or donation.donor.username,
            'item_name': donation.name,
            'quantity': donation.quantity,
            'description': donation.description,
            'address': donation.address,
            'expiry_date': donation.expiry_date,
            'created_at': donation.created_at,
        }
        
        # Render HTML email template
        description_html = f'<div class="detail-row"><span class="label">Description:</span> {context["description"]}</div>' if context.get('description') else ''
        
        html_message = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background-color: #22c55e; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }}
                .content {{ background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }}
                .donation-details {{ background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #22c55e; }}
                .detail-row {{ margin: 8px 0; }}
                .label {{ font-weight: bold; color: #555; }}
                .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
                .button {{ display: inline-block; padding: 12px 24px; background-color: #22c55e; color: white; text-decoration: none; border-radius: 5px; margin-top: 15px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>🍽️ New Donation Available!</h2>
                </div>
                <div class="content">
                    <p>Hello Volunteer,</p>
                    <p>A new food donation has been posted and needs your help for pickup and delivery.</p>
                    
                    <div class="donation-details">
                        <h3 style="margin-top: 0;">Donation Details</h3>
                        <div class="detail-row">
                            <span class="label">Food Item:</span> {context.get('item_name', 'N/A')}
                        </div>
                        <div class="detail-row">
                            <span class="label">Quantity:</span> {context.get('quantity', 'N/A')}
                        </div>
                        {description_html}
                        <div class="detail-row">
                            <span class="label">Pickup Location:</span> {context.get('address', 'N/A')}
                        </div>
                        <div class="detail-row">
                            <span class="label">Expiry Date:</span> {context.get('expiry_date', 'N/A')}
                        </div>
                        <div class="detail-row">
                            <span class="label">Donor:</span> {context.get('donor_name', 'N/A')}
                        </div>
                        <div class="detail-row">
                            <span class="label">Posted:</span> {context.get('created_at').strftime('%B %d, %Y at %I:%M %p') if context.get('created_at') else 'N/A'}
                        </div>
                    </div>
                    
                    <p style="margin-top: 20px;">
                        Please check the volunteer dashboard to accept this pickup request and help distribute food to those in need.
                    </p>
                    
                    <p>Thank you for your continued support in fighting food waste! 🙏</p>
                </div>
                <div class="footer">
                    <p>This is an automated notification from SharePlate</p>
                    <p>You can manage your notification preferences in your account settings.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        # Plain text version
        donor_name = donation.donor.get_full_name() or donation.donor.username if donation.donor else 'Unknown'
        posted_time = donation.created_at.strftime('%B %d, %Y at %I:%M %p') if donation.created_at else 'N/A'
        
        plain_message = f"""
New Donation Available: {donation.name}

Hello Volunteer,

A new food donation has been posted and needs your help for pickup and delivery.

Donation Details:
- Food Item: {donation.name}
- Quantity: {donation.quantity}
- Description: {donation.description or 'N/A'}
- Pickup Location: {donation.address}
- Expiry Date: {donation.expiry_date}
- Donor: {donor_name}
- Posted: {posted_time}

Please check the volunteer dashboard to accept this pickup request.

Thank you for your continued support in fighting food waste!

---
This is an automated notification from SharePlate
        """
        
        # Send email to each volunteer
        recipient_list = list(volunteers.values_list('email', flat=True))
        
        if recipient_list:
            try:
                send_mail(
                    subject=subject,
                    message=plain_message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=recipient_list,
                    html_message=html_message,
                    fail_silently=False,
                )
                logger.info(f"Successfully sent donation notification to {len(recipient_list)} volunteers for donation: {donation.name}")
            except Exception as e:
                logger.error(f"Failed to send donation notification: {str(e)}")
        else:
            logger.warning("No valid email addresses found for volunteers")
            
    except Exception as e:
        logger.error(f"Error in send_donation_notification_to_volunteers: {str(e)}", exc_info=True)

