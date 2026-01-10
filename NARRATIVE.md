# PoP - Project Narrative

## Overview

This document describes the educational narrative of PoP (Proof of Patience), structured to progressively demonstrate the psychological challenges and the importance of discipline when investing in Bitcoin.

**Narrative Flow:** Similar to https://antigravity.google/ - scroll-based storytelling with progressive reveals and animations.

**Language:** All UI narrative will be in English (with i18n support for 14 languages).

---

## Narrative Structure

### 1. The Problem: The Difficulty of Patience

**Objective:** Establish the core challenge of Bitcoin investing.

**Message:**
- Investing in Bitcoin is not about finding the perfect moment
- It's about having patience during:
  - **Bear markets** (price drops) - Resisting the despair to sell
  - **Bull markets** (price rises) - Resisting the euphoria to take profit too early
  - **Sideways markets** (stagnation) - Resisting boredom and the temptation to quit

**Implementation:**
- Hero section with manifesto
- Three problem cards:
  1. Panic Selling (selling in despair)
  2. Taking Small Profits (exiting too early)
  3. Timing the Market (trying to predict the perfect moment)

**Scroll Behavior:**
- Fade in on scroll
- Cards animate from bottom
- Parallax background

---

### 2. The Invitation: Let's Test This

**Objective:** Make the concept tangible through a specific reference month.

**Initial Setup:**
- **Reference month:** 4 years ago from current date
- **Currency:** Auto-detected (or USD fallback)
- **Language:** Auto-detected from browser
- **Editable:** User can change currency and language - Refer the header selectors in order to customize the reference month, currency and language.

**Month Calculation:**
```
Current date: 2026-01-09
Minus 4 years: 2022-01-09
Reference month: January 2022 (2022-01)
```

**Interface:**
```
┌─────────────────────────────────────────────────┐
│  Let's use a real example:                      │
│                                                  │
│  📅 January 2022                                │
│  💵 USD (change)                                │
│  🌐 English (change)                            │
│                                                  │
│  What if you had bought Bitcoin back then?     │
│                                                  │
│  [Explore this month →]                         │
└─────────────────────────────────────────────────┘
```

When selectors change, the component above should be updated to show the new reference month.

**Scroll Behavior:**
- Section pins during scroll
- Settings fade in sequentially
- CTA button pulses

---

### 3. Short-Term View: The Emotional Rollercoaster

**Objective:** Show how daily price watching creates anxiety and bad decisions.

**Scenario:**
> "You invested $1,000 in Bitcoin on January 1st, 2022.
> Now you check the price every single day of the month..."

**Data to Display:**

#### 3.1. Month Card (current modal format)
```
┌───────────────────────────────────────────┐
│  January 2022                             │
│                                            │
│  📊 Positive Days:     12 days (38.7%)   │
│  📉 Negative Days:     14 days (45.2%)   │
│  ➡️  Lateral Days:      5 days (16.1%)   │
│  📈 Total Days:        31 days           │
│                                            │
│  💰 Entry Price:       $47,738.00        │
│  💵 Exit Price:        $38,483.00        │
│  📉 Month Change:      -19.4%            │
│                                            │
│  🏷️  Regime: BEAR                         │
└───────────────────────────────────────────┘
```

#### 3.2. Emotional Interpretation
```
┌───────────────────────────────────────────┐
│  😨 What you would feel:                  │
│                                            │
│  • 14 negative days → DESPAIR             │
│    "Should I sell to avoid more losses?"  │
│                                            │
│  • Only 12 positive days → FRUSTRATION   │
│    "Not worth it, more red than green"    │
│                                            │
│  • Price dropped 19.4% → PANIC           │
│    "I lost 1/5 of my money!"              │
│                                            │
│  ⚠️  This short-term view leads to        │
│     emotional, bad decisions.             │
└───────────────────────────────────────────┘
```

Put the 3.1 and 3.2 cards side by side. The 3.1 should have the same interface from the months table, fliping the card in the same way.

**Message:**
- "Checking the price daily creates unnecessary anxiety"
- "More than half the days were negative or sideways"
- "The temptation is to quit or sell at a loss"
- "But what if you zoomed out?"

**Scroll Behavior:**
- Month card slides in from left
- Emotional cards fade in sequentially
- Red background pulse on negative emotions

When selectors change, the component above should be updated to show the data for the new reference month.

---

### 4. Zoom Out: Still Suffering Month by Month

**CRITICAL:** This is still SHORT-TERM thinking. The user is still checking every month, still suffering through each bear month or being tempted to sell after great gains. This is NOT the solution yet.

**Objective:** Show that even with a broader view, month-by-month thinking still affetcs the user patience and creates bad decisions.

**Transition:**
> "What if instead of focusing on one month,
> you looked at ALL months since January 2022?"

**Message:**
> "You might think: 'Ah, if I zoom out, I'll feel better!'
> But you won't. You'll just suffer for LONGER."

When selectors change, the components below should be updated to show the data for the new reference month.

#### 4.1. Visual: Stacked Area Chart with Regime Colors

**Chart Type:** Stacked area chart showing proportion of positive/negative/lateral days per month

**Data Structure:**
- **X-Axis:** Months from Jan/2022 to Today (48 months)
- **Y-Axis:** Percentage (0-100%)
- **Stacked Areas:**
  - 🟢 Green area = % of positive days in that month
  - 🔴 Red area = % of negative days in that month
  - ⚪ White/gray area = % of lateral days in that month

