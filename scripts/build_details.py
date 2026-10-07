#!/usr/bin/env python3
import os
import sys
from PIL import Image

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMAGES_DIR = os.path.join(PROJECT_ROOT, "images")
DETAILS_DIR = os.path.join(PROJECT_ROOT, "details")

print(f"Project root: {PROJECT_ROOT}")
print(f"Scanning {IMAGES_DIR}...")

total_original_bytes = 0
total_webp_bytes = 0
count = 0

for root, dirs, files in os.walk(IMAGES_DIR):
    for f in files:
        if f.lower().endswith(('.png', '.jpg', '.jpeg')) and not f.startswith('.'):
            src_path = os.path.join(root, f)
            rel_path = os.path.relpath(src_path, IMAGES_DIR)
            rel_dir = os.path.dirname(rel_path)
            base_name, _ = os.path.splitext(f)
            
            target_dir = os.path.join(DETAILS_DIR, rel_dir)
            os.makedirs(target_dir, exist_ok=True)
            target_path = os.path.join(target_dir, f"{base_name}.webp")
            
            src_size = os.path.getsize(src_path)
            total_original_bytes += src_size
            
            # If target already exists and is newer than src, reuse
            if os.path.exists(target_path) and os.path.getmtime(target_path) >= os.path.getmtime(src_path):
                dst_size = os.path.getsize(target_path)
            else:
                with Image.open(src_path) as im:
                    # Convert to RGB if RGBA and no transparent pixels, or keep RGBA
                    if im.mode in ('RGBA', 'LA') or (im.mode == 'P' and 'transparency' in im.info):
                        im.save(target_path, "WEBP", quality=85, method=4)
                    else:
                        im = im.convert("RGB")
                        im.save(target_path, "WEBP", quality=85, method=4)
                dst_size = os.path.getsize(target_path)
            
            total_webp_bytes += dst_size
            count += 1

print(f"Processed {count} images.")
print(f"Original total size: {total_original_bytes / (1024*1024):.2f} MB")
print(f"WebP details size:   {total_webp_bytes / (1024*1024):.2f} MB")
saved = total_original_bytes - total_webp_bytes
pct = (saved / total_original_bytes) * 100 if total_original_bytes else 0
print(f"Saved: {saved / (1024*1024):.2f} MB ({pct:.1f}% reduction)")
