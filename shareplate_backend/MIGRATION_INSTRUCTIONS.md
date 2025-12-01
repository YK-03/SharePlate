# Migration Instructions

## Step 1: Create Migrations

Run the following command to create migrations for the new UserProfile fields:

```bash
cd shareplate_backend
python manage.py makemigrations
```

This will create a migration file for the new fields:
- `role` - User's role (donor, recipient, volunteer)
- `phone_number` - Optional phone number
- `email_notifications_enabled` - Toggle for email notifications

## Step 2: Apply Migrations

```bash
python manage.py migrate
```

## Step 3: Update Existing Users (Optional)

If you have existing users, you may want to set their roles. You can do this via:

1. Django admin interface
2. Python shell:
```bash
python manage.py shell
```

```python
from shareplate.models import UserProfile

# Set role for existing users
UserProfile.objects.filter(role__isnull=True).update(role='donor')  # or 'volunteer', 'recipient'

# Enable email notifications for all users
UserProfile.objects.update(email_notifications_enabled=True)
```

## Step 4: Create Volunteer Users

Create volunteer users through Django admin or API:

### Via Django Admin:
1. Go to http://localhost:8000/admin
2. Navigate to User Profiles
3. Add a new user
4. Set role to "volunteer"
5. Set email
6. Enable "Email notifications enabled"

### Via API:
```bash
curl -X POST http://localhost:8000/api/users/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "volunteer1",
    "email": "volunteer@example.com",
    "password": "securepassword",
    "first_name": "John",
    "last_name": "Doe",
    "role": "volunteer"
  }'
```

## Step 5: Configure Email Settings

Update your `.env` file with email configuration (see README_NOTIFICATIONS.md for details).

## Step 6: Test

1. Start the backend server
2. Create a donation as a donor
3. Check volunteer email inboxes for notifications