**Visual Example:**
```
100% ┌──────────────────────────────────────────┐
     │░░░░░░░                                   │ ← Lateral (white)
 80% │      ░░░░░░░░░░░░░░░                    │
     │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░   │ ← Negative (red)
 60% │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
     │████████████████████████████████████████  │ ← Positive (green)
 40% │████████████████████████████████████████  │
     │                                           │
  0% └───────────────────────────────────────────>
     Jan'22  Apr'22  Jul'22  Oct'22  Jan'23 ...

     ↑                      ↑
   Started here        Worst period
   (reference month)   (mostly red)
```

**Interactive Features:**
- **Click on any month column** → Opens modal with detailed month data (same as current modal)
- **Hover on month** → Tooltip shows:
  - Month name
  - Regime (BULL/BEAR/LATERAL)
  - % change
  - Price range

**Toggle View:**
```
┌────────────────────────────────────────┐
│  [📊 Chart View]  [📋 Table View]     │  ← Toggle buttons
└────────────────────────────────────────┘
```

**Chart Annotations:**
- "You started here" (arrow pointing to Jan/2022)
- "Worst moment: -66%" (arrow pointing to Nov/2022)
- "Today: +116%" (arrow at current month)
- "16 months in the red" (highlight bear period)

**Message:**
```
┌─────────────────────────────────────────────┐
│  Look at all this RED.                      │
│                                              │
│  • January 2022: Bad (-19.4%)              │
│  • It got WORSE (dropped to -66%)          │
│  • You stayed underwater for 16 MONTHS     │
│                                              │
│  Even with "zoom out", you're SUFFERING    │
│  every single month.                        │
│                                              │
│  • June 2022: "Should I sell?" 😰          │
│  • September 2022: "This is painful" 😫    │
│  • November 2022: "I lost 66%!" 😱         │
│                                              │
│  ⚠️  Checking month by month = TORTURE     │
└─────────────────────────────────────────────┘
```

#### 4.2. Alternative View: Month Grid/Table (Toggle)

**Layout:** Same as current `MonthGrid` component, but with toggle

```
┌─────────────────────────────────────────────────┐
│  All 48 months since your investment:           │
│  [📊 Chart View]  [📋 Table View] ←             │
└─────────────────────────────────────────────────┘

[Jan 2022]  [Feb 2022]  [Mar 2022]  [Apr 2022]
  -19.4%      +3.2%      +5.1%       -8.7%
   BEAR      LATERAL    LATERAL       BEAR
   (click)    (click)    (click)     (click)

[May 2022]  [Jun 2022]  [Jul 2022]  [Aug 2022]
  -15.3%      -37.9%     +16.8%      -13.6%
   BEAR        BEAR     LATERAL       BEAR

... (continues to today)

[Oct 2025]  [Nov 2025]  [Dec 2025]  [Jan 2026]
  +12.4%      +18.7%     +5.3%       +7.8%
   BULL        BULL     LATERAL       BULL
```

**Interactive:**
- Click any card → Opens modal (same as current implementation)
- Color by regime (green=BULL, red=BEAR, gray=LATERAL)
- Visual indication of drawdown period (16 months underwater)

**Aggregated Stats (shown after table):**
```
┌───────────────────────────────────────────┐
│  📊 48 Month Summary:                     │
│                                            │
│  • Positive Months:    28 (58.3%)        │
│  • Negative Months:    16 (33.3%)        │
│  • Lateral Months:      4 (8.3%)         │
│                                            │
│  • Time in profit:     32 months (66.7%) │
│  • Time at loss:       16 months (33.3%) │
│                                            │
│  • Best month:         +45.2% (Mar '25)  │
│  • Worst month:        -37.9% (Jun '22)  │
│                                            │
│  💰 Final Result:      +116% (2.16x)      │
│                                            │
│  ⚠️  But you SUFFERED through 33% of     │
│     the time. That's 16 months of pain.  │
└───────────────────────────────────────────┘
```

**Scroll Behavior:**
- Chart/Table section pins
- Stats cards fade in as user scrolls
- Red highlight animates on "16 months of pain"

---

### 5. The False Revelation: Patience ≠ Solution

**Critical Transition:** The user realizes that "zooming out" didn't solve the emotional problem.

**Message:**
```
┌─────────────────────────────────────────────────┐
│  🎯 What we learned so far:                     │
│                                                  │
│  ✅ YES, long-term you made money (+116%)      │
│  ✅ YES, patience eventually paid off           │
│                                                  │
│  BUT...                                         │
│                                                  │
│  ❌ You still CHECKED every month               │
│  ❌ You SUFFERED for 16 months straight         │
│  ❌ You felt PANIC in June 2022 (-37.9%)       │
│  ❌ You felt DESPAIR in November 2022 (-66%)   │
│                                                  │
│  The problem isn't TIMING.                      │
│  The problem is CHECKING.                       │
│                                                  │
│  You bought everything at once (lump sum)      │
│  and then tortured yourself month by month.    │
└─────────────────────────────────────────────────┘
```

**The Shift:**
```
┌─────────────────────────────────────────────────┐
│                                                  │
│  What if the solution isn't:                   │
│  ❌ "Find the perfect entry"                    │
│  ❌ "Zoom out and check monthly"                │
│                                                  │
│  What if the solution is:                       │
│  ✅ STOP trying to time anything                │
│  ✅ AUTOMATE your investment                    │
│  ✅ BUY a little every month, no matter what   │
│                                                  │
│  This changes EVERYTHING.                       │
│  This is called DCA.                            │
│                                                  │
│  [Discover DCA Strategy →]                     │
│                                                  │
└─────────────────────────────────────────────────┘
```

**Scroll Behavior:**
- Section darkens (mood shift)
- Text fades in slowly
- CTA button glows green (hope)

---

### 6. Introdução ao DCA (Dollar Cost Averaging)

