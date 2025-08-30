import os
from fastapi import FastAPI
from supabase import create_client, Client
from dotenv import load_dotenv
import hashlib
import json

load_dotenv()
app = FastAPI()

url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)

# Sign up function to set up user id
# Receives: User id
# Returns: Status code
@app.get('/create_user')
def create_user(user_id):

    response = (
        supabase.table("users")
        .insert({
            "id": user_id
        })
        .execute()
    )

@app.get('/update_user/{col_name}/data/{data}')
def update_user():

    response_incoming_friend_ids = (
        supabase.table("users")
        .update({col_name: data})
        .eq("id", user_id)
        .execute()
    )

# Poll request function:
# Receives: hash OR Nothing
# Returns: user object if hash of user object is different
@app.get('/poll_hash')
def poll_hash(user_id, current_hash):

    hash = (
        supabase.table("users")
        .select("hash")
        .eq("id", user_id)
        .limit(1)
        .execute()
        .data[0]['hash']
    )

    return hash 


@app.get('/collect_user')
def collect_user(user_id, current_hash):

    user = (
        supabase.table("users")
        .select("*")
        .eq("id", user_id)
        .limit(1)
        .execute()
        .data[0]
    )

    return user

@app.get('/collect_outgoing')
def collect_outgoing(user_id):

    outgoing = (
        supabase.table("users")
        .select("*")
        .eq("id", user_id)
        .limit(1)
        .execute()
        .data[0]["outgoing_requests"]
    )

    response = (
        supabase.table("users")
        .select("*")
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
        supabase.table("users")
        .select("*")
        .eq("id", user_id)
        .limit(1)
        .execute()
        .data[0]["incoming_requests"]
    )

    response = (
        supabase.table("users")
        .select("*")
        .execute()
        .data
    )

    users = []
    
    for user in response:
        if user['id'] in incoming:
            users.append(user)

    return users

# Get list of recommended friends (name, id, pfp)
# Receives: Nothing
# Returns: List of basic user objects
# Check if friend id exists in outgoing request ids in user (*)
@app.get('/get_recommendations')
def get_recommendations(user_id, input):

    friend_ids = (
        supabase.table("users")
        .select("*")
        .eq("id", user_id)
        .limit(1)
        .execute()
        .data[0]["friend_request_ids"]
    )

    response = (
        supabase.table("users")
        .select("*")
        .execute()
        .data
    )

    recommendations = []
    
    for user in response:
        if user['id'] not in friend_ids:
            if input:
                if input in user['username']:
                    recommendations.append(user)
            else:
                recommendations.append(user)

    return recommendations[:5]
    
    # for loop of 5
    # get top user from users
    # check id if in hashset
    # if not then add mini_user in list

# Send friend request
# Receives: User id
# Returns: Status code
# Poll function should occur afterward
@app.get('/friend_request')
def friend_request(requester, accepter):

    accepter_incoming = (
        supabase.table("users")
        .select("incoming_requests")
        .eq("id", accepter)
        .limit(1)
        .execute()
        .data[0]["incoming_requests"]
    )

    requester_outgoing = (
        supabase.table("users")
        .select("outgoing_requests")
        .eq("id", requester)
        .limit(1)
        .execute()
        .data[0]["outgoing_requests"]
    )

    requester_outgoing.append(accepter)
    accepter_incoming.append(requester)

    response_requester_outgoing = (
        supabase.table("users")
        .update({"outgoing_requests": requester_outgoing})
        .eq("id", requester)
        .execute()
    )

    response_accepter_incoming = (
        supabase.table("users")
        .update({"incoming_requests": accepter_incoming})
        .eq("id", accepter)
        .execute()
    )

    return 1


@app.get('/accept_request')
def accept_request(accepter, requester):

    accepter_incoming = (
        supabase.table("users")
        .select("incoming_requests")
        .eq("id", accepter)
        .limit(1)
        .execute()
        .data[0]["incoming_requests"]
    )

    requester_outgoing = (
        supabase.table("users")
        .select("outgoing_requests")
        .eq("id", requester)
        .limit(1)
        .execute()
        .data[0]["outgoing_requests"]
    )

    accepter_friends = (
        supabase.table("users")
        .select("friends")
        .eq("id", accepter)
        .limit(1)
        .execute()
        .data[0]["friends"]
    )

    requester_friends = (
        supabase.table("users")
        .select("friends")
        .eq("id", requester)
        .limit(1)
        .execute()
        .data[0]["friends"]
    )

    accepter_incoming.remove(requester)
    requester_outgoing.remove(accepter)
    requester_friends.append(accepter)
    accepter_friends.append(requester)

    response_accepter_incoming = (
        supabase.table("users")
        .update({"incoming_requests": accepter_incoming})
        .eq("id", accepter)
        .execute()
    )

    response_requester_outgoing = (
        supabase.table("users")
        .update({"outgoing_requests": requester_outgoing})
        .eq("id", requester)
        .execute()
    )

    response_accepter_friends = (
        supabase.table("users")
        .update({"friends": accepter_friends})
        .eq("id", accepter)
        .execute()
    )

    response_requester_friends = (
        supabase.table("users")
        .update({"friends": requester_friends})
        .eq("id", requester)
        .execute()
    )

    return 1

    pass
    # check if requesteris in list (security thing)
    # add user id to friend of requesterand vice versa
    # return status code

# Search for users (chunks? how work think)

# home page check (is it time of the week for user)

## song sunmission page

def create_mini_user(user_object):
    # returns mini user
    pass

def hash_user(user_object):
    json_str = json.dumps(user_object, sort_keys=True)
    return hashlib.sha256(json_str.encode()).hexdigest()

def test():
    return 'prink!'

# (*) == would change if scaled
#friend_request(1, 2)
#accept_request(1, 2)
#print(collect_incoming('123e4567-e89b-12d3-a456-426614174008'))
