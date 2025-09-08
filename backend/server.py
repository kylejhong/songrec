# Depreceated List:
# /friend_request --> /api/friend_request
# /collect_user --> /api/get_my_profile
# supabase key 

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

    import json # -------- only used here, so is fine?

    with open('test_keys.json', 'r') as f:
        JWT_KEY = json.load(f)

    jwt_instance = jwcrypto.JWK.from_json(json.dumps(JWT_KEY))
    pem_data = jwt_instance.export_to_pem()
    public_key = pem_data.decode('utf-8')

    def get_public_key():
        return public_key

else:
    JWT_KEY = os.getenv('JWT_TEST_KEYS') # adjust so it grabs from url --------------

    def get_public_key():
        return JWT_KEY


class User(pydantic.BaseModel):
    id: str
    username: str
    pfp_url: str
    email_notifications: bool
    push_notifications: bool
    created_at: datetime
    updated_at: datetime

    def toJSON(self): # -------- check if works so front-end still functions
        return json.dumps(
            self,
            default=lambda o: o.__dict__, 
            sort_keys=True,
            indent=4
        )


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
            raise HTTPException(
                status_code=401,
                detail='Invalid authentication credentials'
            )
        
        user_data = (
            supabase_client.table('profiles')
            .select('*')
            .eq('id', user_id)
            .execute()
        )
        
        if not user_data.data:
            raise HTTPException(
                status_code=404,
                detail='User not found'
            )
        
        return User(**user_data.data[0])
        
    except InvalidTokenError as e: # properly look into the erros and exceptions of this function
        raise HTTPException(
            status_code=401,
            detail='Invalid authentication credentials'
        )


@app.get('/api/my-profile')
async def get_my_profile(current_user: User = Depends(get_current_user)):
    return current_user


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

    receiver = (
        supabase.table('profiles')
        .select('*')
        .eq('id', receiver_id)
        .execute()
    )
    if not receiver.data:
        raise HTTPException(status_code=404, detail='Receiver not found') # ---------------decide if these should be one line or two line
    
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
        supabase.table('friend_requests')
        .insert({
            'sender_id': current_user.id,
            'receiver_id': receiver_id,
            'status': 'pending'
        })
        .execute()
    )
    
    return {'message': 'Friend request sent', 'request_id': new_request.data[0]['id']} # ------------ should be dict?


@app.post('/api/accept_request')
@limiter.limit('20/minute')
async def accept_friend_request(
    request: Request,
    request_id: str,
    current_user: User = Depends(get_current_user)
):

    '''
    Accept a friend request directed to the current user from another user.

    Args:
        request (Request): Required for the SlowApi rate limiter to hook into it.
        request_id (str): UID of friend request in DB.
        current_user (User): Authenticated User class of user recieving the request.

    Returns:
        dict: Status of operation.

    Raises:
        HTTPException: If the request doesn't exist.
    '''

    request = (
        supabase_client.table('friend_requests')
        .select('*')
        .eq('id', request_id)
        .execute()
    )
    if not request.data:
        raise HTTPException(status_code=404, detail='Request not found') # ---------------decide if these should be one line or two line
    
    accept_request = (
        supabase_client.table('friend_requests')
        .update({
            'status': 'accepted'
        })
        .eq('id', request_id)
        .execute()
    )

    add_friend = (
        supabase.table('friends')
        .insert({
            'user_id': current_user.id,
            'friend_id': accept_request.data.sender_id, # -------------------- see if this even works
            'status': 'pending'
        })
        .execute()
    )
    
    return {'message': 'Friend request sent', 'user_id': add_friend.data[0]['user_id']} # ------------ should be dict?

# ------------------- look for how auth will be implemented and adjust this function/pipeline accordingly
@app.get('/create_user')
def create_user(user_id):

    response = (
        supabase_client.table('users')
        .insert({
            'id': user_id
        })
        .execute()
    )

    return 1

# ----------- insecure update function. Adjust accordingly (probably just have specific function names for it)
@app.get('/update_user/')
def update_user(user_id, col_name, data):

    response_incoming_friend_ids = (
        supabase_client.table('users')
        .update({col_name: data})
        .eq('id', user_id)
        .execute()
    )

    return 1


@app.get('/collect_outgoing')
def collect_outgoing(user_id):

    outgoing = (
        supabase_client.table('users')
        .select('*')
        .eq('id', user_id)
        .limit(1)
        .execute()
        .data[0]['outgoing_requests']
    )

    response = (
        supabase_client.table('users')
        .select('*')
        .execute()
        .data
    )

    users = []
    
    for user in response:
        if user['id'] in outgoing:
            users.append(user)

    return users


@app.get('/collect_incoming')
def collect_incoming(user_id):

    incoming = (
        supabase_client.table('users')
        .select('*')
        .eq('id', user_id)
        .limit(1)
        .execute()
        .data[0]['incoming_requests']
    )

    response = (
        supabase_client.table('users')
        .select('*')
        .execute()
        .data
    )

    users = []
    
    for user in response:
        if user['id'] in incoming:
            users.append(user)

    return users


