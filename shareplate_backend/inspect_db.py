from django.db import connection
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shareplate_project.settings')
django.setup()

with connection.cursor() as cursor:
    cursor.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'shareplate_userprofile';")
    columns = [col[0] for col in cursor.fetchall()]
    print("Columns in shareplate_userprofile:", columns)
