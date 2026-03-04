# Macro Target Research: Auto-Calculating Fat & Carb Targets

**Date:** 2026-03-04
**Purpose:** Research-backed formula for deriving fat and carb targets from existing calorie_target and desired_weight_lbs. Used by the MacroTriforce home screen component.

---

## The Question

Given:
- `protein_target` = 1g per lb desired body weight (already set)
- `calorie_target` = user-set (default 2000)

How should we auto-calculate `fat_target` and `carb_target`?

---

## Source 1: Mind Pump Media

**Fat recommendation:**
- Never drop fat below **25% of total calories** to keep hormones balanced
- Reference a "fat floor" at **0.3g per pound of body weight** as the minimum
- Three template splits by metabolism type:
  - Fast: 20% fat / 55% carb / 25% protein
  - Average: 30% fat / 40% carb / 30% protein
  - Slow: 55% fat / 25% carb / 20% protein

**Carb recommendation:** Fill remaining calories after protein and fat. Range: 0.75-2g/lb bodyweight.

**Sources:**
- [How To Calculate Your Macros For Rapid Weight Loss](https://www.mindpumpmedia.com/blog/how-to-calculate-your-macros-for-rapid-weight-loss)
- [Macro Guidelines for Losing Weight](https://www.mindpumpmedia.com/blog/macro-guidelines-for-losing-weight)
- [How To Eat If You Want To Pack On Muscle](https://www.mindpumpmedia.com/blog/how-to-eat-if-you-want-to-pack-on-muscle)

---

## Source 2: Alan Aragon (via Huberman Lab Podcast)

**Fat recommendation:**
- Would **not go below 20% of total calories** from fat
- Would not go below **0.3g per pound of target body weight**
- Comfortable operating range: **30-40% of calories from fat**
- Notes: 20% of a very high calorie diet (3000-4000 kcal) is fine hormonally, but 20% of a lower calorie cut can be problematic

**Carb recommendation:** Once calories and protein are matched, the ratio of carbs to fat **does not matter for fat loss**. Personal preference and adherence are the deciding factors.

**Key quote:** "Hit your protein, hit your calories, split the rest however you prefer."

**Sources:**
- [Huberman Lab: How to Lose Fat & Gain Muscle With Nutrition | Alan Aragon](https://www.hubermanlab.com/episode/how-to-lose-fat-gain-muscle-with-nutrition-alan-aragon)
- [Podcast Notes: Alan Aragon on Huberman Lab](https://podcastnotes.org/huberman-lab/alan-aragon-how-to-lose-fat-gain-muscle-with-nutrition-huberman-lab/)
- [Alan Aragon Diet Calculator](https://alanaragon.com/dietcalculator/)

---

## Source 3: Andy Galpin (via Huberman Lab Guest Series)

**Fat recommendation:** Does NOT provide a specific fat target number. Philosophy: fat and carb needs vary by context. Main guidance: fat should not be "chronically too low."

**Carb recommendation (performance-oriented):**
- Hypertrophy training: 0.5g carbs/lb bodyweight (peri-workout fuel)
- Intense conditioning: 3:1 to 4:1 carb-to-protein ratio
- Strength-focused: 1:1 carb-to-protein ratio
- Prolonged intense exercise (>60 min): 60g carbs per hour during training

**Key takeaway:** Total daily macronutrient intake matters more than timing for average person.

**Sources:**
- [Huberman Lab Guest Series: Dr. Andy Galpin - Optimal Nutrition & Supplementation](https://www.hubermanlab.com/episode/dr-andy-galpin-optimal-nutrition-and-supplementation-for-fitness)
- [FoundMyFitness: Andy Galpin](https://www.foundmyfitness.com/episodes/andy-galpin)

---

## Source 4: ISSN Position Stands (Sports Nutrition Consensus)

**Fat recommendation:**
- AMDR (Acceptable Macronutrient Distribution Range): **20-35% of total energy from fat**
- Fat intake should not go below 20% of energy
- Wide range of dietary approaches (low-fat to low-carb/keto) can be similarly effective

**Carb recommendation:**
- AMDR range: 45-65% of total energy
- No specific carb target for general fat loss — defers to individual preference
- For athletes: 8-12g carb/kg/day (very high, endurance-specific)

**Key conclusion:** Primary driver of fat loss is a **sustained caloric deficit**, not a specific macronutrient ratio.

**Sources:**
- [ISSN Position Stand: Diets and Body Composition (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC5470183/)
- [ISSN Position Stand: Nutrient Timing](https://www.tandfonline.com/doi/full/10.1186/s12970-017-0189-4)

---

## Source 5: Eric Trexler / Stronger By Science

**Fat recommendation:**
- Absolute bare minimum: **20% of total energy** to prevent drops in sex hormones
- Hard floor: **never below 30g/day** (gallstone risk, essential fatty acid deficiency)
- Practical minimum: **0.3g per pound** (what he uses with clients)
- 2021 meta-analysis (Whittaker et al.): low-fat diets (~19% of energy) induced significant reductions in total and free testosterone vs higher-fat diets (~39%)

**Carb recommendation:** Remainder after protein and fat. No specific minimum beyond performance needs.

**Sources:**
- [Stronger by Science: How Much Dietary Fat Do We Really Need?](https://www.strongerbyscience.com/dietary-fat/)
- [Macros Inc: Minimum Fat Intake](https://macrosinc.net/nutriwiki/minimum-fats/)
- [Macros Inc: Calculating Macros](https://macrosinc.net/nutriwiki/calculating-macros/)

---

## Convergence Table

| Source | Fat Minimum | Fat Comfortable Range | Carb Method |
|--------|------------|----------------------|-------------|
| Mind Pump | 25% of cal (or 0.3g/lb) | 25-30% of calories | Fill remaining |
| Alan Aragon | 20% of cal (or 0.3g/lb target) | 30-40% of calories | Fill remaining |
| Andy Galpin | "Not chronically too low" | Individualized | Performance-based |
| ISSN | 20% of cal (AMDR floor) | 20-35% of calories | 45-65% or fill remaining |
| Eric Trexler / SBS | 0.3g/lb (or 20% of cal) | 25-35% of calories | Fill remaining |

**The 0.3g/lb figure keeps appearing across sources as the floor.**
**"Fill remaining calories with carbs" is the universal approach.**

---

## Final Formula: EasyGains Auto-Calculation

### Given:
```
protein_target (g) = desired_weight_lbs   (1g per lb — already exists)
calorie_target (kcal) = user-set
```

### Step 1: Fat target
```
fat_target = desired_weight_lbs * 0.3

// Clamp to 20-35% of calories (AMDR + research consensus)
fat_calories = fat_target * 9
fat_pct = fat_calories / calorie_target

if (fat_pct < 0.20) → fat_target = (calorie_target * 0.20) / 9
if (fat_pct > 0.35) → fat_target = (calorie_target * 0.35) / 9
```

### Step 2: Carb target (fill remaining)
```
remaining_cal = calorie_target - (protein_target * 4) - (fat_target * 9)
carb_target = remaining_cal / 4

// Floor: minimum 50g to avoid accidental keto
if (carb_target < 50) → carb_target = 50
```

### Worked Examples

**A: 180 lb, 2000 cal (weight loss)**
```
protein = 180g (720 cal)
fat = 54g (486 cal, 24.3% — within range)
carbs = (2000 - 720 - 486) / 4 = 199g
Split: 36% P / 24% F / 40% C
```

**B: 150 lb, 1800 cal (weight loss)**
```
protein = 150g (600 cal)
fat = 45g (405 cal, 22.5% — within range)
carbs = (1800 - 600 - 405) / 4 = 199g
Split: 33% P / 23% F / 44% C
```

**C: 220 lb, 1800 cal (aggressive cut)**
```
protein = 220g (880 cal)
fat = 66g (594 cal, 33% — within range)
carbs = (1800 - 880 - 594) / 4 = 82g
Split: 49% P / 33% F / 18% C
Note: Carbs low but above 50g minimum. User may want to raise calorie target.
```

**D: 160 lb, 2500 cal (muscle gain)**
```
protein = 160g (640 cal)
fat = 48g → 48*9=432, 432/2500 = 17.3% — BELOW 20% floor
fat clamped to: (2500 * 0.20) / 9 = 56g
carbs = (2500 - 640 - 504) / 4 = 339g
Split: 26% P / 20% F / 54% C
```

---

## Why This Formula Works

1. **Fat at 0.3g/lb** is the convergent floor from Mind Pump, Aragon, Trexler, and Macros Inc
2. **The 20-35% clamp** aligns with ISSN AMDR and prevents edge cases
3. **Carbs as remainder** is the universal approach across every source
4. **The 50g carb minimum** prevents accidental keto
5. **Works across all goals:** weight loss naturally produces higher protein %, muscle gain pushes extra cal to carbs
