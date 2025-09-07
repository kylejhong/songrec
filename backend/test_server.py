import os
from dotenv import load_dotenv
from fastapi.testclient import TestClient
import unittest
import server
from server import app
import jwt
from datetime import datetime, timedelta

load_dotenv()

def create_test_token(user_id="test-uuid", username="testuser"):
    payload = {
        "sub": user_id,
        "username": f"{username}@example.com", 
        "role": "authenticated",            
        "aud": "authenticated",             
        "iss": "supabase",                  
        "exp": datetime.now() + timedelta(hours=1), # 9/7/25 update: tried getting the payload test to work
        "iat": datetime.now()
    }   
    secret = os.getenv("SUPABASE_JWT_KEY")
    return jwt.encode(payload, secret, algorithm="HS256")


class TestClass(unittest.TestCase):

    def setUp(self):
        self.client = TestClient(app)

    def test_ping_endpoint_exists(self):
        response = self.client.post("/api/ping")
        assert response.status_code == 200

    def test_ping_with_auth(self):
        response = self.client.post(
            "/api/auth_ping",
            headers={"Authorization": f"Bearer {create_test_token()}"}
        )
        print(response)
        assert response.status_code == 200

    def test_ping_without_auth(self):
        response = self.client.post("/api/auth_ping")
        assert response.status_code == 403


if __name__ == '__main__':
    unittest.main()