**Objetivo:** Apresentar uma estratégia que remove a ansiedade de "escolher o momento certo".

**O que é DCA:**
```
┌─────────────────────────────────────────────────┐
│  📖 DCA - Dollar Cost Averaging                 │
│     (Média de Custo em Dólar)                   │
│                                                  │
│  Ao invés de:                                   │
│  ❌ Investir tudo de uma vez                    │
│  ❌ Tentar prever o melhor momento              │
│  ❌ Comprar na "baixa" e vender na "alta"       │
│                                                  │
│  Você faz:                                      │
│  ✅ Investe um valor FIXO todo mês              │
│  ✅ Compra independente do preço                │
│  ✅ Automatiza e esquece                        │
│                                                  │
│  Por que funciona:                              │
│  • Remove emoção da decisão                     │
│  • Você compra mais quando está barato          │
│  • Você compra menos quando está caro           │
│  • Seu preço médio se equilibra ao longo do     │
│    tempo                                        │
└─────────────────────────────────────────────────┘
```

When selectors change, the components below should be updated to show the data for the new reference month.

**Exemplo Visual:**
```
Estratégia 1 (Lump Sum):
  ┌──────┐
  │$1000 │ ← Tudo de uma vez (Jan/2022 = $47,738)
  └──────┘

Estratégia 2 (DCA):
  ┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐
  │$││$││$││$││$││$││$││$││$││$││$││$│...
  └─┘└─┘└─┘└─┘└─┘└─┘└─┘└─┘└─┘└─┘└─┘└─┘
  Jan Fev Mar Abr Mai Jun Jul Ago Set Out Nov Dez
  $47k $43k $45k $46k $38k $29k $23k $24k $20k $19k $20k $17k
   ↑   ↑    ↑    ↑    ↑    ↑    ↑    ↑    ↑    ↑    ↑    ↑
  Caro Caro Médio Médio Médio Barato MUITO BARATO...

  Resultado: Seu preço médio = ~$30k (muito melhor que $47k)
```

---

### 7. Simulador DCA - Configuração


When selectors change, the components below should be updated to show the data for the new reference month.

**Interface de Input:**
```
┌─────────────────────────────────────────────────┐
│  💰 Configure sua simulação DCA                 │
│                                                  │
│  Quanto você investiria TODO MÊS?              │
│  ┌──────────────────────────────────┐          │
│  │  $ 100         ▼ USD              │          │
│  └──────────────────────────────────┘          │
│                                                  │
│  A partir de quando?                            │
│  ┌──────────────────────────────────┐          │
│  │  📅 Janeiro de 2022               │          │
│  └──────────────────────────────────┘          │
│  (4 anos atrás - mínimo recomendado)           │
│                                                  │
│  [Simular →]                                    │
└─────────────────────────────────────────────────┘
```

**Valores Sugeridos:**
- $50, $100, $200, $500, $1000/mês
- Ou input customizado

**Validação:**
- Mínimo: 3 anos (36 meses)
- Ideal: 4+ anos (48+ meses)
- Máximo: desde 2010 (quando Bitcoin começou a ter preço)

---

### 8. Resultados Gerais do DCA

**Objetivo:** Mostrar os números principais de forma clara e impactante.

**Card de Resultados:**
```
┌───────────────────────────────────────────────────────┐
│  📊 Seus Resultados - DCA de $100/mês (48 meses)     │
│                                                        │
│  ┌─────────────────────────────────────────────────┐ │
│  │  💵 Total Investido                              │ │
│  │     $4,800.00                                    │ │
│  │     (48 meses × $100)                            │ │
│  └─────────────────────────────────────────────────┘ │
│                                                        │
│  ┌─────────────────────────────────────────────────┐ │
│  │  ₿ Total de Bitcoin                              │ │
│  │     0.15234 BTC                                  │ │
│  │     (acumulado mês a mês)                        │ │
│  └─────────────────────────────────────────────────┘ │
│                                                        │
│  ┌─────────────────────────────────────────────────┐ │
│  │  💰 Valor Atual                                  │ │
│  │     $15,691.02                                   │ │
│  │     (0.15234 BTC × $103,000)                    │ │
│  └─────────────────────────────────────────────────┘ │
│                                                        │
│  ┌─────────────────────────────────────────────────┐ │
│  │  📈 Lucro / Prejuízo (P&L)                       │ │
│  │     +$10,891.02   (+226.9%)                     │ │
│  │     ✅ Seu investimento mais que TRIPLICOU      │ │
│  └─────────────────────────────────────────────────┘ │
│                                                        │
│  ┌─────────────────────────────────────────────────┐ │
│  │  ⏱️ Tempo em Drawdown                            │ │
│  │     387 dias (~13 meses)                        │ │
│  │     27% do tempo você esteve no prejuízo        │ │
│  └─────────────────────────────────────────────────┘ │
│                                                        │
│  ┌─────────────────────────────────────────────────┐ │
│  │  📉 Maior Sequência Negativa                     │ │
│  │     203 dias consecutivos                        │ │
│  │     (Jun/2022 - Dez/2022)                       │ │
│  │     Durante o "inverno cripto" - mas você       │ │
│  │     continuou comprando barato!                 │ │
│  └─────────────────────────────────────────────────┘ │
│                                                        │
└───────────────────────────────────────────────────────┘
```

