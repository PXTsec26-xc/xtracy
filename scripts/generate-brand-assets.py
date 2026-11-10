import os
from PIL import Image

def generate_brand_assets():
    # 1. Load full logo
    logo_path = 'public/brand/xtracy-logo.png'
    if not os.path.exists(logo_path):
        raise FileNotFoundError(f"Logo not found at {logo_path}")

    full_logo = Image.open(logo_path).convert('RGBA')
    lw, lh = full_logo.size
    print(f"Full logo dimensions: {lw}x{lh}")

    # 2. Extract shield with safe margins to ensure no glow or ring is cut off
    # Detected bounds were x=[33, 379], y=[13, 325]
    crop_x1 = max(0, 33 - 8)   # 25
    crop_y1 = max(0, 13 - 8)   # 5
    crop_x2 = min(lw, 379 + 8) # 387
    crop_y2 = min(lh, 325 + 8) # 333

    shield_crop = full_logo.crop((crop_x1, crop_y1, crop_x2, crop_y2))
    sw, sh = shield_crop.size
    print(f"Extracted shield crop: {sw}x{sh} (aspect ratio: {sw/sh:.3f})")

    # 3. Create a 512x512 square canvas with dark background matching the logo's #000000/#020611
    # We will preserve aspect ratio and center the shield with proportional padding
    canvas_size = 512
    master_symbol = Image.new('RGBA', (canvas_size, canvas_size), (0, 0, 0, 255))

    # Scale shield to fit comfortably inside canvas (e.g. max dimension 460px to leave 26px padding on all sides)
    target_max = 460
    scale = target_max / max(sw, sh)
    scaled_w = int(sw * scale)
    scaled_h = int(sh * scale)

    resized_shield = shield_crop.resize((scaled_w, scaled_h), Image.Resampling.LANCZOS)
    offset_x = (canvas_size - scaled_w) // 2
    offset_y = (canvas_size - scaled_h) // 2

    master_symbol.paste(resized_shield, (offset_x, offset_y), resized_shield)

    # 4. Save brand symbol
    symbol_png = 'public/brand/xtracy-symbol.png'
    master_symbol.save(symbol_png, 'PNG')
    print(f"Saved master symbol: {symbol_png} (512x512)")

    # 5. Save PWA icons
    icon_512 = 'public/icon-512.png'
    master_symbol.save(icon_512, 'PNG')
    print(f"Saved: {icon_512} (512x512)")

    icon_192 = 'public/icon-192.png'
    master_symbol.resize((192, 192), Image.Resampling.LANCZOS).save(icon_192, 'PNG')
    print(f"Saved: {icon_192} (192x192)")

    # 6. Save favicons
    fav_32 = 'public/favicon-32x32.png'
    master_symbol.resize((32, 32), Image.Resampling.LANCZOS).save(fav_32, 'PNG')
    print(f"Saved: {fav_32} (32x32)")

    fav_16 = 'public/favicon-16x16.png'
    master_symbol.resize((16, 16), Image.Resampling.LANCZOS).save(fav_16, 'PNG')
    print(f"Saved: {fav_16} (16x16)")

    fav_ico = 'public/favicon.ico'
    master_symbol.save(fav_ico, format='ICO', sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
    print(f"Saved: {fav_ico} (Multi-size ICO)")

if __name__ == '__main__':
    generate_brand_assets()
