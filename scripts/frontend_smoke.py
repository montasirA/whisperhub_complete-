import requests

BASE='http://127.0.0.1:3001'
paths=['/','/feed','/login','/register','/profile','/settings','/chats','/notifications']

for p in paths:
    try:
        r=requests.get(BASE+p, timeout=5)
        print(p, r.status_code, len(r.text))
    except Exception as e:
        print(p, 'ERROR', str(e))
