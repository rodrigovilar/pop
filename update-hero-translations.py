#!/usr/bin/env python3
import json
import os

# Translation mappings
translations = {
    'es': {
        'hero.subtitle': 'Al invertir en Bitcoin, necesitas Probar que tienes paciencia. De lo contrario, perderás dinero con decisiones apresuradas:',
        'footer.projectTitle': 'Prueba de Paciencia'
    },
    'fr': {
        'hero.subtitle': 'En investissant dans Bitcoin, vous devez Prouver que vous avez de la patience. Sinon, vous perdrez de l\'argent avec des décisions précipitées :',
        'footer.projectTitle': 'Preuve de Patience'
    },
    'de': {
        'hero.subtitle': 'Beim Investieren in Bitcoin müssen Sie Beweisen, dass Sie Geduld haben. Andernfalls verlieren Sie Geld durch übereilte Entscheidungen:',
        'footer.projectTitle': 'Beweis der Geduld'
    },
    'it': {
        'hero.subtitle': 'Investendo in Bitcoin, devi Dimostrare di avere pazienza. Altrimenti, perderai denaro con decisioni affrettate:',
        'footer.projectTitle': 'Prova di Pazienza'
    },
    'nl': {
        'hero.subtitle': 'Bij het investeren in Bitcoin moet je Bewijzen dat je geduld hebt. Anders verlies je geld door overhaaste beslissingen:',
        'footer.projectTitle': 'Bewijs van Geduld'
    },
    'fi': {
        'hero.subtitle': 'Bitcoiniin sijoittaessasi sinun on Todistettava, että sinulla on kärsivällisyyttä. Muuten menetät rahaa hätäisillä päätöksillä:',
        'footer.projectTitle': 'Kärsivällisyyden Todiste'
    },
    'pl': {
        'hero.subtitle': 'Inwestując w Bitcoin, musisz Udowodnić, że masz cierpliwość. W przeciwnym razie stracisz pieniądze na pochopnych decyzjach:',
        'footer.projectTitle': 'Dowód Cierpliwości'
    },
    'cs': {
        'hero.subtitle': 'Při investování do Bitcoinu musíte Prokázat, že máte trpělivost. Jinak přijdete o peníze kvůli unáhleným rozhodnutím:',
        'footer.projectTitle': 'Důkaz Trpělivosti'
    },
    'tr': {
        'hero.subtitle': 'Bitcoin\'e yatırım yaparken sabrınızı Kanıtlamanız gerekir. Aksi takdirde aceleci kararlarla para kaybedersiniz:',
        'footer.projectTitle': 'Sabır Kanıtı'
    },
    'ja': {
        'hero.subtitle': 'ビットコインに投資する際、忍耐力があることを証明する必要があります。そうしないと、性急な決断でお金を失います：',
        'footer.projectTitle': '忍耐の証明'
    },
    'ko': {
        'hero.subtitle': '비트코인에 투자할 때, 인내심이 있음을 증명해야 합니다. 그렇지 않으면 성급한 결정으로 돈을 잃게 됩니다:',
        'footer.projectTitle': '인내의 증명'
    },
    'hi': {
        'hero.subtitle': 'बिटकॉइन में निवेश करते समय, आपको धैर्य होने का प्रमाण देना होगा। अन्यथा, आप जल्दबाजी के फैसलों से पैसे खो देंगे:',
        'footer.projectTitle': 'धैर्य का प्रमाण'
    }
}

# Base path for i18n files
base_path = 'public/i18n'

# Update each language file
for lang_code, trans in translations.items():
    file_path = os.path.join(base_path, f'{lang_code}.json')

    try:
        # Read the file
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        # Update the keys
        if 'hero' in data:
            data['hero']['subtitle'] = trans['hero.subtitle']

        if 'footer' in data:
            data['footer']['projectTitle'] = trans['footer.projectTitle']

        # Write back
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

        print(f'✅ Updated {lang_code}.json')

    except Exception as e:
        print(f'❌ Error updating {lang_code}.json: {e}')

print('\n✅ All translations updated successfully!')