**Insights Visuais:**
```
┌───────────────────────────────────────────┐
│  💡 Perceba o que aconteceu:              │
│                                            │
│  • Você passou 13 MESES no prejuízo       │
│    → Mas não vendeu, continuou comprando │
│                                            │
│  • 73% do tempo você ESTEVE em lucro      │
│    → A paciência compensa                 │
│                                            │
│  • Maior sequência negativa: 203 dias     │
│    → Esses foram os meses que você        │
│       comprou Bitcoin MUITO barato        │
│                                            │
│  🎯 Esta estratégia é mais TRANQUILA      │
│     porque você não tenta acertar o       │
│     momento - você apenas PERSISTE.       │
└───────────────────────────────────────────┘
```

---

### 9. Detalhamento Mensal do DCA

**Objetivo:** Mostrar CADA MÊS de investimento e como o patrimônio evoluiu.

**Tabela Detalhada:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  📅 Detalhamento Mês a Mês                                                  │
│  (role para ver todos os 48 meses)                                          │
└─────────────────────────────────────────────────────────────────────────────┘

┌────────┬──────────┬──────────┬──────────┬──────────┬──────────┬──────────┐
│  Mês   │ Investiu │  Preço   │ BTC      │ Total    │  Valor   │  P&L     │
│        │          │   BTC    │ Comprado │  BTC     │  Atual   │    (%)   │
├────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│ Jan/22 │  $100    │ $47,738  │ 0.00209  │ 0.00209  │   $100   │    0%    │
│ Fev/22 │  $100    │ $43,193  │ 0.00231  │ 0.00440  │   $190   │   -5%    │
│ Mar/22 │  $100    │ $45,538  │ 0.00219  │ 0.00659  │   $300   │    0%    │
│ Abr/22 │  $100    │ $46,281  │ 0.00216  │ 0.00875  │   $405   │   +1%    │
│ Mai/22 │  $100    │ $38,507  │ 0.00259  │ 0.01134  │   $437   │  -13%    │
│ Jun/22 │  $100    │ $29,890  │ 0.00334  │ 0.01468  │   $439   │  -27%  ⬇ │
│ Jul/22 │  $100    │ $23,315  │ 0.00428  │ 0.01896  │   $442   │  -37%  ⬇ │
│ Ago/22 │  $100    │ $23,733  │ 0.00421  │ 0.02317  │   $550   │  -31%  ⬇ │
│ Set/22 │  $100    │ $20,146  │ 0.00496  │ 0.02813  │   $567   │  -37%  ⬇ │
│ Out/22 │  $100    │ $19,425  │ 0.00514  │ 0.03327  │   $646   │  -35%  ⬇ │
│ Nov/22 │  $100    │ $20,481  │ 0.00488  │ 0.03815  │   $781   │  -29%  ⬇ │
│ Dez/22 │  $100    │ $16,547  │ 0.00604  │ 0.04419  │   $731   │  -39%  ⬇ │
│        │          │          │          │          │          │          │
│ Jan/23 │  $100    │ $23,138  │ 0.00432  │ 0.04851  │  $1,122  │  -13%  ⬇ │
│ Fev/23 │  $100    │ $23,141  │ 0.00432  │ 0.05283  │  $1,222  │  -13%  ⬇ │
│ Mar/23 │  $100    │ $28,469  │ 0.00351  │ 0.05634  │  $1,604  │   +7%  ⬆ │
│ Abr/23 │  $100    │ $29,223  │ 0.00342  │ 0.05976  │  $1,746  │  +10%  ⬆ │
│ ...    │  ...     │  ...     │  ...     │  ...     │   ...    │   ...    │
│        │          │          │          │          │          │          │
│ Dez/25 │  $100    │ $95,371  │ 0.00104  │ 0.14830  │ $14,142  │ +191%  ⬆ │
│ Jan/26 │  $100    │ $103,000 │ 0.00097  │ 0.15234  │ $15,691  │ +227%  ⬆ │
└────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┘

TOTAL:    $4,800                          0.15234   $15,691   +226.9%
```

**Legenda:**
- ⬇ = Você estava em prejuízo neste mês (mas comprou barato!)
- ⬆ = Você estava em lucro neste mês

**Features da Tabela:**
- Scroll infinito ou carregamento progressivo
- Sticky header (cabeçalho fixo ao rolar)
- Destaque visual dos meses em drawdown (fundo vermelho claro)
- Destaque visual dos meses em lucro (fundo verde claro)
- Hover mostra detalhes adicionais (regime do mês, dias +/-)

---

### 10. O Fundamento: Ganho Médio Mensal

**Objetivo:** Evidenciar a métrica mais importante - o ganho médio mensal ponderado.

**Cálculo do Ganho Médio Mensal:**
```
Para cada investimento mensal:
GanhoMensal_i = (Math.pow(ValorAtual_i / ValorInvestido_i, 1 / MesesDecorridos_i) - 1) × 100

Ganho Médio Mensal Ponderado = Σ(GanhoMensal_i × MesesDecorridos_i) / Σ(MesesDecorridos_i)

Onde:
- GanhoMensal_i = taxa de crescimento composto mensal (CAGR mensal)
- MesesDecorridos_i = quantos meses se passaram desde aquele investimento
- Esta é uma média ponderada pelo tempo

Exemplo:
Mês 1: investiu $100, vale $300 após 48 meses
  GanhoMensal = (Math.pow(300/100, 1/48) - 1) × 100 = 2.34% ao mês
  Peso = 48

Mês 48: investiu $100, vale $110 após 1 mês
  GanhoMensal = (Math.pow(110/100, 1/1) - 1) × 100 = 10% ao mês
  Peso = 1

