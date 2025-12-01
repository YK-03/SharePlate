# SharePlate Backend

This is the backend for the SharePlate application. It is built with Django and Django REST Framework.

## Getting Started

To get started with the backend, follow these steps:

1.  **Install the dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

2.  **Create a `.env` file** in the `shareplate_backend` directory and add the following environment variables:
    ```
    SECRET_KEY=your_secret_key
    DEBUG=True
    ALLOWED_HOSTS=localhost,127.0.0.1
    DB_ENGINE=django.db.backends.postgresql
    DB_NAME=shareplate_db
    DB_USER=postgres
    DB_PASSWORD=your_db_password
    DB_HOST=localhost
    DB_PORT=5432
    ```

3.  **Create the database:**
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```

4.  **Run the development server:**
    ```bash
    python manage.py runserver
    ```

The backend will be running at `http://localhost:8000`.
