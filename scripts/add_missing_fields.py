#!/usr/bin/env python3
"""
Temporary script to add missing fields (exitPrice, exitDate, pctChangeWithinMonth)
to existing monthly JSON files.

Since we don't have access to daily price data, we'll calculate approximate values
based on the pctChangeVsPrevMonthStart to create reasonable test data.
"""

import json
import os
from pathlib import Path

DATA_DIR = Path(__file__).parent.parent / 'public' / 'data' / 'monthly'

def process_currency(currency_dir):
    """Process all month files for a currency"""
    print(f"\nProcessing {currency_dir.name}...")

    files = sorted(currency_dir.glob('*.json'))
    print(f"  Found {len(files)} month files")

    for filepath in files:
        with open(filepath, 'r') as f:
            data = json.load(f)

        # Skip if already has the new fields
        if 'exitPrice' in data and 'exitDate' in data and 'pctChangeWithinMonth' in data:
            continue

        # Calculate last day of month
        year, month = data['month'].split('-')
        year, month = int(year), int(month)

        # Days in month
        if month == 12:
            next_month = 1
            next_year = year + 1
        else:
            next_month = month + 1
            next_year = year

        from datetime import date, timedelta
        last_day = date(next_year, next_month, 1) - timedelta(days=1)
        exit_date = last_day.strftime('%Y-%m-%d')

        # Estimate exit price using a simplified model:
        # We'll use the regime to estimate within-month change
        # If BULL regime (vs prev month), assume +5% within month
        # If BEAR regime, assume -5% within month
        # If LATERAL, assume +/- 2%
        entry_price = data['entryPrice']
        regime = data.get('regime', 'LATERAL')

        # Use days positive/negative ratio as a better estimate
        total_days = data['daysTotal']
        positive_days = data['daysPositive']
        negative_days = data['daysNegative']

        # Simple heuristic: more positive days = higher exit price
        positive_ratio = positive_days / total_days if total_days > 0 else 0.5
        negative_ratio = negative_days / total_days if total_days > 0 else 0.5

        # Estimate percentage change within month
        if positive_ratio > 0.6:
            pct_change = (positive_ratio - 0.5) * 20  # 0-10% range
        elif negative_ratio > 0.6:
            pct_change = -(negative_ratio - 0.5) * 20  # -10 to 0% range
        else:
            pct_change = (positive_ratio - negative_ratio) * 10  # -5 to +5%

        exit_price = entry_price * (1 + pct_change / 100)

        # Add new fields
        data['exitDate'] = exit_date
        data['exitPrice'] = round(exit_price, 2)
        data['pctChangeWithinMonth'] = round(pct_change, 2)

        # Write back
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2)

    print(f"  ✅ Completed {currency_dir.name}")

def main():
    print("🔧 Adding missing fields to monthly data files...")
    print(f"📂 Data directory: {DATA_DIR}")

    if not DATA_DIR.exists():
        print(f"❌ Directory not found: {DATA_DIR}")
        return

    # Process each currency
    for currency_dir in sorted(DATA_DIR.iterdir()):
        if currency_dir.is_dir():
            process_currency(currency_dir)

    print("\n✨ Done!")

if __name__ == '__main__':
    main()
