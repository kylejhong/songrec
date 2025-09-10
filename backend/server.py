# Depreceated List:
# /friend_request --> /api/friend_request
# /collect_user --> /api/get_my_profile
# supabase key 

# to-do:
# logging

import os
import sys
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException, Query, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import slowapi
from slowapi.util import get_remote_address 
import jwt
from jwt import ExpiredSignatureError, InvalidTokenError, PyJWK
import cryptography
from jwcrypto import jwk as jwcrypto
from datetime import datetime
import pydantic
import supabase 
from supabase.client import ClientOptions
import httpx
import spotipy
import requests
import hashlib
import json

load_dotenv()
app = FastAPI()
security = HTTPBearer()

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
    
client_credentials = spotipy.oauth2.SpotifyClientCredentials(
    client_id=os.getenv('SPOTIFY_CLIENT_ID'), 
    client_secret=os.getenv('SPOTIFY_CLIENT_SECRET')
)
spotify_client = spotipy.Spotify(client_credentials_manager=client_credentials)

limiter = slowapi.Limiter(key_func=get_remote_address)
app.state.limiter = limiter

if 'unittest' in sys.modules: 

    with open('test_keys.json', 'r') as f:
        JWT_KEY = json.load(f)

    jwt_instance = jwcrypto.JWK.from_json(json.dumps(JWT_KEY))
    pem_data = jwt_instance.export_to_pem()
    public_key = pem_data.decode('utf-8')

    def get_public_key():
        return public_key

else:

    def get_public_key():
        
        response = requests.get(os.getenv('PUBLIC_JWT_KEY_URL'))
        response.raise_for_status()

        key = response.json()['keys'][0]
        jwt_instance = jwcrypto.JWK.from_json(json.dumps(key))
        pem_data = jwt_instance.export_to_pem()
        public_key = pem_data.decode('utf-8')

        return public_key


class User(pydantic.BaseModel):
    id: str
    username: str
    pfp_url: str
    email_notifications: bool
    push_notifications: bool
    created_at: datetime
    updated_at: datetime

    def to_json(self): 
        return self.model_dump_json(indent=4)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> User:
    '''
    Obtain the current user data through a validated JWT token.
    This is called in every API function argument.

    Args:
        credentials (HTTPAuthorizationCredentials): Filled automatically.

    Returns:
        User: Current user class. 

    Raises:
        HTTPException: If credentials are invalid or user is not found.
    '''
    token = credentials.credentials
    
    try:
        
        payload = jwt.decode(
            token,
            get_public_key(),
            algorithms=['ES256'],
            audience='authenticated',
            issuer='supabase'
        )

        user_id = payload.get('sub') 
        if not user_id:
            raise HTTPException(status_code=401, detail='Invalid authentication credentials')
        
        user_data = (
            supabase_client.table('profiles')
            .select('*')
            .eq('id', user_id)
            .execute()
        )
        
        if not user_data.data:
            raise HTTPException(status_code=404, detail='User not found')
        
        return User(**user_data.data[0])
        
    except HTTPException:
        raise
    except InvalidTokenError as e: 
        raise HTTPException(status_code=401, detail='Invalid authentication credentials')


@app.get('/api/my-profile')
@limiter.limit('20/minute')
async def get_my_profile(
    request: Request,
    current_user: User = Depends(get_current_user)
):
    return current_user.to_json()


@app.post('/api/friend_request')
@limiter.limit('20/minute')
async def send_friend_request(
    request: Request,
    receiver_id: str,
    current_user: User = Depends(get_current_user)
):
    '''
    Send a friend request from the current user to another user.

    Args:
        request (Request): Required for the SlowApi rate limiter to hook into it.
        reciever_id (str): UID of user recieving the request.
        current_user (User): Authenticated User class of user sending the request.

    Returns:
        dict: Status of operation

    Raises:
        HTTPException: If reciever doesn't exist or request already exists
    '''
    try:
        receiver = (
            supabase_client.table('profiles')
            .select('*')
            .eq('id', receiver_id)
            .execute()
        )
        if not receiver.data:
            raise HTTPException(status_code=404, detail='Receiver not found') 
        
        existing_request = (
            supabase_client.table('friend_requests')
            .select('*')
            .eq('sender_id', current_user.id)
            .eq('receiver_id', receiver_id)
            .execute()
        )
        if existing_request.data:
            raise HTTPException(status_code=400, detail='Friend request already sent')
        
        new_request = (
            supabase_client.table('friend_requests')
            .insert({
                'sender_id': current_user.id,
                'receiver_id': receiver_id,
                'status': 'pending'
            })
            .execute()
        )
        
        return {'message': 'Friend request sent', 'request_id': new_request.data[0]['id']} 

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Friend request failed: {str(e)}')


