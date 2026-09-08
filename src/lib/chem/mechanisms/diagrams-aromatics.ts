import type { MechanismDiagram } from "./diagram-types";

/** Static mechanism data; see README.md for renderer and projection assumptions. */
export const AROMATIC_DIAGRAMS: Record<string, MechanismDiagram> = {
  "eas-general": {
    "title": {
      "en": "Electrophilic aromatic substitution",
      "fa": "استخلاف الکترون‌خواهی آروماتیک"
    },
    "footnote": {
      "en": "A ring π pair forms C-E and produces an arenium ion. Its positive charge is delocalized; one resonance contributor is shown. Base then takes H and the C-H pair restores the missing π bond. The C-E σ bond must NOT be broken. Electrophile generation depends on the reagent and is not represented by arrows from generic reagent labels. B⁻ is a generic base, not boron.",
      "fa": "جفت‌الکترون ⁦π⁩ حلقه، ⁦C-E⁩ و یون آرنیوم را می‌سازد. بار مثبت پخش‌شده است و فقط یکی از ساختارهای رزونانسی نشان داده شده است. سپس باز، ⁦H⁩ را می‌گیرد و جفت‌الکترون ⁦C-H⁩ پیوند ⁦π⁩ ازدست‌رفته را بازمی‌سازد. پیوند σ از نوع ⁦C-E⁩ نباید شکسته شود. تولید الکترون‌خواه به واکنش‌گر بستگی دارد و با پیکان از برچسب کلی نمایش داده نشده است. ⁦B⁻⁩ نماد یک باز عمومی است، نه عنصر بور."
    },
    "frames": [
      {
        "caption": {
          "en": "A ring π pair bonds to the electrophile.",
          "fa": "جفت‌الکترون ⁦π⁩ حلقه به الکترون‌خواه پیوند می‌دهد."
        },
        "atoms": [
          {"id": "c1", "el": "C", "x": 232.0, "y": 85.0, "bare": true},
          {"id": "c2", "el": "C", "x": 196.0, "y": 147.354, "bare": true},
          {"id": "c3", "el": "C", "x": 124.0, "y": 147.354, "bare": true},
          {"id": "c4", "el": "C", "x": 88.0, "y": 85.0, "bare": true},
          {"id": "c5", "el": "C", "x": 124.0, "y": 22.646, "bare": true},
          {"id": "c6", "el": "C", "x": 196.0, "y": 22.646, "bare": true},
          {"id": "e", "el": "E", "x": 337, "y": 85, "charge": "+"}
        ],
        "bonds": [
          {"a": "c1", "b": "c2", "order": 2},
          {"a": "c2", "b": "c3"},
          {"a": "c3", "b": "c4", "order": 2},
          {"a": "c4", "b": "c5"},
          {"a": "c5", "b": "c6", "order": 2},
          {"a": "c6", "b": "c1"},
          {"a": "c1", "b": "e", "dash": true}
        ],
        "curves": [
          {"from": "bond:c1:c2", "to": "e", "bulge": 30}
        ]
      },
      {
        "caption": {
          "en": "Base removes H; the C-H pair restores the π bond.",
          "fa": "باز، ⁦H⁩ را می‌گیرد و جفت‌الکترون ⁦C-H⁩ پیوند ⁦π⁩ را بازمی‌سازد."
        },
        "atoms": [
          {"id": "c1", "el": "C", "x": 232.0, "y": 85.0, "bare": true},
          {"id": "c2", "el": "CH", "x": 196.0, "y": 147.354, "charge": "+"},
          {"id": "c3", "el": "C", "x": 124.0, "y": 147.354, "bare": true},
          {"id": "c4", "el": "C", "x": 88.0, "y": 85.0, "bare": true},
          {"id": "c5", "el": "C", "x": 124.0, "y": 22.646, "bare": true},
          {"id": "c6", "el": "C", "x": 196.0, "y": 22.646, "bare": true},
          {"id": "e", "el": "E", "x": 294.354, "y": 49},
          {"id": "h", "el": "H", "x": 294.354, "y": 121},
          {"id": "base", "el": "B", "x": 399.354, "y": 121, "charge": "−"}
        ],
        "bonds": [
          {"a": "c1", "b": "c2"},
          {"a": "c2", "b": "c3"},
          {"a": "c3", "b": "c4", "order": 2},
          {"a": "c4", "b": "c5"},
          {"a": "c5", "b": "c6", "order": 2},
          {"a": "c6", "b": "c1"},
          {"a": "c1", "b": "e"},
          {"a": "c1", "b": "h"}
        ],
        "curves": [
          {"from": "base", "to": "h", "bulge": -25},
          {"from": "bond:c1:h", "to": "bond:c1:c2", "bulge": -26}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "One arenium resonance contributor; C-E is retained", "size": 10, "color": "slate"}
        ]
      },
      {
        "caption": {
          "en": "Aromaticity returns and the C-E bond remains.",
          "fa": "آروماتیسیته بازمی‌گردد و پیوند ⁦C-E⁩ باقی می‌ماند."
        },
        "atoms": [
          {"id": "c1", "el": "C", "x": 232.0, "y": 85.0, "bare": true},
          {"id": "c2", "el": "C", "x": 196.0, "y": 147.354, "bare": true},
          {"id": "c3", "el": "C", "x": 124.0, "y": 147.354, "bare": true},
          {"id": "c4", "el": "C", "x": 88.0, "y": 85.0, "bare": true},
          {"id": "c5", "el": "C", "x": 124.0, "y": 22.646, "bare": true},
          {"id": "c6", "el": "C", "x": 196.0, "y": 22.646, "bare": true},
          {"id": "e", "el": "E", "x": 304, "y": 85}
        ],
        "bonds": [
          {"a": "c1", "b": "c2", "order": 2},
          {"a": "c2", "b": "c3"},
          {"a": "c3", "b": "c4", "order": 2},
          {"a": "c4", "b": "c5"},
          {"a": "c5", "b": "c6", "order": 2},
          {"a": "c6", "b": "c1"},
          {"a": "c1", "b": "e"}
        ]
      }
    ],
    "connectors": ["→slow", "→"]
  },
  "eas-nitration": {
    "title": {
      "en": "Nitration: nitronium generation and ring substitution",
      "fa": "نیتردارکردن: تولید نیترونیوم و استخلاف حلقه"
    },
    "footnote": {
      "en": "Sulfuric acid protonates nitric acid before the first panel; water elimination gives linear NO₂⁺. Ring attack must be accompanied by N=O π-electron transfer so nitrogen never exceeds an octet. Bisulfate removes the ring proton, retaining C-N and regenerating H₂SO₄. The nitro group has N⁺ and O⁻ but is neutral overall; its two N-O resonance forms are equivalent.",
      "fa": "اسید سولفوریک پیش از قاب نخست، اسید نیتریک را پروتون‌دار می‌کند؛ حذف آب، ⁦NO₂⁺⁩ خطی می‌دهد. حملهٔ حلقه باید همراه انتقال جفت‌الکترون ⁦π⁩ از ⁦N=O⁩ باشد تا نیتروژن از هشت‌تایی فراتر نرود. هیدروژن‌سولفات پروتون حلقه را می‌گیرد، ⁦C-N⁩ حفظ و ⁦H₂SO₄⁩ بازتولید می‌شود. گروه نیترو با وجود ⁦N⁺⁩ و ⁦O⁻⁩، در مجموع خنثی است و دو ساختار رزونانسی هم‌ارز دارد."
    },
    "frames": [
      {
        "caption": {
          "en": "Water loss produces NO₂⁺.",
          "fa": "خروج آب، ⁦NO₂⁺⁩ تولید می‌کند."
        },
        "atoms": [
          {"id": "n", "el": "N", "x": 220, "y": 90, "charge": "+"},
          {"id": "o1", "el": "O", "x": 220, "y": 18, "lp": {"n": 2, "angles": [0, 90]}},
          {"id": "o2", "el": "O", "x": 157.646, "y": 126, "charge": "−", "lp": {"n": 3, "angles": [195, 120, 255]}},
          {"id": "w", "el": "OH₂", "x": 282.354, "y": 126, "charge": "+", "lp": {"n": 1, "angles": [165]}}
        ],
        "bonds": [
          {"a": "n", "b": "o1", "order": 2},
          {"a": "n", "b": "o2"},
          {"a": "n", "b": "w"}
        ],
        "curves": [
          {"from": "o2", "to": "bond:n:o2", "bulge": -24},
          {"from": "bond:n:w", "to": "w", "bulge": -24}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "After H₂SO₄ protonates HNO₃; HSO₄⁻ omitted", "size": 10, "color": "slate"}
        ]
      },
      {
        "caption": {
          "en": "The ring attacks N; an N=O π pair moves to O.",
          "fa": "حلقه به ⁦N⁩ حمله می‌کند و جفت‌الکترون ⁦π⁩ از ⁦N=O⁩ به ⁦O⁩ می‌رود."
        },
        "atoms": [
          {"id": "c1", "el": "C", "x": 232.0, "y": 85.0, "bare": true},
          {"id": "c2", "el": "C", "x": 196.0, "y": 147.354, "bare": true},
          {"id": "c3", "el": "C", "x": 124.0, "y": 147.354, "bare": true},
          {"id": "c4", "el": "C", "x": 88.0, "y": 85.0, "bare": true},
          {"id": "c5", "el": "C", "x": 124.0, "y": 22.646, "bare": true},
          {"id": "c6", "el": "C", "x": 196.0, "y": 22.646, "bare": true},
          {"id": "n", "el": "N", "x": 350, "y": 90, "charge": "+"},
          {"id": "o1", "el": "O", "x": 350, "y": 18, "lp": {"n": 2, "angles": [0, 90]}},
          {"id": "o2", "el": "O", "x": 350, "y": 162, "lp": {"n": 2, "angles": [180, 90]}}
        ],
        "bonds": [
          {"a": "c1", "b": "c2", "order": 2},
          {"a": "c2", "b": "c3"},
          {"a": "c3", "b": "c4", "order": 2},
          {"a": "c4", "b": "c5"},
          {"a": "c5", "b": "c6", "order": 2},
          {"a": "c6", "b": "c1"},
          {"a": "n", "b": "o1", "order": 2},
          {"a": "n", "b": "o2", "order": 2}
        ],
        "curves": [
          {"from": "bond:c1:c2", "to": "n", "bulge": -30},
          {"from": "bond:n:o2", "to": "o2", "bulge": -25}
        ],
        "labels": [
          {"x": 410, "y": 65, "text": "Linear nitronium; N", "size": 10, "color": "slate"},
          {"x": 410, "y": 79, "text": "octet is preserved", "size": 10, "color": "slate"}
        ]
      },
      {
        "caption": {
          "en": "Bisulfate removes H and restores aromaticity.",
          "fa": "هیدروژن‌سولفات، ⁦H⁩ را می‌گیرد و آروماتیسیته را بازمی‌گرداند."
        },
        "atoms": [
          {"id": "c1", "el": "C", "x": 232.0, "y": 85.0, "bare": true},
          {"id": "c2", "el": "CH", "x": 196.0, "y": 147.354, "charge": "+"},
          {"id": "c3", "el": "C", "x": 124.0, "y": 147.354, "bare": true},
          {"id": "c4", "el": "C", "x": 88.0, "y": 85.0, "bare": true},
          {"id": "c5", "el": "C", "x": 124.0, "y": 22.646, "bare": true},
          {"id": "c6", "el": "C", "x": 196.0, "y": 22.646, "bare": true},
          {"id": "n", "el": "N", "x": 304, "y": 85, "charge": "+"},
          {"id": "o1", "el": "O", "x": 340, "y": 22.646, "lp": {"n": 2, "angles": [30, 300]}},
          {"id": "o2", "el": "O", "x": 340, "y": 147.354, "charge": "−", "lp": {"n": 3, "angles": [180, 105, 255]}},
          {"id": "h", "el": "H", "x": 282.912, "y": 135.912},
          {"id": "base", "el": "OSO₃H", "x": 450, "y": 130, "charge": "−", "lp": {"n": 3, "angles": [180, 105, 255]}}
        ],
        "bonds": [
          {"a": "c1", "b": "c2"},
          {"a": "c2", "b": "c3"},
          {"a": "c3", "b": "c4", "order": 2},
          {"a": "c4", "b": "c5"},
          {"a": "c5", "b": "c6", "order": 2},
          {"a": "c6", "b": "c1"},
          {"a": "c1", "b": "n"},
          {"a": "n", "b": "o1", "order": 2},
          {"a": "n", "b": "o2"},
          {"a": "c1", "b": "h"}
        ],
        "curves": [
          {"from": "base", "to": "h", "bulge": 36},
          {"from": "bond:c1:h", "to": "bond:c1:c2", "bulge": -25}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "C-N is retained; H₂SO₄ is regenerated", "size": 10, "color": "slate"}
        ]
      },
      {
        "caption": {
          "en": "Nitrobenzene is neutral overall.",
          "fa": "نیتروبنزن در مجموع خنثی است."
        },
        "atoms": [
          {"id": "c1", "el": "C", "x": 232.0, "y": 85.0, "bare": true},
          {"id": "c2", "el": "C", "x": 196.0, "y": 147.354, "bare": true},
          {"id": "c3", "el": "C", "x": 124.0, "y": 147.354, "bare": true},
          {"id": "c4", "el": "C", "x": 88.0, "y": 85.0, "bare": true},
          {"id": "c5", "el": "C", "x": 124.0, "y": 22.646, "bare": true},
          {"id": "c6", "el": "C", "x": 196.0, "y": 22.646, "bare": true},
          {"id": "n", "el": "N", "x": 304, "y": 85, "charge": "+"},
          {"id": "o1", "el": "O", "x": 340, "y": 22.646, "lp": {"n": 2, "angles": [30, 300]}},
          {"id": "o2", "el": "O", "x": 340, "y": 147.354, "charge": "−", "lp": {"n": 3, "angles": [180, 105, 255]}}
        ],
        "bonds": [
          {"a": "c1", "b": "c2", "order": 2},
          {"a": "c2", "b": "c3"},
          {"a": "c3", "b": "c4", "order": 2},
          {"a": "c4", "b": "c5"},
          {"a": "c5", "b": "c6", "order": 2},
          {"a": "c6", "b": "c1"},
          {"a": "c1", "b": "n"},
          {"a": "n", "b": "o1", "order": 2},
          {"a": "n", "b": "o2"}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "Ar-N⁺(=O)-O⁻ ↔ Ar-N⁺(-O⁻)=O", "size": 10, "color": "slate"}
        ]
      }
    ],
    "connectors": ["→", "→", "→"]
  },
  "eas-bromination": {
    "title": {
      "en": "Benzene bromination with FeBr₃",
      "fa": "برم‌دارکردن بنزن با ⁦FeBr₃⁩"
    },
    "footnote": {
      "en": "FeBr₃ activates Br₂ by Lewis-acid coordination. The aromatic π pair attacks bromine and the Br-Br pair leaves toward the Lewis-acid-bound bromide. In the arenium ion, FeBr₄⁻ transfers its Fe-Br bond pair to H while C-H restores the aromatic π bond, regenerating FeBr₃. The negative charge on the condensed FeBr₃ fragment denotes the whole FeBr₄⁻ complex, not an isolated Fe charge.",
      "fa": "⁦FeBr₃⁩ با کوئوردیناسیون اسید لوئیس، ⁦Br₂⁩ را فعال می‌کند. جفت‌الکترون ⁦π⁩ به بروم حمله می‌کند و جفت‌الکترون ⁦Br-Br⁩ به سوی برومید متصل به اسید لوئیس می‌رود. در گام بعد، جفت‌الکترون ⁦Fe-Br⁩ به ⁦H⁩ منتقل می‌شود و ⁦C-H⁩ پیوند ⁦π⁩ آروماتیک را بازمی‌سازد؛ ⁦FeBr₃⁩ بازتولید می‌شود. بار منفی روی قطعهٔ فشردهٔ ⁦FeBr₃⁩ متعلق به کل کمپلکس ⁦FeBr₄⁻⁩ است، نه بار موضعی اتم ⁦Fe⁩."
    },
    "frames": [
      {
        "caption": {
          "en": "A bromine lone pair coordinates to FeBr₃.",
          "fa": "یک جفت‌الکترون بروم به ⁦FeBr₃⁩ کوئوردینه می‌شود."
        },
        "atoms": [
          {"id": "br1", "el": "Br", "x": 145, "y": 85, "lp": {"n": 3, "angles": [270, 0, 180]}},
          {"id": "br2", "el": "Br", "x": 217, "y": 85, "lp": {"n": 3, "angles": [0, 180, 45]}},
          {"id": "fe", "el": "FeBr₃", "x": 322, "y": 85}
        ],
        "bonds": [
          {"a": "br1", "b": "br2"},
          {"a": "br2", "b": "fe", "dash": true}
        ],
        "curves": [
          {"from": "br2", "to": "fe", "bulge": -28}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "Lewis-acid activation; Fe ligands condensed", "size": 10, "color": "slate"}
        ]
      },
      {
        "caption": {
          "en": "The ring attacks activated Br₂ as Br-Br breaks.",
          "fa": "حلقه به ⁦Br₂⁩ فعال‌شده حمله می‌کند و ⁦Br-Br⁩ می‌شکند."
        },
        "atoms": [
          {"id": "c1", "el": "C", "x": 232.0, "y": 85.0, "bare": true},
          {"id": "c2", "el": "C", "x": 196.0, "y": 147.354, "bare": true},
          {"id": "c3", "el": "C", "x": 124.0, "y": 147.354, "bare": true},
          {"id": "c4", "el": "C", "x": 88.0, "y": 85.0, "bare": true},
          {"id": "c5", "el": "C", "x": 124.0, "y": 22.646, "bare": true},
          {"id": "c6", "el": "C", "x": 196.0, "y": 22.646, "bare": true},
          {"id": "br1", "el": "Br", "x": 337, "y": 85, "charge": "δ+", "lp": {"n": 3, "angles": [180, 0, 120]}},
          {"id": "br2", "el": "Br", "x": 409, "y": 85, "charge": "δ−", "lp": {"n": 3, "angles": [150, 210, 0]}}
        ],
        "bonds": [
          {"a": "c1", "b": "c2", "order": 2},
          {"a": "c2", "b": "c3"},
          {"a": "c3", "b": "c4", "order": 2},
          {"a": "c4", "b": "c5"},
          {"a": "c5", "b": "c6", "order": 2},
          {"a": "c6", "b": "c1"},
          {"a": "br1", "b": "br2"},
          {"a": "c1", "b": "br1", "dash": true}
        ],
        "curves": [
          {"from": "bond:c1:c2", "to": "br1", "bulge": 28},
          {"from": "bond:br1:br2", "to": "br2", "bulge": -26}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "FeBr₃ associated with departing Br; ligation omitted", "size": 10, "color": "slate"}
        ]
      },
      {
        "caption": {
          "en": "FeBr₄⁻ accepts H and releases FeBr₃.",
          "fa": "⁦FeBr₄⁻⁩ پروتون را می‌گیرد و ⁦FeBr₃⁩ آزاد می‌شود."
        },
        "atoms": [
          {"id": "c1", "el": "C", "x": 232.0, "y": 85.0, "bare": true},
          {"id": "c2", "el": "CH", "x": 196.0, "y": 147.354, "charge": "+"},
          {"id": "c3", "el": "C", "x": 124.0, "y": 147.354, "bare": true},
          {"id": "c4", "el": "C", "x": 88.0, "y": 85.0, "bare": true},
          {"id": "c5", "el": "C", "x": 124.0, "y": 22.646, "bare": true},
          {"id": "c6", "el": "C", "x": 196.0, "y": 22.646, "bare": true},
          {"id": "e", "el": "Br", "x": 294.354, "y": 49, "lp": {"n": 3, "angles": [60, 150, 330]}},
          {"id": "h", "el": "H", "x": 294.354, "y": 121},
          {"id": "base", "el": "Br", "x": 399.354, "y": 121, "lp": {"n": 3, "angles": [270, 0, 180]}},
          {"id": "fe", "el": "FeBr₃", "x": 471.354, "y": 121, "charge": "−"}
        ],
        "bonds": [
          {"a": "c1", "b": "c2"},
          {"a": "c2", "b": "c3"},
          {"a": "c3", "b": "c4", "order": 2},
          {"a": "c4", "b": "c5"},
          {"a": "c5", "b": "c6", "order": 2},
          {"a": "c6", "b": "c1"},
          {"a": "c1", "b": "e"},
          {"a": "c1", "b": "h"},
          {"a": "base", "b": "fe"}
        ],
        "curves": [
          {"from": "bond:base:fe", "to": "h", "bulge": 36},
          {"from": "bond:c1:h", "to": "bond:c1:c2", "bulge": -26}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "FeBr₄⁻ written Br-FeBr₃⁻; complex charge condensed", "size": 10, "color": "slate"}
        ]
      },
      {
        "caption": {
          "en": "Bromobenzene retains the new C-Br bond.",
          "fa": "بروموبنزن پیوند تازهٔ ⁦C-Br⁩ را حفظ می‌کند."
        },
        "atoms": [
          {"id": "c1", "el": "C", "x": 232.0, "y": 85.0, "bare": true},
          {"id": "c2", "el": "C", "x": 196.0, "y": 147.354, "bare": true},
          {"id": "c3", "el": "C", "x": 124.0, "y": 147.354, "bare": true},
          {"id": "c4", "el": "C", "x": 88.0, "y": 85.0, "bare": true},
          {"id": "c5", "el": "C", "x": 124.0, "y": 22.646, "bare": true},
          {"id": "c6", "el": "C", "x": 196.0, "y": 22.646, "bare": true},
          {"id": "e", "el": "Br", "x": 304, "y": 85, "lp": {"n": 3, "angles": [90, 0, 180]}}
        ],
        "bonds": [
          {"a": "c1", "b": "c2", "order": 2},
          {"a": "c2", "b": "c3"},
          {"a": "c3", "b": "c4", "order": 2},
          {"a": "c4", "b": "c5"},
          {"a": "c5", "b": "c6", "order": 2},
          {"a": "c6", "b": "c1"},
          {"a": "c1", "b": "e"}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "+ HBr; FeBr₃ regenerated", "size": 10, "color": "slate"}
        ]
      }
    ],
    "connectors": ["→", "→", "→"]
  },
  "eas-friedel-crafts": {
    "title": {
      "en": "Friedel-Crafts methylation",
      "fa": "متیل‌دارکردن فریدل-کرافتس"
    },
    "footnote": {
      "en": "CH₃Cl/AlCl₃ supplies an activated C-Cl electrophile, not a free CH₃⁺ ion. Ring attack, C-Cl cleavage and subsequent deprotonation give toluene. More substituted alkyl electrophiles may rearrange and alkylation can repeat. Acylation instead uses an acylium electrophile, avoids skeletal rearrangement and deactivates the product; its AlCl₃ complex requires aqueous workup. Condensed AlCl₃⁻ denotes the charge of AlCl₄⁻ as a whole.",
      "fa": "⁦CH₃Cl⁩ و ⁦AlCl₃⁩ یک پیوند ⁦C-Cl⁩ فعال‌شده فراهم می‌کنند، نه یون آزاد ⁦CH₃⁺⁩. حملهٔ حلقه، شکست ⁦C-Cl⁩ و سپس پروتون‌زدایی، تولوئن می‌دهند. الکترون‌خواه‌های آلکیلی پرجانشین‌تر ممکن است بازآرایی کنند و آلکیل‌دارکردن می‌تواند تکرار شود. آسیل‌دارکردن از یون آسیلیوم استفاده می‌کند، بازآرایی اسکلت ندارد و محصول را غیرفعال می‌کند؛ کمپلکس ⁦AlCl₃⁩ آن به فرآوری آبی نیاز دارد. بار روی ⁦AlCl₃⁩ فشرده، بار کل ⁦AlCl₄⁻⁩ است."
    },
    "frames": [
      {
        "caption": {
          "en": "The chlorine lone pair coordinates to AlCl₃.",
          "fa": "جفت‌الکترون کلر به ⁦AlCl₃⁩ کوئوردینه می‌شود."
        },
        "atoms": [
          {"id": "r", "el": "CH₃", "x": 145, "y": 85},
          {"id": "cl", "el": "Cl", "x": 217, "y": 85, "lp": {"n": 3, "angles": [0, 180, 45]}},
          {"id": "al", "el": "AlCl₃", "x": 322, "y": 85}
        ],
        "bonds": [
          {"a": "r", "b": "cl"},
          {"a": "cl", "b": "al", "dash": true}
        ],
        "curves": [
          {"from": "cl", "to": "al", "bulge": -28}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "Lewis-acid activation; no free methyl cation", "size": 10, "color": "slate"}
        ]
      },
      {
        "caption": {
          "en": "The ring attacks methyl carbon as C-Cl breaks.",
          "fa": "حلقه به کربن متیل حمله می‌کند و ⁦C-Cl⁩ می‌شکند."
        },
        "atoms": [
          {"id": "c1", "el": "C", "x": 232.0, "y": 85.0, "bare": true},
          {"id": "c2", "el": "C", "x": 196.0, "y": 147.354, "bare": true},
          {"id": "c3", "el": "C", "x": 124.0, "y": 147.354, "bare": true},
          {"id": "c4", "el": "C", "x": 88.0, "y": 85.0, "bare": true},
          {"id": "c5", "el": "C", "x": 124.0, "y": 22.646, "bare": true},
          {"id": "c6", "el": "C", "x": 196.0, "y": 22.646, "bare": true},
          {"id": "r", "el": "CH₃", "x": 337, "y": 85, "charge": "δ+"},
          {"id": "cl", "el": "Cl", "x": 409, "y": 85, "charge": "δ−", "lp": {"n": 3, "angles": [150, 210, 0]}}
        ],
        "bonds": [
          {"a": "c1", "b": "c2", "order": 2},
          {"a": "c2", "b": "c3"},
          {"a": "c3", "b": "c4", "order": 2},
          {"a": "c4", "b": "c5"},
          {"a": "c5", "b": "c6", "order": 2},
          {"a": "c6", "b": "c1"},
          {"a": "r", "b": "cl"},
          {"a": "c1", "b": "r", "dash": true}
        ],
        "curves": [
          {"from": "bond:c1:c2", "to": "r", "bulge": 30},
          {"from": "bond:cl:r", "to": "cl", "bulge": -26}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "AlCl₃-bound chloride; ligation omitted", "size": 10, "color": "slate"}
        ]
      },
      {
        "caption": {
          "en": "AlCl₄⁻ removes H and restores aromaticity.",
          "fa": "⁦AlCl₄⁻⁩ پروتون را می‌گیرد و آروماتیسیته بازمی‌گردد."
        },
        "atoms": [
          {"id": "c1", "el": "C", "x": 232.0, "y": 85.0, "bare": true},
          {"id": "c2", "el": "CH", "x": 196.0, "y": 147.354, "charge": "+"},
          {"id": "c3", "el": "C", "x": 124.0, "y": 147.354, "bare": true},
          {"id": "c4", "el": "C", "x": 88.0, "y": 85.0, "bare": true},
          {"id": "c5", "el": "C", "x": 124.0, "y": 22.646, "bare": true},
          {"id": "c6", "el": "C", "x": 196.0, "y": 22.646, "bare": true},
          {"id": "e", "el": "CH₃", "x": 294.354, "y": 49},
          {"id": "h", "el": "H", "x": 294.354, "y": 121},
          {"id": "base", "el": "Cl", "x": 399.354, "y": 121, "lp": {"n": 3, "angles": [270, 0, 180]}},
          {"id": "al", "el": "AlCl₃", "x": 471.354, "y": 121, "charge": "−"}
        ],
        "bonds": [
          {"a": "c1", "b": "c2"},
          {"a": "c2", "b": "c3"},
          {"a": "c3", "b": "c4", "order": 2},
          {"a": "c4", "b": "c5"},
          {"a": "c5", "b": "c6", "order": 2},
          {"a": "c6", "b": "c1"},
          {"a": "c1", "b": "e"},
          {"a": "c1", "b": "h"},
          {"a": "base", "b": "al"}
        ],
        "curves": [
          {"from": "bond:al:base", "to": "h", "bulge": 36},
          {"from": "bond:c1:h", "to": "bond:c1:c2", "bulge": -26}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "AlCl₄⁻ written Cl-AlCl₃⁻; complex charge condensed", "size": 10, "color": "slate"}
        ]
      },
      {
        "caption": {
          "en": "Toluene forms and AlCl₃ is regenerated.",
          "fa": "تولوئن تشکیل و ⁦AlCl₃⁩ بازتولید می‌شود."
        },
        "atoms": [
          {"id": "c1", "el": "C", "x": 232.0, "y": 85.0, "bare": true},
          {"id": "c2", "el": "C", "x": 196.0, "y": 147.354, "bare": true},
          {"id": "c3", "el": "C", "x": 124.0, "y": 147.354, "bare": true},
          {"id": "c4", "el": "C", "x": 88.0, "y": 85.0, "bare": true},
          {"id": "c5", "el": "C", "x": 124.0, "y": 22.646, "bare": true},
          {"id": "c6", "el": "C", "x": 196.0, "y": 22.646, "bare": true},
          {"id": "e", "el": "CH₃", "x": 304, "y": 85}
        ],
        "bonds": [
          {"a": "c1", "b": "c2", "order": 2},
          {"a": "c2", "b": "c3"},
          {"a": "c3", "b": "c4", "order": 2},
          {"a": "c4", "b": "c5"},
          {"a": "c5", "b": "c6", "order": 2},
          {"a": "c6", "b": "c1"},
          {"a": "c1", "b": "e"}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "+ HCl; alkylation can continue", "size": 10, "color": "slate"}
        ]
      }
    ],
    "connectors": ["→", "→", "→"]
  },
  "aromatic-hydrogenation-resistance": {
    "title": {
      "en": "Benzene hydrogenation requires stronger conditions",
      "fa": "هیدروژن‌دارکردن بنزن به شرایط شدیدتر نیاز دارد"
    },
    "footnote": {
      "en": "Benzene can be hydrogenated to cyclohexane with three H₂ equivalents over an appropriate catalyst, typically under stronger conditions than an isolated alkene. Aromatic stabilization is about 150 kJ/mol relative to a hypothetical localized triene; that value is not an activation energy or a claim that hydrogenation is endothermic. Cyclohexane is nonplanar; its polygon here specifies connectivity only.",
      "fa": "بنزن با سه هم‌ارز ⁦H₂⁩ و کاتالیزور مناسب، معمولاً در شرایط شدیدتر از آلکن مجزا، به سیکلوهگزان تبدیل می‌شود. پایداری آروماتیک نسبت به تری‌اِن فرضیِ دارای پیوندهای موضعی حدود ۱۵۰ کیلوژول بر مول است؛ این مقدار انرژی فعال‌سازی نیست و به معنای گرماگیر بودن هیدروژن‌دارکردن نیست. سیکلوهگزان غیرتخت است و چندضلعی آن در اینجا فقط اتصال اتم‌ها را نشان می‌دهد."
    },
    "frames": [
      {
        "caption": {
          "en": "Aromatic stabilization makes benzene harder to reduce.",
          "fa": "پایداری آروماتیک، کاهش بنزن را دشوارتر می‌کند."
        },
        "atoms": [
          {"id": "c1", "el": "C", "x": 232.0, "y": 85.0, "bare": true},
          {"id": "c2", "el": "C", "x": 196.0, "y": 147.354, "bare": true},
          {"id": "c3", "el": "C", "x": 124.0, "y": 147.354, "bare": true},
          {"id": "c4", "el": "C", "x": 88.0, "y": 85.0, "bare": true},
          {"id": "c5", "el": "C", "x": 124.0, "y": 22.646, "bare": true},
          {"id": "c6", "el": "C", "x": 196.0, "y": 22.646, "bare": true}
        ],
        "bonds": [
          {"a": "c1", "b": "c2", "order": 2},
          {"a": "c2", "b": "c3"},
          {"a": "c3", "b": "c4", "order": 2},
          {"a": "c4", "b": "c5"},
          {"a": "c5", "b": "c6", "order": 2},
          {"a": "c6", "b": "c1"}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "3 H₂, Ni / heat / pressure; overall transformation", "size": 10, "color": "slate"}
        ]
      },
      {
        "caption": {
          "en": "Hydrogenation gives nonplanar cyclohexane.",
          "fa": "هیدروژن‌دارکردن، سیکلوهگزان غیرتخت تولید می‌کند."
        },
        "atoms": [
          {"id": "c1", "el": "C", "x": 232.0, "y": 85.0, "bare": true},
          {"id": "c2", "el": "C", "x": 196.0, "y": 147.354, "bare": true},
          {"id": "c3", "el": "C", "x": 124.0, "y": 147.354, "bare": true},
          {"id": "c4", "el": "C", "x": 88.0, "y": 85.0, "bare": true},
          {"id": "c5", "el": "C", "x": 124.0, "y": 22.646, "bare": true},
          {"id": "c6", "el": "C", "x": 196.0, "y": 22.646, "bare": true}
        ],
        "bonds": [
          {"a": "c1", "b": "c2"},
          {"a": "c2", "b": "c3"},
          {"a": "c3", "b": "c4"},
          {"a": "c4", "b": "c5"},
          {"a": "c5", "b": "c6"},
          {"a": "c6", "b": "c1"}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "C₆H₁₂; connectivity polygon, not a planar conformer", "size": 10, "color": "slate"}
        ]
      }
    ],
    "connectors": ["→several"]
  }
};
