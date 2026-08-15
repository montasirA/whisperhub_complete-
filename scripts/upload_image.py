import requests
import json

LOGIN_URL = 'http://127.0.0.1:8000/api/accounts/login/'
POST_URL = 'http://127.0.0.1:8000/api/posts/'

creds = {"email":"whisperhubtest2026+py@gmail.com","password":"Test@123456"}
resp = requests.post(LOGIN_URL, json=creds)
print('login', resp.status_code, resp.text)
resp.raise_for_status()
obj = resp.json()
token = obj['access']
headers = {'Authorization': f'Bearer {token}'}

files = {'image': open('e:/New folder/whisperhub_01/whisperHub/backend/test_image.png','rb')}
data = {'content': 'Image post from script'}
resp2 = requests.post(POST_URL, headers=headers, files=files, data=data)
print('upload', resp2.status_code, resp2.text)
if resp2.status_code == 201:
    post = resp2.json()
    print('created', post['id'])
    # fetch posts
    resp3 = requests.get(POST_URL, headers=headers)
    print('posts', resp3.status_code)
    print(resp3.text)
