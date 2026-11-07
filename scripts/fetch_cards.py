import concurrent.futures
import os
import sys
import urllib.request

BASE_URL = "https://raw.githubusercontent.com/seven102161/elaine-tarot-cards/main/cards"
DEST_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "cards")
TIMEOUT_SECONDS = 15

# Upstream seven102161/elaine-tarot-cards has corrupt scans for 9 court/ace cards; route to verified public-domain 720px scans.
VERIFIED_CARD_URLS = {
    "ace-of-swords.jpg": "https://raw.githubusercontent.com/mixvlad/TarotCards/main/tarot/rider-waite/720px/Swords01.jpg",
    "page-of-swords.jpg": "https://raw.githubusercontent.com/mixvlad/TarotCards/main/tarot/rider-waite/720px/Swords11.jpg",
    "knight-of-swords.jpg": "https://raw.githubusercontent.com/mixvlad/TarotCards/main/tarot/rider-waite/720px/Swords12.jpg",
    "queen-of-swords.jpg": "https://raw.githubusercontent.com/mixvlad/TarotCards/main/tarot/rider-waite/720px/Swords13.jpg",
    "king-of-swords.jpg": "https://raw.githubusercontent.com/mixvlad/TarotCards/main/tarot/rider-waite/720px/Swords14.jpg",
    "page-of-pentacles.jpg": "https://raw.githubusercontent.com/mixvlad/TarotCards/main/tarot/rider-waite/720px/Pents11.jpg",
    "knight-of-pentacles.jpg": "https://raw.githubusercontent.com/mixvlad/TarotCards/main/tarot/rider-waite/720px/Pents12.jpg",
    "queen-of-pentacles.jpg": "https://raw.githubusercontent.com/mixvlad/TarotCards/main/tarot/rider-waite/720px/Pents13.jpg",
    "king-of-pentacles.jpg": "https://raw.githubusercontent.com/mixvlad/TarotCards/main/tarot/rider-waite/720px/Pents14.jpg",
}

MAJOR_SLUGS = (
    "the-fool", "the-magician", "the-high-priestess", "the-empress", "the-emperor",
    "the-hierophant", "the-lovers", "the-chariot", "strength", "the-hermit",
    "wheel-of-fortune", "justice", "the-hanged-man", "death", "temperance",
    "the-devil", "the-tower", "the-star", "the-moon", "the-sun",
    "judgement", "the-world",
)

SUIT_PREFIXES = {
    "wands": "wa",
    "cups": "cu",
    "swords": "sw",
    "pentacles": "pe",
}

RANK_NAMES = (
    ("ace", "ac"), ("two", "02"), ("three", "03"), ("four", "04"), ("five", "05"),
    ("six", "06"), ("seven", "07"), ("eight", "08"), ("nine", "09"), ("ten", "10"),
    ("page", "pa"), ("knight", "kn"), ("queen", "qu"), ("king", "ki"),
)


def is_valid_jpeg(path: str) -> bool:
    try:
        if os.path.getsize(path) <= 1000:
            return False
        with open(path, "rb") as fh:
            head = fh.read(2)
            fh.seek(-2, os.SEEK_END)
            tail = fh.read(2)
        return head == b"\xff\xd8" and tail == b"\xff\xd9"
    except OSError:
        return False


def build_manifest() -> list[tuple[str, str]]:
    downloads: list[tuple[str, str]] = [
        (f"ar{i:02d}.jpg", f"{slug}.jpg") for i, slug in enumerate(MAJOR_SLUGS)
    ]
    for suit, prefix in SUIT_PREFIXES.items():
        for rank_slug, code in RANK_NAMES:
            downloads.append((f"{prefix}{code}.jpg", f"{rank_slug}-of-{suit}.jpg"))
    return downloads


def fetch_card(item: tuple[str, str]) -> tuple[str, bool | str]:
    src_name, dest_name = item
    url = VERIFIED_CARD_URLS.get(dest_name, f"{BASE_URL}/{src_name}")
    if not url.startswith("https://"):
        return dest_name, f"Refusing non-HTTPS URL: {url}"
    dest_path = os.path.join(DEST_DIR, dest_name)
    if os.path.exists(dest_path) and is_valid_jpeg(dest_path):
        return dest_name, True

    tmp_path = f"{dest_path}.part.{os.getpid()}"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "tarot-visualizer-AssetFetcher/1.0"})
        with urllib.request.urlopen(req, timeout=TIMEOUT_SECONDS) as resp:
            data = resp.read()
        if len(data) <= 1000 or not (data.startswith(b"\xff\xd8") and data.endswith(b"\xff\xd9")):
            return dest_name, "Invalid or truncated JPEG payload"
        with open(tmp_path, "wb") as out:
            out.write(data)
        os.replace(tmp_path, dest_path)
        return dest_name, True
    except BaseException as exc:
        if os.path.exists(tmp_path):
            try:
                os.remove(tmp_path)
            except OSError:
                pass
        if isinstance(exc, (KeyboardInterrupt, SystemExit)):
            raise
        return dest_name, str(exc)


def main() -> int:
    os.makedirs(DEST_DIR, exist_ok=True)
    downloads = build_manifest()
    print(f"Verifying/downloading {len(downloads)} cards into {DEST_DIR}...")
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as executor:
        results = list(executor.map(fetch_card, downloads))

    failed = [res for res in results if res[1] is not True]
    if failed:
        print(f"Failed downloads ({len(failed)}): {failed}", file=sys.stderr)
        return 1

    print(f"Verified all {len(downloads)} cards.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
