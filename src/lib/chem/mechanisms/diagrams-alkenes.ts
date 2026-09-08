import type { MechanismDiagram } from "./diagram-types";

/** Static mechanism data; see README.md for renderer and projection assumptions. */
export const ALKENE_DIAGRAMS: Record<string, MechanismDiagram> = {
  "alkene-hx": {
    "title": {
      "en": "HBr addition: Markovnikov regioselectivity",
      "fa": "افزایش ⁦HBr⁩: جایگاه‌گزینی مارکوفنیکوف"
    },
    "footnote": {
      "en": "Protonation of propene puts H on the terminal carbon and positive charge on the secondary carbon. Bromide then donates a lone pair to that carbon. These are ionic conditions without peroxide; suitable carbocations may rearrange.",
      "fa": "پروتون‌گیری پروپن، ⁦H⁩ را روی کربن انتهایی و بار مثبت را روی کربن نوع دوم قرار می‌دهد. سپس برومید با جفت‌الکترون خود به همان کربن حمله می‌کند. این مسیر یونی و بدون پراکسید است؛ کربوکاتیون‌های مناسب می‌توانند بازآرایی کنند."
    },
    "frames": [
      {
        "caption": {
          "en": "The alkene π pair attacks H as H-Br breaks.",
          "fa": "جفت‌الکترون ⁦π⁩ به ⁦H⁩ حمله می‌کند و ⁦H-Br⁩ می‌شکند."
        },
        "atoms": [
          {"id": "c1", "el": "CH₂", "x": 170, "y": 90},
          {"id": "c2", "el": "CH", "x": 242, "y": 90},
          {"id": "r", "el": "CH₃", "x": 278, "y": 152.354},
          {"id": "h", "el": "H", "x": 330, "y": 35, "charge": "δ+"},
          {"id": "br", "el": "Br", "x": 402, "y": 35, "charge": "δ−", "lp": {"n": 3, "angles": [150, 210, 0]}}
        ],
        "bonds": [
          {"a": "c1", "b": "c2", "order": 2},
          {"a": "c2", "b": "r"},
          {"a": "h", "b": "br"}
        ],
        "curves": [
          {"from": "bond:c1:c2", "to": "h", "bulge": -34},
          {"from": "bond:br:h", "to": "br", "bulge": -28}
        ]
      },
      {
        "caption": {
          "en": "Bromide captures the carbocation.",
          "fa": "برومید به کربوکاتیون حمله می‌کند."
        },
        "atoms": [
          {"id": "c1", "el": "CH₃", "x": 155, "y": 90},
          {"id": "c2", "el": "C", "x": 227, "y": 90, "charge": "+"},
          {"id": "r", "el": "CH₃", "x": 263, "y": 152.354},
          {"id": "h", "el": "H", "x": 263, "y": 27.646},
          {"id": "br", "el": "Br", "x": 332, "y": 90, "charge": "−", "lp": {"n": 4, "angles": [150, 210, 0, 90]}}
        ],
        "bonds": [
          {"a": "c1", "b": "c2"},
          {"a": "c2", "b": "r"},
          {"a": "c2", "b": "h"},
          {"a": "br", "b": "c2", "dash": true}
        ],
        "curves": [
          {"from": "br", "to": "c2", "bulge": -32}
        ]
      },
      {
        "caption": {
          "en": "Br bonds to secondary carbon.",
          "fa": "⁦Br⁩ به کربن نوع دوم متصل می‌شود."
        },
        "atoms": [
          {"id": "c", "el": "C", "x": 230, "y": 90, "bare": true},
          {"id": "o", "el": "Br", "x": 230, "y": 18, "lp": {"n": 3, "angles": [0, 90, 270]}},
          {"id": "r", "el": "CH₃", "x": 162.342, "y": 114.625},
          {"id": "g", "el": "CH₃", "x": 297.658, "y": 114.625},
          {"id": "nu", "el": "H", "x": 230, "y": 162}
        ],
        "bonds": [
          {"a": "c", "b": "o"},
          {"a": "c", "b": "r"},
          {"a": "c", "b": "g"},
          {"a": "c", "b": "nu"}
        ],
        "labels": [
          {"x": 410, "y": 28, "text": "Propene + HBr →", "size": 10, "color": "slate"},
          {"x": 410, "y": 42, "text": "2-bromopropane", "size": 10, "color": "slate"}
        ]
      }
    ],
    "connectors": ["→", "→"]
  },
  "alkene-x2": {
    "title": {
      "en": "Bromination through a bromonium ion",
      "fa": "برم‌دارکردن از مسیر یون برومونیوم"
    },
    "footnote": {
      "en": "The alkene π pair attacks polarized Br₂, the Br-Br pair leaves, and a bromine lone pair closes the three-membered bridge. Br⁻ attacks from the opposite face, breaking one C-Br bridge bond. Ethene illustrates connectivity; anti stereochemistry for substituted alkenes requires wedge/dash notation, which this DSL lacks.",
      "fa": "جفت‌الکترون ⁦π⁩ به ⁦Br₂⁩ قطبی حمله می‌کند، جفت‌الکترون ⁦Br-Br⁩ جدا می‌شود و جفت‌الکترون بروم، پل سه‌عضوی را می‌بندد. برومید از وجه مقابل حمله می‌کند و یک پیوند پل ⁦C-Br⁩ را می‌شکند. اتن اتصال اتم‌ها را نشان می‌دهد؛ نمایش فضایی افزایش پاد در آلکن‌های جانشین‌دار به پیوند گوه‌ای نیاز دارد که در این ⁦DSL⁩ وجود ندارد."
    },
    "frames": [
      {
        "caption": {
          "en": "A bromonium bridge forms.",
          "fa": "پل برومونیوم تشکیل می‌شود."
        },
        "atoms": [
          {"id": "c1", "el": "CH₂", "x": 190, "y": 130},
          {"id": "c2", "el": "CH₂", "x": 262, "y": 130},
          {"id": "br1", "el": "Br", "x": 226, "y": 30, "charge": "δ+", "lp": {"n": 3, "angles": [255, 0, 120]}},
          {"id": "br2", "el": "Br", "x": 298, "y": 30, "charge": "δ−", "lp": {"n": 3, "angles": [150, 210, 0]}}
        ],
        "bonds": [
          {"a": "c1", "b": "c2", "order": 2},
          {"a": "br1", "b": "br2"},
          {"a": "br1", "b": "c1", "dash": true},
          {"a": "br1", "b": "c2", "dash": true}
        ],
        "curves": [
          {"from": "bond:c1:c2", "to": "br1", "bulge": 35},
          {"from": "bond:br1:br2", "to": "br2", "bulge": -28},
          {"from": "br1", "to": "c1", "bulge": 35}
        ]
      },
      {
        "caption": {
          "en": "Bromide opens the bridge from behind.",
          "fa": "برومید از پشت، پل را باز می‌کند."
        },
        "atoms": [
          {"id": "c1", "el": "CH₂", "x": 190, "y": 105},
          {"id": "c2", "el": "CH₂", "x": 262, "y": 105},
          {"id": "br1", "el": "Br", "x": 226, "y": 42.646, "charge": "+", "lp": {"n": 2, "angles": [105, 255]}},
          {"id": "br2", "el": "Br", "x": 367, "y": 105, "charge": "−", "lp": {"n": 4, "angles": [150, 210, 0, 90]}}
        ],
        "bonds": [
          {"a": "c1", "b": "c2"},
          {"a": "c1", "b": "br1"},
          {"a": "c2", "b": "br1"},
          {"a": "br2", "b": "c2", "dash": true}
        ],
        "curves": [
          {"from": "br2", "to": "c2", "bulge": 32},
          {"from": "bond:br1:c2", "to": "br1", "bulge": 30}
        ]
      },
      {
        "caption": {
          "en": "Ring opening gives the vicinal dibromide.",
          "fa": "بازشدن حلقه، دی‌برومید مجاور تولید می‌کند."
        },
        "atoms": [
          {"id": "c1", "el": "CH₂", "x": 190, "y": 95},
          {"id": "c2", "el": "CH₂", "x": 262, "y": 95},
          {"id": "br1", "el": "Br", "x": 154, "y": 32.646, "lp": {"n": 3, "angles": [330, 60, 240]}},
          {"id": "br2", "el": "Br", "x": 298, "y": 157.354, "lp": {"n": 3, "angles": [150, 240, 60]}}
        ],
        "bonds": [
          {"a": "c1", "b": "c2"},
          {"a": "c1", "b": "br1"},
          {"a": "c2", "b": "br2"}
        ],
        "labels": [
          {"x": 410, "y": 28, "text": "Anti addition;", "size": 10, "color": "slate"},
          {"x": 410, "y": 42, "text": "connectivity projection", "size": 10, "color": "slate"},
          {"x": 410, "y": 56, "text": "only", "size": 10, "color": "slate"}
        ]
      }
    ],
    "connectors": ["→", "→"]
  },
  "alkene-hydration": {
    "title": {
      "en": "Acid-catalyzed hydration of propene",
      "fa": "آب‌افزایی پروپن با کاتالیز اسیدی"
    },
    "footnote": {
      "en": "Hydronium protonates the terminal alkene carbon, water captures the secondary carbocation, and another water removes an O-H proton. The alcohol is Markovnikov and the acid catalyst is regenerated. Carbocation rearrangements and reversible dehydration are possible for suitable substrates.",
      "fa": "هیدرونیوم به کربن انتهایی آلکن پروتون می‌دهد، آب به کربوکاتیون نوع دوم حمله می‌کند و آب دیگری پروتون ⁦O-H⁩ را می‌گیرد. الکل حاصل، محصول مارکوفنیکوف است و کاتالیزور اسیدی بازتولید می‌شود. در بسترهای مناسب، بازآرایی کربوکاتیون و آب‌زدایی برگشت‌پذیر ممکن‌اند."
    },
    "frames": [
      {
        "caption": {
          "en": "Hydronium protonates the alkene π bond.",
          "fa": "یون هیدرونیوم به پیوند ⁦π⁩ آلکن پروتون می‌دهد."
        },
        "atoms": [
          {"id": "c1", "el": "CH₂", "x": 170, "y": 90},
          {"id": "c2", "el": "CH", "x": 242, "y": 90},
          {"id": "r", "el": "CH₃", "x": 278, "y": 152.354},
          {"id": "hp", "el": "H", "x": 330, "y": 35},
          {"id": "w", "el": "OH₂", "x": 402, "y": 35, "charge": "+", "lp": {"n": 1, "angles": [150]}}
        ],
        "bonds": [
          {"a": "c1", "b": "c2", "order": 2},
          {"a": "c2", "b": "r"},
          {"a": "hp", "b": "w"}
        ],
        "curves": [
          {"from": "bond:c1:c2", "to": "hp", "bulge": -32},
          {"from": "bond:hp:w", "to": "w", "bulge": -26}
        ]
      },
      {
        "caption": {
          "en": "Water attacks the secondary carbocation.",
          "fa": "آب به کربوکاتیون نوع دوم حمله می‌کند."
        },
        "atoms": [
          {"id": "c1", "el": "CH₃", "x": 155, "y": 90},
          {"id": "c2", "el": "C", "x": 227, "y": 90, "charge": "+"},
          {"id": "r", "el": "CH₃", "x": 263, "y": 152.354},
          {"id": "h", "el": "H", "x": 263, "y": 27.646},
          {"id": "w", "el": "OH₂", "x": 332, "y": 90, "lp": {"n": 2, "angles": [90, 0]}}
        ],
        "bonds": [
          {"a": "c1", "b": "c2"},
          {"a": "c2", "b": "r"},
          {"a": "c2", "b": "h"},
          {"a": "w", "b": "c2", "dash": true}
        ],
        "curves": [
          {"from": "w", "to": "c2", "bulge": -32}
        ]
      },
      {
        "caption": {
          "en": "Water deprotonates the oxonium intermediate.",
          "fa": "آب از میانجی اکسونیوم پروتون می‌گیرد."
        },
        "atoms": [
          {"id": "c", "el": "C", "x": 230, "y": 90, "bare": true},
          {"id": "o", "el": "OH", "x": 230, "y": 18, "charge": "+", "lp": {"n": 1, "angles": [240]}},
          {"id": "r", "el": "CH₃", "x": 162.342, "y": 114.625},
          {"id": "g", "el": "CH₃", "x": 297.658, "y": 114.625},
          {"id": "nu", "el": "H", "x": 230, "y": 162},
          {"id": "hp", "el": "H", "x": 302, "y": 18},
          {"id": "w", "el": "OH₂", "x": 407, "y": 18, "lp": {"n": 2, "angles": [0, 180]}}
        ],
        "bonds": [
          {"a": "c", "b": "o"},
          {"a": "c", "b": "r"},
          {"a": "c", "b": "g"},
          {"a": "c", "b": "nu"},
          {"a": "o", "b": "hp"}
        ],
        "curves": [
          {"from": "w", "to": "hp", "bulge": -26},
          {"from": "bond:hp:o", "to": "o", "bulge": 28}
        ]
      },
      {
        "caption": {
          "en": "Alcohol forms; acid is regenerated.",
          "fa": "الکل تشکیل و اسید بازتولید می‌شود."
        },
        "atoms": [
          {"id": "c", "el": "C", "x": 230, "y": 90, "bare": true},
          {"id": "o", "el": "OH", "x": 230, "y": 18, "lp": {"n": 2, "angles": [0, 90]}},
          {"id": "r", "el": "CH₃", "x": 162.342, "y": 114.625},
          {"id": "g", "el": "CH₃", "x": 297.658, "y": 114.625},
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
    "connectors": ["⇌", "⇌", "⇌"]
  },
  "alkene-kmn04-syn": {
    "title": {
      "en": "Syn dihydroxylation with permanganate",
      "fa": "دی‌هیدروکسیل‌دارکردن سین با پرمنگنات"
    },
    "footnote": {
      "en": "Cold dilute permanganate gives syn dihydroxylation through a cyclic Mn(V) ester. The MnO₂ fragment inside the anionic ester abbreviates two terminal oxo ligands; it is not solid MnO₂. Hydrolysis and subsequent manganese redox chemistry release the diol and brown MnO₂. These are overview panels, not invented elementary electron arrows; hot concentrated oxidant can cleave C-C bonds.",
      "fa": "پرمنگنات رقیق و سرد از مسیر استر حلقوی ⁦Mn(V)⁩، دی‌هیدروکسیل‌دارکردن سین انجام می‌دهد. گروه ⁦MnO₂⁩ در استر آنیونی، نمایش فشردهٔ دو لیگاند اکسو است و رسوب ⁦MnO₂⁩ نیست. هیدرولیز و واکنش‌های بعدی منگنز، دی‌اُل و رسوب قهوه‌ای ⁦MnO₂⁩ می‌دهند. قاب‌ها مرور مسیرند، نه گام‌های ابتدایی با پیکان فرضی؛ اکسندهٔ غلیظ و داغ می‌تواند پیوند ⁦C-C⁩ را بشکند."
    },
    "frames": [
      {
        "caption": {
          "en": "Cold KMnO₄ adds oxygen syn.",
          "fa": "⁦KMnO₄⁩ سرد، اکسیژن‌ها را سین می‌افزاید."
        },
        "atoms": [
          {"id": "c1", "el": "CH₂", "x": 170, "y": 90},
          {"id": "c2", "el": "CH", "x": 242, "y": 90},
          {"id": "r", "el": "CH₃", "x": 278, "y": 152.354}
        ],
        "bonds": [
          {"a": "c1", "b": "c2", "order": 2},
          {"a": "c2", "b": "r"}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "Cold, dilute KMnO₄ / OH⁻; overall addition", "size": 10, "color": "slate"}
        ]
      },
      {
        "caption": {
          "en": "A cyclic Mn(V) ester forms.",
          "fa": "استر حلقوی ⁦Mn(V)⁩ تشکیل می‌شود."
        },
        "atoms": [
          {"id": "mn", "el": "MnO₂", "x": 230.0, "y": 26.753, "charge": "−"},
          {"id": "o2", "el": "O", "x": 288.249, "y": 69.074, "lp": {"n": 2, "angles": [75, 15]}},
          {"id": "c2", "el": "CH(CH₃)", "x": 266.0, "y": 137.55},
          {"id": "c1", "el": "CH₂", "x": 194.0, "y": 137.55},
          {"id": "o1", "el": "O", "x": 171.751, "y": 69.074, "lp": {"n": 2, "angles": [285, 225]}}
        ],
        "bonds": [
          {"a": "mn", "b": "o2"},
          {"a": "o2", "b": "c2"},
          {"a": "c2", "b": "c1"},
          {"a": "c1", "b": "o1"},
          {"a": "o1", "b": "mn"}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "[MnO₂(O-C-C-O)]⁻; terminal oxo groups condensed", "size": 10, "color": "slate"}
        ]
      },
      {
        "caption": {
          "en": "Hydrolysis releases the vicinal diol.",
          "fa": "هیدرولیز، دی‌اُل مجاور را آزاد می‌کند."
        },
        "atoms": [
          {"id": "c1", "el": "CH₂", "x": 190, "y": 102},
          {"id": "c2", "el": "CH", "x": 262, "y": 102},
          {"id": "o1", "el": "OH", "x": 154, "y": 39.646, "lp": {"n": 2, "angles": [330, 60]}},
          {"id": "o2", "el": "OH", "x": 298, "y": 39.646, "lp": {"n": 2, "angles": [30, 300]}},
          {"id": "r", "el": "CH₃", "x": 298, "y": 164.354}
        ],
        "bonds": [
          {"a": "c1", "b": "c2"},
          {"a": "c1", "b": "o1"},
          {"a": "c2", "b": "o2"},
          {"a": "c2", "b": "r"}
        ],
        "labels": [
          {"x": 410, "y": 28, "text": "Syn connectivity", "size": 10, "color": "slate"},
          {"x": 410, "y": 42, "text": "projection; MnO₂", "size": 10, "color": "slate"},
          {"x": 410, "y": 56, "text": "precipitates", "size": 10, "color": "slate"}
        ]
      }
    ],
    "connectors": ["→several", "→several"]
  },
  "alkene-ozonolysis": {
    "title": {
      "en": "Ozonolysis: primary and secondary ozonides",
      "fa": "اوزونولیز: اوزونید اولیه و ثانویه"
    },
    "footnote": {
      "en": "Ozone cycloaddition forms a 1,2,3-trioxolane. Fragmentation gives a carbonyl and a carbonyl oxide, which recombine as a 1,2,4-trioxolane with no C-C bond. Reductive workup converts the original alkene carbons into carbonyl carbons. Ethene gives two formaldehydes; oxidative workup can further oxidize aldehydes. Workup is summarized rather than assigned a fictitious one-step arrow.",
      "fa": "حلقه‌افزایی اوزون، ۱٬۲٬۳-تری‌اکسولان می‌سازد. شکستن آن، ترکیب کربونیلی و کربونیل‌اکسید می‌دهد که به صورت ۱٬۲٬۴-تری‌اکسولان، بدون پیوند ⁦C-C⁩، دوباره ترکیب می‌شوند. فرآوری کاهشی کربن‌های آلکن را به کربن کربونیلی تبدیل می‌کند؛ اتن دو فرمالدهید می‌دهد. در فرآوری اکسایشی، آلدهید ممکن است بیشتر اکسید شود. فرآوری نهایی به‌صورت خلاصه نشان داده شده است."
    },
    "frames": [
      {
        "caption": {
          "en": "Three pair shifts add ozone across the alkene.",
          "fa": "سه جابه‌جایی جفت‌الکترون، اوزون را به آلکن اضافه می‌کنند."
        },
        "atoms": [
          {"id": "c1", "el": "CH₂", "x": 130, "y": 105},
          {"id": "c2", "el": "CH₂", "x": 202, "y": 105},
          {"id": "o1", "el": "O", "x": 315, "y": 120, "charge": "−", "lp": {"n": 3, "angles": [180, 105, 255]}},
          {"id": "o2", "el": "O", "x": 351, "y": 57.646, "charge": "+", "lp": {"n": 1, "angles": [150]}},
          {"id": "o3", "el": "O", "x": 423, "y": 57.646, "lp": {"n": 2, "angles": [90, 0]}}
        ],
        "bonds": [
          {"a": "c1", "b": "c2", "order": 2},
          {"a": "o1", "b": "o2"},
          {"a": "o2", "b": "o3", "order": 2}
        ],
        "curves": [
          {"from": "bond:c1:c2", "to": "o3", "bulge": -64},
          {"from": "bond:o2:o3", "to": "o2", "bulge": -26},
          {"from": "o1", "to": "c1", "bulge": -32}
        ]
      },
      {
        "caption": {
          "en": "The primary ozonide fragments.",
          "fa": "اوزونید اولیه به دو گونه می‌شکند."
        },
        "atoms": [
          {"id": "o2", "el": "O", "x": 230.0, "y": 26.753, "lp": {"n": 2, "angles": [0, 60]}},
          {"id": "o3", "el": "O", "x": 288.249, "y": 69.074, "lp": {"n": 2, "angles": [75, 15]}},
          {"id": "c2", "el": "CH₂", "x": 266.0, "y": 137.55},
          {"id": "c1", "el": "CH₂", "x": 194.0, "y": 137.55},
          {"id": "o1", "el": "O", "x": 171.751, "y": 69.074, "lp": {"n": 2, "angles": [285, 225]}}
        ],
        "bonds": [
          {"a": "o2", "b": "o3"},
          {"a": "o3", "b": "c2"},
          {"a": "c2", "b": "c1"},
          {"a": "c1", "b": "o1"},
          {"a": "o1", "b": "o2"}
        ],
        "curves": [
          {"from": "bond:c1:c2", "to": "bond:c1:o1", "bulge": 24},
          {"from": "bond:o1:o2", "to": "o2", "bulge": -25},
          {"from": "o3", "to": "bond:c2:o3", "bulge": 24}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "→ carbonyl + carbonyl oxide", "size": 10, "color": "slate"}
        ]
      },
      {
        "caption": {
          "en": "The carbonyl oxide recombines with a carbonyl.",
          "fa": "کربونیل‌اکسید با یک ترکیب کربونیلی دوباره ترکیب می‌شود."
        },
        "atoms": [
          {"id": "c1", "el": "CH₂", "x": 120, "y": 100},
          {"id": "o1", "el": "O", "x": 120, "y": 28, "lp": {"n": 2, "angles": [0, 90]}},
          {"id": "c2", "el": "CH₂", "x": 300, "y": 110},
          {"id": "o3", "el": "O", "x": 372, "y": 110, "charge": "+", "lp": {"n": 1, "angles": [150]}},
          {"id": "o2", "el": "O", "x": 408, "y": 47.646, "charge": "−", "lp": {"n": 3, "angles": [120, 255, 0]}}
        ],
        "bonds": [
          {"a": "c1", "b": "o1", "order": 2},
          {"a": "c2", "b": "o3", "order": 2},
          {"a": "o3", "b": "o2"}
        ],
        "curves": [
          {"from": "o2", "to": "c1", "bulge": -32},
          {"from": "bond:c1:o1", "to": "c2", "bulge": 32},
          {"from": "bond:c2:o3", "to": "o3", "bulge": -25}
        ]
      },
      {
        "caption": {
          "en": "The ozonide has no C-C bond.",
          "fa": "اوزونید ثانویه پیوند ⁦C-C⁩ ندارد."
        },
        "atoms": [
          {"id": "o1", "el": "O", "x": 230.0, "y": 26.753, "lp": {"n": 2, "angles": [0, 60]}},
          {"id": "c2", "el": "CH₂", "x": 288.249, "y": 69.074},
          {"id": "o3", "el": "O", "x": 266.0, "y": 137.55, "lp": {"n": 2, "angles": [150, 75]}},
          {"id": "o2", "el": "O", "x": 194.0, "y": 137.55, "lp": {"n": 2, "angles": [210, 285]}},
          {"id": "c1", "el": "CH₂", "x": 171.751, "y": 69.074}
        ],
        "bonds": [
          {"a": "o1", "b": "c2"},
          {"a": "c2", "b": "o3"},
          {"a": "o3", "b": "o2"},
          {"a": "o2", "b": "c1"},
          {"a": "c1", "b": "o1"}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "1,2,4-trioxolane; reductive workup follows", "size": 10, "color": "slate"}
        ]
      },
      {
        "caption": {
          "en": "Reductive workup gives two formaldehydes.",
          "fa": "فرآوری کاهشی، دو فرمالدهید می‌دهد."
        },
        "atoms": [
          {"id": "c1", "el": "CH₂", "x": 150, "y": 105},
          {"id": "o1", "el": "O", "x": 150, "y": 33, "lp": {"n": 2, "angles": [0, 90]}},
          {"id": "c2", "el": "CH₂", "x": 350, "y": 105},
          {"id": "o2", "el": "O", "x": 350, "y": 33, "lp": {"n": 2, "angles": [0, 90]}}
        ],
        "bonds": [
          {"a": "c1", "b": "o1", "order": 2},
          {"a": "c2", "b": "o2", "order": 2}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "Zn / H₂O; ethene → 2 HCHO", "size": 10, "color": "slate"}
        ]
      }
    ],
    "connectors": ["→", "→", "→", "→several"]
  },
  "alkene-hydrogenation": {
    "title": {
      "en": "Catalytic hydrogenation at a metal surface",
      "fa": "هیدروژن‌دارکردن کاتالیزی روی سطح فلز"
    },
    "footnote": {
      "en": "H₂ dissociates on a metal surface and adsorbed alkene is hydrogenated, usually with syn delivery. The panels summarize adsorption, transfer and desorption rather than claiming a concerted elementary two-H step. M sites are schematic, not a molecular geometry model. Ethene gives ethane; substituted alkenes need true stereochemical notation to display faces.",
      "fa": "⁦H₂⁩ روی سطح فلز تفکیک می‌شود و آلکن جذب‌شده، معمولاً با انتقال سین هیدروژن، کاهش می‌یابد. قاب‌ها جذب، انتقال و واجذب را خلاصه می‌کنند و ادعای انتقال هم‌زمان دو ⁦H⁩ در یک گام ابتدایی ندارند. جایگاه‌های ⁦M⁩ طرح‌واره‌اند، نه مدل هندسی مولکولی. اتن، اتان می‌دهد؛ نمایش وجه‌ها در آلکن جانشین‌دار به نمادگذاری فضایی نیاز دارد."
    },
    "frames": [
      {
        "caption": {
          "en": "Ethene and H₂ adsorb on the metal catalyst.",
          "fa": "اتن و ⁦H₂⁩ روی کاتالیزور فلزی جذب سطحی می‌شوند."
        },
        "atoms": [
          {"id": "c1", "el": "CH₂", "x": 190, "y": 40},
          {"id": "c2", "el": "CH₂", "x": 262, "y": 40},
          {"id": "m1", "el": "M", "x": 190, "y": 145},
          {"id": "m2", "el": "M", "x": 262, "y": 145},
          {"id": "h1", "el": "H", "x": 370, "y": 60},
          {"id": "h2", "el": "H", "x": 442, "y": 60}
        ],
        "bonds": [
          {"a": "c1", "b": "c2", "order": 2},
          {"a": "h1", "b": "h2"},
          {"a": "c1", "b": "m1", "dash": true},
          {"a": "c2", "b": "m2", "dash": true}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "M = Pd, Pt or Ni; adsorption schematic", "size": 10, "color": "slate"}
        ]
      },
      {
        "caption": {
          "en": "Surface H is delivered from one face.",
          "fa": "هیدروژن سطحی از یک وجه منتقل می‌شود."
        },
        "atoms": [
          {"id": "c1", "el": "CH₂", "x": 190, "y": 40},
          {"id": "c2", "el": "CH₂", "x": 262, "y": 40},
          {"id": "h1", "el": "H", "x": 190, "y": 145},
          {"id": "h2", "el": "H", "x": 262, "y": 145}
        ],
        "bonds": [
          {"a": "c1", "b": "c2"},
          {"a": "c1", "b": "h1", "dash": true},
          {"a": "c2", "b": "h2", "dash": true}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "Syn delivery; surface intermediates summarized", "size": 10, "color": "slate"}
        ]
      },
      {
        "caption": {
          "en": "Ethane leaves the surface.",
          "fa": "اتان از سطح جدا می‌شود."
        },
        "atoms": [
          {"id": "c1", "el": "CH₃", "x": 190, "y": 85},
          {"id": "c2", "el": "CH₃", "x": 262, "y": 85}
        ],
        "bonds": [
          {"a": "c1", "b": "c2"}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "Desorption: C₂H₆ + free catalyst sites", "size": 10, "color": "slate"}
        ]
      }
    ],
    "connectors": ["→several", "→several"]
  },
  "alkene-radical-hbr": {
    "title": {
      "en": "Peroxide-initiated anti-Markovnikov HBr addition",
      "fa": "افزایش پادمارکوفنیکوف ⁦HBr⁩ با آغازگری پراکسید"
    },
    "footnote": {
      "en": "Peroxide cleavage and H abstraction generate Br radicals. Br attaches to the less substituted carbon of propene so that the remaining radical is secondary; that radical abstracts H from HBr, regenerating Br·. Each propagation has three single-electron arrows. The peroxide effect is characteristic of HBr, not a general rule for HCl or HI.",
      "fa": "شکست پراکسید و ربایش ⁦H⁩، رادیکال بروم می‌سازند. ⁦Br⁩ به کربن کم‌جانشین‌تر پروپن متصل می‌شود تا رادیکال باقی‌مانده نوع دوم باشد؛ این رادیکال از ⁦HBr⁩ هیدروژن می‌گیرد و ⁦Br⁩ را بازتولید می‌کند. هر گام انتشار سه پیکان تک‌الکترونی دارد. اثر پراکسید مشخصهٔ ⁦HBr⁩ است و قاعده‌ای عمومی برای ⁦HCl⁩ یا ⁦HI⁩ نیست."
    },
    "frames": [
      {
        "caption": {
          "en": "Heat splits the O-O bond.",
          "fa": "گرما، ⁦O-O⁩ را همگن می‌شکند."
        },
        "atoms": [
          {"id": "o1", "el": "OR", "x": 200, "y": 85, "lp": {"n": 2, "angles": [270, 0]}},
          {"id": "o2", "el": "OR", "x": 272, "y": 85, "lp": {"n": 2, "angles": [90, 0]}}
        ],
        "bonds": [
          {"a": "o1", "b": "o2"}
        ],
        "curves": [
          {"from": "bond:o1:o2", "to": "o1", "bulge": 28, "fish": true},
          {"from": "bond:o1:o2", "to": "o2", "bulge": -28, "fish": true}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "Initiation: RO-OR + Δ → 2 RO·", "size": 10, "color": "slate"}
        ]
      },
      {
        "caption": {
          "en": "H abstraction generates a Br radical.",
          "fa": "ربایش ⁦H⁩، رادیکال بروم می‌سازد."
        },
        "atoms": [
          {"id": "o", "el": "OR", "x": 100, "y": 85, "lp": {"n": 2, "angles": [270, 180]}, "rad": true},
          {"id": "h", "el": "H", "x": 205, "y": 85},
          {"id": "br", "el": "Br", "x": 277, "y": 85, "lp": {"n": 3, "angles": [90, 0, 180]}}
        ],
        "bonds": [
          {"a": "h", "b": "br"},
          {"a": "o", "b": "h", "dash": true}
        ],
        "curves": [
          {"from": "o", "to": "bond:h:o", "bulge": -24, "fish": true},
          {"from": "bond:br:h", "to": "bond:h:o", "bulge": 34, "fish": true},
          {"from": "bond:br:h", "to": "br", "bulge": -25, "fish": true}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "→ ROH + Br·", "size": 10, "color": "slate"}
        ]
      },
      {
        "caption": {
          "en": "Br· adds to give a secondary radical.",
          "fa": "افزایش ⁦Br⁩، رادیکال نوع دوم می‌سازد."
        },
        "atoms": [
          {"id": "c1", "el": "CH₂", "x": 170, "y": 90},
          {"id": "c2", "el": "CH", "x": 242, "y": 90},
          {"id": "r", "el": "CH₃", "x": 278, "y": 152.354},
          {"id": "br", "el": "Br", "x": 65, "y": 90, "lp": {"n": 3, "angles": [270, 180, 0]}, "rad": true}
        ],
        "bonds": [
          {"a": "c1", "b": "c2", "order": 2},
          {"a": "c2", "b": "r"},
          {"a": "br", "b": "c1", "dash": true}
        ],
        "curves": [
          {"from": "br", "to": "bond:br:c1", "bulge": -25, "fish": true},
          {"from": "bond:c1:c2", "to": "bond:br:c1", "bulge": 34, "fish": true},
          {"from": "bond:c1:c2", "to": "c2", "bulge": -25, "fish": true}
        ]
      },
      {
        "caption": {
          "en": "The carbon radical takes H from HBr.",
          "fa": "رادیکال کربنی یک ⁦H⁩ از ⁦HBr⁩ می‌گیرد."
        },
        "atoms": [
          {"id": "br", "el": "Br", "x": 70, "y": 95, "lp": {"n": 3, "angles": [270, 0, 180]}},
          {"id": "c1", "el": "CH₂", "x": 142, "y": 95},
          {"id": "c2", "el": "CH", "x": 214, "y": 95, "rad": true},
          {"id": "r", "el": "CH₃", "x": 250, "y": 157.354},
          {"id": "h", "el": "H", "x": 319, "y": 95},
          {"id": "br2", "el": "Br", "x": 391, "y": 95, "lp": {"n": 3, "angles": [90, 0, 180]}}
        ],
        "bonds": [
          {"a": "br", "b": "c1"},
          {"a": "c1", "b": "c2"},
          {"a": "c2", "b": "r"},
          {"a": "h", "b": "br2"},
          {"a": "c2", "b": "h", "dash": true}
        ],
        "curves": [
          {"from": "c2", "to": "bond:c2:h", "bulge": -25, "fish": true},
          {"from": "bond:br2:h", "to": "bond:c2:h", "bulge": 34, "fish": true},
          {"from": "bond:br2:h", "to": "br2", "bulge": -25, "fish": true}
        ],
        "labels": [
          {"x": 410, "y": 28, "text": "→ 1-bromopropane + Br·", "size": 10, "color": "slate"}
        ]
      },
      {
        "caption": {
          "en": "Br is on the terminal carbon.",
          "fa": "⁦Br⁩ روی کربن انتهایی قرار دارد."
        },
        "atoms": [
          {"id": "br", "el": "Br", "x": 100, "y": 100, "lp": {"n": 3, "angles": [270, 0, 180]}},
          {"id": "c1", "el": "CH₂", "x": 172, "y": 100},
          {"id": "c2", "el": "CH₂", "x": 208, "y": 37.646},
          {"id": "r", "el": "CH₃", "x": 280, "y": 37.646}
        ],
        "bonds": [
          {"a": "br", "b": "c1"},
          {"a": "c1", "b": "c2"},
          {"a": "c2", "b": "r"}
        ]
      }
    ],
    "connectors": ["→", "→", "→", "→"]
  },
  "alkene-hydroboration": {
    "title": {
      "en": "Hydroboration-oxidation of propene",
      "fa": "هیدروبوردارکردن و اکسایش پروپن"
    },
    "footnote": {
      "en": "Concerted hydroboration places B at the less substituted carbon and H at the more substituted carbon with syn delivery and no carbocation. The BH₂-H fragment is BH₃ before transfer. Further alkene additions can give R₃B. Peroxide oxidation involves attack at B, migration with retention, and hydrolysis; the final panel summarizes those steps.",
      "fa": "در هیدروبوردارکردن هم‌زمان، ⁦B⁩ روی کربن کم‌جانشین‌تر و ⁦H⁩ روی کربن پرجانشین‌تر قرار می‌گیرد؛ افزایش سین است و کربوکاتیون تشکیل نمی‌شود. قطعهٔ ⁦BH₂-H⁩ پیش از انتقال همان ⁦BH₃⁩ است. افزایش‌های بعدی می‌توانند ⁦R₃B⁩ بدهند. اکسایش پراکسیدی شامل حمله به ⁦B⁩، مهاجرت با حفظ پیکربندی و هیدرولیز است؛ قاب پایانی این مراحل را خلاصه می‌کند."
    },
    "frames": [
      {
        "caption": {
          "en": "The π pair attacks B as B-H transfers H.",
          "fa": "حمله به ⁦B⁩ و انتقال ⁦H⁩ هم‌زمان‌اند."
        },
        "atoms": [
          {"id": "c1", "el": "CH₂", "x": 190, "y": 130},
          {"id": "c2", "el": "CH(CH₃)", "x": 262, "y": 130},
          {"id": "b", "el": "BH₂", "x": 190, "y": 25, "charge": "δ+"},
          {"id": "h", "el": "H", "x": 262, "y": 25, "charge": "δ−"}
        ],
        "bonds": [
          {"a": "c1", "b": "c2", "order": 2},
          {"a": "b", "b": "h"},
          {"a": "c1", "b": "b", "dash": true},
          {"a": "c2", "b": "h", "dash": true}
        ],
        "curves": [
          {"from": "bond:c1:c2", "to": "b", "bulge": -28},
          {"from": "bond:b:h", "to": "bond:c2:h", "bulge": -28}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "Concerted four-center approach; same-face delivery", "size": 10, "color": "slate"}
        ]
      },
      {
        "caption": {
          "en": "Boron is bonded to the less substituted carbon.",
          "fa": "بور به کربن کم‌جانشین‌تر متصل می‌شود."
        },
        "atoms": [
          {"id": "b", "el": "BH₂", "x": 118, "y": 90},
          {"id": "c1", "el": "CH₂", "x": 190, "y": 90},
          {"id": "c2", "el": "CH₂", "x": 226, "y": 27.646},
          {"id": "r", "el": "CH₃", "x": 298, "y": 27.646}
        ],
        "bonds": [
          {"a": "b", "b": "c1"},
          {"a": "c1", "b": "c2"},
          {"a": "c2", "b": "r"}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "First addition shown; further additions form R₃B", "size": 10, "color": "slate"}
        ]
      },
      {
        "caption": {
          "en": "Oxidation replaces C-B by C-O with retention.",
          "fa": "اکسایش با حفظ پیکربندی، ⁦C-B⁩ را به ⁦C-O⁩ تبدیل می‌کند."
        },
        "atoms": [
          {"id": "o", "el": "OH", "x": 118, "y": 90, "lp": {"n": 2, "angles": [270, 0]}},
          {"id": "c1", "el": "CH₂", "x": 190, "y": 90},
          {"id": "c2", "el": "CH₂", "x": 226, "y": 27.646},
          {"id": "r", "el": "CH₃", "x": 298, "y": 27.646}
        ],
        "bonds": [
          {"a": "o", "b": "c1"},
          {"a": "c1", "b": "c2"},
          {"a": "c2", "b": "r"}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "H₂O₂ / OH⁻ → propan-1-ol; workup summarized", "size": 10, "color": "slate"}
        ]
      }
    ],
    "connectors": ["→", "→several"]
  },
  "alkyne-chemistry": {
    "title": {
      "en": "Alkyne chemistry: independent reaction branches",
      "fa": "شیمی آلکین‌ها: مسیرهای واکنشی مستقل"
    },
    "footnote": {
      "en": "The panels compare independent branches, not one serial mechanism: propyne plus two HBr gives 2,2-dibromopropane; but-2-yne plus H₂/Lindlar gives cis-but-2-ene; propyne plus amide gives acetylide. Only the deprotonation is drawn with elementary electron arrows. Excess H₂ with an active catalyst gives alkane; dissolving-metal reduction can give trans alkene. Neutral trivalent amine N has one pair, but NH₂⁻ has two; acetylide carbon has one.",
      "fa": "قاب‌ها مسیرهای مستقل را مقایسه می‌کنند، نه یک سازوکار زنجیره‌ای: پروپین با دو ⁦HBr⁩، ۲٬۲-دی‌بروموپروپان می‌دهد؛ بوت-۲-این با ⁦H₂⁩ و لیندلر، سیس-بوت-۲-اِن می‌دهد؛ پروپین با یون آمید، استیلید می‌سازد. فقط پروتون‌زدایی با پیکان‌های گام ابتدایی نمایش داده شده است. هیدروژن اضافی و کاتالیزور فعال، آلکان می‌دهند؛ کاهش فلز حل‌شونده می‌تواند آلکن ترانس بدهد. نیتروژن ⁦NH₂⁻⁩ دو جفت‌الکترون و کربن استیلید یک جفت‌الکترون دارد."
    },
    "frames": [
      {
        "caption": {
          "en": "Two HBr additions give a geminal dibromide.",
          "fa": "دو افزایش ⁦HBr⁩، دی‌برومید جمینال تولید می‌کنند."
        },
        "atoms": [
          {"id": "r", "el": "CH₃", "x": 110, "y": 85},
          {"id": "c1", "el": "C", "x": 182, "y": 85},
          {"id": "c2", "el": "CH", "x": 254, "y": 85}
        ],
        "bonds": [
          {"a": "r", "b": "c1"},
          {"a": "c1", "b": "c2", "order": 3}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "2 HBr, no ROOR → CH₃CBr₂CH₃ (overall)", "size": 10, "color": "slate"}
        ]
      },
      {
        "caption": {
          "en": "Both Br atoms bond to one carbon.",
          "fa": "هر دو ⁦Br⁩ به یک کربن متصل می‌شوند."
        },
        "atoms": [
          {"id": "c", "el": "C", "x": 230, "y": 90, "bare": true},
          {"id": "o", "el": "Br", "x": 230, "y": 18, "lp": {"n": 3, "angles": [0, 90, 270]}},
          {"id": "r", "el": "CH₃", "x": 162.342, "y": 114.625},
          {"id": "g", "el": "CH₃", "x": 297.658, "y": 114.625},
          {"id": "nu", "el": "Br", "x": 230, "y": 162, "lp": {"n": 3, "angles": [180, 90, 270]}}
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
          "en": "Lindlar gives cis-but-2-ene.",
          "fa": "لیندلر، سیس-بوت-۲-اِن می‌دهد."
        },
        "atoms": [
          {"id": "c1", "el": "CH", "x": 190, "y": 90},
          {"id": "c2", "el": "CH", "x": 262, "y": 90},
          {"id": "r1", "el": "CH₃", "x": 154, "y": 152.354},
          {"id": "r2", "el": "CH₃", "x": 298, "y": 152.354}
        ],
        "bonds": [
          {"a": "c1", "b": "c2", "order": 2},
          {"a": "c1", "b": "r1"},
          {"a": "c2", "b": "r2"}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "Independent branch: but-2-yne + H₂ / Lindlar", "size": 10, "color": "slate"}
        ]
      },
      {
        "caption": {
          "en": "Separately, amide removes a terminal alkyne proton.",
          "fa": "در مسیری جداگانه، یون آمید پروتون آلکین انتهایی را می‌گیرد."
        },
        "atoms": [
          {"id": "r", "el": "CH₃", "x": 90, "y": 85},
          {"id": "c1", "el": "C", "x": 162, "y": 85},
          {"id": "c2", "el": "C", "x": 234, "y": 85},
          {"id": "h", "el": "H", "x": 306, "y": 85},
          {"id": "base", "el": "NH₂", "x": 411, "y": 85, "charge": "−", "lp": {"n": 2, "angles": [180, 105]}}
        ],
        "bonds": [
          {"a": "r", "b": "c1"},
          {"a": "c1", "b": "c2", "order": 3},
          {"a": "c2", "b": "h"}
        ],
        "curves": [
          {"from": "base", "to": "h", "bulge": -28},
          {"from": "bond:c2:h", "to": "c2", "bulge": -28}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "Independent branch: propyne + NaNH₂", "size": 10, "color": "slate"}
        ]
      },
      {
        "caption": {
          "en": "The acetylide remains linear.",
          "fa": "استیلید، خطی باقی می‌ماند."
        },
        "atoms": [
          {"id": "r", "el": "CH₃", "x": 150, "y": 85},
          {"id": "c1", "el": "C", "x": 222, "y": 85},
          {"id": "c2", "el": "C", "x": 294, "y": 85, "charge": "−", "lp": {"n": 1, "angles": [150]}}
        ],
        "bonds": [
          {"a": "r", "b": "c1"},
          {"a": "c1", "b": "c2", "order": 3}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "+ NH₃; Na⁺ counterion omitted", "size": 10, "color": "slate"}
        ]
      }
    ],
    "connectors": []
  }
};
