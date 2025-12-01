import requests
import json

BASE_URL = "http://localhost:8000/api"

def register_user():
    url = f"{BASE_URL}/users/register/"
    headers = {"Content-Type": "application/json"}
    data = {
        "email": "api_test_user@example.com",
        "password": "password123",
        "role": "donor",
        "first_name": "API",
        "last_name": "Test"
    }
    
    print(f"Sending POST request to {url}...")
    try:
        response = requests.post(url, headers=headers, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 201:
            print("SUCCESS: User registered successfully via API.")
            return True
        elif response.status_code == 400 and "already exists" in response.text:
            print("SUCCESS: User already exists (Backend is reachable).")
            return True
        else:
            print("FAILURE: Registration failed.")
            return False
    except requests.exceptions.ConnectionError:
        print("FAILURE: Could not connect to backend. Is it running on port 8000?")
        return False

if __name__ == "__main__":
    register_user()
