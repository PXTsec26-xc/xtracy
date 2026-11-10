from PIL import Image

ui_img = Image.open('C:/Users/maisu/.gemini/antigravity/brain/d2fe9ac8-2f94-4cc1-8b9a-b8e2b2c417eb/.user_uploaded/media_1794316397284_cce7ad3c.jpg')
w, h = ui_img.size
print(f"UI Reference dimensions: {w}x{h}")

# The hero cyber globe is on the top-right of the UI reference:
# Top navigation is roughly y: 0 to 60.
# Hero section is roughly y: 70 to 300.
# The globe is roughly x: 550 to 980, y: 70 to 300.
globe_crop = ui_img.crop((560, 65, 965, 305))
globe_crop.save('public/brand/hero-cyber-globe.png', 'PNG')
print(f"Saved hero-cyber-globe.png: {globe_crop.size}")

# The founder silhouette is in the bottom card:
# The founder card is roughly y: 500 to 610.
# The silhouette is on the left side of this card: x: 70 to 220, y: 505 to 605.
founder_crop = ui_img.crop((70, 505, 230, 608))
founder_crop.save('public/brand/founder-silhouette.png', 'PNG')
print(f"Saved founder-silhouette.png: {founder_crop.size}")
