from django.db import connection
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shareplate_project.settings')
django.setup()

print(f"Connected to DB: {connection.settings_dict['NAME']}")

with connection.cursor() as cursor:
    cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';")
    tables = [row[0] for row in cursor.fetchall()]
    print("Tables found:", tables)

    if 'shareplate_userprofile' in tables:
        cursor.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'shareplate_userprofile';")
        columns = [col[0] for col in cursor.fetchall()]
        print("Columns in shareplate_userprofile:", columns)
    else:
        print("Table shareplate_userprofile NOT FOUND.")
