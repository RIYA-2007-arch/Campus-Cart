import difflib
import os
import sys

from seed_demo import PHOTO_DIR, SECTIONS, slugify

EXTENSIONS = (".jpg", ".jpeg", ".png", ".webp")
PRIORITY = [
    "asus-laptop", "hp-laptop", "dell-laptop", "lenovo-laptop", "acer-laptop", "macbook", "msi-laptop",
    "monitor", "keyboard", "mouse", "headphones", "earphones", "power-bank", "tablet", "phone", "ssd",
    "calculator", "book-dsa", "book-dbms", "book-python", "book-java", "book-ai", "book-os", "book-networks",
    "bag", "arduino-board", "arduino-kit", "bicycle", "cricket", "badminton", "football", "sports-shoes",
]


def resize_all(files):
    try:
        from PIL import Image
    except ImportError:
        print("Pillow install nahi hai. Pehle chalao:  py -m pip install Pillow")
        return
    done = 0
    for path in files:
        extension = os.path.splitext(path)[1].lower()
        with Image.open(path) as image:
            image.thumbnail((1000, 1000))
            if extension in (".jpg", ".jpeg"):
                image.convert("RGB").save(path, "JPEG", quality=85, optimize=True)
            elif extension == ".png":
                image.save(path, "PNG", optimize=True)
            else:
                image.save(path, "WEBP", quality=85)
        done += 1
    print(f"{done} photos resize ho gayi (max 1000 px).")


def main():
    os.makedirs(PHOTO_DIR, exist_ok=True)
    groups = {group for _kw, group, _emoji, _entries in SECTIONS}
    slugs = {slugify(entry[0]) for _kw, _group, _emoji, entries in SECTIONS for entry in entries}
    valid = groups | slugs

    names = sorted(os.listdir(PHOTO_DIR))
    photos = [n for n in names if os.path.splitext(n)[1].lower() in EXTENSIONS]
    paths = [os.path.join(PHOTO_DIR, n) for n in photos]

    print(f"Folder: {PHOTO_DIR}")
    print(f"Photos mili: {len(photos)}\n")

    matched, unknown = set(), []
    for name in photos:
        stem = os.path.splitext(name)[0]
        if stem in valid:
            matched.add(stem)
            size_mb = os.path.getsize(os.path.join(PHOTO_DIR, name)) / (1024 * 1024)
            note = "  (5 MB se badi, use nahi hogi, --resize chalao)" if size_mb > 5 else ""
            print(f"OK       {name}{note}")
        else:
            unknown.append(name)

    for name in unknown:
        stem = os.path.splitext(name)[0]
        guess = difflib.get_close_matches(stem.lower(), list(groups), n=1, cutoff=0.5)
        hint = f"  -> shayad '{guess[0]}' likhna tha" if guess else "  -> naam kisi group se match nahi hua"
        print(f"GALAT    {name}{hint}")

    double = [n for n in names if n.lower().endswith((".jpg.jpg", ".png.png", ".jpg.png", ".png.jpg"))]
    for name in double:
        print(f"EXTENSION  {name}  -> naam mein do extension hain, ek hata do")

    missing = [g for g in PRIORITY if g not in matched]
    print(f"\nZaroori groups ki photos: {len(PRIORITY) - len(missing)} / {len(PRIORITY)}")
    if missing:
        print("Abhi baaki (pehle ye daalo):")
        print("  " + ", ".join(missing))

    if "--resize" in sys.argv:
        print()
        resize_all(paths)
    else:
        print("\nBadi photos chhoti karne ke liye:  py photo_check.py --resize")
    print("Photos ready hon toh:  py seed_demo.py")


if __name__ == "__main__":
    main()