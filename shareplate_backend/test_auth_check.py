import os
import django
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shareplate_project.settings')
django.setup()

from django.contrib.auth import authenticate, get_user_model

User = get_user_model()

# Create a test user if not exists
email = "test@example.com"
password = "testpassword123"

if not User.objects.filter(email=email).exists():
    User.objects.create_user(email=email, password=password)
    print(f"Created user {email}")
else:
    print(f"User {email} already exists")

# Test authenticate with email kwarg
user = authenticate(email=email, password=password)
if user:
    print("Authentication successful with email kwarg")
else:
    print("Authentication FAILED with email kwarg")

# Test authenticate with username kwarg (mapped to email)
user2 = authenticate(username=email, password=password)
if user2:
    print("Authentication successful with username kwarg")
else:
    print("Authentication FAILED with username kwarg")
