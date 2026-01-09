#!/usr/bin/env python3
"""
i18n Audit Script - Generates CSV report of translation status
"""

import json
import csv
from pathlib import Path
from typing import Dict, Set, List

# Supported languages
LANGUAGES = ['en', 'pt-BR', 'es', 'fr', 'de', 'it', 'nl', 'fi', 'pl', 'cs', 'tr', 'ja', 'ko', 'hi']

def flatten_keys(data: dict, parent_key: str = '') -> Set[str]:
    """Recursively flatten nested JSON structure into dot-notation keys"""
    keys = set()
    for key, value in data.items():
        new_key = f"{parent_key}.{key}" if parent_key else key
        if isinstance(value, dict):
            keys.update(flatten_keys(value, new_key))
        else:
            keys.add(new_key)
    return keys

def load_language_file(lang: str) -> Dict:
    """Load JSON file for a specific language"""
    file_path = Path(f'public/i18n/{lang}.json')
    if file_path.exists():
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}

def main():
    # Collect all keys from all languages
    all_keys: Set[str] = set()
    lang_data: Dict[str, Set[str]] = {}

    print("Loading language files...")
    for lang in LANGUAGES:
        data = load_language_file(lang)
        keys = flatten_keys(data)
        lang_data[lang] = keys
        all_keys.update(keys)
        print(f"  {lang}: {len(keys)} keys")

    # Sort keys alphabetically
    sorted_keys = sorted(all_keys)

    # Create CSV
    csv_path = 'i18n-translation-status.csv'
    print(f"\nGenerating CSV report: {csv_path}")

    with open(csv_path, 'w', newline='', encoding='utf-8') as csvfile:
        # Header: Key + all languages
        fieldnames = ['key'] + LANGUAGES
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()

        # Write each key with T/F status for each language
        for key in sorted_keys:
            row = {'key': key}
            for lang in LANGUAGES:
                row[lang] = 'T' if key in lang_data.get(lang, set()) else 'F'
            writer.writerow(row)

    # Generate statistics
    print(f"\nTotal unique keys: {len(sorted_keys)}")
    print("\nTranslation completeness:")
    for lang in LANGUAGES:
        count = len(lang_data.get(lang, set()))
        percentage = (count / len(sorted_keys) * 100) if sorted_keys else 0
        missing = len(sorted_keys) - count
        print(f"  {lang:8s}: {count:3d}/{len(sorted_keys)} ({percentage:5.1f}%) - Missing: {missing}")

    # Identify keys that are missing from most languages
    print("\n\nKeys missing from most languages (present in < 5 languages):")
    rare_keys = []
    for key in sorted_keys:
        present_count = sum(1 for lang in LANGUAGES if key in lang_data.get(lang, set()))
        if present_count < 5:
            rare_keys.append((key, present_count))

    for key, count in sorted(rare_keys, key=lambda x: x[1]):
        langs_present = [lang for lang in LANGUAGES if key in lang_data.get(lang, set())]
        print(f"  {key:50s} - {count:2d} languages: {', '.join(langs_present)}")

    print(f"\n✅ CSV report generated: {csv_path}")

if __name__ == '__main__':
    main()
