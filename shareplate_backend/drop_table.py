from django.db import connection
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shareplate_project.settings')
django.setup()

with connection.cursor() as cursor:
    print("Dropping shareplate_userprofile table...")
    cursor.execute("DROP TABLE IF EXISTS shareplate_userprofile CASCADE;")
    print("Table dropped.")