Ganho Médio Ponderado = (2.34×48 + ... + 10×1) / (48 + ... + 1)
```

**Card de Destaque:**
```
┌───────────────────────────────────────────────────────┐
│  🎯 O NÚMERO QUE IMPORTA                              │
│                                                        │
│  ┌─────────────────────────────────────────────────┐ │
│  │                                                  │ │
│  │           📊 Ganho Médio Mensal                  │ │
│  │                                                  │ │
│  │                  +4.73%                          │ │
│  │                                                  │ │
│  │         (ponderado pelo tempo investido)        │ │
│  │                                                  │ │
│  └─────────────────────────────────────────────────┘ │
│                                                        │
│  Este é o fundamento da sua estratégia DCA.          │
│                                                        │
│  • NÃO é o ganho de um mês específico                │
│  • NÃO é o preço de um dia específico                │
│  • É a média REAL do seu investimento ao             │
│    longo de 48 meses                                 │
│                                                        │
│  💡 Este número:                                      │
│     ✅ Remove a ansiedade diária                     │
│     ✅ Mostra o progresso real                       │
│     ✅ É previsível em períodos longos               │
│     ✅ Recompensa consistência, não timing           │
│                                                        │
│  ⚠️  ATENÇÃO: Este é um resultado PASSADO.           │
│     Não é garantia de retornos futuros.              │
│     Bitcoin é volátil e você pode perder dinheiro.   │
│                                                        │
└───────────────────────────────────────────────────────┘
```

**Comparação Visual:**
```
┌────────────────────────────────────────────┐
│  Estratégia 1: Lump Sum (Janeiro/2022)    │
│  Investiu: $4,800 de uma vez              │
│  Resultado: +116% ($10,368)               │
│  Ganho médio: +2.42%/mês                  │
│                                            │
│  VS                                        │
│                                            │
│  Estratégia 2: DCA ($100/mês)             │
│  Investiu: $4,800 ao longo de 48 meses   │
│  Resultado: +227% ($10,891)               │
│  Ganho médio: +4.73%/mês                  │
│                                            │
│  🏆 DCA teve resultado MELHOR porque:     │
│     • Comprou mais barato na média        │
│     • Reduziu impacto de volatilidade     │
│     • Mais tranquilo psicologicamente     │
└────────────────────────────────────────────┘
```

**Mensagem Final:**
```
┌─────────────────────────────────────────────────┐
│  🎓 O que você aprendeu:                        │
│                                                  │
│  1️⃣  Timing perfeito é impossível               │
│     → DCA remove essa pressão                   │
│                                                  │
│  2️⃣  Volatilidade é sua aliada no DCA           │
│     → Baixas = você compra mais barato          │
│                                                  │
│  3️⃣  O ganho médio mensal é o fundamento        │
│     → Não o ganho de um dia ou mês              │
│                                                  │
│  4️⃣  Paciência + Consistência > Inteligência    │
│     → 4 anos de disciplina valem mais que       │
│       tentar adivinhar o momento certo          │
│                                                  │
│  ✅ Bitcoin não recompensa quem tenta prever.   │
│     Bitcoin recompensa quem PERSISTE.           │
└─────────────────────────────────────────────────┘
```

---

### 11. Rodapé - Sobre o Projeto

**Objetivo:** Dar créditos, permitir doações e reforçar o propósito educacional.

**Layout do Footer (já existe, manter estrutura atual):**
```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│  ⚡ Proof of Patience                                       │
│                                                              │
│  Uma ferramenta educacional para demonstrar que investir    │
│  em Bitcoin requer sacrifício, disciplina e baixa           │
│  preferência temporal.                                      │
│                                                              │
│  [⭐ Star no GitHub]                                        │
│                                                              │
│  ───────────────────────────────────────────────────────    │
│                                                              │
│  👤 Criado por Rodrigo Vilar                                │
│                                                              │
│  Desenvolvedor dedicado a criar ferramentas educacionais    │
│  para a comunidade Bitcoin.                                 │
│                                                              │
│  [💼 LinkedIn] [🐦 Twitter @vilar]                         │
│                                                              │
│  ───────────────────────────────────────────────────────    │
│                                                              │
│  ⚡ Apoiar o Projeto                                        │
│                                                              │
│  Doe para me ajudar a dedicar mais tempo criando            │
│  ferramentas para a comunidade Bitcoin.                     │
│                                                              │
│  Lightning Network                                          │
│  ┌──────────────────────────────────────────────┐          │
│  │  [QR Code]                                   │          │
│  │  lnbc...                                     │          │
│  └──────────────────────────────────────────────┘          │
│                                                              │
│  Bitcoin On-Chain                                           │
│  ┌──────────────────────────────────────────────┐          │
│  │  [QR Code]                                   │          │
│  │  bc1q...                                     │          │
│  └──────────────────────────────────────────────┘          │
│                                                              │
│  ───────────────────────────────────────────────────────    │
│                                                              │
│  ⚠️  PoP é uma ferramenta educacional.                     │
│     Não é aconselhamento financeiro.                       │
│                                                              │
│  📖 "Bitcoin ensina comportamento, não lucro."              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Elementos do Footer:**
- ✅ Já implementado em `App.tsx`
- ✅ Totalmente internacionalizado (14 idiomas)
- ✅ Links para GitHub, LinkedIn, Twitter
- ✅ Endereços de doação (Lightning + On-chain)
- ✅ Disclaimer educacional

---

## Fluxo de Navegação Completo (Atualizado)

