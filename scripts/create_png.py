from PIL import Image, ImageDraw
p='E:/New folder/whisperhub_01/whisperHub/backend/test_image.png'
img = Image.new('RGB', (64,64), color=(73,109,137))
d = ImageDraw.Draw(img)
d.text((10,25), 'Hi', fill=(255,255,0))
img.save(p)
print('WROTE', p)
