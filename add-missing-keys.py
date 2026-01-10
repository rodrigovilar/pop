#!/usr/bin/env python3
"""Add missing i18n keys to all language files"""

import json
from pathlib import Path

TRANSLATIONS = {
    'pt-BR': {
        'main_clickToFlip': 'Clique para ver detalhes →',
        'main_clickToFlipBack': '← Clique para voltar',
        'overview_entryPrice': 'Preço de Entrada',
        'overview_exitPrice': 'Preço de Saída',
        'overview_monthChange': 'Variação Mensal'
    },
    'es': {
        'main_clickToFlip': 'Haz clic para ver detalles →',
        'main_clickToFlipBack': '← Haz clic para volver',
        'overview_entryPrice': 'Precio de Entrada',
        'overview_exitPrice': 'Precio de Salida',
        'overview_monthChange': 'Cambio Mensual'
    },
    'fr': {
        'main_clickToFlip': 'Cliquez pour voir les détails →',
        'main_clickToFlipBack': '← Cliquez pour revenir',
        'overview_entryPrice': "Prix d'Entrée",
        'overview_exitPrice': 'Prix de Sortie',
        'overview_monthChange': 'Variation Mensuelle'
    },
    'de': {
        'main_clickToFlip': 'Klicken Sie für Details →',
        'main_clickToFlipBack': '← Klicken Sie zum Zurückdrehen',
        'overview_entryPrice': 'Einstiegspreis',
        'overview_exitPrice': 'Ausstiegspreis',
        'overview_monthChange': 'Monatliche Änderung'
    },
    'it': {
        'main_clickToFlip': 'Clicca per vedere i dettagli →',
        'main_clickToFlipBack': '← Clicca per tornare indietro',
        'overview_entryPrice': 'Prezzo di Entrata',
        'overview_exitPrice': 'Prezzo di Uscita',
        'overview_monthChange': 'Variazione Mensile'
    },
    'nl': {
        'main_clickToFlip': 'Klik voor details →',
        'main_clickToFlipBack': '← Klik om terug te draaien',
        'overview_entryPrice': 'Instapprijs',
        'overview_exitPrice': 'Uitstapprijs',
        'overview_monthChange': 'Maandelijkse Wijziging'
    },
    'fi': {
        'main_clickToFlip': 'Napsauta nähdäksesi tiedot →',
        'main_clickToFlipBack': '← Napsauta palataksesi',
        'overview_entryPrice': 'Sisääntulosiinta',
        'overview_exitPrice': 'Poistumishinta',
        'overview_monthChange': 'Kuukausimuutos'
    },
    'pl': {
        'main_clickToFlip': 'Kliknij, aby zobaczyć szczegóły →',
        'main_clickToFlipBack': '← Kliknij, aby wrócić',
        'overview_entryPrice': 'Cena Wejścia',
        'overview_exitPrice': 'Cena Wyjścia',
        'overview_monthChange': 'Zmiana Miesięczna'
    },
    'cs': {
        'main_clickToFlip': 'Klikněte pro zobrazení detailů →',
        'main_clickToFlipBack': '← Klikněte pro návrat',
        'overview_entryPrice': 'Vstupní Cena',
        'overview_exitPrice': 'Výstupní Cena',
        'overview_monthChange': 'Měsíční Změna'
    },
    'tr': {
        'main_clickToFlip': 'Detayları görmek için tıklayın →',
        'main_clickToFlipBack': '← Geri dönmek için tıklayın',
        'overview_entryPrice': 'Giriş Fiyatı',
        'overview_exitPrice': 'Çıkış Fiyatı',
        'overview_monthChange': 'Aylık Değişim'
    },
    'ja': {
        'main_clickToFlip': '詳細を見るにはクリック →',
        'main_clickToFlipBack': '← 戻るにはクリック',
        'overview_entryPrice': 'エントリー価格',
        'overview_exitPrice': 'エグジット価格',
        'overview_monthChange': '月次変動'
    },
    'ko': {
        'main_clickToFlip': '세부 정보를 보려면 클릭 →',
        'main_clickToFlipBack': '← 뒤집기를 되돌리려면 클릭',
        'overview_entryPrice': '진입 가격',
        'overview_exitPrice': '퇴출 가격',
        'overview_monthChange': '월간 변동'
    },
    'hi': {
        'main_clickToFlip': 'विवरण देखने के लिए क्लिक करें →',
        'main_clickToFlipBack': '← वापस जाने के लिए क्लिक करें',
        'overview_entryPrice': 'प्रवेश मूल्य',
        'overview_exitPrice': 'निकास मूल्य',
        'overview_monthChange': 'मासिक परिवर्तन'
    }
}

def add_keys_to_file(lang: str):
    """Add missing keys to a language file"""
    file_path = Path(f'public/i18n/{lang}.json')

    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Add to main section
    data['main']['clickToFlip'] = TRANSLATIONS[lang]['main_clickToFlip']
    data['main']['clickToFlipBack'] = TRANSLATIONS[lang]['main_clickToFlipBack']

    # Add to overview section
    data['overview']['entryPrice'] = TRANSLATIONS[lang]['overview_entryPrice']
    data['overview']['exitPrice'] = TRANSLATIONS[lang]['overview_exitPrice']
    data['overview']['monthChange'] = TRANSLATIONS[lang]['overview_monthChange']

    # Write back
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f'✅ Updated {lang}.json')

def main():
    for lang in TRANSLATIONS.keys():
        add_keys_to_file(lang)
    print('\n✅ All files updated successfully!')

if __name__ == '__main__':
    main()