@app.post('/api/friend_request_{status}')
@limiter.limit('20/minute')
async def friend_request_update(
    request: Request,
    request_id: str,
    status: str,
    current_user: User = Depends(get_current_user)
):
    '''
    Accept or reject a friend request directed to the current user from another user.

    Args:
        request (Request): Required for the SlowApi rate limiter to hook into it.
        request_id (str): UID of friend request in DB.
        status (str): The status the friend request should be changed to passed in the API call.
        current_user (User): Authenticated User class of user recieving the request.

    Returns:
        dict: Status of operation.

    Raises:
        HTTPException: If the request doesn't exist.
    '''
    try:
        request = (
            supabase_client.table('friend_requests')
            .select('*')
            .eq('id', request_id)
            .execute()
        )
        if not request.data:
            raise HTTPException(status_code=404, detail='Request not found') 
        
        match status:
            case 'accepted':
                accepted_request = (
                    supabase_client.table('friend_requests')
                    .update({'status': 'accepted'})
                    .eq('id', request_id)
                    .execute()
                )
                response = (
                    supabase_client.table('friends')
                    .insert({
                        'user_id': current_user.id,
                        'friend_id': accepted_request.data[0]['sender_id'],
                    })
                    .execute()
                )
            case 'rejected':
                reject_request = (
                    supabase_client.table('friend_requests')
                    .delete()
                    .eq('id', request_id)
                    .execute()
                )
            case _:
                raise HTTPException(status_code=404, detail='Friend request update has an invalid parameter type')
        
        return {'message': f'Friend {status}'} 

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Friend request update failed: {str(e)}')


@app.post('/api/remove_friend')
@limiter.limit('20/minute')
async def remove_friend(
    request: Request,
    friend_id: str,
    current_user: User = Depends(get_current_user)
):
    '''
    Remove a friend from the current user.

    Args:
        request (Request): Required for the SlowApi rate limiter to hook into it.
        friend_id (str): UID of friend in DB.
        current_user (User): Authenticated User class of user recieving the request.

    Returns:
        dict: Status of operation.

    Raises:
        HTTPException: If the friend doesn't exist.
    '''
    try:
        remove_friend = (
            supabase_client.table('friends')
            .delete()
            .or_(
                f'user_id.eq.{friend_id},'
                + f'friend_id.eq.{current_user.id},'
                + f'user_id.eq.{current_user.id},'
                + f'friend_id.eq.{friend_id}'
            )
            .execute()
        )

        if not remove_friend.data:
            raise HTTPException(status_code=404, detail='Friend not found') 

        return {'message': 'Friend removed'}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Collection of {request_type} failed: {str(e)}')


@app.get('/api/update_username/')
@limiter.limit('20/minute')
async def update_username(
    request: Request,
    new_username: str,
    current_user: User = Depends(get_current_user)
):
    '''
    Updates the username of the user.

    Args:
        request (Request): Required for the SlowApi rate limiter to hook into it.
        new_username (str): The new username to update to.
        current_user (User): Authenticated User class of user recieving the request.

    Returns:
        dict: Status of operation.

    Raises:
        HTTPException: If the user doesn't exist. (unlikely)
    '''
    try:
        updated_username = (
            supabase_client.table('profiles')
            .eq('id', current_user.id)
            .update('username', new_username)
            .execute()
        )

        if not updated_username.data:
            raise HTTPException(status_code=404, detail='User not found') 

        return {'message': 'Username updated'}
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Username update failed: {str(e)}')


