import type { Mechanism } from "./types";

/** Carboxylic acids & derivatives — nucleophilic acyl substitution (Persian lecture notes, 4 parts + McMurry ch. 17). */
export const ACYL_MECHANISMS: Mechanism[] = [
  {
    id: "acyl-substitution-general",
    family: "acyl-substitution",
    topic: "acyl",
    source: { en: "McMurry ch. 17 · lecture notes (4 parts)", fa: "مک‌موری فصل ۱۷ · جزوه‌های چهاربخشی" },
    tags: {
      en: ["tetrahedral intermediate", "leaving group", "reactivity ladder"],
      fa: ["میان‌واسط چهاروجهی", "گروه خارج‌شونده", "نردبان واکنش‌پذیری"],
    },
    en: {
      title: "Nucleophilic acyl substitution — the master mechanism",
      summary:
        "Unlike aldehydes/ketones (addition), acyl derivatives undergo ADDITION then ELIMINATION: the nucleophile adds to C=O, then the leaving group departs, restoring the C=O. The reactivity ladder (acid chloride > anhydride > ester ~ acid > amide) decides who converts whom.",
      general: "RCO–L + Nu⁻ -> R–C(O⁻)(Nu)(L) -> RCO–Nu + L⁻",
      steps: [
        { label: "Step 1 — nucleophilic addition", detail: "Nu attacks the acyl carbon → tetrahedral intermediate (sp³ carbon with O⁻, Nu and L all attached). This is why the carbonyl must have a leaving group: aldehydes/ketones' H/R cannot leave, so they stop at addition." },
        { label: "Step 2 — elimination of L", detail: "The lone pair returns to rebuild C=O as L⁻ departs. Equilibrium position = leaving-group quality." },
        { label: "Step 3 — proton transfer", detail: "Deprotonation of the new Nu–H (if neutral nucleophile) by solvent/base — final derivative." },
      ],
      keyPoints: [
        "Reactivity ladder: acid chloride > anhydride > ester ≈ acid > amide — you can always go DOWN the ladder, rarely up (needs activation: SOCl₂ etc.).",
        "Water adds to ALL of them → hydrolysis. The rate order is the same as the ladder.",
        "The Persian lecture notes walk this ladder in 4 parts: acids → acid halides → esters → amides/anhydrides.",
      ],
      conditions: "Varies by derivative; acids/esters often need acid/base catalysis + heat, chlorides react instantly.",
    },
    fa: {
      title: "جانشینی هسته‌خواهی اسیدیل — سازوکار مادر",
      summary:
        "برخلاف آلدهید/کتون‌ها (افزایش)، مشتقات اسیدی افزودن و سپس حذف می‌کنند: هسته‌خواه به C=O اضافه می‌شود، بعد گروه خارج‌شونده می‌رود و C=O بازمی‌سازد. نردبان واکنش‌پذیری (اسید کلراید > انیدرید > استر ≈ اسید > آمید) تعیین می‌کند چه کسی چه کسی را تبدیل کند.",
      general: "RCO–L + Nu⁻ -> R–C(O⁻)(Nu)(L) -> RCO–Nu + L⁻",
      steps: [
        { label: "مرحلهٔ ۱ — افزودن هسته‌خواهی", detail: "Nu به کربن اسیدی حمله می‌کند ← میان‌واسط چهاروجهی (کربن sp³ با O⁻ و Nu و L). دلیل نیاز به گروه خارج‌شونده همین است: H/R آلدهید و کتون نمی‌توانند بروند، پس واکنش در «افزایش» می‌ماند." },
        { label: "مرحلهٔ ۲ — خروج L", detail: "زوج الکترونی برمی‌گردد و C=O بازسازی می‌شود در حالی که L⁻ خارج می‌شود. جای تعادل = کیفیت گروه خارج‌شونده." },
        { label: "مرحلهٔ ۳ — انتقال پروتون", detail: "اگر هسته‌خواه خنثی بود، حلال/باز پروتون اضافی Nu–H را برمی‌دارد — مشتق نهایی." },
      ],
      keyPoints: [
        "نردبان واکنش‌پذیری: اسید کلراید > انیدرید > استر ≈ اسید > آمید — همیشه می‌توان پایین رفت، بالا رفتن نیازمند فعال‌سازی است (SOCl₂ و مانند آن).",
        "آب به همهٔ آن‌ها اضافه می‌شود ← هیدرولیز. ترتیب سرعت همان نردبان است.",
        "جزوه‌های فارسی همین نردبان را در ۴ بخش می‌روند: اسیدها ← هالیدهای اسیدی ← استرها ← آمیدها/انیدریدها.",
      ],
      conditions: "بسته به مشتق؛ اسیدها/استرها معمولاً کاتالیز اسید/باز و گرما می‌خواهند، کلرایدها فوری واکنش می‌دهند.",
    },
    examples: [
      { name: { en: "Template", fa: "الگو" }, equation: "RCOCl + Nu -> RCONu + Cl" },
    ],
    related: ["ch17-acid-chloride", "ch17-ester-from-acylchloride", "ch17-amide-formation", "ch17-anhydride-hydrolysis"],
  },
  {
    id: "acyl-fischer-esterification",
    family: "acyl-substitution",
    topic: "acyl",
    source: { en: "McMurry ch. 11 · lecture notes", fa: "مک‌موری فصل ۱۱ · جزوه‌ها" },
    tags: {
      en: ["Fischer", "equilibrium", "fruity smell"],
      fa: ["فیشر", "تعادل", "بوی میوه"],
    },
    en: {
      title: "Fischer esterification",
      summary:
        "Acid protonates the carbonyl, the alcohol attacks, a tetrahedral intermediate forms, and water leaves. Every step is reversible — excess alcohol (or water removal) pushes the equilibrium to the ester. The acid OH is replaced by OR.",
      general: "RCOOH + R'OH <-> H2SO4 -> RCOOR' + H2O",
      steps: [
        { label: "Step 1 — protonation", detail: "H⁺ on the carbonyl O makes the carbon far more electrophilic." },
        { label: "Step 2 — alcohol attack", detail: "R'OH attacks → tetrahedral intermediate; proton shuffling moves the charge around." },
        { label: "Step 3 — water leaves", detail: "One of the OH groups is protonated and leaves as water; deprotonation gives the ester and regenerates H⁺." },
      ],
      keyPoints: [
        "Le Chatelier is the yield knob: excess R'OH, removal of water, or distilling the ester.",
        "Esters = the fruity smells (ethyl acetate = nail-polish sweetness) — the nose is the detector.",
        "Saponification (base hydrolysis) is IRREVERSIBLE because the carboxylate anion can't be attacked — soap chemistry.",
      ],
      conditions: "Catalytic conc. H₂SO₄, reflux; remove water or use excess alcohol.",
    },
    fa: {
      title: "استری‌شدن فیشر",
      summary:
        "اسید کربونیل را پروتونه می‌کند، الکل حمله می‌کند، میان‌واسط چهاروجهی شکل می‌گیرد و آب خارج می‌شود. هر مرحله برگشت‌پذیر است — الکل اضافه (یا برداشتن آب) تعادل را به سمت استر می‌برد. گروه OH اسید با OR جایگزین می‌شود.",
      general: "RCOOH + R'OH <-> H2SO4 -> RCOOR' + H2O",
      steps: [
        { label: "مرحلهٔ ۱ — پروتون‌گیری", detail: "H⁺ روی اکسیژن کربونیل، الکترون‌خواهی کربن را بسیار بالا می‌برد." },
        { label: "مرحلهٔ ۲ — حملهٔ الکل", detail: "R'OH حمله می‌کند ← میان‌واسط چهاروجهی؛ جابه‌جایی پروتون‌ها بار را جابه‌جا می‌کند." },
        { label: "مرحلهٔ ۳ — خروج آب", detail: "یکی از گروه‌های OH پروتونه و به‌صورت آب خارج می‌شود؛ جدا شدن پروتون، استر می‌دهد و H⁺ بازیابی می‌شود." },
      ],
      keyPoints: [
        "لو شاتلیه دستگیرهٔ بازده است: الکل اضافه، برداشتن آب یا تقطیر استر.",
        "استرها بوی میوه‌ای‌اند (اتیل استات = شیرینی لاک ناخن) — بینی، آشکارساز است.",
        "صابونی‌شدن (هیدرولیز بازی) برگشت‌ناپذیر است چون آنیون کربوکسیلات قابل حمله نیست — شیمی صابون.",
      ],
      conditions: "H₂SO₄ غلیظ کاتالیزوری، بازگرداندن (رفلاکس)؛ برداشتن آب یا الکل اضافه.",
    },
    examples: [
      { name: { en: "Ethyl acetate", fa: "اتیل استات" }, equation: "CH3COOH + C2H5OH <-> H2SO4 -> CH3COOC2H5 + H2O" },
    ],
    related: ["ch11-esterification-fischer"],
  },
  {
    id: "acyl-socl2-chloride",
    family: "acyl-substitution",
    topic: "acyl",
    source: { en: "McMurry ch. 17 · lecture notes (acid halides)", fa: "مک‌موری فصل ۱۷ · جزوه‌ها (هالیدهای اسیدی)" },
    tags: {
      en: ["SOCl2", "gas escape", "ladder top"],
      fa: ["SOCl2", "خروج گاز", "قلهٔ نردبان"],
    },
    en: {
      title: "Carboxylic acid → acid chloride (SOCl₂)",
      summary:
        "The acid's OH attacks SOCl₂ → chlorosulfite intermediate; Cl⁻ then displaces it while SO₂ and HCl escape as gases. Two gases leave = completion by Le Chatelier. Acid chlorides sit at the TOP of the reactivity ladder.",
      general: "RCOOH + SOCl2 -> RCOCl + SO2 + HCl",
      steps: [
        { label: "Step 1 — chlorosulfite formation", detail: "The acid OH attacks sulfur of SOCl₂, Cl⁻ leaves; the chlorosulfite ester (R–C(=O)–O–S(=O)Cl) forms." },
        { label: "Step 2 — chloride displacement", detail: "Cl⁻ attacks the acyl carbon → tetrahedral intermediate; the chlorosulfite group departs and fragments to SO₂ + Cl⁻." },
        { label: "Step 3 — gases escape", detail: "SO₂ and HCl bubble out — the equilibrium is dragged to completion without any purification trickery." },
      ],
      keyPoints: [
        "Climbing the ladder: acid → chloride is the gateway to esters, amides and anhydrides in one step each.",
        "Catalytic DMF accelerates (Vilsmeier chlorinating agent).",
        "Everything must be dry; SOCl₂ + moisture = HCl/SO₂ fumes — strict hood.",
      ],
      conditions: "SOCl₂ neat or in ether, reflux; catalytic DMF optional.",
    },
    fa: {
      title: "کربوکسیلیک اسید ← اسید کلراید (SOCl₂)",
      summary:
        "گروه OH اسید به SOCl₂ حمله می‌کند ← واسط کلروسولفیت؛ سپس Cl⁻ آن را جابه‌جا می‌کند در حالی که SO₂ و HCl به‌صورت گاز خارج می‌شوند. خروج دو گاز = کامل شدن واکنش با لو شاتلیه. اسید کلرایدها قلهٔ نردبان واکنش‌پذیری‌اند.",
      general: "RCOOH + SOCl2 -> RCOCl + SO2 + HCl",
      steps: [
        { label: "مرحلهٔ ۱ — ساخت کلروسولفیت", detail: "گروه OH اسید به گوگرد SOCl₂ حمله می‌کند، Cl⁻ خارج می‌شود؛ استر کلروسولفیت (R–C(=O)–O–S(=O)Cl) ساخته می‌شود." },
        { label: "مرحلهٔ ۲ — جابه‌جایی با کلرید", detail: "Cl⁻ به کربن اسیدی حمله می‌کند ← واسط چهاروجهی؛ گروه کلروسولفیت خارج شده و به SO₂ + Cl⁻ می‌شکند." },
        { label: "مرحلهٔ ۳ — خروج گازها", detail: "SO₂ و HCL حباب می‌زنند و بیرون می‌روند — تعادل بدون هیچ ترفند خالص‌سازی کامل می‌شود." },
      ],
      keyPoints: [
        "بالا رفتن از نردبان: اسید ← کلراید، دروازهٔ یک‌مرحله‌ای به استرها، آمیدها و انیدریدها.",
        "DMF کاتالیزوری تسریع می‌کند (معرف کلردار ویلمایر).",
        "همه‌چیز باید خشک باشد؛ SOCl₂ + رطوبت = دود HCl/SO₂ — هود اکید.",
      ],
      conditions: "SOCl₂ خالص یا در اتر، رفلاکس؛ DMF کاتالیزوری اختیاری.",
    },
    examples: [
      { name: { en: "Acetyl chloride", fa: "استیل کلراید" }, equation: "CH3COOH + SOCl2 -> CH3COCl + SO2 + HCl" },
    ],
    related: ["ch17-acid-chloride"],
  },
  {
    id: "acyl-hydrolysis-family",
    family: "acyl-substitution",
    topic: "acyl",
    source: { en: "McMurry ch. 17 · lecture notes (esters/amides)", fa: "مک‌موری فصل ۱۷ · جزوه‌ها (استرها/آمیدها)" },
    tags: {
      en: ["hydrolysis", "saponification", "water attack"],
      fa: ["هیدرولیز", "صابونی‌شدن", "حملهٔ آب"],
    },
    en: {
      title: "Hydrolysis of esters & amides",
      summary:
        "Water (or OH⁻) attacks the acyl carbon; the alkoxy/amino group leaves and the acid (or carboxylate) forms. Acid hydrolysis is reversible; base hydrolysis (saponification) is not — the carboxylate anion repels nucleophiles.",
      general: "RCOOR' + H2O <-> H+ -> RCOOH + R'OH   |   + OH- -> RCOO⁻ + R'OH",
      steps: [
        { label: "Acid route", detail: "Protonate C=O → water attacks → tetrahedral intermediate → proton transfers → R'OH leaves → ester/acid equilibrium." },
        { label: "Base route (saponification)", detail: "OH⁻ attacks → tetrahedral intermediate → alkoxide leaves → carboxylic acid instantly deprotonated to carboxylate — which can't be attacked again, so the reaction is one-way." },
        { label: "Amides", detail: "Same logic, much slower (amide is the ladder's bottom; N is a poor leaving group) — needs strong acid/base + prolonged heating." },
      ],
      keyPoints: [
        "Soap: base cleaves fat's ester bonds → fatty-acid salts (surfactants) + glycerol.",
        "Anhydrides hydrolyze at the ladder position between chloride and ester — bottle must stay sealed.",
        "The lecture notes emphasize: esters hydrolyze easily; amides resist — the amide bond is why proteins are stable.",
      ],
      conditions: "Acid: H₃O⁺, reflux. Base: NaOH/H₂O, reflux. Amides: harsher, longer.",
    },
    fa: {
      title: "هیدرولیز استرها و آمیدها",
      summary:
        "آب (یا OH⁻) به کربن اسیدی حمله می‌کند؛ گروه آلکوکسی/آمینو خارج می‌شود و اسید (یا کربوکسیلات) ساخته می‌شود. هیدرولیز اسیدی برگشت‌پذیر است؛ هیدرولیز بازی (صابونی‌شدن) نیست — آنیون کربوکسیلات هسته‌خواه‌ها را می‌راند.",
      general: "RCOOR' + H2O <-> H+ -> RCOOH + R'OH   |   + OH- -> RCOO⁻ + R'OH",
      steps: [
        { label: "مسیر اسیدی", detail: "پروتون‌گیری C=O ← حملهٔ آب ← واسط چهاروجهی ← انتقال پروتون‌ها ← خروج R'OH ← تعادل استر/اسید." },
        { label: "مسیر بازی (صابونی‌شدن)", detail: "OH⁻ حمله می‌کند ← واسط چهاروجهی ← خروج آلکوکسید ← اسید کربوکسیلیک فوراً به کربوکسیلات دی‌پروتونه می‌شود — که دیگر قابل حمله نیست؛ پس واکنش یک‌طرفه است." },
        { label: "آمیدها", detail: "همین منطق، بسیار کندتر (آمید تهِ نردبان است؛ N گروه خارج‌شوندهٔ خوبی نیست) — اسید/باز قوی و گرمای طولانی می‌خواهد." },
      ],
      keyPoints: [
        "صابون: باز، پیوندهای استری چربی را می‌شکند ← نمک‌های اسید چرب (سورفکتانت) + گلیسرول.",
        "انیدریدها در جایگاهی بین کلراید و استر هیدرولیز می‌شوند — درب ظرف باید بسته بماند.",
        "جزوه‌ها تأکید می‌کنند: استرها به‌راحتی هیدرولیز می‌شوند؛ آمیدها مقاوم‌اند — پیوند آمید دلیل پایداری پروتئین‌هاست.",
      ],
      conditions: "اسیدی: H₃O⁺، رفلاکس. بازی: NaOH/H₂O، رفلاکس. آمیدها: سخت‌تر و طولانی‌تر.",
    },
    examples: [
      { name: { en: "Saponification", fa: "صابونی‌شدن" }, equation: "C17H35COOCH3 + NaOH -> C17H35COONa + CH3OH" },
    ],
    related: ["ch17-anhydride-hydrolysis", "ch23-saponification"],
  },
  {
    id: "acyl-claisen",
    family: "enolate",
    topic: "acyl",
    source: { en: "McMurry ch. 19 · lecture notes", fa: "مک‌موری فصل ۱۹ · جزوه‌ها" },
    tags: {
      en: ["β-keto ester", "full base", "active methylene"],
      fa: ["β-کتو استر", "باز کامل", "متیلن فعال"],
    },
    en: {
      title: "Claisen condensation — ester enolate + ester",
      summary:
        "Ethoxide removes an α-H from an ester; the enolate attacks another ester's carbonyl; EtO⁻ leaves → β-keto ester. The LAST step (deprotonating the active methylene, pKa ~11) makes the whole reaction effectively irreversible — hence a FULL equivalent of base.",
      general: "2 CH3COOC2H5 -> NaOEt -> CH3COCH2COOC2H5 + C2H5OH",
      steps: [
        { label: "Step 1 — ester enolate", detail: "NaOEt (matching the ester's OR group!) removes an α-H → ester enolate." },
        { label: "Step 2 — acyl substitution", detail: "Enolate attacks another ester's C=O → tetrahedral intermediate → EtO⁻ expelled → β-keto ester." },
        { label: "Step 3 — irreversible deprotonation", detail: "The β-keto ester's central CH₂ (pKa ~11, two carbonyls flanking) is deprotonated by the EtO⁻ formed. Acid workup then releases the neutral product." },
      ],
      keyPoints: [
        "Aldol's ester cousin — same enolate logic, acyl-substitution ending.",
        "Base must MATCH the alkoxy group (NaOEt for ethyl esters) or you get transesterification mess.",
        "Acetoacetic ester synthesis: the β-keto ester is a ketone factory (alkylate the methylene, hydrolyze, decarboxylate).",
      ],
      conditions: "NaOEt in EtOH, then H₃O⁺ workup; one FULL equivalent of base (not catalytic).",
    },
    fa: {
      title: "تراکم کلایزن — انولات استر + استر",
      summary:
        "اتوکساید یک α-H از استر می‌گیرد؛ انولات به کربونیل استر دیگر حمله می‌کند؛ EtO⁻ خارج می‌شود ← β-کتو استر. مرحلهٔ آخر (دی‌پروتونه کردن متیلن فعال با pKa حدود ۱۱) کل واکنش را عملاً برگشت‌ناپذیر می‌کند — برای همین بازِ «کامل» لازم است.",
      general: "2 CH3COOC2H5 -> NaOEt -> CH3COCH2COOC2H5 + C2H5OH",
      steps: [
        { label: "مرحلهٔ ۱ — انولات استر", detail: "NaOEt (هم‌جنس با گروه OR استر!) یک α-H را برمی‌دارد ← انولات استر." },
        { label: "مرحلهٔ ۲ — جانشینی اسیدیلی", detail: "انولات به C=O استر دیگر حمله می‌کند ← واسط چهاروجهی ← خروج EtO⁻ ← β-کتو استر." },
        { label: "مرحلهٔ ۳ — دی‌پروتون‌گیری برگشت‌ناپذیر", detail: "CH₂ وسط β-کتو استر (pKa حدود ۱۱، دو کربونیل در دو طرف) توسط EtO⁻ دی‌پروتونه می‌شود. کارِ اسیدی بعداً محصول خنثی را آزاد می‌کند." },
      ],
      keyPoints: [
        "پسرخالهٔ استری آلدول — همان منطق انولات با پایان جانشینی اسیدیلی.",
        "باز باید هم‌جنس گروه آلکوکسی باشد (برای استرهای اتیلی، NaOEt) وگرنه ترانس‌استری‌شدن به‌هم می‌ریزد.",
        "سنتز استواستیک‌استر: β-کتو استر کارخانهٔ کتون است (آلکیل‌دار کردن متیلن، هیدرولیز، دی‌کربوکسیل‌کردن).",
      ],
      conditions: "NaOEt در EtOH و سپس کارِ H₃O⁺؛ یک هم‌ارز کامل باز (نه کاتالیزوری).",
    },
    examples: [
      { name: { en: "Ethyl acetate → acetoacetic ester", fa: "اتیل استات ← استواستیک استر" }, equation: "2 CH3COOC2H5 -> CH3COCH2COOC2H5" },
    ],
    related: ["ch19-claisen", "ch19-michael"],
  },
];
