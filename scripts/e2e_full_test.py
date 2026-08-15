import requests
import time
BASE='http://127.0.0.1:8000'

print('Starting E2E tests...')

# Create test user (via Django shell would be better, but try registration endpoint)
email='e2e_test@example.com'
username='e2e_test'
password='Test@123456'

# cleanup maybe not available; attempt register
r = requests.post(f'{BASE}/api/accounts/register/', json={
    'email': email,
    'username': username,
    'display_name': 'E2E Tester',
    'password': password
})
print('REGISTER', r.status_code, r.text[:200])

# login
r = requests.post(f'{BASE}/api/accounts/login/', json={'email': email, 'password': password})
print('LOGIN', r.status_code, r.text[:200])
if r.status_code!=200:
    print('Login failed, aborting')
    raise SystemExit(1)

token = r.json().get('access')
headers={'Authorization': f'Bearer {token}'}

# GET /me
r = requests.get(f'{BASE}/api/accounts/me/', headers=headers)
print('/me', r.status_code, r.text[:300])

# GET posts
r = requests.get(f'{BASE}/api/posts/', headers=headers)
print('/posts GET', r.status_code)

# CREATE text post
post_data={'content':'E2E automated text post','visibility':'public','allow_comments':True}
# send as JSON
r = requests.post(f'{BASE}/api/posts/', json=post_data, headers=headers)
print('/posts POST text', r.status_code, r.text[:300])
post_id=None
if r.status_code in (200,201):
    post_id=r.json().get('id')

# CREATE image post (upload file)
try:
    with open('create_sample.png','rb') as f:
        files={'image': ('sample.png', f, 'image/png')}
        r2 = requests.post(f'{BASE}/api/posts/', headers=headers, files=files, data={'content':'E2E image post'})
        print('/posts POST image', r2.status_code, r2.text[:300])
        if r2.status_code in (200,201) and not post_id:
            post_id=r2.json().get('id')
except FileNotFoundError:
    print('No sample image file present, skipping image upload')

# REACTION: post reaction
if post_id:
    r = requests.post(f'{BASE}/api/reactions/', headers=headers, json={'post':post_id,'reaction_type':'like'})
    print('/reactions POST', r.status_code, r.text[:200])
    if r.status_code in (200,201):
        reaction_id = r.json().get('id')
    else:
        reaction_id=None
else:
    print('No post_id to react to')

# COMMENTS
if post_id:
    r = requests.post(f'{BASE}/api/comments/', headers=headers, json={'post':post_id,'content':'E2E comment'})
    print('/comments POST', r.status_code, r.text[:200])
    if r.status_code in (200,201):
        comment_id = r.json().get('id')
    else:
        comment_id=None

    # GET comments
    r = requests.get(f'{BASE}/api/comments/', headers=headers, params={'post':post_id})
    print('/comments GET', r.status_code, (r.text[:300]))

# BOOKMARK
if post_id:
    r = requests.post(f'{BASE}/api/bookmarks/', headers=headers, json={'post':post_id})
    print('/bookmarks POST', r.status_code, r.text[:200])
    if r.status_code in (200,201):
        bookmark_id = r.json().get('id')
    else:
        bookmark_id=None

    # GET bookmarks
    r = requests.get(f'{BASE}/api/bookmarks/', headers=headers)
    print('/bookmarks GET', r.status_code, r.text[:300])

    # DELETE bookmark
    if bookmark_id:
        r = requests.delete(f'{BASE}/api/bookmarks/{bookmark_id}/', headers=headers)
        print('/bookmarks DELETE', r.status_code, r.text[:200])

# NOTIFICATIONS
r = requests.get(f'{BASE}/api/notifications/', headers=headers)
print('/notifications GET', r.status_code, r.text[:300])

# CHATS: create a conversation
r = requests.get(f'{BASE}/api/chats/', headers=headers)
print('/chats GET', r.status_code, r.text[:300])

print('E2E script done')
