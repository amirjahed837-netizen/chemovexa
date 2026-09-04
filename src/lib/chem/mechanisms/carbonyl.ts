import type { Mechanism } from "./types";

/** Aldehydes & ketones — nucleophilic addition (Persian lecture notes: «آلدهید و کتون‌ها» + McMurry ch. 16, 19). */
export const CARBONYL_MECHANISMS: Mechanism[] = [
  {
    id: "carbonyl-nucleophilic-addition",
    family: "nucleophilic-addition",
    topic: "carbonyl",
    source: { en: "McMurry ch. 16 · lecture notes", fa: "مک‌موری فصل ۱۶ · جزوهٔ آلدهید و کتون‌ها" },
    tags: {
      en: ["C=O polarization", "tetrahedral", "aldehyde > ketone"],
      fa: ["قطبش C=O", "چهاروجهی", "آلدهید > کتون"],
    },
    en: {
      title: "Nucleophilic addition to C=O — the master mechanism",
      summary:
        "The C=O bond is polarized (C δ+, O δ−); a nucleophile attacks the electrophilic carbon, pushing electrons onto oxygen. The trigonal planar carbon becomes tetrahedral. Protonation of the alkoxide finishes. Aldehydes react faster than ketones (sterics + electronics).",
      general: "R2C=O + Nu⁻ -> R2C(O⁻)(Nu) -> H⁺ -> R2C(OH)(Nu)",
      steps: [
        { label: "Step 1 — nucleophilic attack", detail: "Nu⁻ attacks the planar carbonyl carbon at ~107° (Bürgi–Dunitz) as the π pair shifts to oxygen. Slow, rate-determining step." },
        { label: "Step 2 — protonation", detail: "The alkoxide takes H⁺ from solvent/acid → neutral alcohol product. Under acid catalysis the order flips: protonate C=O first, then weak Nu (H₂O, ROH) attacks." },
      ],
      keyPoints: [
        "Aldehyde > ketone reactivity: fewer bulky groups AND less stabilization of the δ+ carbon.",
        "Acid catalysis has two roles: activate C=O (protonation) but never fully protonate the nucleophile (kills it).",
        "This one mechanism covers: hydrides, Grignards, cyanohydrins, hydrates, hemiacetals, imines/enamines — all in ch. 16.",
      ],
      conditions: "Depends on the nucleophile: hydrides/organometallics = anhydrous; water/alcohols = mild acid or base catalysis.",
    },
    fa: {
      title: "افزایش هسته‌خواهی به C=O — سازوکار مادر",
      summary:
        "پیوند C=O قطبی است (C δ+، O δ−)؛ هسته‌خواه به کربن الکترون‌خواه حمله می‌کند و الکترون‌ها به اکسیژن می‌روند. کربن تختِ مثلثی چهاروجهی می‌شود و در پایان آلکوکسید پروتونه می‌شود. آلدهیدها سریع‌تر از کتون‌ها واکنش می‌دهند (فضایی + الکترونی).",
      general: "R2C=O + Nu⁻ -> R2C(O⁻)(Nu) -> H⁺ -> R2C(OH)(Nu)",
      steps: [
        { label: "مرحلهٔ ۱ — حملهٔ هسته‌خواهی", detail: "Nu⁻ در زاویهٔ حدود ۱۰۷ درجه (بورگی–دونیتز) به کربن تخت کربونیل حمله می‌کند و زوج π به اکسیژن می‌رود. مرحلهٔ کند و تعیین‌کنندهٔ سرعت." },
        { label: "مرحلهٔ ۲ — پروتون‌گیری", detail: "آلکوکسید از حلال/اسید پروتون می‌گیرد ← الکل خنثی. در کاتالیز اسیدی ترتیب برعکس است: اول C=O پروتونه، بعد هسته‌خواه ضعیف (H₂O، ROH) حمله می‌کند." },
      ],
      keyPoints: [
        "واکنش‌پذیری آلدهید > کتون: گروه‌های حجیم کمتر AND پایداری کمتر بار δ+ کربن.",
        "کاتالیز اسیدی دو نقش دارد: فعال‌سازی C=O (پروتون‌گیری) بدون آنکه هسته‌خواه را کامل پروتونه کند (که آن را نابود می‌کند).",
        "همین یک سازوکار همه را پوشش می‌دهد: هیدریدها، گرینیارها، سیانوهیدرین‌ها، هیدرات‌ها، همی‌استال‌ها و ایمین/انامین — فصل ۱۶.",
      ],
      conditions: "بسته به هسته‌خواه: هیدریدها/فلزآلی‌ها = بدون آب؛ آب/الکل‌ها = کاتالیز ملایم اسید یا باز.",
    },
    examples: [
      { name: { en: "Cyanohydrin", fa: "سیانوهیدرین" }, equation: "HCHO + HCN -> KCN -> HOCH2CN" },
      { name: { en: "Grignard", fa: "گرینیار" }, equation: "CH3CHO + CH3MgBr -> CH3-CH(OH)-CH3" },
    ],
    related: ["ch16-cyanohydrin", "ch16-hydrazine-hydrazone"],
  },
  {
    id: "carbonyl-imine-formation",
    family: "nucleophilic-addition",
    topic: "carbonyl",
    source: { en: "McMurry ch. 16 · lecture notes (hydrazones)", fa: "مک‌موری فصل ۱۶ · جزوه‌ها (هیدرازون‌ها)" },
    tags: {
      en: ["carbinolamine", "condensation", "derivatives"],
      fa: ["کاربینول‌آمین", "تراکم", "مشتقات شناسایی"],
    },
    en: {
      title: "Imine / hydrazone formation (addition–elimination)",
      summary:
        "A primary amine (or hydrazine) adds to C=O up to the carbinolamine, then loses water to the C=N double bond. Acid catalyzes BOTH steps mildly — too much acid protonates the amine and shuts it off.",
      general: "R2C=O + R'NH2 <-> R2C(OH)(NHR') -> R2C=NR' + H2O",
      steps: [
        { label: "Step 1 — nucleophilic addition", detail: "The amine N attacks the carbonyl carbon → alkoxide; proton transfers give the neutral carbinolamine." },
        { label: "Step 2 — acid-catalyzed dehydration", detail: "The OH is protonated → leaves as water; the N lone pair forms the C=N (iminium → imine)." },
      ],
      keyPoints: [
        "pH ~4.5 optimum: acid activates C=O but leaves enough free amine.",
        "Water removal (Dean–Stark, molecular sieves) drives the equilibrium to product.",
        "Crystalline hydrazones/oximes with sharp mp are the classic way to identify unknown carbonyls.",
      ],
      conditions: "Mild acid (pH 4–5), removal of water; hydrazine/semicarbazide/hydroxylamine derivatives.",
    },
    fa: {
      title: "ساخت ایمین / هیدرازون (افزایش–حذف)",
      summary:
        "آمین نوع اول (یا هیدرازین) تا مرحلهٔ کاربینول‌آمین به C=O اضافه می‌شود، سپس با از دست دادن آب پی دوگانهٔ C=N ساخته می‌شود. اسید هر دو مرحله را ملایم کاتالیز می‌کند — اسید زیاد، آمین را پروتونه و خاموش می‌کند.",
      general: "R2C=O + R'NH2 <-> R2C(OH)(NHR') -> R2C=NR' + H2O",
      steps: [
        { label: "مرحلهٔ ۱ — افزایش هسته‌خواهی", detail: "نیتروژن آمین به کربن کربونیلی حمله می‌کند ← آلکوکسید؛ انتقال پروتون کاربینول‌آمین خنثی می‌دهد." },
        { label: "مرحلهٔ ۲ — آب‌زدایی کاتالیز اسیدی", detail: "OH پروتونه می‌شود ← به‌صورت آب خارج می‌شود؛ زوج الکترونی نیتروژن C=N را می‌سازد (ایمینیوم ← ایمین)." },
      ],
      keyPoints: [
        "pH بهینه حدود ۴٫۵: اسید C=O را فعال می‌کند اما به‌اندازهٔ کافی آمین آزاد باقی می‌گذارد.",
        "برداشتن آب (دین–استارک، الک مولکولی) تعادل را به سمت محصول می‌برد.",
        "هیدرازون‌ها و اکسیم‌های بلوری با نقطهٔ ذوب مشخص، راه کلاسیک شناسایی کربونیل‌های مجهول‌اند.",
      ],
      conditions: "اسید ملایم (pH ۴–۵)، حذف آب؛ مشتقات هیدرازین/نیم‌کاربازید/هیدروکسیل‌آمین.",
    },
    examples: [
      { name: { en: "Hydrazone", fa: "هیدرازون" }, equation: "HCHO + N2H4 -> CH2=N-NH2 + H2O" },
    ],
    related: ["ch16-hydrazine-hydrazone"],
  },
  {
    id: "carbonyl-aldol",
    family: "enolate",
    topic: "carbonyl",
    source: { en: "McMurry ch. 18–19 · lecture notes", fa: "مک‌موری فصول ۱۸–۱۹ · جزوه‌ها" },
    tags: {
      en: ["enolate", "C–C bond", "β-hydroxy"],
      fa: ["انولات", "پیوند C–C", "β-هیدروکسی"],
    },
    en: {
      title: "Aldol reaction — enolate meets carbonyl",
      summary:
        "Base removes an α-H to make the enolate; its carbon attacks another aldehyde/ketone's C=O. Product: β-hydroxy carbonyl (aldol). Heat dehydrates it to the α,β-unsaturated enal — the aldol condensation.",
      general: "2 CH3CHO -> NaOH -> CH3CH(OH)CH2CHO -> heat -> CH3CH=CHCHO",
      steps: [
        { label: "Step 1 — enolate formation", detail: "OH⁻ (catalytic) abstracts an α-hydrogen; the negative charge is delocalized between α-C and O (pKa ≈ 20 vs water 15.7 — small but steady equilibrium)." },
        { label: "Step 2 — C–C bond formation", detail: "The enolate's carbon attacks another carbonyl → alkoxide." },
        { label: "Step 3 — protonation", detail: "Water protonates the alkoxide → β-hydroxy aldehyde (aldol). Heating eliminates water (E1cb) → enal." },
      ],
      keyPoints: [
        "One molecule = nucleophile (its α-carbon), one = electrophile (its carbonyl).",
        "The most important C–C bond-builder of carbonyl chemistry; cross-aldol, Robinson annulation, terpene/prostaglandin syntheses all run on it.",
        "E1cb dehydration: base removes the α-H FIRST, then OH⁻ leaves — different from ordinary acid dehydration.",
      ],
      conditions: "Catalytic NaOH/KOH in water–ethanol; cold → aldol, hot → condensation.",
    },
    fa: {
      title: "واکنش آلدول — انولات و کربونیل",
      summary:
        "باز یک هیدروژن α را می‌گیرد و انولات می‌سازد؛ کربن انولات به C=Oِ آلدهید/کتون دیگر حمله می‌کند. محصول: کربونیل β-هیدروکسی (آلدول). گرما آب آن را می‌گیرد و انال α,β-اشباع‌نشده می‌سازد — تراکم آلدول.",
      general: "2 CH3CHO -> NaOH -> CH3CH(OH)CH2CHO -> گرما -> CH3CH=CHCHO",
      steps: [
        { label: "مرحلهٔ ۱ — ساخت انولات", detail: "OH⁻ (کاتالیزوری) یک هیدروژن α را برمی‌دارد؛ بار منفی بین α-کربن و O غیرمتمرکز است (pKa ≈ ۲۰ در برابر آب ۱۵٫۷ — تعادل کوچک اما پیوسته)." },
        { label: "مرحلهٔ ۲ — ساخت پیوند C–C", detail: "کربن انولات به کربونیل دیگر حمله می‌کند ← آلکوکسید." },
        { label: "مرحلهٔ ۳ — پروتون‌گیری", detail: "آب آلکوکسید را پروتونه می‌کند ← آلدهید β-هیدروکسی (آلدول). با گرما، آب حذف می‌شود (E1cb) ← انال." },
      ],
      keyPoints: [
        "یک مولکول هسته‌خواه است (کربن α‌اش) و دیگری الکترون‌خواه (کربونیلش).",
        "مهم‌ترین پیوندزن C–C در شیمی کربونیل؛ آلدول متقاطع، آنولاسیون رابینسون و سنتز ترپن‌ها/پروستاگلاندین‌ها همه روی آن سوارند.",
        "آب‌زدایی E1cb: باز اول هیدروژن α را می‌گیرد، بعد OH⁻ خارج می‌شود — با آب‌زدایی اسیدی معمولی فرق دارد.",
      ],
      conditions: "NaOH/KOH کاتالیزوری در آب–اتانول؛ سرد ← آلدول، گرم ← تراکم.",
    },
    examples: [
      { name: { en: "Aldol of acetaldehyde", fa: "آلدول استالدهید" }, equation: "2 CH3CHO -> CH3CH(OH)CH2CHO" },
    ],
    related: ["ch18-aldol"],
  },
  {
    id: "carbonyl-alpha-halogenation",
    family: "enolate",
    topic: "carbonyl",
    source: { en: "McMurry ch. 18 · lecture notes", fa: "مک‌موری فصل ۱۸ · جزوه‌ها" },
    tags: {
      en: ["enol", "kinetics", "haloform"],
      fa: ["انول", "سینتیک", "هالوفرم"],
    },
    en: {
      title: "α-Halogenation via the enol",
      summary:
        "The carbonyl oxygen is protonated, an enol forms, and the enol's C=C attacks Br₂. Kinetic fingerprint: the rate depends on [ketone], not [Br₂] — enolization is the slow step. In base with methyl ketones it runs to the haloform end.",
      general: "CH3COCH3 + Br2 -> AcOH -> CH3COCH2Br + HBr",
      steps: [
        { label: "Step 1 — acid-catalyzed enolization", detail: "O is protonated; water removes an α-H → C=C–OH (enol). This slow equilibrium is the rate-determining step." },
        { label: "Step 2 — enol attacks Br₂", detail: "The enol's electron-rich C=C takes Br⁺; H⁺ is regenerated (catalytic). Mono-substitution with one equivalent." },
        { label: "Base variant — haloform", detail: "OH⁻ makes the enolate; each α-H is replaced until trihalomethyl; OH⁻ then cleaves CHX₃⁻ off → carboxylate + CHX₃ (yellow iodoform test for methyl ketones)." },
      ],
      keyPoints: [
        "Rate = k[ketone][H⁺] — independent of [Br₂]: the book's favorite mechanistic detective story.",
        "Iodoform (CHI₃, yellow, antiseptic smell) = positive test for CH₃–CO– group.",
        "Under base, halogenation doesn't stop at one — every halogen makes the next α-H more acidic.",
      ],
      conditions: "Acid route: Br₂ in AcOH, one equivalent. Base route: excess X₂ + OH⁻ → haloform.",
    },
    fa: {
      title: "هالوژن‌دار کردن α از مسیر انول",
      summary:
        "اکسیژن کربونیل پروتونه می‌شود، انول شکل می‌گیرد و C=Cِ انول به Br₂ حمله می‌کند. اثر انگشتی سینتیکی: سرعت به [کتون] بستگی دارد نه [Br₂] — انول‌شدن مرحلهٔ کند است. در باز و با کتون‌های متیلی تا انتهای هالوفرم می‌رود.",
      general: "CH3COCH3 + Br2 -> AcOH -> CH3COCH2Br + HBr",
      steps: [
        { label: "مرحلهٔ ۱ — انول‌شدن کاتالیز اسیدی", detail: "O پروتونه می‌شود؛ آب یک هیدروژن α را برمی‌دارد ← C=C–OH (انول). همین تعادلِ کند، مرحلهٔ تعیین‌کنندهٔ سرعت است." },
        { label: "مرحلهٔ ۲ — حملهٔ انول به Br₂", detail: "C=C پرالکترونِ انول Br⁺ را می‌گیرد؛ H⁺ بازیابی می‌شود (کاتالیزوری). با یک هم‌ارز، تک‌جانشینی." },
        { label: "مسیر بازی — هالوفرم", detail: "OH⁻ انولات می‌سازد؛ هر α-H جایگزین می‌شود تا تری‌هالومتیل؛ سپس OH⁻ گروه CHX₃⁻ را جدا می‌کند ← کربوکسیلات + CHX₃ (آزمون زرد یدوفرم برای کتون‌های متیلی)." },
      ],
      keyPoints: [
        "سرعت = k[کتون][H⁺] — مستقل از [Br₂]: داستان کارآگاهی محبوب کتاب درسنامه‌ها.",
        "یدوفرم (CHI₃، زرد، بوی ضدعفونی) = آزمون مثبت گروه CH₃–CO–.",
        "در محیط باز، هالوژن‌دار کردن در یکی نمی‌ایستد — هر هالوژن، α-H بعدی را اسیدی‌تر می‌کند.",
      ],
      conditions: "مسیر اسیدی: Br₂ در AcOH با یک هم‌ارز. مسیر بازی: X₂ اضافه + OH⁻ ← هالوفرم.",
    },
    examples: [
      { name: { en: "Iodoform test", fa: "آزمون یدوفرم" }, equation: "CH3COCH3 + 3 I2 + 4 NaOH -> CHI3 + CH3COONa + 3 NaI + 3 H2O" },
    ],
    related: ["ch18-halogenation-alpha"],
  },
  {
    id: "carbonyl-reduction",
    family: "redox",
    topic: "carbonyl",
    source: { en: "McMurry ch. 12 · lecture notes", fa: "مک‌موری فصل ۱۲ · جزوه‌ها" },
    tags: {
      en: ["hydride", "LiAlH4 vs NaBH4", "alcohols"],
      fa: ["هیدرید", "LiAlH4 در برابر NaBH4", "الکل‌ها"],
    },
    en: {
      title: "Hydride reduction of C=O",
      summary:
        "AlH₄⁻ (or BH₄⁻) delivers H⁻ — a hydrogen with TWO electrons — to the electrophilic carbonyl carbon; the alkoxide is protonated at workup. Aldehydes → 1° alcohols, ketones → 2°. LiAlH₄ is the hammer; NaBH₄ the chisel.",
      general: "R2C=O + LiAlH4; H2O -> R2CHOH",
      steps: [
        { label: "Step 1 — hydride delivery", detail: "H⁻ migrates from Al (or B) to the carbonyl carbon; the π pair lands on oxygen → metal alkoxide." },
        { label: "Step 2 — aqueous workup", detail: "Water/acid protonates the alkoxide → the alcohol. Vigorous H₂ evolution if excess hydride remains — quench slowly." },
      ],
      keyPoints: [
        "Hydride is the nucleophile (H⁻), not the proton (H⁺) — the exact mirror of protonation chemistry.",
        "LiAlH₄ reduces acids/esters/amides too; NaBH₄ touches only aldehydes/ketones.",
        "Catalytic H₂/Ni does the same transformation on the surface (ch. 12).",
      ],
      conditions: "Anhydrous ether/THF for the reduction; water/acid workup strictly AFTER.",
    },
    fa: {
      title: "کاهش C=O با هیدرید",
      summary:
        "AlH₄⁻ (یا BH₄⁻) یک H⁻ — هیدروژن با دو الکترون — به کربن الکترون‌خواه کربونیل می‌دهد؛ آلکوکسید در کارِ پایانی پروتونه می‌شود. آلدهید ← الکل نوع اول، کتون ← نوع دوم. LiAlH₄ پتک است؛ NaBH₄ قلم تراش.",
      general: "R2C=O + LiAlH4; H2O -> R2CHOH",
      steps: [
        { label: "مرحلهٔ ۱ — تحویل هیدرید", detail: "H⁻ از آلومینیوم (یا بور) به کربن کربونیلی می‌رود؛ زوج π روی اکسیژن می‌نشیند ← آلکوکسید فلزی." },
        { label: "مرحلهٔ ۲ — کارِ آبی", detail: "آب/اسید آلکوکسید را پروتونه می‌کند ← الکل. اگر هیدرید اضافه بماند، تولید شدید H₂ — آرام خاموش کنید." },
      ],
      keyPoints: [
        "هیدرید هسته‌خواه است (H⁻) نه پروتون (H⁺) — آینهٔ کامل شیمی پروتون‌گیری.",
        "LiAlH₄ اسید/استر/آمید را هم کاهش می‌دهد؛ NaBH₄ فقط به آلدهید/کتون دست می‌زند.",
        "H₂/Ni کاتالیزی همان تبدیل را روی سطح انجام می‌دهد (فصل ۱۲).",
      ],
      conditions: "اتر/THF بدون آب برای کاهش؛ کارِ آبی/اسیدی فقط بعد از آن.",
    },
    examples: [
      { name: { en: "Formaldehyde → methanol", fa: "فرمالدهید ← متانول" }, equation: "HCHO + LiAlH4 -> CH3OH" },
      { name: { en: "Catalytic", fa: "کاتالیزی" }, equation: "HCHO + H2 -> Ni -> CH3OH" },
    ],
    related: ["ch12-reduction-liAlH4", "ch12-hydrogenation-aldehyde"],
  },
];
