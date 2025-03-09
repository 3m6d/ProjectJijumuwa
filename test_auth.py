import requests

BASE_URL = "http://127.0.0.1:8000/authentication/"

# Test Registration (Signin) with Nepali Names
def test_register():
    # Register an elderly user
    elderly_payload = {
        "name": "राम",  # Ram in Nepali
        "phone_number": "9841234567",
        "password": "1234",
        "role": "elderly"
    }
    print("Registering Elderly User (राम)...")
    response = requests.post(BASE_URL + "register/", json=elderly_payload)
    print(response.status_code, response.json())

    # Register a caretaker with an elderly user
    caretaker_payload = {
        "name": "सीता",  # Sita in Nepali
        "phone_number": "9851234567",
        "password": "securepass",
        "role": "caretaker",
        "elderly_user": {
            "name": "राम",  # Link to existing Ram
            "phone_number": "9841234567",
            "password": "1234"
        }
    }
    print("\nRegistering Caretaker (सीता)...")
    response = requests.post(BASE_URL + "register/", json=caretaker_payload)
    print(response.status_code, response.json())
    return response.json()["refresh"], response.json()["access"]  # Return tokens for login/logout

# Test Login
def test_login(refresh_token):
    login_payload = {
        "phone_number": "9841234567",
        "password": "1234"
    }
    print("\nLogging in as राम...")
    response = requests.post(BASE_URL + "login/", json=login_payload)
    print(response.status_code, response.json())
    return refresh_token  # Use the original refresh token for logout

# Test Logout (Signout)
def test_logout(refresh_token):
    logout_payload = {
        "refresh": refresh_token
    }
    headers = {
        "Authorization": f"Bearer {refresh_token}"  # Note: Access token is typically used here, but we'll test with refresh
    }
    print("\nSigning out राम...")
    response = requests.post(BASE_URL + "signout/", json=logout_payload, headers=headers)
    print(response.status_code, response.json())

# Run the tests
if __name__ == "__main__":
    # Register users and get tokens
    refresh_token, access_token = test_register()
    
    # Login with elderly user
    refresh_token = test_login(refresh_token)
    
    # Logout
    test_logout(refresh_token)