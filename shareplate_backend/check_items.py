
import os
import django
import sys

# Add the project directory to the sys.path
sys.path.append(os.getcwd())

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shareplate_backend.settings')
django.setup()

from shareplate.models import Item

print("--- Checking Items in Database ---")
items = Item.objects.all()
print(f"Total items found: {items.count()}")

for item in items:
    print(f"ID: {item.id}")
    # Try title or name, printing all fields to be safe
    print(f"  Fields: {item.__dict__}")
    print(f"  Is Available: {item.is_available}")
    if hasattr(item, 'donor'):
        print(f"  Donor: {item.donor.username} (ID: {item.donor.id})")
    print("-" * 30)

print("--- End of List ---")
