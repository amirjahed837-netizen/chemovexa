import type { Mechanism } from "./types";

/** Foundations — alkyl halides (SN1/SN2/E1/E2 + radical halogenation). McMurry ch. 6, 10. */
export const FOUNDATION_MECHANISMS: Mechanism[] = [
  {
    id: "sn2",
    family: "substitution",
    topic: "foundations",
    source: { en: "McMurry ch. 6", fa: "مک‌موری فصل ۶" },
    tags: {
      en: ["backside attack", "inversion", "kinetics"],
      fa: ["حمله از پشت", "وارونگی", "سینتیک"],
    },
    en: {
      title: "SN2 — bimolecular nucleophilic substitution",
      summary:
        "One concerted step: the nucleophile attacks from the side opposite the leaving group as the C–LG bond breaks. Rate = k[RX][Nu⁻]. At a stereocenter the configuration inverts (Walden inversion). Methyl/primary halides are fastest.",
      general: "Nu⁻ + R–X -> R–Nu + X⁻  (one step)",
      steps: [
        { label: "Step 1 — the only step", detail: "Nu⁻ approaches the σ* C–X orbital from 180° (backside); the C–Nu bond forms exactly as C–X breaks. The transition state has both Nu and X partially bonded — pentacoordinate, trigonal-bipyramidal-ish." },
      ],
      keyPoints: [
        "Backside attack = Walden inversion: like an umbrella flipping inside-out.",
        "Rate falls with crowding: CH₃ > 1° > 2° ≫ 3° (tertiary = zero).",
        "Polar APROTIC solvents (acetone, DMSO, DMF) speed it up — naked nucleophile, no solvent cage.",
      ],
      conditions: "Strong nucleophile, unhindered substrate, polar aprotic solvent, lower temperature.",
    },
    fa: {
      title: "SN2 — جانشینی هسته‌خواهی دوذره‌ای",
      summary:
        "یک گام هم‌زمان: هسته‌خواه از سمت مقابل گروه خارج‌شونده حمله می‌کند در حالی که پیوند C–LG می‌شکند. سرعت = k[RX][Nu⁻]. روی مرکز استری، پیکربندی وارونه می‌شود (وارونگی والدن). هالیدهای متیلی/نوع اول سریع‌ترین‌اند.",
      general: "Nu⁻ + R–X -> R–Nu + X⁻  (یک مرحله)",
      steps: [
        { label: "مرحلهٔ ۱ — تنها مرحله", detail: "Nu⁻ از ۱۸۰ درجه (پشت) به اوربیتال σ* C–X نزدیک می‌شود؛ پیوند C–Nu دقیقاً هم‌زمان با شکستن C–X ساخته می‌شود. حالت گذار هم Nu و هم X نیمه‌پیوسته دارند — شبه‌پنج‌مختصات." },
      ],
      keyPoints: [
        "حمله از پشت = وارونگی والدن: مثل برگشتن چتر از داخل به بیرون.",
        "سرعت با شلوغی می‌افتد: CH₃ > ۱° > ۲° ≫ ۳° (در نوع سوم، صفر).",
        "حلال‌های قطبی آپروتیک (استون، DMSO، DMF) سرعت را می‌برند — هسته‌خواه لخت بدون قفس حلالی.",
      ],
      conditions: "هسته‌خواه قوی، زیرلایهٔ کم‌فضا، حلال قطبی آپروتیک، دمای پایین‌تر.",
    },
    examples: [
      { name: { en: "Methyl bromide + OH⁻", fa: "برومید متیل + OH⁻" }, equation: "CH3Br + OH- -> CH3OH + Br-" },
      { name: { en: "Williamson ether", fa: "اتر ویلیامسون" }, equation: "CH3Br + CH3ONa -> CH3OCH3 + NaBr" },
    ],
    related: ["ch6-sn2", "ch11-ether-synthesis"],
  },
  {
    id: "sn1",
    family: "substitution",
    topic: "foundations",
    source: { en: "McMurry ch. 6", fa: "مک‌موری فصل ۶" },
    tags: {
      en: ["carbocation", "racemization", "two steps"],
      fa: ["کاتیون", "راکی‌سازی", "دو مرحله"],
    },
    en: {
      title: "SN1 — unimolecular nucleophilic substitution",
      summary:
        "Two steps: slow ionization to a planar carbocation (rate = k[RX] only), then fast capture by the nucleophile. Racemization at a stereocenter — either face can be attacked. Tertiary halides only.",
      general: "R–X -> R⁺ + X⁻ ; R⁺ + Nu -> R–Nu",
      steps: [
        { label: "Step 1 — ionization (slow)", detail: "The C–X bond breaks on its own; the leaving group takes both electrons → planar sp² carbocation + X⁻. Rate depends ONLY on [RX]." },
        { label: "Step 2 — capture (fast)", detail: "The nucleophile attacks either face of the planar cation; deprotonation if neutral. Slight excess of inversion because the departing X⁻ blocks its own side." },
      ],
      keyPoints: [
        "Carbocation stability rules: 3° > 2° > 1°; hydride/methyl shifts possible before capture.",
        "Polar PROTIC solvents (water, alcohols) speed it up — they stabilize both ions.",
        "Racemization (±small inversion bias) is the stereochemical fingerprint.",
      ],
      conditions: "Tertiary/benzylic substrate, weak nucleophile ok, polar protic solvent, heat.",
    },
    fa: {
      title: "SN1 — جانشینی هسته‌خواهی یک‌ذره‌ای",
      summary:
        "دو مرحله: یونش کند به کاتیون تخت (سرعت فقط = k[RX]) و سپس شکار سریع توسط هسته‌خواه. روی مرکز استری راکی‌سازی می‌شود — حمله از هر دو سو ممکن است. فقط هالیدهای نوع سوم.",
      general: "R–X -> R⁺ + X⁻ ; R⁺ + Nu -> R–Nu",
      steps: [
        { label: "مرحلهٔ ۱ — یونش (کند)", detail: "پیوند C–X خودش می‌شکند؛ گروه خارج‌شونده هر دو الکترون را می‌برد ← کاتیون sp² تخت + X⁻. سرعت فقط به [RX] بستگی دارد." },
        { label: "مرحلهٔ ۲ — شکار (سریع)", detail: "هسته‌خواه از هر روی کاتیون تخت حمله می‌کند؛ اگر خنثی بود، دی‌پروتونه شدن. کمی فراوانی وارونگی چون X⁻ِ رفته، سمت خودش را سد می‌کند." },
      ],
      keyPoints: [
        "قاعدهٔ پایداری کاتیون: ۳° > ۲° > ۱°؛ جابه‌جایی هیدرید/متیل پیش از شکار ممکن است.",
        "حلال‌های قطبی پروتیک (آب، الکل‌ها) سرعت را می‌برند — هر دو یون را پایدار می‌کنند.",
        "راکی‌سازی (با کمی سوگیری به وارونگی) اثر انگشتی استریوکیمیایی است.",
      ],
      conditions: "زیرلایهٔ نوع سوم/بنزیلی، هسته‌خواه ضعیف کافی است، حلال قطبی پروتیک، گرما.",
    },
    examples: [
      { name: { en: "t-BuBr solvolysis", fa: "انحلال‌پذیری t-BuBr" }, equation: "(CH3)3CBr + H2O -> (CH3)3COH + HBr" },
    ],
    related: ["ch6-sn1"],
  },
  {
    id: "e2-e1",
    family: "elimination",
    topic: "foundations",
    source: { en: "McMurry ch. 6–7 · lecture notes", fa: "مک‌موری فصول ۶–۷ · جزوه‌ها" },
    tags: {
      en: ["anti-periplanar", "Zaitsev", "alkene synthesis"],
      fa: ["ضد-پری‌پلانار", "زایتسف", "سنتز آلکن"],
    },
    en: {
      title: "E2 & E1 — making the double bond",
      summary:
        "E2: one concerted step — a base removes a β-H anti-periplanar to the leaving group as C=C forms and X⁻ departs. E1: the SN1 carbocation forms first, then a base takes the β-H. Zaitsev's rule: the more substituted alkene dominates.",
      general: "R–CH2–CH(X)–R' + B⁻ -> R–CH=CH–R' + HB + X⁻",
      steps: [
        { label: "E2 — concerted", detail: "Base, β-H, both carbons and X are coplanar (anti). C–H breaks as C=C forms as C–X breaks — all simultaneously. Rate = k[RX][base]. Bulky bases (t-BuO⁻) give the less substituted (Hofmann) alkene." },
        { label: "E1 — via carbocation", detail: "Ionization first (same as SN1 step 1); then any weak base removes a β-H → alkene. Competes with SN1 on the same cation; heat favors elimination." },
      ],
      keyPoints: [
        "Anti-periplanar geometry is the E2 requirement — on rings this decides the product (trans-diaxial).",
        "Zaitsev: more substituted alkene wins (more stable). Hofmann exception with bulky bases.",
        "Dehydration of alcohols (E1, acid, 170 °C) is the reverse of hydration — same equilibrium, other side.",
      ],
      conditions: "E2: strong base (KOH/EtOH, t-BuOK). E1: acid + heat, secondary/tertiary alcohols.",
    },
    fa: {
      title: "E2 و E1 — ساختن پی دوگانه",
      summary:
        "E2: یک گام هم‌زمان — باز، هیدروژن β‌ای ضد-پری‌پلانار با گروه خارج‌شونده را برمی‌دارد در حالی که C=C ساخته و X⁻ خارج می‌شود. E1: اول کاتیون SN1 شکل می‌گیرد، بعد باز β-H را می‌گیرد. قاعدهٔ زایتسف: آلکن جای‌گرفته‌تر حاکم است.",
      general: "R–CH2–CH(X)–R' + B⁻ -> R–CH=CH–R' + HB + X⁻",
      steps: [
        { label: "E2 — هم‌زمان", detail: "باز، β-H، دو کربن و X همه‌در یک صفحه (ضد). C–H می‌شکند هم‌زمان با ساخته‌شدن C=C و شکستن C–X. سرعت = k[RX][باز]. بازهای حجیم (t-BuO⁻) آلکن کم‌جانشین (هوفمن) می‌دهند." },
        { label: "E1 — از مسیر کاتیون", detail: "اول یونش (مانند گام ۱ SN1)؛ سپس هر باز ضعیفی β-H را می‌گیرد ← آلکن. روی همان کاتیون با SN1 رقابت می‌کند؛ گرما حذف را ترجیح می‌دهد." },
      ],
      keyPoints: [
        "هندسهٔ ضد-پری‌پلانار شرط E2 است — روی حلقه‌ها همین، محصول را تعیین می‌کند (ترانس-دی‌اکسوشیال).",
        "زایتسف: آلکن جای‌گرفته‌تر می‌برد (پایدارتر). استثنای هوفمن با بازهای حجیم.",
        "آب‌گیری الکل‌ها (E1، اسید، ۱۷۰ درجه) معکوسِ افزایش است — همان تعادل، سمت دیگر.",
      ],
      conditions: "E2: باز قوی (KOH/EtOH، t-BuOK). E1: اسید + گرما، الکل‌های نوع دوم/سوم.",
    },
    examples: [
      { name: { en: "E2 with KOH", fa: "E2 با KOH" }, equation: "CH3CH2Br + KOH -> EtOH, heat -> CH2=CH2 + KBr + H2O" },
      { name: { en: "Dehydration", fa: "آب‌گیری" }, equation: "CH3CH2OH -> H2SO4, 170C -> CH2=CH2 + H2O" },
    ],
    related: ["ch6-e2", "ch7-elimination-dehydrohalogenation", "ch11-alcohol-dehydration"],
  },
  {
    id: "radical-halogenation",
    family: "radical",
    topic: "foundations",
    source: { en: "McMurry ch. 10", fa: "مک‌موری فصل ۱۰" },
    tags: {
      en: ["chain reaction", "hν", "selectivity"],
      fa: ["واکنش زنجیره‌ای", "hν", "گزینش‌پذیری"],
    },
    en: {
      title: "Radical halogenation of alkanes",
      summary:
        "Three phases: INITIATION (hν splits X₂ → X·), PROPAGATION (X· abstracts H → R·; R· attacks X₂ → RX + X·), TERMINATION (two radicals combine). UV or heat drives it; product mixtures are statistical unless controlled.",
      general: "CH4 + Cl2 -> hν -> CH3Cl + HCl",
      steps: [
        { label: "Initiation", detail: "Light (or 250–400 °C) homolytically splits Cl₂ into two Cl· radicals." },
        { label: "Propagation 1", detail: "Cl· abstracts an H: Cl· + CH₄ → HCl + CH₃· (endothermic for Cl, exothermic for Br — hence Br is more selective)." },
        { label: "Propagation 2", detail: "CH₃· + Cl₂ → CH₃Cl + Cl· — the chain carrier is regenerated." },
        { label: "Termination", detail: "Two radicals meet → neutral molecule. Rare — chain lengths run thousands of cycles." },
      ],
      keyPoints: [
        "No carbocations, no polarity — neutral radicals throughout.",
        "Selectivity: 3° > 2° > 1° H; Br₂ is far more selective than Cl₂ (Hammond postulate).",
        "Over-halogenation gives CH₂Cl₂, CHCl₃, CCl₄ — excess methane limits it.",
      ],
      conditions: "Cl₂ or Br₂, hν (UV) or Δ 250–400 °C; gas phase or CCl₄ solution.",
    },
    fa: {
      title: "هالوژن‌دار کردن رادیکالی آلکان‌ها",
      summary:
        "سه فاز: شروع (hν موجب شکست X₂ ← X·)، رشد (X· هیدروژن می‌رباید ← R·؛ R· به X₂ حمله می‌کند ← RX + X·)، پایان (ترکیب دو رادیکال). نور فرابنفش یا گرما محرک است؛ مخلوط محصول بدون کنترل آماری است.",
      general: "CH4 + Cl2 -> hν -> CH3Cl + HCl",
      steps: [
        { label: "شروع", detail: "نور (یا ۲۵۰–۴۰۰ درجه) Cl₂ را همگن به دو رادیکال Cl· می‌شکند." },
        { label: "رشد ۱", detail: "Cl· هیدروژن می‌رباید: Cl· + CH₄ ← HCl + CH₃· (برای Cl گرماده‌درون‌ساز و برای Br گرماده — برای همین Br گزینش‌پذیرتر است)." },
        { label: "رشد ۲", detail: "CH₃· + Cl₂ ← CH₃Cl + Cl· — حامل زنجیره دوباره ساخته می‌شود." },
        { label: "پایان", detail: "دو رادیکال به هم می‌رسند ← مولکول خنثی. نادر — طول زنجیره‌ها هزاران چرخه است." },
      ],
      keyPoints: [
        "نه کاتیون، نه قطبیت — سراسر رادیکال‌های خنثی.",
        "گزینش‌پذیری: H نوع ۳° > ۲° > ۱°؛ Br₂ بسیار گزینش‌پذیرتر از Cl₂ (فرضیهٔ هموند).",
        "هالوژن‌دار شدن بیش از حد به CH₂Cl₂، CHCl₃ و CCl₄ می‌رسد — متان اضافه جلویش را می‌گیرد.",
      ],
      conditions: "Cl₂ یا Br₂، hν (فرابنفش) یا ۲۵۰–۴۰۰ درجه؛ فاز گاز یا محلول CCl₄.",
    },
    examples: [
      { name: { en: "Methane chlorination", fa: "کلراسیون متان" }, equation: "CH4 + Cl2 -> hν -> CH3Cl + HCl" },
    ],
    related: ["ch10-methane-chlorination"],
  },
  {
    id: "grignard-formation",
    family: "acidbase",
    topic: "foundations",
    source: { en: "McMurry ch. 12 · lecture notes", fa: "مک‌موری فصل ۱۲ · جزوه‌ها" },
    tags: {
      en: ["organometallic", "anhydrous", "carbanion"],
      fa: ["فلزآلی", "بدون آب", "کربانیون"],
    },
    en: {
      title: "Grignard reagents — formation & destruction",
      summary:
        "Mg metal inserts into the C–X bond (oxidative insertion) giving R–MgX, best read as R⁻ MgX⁺ — a carbanion equivalent, superb nucleophile and base. Water destroys it instantly (pKa 50 vs 16), which is why everything must be bone-dry.",
      general: "R–Br + Mg -> Et2O -> R–MgBr ; R–MgBr + H2O -> R–H + Mg(OH)Br",
      steps: [
        { label: "Formation", detail: "Electrons flow from Mg into the σ* C–Br orbital; the metal inserts. Anhydrous ether solvates and stabilizes the reagent; iodine or 1,2-dibromoethane activates a lazy Mg surface." },
        { label: "Quench by water", detail: "R⁻ (the strongest base in the flask) rips H⁺ from water → alkane. Any O–H/N–H bond does the same — alcohols, amines, terminal alkynes." },
        { label: "Use on C=O", detail: "R⁻ attacks carbonyls → after workup, alcohols with a NEW carbon skeleton: formaldehyde → 1°, other aldehydes → 2°, ketones → 3°. The C–C bond-builder." },
      ],
      keyPoints: [
        "The C–Mg bond is polarized C δ− — carbon acts like a carbanion.",
        "Dry glassware, dry ether, N₂ blanket — moisture is the enemy.",
        "Grignard + CO₂ → carboxylic acid (one-carbon homologation trick).",
      ],
      conditions: "Mg turnings, anhydrous Et₂O/THF, inert atmosphere; quench with NH₄Cl(aq).",
    },
    fa: {
      title: "معرف‌های گرینیار — ساخت و نابودی",
      summary:
        "فلز منیزیم درون پیوند C–X می‌نشیند (درج اکسایشی) و R–MgX می‌دهد که بهتر است R⁻ MgX⁺ بخوانیم — هم‌ارز کربانیون، هسته‌خواه و بازِ عالی. آب آن را فوراً نابود می‌کند (pKa ۵۰ در برابر ۱۶)؛ برای همین همه‌چیز باید بی‌رطوبت باشد.",
      general: "R–Br + Mg -> Et2O -> R–MgBr ; R–MgBr + H2O -> R–H + Mg(OH)Br",
      steps: [
        { label: "ساخت", detail: "الکترون‌ها از Mg به اوربیتال σ* C–Br جاری می‌شوند؛ فلز درج می‌شود. اتر بدون آب، معرف را حل و پایدار می‌کند؛ ید یا ۱٬۲-دی‌برومواتان سطح کسل‌شدهٔ Mg را بیدار می‌کند." },
        { label: "خاموشی با آب", detail: "R⁻ (قوی‌ترین باز ظرف) پروتون را از آب می‌رباید ← آلکان. هر پیوند O–H/N–H همین کار را می‌کند — الکل‌ها، آمین‌ها، آلکین‌های انتهایی." },
        { label: "استفاده روی C=O", detail: "R⁻ به کربونیل‌ها حمله می‌کند ← پس از کارِ پایانی، الکل با اسکلت کربنی جدید: فرمالدهید ← نوع اول، آلدهیدهای دیگر ← نوع دوم، کتون‌ها ← نوع سوم. پیوندزن C–C." },
      ],
      keyPoints: [
        "پیوند C–Mg قطبی است با C δ− — کربن مثل کربانیون رفتار می‌کند.",
        "شیشهٔ خشک، اتر خشک، پوشش نیتروژن — رطوبت دشمن است.",
        "گرینیار + CO₂ ← کربوکسیلیک اسید (ترفند یک‌کربنی کردن زنجیره).",
      ],
      conditions: "برادهٔ Mg، Et₂O/THF بدون آب، اتمسفر بی‌اثر؛ خاموشی با NH₄Cl آبی.",
    },
    examples: [
      { name: { en: "Formation", fa: "ساخت" }, equation: "CH3Br + Mg -> Et2O -> CH3MgBr" },
      { name: { en: "Destruction", fa: "نابودی" }, equation: "CH3MgBr + H2O -> CH4 + Mg(OH)Br" },
    ],
    related: ["ch12-grignard-methane", "ch12-grignard-h2o-quench"],
  },
];
