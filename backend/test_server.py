# python -m unittest test_server.TestClass.test_method

import os
from dotenv import load_dotenv
import json
from fastapi.testclient import TestClient
import supabase 
from supabase.client import ClientOptions
import httpx
import unittest
import server
from server import app
import jwt
from jwcrypto import jwt as jwcrypto
import cryptography
from datetime import datetime, timedelta, timezone

load_dotenv()

supabase_client = supabase.create_client(
    os.getenv('SUPABASE_URL'), 
    os.getenv('SUPABASE_KEY'),
    # These extra options are to prevent depreciation warnings in supabase_client:
    options=ClientOptions( 
        postgrest_client_timeout=20,
        storage_client_timeout=20,
        httpx_client=httpx.Client(verify=False)
    )
)

def create_test_token(user_id=os.getenv('DB_TEST_ID_1'), username=os.getenv('DB_TEST_USERNAME_1')):

    payload = {
        'sub': user_id,
        'username': username, 
        'role': 'authenticated',            
        'aud': 'authenticated',             
        'iss': 'https://nqzgjbhzoosakyyelwzs.supabase.co/auth/v1',                  
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
        self.friend_response_id = None

    def cleanup_test_users(self):
        response = (
            supabase_client.table('relationships')
            .delete()
            .eq('id_1', os.getenv('DB_TEST_ID_1'))
            .execute()
        )
        response = (
            supabase_client.table('friends')
            .delete()
            .eq('user_id', os.getenv('DB_TEST_ID_2'))
            .execute()
        )
        response = (
            supabase_client.table('friend_requests')
            .delete()
            .eq('sender_id', os.getenv('DB_TEST_ID_1'))
            .execute()
        )
        response = (
            supabase_client.table('friends')
            .delete()
            .eq('user_id', os.getenv('DB_TEST_ID_2'))
            .execute()
        )

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

    def test_friend_request(self):
        self.cleanup_test_users()
        response = self.client.post(
            '/api/friend_request',
            headers={'Authorization': f'Bearer {create_test_token()}'},
            params={'receiver_id': os.getenv('DB_TEST_ID_2')}
        )
        self.friend_request_id = response.json()['relationship_id']
        assert response.status_code == 200

    def test_already_requested(self):
        self.test_friend_request()
        response = self.client.post(
            '/api/friend_request',
            headers={'Authorization': f'Bearer {create_test_token()}'},
            params={'receiver_id': os.getenv('DB_TEST_ID_2')}
        )
        assert response.status_code == 400

    def test_reject_request(self):
        self.test_friend_request()
        response = self.client.post(
            '/api/friend_relation_reject',
            headers={'Authorization': f'Bearer {
                create_test_token(
                    user_id=os.getenv('DB_TEST_ID_2'), 
                    username=os.getenv('DB_TEST_USERNAME_2')
                )
            }'},
            params={'relationship_id': self.friend_request_id} # 9/8/25 trying to fix this mess, turns out unit testing and integration testing have different names for a reason. unit test the song logic, integration test the user stuff. Currently adjusting each function to run somewhat independantly (supabase logic, then api call. rinse and repeat)
        )
        assert response.status_code == 200

    def test_accept_request(self):
        self.test_friend_request()
        response = self.client.post(
            '/api/friend_relation_accept',
            headers={'Authorization': f'Bearer {
                create_test_token(
                    user_id=os.getenv('DB_TEST_ID_2'), 
                    username=os.getenv('DB_TEST_USERNAME_2')
                )
            }'},
            params={'relationship_id': self.friend_request_id}
        )
        assert response.status_code == 200

    def test_remove_friend(self):
        self.test_accept_request()
        response = self.client.post(
            '/api/friend_relation_remove',
            headers={'Authorization': f'Bearer {
                create_test_token(
                    user_id=os.getenv('DB_TEST_ID_1'), 
                    username=os.getenv('DB_TEST_USERNAME_1')
                )
            }'},
            params={'relationship_id': self.friend_request_id}
        )
        assert response.status_code == 200

    def test_collect_outgoing(self):
        self.test_friend_request()
        response = self.client.get(
            '/api/collect_outgoing',
            headers={'Authorization': f'Bearer {
                create_test_token(
                    user_id=os.getenv('DB_TEST_ID_1'), 
                    username=os.getenv('DB_TEST_USERNAME_1')
                )
            }'},
        )
        assert response.status_code == 200

    def test_collect_incoming(self):
        self.test_friend_request()
        response = self.client.get(
            '/api/collect_incoming',
            headers={'Authorization': f'Bearer {
                create_test_token(
                    user_id=os.getenv('DB_TEST_ID_2'), 
                    username=os.getenv('DB_TEST_USERNAME_2')
                )
            }'},
        )
        assert response.status_code == 200

    def test_search_users(self):
        self.cleanup_test_users()
        self.test_friend_request()
        response = self.client.get(
            '/api/search_users',
            headers={'Authorization': f'Bearer {
                create_test_token(
                    user_id=os.getenv('DB_TEST_ID_1'), 
                    username=os.getenv('DB_TEST_USERNAME_1')
                )
            }'},
            params={'query': os.getenv('DB_TEST_USERNAME_2')}
        )
        assert response.status_code == 200

    def test_get_my_profile(self):
        response = self.client.get(
            '/api/my-profile',
            headers={'Authorization': f'Bearer {
                create_test_token(
                    user_id=os.getenv('DB_TEST_ID_1'), 
                    username=os.getenv('DB_TEST_USERNAME_1')
                )
            }'},
        )
        assert response.status_code == 200

    def test_update_username(self):
        response = self.client.post(
            '/api/update_username',
            headers={'Authorization': f'Bearer {
                create_test_token(
                    user_id=os.getenv('DB_TEST_ID_1'), 
                    username=os.getenv('DB_TEST_USERNAME_1')
                )
            }'},
            params={'new_username': 'new-username-test'}
        )
        assert response.status_code == 200
        response = self.client.get(
            '/api/my-profile',
            headers={'Authorization': f'Bearer {
                create_test_token(
                    user_id=os.getenv('DB_TEST_ID_1'), 
                    username='new-username-test'
                )
            }'},
        )
        assert response.json()['username'] == 'new-username-test'
        response = self.client.get(
            '/api/my-profile',
            headers={'Authorization': f'Bearer {
                create_test_token(
                    user_id=os.getenv('DB_TEST_ID_1'), 
                    username=os.getenv('DB_TEST_USERNAME_1')
                )
            }'},
        )

    def test_spotify_url(self):
        response = self.client.get(
            '/api/get_song',
            headers={'Authorization': f'Bearer {
                create_test_token(
                    user_id=os.getenv('DB_TEST_ID_1'), 
                    username=os.getenv('DB_TEST_USERNAME_1')
                )
            }'},
            params={'song_url': 'https://open.spotify.com/track/7sam5WsFimXgFOCuEOc90x?si=yiq89xsaTTSqMQudd9cvoQ'}
        )
        assert response.status_code == 200
        assert response.json()['preview_url'] != None

if __name__ == '__main__':
    unittest.main()
