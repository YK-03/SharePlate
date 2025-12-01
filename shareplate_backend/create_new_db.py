import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import sys

# Configuration
DB_HOST = "localhost"
DB_PORT = "5432"
DB_USER = "postgres" # Trying default superuser
DB_PASS = "032005"    # Trying the user's provided password
NEW_DB_NAME = "shareplate_v2"

def create_database():
    print(f"Connecting to PostgreSQL as {DB_USER}...")
    try:
        # Connect to 'postgres' db to perform administrative tasks
        conn = psycopg2.connect(
            dbname="postgres",
            user=DB_USER,
            password=DB_PASS,
            host=DB_HOST,
            port=DB_PORT
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Check if db exists
        cursor.execute(f"SELECT 1 FROM pg_catalog.pg_database WHERE datname = '{NEW_DB_NAME}'")
        exists = cursor.fetchone()
        
        if exists:
            print(f"Database '{NEW_DB_NAME}' already exists. Dropping it...")
            cursor.execute(f"DROP DATABASE {NEW_DB_NAME}")
            print("Dropped old database.")

        print(f"Creating database '{NEW_DB_NAME}'...")
        cursor.execute(f"CREATE DATABASE {NEW_DB_NAME}")
        print(f"SUCCESS: Database '{NEW_DB_NAME}' created successfully!")
        
        cursor.close()
        conn.close()
        return True

    except Exception as e:
        print(f"FAILURE: Could not create database. Error: {e}")
        print("Tip: If authentication fails, the user might not have permission to create databases.")
        return False

if __name__ == "__main__":
    create_database()
