from PIL import Image

# Let's inspect the hero globe crop
globe = Image.open('public/brand/hero-cyber-globe.png')
print("Globe size:", globe.size)

# In the UI reference, what is the exact bounding box of the glowing circular globe with pedestal?
# Let's inspect coordinates in the full image:
ui_img = Image.open('C:/Users/maisu/.gemini/antigravity/brain/d2fe9ac8-2f94-4cc1-8b9a-b8e2b2c417eb/.user_uploaded/media_1794316397284_cce7ad3c.jpg')

# Let's crop x from 540 to 980, y from 60 to 310
refined_globe = ui_img.crop((545, 60, 975, 310))
refined_globe.save('public/brand/hero-cyber-globe.png', 'PNG')
print("Refined globe size:", refined_globe.size)

# For founder silhouette, in the reference image at bottom:
# Founder card is from y: 505 to 610, x: 40 to 980.
# The silhouette image is inside the left container of the founder card:
# Let's crop x: 75 to 225, y: 512 to 604
founder_sil = ui_img.crop((75, 510, 225, 606))
founder_sil.save('public/brand/founder-silhouette.png', 'PNG')
print("Refined founder silhouette size:", founder_sil.size)
