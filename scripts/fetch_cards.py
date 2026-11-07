import os
import urllib.request
import concurrent.futures

BASE_URL = "https://raw.githubusercontent.com/seven102161/elaine-tarot-cards/main/cards"
DEST_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "cards")
os.makedirs(DEST_DIR, exist_ok=True)

major_slugs = [
    "the-fool", "the-magician", "the-high-priestess", "the-empress", "the-emperor",
    "the-hierophant", "the-lovers", "the-chariot", "strength", "the-hermit",
    "wheel-of-fortune", "justice", "the-hanged-man", "death", "temperance",
    "the-devil", "the-tower", "the-star", "the-moon", "the-sun",
    "judgement", "the-world"
]

suit_prefixes = {
    "wands": "wa",
    "cups": "cu",
    "swords": "sw",
    "pentacles": "pe"
}

rank_names = [
    ("ace", "ac"),
    ("two", "02"),
    ("three", "03"),
    ("four", "04"),
    ("five", "05"),
    ("six", "06"),
    ("seven", "07"),
    ("eight", "08"),
    ("nine", "09"),
    ("ten", "10"),
    ("page", "pa"),
    ("knight", "kn"),
    ("queen", "qu"),
    ("king", "ki")
]

downloads = []

# 22 Major Arcana
for i, slug in enumerate(major_slugs):
    src_name = f"ar{i:02d}.jpg"
    dest_name = f"{slug}.jpg"
    downloads.append((src_name, dest_name))

# 56 Minor Arcana
for suit, prefix in suit_prefixes.items():
    for rank_slug, code in rank_names:
        src_name = f"{prefix}{code}.jpg"
        dest_name = f"{rank_slug}-of-{suit}.jpg"
        downloads.append((src_name, dest_name))

def fetch_card(item):
    src_name, dest_name = item
    url = f"{BASE_URL}/{src_name}"
    dest_path = os.path.join(DEST_DIR, dest_name)
    if os.path.exists(dest_path) and os.path.getsize(dest_path) > 1000:
        return dest_name, True
    try:
        urllib.request.urlretrieve(url, dest_path)
        return dest_name, True
    except Exception as e:
        return dest_name, str(e)

print(f"Downloading {len(downloads)} cards into {DEST_DIR}...")
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as executor:
    results = list(executor.map(fetch_card, downloads))

failed = [res for res in results if res[1] is not True]
if failed:
    print(f"Failed downloads ({len(failed)}): {failed}")
    exit(1)
else:
    print(f"Successfully downloaded and bundled all {len(downloads)} cards!")