```
1. Hero + Manifesto
   ↓
2. "O Problema" (3 cards de comportamentos ruins)
   ↓
3. "Vamos Experimentar" (escolha de mês 4 anos atrás/moeda/idioma)
   ↓
4. "Visão de Curto Prazo" (dados do mês único, interpretação emocional)
   ↓
5. "E se olharmos mais longe?" (transição para zoom out)
   ↓
6. Gráfico de 48 meses (price chart com anotações do mês base destacado)
   ↓
7. Grid de Cards Mensais (visão dos 48 meses desde o mês base)
   ↓
8. Estatísticas Agregadas (resumo dos 48 meses)
   ↓
9. "Primeira Revelação" (Paciência > Timing, mas ainda tem problema)
   ↓
10. "Introdução ao DCA" (explicação da estratégia)
    ↓
11. "Configuração DCA" (escolha de valor mensal, mesma data base)
    ↓
12. "Resultados Gerais DCA" (total investido, BTC, valor atual, P&L, drawdown)
    ↓
13. "Insights DCA" (interpretação dos resultados)
    ↓
14. "Detalhamento Mensal DCA" (tabela completa mês a mês)
    ↓
15. "O Fundamento" (ganho médio mensal ponderado - DESTAQUE)
    ↓
16. "Comparação Lump Sum vs DCA" (mostrar qual foi melhor)
    ↓
17. "Mensagem Final" (paciência + consistência > inteligência)
    ↓
18. Footer (sobre projeto, autor, doações, disclaimer)
```

---

## Dados Necessários

### Para o Mês de Referência (4 anos atrás):
- ✅ Já temos: `monthly/USD/2022-01.json`
  - `entryPrice`: preço do primeiro dia
  - `daysPositive`, `daysNegative`, `daysTotal`
  - `pctChangeVsPrevMonthStart`: variação do mês
  - `regime`: BULL/BEAR/LATERAL

### Para o Gráfico de 48 meses:
- ✅ Já temos: todos os arquivos `monthly/USD/YYYY-MM.json` desde 2022-01
- Precisamos agregá-los para montar o gráfico

### Para o Grid de Cards:
- ✅ Já temos: componente `MonthGrid` atual
- Ajustar para mostrar desde o mês de referência até hoje

---

## Notas de Implementação

### Componentes Novos Necessários:

1. **MoodInterpretation.tsx**
   - Mostra interpretação emocional do mês
   - Props: `daysPositive`, `daysNegative`, `monthChange`, `regime`

2. **PriceChart.tsx**
   - Gráfico de linha de preços de longo prazo
   - Props: `monthlyData[]`, `highlightMonth`, `referenceMonth`
   - Features: anotações, zoom, tooltips

3. **AggregatedStats.tsx**
   - Estatísticas agregadas de N meses (lump sum)
   - Props: `monthlyData[]`, `referenceMonth`, `startDate`

4. **DCAExplainer.tsx**
   - Explica o conceito de DCA visualmente
   - Props: `monthlyData[]` (para mostrar exemplo com preços reais)

5. **DCAConfigurator.tsx**
   - Interface para configurar simulação DCA
   - Props: `onSimulate(amount, startDate, currency)`
   - State: valor mensal, data inicial, moeda

6. **DCAResults.tsx**
   - Exibe resultados gerais do DCA
   - Props: `totalInvested`, `totalBTC`, `currentValue`, `pnl`, `daysInDrawdown`, `longestStreak`

7. **DCAInsights.tsx**
   - Insights interpretativos dos resultados DCA
   - Props: `daysInDrawdown`, `longestStreak`, `pnlPercent`

8. **DCADetailTable.tsx**
   - Tabela detalhada mês a mês do DCA
   - Props: `monthlyDCAData[]`
   - Features: sticky header, scroll, destaque visual de drawdown/lucro

9. **AverageGainHighlight.tsx**
   - Card de destaque do ganho médio mensal
   - Props: `avgMonthlyGain`, `totalMonths`, `totalReturn`

10. **ComparisonCard.tsx**
    - Compara Lump Sum vs DCA
    - Props: `lumpSumResult`, `dcaResult`

11. **NarrativeFlow.tsx**
    - Orquestra toda a sequência narrativa
    - Controla scroll progressivo
    - Anima transições entre seções
    - Gerencia estado global da narrativa

### Bibliotecas Recomendadas:

- **Chart.js** ou **Recharts** para o gráfico de linha
- **Framer Motion** para animações de transição
- **React Intersection Observer** para detectar scroll e revelar seções

---

## Princípios Pedagógicos

1. **Progressão Lenta:**
   - Não revelar tudo de uma vez
   - Construir tensão emocional antes da revelação

2. **Dados Reais:**
   - Usar dados históricos reais
   - Não inventar cenários otimistas

3. **Empatia Emocional:**
   - Nomear explicitamente as emoções (desespero, euforia, tédio)
   - Validar que essas reações são normais

4. **Contraste Visual:**
   - Curto prazo = ansiedade (cores vermelhas, dados alarmantes)
   - Longo prazo = calma (cores suaves, tendência ascendente)

5. **Sem Promessas:**
   - Nunca dizer "você vai ganhar dinheiro"
   - Sempre enfatizar: "isso é educação, não recomendação"

---

## Internacionalização (i18n)

Todas as mensagens narrativas devem estar em `public/i18n/{lang}.json`:

