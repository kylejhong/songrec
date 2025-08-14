import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

# Replace with your own credentials
CLIENT_ID = '48c176d6b8994da9af585c7291524e51'
CLIENT_SECRET = 'b430385e1fc54672b50bc5a89936cf4f'

# Set up authentication
client_credentials = SpotifyClientCredentials(client_id=CLIENT_ID, client_secret=CLIENT_SECRET)
sp = spotipy.Spotify(client_credentials_manager=client_credentials)

def get_track_info(track_id):
    """Fetch and print basic track information"""
    track = sp.track(track_id)
    
    print(f"Track: {track['name']}")
    print(f"Album: {track['album']['name']}")
    print(f"Artists: {', '.join([artist['name'] for artist in track['artists']])}")
    print(f"Release Date: {track['album']['release_date']}")
    print(f"Cover Art (URL): {track['album']['images'][0]['url']}")  # Highest resolution
    print(f"Spotify URL: {track['external_urls']['spotify']}")
    print(f"Duration: {round(track['duration_ms']/60000, 2)} minutes")

def get_track_preview(track_id):
    track = sp.track(track_id)
    
    print(f"Track: {track['name']}")
    print(track['external_urls'])
    
import requests

def get_deezer_preview(track_id=None, search_query=None):
    """
    Get a Deezer track preview URL either by:
    - Direct track ID, or
    - Search query (e.g., "Blinding Lights The Weeknd")
    
    Returns: Preview URL (MP3) or None if not found.
    """
    BASE_URL = "https://api.deezer.com"
    
    try:
        # If search query is provided (instead of track ID)
        if search_query:
            search_url = f"{BASE_URL}/search?q={search_query.replace(' ', '+')}&limit=1"
            response = requests.get(search_url).json()
            if not response.get('data'):
                print("🚨 No results found for query.")
                return None
            track_id = response['data'][0]['id']  # Get first result's ID

        # Fetch track details (including preview URL)
        track_url = f"{BASE_URL}/track/{track_id}"
        track_data = requests.get(track_url).json()
        
        if 'preview' in track_data and track_data['preview']:
            print(f"🎵 Found: {track_data['title']} by {track_data['artist']['name']}")
            print(f"🔊 Preview URL: {track_data['preview']}")
            return track_data['preview']
        else:
            print("❌ No preview available for this track.")
            return None

    except Exception as e:
        print(f"⚠️ Error: {e}")
        return None

# Example usage - "Blinding Lights" by The Weeknd
#get_track_info('2BXqkdNexSZDk9tD6frccY')  # Replace with any Spotify track ID
#get_track_preview("0VjIjW4GlUZAMYd2vXMi3b")
get_deezer_preview('3135556')
