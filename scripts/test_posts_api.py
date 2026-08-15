import requests

BASE = 'http://127.0.0.1:8000'

login = requests.post(f'{BASE}/api/accounts/login/', json={
    'email': 'testuser@example.com',
    'password': 'Test@123456'
})
print('LOGIN', login.status_code)
print(login.text)

if login.status_code != 200:
    raise SystemExit('Login failed')

access = login.json().get('access')
if not access:
    raise SystemExit('No access token')

headers = {'Authorization': f'Bearer {access}'}

posts = requests.get(f'{BASE}/api/posts/', headers=headers)
print('GET /api/posts/ ->', posts.status_code)
print(posts.text)
