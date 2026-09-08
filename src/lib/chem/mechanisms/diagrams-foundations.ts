import type { MechanismDiagram } from "./diagram-types";

/** Static mechanism data; see README.md for renderer and projection assumptions. */
export const FOUNDATION_DIAGRAMS: Record<string, MechanismDiagram> = {
  "sn2": {
    "title": {
      "en": "SN2: concerted backside substitution",
      "fa": "⁦SN2⁩: استخلاف هم‌زمان با حمله از پشت"
    },
    "footnote": {
      "en": "An oxygen lone pair forms C-O while the C-Br pair leaves with bromide. There is one transition state and no carbocation. This methyl example is achiral; a stereogenic substrate undergoes inversion. The condensed transition state shows only the reaction axis, not five full bonds.",
      "fa": "یک جفت‌الکترون اکسیژن پیوند ⁦C-O⁩ را می‌سازد و جفت‌الکترون ⁦C-Br⁩ همراه برومید جدا می‌شود. واکنش یک حالت گذار دارد و کربوکاتیون نمی‌سازد. نمونهٔ متیلی کایرال نیست؛ در بستر دارای مرکز کایرال، وارونگی پیکربندی رخ می‌دهد. نمایش فشردهٔ حالت گذار فقط محور واکنش را نشان می‌دهد."
    },
    "frames": [
      {
        "caption": {
          "en": "Hydroxide displaces bromide.",
          "fa": "هیدروکسید، برومید را جابه‌جا می‌کند."
        },
        "atoms": [
          {"id": "nu", "el": "HO", "x": 105, "y": 90, "charge": "−", "lp": {"n": 3, "angles": [195, 255, 0]}},
          {"id": "c", "el": "CH₃", "x": 210, "y": 90},
          {"id": "br", "el": "Br", "x": 282, "y": 90, "lp": {"n": 3, "angles": [90, 0, 180]}}
        ],
        "bonds": [
          {"a": "c", "b": "br"},
          {"a": "nu", "b": "c", "dash": true}
        ],
        "curves": [
          {"from": "nu", "to": "c", "bulge": -34},
          {"from": "bond:br:c", "to": "br", "bulge": -32}
        ]
      },
      {
        "caption": {
          "en": "One transition state joins both steps.",
          "fa": "دو تغییر در یک حالت گذار رخ می‌دهند."
        },
        "atoms": [
          {"id": "nu", "el": "HO", "x": 105, "y": 90, "charge": "δ−"},
          {"id": "c", "el": "CH₃", "x": 210, "y": 90, "charge": "δ+"},
          {"id": "br", "el": "Br", "x": 315, "y": 90, "charge": "δ−"}
        ],
        "bonds": [
          {"a": "nu", "b": "c", "dash": true},
          {"a": "c", "b": "br", "dash": true}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "[‡]  Nu···C···Br: 180°", "size": 10, "color": "slate"}
        ]
      },
      {
        "caption": {
          "en": "Methanol and bromide form.",
          "fa": "متانول و برومید تشکیل می‌شوند."
        },
        "atoms": [
          {"id": "c", "el": "CH₃", "x": 190, "y": 90},
          {"id": "o", "el": "OH", "x": 262, "y": 90, "lp": {"n": 2, "angles": [90, 0]}},
          {"id": "br", "el": "Br", "x": 400, "y": 90, "charge": "−", "lp": {"n": 4, "angles": [180, 105, 255, 0]}}
        ],
        "bonds": [
          {"a": "c", "b": "o"}
        ]
      }
    ],
    "connectors": ["→", "→"]
  },
  "sn1": {
    "title": {
      "en": "SN1: ionization, capture, deprotonation",
      "fa": "⁦SN1⁩: یونش، حملهٔ آب و پروتون‌زدایی"
    },
    "footnote": {
      "en": "C-Br heterolysis is rate-determining; water traps the planar tertiary carbocation and a second water removes a proton. The tert-butyl example is achiral. Chiral SN1 substrates can give partial racemization because ion pairs can bias attack; suitable carbocations may rearrange.",
      "fa": "شکست ناهمگن ⁦C-Br⁩ تعیین‌کنندهٔ سرعت است؛ آب به کربوکاتیون تخت نوع سوم حمله می‌کند و مولکول دیگری از آب پروتون را می‌گیرد. نمونهٔ ترت‌بوتیل کایرال نیست. در بسترهای کایرال، جفت‌یون می‌تواند حمله را جهت‌دار کند و راسمیک‌شدن کامل نباشد؛ کربوکاتیون‌های مناسب امکان بازآرایی دارند."
    },
    "frames": [
      {
        "caption": {
          "en": "Ionization gives a carbocation.",
          "fa": "یونش، کربوکاتیون می‌سازد."
        },
        "atoms": [
          {"id": "c", "el": "C", "x": 230, "y": 90, "bare": true},
          {"id": "o", "el": "Br", "x": 230, "y": 18, "lp": {"n": 3, "angles": [0, 90, 270]}},
          {"id": "r", "el": "CH₃", "x": 162.342, "y": 114.625},
          {"id": "g", "el": "CH₃", "x": 297.658, "y": 114.625},
          {"id": "nu", "el": "CH₃", "x": 230, "y": 162}
        ],
        "bonds": [
          {"a": "c", "b": "o"},
          {"a": "c", "b": "r"},
          {"a": "c", "b": "g"},
          {"a": "c", "b": "nu"}
        ],
        "curves": [
          {"from": "bond:c:o", "to": "o", "bulge": 32}
        ]
      },
      {
        "caption": {
          "en": "Water attacks the planar carbocation.",
          "fa": "آب به کربوکاتیون تخت حمله می‌کند."
        },
        "atoms": [
          {"id": "c", "el": "C", "x": 210, "y": 90, "charge": "+"},
          {"id": "r", "el": "CH₃", "x": 138.0, "y": 90.0},
          {"id": "g", "el": "CH₃", "x": 246.0, "y": 27.646},
          {"id": "m", "el": "CH₃", "x": 246.0, "y": 152.354},
          {"id": "w", "el": "OH₂", "x": 315, "y": 90, "lp": {"n": 2, "angles": [90, 0]}}
        ],
        "bonds": [
          {"a": "c", "b": "r"},
          {"a": "c", "b": "g"},
          {"a": "c", "b": "m"},
          {"a": "w", "b": "c", "dash": true}
        ],
        "curves": [
          {"from": "w", "to": "c", "bulge": -32}
        ]
      },
      {
        "caption": {
          "en": "Water removes a proton from the oxonium ion.",
          "fa": "آب یک پروتون از یون اکسونیوم می‌گیرد."
        },
        "atoms": [
          {"id": "c", "el": "C", "x": 230, "y": 90, "bare": true},
          {"id": "o", "el": "OH", "x": 230, "y": 18, "charge": "+", "lp": {"n": 1, "angles": [240]}},
          {"id": "r", "el": "CH₃", "x": 162.342, "y": 114.625},
          {"id": "g", "el": "CH₃", "x": 297.658, "y": 114.625},
          {"id": "nu", "el": "CH₃", "x": 230, "y": 162},
          {"id": "h", "el": "H", "x": 302, "y": 18},
          {"id": "w", "el": "OH₂", "x": 407, "y": 18, "lp": {"n": 2, "angles": [0, 180]}}
        ],
        "bonds": [
          {"a": "c", "b": "o"},
          {"a": "c", "b": "r"},
          {"a": "c", "b": "g"},
          {"a": "c", "b": "nu"},
          {"a": "o", "b": "h"}
        ],
        "curves": [
          {"from": "w", "to": "h", "bulge": -26},
          {"from": "bond:h:o", "to": "o", "bulge": 28}
        ]
      },
      {
        "caption": {
          "en": "Deprotonation gives tert-butanol.",
          "fa": "پروتون‌زدایی، ترت‌بوتانول تولید می‌کند."
        },
        "atoms": [
          {"id": "c", "el": "C", "x": 230, "y": 90, "bare": true},
          {"id": "o", "el": "OH", "x": 230, "y": 18, "lp": {"n": 2, "angles": [0, 90]}},
          {"id": "r", "el": "CH₃", "x": 162.342, "y": 114.625},
          {"id": "g", "el": "CH₃", "x": 297.658, "y": 114.625},
          {"id": "nu", "el": "CH₃", "x": 230, "y": 162}
        ],
        "bonds": [
          {"a": "c", "b": "o"},
          {"a": "c", "b": "r"},
          {"a": "c", "b": "g"},
          {"a": "c", "b": "nu"}
        ],
        "labels": [
          {"x": 410, "y": 28, "text": "+ H₃O⁺ + Br⁻", "size": 10, "color": "slate"}
        ]
      }
    ],
    "connectors": ["→slow", "→", "→"]
  },
  "e2-e1": {
    "title": {
      "en": "E2 elimination; comparison with E1",
      "fa": "حذف ⁦E2⁩ و مقایسه با ⁦E1⁩"
    },
    "footnote": {
      "en": "Exactly three pair arrows describe E2: base to β-H, C-H to C-C, and C-Br to Br. H and Br must be anti-periplanar. This 2-bromopropane example gives one alkene connectivity, so it does not establish Zaitsev selectivity. E1 instead ionizes first, then loses β-H; its carbocation may rearrange.",
      "fa": "⁦E2⁩ دقیقاً سه پیکان جفت‌الکترونی دارد: باز به هیدروژن ⁦β⁩، پیوند ⁦C-H⁩ به ⁦C-C⁩ و پیوند ⁦C-Br⁩ به ⁦Br⁩. هیدروژن و بروم باید در آرایش ضدِ هم‌صفحه باشند. این نمونهٔ ۲-بروموپروپان فقط یک آلکن ساختاری می‌دهد و شاهدی برای قاعدهٔ زایتسف نیست. در ⁦E1⁩ ابتدا یونش و سپس حذف هیدروژن ⁦β⁩ رخ می‌دهد و بازآرایی ممکن است."
    },
    "frames": [
      {
        "caption": {
          "en": "Base takes β-H as C=C forms and Br leaves.",
          "fa": "باز، ⁦H⁩ را می‌گیرد؛ ⁦C=C⁩ تشکیل می‌شود و ⁦Br⁩ می‌رود."
        },
        "atoms": [
          {"id": "base", "el": "OH", "x": 49, "y": 150, "charge": "−", "lp": {"n": 3, "angles": [195, 255, 0]}},
          {"id": "h", "el": "H", "x": 154, "y": 150},
          {"id": "c1", "el": "CH₂", "x": 190, "y": 87.646},
          {"id": "c2", "el": "CH", "x": 262, "y": 87.646},
          {"id": "x", "el": "Br", "x": 298, "y": 25.292, "lp": {"n": 3, "angles": [30, 300, 120]}},
          {"id": "r", "el": "CH₃", "x": 298, "y": 150}
        ],
        "bonds": [
          {"a": "base", "b": "h", "dash": true},
          {"a": "h", "b": "c1"},
          {"a": "c1", "b": "c2"},
          {"a": "c2", "b": "x"},
          {"a": "c2", "b": "r"}
        ],
        "curves": [
          {"from": "base", "to": "h", "bulge": -26},
          {"from": "bond:c1:h", "to": "bond:c1:c2", "bulge": 24},
          {"from": "bond:c2:x", "to": "x", "bulge": -28}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "H-C-C-Br: anti-periplanar projection", "size": 10, "color": "slate"}
        ]
      },
      {
        "caption": {
          "en": "Elimination gives propene.",
          "fa": "حذف، پروپن تولید می‌کند."
        },
        "atoms": [
          {"id": "c1", "el": "CH₂", "x": 190, "y": 85},
          {"id": "c2", "el": "CH", "x": 262, "y": 85},
          {"id": "r", "el": "CH₃", "x": 298, "y": 147.354}
        ],
        "bonds": [
          {"a": "c1", "b": "c2", "order": 2},
          {"a": "c2", "b": "r"}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "+ H₂O + Br⁻", "size": 10, "color": "slate"}
        ]
      }
    ],
    "connectors": ["→"]
  },
  "radical-halogenation": {
    "title": {
      "en": "Radical chlorination: initiation and chain steps",
      "fa": "کلردارکردن رادیکالی: آغاز و گام‌های زنجیره"
    },
    "footnote": {
      "en": "Each fish:true curve denotes one electron. Initiation gives Cl radicals; two propagation reactions regenerate the chain carrier. Three single-electron arrows account for each abstraction/substitution step. Coupling terminates chains but is not a required final step of each propagation cycle. Further chlorination may occur.",
      "fa": "هر پیکان با ⁦fish⁩:⁦true⁩ نشان‌دهندهٔ یک الکترون است. آغاز، رادیکال کلر می‌سازد و دو گام انتشار، حامل زنجیره را بازتولید می‌کنند. در هر گام ربایش یا استخلاف، سه پیکان تک‌الکترونی سهم الکترون‌ها را نشان می‌دهند. جفت‌شدن رادیکال‌ها مسیر پایان زنجیره است، نه گام اجباری پایان هر چرخه. کلردارشدن بیشتر نیز ممکن است."
    },
    "frames": [
      {
        "caption": {
          "en": "Light splits Cl₂.",
          "fa": "نور، ⁦Cl₂⁩ را همگن می‌شکند."
        },
        "atoms": [
          {"id": "cl1", "el": "Cl", "x": 210, "y": 85, "lp": {"n": 3, "angles": [270, 0, 180]}},
          {"id": "cl2", "el": "Cl", "x": 282, "y": 85, "lp": {"n": 3, "angles": [90, 0, 180]}}
        ],
        "bonds": [
          {"a": "cl1", "b": "cl2"}
        ],
        "curves": [
          {"from": "bond:cl1:cl2", "to": "cl1", "bulge": 30, "fish": true},
          {"from": "bond:cl1:cl2", "to": "cl2", "bulge": -30, "fish": true}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "Initiation: Cl₂ + hν → 2 Cl·", "size": 10, "color": "slate"}
        ]
      },
      {
        "caption": {
          "en": "Cl· abstracts H from methane.",
          "fa": "رادیکال ⁦Cl⁩ از متان، ⁦H⁩ می‌رباید."
        },
        "atoms": [
          {"id": "cl", "el": "Cl", "x": 100, "y": 85, "lp": {"n": 3, "angles": [270, 180, 0]}, "rad": true},
          {"id": "h", "el": "H", "x": 205, "y": 85},
          {"id": "c", "el": "CH₃", "x": 277, "y": 85}
        ],
        "bonds": [
          {"a": "c", "b": "h"},
          {"a": "cl", "b": "h", "dash": true}
        ],
        "curves": [
          {"from": "cl", "to": "bond:cl:h", "bulge": -25, "fish": true},
          {"from": "bond:c:h", "to": "bond:cl:h", "bulge": 35, "fish": true},
          {"from": "bond:c:h", "to": "c", "bulge": -27, "fish": true}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "→ HCl + CH₃·", "size": 10, "color": "slate"}
        ]
      },
      {
        "caption": {
          "en": "Methyl radical attack regenerates Cl·.",
          "fa": "حملهٔ رادیکال متیل، ⁦Cl⁩ را بازتولید می‌کند."
        },
        "atoms": [
          {"id": "c", "el": "CH₃", "x": 110, "y": 85, "rad": true},
          {"id": "cl1", "el": "Cl", "x": 215, "y": 85, "lp": {"n": 3, "angles": [0, 180, 45]}},
          {"id": "cl2", "el": "Cl", "x": 287, "y": 85, "lp": {"n": 3, "angles": [90, 0, 180]}}
        ],
        "bonds": [
          {"a": "c", "b": "cl1", "dash": true},
          {"a": "cl1", "b": "cl2"}
        ],
        "curves": [
          {"from": "c", "to": "bond:c:cl1", "bulge": -26, "fish": true},
          {"from": "bond:cl1:cl2", "to": "bond:c:cl1", "bulge": 36, "fish": true},
          {"from": "bond:cl1:cl2", "to": "cl2", "bulge": -28, "fish": true}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "→ CH₃Cl + Cl·", "size": 10, "color": "slate"}
        ]
      },
      {
        "caption": {
          "en": "Radical coupling ends a chain.",
          "fa": "جفت‌شدن، زنجیره را پایان می‌دهد."
        },
        "atoms": [
          {"id": "c1", "el": "CH₃", "x": 190, "y": 85, "rad": true},
          {"id": "c2", "el": "CH₃", "x": 295, "y": 85, "rad": true}
        ],
        "bonds": [
          {"a": "c1", "b": "c2", "dash": true}
        ],
        "curves": [
          {"from": "c1", "to": "bond:c1:c2", "bulge": -25, "fish": true},
          {"from": "c2", "to": "bond:c1:c2", "bulge": -25, "fish": true}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "Termination: 2 CH₃· → CH₃CH₃", "size": 10, "color": "slate"}
        ]
      }
    ],
    "connectors": ["→several", "→", "→several"]
  },
  "grignard-formation": {
    "title": {
      "en": "Grignard formation and protonolysis",
      "fa": "تشکیل گرینیار و پروتون‌کافت"
    },
    "footnote": {
      "en": "Formation at Mg involves surface single-electron-transfer chemistry, not a concerted pair-arrow insertion. The first panel is explicitly an overall transformation. C-Mg is polarized toward carbon; protonolysis transfers its pair to H and the O-H pair to O. Solvated aggregates are simplified; protic groups consume the reagent.",
      "fa": "تشکیل گرینیار روی سطح منیزیم شامل انتقال تک‌الکترونی است، نه درج هم‌زمان با پیکان جفت‌الکترونی. قاب نخست عمداً تبدیل کلی را نشان می‌دهد. پیوند ⁦C-Mg⁩ به سوی کربن قطبی است؛ در پروتون‌کافت، جفت‌الکترون آن به ⁦H⁩ و جفت‌الکترون ⁦O-H⁩ به اکسیژن منتقل می‌شود. تجمع و حلال‌پوشی ساده شده‌اند؛ گروه‌های پروتون‌دهنده واکنش‌گر را مصرف می‌کنند."
    },
    "frames": [
      {
        "caption": {
          "en": "Mg forms the reagent in dry ether.",
          "fa": "⁦Mg⁩ در اتر خشک، گرینیار می‌سازد."
        },
        "atoms": [
          {"id": "c", "el": "CH₃", "x": 150, "y": 85},
          {"id": "br", "el": "Br", "x": 222, "y": 85, "lp": {"n": 3, "angles": [90, 0, 180]}},
          {"id": "mg", "el": "Mg", "x": 360, "y": 85}
        ],
        "bonds": [
          {"a": "c", "b": "br"}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "Mg(0), dry Et₂O; surface SET steps omitted", "size": 10, "color": "slate"}
        ]
      },
      {
        "caption": {
          "en": "C-Mg polarization activates carbon.",
          "fa": "قطبیت ⁦C-Mg⁩، کربن را هسته‌خواه می‌کند."
        },
        "atoms": [
          {"id": "c", "el": "CH₃", "x": 160, "y": 85, "charge": "δ−"},
          {"id": "mg", "el": "Mg", "x": 232, "y": 85, "charge": "δ+"},
          {"id": "br", "el": "Br", "x": 304, "y": 85, "lp": {"n": 3, "angles": [90, 0, 180]}}
        ],
        "bonds": [
          {"a": "c", "b": "mg"},
          {"a": "mg", "b": "br"}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "Ether ligation and aggregation omitted", "size": 10, "color": "slate"}
        ]
      },
      {
        "caption": {
          "en": "The C-Mg electron pair takes a proton from water.",
          "fa": "جفت‌الکترون ⁦C-Mg⁩ یک پروتون از آب می‌گیرد."
        },
        "atoms": [
          {"id": "c", "el": "CH₃", "x": 105, "y": 100, "charge": "δ−"},
          {"id": "mg", "el": "MgBr", "x": 177, "y": 100, "charge": "δ+"},
          {"id": "h", "el": "H", "x": 280, "y": 65},
          {"id": "o", "el": "OH", "x": 352, "y": 65, "lp": {"n": 2, "angles": [90, 0]}}
        ],
        "bonds": [
          {"a": "c", "b": "mg"},
          {"a": "h", "b": "o"}
        ],
        "curves": [
          {"from": "bond:c:mg", "to": "h", "bulge": -30},
          {"from": "bond:h:o", "to": "o", "bulge": -26}
        ],
        "labels": [
          {"x": 260, "y": 175, "text": "→ CH₄ + MgBrOH", "size": 10, "color": "slate"}
        ]
      }
    ],
    "connectors": ["→several", "→"]
  }
};
