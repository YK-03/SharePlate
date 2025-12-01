import os
import django
from django.db import connection

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shareplate_project.settings')
django.setup()

def reset_database():
    print("Resetting database...")
    with connection.cursor() as cursor:
        # Get all table names in the current schema
        cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
        tables = cursor.fetchall()
        
        if not tables:
            print("No tables found to drop.")
            return

        print(f"Found {len(tables)} tables. Dropping them now...")
        
        # Disable foreign key checks to avoid ordering issues
        cursor.execute("SET session_replication_role = 'replica';")
        
        for table in tables:
            table_name = table[0]
            print(f"Dropping table {table_name}...")
            cursor.execute(f'DROP TABLE IF EXISTS "{table_name}" CASCADE')
            
        # Re-enable foreign key checks
        cursor.execute("SET session_replication_role = 'origin';")
        
    print("Database reset complete. All tables dropped.")

if __name__ == "__main__":
    reset_database()
