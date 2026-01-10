#!/usr/bin/env python3
"""
Complete i18n Audit - Finds ALL t() calls and compares with i18n files
"""

import json
import re
from pathlib import Path
from typing import Set, Dict

LANGUAGES = ['en', 'pt-BR', 'es', 'fr', 'de', 'it', 'nl', 'fi', 'pl', 'cs', 'tr', 'ja', 'ko', 'hi']

def extract_t_calls_from_file(file_path: Path) -> Set[str]:
    """Extract all t('key') calls from a TypeScript/TSX file"""
    keys = set()
    content = file_path.read_text(encoding='utf-8')

    # Pattern: t('key') or t("key")
    # Handles: t('key'), t("key"), t('key.nested'), t("key.nested")
    patterns = [
        r"t\(['\"]([^'\"]+)['\"]\)",  # t('key')
        r"t\(`([^`]+)`\)",             # t(`key`)
    ]

    for pattern in patterns:
        matches = re.findall(pattern, content)
        keys.update(matches)

    return keys

def extract_all_t_calls() -> Set[str]:
    """Extract all t() calls from all TypeScript/TSX files"""
    all_keys = set()
    src_dir = Path('src')

    for file_path in src_dir.rglob('*.tsx'):
        keys = extract_t_calls_from_file(file_path)
        all_keys.update(keys)

    for file_path in src_dir.rglob('*.ts'):
        if 'node_modules' not in str(file_path):
            keys = extract_t_calls_from_file(file_path)
            all_keys.update(keys)

    return all_keys

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
    print("=" * 80)
    print("COMPLETE i18n AUDIT - Finding ALL issues")
    print("=" * 80)

    # 1. Extract all t() calls from code
    print("\n[1/4] Extracting all t() calls from TypeScript/TSX files...")
    code_keys = extract_all_t_calls()
    print(f"   Found {len(code_keys)} unique keys used in code")

    # 2. Extract all keys from i18n files
    print("\n[2/4] Loading all i18n files...")
    lang_data: Dict[str, Set[str]] = {}
    for lang in LANGUAGES:
        data = load_language_file(lang)
        keys = flatten_keys(data)
        lang_data[lang] = keys

    en_keys = lang_data.get('en', set())
    print(f"   English file has {len(en_keys)} keys")

    # 3. Find keys used in code but missing from i18n files
    print("\n[3/4] Finding missing keys...")
    missing_from_i18n = code_keys - en_keys

    if missing_from_i18n:
        print(f"\n   🔴 CRITICAL: {len(missing_from_i18n)} keys used in code but MISSING from i18n files:")
        for key in sorted(missing_from_i18n):
            print(f"      - {key}")
    else:
        print("   ✅ All keys used in code exist in i18n files")

    # 4. Find keys in i18n but not used in code (potentially unused)
    print("\n[4/4] Finding potentially unused keys...")
    unused_keys = en_keys - code_keys

    if unused_keys:
        print(f"\n   ⚠️  WARNING: {len(unused_keys)} keys in i18n but not found in code:")
        print(f"   (May be used dynamically or be intentional)")
        for key in sorted(unused_keys):
            print(f"      - {key}")
    else:
        print("   ✅ All i18n keys are used in code")

    # 5. Check translation completeness for missing keys
    if missing_from_i18n:
        print("\n" + "=" * 80)
        print("KEYS TO ADD TO ALL 14 LANGUAGES:")
        print("=" * 80)
        for key in sorted(missing_from_i18n):
            print(f"\n  {key}:")
            print(f"    English: [TRANSLATION NEEDED]")

    # 6. Summary
    print("\n" + "=" * 80)
    print("SUMMARY")
    print("=" * 80)
    print(f"  Keys used in code:           {len(code_keys)}")
    print(f"  Keys in English i18n:        {len(en_keys)}")
    print(f"  Missing from i18n:           {len(missing_from_i18n)} {'🔴 CRITICAL' if missing_from_i18n else '✅'}")
    print(f"  Potentially unused:          {len(unused_keys)} {'⚠️' if unused_keys else '✅'}")

    if missing_from_i18n:
        print(f"\n  ❌ AUDIT FAILED - {len(missing_from_i18n)} keys need to be added to i18n files")
        return 1
    else:
        print("\n  ✅ AUDIT PASSED - All keys are properly internationalized")
        return 0

if __name__ == '__main__':
    exit(main())
