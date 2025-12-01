import psycopg2
import sys
from decouple import config

print("Attempting to connect to the database...")

try:
    conn = psycopg2.connect(
        dbname=config('DB_NAME', default='shareplate_db'),
        user=config('DB_USER', default='postgres'),
        password=config('DB_PASSWORD'),
        host=config('DB_HOST', default='localhost'),
        port=config('DB_PORT', default=5432, cast=int),
        connect_timeout=5
    )
    print("SUCCESS: Database connection established successfully!")
    conn.close()
except psycopg2.OperationalError as e:
    print(f"FAILURE: Could not connect to the database. Error: {e}", file=sys.stderr)
except Exception as e:
    print(f"FAILURE: An unexpected error occurred: {e}", file=sys.stderr)

print("Script finished.")
