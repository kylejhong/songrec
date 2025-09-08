import os
from dotenv import load_dotenv
import json
from fastapi.testclient import TestClient
import unittest
import server
from server import app
import jwt
from jwcrypto import jwt as jwcrypto
import cryptography
from datetime import datetime, timedelta, timezone

load_dotenv()

def create_test_token(user_id=os.getenv('DB_TEST_ID'), username=os.getenv('DB_TEST_USERNAME')):
    payload = {
        'sub': user_id,
        'username': username, 
        'role': 'authenticated',            
        'aud': 'authenticated',             
        'iss': 'supabase',                  
        'exp': (datetime.now(timezone.utc) + timedelta(hours=1)).timestamp(),
        'iat': (datetime.now(timezone.utc)).timestamp()
    }   

    with open('test_keys.json', 'r') as f:
        json_dict = json.load(f)
        jwt_instance = jwcrypto.JWK.from_json(json.dumps(json_dict))
        pem_data = jwt_instance.export_to_pem(private_key=True, password=None)

    return jwt.encode(payload, pem_data.decode('utf-8'), algorithm='ES256') 
    


class TestClass(unittest.TestCase):

    def setUp(self):
        self.client = TestClient(app)

    def test_ping_endpoint_exists(self):
        response = self.client.post('/api/ping')
        assert response.status_code == 200

    def test_ping_with_auth(self):
        response = self.client.post(
            '/api/auth_ping',
            headers={'Authorization': f'Bearer {create_test_token()}'}
        )
        assert response.status_code == 200

    def test_ping_without_auth(self):
        response = self.client.post('/api/auth_ping')
        assert response.status_code == 403


if __name__ == '__main__':
    unittest.main()