```json
{
  "narrative": {
    "problem": {
      "title": "A Dificuldade da Paciência",
      "subtitle": "Investir em Bitcoin é um desafio psicológico",
      "panicSelling": "Vender no Desespero",
      "smallProfits": "Realizar Lucro Cedo",
      "marketTiming": "Tentar Acertar o Momento"
    },
    "experiment": {
      "title": "Vamos Experimentar",
      "subtitle": "Vamos usar um mês real como referência",
      "referenceMonth": "{month} de {year}",
      "yearsAgo": "({years} anos atrás)",
      "currency": "Moeda",
      "language": "Idioma",
      "changeSettings": "mudar",
      "explore": "Explorar este mês"
    },
    "shortTerm": {
      "title": "Visão de Curto Prazo: A Montanha-Russa",
      "subtitle": "Acompanhar o preço diariamente gera ansiedade",
      "scenario": "Você investiu {amount} em Bitcoin no dia 1 de {month} de {year}.",
      "scenarioSubtitle": "Agora você acompanha o preço todos os dias do mês...",
      "monthData": "Dados do Mês",
      "mood": {
        "title": "O que você sentiria:",
        "despair": "DESESPERO",
        "despairText": "Será que devo vender para evitar mais perdas?",
        "frustration": "FRUSTRAÇÃO",
        "frustrationText": "Não vale a pena, mais dias negativos",
        "panic": "PÂNICO",
        "panicText": "Perdi {percent}% do meu dinheiro!",
        "conclusion": "Esta visão de curto prazo leva a decisões emocionais ruins."
      },
      "message": "Olhar o preço diariamente cria ansiedade desnecessária",
      "question": "Mas e se você tivesse uma visão mais ampla?"
    },
    "longTerm": {
      "title": "E se olharmos mais longe?",
      "subtitle": "A mesma história, de outra perspectiva",
      "transition": "E se ao invés de focar neste mês, você olhasse para TODOS os meses desde {month} de {year}?",
      "chartTitle": "Evolução do Preço do Bitcoin",
      "chartAnnotations": {
        "youInvested": "Você investiu aqui",
        "worstMoment": "Pior momento: {percent}%",
        "today": "Hoje: +{percent}%"
      },
      "gridTitle": "Todos os {months} meses desde seu investimento",
      "statsTitle": "Resumo de {months} meses"
    },
    "revelation": {
      "title": "O que aprendemos até agora",
      "point1": "{month} teve {days} dias negativos",
      "point1Result": "Mas isso não importa hoje",
      "point2": "Você ficou {months} meses em prejuízo",
      "point2Result": "Mas quem manteve ganhou {percent}%",
      "point3": "{percent}% dos meses foram negativos",
      "point3Result": "Mas {percent}% do tempo você teve lucro",
      "problem": "MAS... essa estratégia ainda tem um problema:",
      "problemText": "Você tentou acertar o momento perfeito (comprou TUDO em {month}/{year})",
      "solution": "E se ao invés disso, você comprasse um pouco TODO MÊS, independente do preço?",
      "cta": "Explorar a estratégia DCA"
    },
    "dca": {
      "intro": {
        "title": "DCA - Dollar Cost Averaging",
        "subtitle": "(Média de Custo em Dólar)",
        "whatNotToDo": "Ao invés de:",
        "wrong1": "Investir tudo de uma vez",
        "wrong2": "Tentar prever o melhor momento",
        "wrong3": "Comprar na 'baixa' e vender na 'alta'",
        "whatToDo": "Você faz:",
        "right1": "Investe um valor FIXO todo mês",
        "right2": "Compra independente do preço",
        "right3": "Automatiza e esquece",
        "whyItWorks": "Por que funciona:",
        "reason1": "Remove emoção da decisão",
        "reason2": "Você compra mais quando está barato",
        "reason3": "Você compra menos quando está caro",
        "reason4": "Seu preço médio se equilibra ao longo do tempo"
      },
      "configurator": {
        "title": "Configure sua simulação DCA",
        "monthlyAmount": "Quanto você investiria TODO MÊS?",
        "startDate": "A partir de quando?",
        "minPeriod": "({years} anos atrás - mínimo recomendado)",
        "simulate": "Simular"
      },
      "results": {
        "title": "Seus Resultados - DCA de {amount}/mês ({months} meses)",
        "totalInvested": "Total Investido",
        "totalInvestedCalc": "({months} meses × {amount})",
        "totalBTC": "Total de Bitcoin",
        "totalBTCCalc": "(acumulado mês a mês)",
        "currentValue": "Valor Atual",
        "currentValueCalc": "({btc} BTC × {price})",
        "pnl": "Lucro / Prejuízo (P&L)",
        "pnlSuccess": "Seu investimento mais que TRIPLICOU",
        "daysInDrawdown": "Tempo em Drawdown",
        "daysInDrawdownText": "{percent}% do tempo você esteve no prejuízo",
        "longestStreak": "Maior Sequência Negativa",
        "longestStreakText": "{days} dias consecutivos",
        "longestStreakPeriod": "({startMonth} - {endMonth})",
        "longestStreakNote": "Durante o 'inverno cripto' - mas você continuou comprando barato!"
      },
      "insights": {
        "title": "Perceba o que aconteceu:",
        "point1": "Você passou {months} MESES no prejuízo",
        "point1Result": "Mas não vendeu, continuou comprando",
        "point2": "{percent}% do tempo você ESTEVE em lucro",
        "point2Result": "A paciência compensa",
        "point3": "Maior sequência negativa: {days} dias",
        "point3Result": "Esses foram os meses que você comprou Bitcoin MUITO barato",
        "conclusion": "Esta estratégia é mais TRANQUILA porque você não tenta acertar o momento - você apenas PERSISTE."
      },
      "details": {
        "title": "Detalhamento Mês a Mês",
        "subtitle": "(role para ver todos os {months} meses)",
        "headers": {
          "month": "Mês",
          "invested": "Investiu",
          "price": "Preço BTC",
          "btcBought": "BTC Comprado",
          "totalBTC": "Total BTC",
          "currentValue": "Valor Atual",
          "pnl": "P&L (%)"
        },
        "legend": {
          "down": "Você estava em prejuízo neste mês (mas comprou barato!)",
          "up": "Você estava em lucro neste mês"
        },
        "total": "TOTAL"
      },
      "averageGain": {
        "title": "O NÚMERO QUE IMPORTA",
        "subtitle": "Ganho Médio Mensal",
        "weighted": "(ponderado pelo tempo investido)",
        "explanation": "Este é o fundamento da sua estratégia DCA.",
        "point1": "NÃO é o ganho de um mês específico",
        "point2": "NÃO é o preço de um dia específico",
        "point3": "É a média REAL do seu investimento ao longo de {months} meses",
        "benefits": "Este número:",
        "benefit1": "Remove a ansiedade diária",
        "benefit2": "Mostra o progresso real",
        "benefit3": "É previsível em períodos longos",
        "benefit4": "Recompensa consistência, não timing",
        "warning": "ATENÇÃO: Este é um resultado PASSADO.",
        "warningText": "Não é garantia de retornos futuros. Bitcoin é volátil e você pode perder dinheiro."
      },
      "comparison": {
        "title": "Comparação de Estratégias",
        "lumpSum": {
          "title": "Estratégia 1: Lump Sum ({month}/{year})",
          "invested": "Investiu: {amount} de uma vez",
          "result": "Resultado: +{percent}% ({profit})",
          "avgGain": "Ganho médio: +{percent}%/mês"
        },
        "dca": {
          "title": "Estratégia 2: DCA ({amount}/mês)",
          "invested": "Investiu: {total} ao longo de {months} meses",
          "result": "Resultado: +{percent}% ({profit})",
          "avgGain": "Ganho médio: +{percent}%/mês"
        },
        "winner": "DCA teve resultado MELHOR porque:",
        "reason1": "Comprou mais barato na média",
        "reason2": "Reduziu impacto de volatilidade",
        "reason3": "Mais tranquilo psicologicamente"
      },
      "finalMessage": {
        "title": "O que você aprendeu:",
        "lesson1": "Timing perfeito é impossível",
        "lesson1Result": "DCA remove essa pressão",
        "lesson2": "Volatilidade é sua aliada no DCA",
        "lesson2Result": "Baixas = você compra mais barato",
        "lesson3": "O ganho médio mensal é o fundamento",
        "lesson3Result": "Não o ganho de um dia ou mês",
        "lesson4": "Paciência + Consistência > Inteligência",
        "lesson4Result": "{years} anos de disciplina valem mais que tentar adivinhar o momento certo",
        "conclusion": "Bitcoin não recompensa quem tenta prever. Bitcoin recompensa quem PERSISTE."
      }
    }
  }
}
```

