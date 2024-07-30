import sys
import requests

def create_invite(token):
    url = "https://discord.com/api/v9/users/@me/invites"
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; rv:103.0) Gecko/20100101 Firefox/103.0",
        "Accept": "*/*",
        "Accept-Language": "en,sk;q=0.8,cs;q=0.5,en-US;q=0.3",
        "Content-Type": "application/json",
        "Authorization": token,
        "X-Discord-Locale": "en-US",
        "X-Debug-Options": "bugReporterEnabled",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "Sec-GPC": "1"
    }
    
    data = "{}" 
    
    try:
        response = requests.post(url, headers=headers, data=data)
        response.raise_for_status()
        
        invite_data = response.json()
        invite_link = f"https://discord.gg/{invite_data['code']}"
        
        return invite_link
    
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        return None

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Error: No token provided")
        sys.exit(1)

    token = sys.argv[1]
    invite_link = create_invite(token)
    if invite_link:
        print(f"{invite_link}")
    else:
        print("Failed to create invite.")
