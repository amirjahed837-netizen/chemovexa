import type { MechanismDiagram } from "./diagram-types";

/** Static mechanism data; see README.md for renderer and projection assumptions. */
export const ACYL_DIAGRAMS: Record<string, MechanismDiagram> = {
  "acyl-substitution-general": {
    "title": {
      "en": "Nucleophilic acyl substitution",
      "fa": "استخلاف هسته‌خواهی آسیل"
    },
    "footnote": {
      "en": "Methoxide adds to acetyl chloride, forming a tetrahedral intermediate; oxygen then reforms C=O as chloride leaves. This addition-elimination differs from ordinary aldehyde/ketone addition because an acyl leaving group is present. Typical derivative reactivity decreases from acid chloride to anhydride to ester to amide, but protonation, nucleophile and conditions determine the actual leaving group.",
      "fa": "متوکسید به استیل‌کلرید اضافه می‌شود و میانجی چهاروجهی می‌سازد؛ سپس اکسیژن ⁦C=O⁩ را بازمی‌سازد و کلرید خارج می‌شود. وجود گروه خارج‌شوندهٔ آسیلی، این افزایش-حذف را از افزایش معمول به آلدهید یا کتون متمایز می‌کند. واکنش‌پذیری معمول مشتق‌ها از اسیدکلرید به انیدرید، استر و آمید کاهش می‌یابد، اما پروتون‌گیری، هسته‌خواه و شرایط، گروه خارج‌شوندهٔ واقعی را تعیین می‌کنند."
    },
    "frames": [
      {
        "caption": {
          "en": "Methoxide attacks the acyl carbon.",
          "fa": "متوکسید به کربن آسیل حمله می‌کند."
        },
        "atoms": [
          {"id": "c", "el": "C", "x": 230, "y": 90, "charge": "δ+"},
          {"id": "o", "el": "O", "x": 230, "y": 18, "charge": "δ−", "lp": {"n": 2, "angles": [105, 240]}},
          {"id": "r", "el": "CH₃", "x": 167.646, "y": 126.0},
          {"id": "g", "el": "Cl", "x": 292.354, "y": 126.0, "lp": {"n": 3, "angles": [120, 30, 210]}},
          {"id": "nu", "el": "OCH₃", "x": 330, "y": 65, "charge": "−", "lp": {"n": 3, "angles": [150, 0, 210]}}
        ],
        "bonds": [
          {"a": "c", "b": "o", "order": 2},
          {"a": "c", "b": "r"},
          {"a": "c", "b": "g"},
          {"a": "nu", "b": "c", "dash": true}
        ],
        "curves": [
          {"from": "nu", "to": "c", "bulge": -28},
          {"from": "bond:c:o", "to": "o", "bulge": -26}
        ]
      },
      {
        "caption": {
          "en": "O forms C=O; chloride leaves.",
          "fa": "اکسیژن ⁦C=O⁩ می‌سازد و کلرید می‌رود."
        },
        "atoms": [
          {"id": "c", "el": "C", "x": 230, "y": 90, "bare": true},
          {"id": "o", "el": "O", "x": 230, "y": 18, "charge": "−", "lp": {"n": 3, "angles": [105, 240, 0]}},
          {"id": "r", "el": "CH₃", "x": 162.342, "y": 114.625},
          {"id": "g", "el": "Cl", "x": 297.658, "y": 114.625, "lp": {"n": 3, "angles": [105, 195, 15]}},
          {"id": "nu", "el": "OCH₃", "x": 230, "y": 162, "lp": {"n": 2, "angles": [180, 90]}}
        ],
        "bonds": [
          {"a": "c", "b": "o"},
          {"a": "c", "b": "r"},
          {"a": "c", "b": "g"},
          {"a": "c", "b": "nu"}
        ],
        "curves": [
          {"from": "o", "to": "bond:c:o", "bulge": 26},
          {"from": "bond:c:g", "to": "g", "bulge": -26}
        ]
      },
      {
        "caption": {
          "en": "Elimination gives methyl acetate and chloride.",
          "fa": "حذف، متیل‌استات و کلرید تولید می‌کند."
        },
        "atoms": [
          {"id": "c", "el": "C", "x": 230, "y": 90, "charge": "δ+"},
          {"id": "o", "el": "O", "x": 230, "y": 18, "charge": "δ−", "lp": {"n": 2, "angles": [105, 240]}},
          {"id": "r", "el": "CH₃", "x": 167.646, "y": 126.0},
          {"id": "g", "el": "OCH₃", "x": 292.354, "y": 126.0, "lp": {"n": 2, "angles": [120, 30]}},
          {"id": "cl", "el": "Cl", "x": 400, "y": 90, "charge": "−", "lp": {"n": 4, "angles": [180, 105, 255, 0]}}
        ],
        "bonds": [
          {"a": "c", "b": "o", "order": 2},
          {"a": "c", "b": "r"},
          {"a": "c", "b": "g"}
        ]
      }
    ],
    "connectors": ["→", "→"]
  },
  "acyl-fischer-esterification": {
    "title": {
      "en": "Fischer esterification with methanol",
      "fa": "استری‌شدن فیشر با متانول"
    },
    "footnote": {
      "en": "Carbonyl protonation enables methanol addition. Solvent-mediated proton transfer changes the acid OH into OH₂⁺ and neutralizes the incoming methanol oxygen; collapse expels water and gives protonated ester. Final deprotonation regenerates acid. OHCH₃ denotes O bonded internally to H and CH₃; when also bonded to acyl carbon it is oxonium. All steps are reversible; excess alcohol or water removal favors ester.",
      "fa": "پروتون‌گیری کربونیل، افزایش متانول را تسهیل می‌کند. انتقال پروتون با کمک حلال، ⁦OH⁩ اسید را به ⁦OH₂⁺⁩ تبدیل و اکسیژن متانول ورودی را خنثی می‌کند؛ فروریزش میانجی، آب را خارج می‌کند و استر پروتون‌گرفته می‌دهد. پروتون‌زدایی پایانی، اسید را بازتولید می‌کند. ⁦OHCH₃⁩ یعنی اکسیژن با ⁦H⁩ و ⁦CH₃⁩ داخلی؛ وقتی به کربن آسیل هم متصل باشد، اکسونیوم است. مراحل برگشت‌پذیرند و الکل اضافی یا خارج‌کردن آب، تشکیل استر را تقویت می‌کند."
    },
    "frames": [
      {
        "caption": {
          "en": "Hydronium protonates carbonyl O.",
          "fa": "هیدرونیوم به ⁦O⁩ کربونیل پروتون می‌دهد."
        },
        "atoms": [
          {"id": "c", "el": "C", "x": 230, "y": 90, "charge": "δ+"},
          {"id": "o", "el": "O", "x": 230, "y": 18, "charge": "δ−", "lp": {"n": 2, "angles": [105, 240]}},
          {"id": "r", "el": "CH₃", "x": 167.646, "y": 126.0},
          {"id": "g", "el": "OH", "x": 292.354, "y": 126.0, "lp": {"n": 2, "angles": [120, 30]}},
          {"id": "hp", "el": "H", "x": 332, "y": 18},
          {"id": "w", "el": "OH₂", "x": 404, "y": 18, "charge": "+", "lp": {"n": 1, "angles": [150]}}
        ],
        "bonds": [
          {"a": "c", "b": "o", "order": 2},
          {"a": "c", "b": "r"},
          {"a": "c", "b": "g"},
          {"a": "hp", "b": "w"}
        ],
        "curves": [
          {"from": "o", "to": "hp", "bulge": 28},
          {"from": "bond:hp:w", "to": "w", "bulge": 26}
        ]
      },
      {
        "caption": {
          "en": "Methanol attacks the activated carbonyl.",
          "fa": "متانول به کربونیل فعال‌شده حمله می‌کند."
        },
        "atoms": [
          {"id": "c", "el": "C", "x": 230, "y": 90, "charge": "δ+"},
          {"id": "o", "el": "OH", "x": 230, "y": 18, "charge": "+", "lp": {"n": 1, "angles": [105]}},
          {"id": "r", "el": "CH₃", "x": 167.646, "y": 126.0},
          {"id": "g", "el": "OH", "x": 292.354, "y": 126.0, "lp": {"n": 2, "angles": [120, 30]}},
          {"id": "nu", "el": "OCH₃", "x": 330, "y": 65, "lp": {"n": 2, "angles": [0, 180]}},
          {"id": "hm", "el": "H", "x": 402, "y": 65}
        ],
        "bonds": [
          {"a": "c", "b": "o", "order": 2},
          {"a": "c", "b": "r"},
          {"a": "c", "b": "g"},
          {"a": "nu", "b": "hm"},
          {"a": "nu", "b": "c", "dash": true}
        ],
        "curves": [
          {"from": "nu", "to": "c", "bulge": -28},
          {"from": "bond:c:o", "to": "o", "bulge": -26}
        ]
      },
      {
        "caption": {
          "en": "Addition creates an oxonium ion.",
          "fa": "افزایش، یون اکسونیوم می‌سازد."
        },
        "atoms": [
          {"id": "c", "el": "C", "x": 230, "y": 90, "bare": true},
          {"id": "o", "el": "OH", "x": 230, "y": 18, "lp": {"n": 2, "angles": [0, 90]}},
          {"id": "r", "el": "CH₃", "x": 162.342, "y": 114.625},
          {"id": "g", "el": "OH", "x": 297.658, "y": 114.625, "lp": {"n": 2, "angles": [105, 195]}},
          {"id": "nu", "el": "OHCH₃", "x": 230, "y": 162, "charge": "+", "lp": {"n": 1, "angles": [180]}}
        ],
        "bonds": [
          {"a": "c", "b": "o"},
          {"a": "c", "b": "r"},
          {"a": "c", "b": "g"},
          {"a": "c", "b": "nu"}
        ]
      },
      {
        "caption": {
          "en": "A proton relay prepares water to leave.",
          "fa": "انتقال پروتون، آب را آمادهٔ خروج می‌کند."
        },
        "atoms": [
          {"id": "c", "el": "C", "x": 230, "y": 90, "bare": true},
          {"id": "o", "el": "OH", "x": 230, "y": 18, "lp": {"n": 2, "angles": [0, 90]}},
          {"id": "r", "el": "CH₃", "x": 162.342, "y": 114.625},
          {"id": "g", "el": "OH₂", "x": 297.658, "y": 114.625, "charge": "+", "lp": {"n": 1, "angles": [165]}},
          {"id": "nu", "el": "OCH₃", "x": 230, "y": 162, "lp": {"n": 2, "angles": [180, 90]}}
        ],
        "bonds": [
          {"a": "c", "b": "o"},
          {"a": "c", "b": "r"},
          {"a": "c", "b": "g"},
          {"a": "c", "b": "nu"}
        ],
        "curves": [
          {"from": "o", "to": "bond:c:o", "bulge": 26},
          {"from": "bond:c:g", "to": "g", "bulge": -26}
        ],
        "labels": [
          {"x": 410, "y": 28, "text": "After proton transfer;", "size": 10, "color": "slate"},
          {"x": 410, "y": 42, "text": "collapse arrows shown", "size": 10, "color": "slate"}
        ]
      },
      {
        "caption": {
          "en": "Water deprotonates the protonated ester.",
          "fa": "آب از استر پروتون‌گرفته پروتون می‌گیرد."
        },
        "atoms": [
          {"id": "c", "el": "C", "x": 210, "y": 90, "bare": true},
          {"id": "o", "el": "O", "x": 210, "y": 18, "charge": "+", "lp": {"n": 1, "angles": [240]}},
          {"id": "hp", "el": "H", "x": 282, "y": 18},
          {"id": "w", "el": "OH₂", "x": 387, "y": 18, "lp": {"n": 2, "angles": [0, 180]}},
          {"id": "r", "el": "CH₃", "x": 147.646, "y": 126},
          {"id": "g", "el": "OCH₃", "x": 272.354, "y": 126, "lp": {"n": 2, "angles": [120, 30]}}
        ],
        "bonds": [
          {"a": "c", "b": "o", "order": 2},
          {"a": "o", "b": "hp"},
          {"a": "c", "b": "r"},
          {"a": "c", "b": "g"}
        ],
        "curves": [
          {"from": "w", "to": "hp", "bulge": -26},
          {"from": "bond:hp:o", "to": "o", "bulge": 28}
        ]
      },
      {
        "caption": {
          "en": "Ester forms and acid is regenerated.",
          "fa": "استر تشکیل و اسید بازتولید می‌شود."
        },
        "atoms": [
          {"id": "c", "el": "C", "x": 230, "y": 90, "charge": "δ+"},
          {"id": "o", "el": "O", "x": 230, "y": 18, "charge": "δ−", "lp": {"n": 2, "angles": [105, 240]}},
          {"id": "r", "el": "CH₃", "x": 167.646, "y": 126.0},
          {"id": "g", "el": "OCH₃", "x": 292.354, "y": 126.0, "lp": {"n": 2, "angles": [120, 30]}}
        ],
        "bonds": [
          {"a": "c", "b": "o", "order": 2},
          {"a": "c", "b": "r"},
          {"a": "c", "b": "g"}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "CH₃COOH + CH₃OH ⇌ CH₃COOCH₃ + H₂O", "size": 10, "color": "slate"}
        ]
      }
    ],
    "connectors": ["⇌", "⇌", "→several", "⇌", "⇌"]
  },
  "acyl-socl2-chloride": {
    "title": {
      "en": "Acid chloride formation with thionyl chloride",
      "fa": "تشکیل اسیدکلرید با تیونیل‌کلرید"
    },
    "footnote": {
      "en": "An oxygen-activation representation gives an acyl chlorosulfite, RCO-O-S(=O)Cl; the essential acyl C-O-S bridge is retained. Chloride adds to the acyl carbon, tetrahedral collapse expels chlorosulfite, and SO₂ formation regenerates chloride. Actual activation can involve carbonyl-oxygen attack and proton/oxygen bookkeeping equivalent to the OH-attack representation shown; conditions affect the detailed path. SOCl and OSOCl abbreviate intact fragments, not carbon-sulfur bonds.",
      "fa": "در نمایش فعال‌سازی از راه اکسیژن، آسیل‌کلروسولفیت ⁦RCO-O-S(=O)Cl⁩ تشکیل می‌شود؛ پل ضروری ⁦C-O-S⁩ حفظ شده است. کلرید به کربن آسیل اضافه می‌شود، فروریزش میانجی کلروسولفیت را خارج می‌کند و تشکیل ⁦SO₂⁩، کلرید را بازتولید می‌کند. فعال‌سازی واقعی می‌تواند با حملهٔ اکسیژن کربونیل و انتقال پروتون همراه باشد؛ نمایش حملهٔ ⁦OH⁩، مسیر هم‌ارزِ حسابداری اتصال‌ها را نشان می‌دهد و جزئیات به شرایط بستگی دارند. ⁦SOCl⁩ و ⁦OSOCl⁩ قطعه‌های فشرده‌اند، نه پیوند مستقیم کربن-گوگرد."
    },
    "frames": [
      {
        "caption": {
          "en": "A carboxyl oxygen attacks sulfur; chloride departs.",
          "fa": "اکسیژن کربوکسیل به گوگرد حمله می‌کند و کلرید جدا می‌شود."
        },
        "atoms": [
          {"id": "c", "el": "C", "x": 110, "y": 90, "bare": true},
          {"id": "o", "el": "O", "x": 110, "y": 18, "lp": {"n": 2, "angles": [0, 90]}},
          {"id": "r", "el": "CH₃", "x": 47.646, "y": 126},
          {"id": "oh", "el": "OH", "x": 172.354, "y": 126, "lp": {"n": 2, "angles": [195, 15]}},
          {"id": "s", "el": "SOCl", "x": 277.354, "y": 126},
          {"id": "cl", "el": "Cl", "x": 349.354, "y": 126, "lp": {"n": 3, "angles": [90, 0, 180]}}
        ],
        "bonds": [
          {"a": "c", "b": "o", "order": 2},
          {"a": "c", "b": "r"},
          {"a": "c", "b": "oh"},
          {"a": "s", "b": "cl"},
          {"a": "oh", "b": "s", "dash": true}
        ],
        "curves": [
          {"from": "oh", "to": "s", "bulge": -28},
          {"from": "bond:cl:s", "to": "cl", "bulge": -26}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "SOCl-Cl = SOCl₂; S=O and one S-Cl condensed", "size": 10, "color": "slate"}
        ]
      },
      {
        "caption": {
          "en": "Chloride removes H to give the acyl chlorosulfite.",
          "fa": "کلرید با گرفتن ⁦H⁩، آسیل‌کلروسولفیت را تشکیل می‌دهد."
        },
        "atoms": [
          {"id": "c", "el": "C", "x": 120, "y": 90, "bare": true},
          {"id": "o", "el": "O", "x": 120, "y": 18, "lp": {"n": 2, "angles": [0, 90]}},
          {"id": "r", "el": "CH₃", "x": 57.646, "y": 126},
          {"id": "bridge", "el": "O", "x": 182.354, "y": 126, "charge": "+", "lp": {"n": 1, "angles": [195]}},
          {"id": "s", "el": "SOCl", "x": 254.354, "y": 126},
          {"id": "hp", "el": "H", "x": 182.354, "y": 54},
          {"id": "cl", "el": "Cl", "x": 359.354, "y": 54, "charge": "−", "lp": {"n": 4, "angles": [180, 105, 255, 0]}}
        ],
        "bonds": [
          {"a": "c", "b": "o", "order": 2},
          {"a": "c", "b": "r"},
          {"a": "c", "b": "bridge"},
          {"a": "bridge", "b": "s"},
          {"a": "bridge", "b": "hp"}
        ],
        "curves": [
          {"from": "cl", "to": "hp", "bulge": -28},
          {"from": "bond:bridge:hp", "to": "bridge", "bulge": 26}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "→ RCO-O-S(=O)Cl + HCl", "size": 10, "color": "slate"}
        ]
      },
      {
        "caption": {
          "en": "Chloride attacks the acyl carbon.",
          "fa": "کلرید به کربن آسیل حمله می‌کند."
        },
        "atoms": [
          {"id": "c", "el": "C", "x": 230, "y": 90, "charge": "δ+"},
          {"id": "o", "el": "O", "x": 230, "y": 18, "charge": "δ−", "lp": {"n": 2, "angles": [105, 240]}},
          {"id": "r", "el": "CH₃", "x": 167.646, "y": 126.0},
          {"id": "g", "el": "OSOCl", "x": 292.354, "y": 126.0, "lp": {"n": 2, "angles": [120, 30]}},
          {"id": "nu", "el": "Cl", "x": 330, "y": 65, "charge": "−", "lp": {"n": 4, "angles": [150, 0, 210, 90]}}
        ],
        "bonds": [
          {"a": "c", "b": "o", "order": 2},
          {"a": "c", "b": "r"},
          {"a": "c", "b": "g"},
          {"a": "nu", "b": "c", "dash": true}
        ],
        "curves": [
          {"from": "nu", "to": "c", "bulge": -28},
          {"from": "bond:c:o", "to": "o", "bulge": -26}
        ]
      },
      {
        "caption": {
          "en": "Collapse expels chlorosulfite.",
          "fa": "کلروسولفیت خارج می‌شود."
        },
        "atoms": [
          {"id": "c", "el": "C", "x": 230, "y": 90, "bare": true},
          {"id": "o", "el": "O", "x": 230, "y": 18, "charge": "−", "lp": {"n": 3, "angles": [105, 240, 0]}},
          {"id": "r", "el": "CH₃", "x": 162.342, "y": 114.625},
          {"id": "g", "el": "OSOCl", "x": 297.658, "y": 114.625, "lp": {"n": 2, "angles": [105, 195]}},
          {"id": "nu", "el": "Cl", "x": 230, "y": 162, "lp": {"n": 3, "angles": [180, 90, 270]}}
        ],
        "bonds": [
          {"a": "c", "b": "o"},
          {"a": "c", "b": "r"},
          {"a": "c", "b": "g"},
          {"a": "c", "b": "nu"}
        ],
        "curves": [
          {"from": "o", "to": "bond:c:o", "bulge": 26},
          {"from": "bond:c:g", "to": "g", "bulge": -26}
        ]
      },
      {
        "caption": {
          "en": "Fragmentation releases SO₂ and Cl⁻.",
          "fa": "شکستن میانجی، ⁦SO₂⁩ و ⁦Cl⁻⁩ آزاد می‌کند."
        },
        "atoms": [
          {"id": "ox", "el": "O", "x": 174, "y": 90, "charge": "−", "lp": {"n": 3, "angles": [195, 255, 0]}},
          {"id": "s", "el": "S", "x": 246, "y": 90, "lp": {"n": 1, "angles": [180]}},
          {"id": "o", "el": "O", "x": 282, "y": 27.646, "lp": {"n": 2, "angles": [30, 300]}},
          {"id": "cl", "el": "Cl", "x": 318, "y": 90, "lp": {"n": 3, "angles": [90, 0, 180]}}
        ],
        "bonds": [
          {"a": "ox", "b": "s"},
          {"a": "s", "b": "o", "order": 2},
          {"a": "s", "b": "cl"}
        ],
        "curves": [
          {"from": "ox", "to": "bond:ox:s", "bulge": -26},
          {"from": "bond:cl:s", "to": "cl", "bulge": -26}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "[OS(O)Cl]⁻ → SO₂ + Cl⁻", "size": 10, "color": "slate"}
        ]
      },
      {
        "caption": {
          "en": "Acetyl chloride forms as gases escape.",
          "fa": "با خروج گازها، استیل‌کلرید تشکیل می‌شود."
        },
        "atoms": [
          {"id": "c", "el": "C", "x": 230, "y": 90, "charge": "δ+"},
          {"id": "o", "el": "O", "x": 230, "y": 18, "charge": "δ−", "lp": {"n": 2, "angles": [105, 240]}},
          {"id": "r", "el": "CH₃", "x": 167.646, "y": 126.0},
          {"id": "g", "el": "Cl", "x": 292.354, "y": 126.0, "lp": {"n": 3, "angles": [120, 30, 210]}}
        ],
        "bonds": [
          {"a": "c", "b": "o", "order": 2},
          {"a": "c", "b": "r"},
          {"a": "c", "b": "g"}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "CH₃COOH + SOCl₂ → CH₃COCl + SO₂ + HCl", "size": 10, "color": "slate"}
        ]
      }
    ],
    "connectors": ["→", "→", "→", "→", "→"]
  },
  "acyl-hydrolysis-family": {
    "title": {
      "en": "Ester hydrolysis: base route and acid comparison",
      "fa": "هیدرولیز استر: مسیر بازی و مقایسه با مسیر اسیدی"
    },
    "footnote": {
      "en": "Base-promoted hydrolysis proceeds by hydroxide addition, methoxide elimination and acid-base trapping as carboxylate. The favorable final deprotonation makes saponification effectively irreversible under these conditions; it does not mean carboxylate can never react. Base is consumed overall. Acid hydrolysis is the reversible reverse of Fischer esterification and follows protonated intermediates, not the anionic route shown here.",
      "fa": "هیدرولیز بازی با افزایش هیدروکسید، خروج متوکسید و تثبیت محصول به صورت کربوکسیلات پیش می‌رود. پروتون‌زدایی مطلوب پایانی، صابونی‌شدن را در این شرایط عملاً برگشت‌ناپذیر می‌کند؛ این به معنای واکنش‌ناپذیری مطلق کربوکسیلات نیست. باز در مجموع مصرف می‌شود. هیدرولیز اسیدی، وارونِ برگشت‌پذیر استری‌شدن فیشر است و از میانجی‌های پروتون‌گرفته می‌گذرد، نه مسیر آنیونی نشان‌داده‌شده."
    },
    "frames": [
      {
        "caption": {
          "en": "Hydroxide adds to the ester carbonyl.",
          "fa": "هیدروکسید به کربونیل استر اضافه می‌شود."
        },
        "atoms": [
          {"id": "c", "el": "C", "x": 230, "y": 90, "charge": "δ+"},
          {"id": "o", "el": "O", "x": 230, "y": 18, "charge": "δ−", "lp": {"n": 2, "angles": [105, 240]}},
          {"id": "r", "el": "CH₃", "x": 167.646, "y": 126.0},
          {"id": "g", "el": "OCH₃", "x": 292.354, "y": 126.0, "lp": {"n": 2, "angles": [120, 30]}},
          {"id": "nu", "el": "OH", "x": 330, "y": 65, "charge": "−", "lp": {"n": 3, "angles": [150, 0, 210]}}
        ],
        "bonds": [
          {"a": "c", "b": "o", "order": 2},
          {"a": "c", "b": "r"},
          {"a": "c", "b": "g"},
          {"a": "nu", "b": "c", "dash": true}
        ],
        "curves": [
          {"from": "nu", "to": "c", "bulge": -28},
          {"from": "bond:c:o", "to": "o", "bulge": -26}
        ]
      },
      {
        "caption": {
          "en": "C=O reforms as methoxide leaves.",
          "fa": "⁦C=O⁩ تشکیل و متوکسید خارج می‌شود."
        },
        "atoms": [
          {"id": "c", "el": "C", "x": 230, "y": 90, "bare": true},
          {"id": "o", "el": "O", "x": 230, "y": 18, "charge": "−", "lp": {"n": 3, "angles": [105, 240, 0]}},
          {"id": "r", "el": "CH₃", "x": 162.342, "y": 114.625},
          {"id": "g", "el": "OCH₃", "x": 297.658, "y": 114.625, "lp": {"n": 2, "angles": [105, 195]}},
          {"id": "nu", "el": "OH", "x": 230, "y": 162, "lp": {"n": 2, "angles": [180, 90]}}
        ],
        "bonds": [
          {"a": "c", "b": "o"},
          {"a": "c", "b": "r"},
          {"a": "c", "b": "g"},
          {"a": "c", "b": "nu"}
        ],
        "curves": [
          {"from": "o", "to": "bond:c:o", "bulge": 26},
          {"from": "bond:c:g", "to": "g", "bulge": -26}
        ]
      },
      {
        "caption": {
          "en": "Methoxide removes the carboxylic acid proton.",
          "fa": "متوکسید، پروتون اسید کربوکسیلیک را می‌گیرد."
        },
        "atoms": [
          {"id": "c", "el": "C", "x": 190, "y": 90, "bare": true},
          {"id": "o", "el": "O", "x": 190, "y": 18, "lp": {"n": 2, "angles": [0, 90]}},
          {"id": "r", "el": "CH₃", "x": 127.646, "y": 126},
          {"id": "oh", "el": "O", "x": 252.354, "y": 126, "lp": {"n": 2, "angles": [195, 15]}},
          {"id": "hp", "el": "H", "x": 324.354, "y": 126},
          {"id": "base", "el": "OCH₃", "x": 429.354, "y": 126, "charge": "−", "lp": {"n": 3, "angles": [180, 105, 255]}}
        ],
        "bonds": [
          {"a": "c", "b": "o", "order": 2},
          {"a": "c", "b": "r"},
          {"a": "c", "b": "oh"},
          {"a": "oh", "b": "hp"}
        ],
        "curves": [
          {"from": "base", "to": "hp", "bulge": -28},
          {"from": "bond:hp:oh", "to": "oh", "bulge": -28}
        ]
      },
      {
        "caption": {
          "en": "Deprotonation gives carboxylate.",
          "fa": "پروتون‌زدایی، کربوکسیلات می‌دهد."
        },
        "atoms": [
          {"id": "c", "el": "C", "x": 230, "y": 90},
          {"id": "o", "el": "O", "x": 230, "y": 18, "lp": {"n": 2, "angles": [0, 90]}},
          {"id": "r", "el": "CH₃", "x": 167.646, "y": 126.0},
          {"id": "g", "el": "O", "x": 292.354, "y": 126.0, "charge": "−", "lp": {"n": 3, "angles": [165, 240, 105]}}
        ],
        "bonds": [
          {"a": "c", "b": "o", "order": 2},
          {"a": "c", "b": "r"},
          {"a": "c", "b": "g"}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "+ CH₃OH; one carboxylate resonance contributor", "size": 10, "color": "slate"}
        ]
      }
    ],
    "connectors": ["→", "→", "→"]
  },
  "acyl-claisen": {
    "title": {
      "en": "Claisen condensation of ethyl acetate",
      "fa": "تراکم کلایزن اتیل‌استات"
    },
    "footnote": {
      "en": "Ethoxide forms the ester enolate, whose carbon attacks a second ester. Tetrahedral collapse expels ethoxide; strong stabilization of the β-keto ester enolate drives the final deprotonation, so a stoichiometric equivalent of base is needed in the classical self-Claisen. Acid workup restores the neutral β-keto ester. Use a matching alkoxide to avoid ester exchange. CO₂Et and CH₂CO₂Et retain the donor ester; carbon-anion drawings are resonance contributors.",
      "fa": "اتوکسید، انولات استر را می‌سازد و کربن آن به استر دوم حمله می‌کند. فروریزش میانجی، اتوکسید را خارج می‌کند؛ پایداری زیاد انولاتِ بتاکتواستر، پروتون‌زدایی نهایی را پیش می‌برد، بنابراین خودتراکمی کلاسیک کلایزن به یک هم‌ارز استوکیومتری باز نیاز دارد. فرآوری اسیدی، بتاکتواستر خنثی را بازمی‌گرداند. آلکوکسید هم‌نوعِ گروه استر، تبادل استری را کاهش می‌دهد. ⁦CO₂Et⁩ و ⁦CH₂CO₂Et⁩ گروه استر دهنده را حفظ می‌کنند و نمایش آنیون کربنی، یک ساختار رزونانسی است."
    },
    "frames": [
      {
        "caption": {
          "en": "Ethoxide removes α-H to form the ester enolate.",
          "fa": "اتوکسید، ⁦H⁩ آلفا را می‌گیرد و انولات استر تشکیل می‌شود."
        },
        "atoms": [
          {"id": "base", "el": "OEt", "x": 40, "y": 130, "charge": "−", "lp": {"n": 3, "angles": [180, 105, 255]}},
          {"id": "ha", "el": "H", "x": 145, "y": 130},
          {"id": "ca", "el": "CH₂", "x": 217, "y": 130},
          {"id": "c", "el": "C", "x": 279.354, "y": 94},
          {"id": "o", "el": "O", "x": 279.354, "y": 22, "lp": {"n": 2, "angles": [0, 90]}},
          {"id": "et", "el": "OEt", "x": 341.708, "y": 130, "lp": {"n": 2, "angles": [120, 30]}}
        ],
        "bonds": [
          {"a": "ha", "b": "ca"},
          {"a": "ca", "b": "c"},
          {"a": "c", "b": "o", "order": 2},
          {"a": "c", "b": "et"}
        ],
        "curves": [
          {"from": "base", "to": "ha", "bulge": -26},
          {"from": "bond:ca:ha", "to": "ca", "bulge": 28}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "Carbon-anion resonance contributor shown next", "size": 10, "color": "slate"}
        ]
      },
      {
        "caption": {
          "en": "Enolate carbon attacks a second ester molecule.",
          "fa": "کربن انولات به مولکول دوم استر حمله می‌کند."
        },
        "atoms": [
          {"id": "donor", "el": "CO₂Et", "x": 120, "y": 90},
          {"id": "ca", "el": "CH₂", "x": 192, "y": 90, "charge": "−", "lp": {"n": 1, "angles": [180]}},
          {"id": "c", "el": "C", "x": 297, "y": 90, "charge": "δ+"},
          {"id": "o", "el": "O", "x": 297, "y": 18, "charge": "δ−", "lp": {"n": 2, "angles": [105, 240]}},
          {"id": "r", "el": "CH₃", "x": 359.354, "y": 126},
          {"id": "et", "el": "OEt", "x": 234.646, "y": 126, "lp": {"n": 2, "angles": [240, 330]}}
        ],
        "bonds": [
          {"a": "donor", "b": "ca"},
          {"a": "c", "b": "o", "order": 2},
          {"a": "c", "b": "r"},
          {"a": "c", "b": "et"},
          {"a": "ca", "b": "c", "dash": true}
        ],
        "curves": [
          {"from": "ca", "to": "c", "bulge": -28},
          {"from": "bond:c:o", "to": "o", "bulge": -26}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "CO₂Et is the intact donor ester group", "size": 10, "color": "slate"}
        ]
      },
      {
        "caption": {
          "en": "Collapse expels ethoxide.",
          "fa": "اتوکسید از میانجی خارج می‌شود."
        },
        "atoms": [
          {"id": "c", "el": "C", "x": 230, "y": 90, "bare": true},
          {"id": "o", "el": "O", "x": 230, "y": 18, "charge": "−", "lp": {"n": 3, "angles": [105, 240, 0]}},
          {"id": "r", "el": "CH₃", "x": 162.342, "y": 114.625},
          {"id": "g", "el": "OEt", "x": 297.658, "y": 114.625, "lp": {"n": 2, "angles": [105, 195]}},
          {"id": "nu", "el": "CH₂CO₂Et", "x": 230, "y": 162}
        ],
        "bonds": [
          {"a": "c", "b": "o"},
          {"a": "c", "b": "r"},
          {"a": "c", "b": "g"},
          {"a": "c", "b": "nu"}
        ],
        "curves": [
          {"from": "o", "to": "bond:c:o", "bulge": 26},
          {"from": "bond:c:g", "to": "g", "bulge": -26}
        ]
      },
      {
        "caption": {
          "en": "Ethoxide removes the acidic proton between carbonyls.",
          "fa": "اتوکسید، پروتون اسیدی بین دو کربونیل را می‌گیرد."
        },
        "atoms": [
          {"id": "r", "el": "CH₃", "x": 48, "y": 126},
          {"id": "c1", "el": "C", "x": 110.354, "y": 90, "bare": true},
          {"id": "o1", "el": "O", "x": 110.354, "y": 18, "lp": {"n": 2, "angles": [0, 90]}},
          {"id": "ca", "el": "CH", "x": 172.708, "y": 126},
          {"id": "c2", "el": "C", "x": 235.062, "y": 90, "bare": true},
          {"id": "o2", "el": "O", "x": 235.062, "y": 18, "lp": {"n": 2, "angles": [0, 90]}},
          {"id": "et", "el": "OEt", "x": 297.416, "y": 126, "lp": {"n": 2, "angles": [120, 30]}},
          {"id": "hp", "el": "H", "x": 172.708, "y": 54},
          {"id": "base", "el": "OEt", "x": 395, "y": 54, "charge": "−", "lp": {"n": 3, "angles": [180, 105, 255]}}
        ],
        "bonds": [
          {"a": "r", "b": "c1"},
          {"a": "c1", "b": "o1", "order": 2},
          {"a": "c1", "b": "ca"},
          {"a": "ca", "b": "c2"},
          {"a": "c2", "b": "o2", "order": 2},
          {"a": "c2", "b": "et"},
          {"a": "ca", "b": "hp"}
        ],
        "curves": [
          {"from": "base", "to": "hp", "bulge": -28},
          {"from": "bond:ca:hp", "to": "ca", "bulge": -28}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "β-Keto ester pKₐ ≈ 11; base is consumed overall", "size": 10, "color": "slate"}
        ]
      },
      {
        "caption": {
          "en": "Acid workup protonates the stabilized product enolate.",
          "fa": "فرآوری اسیدی، انولات پایدار محصول را پروتون‌دار می‌کند."
        },
        "atoms": [
          {"id": "r", "el": "CH₃", "x": 48, "y": 126},
          {"id": "c1", "el": "C", "x": 110.354, "y": 90, "bare": true},
          {"id": "o1", "el": "O", "x": 110.354, "y": 18, "lp": {"n": 2, "angles": [0, 90]}},
          {"id": "ca", "el": "CH", "x": 172.708, "y": 126, "charge": "−", "lp": {"n": 1, "angles": [180]}},
          {"id": "c2", "el": "C", "x": 235.062, "y": 90, "bare": true},
          {"id": "o2", "el": "O", "x": 235.062, "y": 18, "lp": {"n": 2, "angles": [0, 90]}},
          {"id": "et", "el": "OEt", "x": 297.416, "y": 126, "lp": {"n": 2, "angles": [120, 30]}},
          {"id": "hp", "el": "H", "x": 360, "y": 45},
          {"id": "w", "el": "OH₂", "x": 432, "y": 45, "charge": "+", "lp": {"n": 1, "angles": [150]}}
        ],
        "bonds": [
          {"a": "r", "b": "c1"},
          {"a": "c1", "b": "o1", "order": 2},
          {"a": "c1", "b": "ca"},
          {"a": "ca", "b": "c2"},
          {"a": "c2", "b": "o2", "order": 2},
          {"a": "c2", "b": "et"},
          {"a": "hp", "b": "w"}
        ],
        "curves": [
          {"from": "ca", "to": "hp", "bulge": -40},
          {"from": "bond:hp:w", "to": "w", "bulge": -26}
        ]
      },
      {
        "caption": {
          "en": "Workup gives ethyl acetoacetate.",
          "fa": "فرآوری پایانی، اتیل‌استواستات می‌دهد."
        },
        "atoms": [
          {"id": "r", "el": "CH₃", "x": 48, "y": 126},
          {"id": "c1", "el": "C", "x": 110.354, "y": 90, "bare": true},
          {"id": "o1", "el": "O", "x": 110.354, "y": 18, "lp": {"n": 2, "angles": [0, 90]}},
          {"id": "ca", "el": "CH₂", "x": 172.708, "y": 126},
          {"id": "c2", "el": "C", "x": 235.062, "y": 90, "bare": true},
          {"id": "o2", "el": "O", "x": 235.062, "y": 18, "lp": {"n": 2, "angles": [0, 90]}},
          {"id": "et", "el": "OEt", "x": 297.416, "y": 126, "lp": {"n": 2, "angles": [120, 30]}}
        ],
        "bonds": [
          {"a": "r", "b": "c1"},
          {"a": "c1", "b": "o1", "order": 2},
          {"a": "c1", "b": "ca"},
          {"a": "ca", "b": "c2"},
          {"a": "c2", "b": "o2", "order": 2},
          {"a": "c2", "b": "et"}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "CH₃COCH₂CO₂Et; β-keto ester", "size": 10, "color": "slate"}
        ]
      }
    ],
    "connectors": ["⇌", "⇌", "→", "→", "→"]
  }
};