@app.get('/api/search_users')
async def search_users(
    query: str = Query(..., min_length=1, max_length=50),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user)
):
    '''
    Search for any user in the search page based on username

    Args:
        query (str): The user-entered string to search.
        limit (int): 
        offset (int):
        current_user (User): Authenticated User class of user sending the request.

    Returns:
        dict: JSON serialized User classes of search result and total count of results.

    Raises:
        HTTPException: If returned zero results or on error.
    '''
    try:
        search_query = (
            supabase.table('profiles')
            .select('id, username')
            .or_(f'username.ilike.%{query}%')
            .order('username')
            .limit(limit)
            .offset(offset)
            .execute()
        )

        if search_query.data == None: # ------------------------------
            raise HTTPException(
                status_code=404, # ----------------------------
                detail='Search returned zero results'
            )
        
        return {
            'results': search_query.data,
            'total_count': len(search_query.data),
            'has_more': len(search_query.data) == limit
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f'Search failed: {str(e)}'
        )


@app.get('/reject_request')
def reject_request(accepter, requester):

    accepter_incoming = (
        supabase_client.table('users')
        .select('incoming_requests')
        .eq('id', accepter)
        .limit(1)
        .execute()
        .data[0]['incoming_requests']
    )

    requester_outgoing = (
        supabase_client.table('users')
        .select('outgoing_requests')
        .eq('id', requester)
        .limit(1)
        .execute()
        .data[0]['outgoing_requests']
    )

    requester_outgoing.remove(accepter)
    accepter_incoming.remove(requester)

    response_requester_outgoing = (
        supabase_client.table('users')
        .update({'outgoing_requests': requester_outgoing})
        .eq('id', requester)
        .execute()
    )

    response_accepter_incoming = (
        supabase_client.table('users')
        .update({'incoming_requests': accepter_incoming})
        .eq('id', accepter)
        .execute()
    )

    return 1


@app.get('/remove_friend')
def remove_friend(user, friend):

    user_friends = (
        supabase_client.table('users')
        .select('friends')
        .eq('id', user)
        .limit(1)
        .execute()
        .data[0]['friends']
    )

    friend_friends = (
        supabase_client.table('users')
        .select('friends')
        .eq('id', friend)
        .limit(1)
        .execute()
        .data[0]['friends']
    )

    user_friends.remove(friend)
    friend_friends.remove(user)

    response_user_friends = (
        supabase_client.table('users')
        .update({'friends': user_friends})
        .eq('id', user)
        .execute()
    )

    response_friend_friends = (
        supabase_client.table('users')
        .update({'friends': friend_friends})
        .eq('id', friend)
        .execute()
    )

    return 1


@app.get('/accept_request')
def accept_request(accepter, requester):

    accepter_incoming = (
        supabase_client.table('users')
        .select('incoming_requests')
        .eq('id', accepter)
        .limit(1)
        .execute()
        .data[0]['incoming_requests']
    )

    requester_outgoing = (
        supabase_client.table('users')
        .select('outgoing_requests')
        .eq('id', requester)
        .limit(1)
        .execute()
        .data[0]['outgoing_requests']
    )

    accepter_friends = (
        supabase_client.table('users')
        .select('friends')
        .eq('id', accepter)
        .limit(1)
        .execute()
        .data[0]['friends']
    )

    requester_friends = (
        supabase_client.table('users')
        .select('friends')
        .eq('id', requester)
        .limit(1)
        .execute()
        .data[0]['friends']
    )

    accepter_incoming.remove(requester)
    requester_outgoing.remove(accepter)
    requester_friends.append(accepter)
    accepter_friends.append(requester)

    response_accepter_incoming = (
        supabase_client.table('users')
        .update({'incoming_requests': accepter_incoming})
        .eq('id', accepter)
        .execute()
    )

    response_requester_outgoing = (
        supabase_client.table('users')
        .update({'outgoing_requests': requester_outgoing})
        .eq('id', requester)
        .execute()
    )

    response_accepter_friends = (
        supabase_client.table('users')
        .update({'friends': accepter_friends})
        .eq('id', accepter)
        .execute()
    )

    response_requester_friends = (
        supabase_client.table('users')
        .update({'friends': requester_friends})
        .eq('id', requester)
        .execute()
    )

    return 1

    pass
    # check if requesteris in list (security thing)
    # add user id to friend of requesterand vice versa
    # return status code

@app.get('/get_song')
def get_song(song_url):

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

        if lower(deezer_song['artist']['name']) == lower(song['artists'][0]['name']):
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
    return 'ping!'


@app.post('/api/auth_ping')
@limiter.limit('20/minute')
async def auth_ping(
    request: Request,
    current_user: User = Depends(get_current_user)
):
    return 'pong!'


# (*) == would change if scaled
#friend_request(1, 2)
#accept_request(1, 2)
#print(collect_incoming('123e4567-e89b-12d3-a456-426614174008'))
if __name__ == '__main__':
    print('Please run script using Uvicorn')
