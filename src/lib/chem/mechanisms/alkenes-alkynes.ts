import type { Mechanism } from "./types";

/** Alkenes & alkynes — addition reactions (Persian lecture notes: «واکنش‌های افزایشی» + McMurry ch. 7–8). */
export const ALKENE_MECHANISMS: Mechanism[] = [
  {
    id: "alkene-hx",
    family: "electrophilic-addition",
    topic: "alkenes",
    source: { en: "McMurry ch. 8 · lecture notes (additions)", fa: "مک‌موری فصل ۸ · جزوهٔ واکنش‌های افزایشی" },
    tags: {
      en: ["Markovnikov", "carbocation", "HX"],
      fa: ["مارکوفنیکوف", "کاتیون", "HX"],
    },
    en: {
      title: "Addition of HX to an alkene",
      summary:
        "The π bond attacks the proton first (slow, rate-determining), giving the more stable carbocation; the halide then captures it. Regiochemistry follows Markovnikov: H goes to the carbon that already has more hydrogens.",
      general: "C=C + H–X → C–C(H)(X)",
      steps: [
        { label: "Step 1 — protonation", detail: "The electron-rich π bond donates to H⁺. Of the two possible carbocations, the more substituted one (2° > 1°, stabilized by hyperconjugation) forms preferentially — this is the rate-determining step." },
        { label: "Step 2 — nucleophilic capture", detail: "X⁻ attacks the planar carbocation from either face, forming the C–X bond. Overall: π bond broken, H and X added across it." },
      ],
      keyPoints: [
        "Markovnikov's rule is really carbocation stability in disguise.",
        "Rearrangements (hydride/methyl shifts) are possible when a more stable cation is one shift away.",
        "Peroxides invert the regiochemistry with HBr (Kharasch radical addition).",
      ],
      conditions: "Dry HX (HCl, HBr, HI), inert solvent; no catalyst needed — the alkene is nucleophilic enough.",
    },
    fa: {
      title: "افزایش HX به آلکن",
      summary:
        "ابتدا پی π به پروتون حمله می‌کند (مرحلهٔ کند و تعیین‌کنندهٔ سرعت) و پایدارترین کاتیون ساخته می‌شود؛ سپس هالید آن را شکار می‌کند. جهت‌گیری طبق قاعدهٔ مارکوفنیکوف است: هیدروژن به کربنی می‌رود که هیدروژن بیشتری دارد.",
      general: "C=C + H–X → C–C(H)(X)",
      steps: [
        { label: "مرحلهٔ ۱ — پروتون‌گیری", detail: "الکترون‌های π به H⁺ داده می‌شوند. از میان دو کاتیون ممکن، کاتیون جای‌گرفته‌تر (۲° > ۱°، پایدارشده با ابرمزدوجی) ترجیحاً ساخته می‌شود — این همان مرحلهٔ کند است." },
        { label: "مرحلهٔ ۲ — شکار با هسته‌خواه", detail: "X⁻ به کاتیون تخت از هر دو سو حمله می‌کند و پی C–X می‌سازد. حاصل: پی π شکسته و H و X به دو کربن افزوده شده‌اند." },
      ],
      keyPoints: [
        "قاعدهٔ مارکوفنیکوف در واقع پوششی برای پایداری کاتیون است.",
        "وقتی کاتیون پایدارتر فقط یک جابه‌جایی فاصله دارد، بازآرایی (جابه‌جایی هیدرید/متیل) ممکن است.",
        "با پراکسیدها جهت‌گیری HBr برعکس می‌شود (افزایش رادیکالی کراش).",
      ],
      conditions: "HX خشک (HCl، HBr، HI) در حلال بی‌اثر؛ بدون کاتالیزور — خود آلکن به‌قدر کافی هسته‌خواه‌پسند است.",
    },
    examples: [
      { name: { en: "Ethene + HBr", fa: "اتن + HBr" }, equation: "CH2=CH2 + HBr → CH3CH2Br" },
      { name: { en: "Propene + HBr", fa: "پروپن + HBr" }, equation: "CH3-CH=CH2 + HBr → CH3-CHBr-CH3" },
    ],
    related: ["ch8-hbr-addition"],
  },
  {
    id: "alkene-x2",
    family: "electrophilic-addition",
    topic: "alkenes",
    source: { en: "McMurry ch. 8 · lecture notes (unsaturation test)", fa: "مک‌موری فصل ۸ · جزوهٔ واکنش‌های افزایشی" },
    tags: {
      en: ["bromonium ion", "anti addition", "test"],
      fa: ["یون برومونیوم", "افزایش پاد", "آزمون شناسایی"],
    },
    en: {
      title: "Halogenation — X₂ addition via halonium ion",
      summary:
        "The alkene polarizes X₂ and attacks it, forming a cyclic halonium (bromonium) ion; the halide then opens the ring from the backside. Net result: anti addition, stereospecific.",
      general: "C=C + Br2 → Br–C–C–Br (anti)",
      steps: [
        { label: "Step 1 — halonium formation", detail: "The π bond attacks one Br as Br–Br breaks; a three-membered bromonium ion with Br bridging both carbons forms. No free carbocation — that's why no rearrangement happens here." },
        { label: "Step 2 — backside ring opening", detail: "Br⁻ attacks a carbon from the face opposite the bridge (SN2-like), opening the ring. The two Br atoms end up anti (opposite faces)." },
      ],
      keyPoints: [
        "The color test: orange bromine decolorizes in seconds with alkenes — the classic unsaturation test.",
        "Anti stereochemistry: cyclohexene gives only trans-1,2-dibromocyclohexane.",
        "In water instead of CCl₄, the nucleophile is H₂O → halohydrin (bromo-alcohol).",
      ],
      conditions: "Br₂ or Cl₂ in CCl₄/CH₂Cl₂ at room temperature, dark (light promotes radical substitution).",
    },
    fa: {
      title: "هالوژن‌دار کردن — افزایش X۲ از مسیر یون هالونیوم",
      summary:
        "آلکن، X₂ را قطبی می‌کند و به آن حمله می‌کند تا یون حلقوی هالونیوم (برومونیوم) ساخته شود؛ سپس هالید حلقه را از پشت باز می‌کند. نتیجهٔ خالص: افزایش پاد و اکیداً وابسته به استریوکریمی.",
      general: "C=C + Br2 → Br–C–C–Br (پاد)",
      steps: [
        { label: "مرحلهٔ ۱ — ساخت هالونیوم", detail: "پی π به یک بروم حمله می‌کند و Br–Br می‌شکند؛ یون سه‌ضلعی برومونیوم با پل بروم روی دو کربن شکل می‌گیرد. کاتیون آزاد وجود ندارد — برای همین بازآرایی رخ نمی‌دهد." },
        { label: "مرحلهٔ ۲ — باز شدن حلقه از پشت", detail: "Br⁻ از سمت مخالف پل (شبیه SN2) به یکی از کربن‌ها حمله می‌کند و حلقه را باز می‌کند. دو اتم بروم در نهایت پاد (روی دو روی مخالف) قرار می‌گیرند." },
      ],
      keyPoints: [
        "آزمون رنگی معروف: محلول نارنجی بروم در چند ثانیه با آلکن بی‌رنگ می‌شود — آزمون کلاسیک اشباع‌نبودن.",
        "استریوکریمی پاد: سیکلوهگزن فقط ترانس-۱٬۲-دی‌بروموسیکلوهگزان می‌دهد.",
        "اگر به‌جای CCl۴ حلال آب باشد، هسته‌خواه H₂O است و هالوهیدرین (برومو-الکل) ساخته می‌شود.",
      ],
      conditions: "Br₂ یا Cl₂ در CCl₄/CH₂Cl₂ در دمای اتاق، در تاریکی (نور، جانشینی رادیکالی را تشویق می‌کند).",
    },
    examples: [
      { name: { en: "Bromine water test", fa: "آزمون آب بروم" }, equation: "CH2=CH2 + Br2 → CH2Br-CH2Br" },
      { name: { en: "Cyclohexene (anti)", fa: "سیکلوهگزن (پاد)" }, equation: "C6H10 + Br2 → trans-1,2-dibromocyclohexane" },
    ],
    related: ["ch8-bromine-water"],
  },
  {
    id: "alkene-hydration",
    family: "electrophilic-addition",
    topic: "alkenes",
    source: { en: "McMurry ch. 8 · lecture notes", fa: "مک‌موری فصل ۸ · جزوهٔ واکنش‌های افزایشی" },
    tags: {
      en: ["Markovnikov", "acid catalyst", "alcohol"],
      fa: ["مارکوفنیکوف", "کاتالیزور اسیدی", "الکل"],
    },
    en: {
      title: "Acid-catalyzed hydration",
      summary:
        "Water adds across the double bond with the acid as a true catalyst: protonation → carbocation → water attack → deprotonation. The proton that starts the cycle is regenerated at the end. Markovnikov orientation.",
      general: "C=C + H2O --(H+)--> C–C(OH)(H)",
      steps: [
        { label: "Step 1 — protonation of the π bond", detail: "H₃O⁺ (or H₂SO₄) protonates the alkene; the more stable carbocation forms — Markovnikov." },
        { label: "Step 2 — water attacks", detail: "H₂O attacks the planar carbocation, giving an oxonium ion." },
        { label: "Step 3 — deprotonation", detail: "Another water molecule pulls off the extra proton, regenerating the acid catalyst and delivering the alcohol." },
      ],
      keyPoints: [
        "The acid is a catalyst — consumed in step 1, regenerated in step 3.",
        "Carbocation intermediate → rearrangements possible.",
        "Reverse of alcohol dehydration (Le Chatelier decides which way: water excess → hydration; heat + concentrated acid → dehydration).",
      ],
      conditions: "Dilute H₂SO₄/H₃PO₄; industrial: phosphoric acid beds, ~300 °C, 60–70 atm for ethene → ethanol.",
    },
    fa: {
      title: "آبدوستی کاتالیز‌شده با اسید",
      summary:
        "آب با کمک اسید (که اینجا کاتالیزور واقعی است) روی پی دوگانه اضافه می‌شود: پروتون‌گیری ← کاتیون ← حملهٔ آب ← جدا شدن پروتون. پروتونی که چرخه را شروع کرد، آخر دوباره آزاد می‌شود. جهت‌گیری مارکوفنیکوف.",
      general: "C=C + H2O --(H+)--> C–C(OH)(H)",
      steps: [
        { label: "مرحلهٔ ۱ — پروتون‌گیری از پی π", detail: "H₃O⁺ (یا H₂SO₄) به آلکن پروتون می‌دهد؛ پایدارترین کاتیون ساخته می‌شود — مارکوفنیکوف." },
        { label: "مرحلهٔ ۲ — حملهٔ آب", detail: "آب به کاتیون تخت حمله می‌کند و یون اکسونیوم می‌سازد." },
        { label: "مرحلهٔ ۳ — جدا کردن پروتون", detail: "یک مولکول آب دیگر پروتون اضافی را برمی‌دارد؛ کاتالیزور اسید بازیابی و الکل تحویل داده می‌شود." },
      ],
      keyPoints: [
        "اسید کاتالیزور است — در مرحلهٔ ۱ مصرف و در مرحلهٔ ۳ بازیابی می‌شود.",
        "میان‌واسط کاتیونی است، پس بازآرایی ممکن است.",
        "معکوسِ آب‌گیری الکل است (لو شاتلیه جهت را تعیین می‌کند: آب فراوان ← افزایش؛ گرما + اسید غلیظ ← حذف).",
      ],
      conditions: "H₂SO₄/H₃PO₄ رقیق؛ صنعتی: بستر اسید فسفریک، حدود ۳۰۰ درجه و ۶۰–۷۰ اتمسفر برای اتن ← اتانول.",
    },
    examples: [
      { name: { en: "Ethene → ethanol", fa: "اتن ← اتانول" }, equation: "CH2=CH2 + H2O -> H3PO4 -> CH3CH2OH" },
      { name: { en: "Propene → 2-propanol", fa: "پروپن ← ۲-پروپانول" }, equation: "CH3-CH=CH2 + H2O -> CH3-CHOH-CH3" },
    ],
    related: ["ch8-hydration"],
  },
  {
    id: "alkene-kmn04-syn",
    family: "redox",
    topic: "alkenes",
    source: { en: "McMurry ch. 8 · Wagner/Baeyer (lecture notes)", fa: "مک‌موری فصل ۸ · واگنر/بایر (جزوه‌ها)" },
    tags: {
      en: ["syn diol", "Baeyer test", "KMnO4"],
      fa: ["دی‌ال سین", "آزمون بایر", "KMnO4"],
    },
    en: {
      title: "Syn dihydroxylation — cold dilute KMnO₄ (Baeyer/Wagner)",
      summary:
        "Permanganate adds two OH groups to the SAME face of the π bond through a cyclic manganate ester; Mn(VII) falls to Mn(IV) as brown MnO₂. Doubles as the Baeyer unsaturation test.",
      general: "C=C + [O] + H2O -> HO–C–C–OH (syn) + MnO2",
      steps: [
        { label: "Step 1 — manganate ester", detail: "The π bond attacks MnO₄⁻; a five-membered cyclic ester with two C–O–Mn bonds forms on one face of the double bond." },
        { label: "Step 2 — hydrolysis + reduction", detail: "Water breaks the Mn–O bonds; both OH groups stay on the same face (cis/syn). Mn(VII) is reduced to brown MnO₂ precipitate." },
      ],
      keyPoints: [
        "Purple → colorless + brown sludge = positive Baeyer test (a double bond was there).",
        "Hot or concentrated KMnO₄ does the opposite: oxidative CLEAVAGE of the C=C to carbonyls/acids.",
        "A staple of Iranian entrance exams: 1-butene → 1,2-butanediol (Wagner oxidation).",
      ],
      conditions: "Cold (0–25 °C), dilute, mildly basic KMnO₄. OsO₄ gives the same syn diol, even milder and more expensive.",
    },
    fa: {
      title: "دی‌هیدروکسیل‌کردن سین — KMnO₄ سرد و رقیق (بایر/واگنر)",
      summary:
        "پرمنگنات از طریق استر حلقوی منگنات، دو گروه OH را به یک رویِ پی π اضافه می‌کند؛ Mn(VII) به Mn(IV) رسوب قهوه‌ای MnO₂ کاهش می‌یابد. هم‌زمان آزمون بایر برای شناسایی پی دوگانه است.",
      general: "C=C + [O] + H2O -> HO–C–C–OH (سین) + MnO2",
      steps: [
        { label: "مرحلهٔ ۱ — استر منگنات", detail: "پی π به MnO₄⁻ حمله می‌کند؛ استر حلقه‌ای پنج‌ضلعی با دو پی C–O–Mn روی یک رویِ پی دوگانه ساخته می‌شود." },
        { label: "مرحلهٔ ۲ — هیدرولیز و کاهش", detail: "آب پی‌های Mn–O را می‌شکند؛ هر دو OH روی همان روی می‌مانند (سین). Mn(VII) به رسوب قهوه‌ای MnO₂ کاهش می‌یابد." },
      ],
      keyPoints: [
        "بنفش ← بی‌رنگ + لجن قهوه‌ای = آزمون بایر مثبت (پی دوگانه وجود داشته).",
        "KMnO₄ گرم یا غلیظ برعکس عمل می‌کند: شکست اکسایشی C=C به کربونیل/اسید.",
        "سؤال همیشگی کنکورهای ایران: ۱-بوتن ← ۱٬۲-بوتان‌دی‌اول (اکسایش واگنر).",
      ],
      conditions: "KMnO₄ سرد (۰–۲۵ درجه)، رقیق و کمی بازی. OsO₄ همان دی‌اول سین را ملایم‌تر (و گران‌تر) می‌دهد.",
    },
    examples: [
      { name: { en: "Ethene → ethylene glycol", fa: "اتن ← اتیلن گلیکول" }, equation: "CH2=CH2 + KMnO4 + H2O -> CH2OH-CH2OH + MnO2 + KOH" },
      { name: { en: "1-Butene → 1,2-butanediol", fa: "۱-بوتن ← ۱٬۲-بوتان‌دی‌اول" }, equation: "CH2=CH-CH2-CH3 + KMnO4 -> CH2OH-CHOH-CH2-CH3" },
    ],
    related: ["ch8-kmn04-diol", "ch8-wagner-butene"],
  },
  {
    id: "alkene-ozonolysis",
    family: "redox",
    topic: "alkenes",
    source: { en: "McMurry ch. 8", fa: "مک‌موری فصل ۸" },
    tags: {
      en: ["ozonide", "cleavage", "structure proof"],
      fa: ["اوزونید", "شکستن", "تعیین ساختار"],
    },
    en: {
      title: "Ozonolysis — cutting the C=C",
      summary:
        "Ozone adds to the double bond as a molozonide which rearranges to an ozonide; reductive workup then splits the C–C completely, turning each alkene carbon into a carbonyl. The molecule's skeleton is revealed by its fragments.",
      general: "C=C + O3 -> (ozonide) -> 2 C=O",
      steps: [
        { label: "Step 1 — cycloaddition", detail: "Ozone adds across the C=C in one concerted 1,3-dipolar step → unstable molozonide." },
        { label: "Step 2 — rearrangement", detail: "The molozonide fragments and recombines into the more stable ozonide." },
        { label: "Step 3 — workup", detail: "Zn/H₂O or (CH₃)₂S reduces the ozonide → two carbonyl compounds (aldehydes/ketones). H₂O₂ workup oxidizes aldehydes further to acids." },
      ],
      keyPoints: [
        "Structural-diagnosis tool: identify the carbonyl fragments, rejoin the C=O carbons — that was the double bond.",
        "Ethene gives formaldehyde only; each substituted carbon gives its own aldehyde/ketone.",
        "O₃ is toxic and a strong oxidizer — hood only.",
      ],
      conditions: "O₃ in CH₂Cl₂ at −78 °C, then Zn/H₂O (reductive) or H₂O₂ (oxidative) workup.",
    },
    fa: {
      title: "اوزونولیز — بریدن پی C=C",
      summary:
        "اوزون به پی دوگانه اضافه می‌شود و مولواوزونید می‌سازد که به اوزونید پایدارتر بازآرایی می‌شود؛ سپس در کارِ بعدی، پی C–C کاملاً شکسته و هر کربن آلکنی به کربونیل تبدیل می‌شود. اسکلت مولکول از تکه‌هایش آشکار می‌شود.",
      general: "C=C + O3 -> (اوزونید) -> 2 C=O",
      steps: [
        { label: "مرحلهٔ ۱ — سیکلودبیست", detail: "اوزون در یک گام هم‌زمان ۱٬۳-دوقطبی روی C=C می‌نشیند ← مولواوزونید ناپایدار." },
        { label: "مرحلهٔ ۲ — بازآرایی", detail: "مولواوزونید می‌شکند و دوباره به اوزونید پایدارتر ترکیب می‌شود." },
        { label: "مرحلهٔ ۳ — تکمیل واکنش", detail: "Zn/H₂O یا (CH₃)₂S اوزونید را کاهش می‌دهد ← دو ترکیب کربونیلی. با کارِ اکسایشی H₂O₂، آلدهیدها تا اسید اکسیده می‌شوند." },
      ],
      keyPoints: [
        "ابزار تشخیص ساختار: تکه‌های کربونیلی را شناسایی کنید و کربن‌های C=O را به هم بچسبانید — همان جای پی دوگانه بود.",
        "اتن فقط فرمالدهید می‌دهد؛ هر کربن جای‌گرفته، آلدهید/کتون مخصوص خودش را می‌دهد.",
        "O₃ سمی و اکسایندهٔ قوی است — فقط زیر هود.",
      ],
      conditions: "O₃ در CH₂Cl₂ در ۷۸- درجه، سپس کارِ کاهشی Zn/H₂O یا اکسایشی H₂O₂.",
    },
    examples: [
      { name: { en: "Ethene → formaldehyde", fa: "اتن ← فرمالدهید" }, equation: "CH2=CH2 + O3 -> 2 HCHO" },
      { name: { en: "2-Butene → acetaldehyde", fa: "۲-بوتن ← استالدهید" }, equation: "CH3-CH=CH-CH3 + O3 -> 2 CH3CHO" },
    ],
    related: ["ch8-ozonolysis-ethene"],
  },
  {
    id: "alkene-hydrogenation",
    family: "redox",
    topic: "alkenes",
    source: { en: "McMurry ch. 7 · lecture notes", fa: "مک‌موری فصل ۷ · جزوه‌ها" },
    tags: {
      en: ["surface catalysis", "syn", "H2"],
      fa: ["کاتالیز سطحی", "سین", "H2"],
    },
    en: {
      title: "Catalytic hydrogenation",
      summary:
        "H₂ and the alkene both adsorb onto a metal surface (Pd, Pt, Ni); the H–H bond splits into metal hydrides which are delivered to the same face of the C=C. Syn addition, no carbocation.",
      general: "C=C + H2 --(Pd/C)--> C–C(H)(H)",
      steps: [
        { label: "Step 1 — adsorption", detail: "Both π bond and H₂ stick to the metal surface, weakening their own bonds." },
        { label: "Step 2 — surface delivery", detail: "Two surface hydrogens are handed to the two alkene carbons from the same face (syn) as the C=C becomes C–C." },
        { label: "Step 3 — desorption", detail: "The saturated alkane lets go of the surface; catalyst is unchanged." },
      ],
      keyPoints: [
        "Heterogeneous catalysis — happens ON the metal, not in solution.",
        "Stereochemistry: syn (both H same face) — critical for rings.",
        "For alkynes, Lindlar's poisoned catalyst stops at the cis-alkene; Na/NH₃(l) gives the trans-alkene.",
      ],
      conditions: "Pd/C, PtO₂ or Raney Ni; 1 atm H₂ for most alkenes, higher T/P for alkynes and aromatics.",
    },
    fa: {
      title: "هیدروژن‌دار کردن کاتالیزی",
      summary:
        "H₂ و آلکن هر دو روی سطح فلز (Pd، Pt، Ni) جذب می‌شوند؛ پی H–H روی سطح به هیدریدهای فلزی تبدیل و از یک روی به C=C تحویل داده می‌شود. افزایش سین و بدون کاتیون.",
      general: "C=C + H2 --(Pd/C)--> C–C(H)(H)",
      steps: [
        { label: "مرحلهٔ ۱ — جذب سطحی", detail: "هم پی π و هم H₂ به سطح فلز می‌چسبند و پی‌های خودشان سست می‌شود." },
        { label: "مرحلهٔ ۲ — تحویل سطحی", detail: "دو هیدروژنِ سطحی از یک روی به دو کربن آلکن داده می‌شوند (سین) و C=C به C–C تبدیل می‌شود." },
        { label: "مرحلهٔ ۳ — رهایی", detail: "آلکان اشباع از سطح جدا می‌شود؛ کاتالیزور دست‌نخورده باقی می‌ماند." },
      ],
      keyPoints: [
        "کاتالیز ناهمگن — روی سطح فلز رخ می‌دهد، نه در محلول.",
        "استریوکریمی: سین (هر دو H از یک روی) — برای حلقه‌ها حیاتی.",
        "برای آلکین‌ها، کاتالیزور مسموم لیندلر در مرحلهٔ سیس-آلکن می‌ایستد؛ Na/NH₃ مایع ترانس-آلکن می‌دهد.",
      ],
      conditions: "Pd/C، PtO₂ یا نیکل رانی؛ برای بیشتر آلکن‌ها ۱ اتمسفر H₂؛ برای آلکین‌ها و آروماتیک‌ها دما/فشار بیشتر.",
    },
    examples: [
      { name: { en: "Ethene → ethane", fa: "اتن ← اتان" }, equation: "CH2=CH2 + H2 -> Pd/C -> CH3-CH3" },
      { name: { en: "Ethyne + Lindlar → cis-ethene", fa: "اتین + لیندلر ← سیس-اتن" }, equation: "HC≡CH + H2 -> Lindlar -> CH2=CH2 (cis)" },
    ],
    related: ["ch7-hydrogenation", "ch8-alkyne-hydrogenation"],
  },
  {
    id: "alkene-radical-hbr",
    family: "radical",
    topic: "alkenes",
    source: { en: "McMurry ch. 8 (Kharasch effect)", fa: "مک‌موری فصل ۸ (اثر کراش)" },
    tags: {
      en: ["anti-Markovnikov", "peroxides", "chain"],
      fa: ["پاد-مارکوفنیکوف", "پراکسیدها", "زنجیره"],
    },
    en: {
      title: "Radical addition of HBr (peroxide effect)",
      summary:
        "With peroxides, HBr adds by a radical chain instead of ions. The Br· radical adds to the alkene first, building the MORE stable carbon radical — which puts Br on the less substituted carbon: anti-Markovnikov.",
      general: "C=C + HBr --(ROOR)--> anti-Markovnikov bromide",
      steps: [
        { label: "Initiation", detail: "RO–OR splits homolytically (heat/light) → RO· which abstracts H from HBr → Br·." },
        { label: "Propagation 1", detail: "Br· adds to the alkene carbon so that the MORE stable (more substituted) radical forms — Br ends up on the less substituted carbon." },
        { label: "Propagation 2", detail: "The carbon radical abstracts H from another HBr → product + fresh Br·. Chain continues." },
        { label: "Termination", detail: "Two radicals combine — chain stops." },
      ],
      keyPoints: [
        "Works ONLY with HBr — HCl and HI have energetically unfavorable propagation steps.",
        "Thermodynamic coin-flip: ion route (Markovnikov) vs radical route (anti) — the reagent mix decides.",
        "Kharasch effect, discovered 1933 — one of the first 'reagent decides mechanism' lessons.",
      ],
      conditions: "HBr + peroxides (ROOR), hν or Δ; anhydrous.",
    },
    fa: {
      title: "افزایش رادیکالی HBr (اثر پراکسید)",
      summary:
        "در حضور پراکسیدها، HBr با زنجیرهٔ رادیکالی (نه یونی) اضافه می‌شود. ابتدا رادیکال Br· به آلکن اضافه می‌شود و رادیکال کربنی پایدارتر می‌سازد — پس بروم روی کربن کم‌جانشین‌تر می‌نشیند: پاد-مارکوفنیکوف.",
      general: "C=C + HBr --(ROOR)--> برومید پاد-مارکوفنیکوف",
      steps: [
        { label: "شروع", detail: "RO–OR با گرما/نور همگن می‌شکند ← RO· که از HBr پروتون می‌رباید ← Br·." },
        { label: "رشد ۱", detail: "Br· به کربنی از آلکن می‌نشیند که رادیکال جای‌گرفته‌تر (پایدارتر) بسازد — پس بروم روی کربن کم‌جانشین می‌ماند." },
        { label: "رشد ۲", detail: "رادیکال کربنی از HBr دیگری هیدروژن می‌رباید ← محصول + Br· تازه. زنجیره ادامه می‌یابد." },
        { label: "پایان", detail: "دو رادیکال ترکیب می‌شوند — زنجیره قطع می‌شود." },
      ],
      keyPoints: [
        "فقط با HBr کار می‌کند — گام‌های رشد HCl و HI از نظر انرژی نامساعدند.",
        "سکهٔ دوسر: مسیر یونی (مارکوفنیکوف) یا رادیکالی (پاد) — ترکیب واکنش‌دهنده‌ها مسیر را انتخاب می‌کند.",
        "اثر کراش (۱۹۳۳) — یکی از اولین درس‌های «واکنش‌دهنده سازوکار را تعیین می‌کند».",
      ],
      conditions: "HBr + پراکسید (ROOR)، نور یا گرما؛ خشک.",
    },
    examples: [
      { name: { en: "Propene + HBr/ROOR", fa: "پروپن + HBr/ROOR" }, equation: "CH3-CH=CH2 + HBr -> ROOR -> CH3-CH2-CH2Br" },
    ],
    related: [],
  },
  {
    id: "alkene-hydroboration",
    family: "electrophilic-addition",
    topic: "alkenes",
    source: { en: "McMurry ch. 8", fa: "مک‌موری فصل ۸" },
    tags: {
      en: ["anti-Markovnikov", "syn", "BH3"],
      fa: ["پاد-مارکوفنیکوف", "سین", "BH3"],
    },
    en: {
      title: "Hydroboration–oxidation",
      summary:
        "BH₃ adds H and BH₂ across the C=C in one concerted four-center step (syn, no carbocation); oxidation with H₂O₂/OH⁻ replaces B by OH. Net: anti-Markovnikov alcohol.",
      general: "C=C + BH3; H2O2/OH- -> anti-Markovnikov alcohol",
      steps: [
        { label: "Step 1 — concerted hydroboration", detail: "B (electrophile) and H deliver simultaneously through a four-membered transition state. B goes to the LESS substituted carbon (sterics + electronics); H and B add syn." },
        { label: "Step 2 — oxidation", detail: "HOO⁻ attacks boron; a 1,2-alkyl migration moves the alkyl from B to O; hydrolysis releases the alcohol, retaining configuration." },
      ],
      keyPoints: [
        "The clean way to get anti-Markovnikov hydration WITHOUT rearrangements (no carbocation ever exists).",
        "Syn stereochemistry — with rings, both H and OH end up on the same face.",
        "BH₃ does three alkenes before it stops (trialkylborane).",
      ],
      conditions: "BH₃·THF (or 9-BBN) at 0–25 °C; then H₂O₂, NaOH.",
    },
    fa: {
      title: "هیدروبوراسیون–اکسایش",
      summary:
        "BH₃ در یک گام هم‌زمان چهارمرکزی (سین و بدون کاتیون) H و BH₂ روی C=C می‌گذارد؛ سپس اکسایش با H₂O₂/OH⁻ بور را به OH تبدیل می‌کند. حاصل: الکل پاد-مارکوفنیکوف.",
      general: "C=C + BH3; H2O2/OH- -> الکل پاد-مارکوفنیکوف",
      steps: [
        { label: "مرحلهٔ ۱ — هیدروبوراسیون هم‌زمان", detail: "بور (الکترون‌خواه) و هیدروژن هم‌زمان از حالت گذار چهارجانبه اضافه می‌شوند. بور روی کربن کم‌جانشین‌تر می‌نشیند (عوامل فضایی + الکترونی)؛ H و B سین اضافه می‌شوند." },
        { label: "مرحلهٔ ۲ — اکسایش", detail: "HOO⁻ به بور حمله می‌کند؛ مهاجرت ۱٬۲-آلکیلی گروه آلکیل را از B به O منتقل می‌کند و هیدرولیز، الکل را با حفظ پیکربندی آزاد می‌کند." },
      ],
      keyPoints: [
        "راه تمیزِ گرفتن الکل پاد-مارکوفنیکوف بدون بازآرایی (هیچ کاتیونی وجود ندارد).",
        "استریوکریمی سین — در حلقه‌ها H و OH به یک روی می‌روند.",
        "BH₃ پیش از توقف، سه آلکن را هیدروبوره می‌کند (تری‌آلکیل‌بوران).",
      ],
      conditions: "BH₃·THF (یا 9-BBN) در ۰–۲۵ درجه؛ سپس H₂O₂ و NaOH.",
    },
    examples: [
      { name: { en: "Propene → 1-propanol", fa: "پروپن ← ۱-پروپانول" }, equation: "CH3-CH=CH2 -> BH3; H2O2/OH- -> CH3-CH2-CH2OH" },
    ],
    related: [],
  },
  {
    id: "alkyne-chemistry",
    family: "electrophilic-addition",
    topic: "alkynes",
    source: { en: "McMurry ch. 8–9 · lecture notes", fa: "مک‌موری فصول ۸–۹ · جزوه‌ها" },
    tags: {
      en: ["two equivalents", "Lindlar", "acetylide"],
      fa: ["دو هم‌ارز", "لیندلر", "استیلید"],
    },
    en: {
      title: "Alkyne additions — twice the π, twice the chemistry",
      summary:
        "Alkynes undergo the same electrophilic additions as alkenes but take TWO equivalents; with poisoned catalysts you can stop at the alkene. Terminal alkynes are also weak acids — their acetylides are carbon nucleophiles.",
      general: "C≡C + 2 HX -> CX2–CHX2   |   R–C≡CH + NaNH2 -> R–C≡C⁻",
      steps: [
        { label: "Step 1 — first addition", detail: "Electrophilic addition through a vinyl carbocation/halonium — slower than alkenes (vinyl cations are unstable). Markovnikov still governs HX additions." },
        { label: "Step 2 — second addition", detail: "The resulting alkene (or geminal dihalide after 2 X₂/HX) adds again. Controlling the stoichiometry controls the product." },
        { label: "Side door — acetylide chemistry", detail: "Terminal ≡C–H (pKa ≈ 25) is deprotonated by NaNH₂; the acetylide SN2s onto primary halides — the standard way to build longer carbon chains." },
      ],
      keyPoints: [
        "Full hydrogenation (Pd/C): alkane. Lindlar: cis-alkene. Na/NH₃(l): trans-alkene (radical-anion mechanism).",
        "Hydration (Hg²⁺/H₂SO₄) gives an enol → tautomerizes to a KETONE (Markovnikov).",
        "Hydroboration–oxidation of terminal alkynes → ALDEHYDE (the anti-Markovnikov carbonyl).",
      ],
      conditions: "HgSO₄/H₂SO₄ for hydration; Lindlar Pd/BaSO₄/quinoline for partial hydrogenation; NaNH₂ in NH₃(l) for acetylides.",
    },
    fa: {
      title: "افزایش‌های آلکین — دو π، دو برابر شیمی",
      summary:
        "آلکین‌ها همان افزایش‌های الکترون‌خواهی آلکن‌ها را دارند اما دو هم‌ارز مصرف می‌کنند؛ با کاتالیزور مسموم می‌توان در مرحلهٔ آلکن توقف کرد. آلکین‌های انتهایی همچنین اسید ضعیف‌اند و استیلیدهایشان هسته‌خواه کربنی است.",
      general: "C≡C + 2 HX -> CX2–CHX2   |   R–C≡CH + NaNH2 -> R–C≡C⁻",
      steps: [
        { label: "مرحلهٔ ۱ — اولین افزایش", detail: "افزایش الکترون‌خواهی از مسیر کاتیون وینیل/هالونیوم — کندتر از آلکن‌ها (کاتیون وینیل ناپایدار است). در افزایش HX همچنان مارکوفنیکوف حاکم است." },
        { label: "مرحلهٔ ۲ — دومین افزایش", detail: "آلکن حاصل (یا دی‌هالید جوهری پس از ۲ X₂/HX) دوباره اضافه می‌شود. کنترل استوکیومتری، محصول را کنترل می‌کند." },
        { label: "درِ کناری — شیمی استیلید", detail: "≡C–H انتهایی (pKa ≈ ۲۵) با NaNH₂ دی‌پروتونه می‌شود؛ استیلید با SN2 روی هالیدهای نوع اول می‌نشیند — راه استاندارد بلند کردن زنجیرهٔ کربنی." },
      ],
      keyPoints: [
        "هیدروژن‌دار کردن کامل (Pd/C): آلکان. لیندلر: سیس-آلکن. Na/NH₃ مایع: ترانس-آلکن (سازوکار رادیکال-آنیون).",
        "آب‌دوستی (Hg²⁺/H₂SO₄) انول می‌دهد ← تائوتومری به کتون (مارکوفنیکوف).",
        "هیدروبوراسیون–اکسایش آلکین انتهایی ← آلدهید (کربونیل پاد-مارکوفنیکوف).",
      ],
      conditions: "برای آب‌دوستی HgSO₄/H₂SO₄؛ برای هیدروژن‌دار کردن جزئی لیندلر Pd/BaSO₄/کینولین؛ برای استیلیدها NaNH₂ در NH₃ مایع.",
    },
    examples: [
      { name: { en: "Ethyne + 2 HBr", fa: "اتین + 2 HBr" }, equation: "HC≡CH + 2 HBr -> CHBr2-CH3" },
      { name: { en: "Acetylide alkylation", fa: "آلکیل‌دار کردن استیلید" }, equation: "HC≡C⁻ + CH3Br -> HC≡C-CH3" },
    ],
    related: ["ch8-alkyne-hydrogenation"],
  },
];