---

## Próximos Passos

### Fase 1: Estrutura e Dados ✅
1. ✅ Criar este arquivo de documentação
2. ✅ Validar disponibilidade de dados históricos
3. ✅ Confirmar estrutura de i18n existente

### Fase 2: Componentes Base (Semana 1)
1. ⏳ **MoodInterpretation.tsx** - Interpretação emocional do mês
2. ⏳ **PriceChart.tsx** - Gráfico de linha com Recharts
3. ⏳ **AggregatedStats.tsx** - Estatísticas agregadas (lump sum)
4. ⏳ **DCAExplainer.tsx** - Explicação visual do DCA

### Fase 3: Simulador DCA (Semana 2)
5. ⏳ **DCAConfigurator.tsx** - Interface de configuração
6. ⏳ **DCAResults.tsx** - Resultados gerais
7. ⏳ **DCAInsights.tsx** - Insights interpretativos
8. ⏳ **DCADetailTable.tsx** - Tabela mês a mês
9. ⏳ **AverageGainHighlight.tsx** - Destaque do ganho médio
10. ⏳ **ComparisonCard.tsx** - Comparação Lump Sum vs DCA

### Fase 4: Orquestração (Semana 3)
11. ⏳ **NarrativeFlow.tsx** - Componente orquestrador
12. ⏳ Integração com scroll progressivo
13. ⏳ Animações com Framer Motion
14. ⏳ Transições suaves entre seções

### Fase 5: Internacionalização (Semana 4)
15. ⏳ Adicionar chaves `narrative.*` ao en.json
16. ⏳ Traduzir para os 13 idiomas restantes
17. ⏳ Validar placeholders ({amount}, {month}, {percent})
18. ⏳ Testar em todos os idiomas

### Fase 6: Testes e Ajustes (Semana 5)
19. ⏳ Testar fluxo narrativo completo
20. ⏳ Ajustar UX baseado em feedback
21. ⏳ Otimizar performance (lazy loading)
22. ⏳ Testar em mobile/tablet/desktop

### Fase 7: Deploy
23. ⏳ Build de produção
24. ⏳ Testes finais
25. ⏳ Deploy e monitoramento

---

## Métricas de Sucesso

- **Engajamento:** Usuários chegam até a seção DCA (70%+ do scroll)
- **Tempo na página:** Média de 5-7 minutos (leitura completa)
- **Taxa de simulação:** 40%+ dos visitantes simulam DCA
- **Compartilhamento:** Aumento de 2x em shares sociais

---

## Checklist de Validação

Antes de considerar a narrativa completa, validar:

- [ ] Todos os 11 componentes implementados
- [ ] Fluxo de 18 passos funcional
- [ ] Animações suaves e performáticas
- [ ] 100% internacionalizado (14 idiomas)
- [ ] Mobile-first e responsivo
- [ ] Acessibilidade (WCAG AA)
- [ ] Performance (Lighthouse > 90)
- [ ] Disclaimer educacional visível
- [ ] Sem promessas de retorno
- [ ] Código limpo e documentado

---

**Documento criado em:** 2026-01-09
**Última atualização:** 2026-01-09
**Versão:** 2.0 (completa com DCA)
**Autor:** Rodrigo Vilar + Claude Code
**Status:** 📝 Documentação completa - Pronto para implementação
