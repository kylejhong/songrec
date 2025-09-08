import os
from dotenv import load_dotenv
from fastapi.testclient import TestClient
import unittest
import server
from server import app
import jwt
from datetime import datetime, timedelta, timezone

load_dotenv()

def create_test_token(user_id=os.getenv("DB_TEST_ID"), username=os.getenv("DB_TEST_USERNAME")):
    payload = {
        "sub": user_id,
        "username": username, 
        "role": "authenticated",            
        "aud": "authenticated",             
        "iss": "supabase",                  
        "exp": (datetime.now(timezone.utc) + timedelta(hours=1)).timestamp(),
        "iat": (datetime.now(timezone.utc)).timestamp()
    }   
    secret = os.getenv("SUPABASE_JWT_TEST_SIGNING_KEY")
    return jwt.encode(payload, secret, algorithm="ES256") # 9/7/25 currently making validating JWT w public key work


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
        assert response.status_code == 200

    def test_ping_without_auth(self):
        response = self.client.post("/api/auth_ping")
        assert response.status_code == 403


if __name__ == '__main__':
    unittest.main()
