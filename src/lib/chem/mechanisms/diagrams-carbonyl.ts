import type { MechanismDiagram } from "./diagram-types";

/** Static mechanism data; see README.md for renderer and projection assumptions. */
export const CARBONYL_DIAGRAMS: Record<string, MechanismDiagram> = {
  "carbonyl-nucleophilic-addition": {
    "title": {
      "en": "Cyanide addition to a carbonyl",
      "fa": "افزایش سیانید به کربونیل"
    },
    "footnote": {
      "en": "The nucleophilic carbon lone pair of CN⁻ attacks electrophilic carbonyl carbon while the C=O π pair moves to oxygen. HCN then protonates the tetrahedral alkoxide and regenerates CN⁻. CN is a carbon-attached condensed group; its lone pair is on carbon, not nitrogen. Carbonyl carbon is planar; the tetrahedral product is a 2D projection. The real Bürgi-Dunitz approach is about 107°, not a flat bond angle imposed here.",
      "fa": "جفت‌الکترون کربن در ⁦CN⁻⁩ به کربن الکترون‌خواه کربونیل حمله می‌کند و جفت‌الکترون ⁦π⁩ از ⁦C=O⁩ به اکسیژن می‌رود. سپس ⁦HCN⁩ آلکوکسید چهاروجهی را پروتون‌دار و ⁦CN⁻⁩ را بازتولید می‌کند. ⁦CN⁩ گروه فشرده‌ای است که از کربن متصل می‌شود و جفت‌الکترون نشان‌داده‌شده روی کربن است، نه نیتروژن. کربن کربونیل تخت است؛ محصول چهاروجهی به صورت تصویر دوبعدی نمایش داده شده است. مسیر واقعی بورگی-دونیتز حدود ۱۰۷ درجه است، نه زاویهٔ تختی که به شکل تحمیل شود."
    },
    "frames": [
      {
        "caption": {
          "en": "CN⁻ attacks C; the π pair moves to O.",
          "fa": "⁦CN⁻⁩ به ⁦C⁩ حمله می‌کند و جفت ⁦π⁩ به ⁦O⁩ می‌رود."
        },
        "atoms": [
          {"id": "c", "el": "C", "x": 230, "y": 90, "charge": "δ+"},
          {"id": "o", "el": "O", "x": 230, "y": 18, "charge": "δ−", "lp": {"n": 2, "angles": [105, 240]}},
          {"id": "r", "el": "R", "x": 167.646, "y": 126.0},
          {"id": "g", "el": "R′", "x": 292.354, "y": 126.0},
          {"id": "nu", "el": "CN", "x": 330, "y": 65, "charge": "−", "lp": {"n": 1, "angles": [150]}}
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
          "en": "The alkoxide takes H from HCN, regenerating CN⁻.",
          "fa": "آلکوکسید از ⁦HCN⁩ پروتون می‌گیرد و ⁦CN⁻⁩ بازتولید می‌شود."
        },
        "atoms": [
          {"id": "c", "el": "C", "x": 230, "y": 90, "bare": true},
          {"id": "o", "el": "O", "x": 230, "y": 18, "charge": "−", "lp": {"n": 3, "angles": [105, 240, 0]}},
          {"id": "r", "el": "R", "x": 162.342, "y": 114.625},
          {"id": "g", "el": "R′", "x": 297.658, "y": 114.625},
          {"id": "nu", "el": "CN", "x": 230, "y": 162},
          {"id": "hp", "el": "H", "x": 332, "y": 18},
          {"id": "donor", "el": "CN", "x": 404, "y": 18}
        ],
        "bonds": [
          {"a": "c", "b": "o"},
          {"a": "c", "b": "r"},
          {"a": "c", "b": "g"},
          {"a": "c", "b": "nu"},
          {"a": "hp", "b": "donor"}
        ],
        "curves": [
          {"from": "o", "to": "hp", "bulge": 30},
          {"from": "bond:donor:hp", "to": "donor", "bulge": 28}
        ]
      },
      {
        "caption": {
          "en": "Protonation gives a cyanohydrin.",
          "fa": "پروتون‌گیری، سیانوهیدرین تولید می‌کند."
        },
        "atoms": [
          {"id": "c", "el": "C", "x": 230, "y": 90, "bare": true},
          {"id": "o", "el": "OH", "x": 230, "y": 18, "lp": {"n": 2, "angles": [0, 90]}},
          {"id": "r", "el": "R", "x": 162.342, "y": 114.625},
          {"id": "g", "el": "R′", "x": 297.658, "y": 114.625},
          {"id": "nu", "el": "CN", "x": 230, "y": 162}
        ],
        "bonds": [
          {"a": "c", "b": "o"},
          {"a": "c", "b": "r"},
          {"a": "c", "b": "g"},
          {"a": "c", "b": "nu"}
        ]
      }
    ],
    "connectors": ["⇌", "⇌"]
  },
  "carbonyl-imine-formation": {
    "title": {
      "en": "Imine formation from a primary amine",
      "fa": "تشکیل ایمین از آمین نوع اول"
    },
    "footnote": {
      "en": "Methylamine adds to acetaldehyde, solvent-assisted proton transfer gives a carbinolamine, OH protonation enables water loss, and N deprotonation gives the imine. Neutral amine/imine N has one pair; ammonium/iminium N has none. Mild acid helps dehydration, but excessive acid suppresses nucleophilic free amine. Equilibrium can be driven by removing water; no universal optimum pH is assumed.",
      "fa": "متیل‌آمین به استالدهید اضافه می‌شود؛ انتقال پروتون با کمک حلال، کاربینول‌آمین می‌سازد. پروتون‌گیری ⁦OH⁩ خروج آب را ممکن می‌کند و پروتون‌زدایی ⁦N⁩، ایمین می‌دهد. نیتروژن آمین یا ایمین خنثی یک جفت‌الکترون دارد؛ نیتروژن آمونیوم یا ایمینیوم جفت‌الکترون آزاد ندارد. اسید ملایم آب‌زدایی را تسهیل می‌کند، اما اسید زیاد مقدار آمین آزاد هسته‌خواه را کاهش می‌دهد. خارج‌کردن آب تعادل را به سوی محصول می‌برد؛ ⁦pH⁩ بهینهٔ همگانی فرض نشده است."
    },
    "frames": [
      {
        "caption": {
          "en": "Methylamine attacks carbonyl carbon.",
          "fa": "متیل‌آمین به کربن کربونیل حمله می‌کند."
        },
        "atoms": [
          {"id": "c", "el": "C", "x": 230, "y": 90, "charge": "δ+"},
          {"id": "o", "el": "O", "x": 230, "y": 18, "charge": "δ−", "lp": {"n": 2, "angles": [105, 240]}},
          {"id": "r", "el": "CH₃", "x": 167.646, "y": 126.0},
          {"id": "g", "el": "H", "x": 292.354, "y": 126.0},
          {"id": "nu", "el": "NH₂CH₃", "x": 330, "y": 65, "lp": {"n": 1, "angles": [75]}}
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
          "en": "Addition creates a zwitterion.",
          "fa": "میانجی دوقطبی یونی تشکیل می‌شود."
        },
        "atoms": [
          {"id": "c", "el": "C", "x": 230, "y": 90, "bare": true},
          {"id": "o", "el": "O", "x": 230, "y": 18, "charge": "−", "lp": {"n": 3, "angles": [105, 240, 0]}},
          {"id": "r", "el": "CH₃", "x": 162.342, "y": 114.625},
          {"id": "g", "el": "H", "x": 297.658, "y": 114.625},
          {"id": "nu", "el": "NH₂CH₃", "x": 230, "y": 162, "charge": "+"}
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
          "en": "A proton relay gives a carbinolamine.",
          "fa": "انتقال پروتون، کاربینول‌آمین می‌سازد."
        },
        "atoms": [
          {"id": "c", "el": "C", "x": 230, "y": 90, "bare": true},
          {"id": "o", "el": "OH", "x": 230, "y": 18, "lp": {"n": 2, "angles": [0, 90]}},
          {"id": "r", "el": "CH₃", "x": 162.342, "y": 114.625},
          {"id": "g", "el": "H", "x": 297.658, "y": 114.625},
          {"id": "nu", "el": "NHCH₃", "x": 230, "y": 162, "lp": {"n": 1, "angles": [180]}}
        ],
        "bonds": [
          {"a": "c", "b": "o"},
          {"a": "c", "b": "r"},
          {"a": "c", "b": "g"},
          {"a": "c", "b": "nu"}
        ],
        "labels": [
          {"x": 410, "y": 28, "text": "Proton relay summarized;", "size": 10, "color": "slate"},
          {"x": 410, "y": 42, "text": "no direct 1,3-H shift", "size": 10, "color": "slate"}
        ]
      },
      {
        "caption": {
          "en": "Hydronium converts OH into a water leaving group.",
          "fa": "هیدرونیوم، ⁦OH⁩ را به گروه خارج‌شوندهٔ آب تبدیل می‌کند."
        },
        "atoms": [
          {"id": "c", "el": "C", "x": 230, "y": 90, "bare": true},
          {"id": "o", "el": "OH", "x": 230, "y": 18, "lp": {"n": 2, "angles": [0, 90]}},
          {"id": "r", "el": "CH₃", "x": 162.342, "y": 114.625},
          {"id": "g", "el": "H", "x": 297.658, "y": 114.625},
          {"id": "nu", "el": "NHCH₃", "x": 230, "y": 162, "lp": {"n": 1, "angles": [180]}},
          {"id": "hp", "el": "H", "x": 332, "y": 18},
          {"id": "w", "el": "OH₂", "x": 404, "y": 18, "charge": "+", "lp": {"n": 1, "angles": [150]}}
        ],
        "bonds": [
          {"a": "c", "b": "o"},
          {"a": "c", "b": "r"},
          {"a": "c", "b": "g"},
          {"a": "c", "b": "nu"},
          {"a": "hp", "b": "w"}
        ],
        "curves": [
          {"from": "o", "to": "hp", "bulge": 30},
          {"from": "bond:hp:w", "to": "w", "bulge": 28}
        ]
      },
      {
        "caption": {
          "en": "C=N forms as water leaves.",
          "fa": "⁦C=N⁩ تشکیل و آب خارج می‌شود."
        },
        "atoms": [
          {"id": "c", "el": "C", "x": 230, "y": 90, "bare": true},
          {"id": "o", "el": "OH₂", "x": 230, "y": 18, "charge": "+", "lp": {"n": 1, "angles": [105]}},
          {"id": "r", "el": "CH₃", "x": 162.342, "y": 114.625},
          {"id": "g", "el": "H", "x": 297.658, "y": 114.625},
          {"id": "nu", "el": "NHCH₃", "x": 230, "y": 162, "lp": {"n": 1, "angles": [180]}}
        ],
        "bonds": [
          {"a": "c", "b": "o"},
          {"a": "c", "b": "r"},
          {"a": "c", "b": "g"},
          {"a": "c", "b": "nu"}
        ],
        "curves": [
          {"from": "nu", "to": "bond:c:nu", "bulge": 28},
          {"from": "bond:c:o", "to": "o", "bulge": -28}
        ]
      },
      {
        "caption": {
          "en": "Water removes N-H; its electron pair returns to N.",
          "fa": "آب پروتون ⁦N-H⁩ را می‌گیرد و جفت‌الکترون به ⁦N⁩ بازمی‌گردد."
        },
        "atoms": [
          {"id": "c", "el": "C", "x": 180, "y": 90, "bare": true},
          {"id": "r", "el": "CH₃", "x": 144, "y": 27.646},
          {"id": "g", "el": "H", "x": 144, "y": 152.354},
          {"id": "n", "el": "N", "x": 252, "y": 90, "charge": "+"},
          {"id": "me", "el": "CH₃", "x": 288, "y": 152.354},
          {"id": "hp", "el": "H", "x": 288, "y": 27.646},
          {"id": "w", "el": "OH₂", "x": 393, "y": 27.646, "lp": {"n": 2, "angles": [0, 180]}}
        ],
        "bonds": [
          {"a": "c", "b": "r"},
          {"a": "c", "b": "g"},
          {"a": "c", "b": "n", "order": 2},
          {"a": "n", "b": "me"},
          {"a": "n", "b": "hp"}
        ],
        "curves": [
          {"from": "w", "to": "hp", "bulge": -26},
          {"from": "bond:hp:n", "to": "n", "bulge": -26}
        ]
      },
      {
        "caption": {
          "en": "Imine nitrogen retains a lone pair.",
          "fa": "نیتروژن ایمین یک جفت‌الکترون دارد."
        },
        "atoms": [
          {"id": "c", "el": "C", "x": 180, "y": 90, "bare": true},
          {"id": "r", "el": "CH₃", "x": 144, "y": 27.646},
          {"id": "g", "el": "H", "x": 144, "y": 152.354},
          {"id": "n", "el": "N", "x": 252, "y": 90, "lp": {"n": 1, "angles": [30]}},
          {"id": "me", "el": "CH₃", "x": 288, "y": 152.354}
        ],
        "bonds": [
          {"a": "c", "b": "r"},
          {"a": "c", "b": "g"},
          {"a": "c", "b": "n", "order": 2},
          {"a": "n", "b": "me"}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "+ H₂O; acid catalyst regenerated", "size": 10, "color": "slate"}
        ]
      }
    ],
    "connectors": ["⇌", "→several", "⇌", "⇌", "⇌", "⇌"]
  },
  "carbonyl-aldol": {
    "title": {
      "en": "Acetaldehyde self-aldol addition",
      "fa": "افزایش خودآلدولی استالدهید"
    },
    "footnote": {
      "en": "Hydroxide forms a small equilibrium concentration of enolate. The O-anion and C-anion panels are resonance contributors of one species, not sequential intermediates. Carbon attack on a second acetaldehyde retains the donor carbonyl and converts the acceptor carbonyl to an alkoxide; protonation gives 3-hydroxybutanal. On heating, separate E1cb dehydration can give but-2-enal; that additional mechanism is not drawn here.",
      "fa": "هیدروکسید در تعادل، مقدار کمی انولات می‌سازد. قاب‌های آنیون اکسیژنی و کربنی، ساختارهای رزونانسی یک گونه‌اند، نه میانجی‌های پیاپی. حملهٔ کربن به استالدهید دوم، کربونیل مولکول دهنده را حفظ و کربونیل گیرنده را به آلکوکسید تبدیل می‌کند؛ پروتون‌گیری، ۳-هیدروکسی‌بوتانال می‌دهد. با گرم‌کردن، آب‌زدایی جداگانهٔ ⁦E1cb⁩ می‌تواند بوت-۲-اِنال بسازد؛ آن سازوکار اضافی در اینجا رسم نشده است."
    },
    "frames": [
      {
        "caption": {
          "en": "Hydroxide removes α-H and the π pair shifts to O.",
          "fa": "هیدروکسید، ⁦H⁩ آلفا را می‌گیرد و جفت‌الکترون ⁦π⁩ به ⁦O⁩ می‌رود."
        },
        "atoms": [
          {"id": "base", "el": "OH", "x": 40, "y": 100, "charge": "−", "lp": {"n": 3, "angles": [180, 105, 255]}},
          {"id": "h", "el": "H", "x": 145, "y": 100},
          {"id": "ca", "el": "CH₂", "x": 217, "y": 100},
          {"id": "c", "el": "CH", "x": 253, "y": 37.646},
          {"id": "o", "el": "O", "x": 325, "y": 37.646, "lp": {"n": 2, "angles": [90, 0]}}
        ],
        "bonds": [
          {"a": "h", "b": "ca"},
          {"a": "ca", "b": "c"},
          {"a": "c", "b": "o", "order": 2}
        ],
        "curves": [
          {"from": "base", "to": "h", "bulge": -26},
          {"from": "bond:ca:h", "to": "bond:c:ca", "bulge": -24},
          {"from": "bond:c:o", "to": "o", "bulge": -26}
        ]
      },
      {
        "caption": {
          "en": "Resonance reveals the C donor.",
          "fa": "رزونانس، کربن هسته‌خواه را نشان می‌دهد."
        },
        "atoms": [
          {"id": "ca", "el": "CH₂", "x": 160, "y": 105},
          {"id": "c", "el": "CH", "x": 196, "y": 42.646},
          {"id": "o", "el": "O", "x": 268, "y": 42.646, "charge": "−", "lp": {"n": 3, "angles": [150, 210, 0]}}
        ],
        "bonds": [
          {"a": "ca", "b": "c", "order": 2},
          {"a": "c", "b": "o"}
        ],
        "curves": [
          {"from": "o", "to": "bond:c:o", "bulge": -25},
          {"from": "bond:c:ca", "to": "ca", "bulge": -25}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "O⁻-CH=CH₂ ↔ O=CH-CH₂⁻", "size": 10, "color": "slate"}
        ]
      },
      {
        "caption": {
          "en": "Enolate carbon attacks a second aldehyde carbonyl.",
          "fa": "کربن انولات به کربونیل مولکول دوم آلدهید حمله می‌کند."
        },
        "atoms": [
          {"id": "o1", "el": "O", "x": 75, "y": 25, "lp": {"n": 2, "angles": [270, 0]}},
          {"id": "c1", "el": "CH", "x": 147, "y": 25},
          {"id": "ca", "el": "CH₂", "x": 183, "y": 87.354, "charge": "−", "lp": {"n": 1, "angles": [195]}},
          {"id": "c2", "el": "C", "x": 288, "y": 87.354, "charge": "δ+"},
          {"id": "o2", "el": "O", "x": 288, "y": 15.354, "charge": "δ−", "lp": {"n": 2, "angles": [105, 240]}},
          {"id": "r", "el": "CH₃", "x": 350.354, "y": 123.354},
          {"id": "h", "el": "H", "x": 225.646, "y": 123.354}
        ],
        "bonds": [
          {"a": "o1", "b": "c1", "order": 2},
          {"a": "c1", "b": "ca"},
          {"a": "c2", "b": "o2", "order": 2},
          {"a": "c2", "b": "r"},
          {"a": "c2", "b": "h"},
          {"a": "ca", "b": "c2", "dash": true}
        ],
        "curves": [
          {"from": "ca", "to": "c2", "bulge": -30},
          {"from": "bond:c2:o2", "to": "o2", "bulge": -26}
        ]
      },
      {
        "caption": {
          "en": "Water protonates the alkoxide and regenerates OH⁻.",
          "fa": "آب، آلکوکسید را پروتون‌دار و ⁦OH⁻⁩ را بازتولید می‌کند."
        },
        "atoms": [
          {"id": "c1", "el": "CH", "x": 100, "y": 95},
          {"id": "o1", "el": "O", "x": 100, "y": 23, "lp": {"n": 2, "angles": [0, 90]}},
          {"id": "ca", "el": "CH₂", "x": 162.354, "y": 131},
          {"id": "c2", "el": "CH", "x": 224.708, "y": 95},
          {"id": "o2", "el": "O", "x": 224.708, "y": 23, "charge": "−", "lp": {"n": 3, "angles": [105, 240, 0]}},
          {"id": "r", "el": "CH₃", "x": 287.062, "y": 131},
          {"id": "hp", "el": "H", "x": 326.708, "y": 23},
          {"id": "w", "el": "OH", "x": 398.708, "y": 23, "lp": {"n": 2, "angles": [90, 0]}}
        ],
        "bonds": [
          {"a": "c1", "b": "o1", "order": 2},
          {"a": "c1", "b": "ca"},
          {"a": "ca", "b": "c2"},
          {"a": "c2", "b": "o2"},
          {"a": "c2", "b": "r"},
          {"a": "hp", "b": "w"}
        ],
        "curves": [
          {"from": "o2", "to": "hp", "bulge": 28},
          {"from": "bond:hp:w", "to": "w", "bulge": 26}
        ]
      },
      {
        "caption": {
          "en": "The aldol product is 3-hydroxybutanal.",
          "fa": "محصول آلدول، ۳-هیدروکسی‌بوتانال است."
        },
        "atoms": [
          {"id": "c1", "el": "CH", "x": 100, "y": 95},
          {"id": "o1", "el": "O", "x": 100, "y": 23, "lp": {"n": 2, "angles": [0, 90]}},
          {"id": "ca", "el": "CH₂", "x": 162.354, "y": 131},
          {"id": "c2", "el": "CH", "x": 224.708, "y": 95},
          {"id": "o2", "el": "OH", "x": 224.708, "y": 23, "lp": {"n": 2, "angles": [0, 90]}},
          {"id": "r", "el": "CH₃", "x": 287.062, "y": 131}
        ],
        "bonds": [
          {"a": "c1", "b": "o1", "order": 2},
          {"a": "c1", "b": "ca"},
          {"a": "ca", "b": "c2"},
          {"a": "c2", "b": "o2"},
          {"a": "c2", "b": "r"}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "OHC-CH₂-CH(OH)-CH₃; one aldehyde retained", "size": 10, "color": "slate"}
        ]
      }
    ],
    "connectors": ["⇌", "↔", "⇌", "⇌"]
  },
  "carbonyl-alpha-halogenation": {
    "title": {
      "en": "Acid-catalyzed α-bromination",
      "fa": "برم‌دارکردن آلفا با کاتالیز اسیدی"
    },
    "footnote": {
      "en": "Acid activation and α-deprotonation form the enol. Its π pair attacks Br₂ while an oxygen pair restores C=O and Br-Br cleaves. O-deprotonation regenerates acid and gives the α-bromoketone. When enolization is rate-limiting, the rate is approximately k[ketone][H⁺] and independent of [Br₂]; a pseudo-first-order form assumes fixed acidity.",
      "fa": "فعال‌سازی اسیدی و پروتون‌زدایی آلفا، انول می‌سازند. جفت‌الکترون ⁦π⁩ انول به ⁦Br₂⁩ حمله می‌کند؛ هم‌زمان جفت‌الکترون اکسیژن ⁦C=O⁩ را بازمی‌سازد و ⁦Br-Br⁩ می‌شکند. پروتون‌زدایی ⁦O⁩، اسید را بازتولید و کتون آلفابرومو را تولید می‌کند. وقتی انول‌شدن تعیین‌کنندهٔ سرعت باشد، سرعت تقریباً ⁦k[ketone][H⁺]⁩ و مستقل از [⁦Br₂]⁩ است؛ تقریب شبه‌مرتبه‌اول، اسیدیتهٔ ثابت را فرض می‌کند."
    },
    "frames": [
      {
        "caption": {
          "en": "Hydronium protonates the ketone oxygen.",
          "fa": "هیدرونیوم، اکسیژن کتون را پروتون‌دار می‌کند."
        },
        "atoms": [
          {"id": "c", "el": "C", "x": 230, "y": 90, "charge": "δ+"},
          {"id": "o", "el": "O", "x": 230, "y": 18, "charge": "δ−", "lp": {"n": 2, "angles": [105, 240]}},
          {"id": "r", "el": "CH₃", "x": 167.646, "y": 126.0},
          {"id": "g", "el": "CH₃", "x": 292.354, "y": 126.0},
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
          "en": "Water removes α-H to form the enol.",
          "fa": "آب، ⁦H⁩ آلفا را می‌گیرد و انول تشکیل می‌شود."
        },
        "atoms": [
          {"id": "w", "el": "OH₂", "x": 40, "y": 130, "lp": {"n": 2, "angles": [0, 180]}},
          {"id": "ha", "el": "H", "x": 145, "y": 130},
          {"id": "ca", "el": "CH₂", "x": 217, "y": 130},
          {"id": "c", "el": "C", "x": 279.354, "y": 94},
          {"id": "o", "el": "OH", "x": 279.354, "y": 22, "charge": "+", "lp": {"n": 1, "angles": [105]}},
          {"id": "r", "el": "CH₃", "x": 341.708, "y": 130}
        ],
        "bonds": [
          {"a": "ha", "b": "ca"},
          {"a": "ca", "b": "c"},
          {"a": "c", "b": "o", "order": 2},
          {"a": "c", "b": "r"}
        ],
        "curves": [
          {"from": "w", "to": "ha", "bulge": -26},
          {"from": "bond:ca:ha", "to": "bond:c:ca", "bulge": 48},
          {"from": "bond:c:o", "to": "o", "bulge": -26}
        ]
      },
      {
        "caption": {
          "en": "The enol attacks Br₂ while oxygen rebuilds C=O.",
          "fa": "انول به ⁦Br₂⁩ حمله می‌کند و اکسیژن، ⁦C=O⁩ را بازمی‌سازد."
        },
        "atoms": [
          {"id": "ca", "el": "CH₂", "x": 140, "y": 90},
          {"id": "c", "el": "C", "x": 212, "y": 90, "bare": true},
          {"id": "o", "el": "OH", "x": 248, "y": 27.646, "lp": {"n": 2, "angles": [30, 300]}},
          {"id": "r", "el": "CH₃", "x": 248, "y": 152.354},
          {"id": "br1", "el": "Br", "x": 345, "y": 95, "lp": {"n": 3, "angles": [270, 0, 180]}},
          {"id": "br2", "el": "Br", "x": 417, "y": 95, "lp": {"n": 3, "angles": [90, 0, 180]}}
        ],
        "bonds": [
          {"a": "ca", "b": "c", "order": 2},
          {"a": "c", "b": "o"},
          {"a": "c", "b": "r"},
          {"a": "br1", "b": "br2"}
        ],
        "curves": [
          {"from": "bond:c:ca", "to": "br1", "bulge": 30},
          {"from": "bond:br1:br2", "to": "br2", "bulge": -26},
          {"from": "o", "to": "bond:c:o", "bulge": -26}
        ]
      },
      {
        "caption": {
          "en": "Water deprotonates O and regenerates the acid.",
          "fa": "آب از ⁦O⁩ پروتون می‌گیرد و کاتالیزور اسیدی بازتولید می‌شود."
        },
        "atoms": [
          {"id": "c", "el": "C", "x": 210, "y": 90, "bare": true},
          {"id": "o", "el": "O", "x": 210, "y": 18, "charge": "+", "lp": {"n": 1, "angles": [240]}},
          {"id": "hp", "el": "H", "x": 282, "y": 18},
          {"id": "w", "el": "OH₂", "x": 387, "y": 18, "lp": {"n": 2, "angles": [0, 180]}},
          {"id": "ca", "el": "CH₂", "x": 147.646, "y": 126},
          {"id": "r", "el": "CH₃", "x": 272.354, "y": 126},
          {"id": "br", "el": "Br", "x": 85.292, "y": 90, "lp": {"n": 3, "angles": [300, 210, 30]}}
        ],
        "bonds": [
          {"a": "c", "b": "o", "order": 2},
          {"a": "o", "b": "hp"},
          {"a": "c", "b": "ca"},
          {"a": "c", "b": "r"},
          {"a": "ca", "b": "br"}
        ],
        "curves": [
          {"from": "w", "to": "hp", "bulge": -26},
          {"from": "bond:hp:o", "to": "o", "bulge": 28}
        ]
      },
      {
        "caption": {
          "en": "Bromine replaces an α-hydrogen of acetone.",
          "fa": "بروم جای یک هیدروژن آلفای استون را می‌گیرد."
        },
        "atoms": [
          {"id": "c", "el": "C", "x": 210, "y": 90, "bare": true},
          {"id": "o", "el": "O", "x": 210, "y": 18, "lp": {"n": 2, "angles": [0, 90]}},
          {"id": "ca", "el": "CH₂", "x": 147.646, "y": 126},
          {"id": "r", "el": "CH₃", "x": 272.354, "y": 126},
          {"id": "br", "el": "Br", "x": 85.292, "y": 90, "lp": {"n": 3, "angles": [300, 210, 30]}}
        ],
        "bonds": [
          {"a": "c", "b": "o", "order": 2},
          {"a": "c", "b": "ca"},
          {"a": "c", "b": "r"},
          {"a": "ca", "b": "br"}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "CH₃COCH₂Br; HBr is produced", "size": 10, "color": "slate"}
        ]
      }
    ],
    "connectors": ["⇌", "⇌", "→", "⇌"]
  },
  "carbonyl-reduction": {
    "title": {
      "en": "Carbonyl reduction by borohydride",
      "fa": "کاهش کربونیل با بوروهیدرید"
    },
    "footnote": {
      "en": "The arrow begins at an actual B-H bond in BH₄⁻, drawn as H-BH₃⁻ with the total ion charge on the condensed boron fragment. The B-H pair forms C-H and C=O π electrons move to O; aqueous workup gives ethanol. Borate association is omitted from the free-alkoxide bookkeeping panel. LiAlH₄ follows analogous hydride-transfer accounting but requires anhydrous reaction conditions and a controlled workup.",
      "fa": "پیکان از پیوند واقعی ⁦B-H⁩ در ⁦BH₄⁻⁩ آغاز می‌شود؛ یون به صورت ⁦H-BH₃⁻⁩ رسم شده و بار کل روی قطعهٔ فشردهٔ بور قرار دارد. جفت‌الکترون ⁦B-H⁩، پیوند ⁦C-H⁩ را می‌سازد و الکترون‌های ⁦π⁩ از ⁦C=O⁩ به ⁦O⁩ می‌روند؛ فرآوری آبی، اتانول می‌دهد. اتصال به گونه‌های بورات در قاب محاسباتی آلکوکسید آزاد حذف شده است. ⁦LiAlH₄⁩ نیز انتقال هیدرید مشابهی دارد، اما به محیط خشک و فرآوری کنترل‌شده نیاز دارد."
    },
    "frames": [
      {
        "caption": {
          "en": "The B-H pair transfers hydride to C.",
          "fa": "جفت ⁦B-H⁩ هیدرید را به کربن منتقل می‌کند."
        },
        "atoms": [
          {"id": "c", "el": "C", "x": 230, "y": 90, "charge": "δ+"},
          {"id": "o", "el": "O", "x": 230, "y": 18, "charge": "δ−", "lp": {"n": 2, "angles": [105, 240]}},
          {"id": "r", "el": "CH₃", "x": 167.646, "y": 126.0},
          {"id": "g", "el": "H", "x": 292.354, "y": 126.0},
          {"id": "bh", "el": "BH₃", "x": 404, "y": 70, "charge": "−"},
          {"id": "hh", "el": "H", "x": 332, "y": 70}
        ],
        "bonds": [
          {"a": "c", "b": "o", "order": 2},
          {"a": "c", "b": "r"},
          {"a": "c", "b": "g"},
          {"a": "bh", "b": "hh"}
        ],
        "curves": [
          {"from": "bond:bh:hh", "to": "c", "bulge": -30},
          {"from": "bond:c:o", "to": "o", "bulge": -26}
        ]
      },
      {
        "caption": {
          "en": "Water protonates the alkoxide during workup.",
          "fa": "آب در فرآوری پایانی، آلکوکسید را پروتون‌دار می‌کند."
        },
        "atoms": [
          {"id": "c", "el": "C", "x": 230, "y": 90, "bare": true},
          {"id": "o", "el": "O", "x": 230, "y": 18, "charge": "−", "lp": {"n": 3, "angles": [105, 240, 0]}},
          {"id": "r", "el": "CH₃", "x": 162.342, "y": 114.625},
          {"id": "g", "el": "H", "x": 297.658, "y": 114.625},
          {"id": "nu", "el": "H", "x": 230, "y": 162},
          {"id": "hp", "el": "H", "x": 332, "y": 18},
          {"id": "w", "el": "OH", "x": 404, "y": 18, "lp": {"n": 2, "angles": [90, 0]}}
        ],
        "bonds": [
          {"a": "c", "b": "o"},
          {"a": "c", "b": "r"},
          {"a": "c", "b": "g"},
          {"a": "c", "b": "nu"},
          {"a": "hp", "b": "w"}
        ],
        "curves": [
          {"from": "o", "to": "hp", "bulge": 30},
          {"from": "bond:hp:w", "to": "w", "bulge": 26}
        ]
      },
      {
        "caption": {
          "en": "Reduction gives ethanol.",
          "fa": "کاهش، اتانول تولید می‌کند."
        },
        "atoms": [
          {"id": "c", "el": "C", "x": 230, "y": 90, "bare": true},
          {"id": "o", "el": "OH", "x": 230, "y": 18, "lp": {"n": 2, "angles": [0, 90]}},
          {"id": "r", "el": "CH₃", "x": 162.342, "y": 114.625},
          {"id": "g", "el": "H", "x": 297.658, "y": 114.625},
          {"id": "nu", "el": "H", "x": 230, "y": 162}
        ],
        "bonds": [
          {"a": "c", "b": "o"},
          {"a": "c", "b": "r"},
          {"a": "c", "b": "g"},
          {"a": "c", "b": "nu"}
        ]
      }
    ],
    "connectors": ["→", "→several"]
  }
};
