from PIL import Image

# Load the original logo
img = Image.open('public/brand/xtracy-logo.png').convert('RGBA')
width, height = img.size
print(f"Original logo dimensions: {width}x{height}")

# Let's inspect where non-black pixels are on the left side (shield region)
# Non-black threshold: sum of R, G, B > 30
min_x, max_x = width, 0
min_y, max_y = height, 0

# The shield is located on the left portion (roughly x < 400)
for y in range(height):
    for x in range(380):
        r, g, b, a = img.getpixel((x, y))
        if r > 15 or g > 15 or b > 15:
            if x < min_x: min_x = x
            if x > max_x: max_x = x
            if y < min_y: min_y = y
            if y > max_y: max_y = y

print(f"Detected shield region: x=[{min_x}, {max_x}], y=[{min_y}, {max_y}]")
print(f"Shield bounding box dimensions: width={max_x - min_x + 1}, height={max_y - min_y + 1}")
