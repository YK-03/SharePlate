# Notification System Setup

This document explains how to set up the notification system for SharePlate.

## Overview

When a donation is created, the system automatically sends email notifications to all active volunteers who have email notifications enabled.

## Backend Setup

### 1. Install Dependencies

```bash
cd shareplate_backend
pip install -r requirements.txt
```

### 2. Database Migration

Create and apply migrations for the new UserProfile fields:

```bash
python manage.py makemigrations
python manage.py migrate
```

### 3. Environment Configuration

Create a `.env` file in the `shareplate_backend` directory with the following variables:

```env
# Email Configuration
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-specific-password
DEFAULT_FROM_EMAIL=your-email@gmail.com

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:8080,http://localhost:3000

# Database and other settings...
```

### 4. Gmail Setup (Example)

If using Gmail:
1. Enable 2-factor authentication on your Google account
2. Generate an "App Password" for this application
3. Use the app password in `EMAIL_HOST_PASSWORD`

### 5. Create Volunteer Users

You can create volunteer users through:
- Django admin: `http://localhost:8000/admin`
- API endpoint: `POST /api/users/register/` with `role=volunteer`

Make sure volunteers have:
- `role` set to `'volunteer'`
- `email_notifications_enabled` set to `True`
- Valid email address
- `is_active` set to `True`

## Frontend Setup

### 1. Environment Configuration

Create a `.env` file in the `shrareplate_frontend` directory:

```env
VITE_BACKEND_API_URL=http://localhost:8000/api
```

### 2. Install Dependencies

```bash
cd shrareplate_frontend
npm install
```

### 3. Run Frontend

```bash
npm run dev
```

## How It Works

1. **Donation Creation**: When a donor creates a donation through the frontend, it calls `POST /api/items/`
2. **Notification Trigger**: The `ItemListCreateView.perform_create()` method triggers `send_donation_notification_to_volunteers()`
3. **Volunteer Selection**: The system queries all users with:
   - `role='volunteer'`
   - `email_notifications_enabled=True`
   - `is_active=True`
   - Valid email address
4. **Email Sending**: HTML emails are sent to all matching volunteers with donation details
5. **Error Handling**: If email sending fails, it's logged but doesn't prevent the donation from being created

## API Endpoints

### Create Donation
```
POST /api/items/
Authorization: Token <token>
Content-Type: application/json

{
  "name": "Rice Packets",
  "description": "Leftover rice from event",
  "quantity": 50,
  "expiry_date": "2025-12-31",
  "address": "123 Main St, City",
  "location": {
    "type": "Point",
    "coordinates": [longitude, latitude]
  }
}
```

### Register User
```
POST /api/users/register/
Content-Type: application/json

{
  "username": "volunteer1",
  "email": "volunteer@example.com",
  "password": "securepassword",
  "first_name": "John",
  "last_name": "Doe",
  "role": "volunteer",
  "phone_number": "+1234567890"
}
```

## Testing

1. Start the backend:
```bash
cd shareplate_backend
python manage.py runserver
```

2. Start the frontend:
```bash
cd shrareplate_frontend
npm run dev
```

3. Create a volunteer user (via admin or API)
4. Create a donation as a donor
5. Check the volunteer's email inbox for the notification

## Alternative: Using Console Backend for Testing

For testing without email setup, you can use the console backend:

```env
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
```

This will print emails to the console instead of sending them.

## Troubleshooting

- **No emails received**: Check email configuration, spam folder, and that volunteers have `email_notifications_enabled=True`
- **CORS errors**: Ensure `CORS_ALLOWED_ORIGINS` includes your frontend URL
- **Migration errors**: Run `python manage.py makemigrations` and `python manage.py migrate`
- **Import errors**: Ensure all dependencies are installed with `pip install -r requirements.txt`