@app.get('/api/collect_{request_type}')
@limiter.limit('40/minute')
async def collect_requests(
    request: Request,
    request_type: str,
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user)
):
    '''
    Collects the outgoing or incoming requests to the user.

    Args:
        request (Request): Required for the SlowApi rate limiter to hook into it.
        request_type (str): Either incoming or outgoing.
        limit (int): Maximum number of users to return. Defaults to 20. Must be between 1 and 100.
        offset (int): Number of requests to skip before starting to return results. Defaults to 0. 
        current_user (User): Authenticated User class of user recieving the request.

    Returns:
        dict: Status of operation.

    Raises:
        HTTPException: If the api request has a invalid request_type or if 0 requests found
    '''
    try:

        match request_type:
            case 'outgoing':
                gather, equal = 'receiver_id', 'sender_id'
            case 'incoming':
                gather, equal = 'sender_id', 'receiver_id'
            case _:
                raise HTTPException(status_code=404, detail='Collection request has an invalid parameter type')

        friend_ids = (
            supabase_client.table('friend_requests')
            .select(gather)
            .limit(limit)
            .offset(offset)
            .eq(equal, current_user.id)
            .execute()
        )
        if friend_ids.data == None:
            raise HTTPException(status_code=404, detail='Zero requests found')

        ids = [item[gather] for item in friend_ids.data]
        users = (
            supabase_client.table('profiles')
            .select('id, username, pfp_url')
            .in_('id', ids)
            .execute()
        )
        
        return users

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Collection of {request_type} failed: {str(e)}')


@app.get('/api/search_users')
@limiter.limit('20/minute')
async def search_users(
   request: Request,
    query: str = Query(..., min_length=1, max_length=50),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user)
):
    '''
    Search for any user in the search page based on username

    Args:
        query (str): The user-entered string to search.
        limit (int): Maximum number of users to return. Defaults to 20. Must be between 1 and 100.
        offset (int): Number of requests to skip before starting to return results. Defaults to 0. 
        current_user (User): Authenticated User class of user sending the request.

    Returns:
        dict: JSON serialized User classes of search result and total count of results.

    Raises:
        HTTPException: If returned zero results or on error.
    '''
    try:
        search_query = (
            supabase_client.table('profiles')
            .select('id, username, pfp_url')
            .or_(f'username.ilike.%{query}%')
            .order('username')
            .limit(limit)
            .offset(offset)
            .execute()
        )

        if search_query.data == None: 
            raise HTTPException(status_code=404, detail='Search returned zero results')
        
        return {
            'results': search_query.data,
            'total_count': len(search_query.data),
            'has_more': len(search_query.data) == limit
        }
       
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Search failed: {str(e)}')


@app.get('/api/get_song')
async def get_song(song_url):

    song_preview = None
    spotify_song_id = None
    deezer_song_id = None

    spotify_song_id = song_url.split('/track/')[1].split('?')[0]

    try:
        song = spotify_client.track(spotify_song_id)
    except Exception as e:
        print(f'Error collecting from Spotify: {e}')

    try:
        search_url = f'''
            https://api.deezer.com/search?q=
            {song['name'].replace(' ', '+')}
            {song['artists'][0]['name']}&limit=1
        '''

        response = requests.get(search_url).json()

        deezer_song_id = response['data'][0]['id']
        deezer_song_url = f'https://api.deezer.com/track/{deezer_song_id}'
        deezer_song = requests.get(deezer_song_url).json()

        if deezer_song['artist']['name'].lower() == song['artists'][0]['name'].lower():
            song_preview = deezer_song['preview']

    except Exception as e:
        print(f'Error collecting from Deezer: {e}')

    return {
        'song_name': song['name'],
        'album_name': song['album']['name'],
        'artist_name': ', '.join([artist['name'] for artist in song['artists']]),
        'cover_art_url': song['album']['images'][0]['url'],
        'preview_url': song_preview,
        'spotify_song_id': spotify_song_id,
        'deezer_song_id': deezer_song_id
    }


@app.post('/api/ping')
@limiter.limit('20/minute')
async def ping(request: Request):
    return 'pong!'


@app.post('/api/auth_ping')
@limiter.limit('20/minute')
async def auth_ping(
    request: Request,
    current_user: User = Depends(get_current_user)
):  
    return 'auth_pong!'


if __name__ == '__main__':
    print('Please run script using Uvicorn')
