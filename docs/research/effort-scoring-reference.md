# Effort Scoring Reference: Common Workouts → Effort Score (1-10)

**Date:** 2026-03-03
**Purpose:** Reference chart mapping common workout inputs to effort scores. Based on MET values from the 2024 Adult Compendium of Physical Activities, Borg CR10 scale, and duration adjustments. Use this to evaluate whether Claude's effort assignments are reasonable, and as a basis for tuning.

---

## How This Works

**Two factors determine effort score:**

1. **Intensity (MET value)** — how hard the activity is per minute
2. **Duration** — how long you sustain it

A 10-minute easy walk and a 90-minute easy walk are NOT the same effort.

### MET → Base Effort Score

| MET Range | Base Effort | Intensity Class |
|-----------|-------------|-----------------|
| 1.0-1.9 | 1 | Sedentary |
| 2.0-2.9 | 2 | Light |
| 3.0-3.9 | 3 | Light-moderate |
| 4.0-5.0 | 4 | Moderate |
| 5.1-6.0 | 5 | Moderate-hard |
| 6.1-7.5 | 6 | Hard |
| 7.6-9.0 | 7 | Very hard |
| 9.1-11.0 | 8 | Intense |
| 11.1-14.0 | 9 | Near maximal |
| 14.1+ | 10 | Maximal |

### Duration Modifier

| Duration | Modifier |
|----------|----------|
| Under 10 min | -1.5 |
| 10-20 min | -0.5 |
| 20-45 min | 0 (baseline) |
| 45-60 min | +0.5 |
| 60-90 min | +1 |
| 90+ min | +1.5 |

**Final score = clamp(base + duration modifier, 1, 10)**

---

## Quick Reference: Common Voice Inputs

These are the things real users will say. Each row shows what the effort score SHOULD be.

### Walking

| What they say | MET | Typical Duration | Effort Score |
|---------------|-----|-----------------|--------------|
| "went for a walk" (casual, ~20 min) | 2.8 | 20 min | **2** |
| "walked for an hour" (casual) | 2.8 | 60 min | **3** |
| "went for a brisk walk" (30 min) | 4.8 | 30 min | **4** |
| "walked 5 miles" (~80 min brisk) | 4.8 | 80 min | **5** |
| "walked uphill for 30 minutes" | 5.3 | 30 min | **5** |
| "took the stairs" (5-10 min) | 6.8 | 8 min | **4** |

**Takeaway:** A single casual walk = 2. Four casual walks in a day might add up to a 3-4. Brisk/long walks are legit 4-5.

### Running

| What they say | MET | Typical Duration | Effort Score |
|---------------|-----|-----------------|--------------|
| "went for a jog" (easy, 20 min) | 6.5 | 20 min | **6** |
| "ran a mile" (moderate, ~10 min) | 9.3 | 10 min | **6** |
| "ran 3 miles" (moderate, ~30 min) | 9.3 | 30 min | **8** |
| "ran 5 miles" (moderate, ~50 min) | 9.3 | 50 min | **8** |
| "did a hard 1-mile run" (tempo) | 11.0 | 8 min | **7** |
| "all-out sprint" (short burst) | 16.8 | 2-3 min | **8** |
| "sprint intervals for 20 min" | 14+ | 20 min | **9** |
| "ran a 5K race" (race pace) | 11-13 | 25-35 min | **9** |
| "ran a half marathon" | 10-11 | 90-120 min | **10** |
| "ran a marathon" | 10-13 | 180-330 min | **10** |

**Takeaway:** A casual jog = 6. Running is inherently vigorous. Distance and pace both matter. Sprint intervals are 9, races are 9-10.

### Cycling

| What they say | MET | Typical Duration | Effort Score |
|---------------|-----|-----------------|--------------|
| "rode my bike around the neighborhood" | 4.0 | 20 min | **3** |
| "biked to work" (moderate, 20 min) | 6.8 | 20 min | **6** |
| "went for a bike ride" (moderate, 45 min) | 6.8 | 45 min | **6** |
| "did a spin class" (45-60 min) | 9.0 | 50 min | **8** |
| "went mountain biking" (60 min) | 8.5 | 60 min | **8** |
| "easy stationary bike" (30 min) | 4.0 | 30 min | **3** |

### Swimming

| What they say | MET | Typical Duration | Effort Score |
|---------------|-----|-----------------|--------------|
| "went swimming" (recreational, 30 min) | 6.0 | 30 min | **5** |
| "swam laps" (moderate, 30 min) | 8.0 | 30 min | **7** |
| "swam laps for an hour" (moderate) | 8.0 | 60 min | **8** |
| "did water aerobics" (45 min) | 5.5 | 45 min | **5** |

### Weight Training

| What they say | MET | Typical Duration | Effort Score |
|---------------|-----|-----------------|--------------|
| "light gym session" (machines, easy) | 3.5 | 30 min | **3** |
| "went to the gym" (moderate, 45 min) | 5.0 | 45 min | **5** |
| "did a solid lifting session" (60 min) | 6.0 | 60 min | **6** |
| "heavy deadlifts and squats" (60 min) | 6.0 | 60 min | **7*** |
| "hit a PR on bench" | 6.0 | 45-60 min | **8*** |
| "did a circuit workout" (30 min) | 5.8 | 30 min | **5** |
| "kettlebell workout" (30 min) | 9.8 | 30 min | **8** |

*\*Weight training MET values underestimate perceived difficulty. Heavy compound lifts and PR attempts get +1 to +2 bump because MET only measures aerobic cost, not muscular strain.*

### Bodyweight / Home Workouts

| What they say | MET | Typical Duration | Effort Score |
|---------------|-----|-----------------|--------------|
| "did some push-ups" (5-10 min) | 3.8 | 8 min | **2** |
| "did a bodyweight workout" (20 min) | 6.5 | 20 min | **5** |
| "did push-ups, pull-ups, squats" (30 min) | 7.5 | 30 min | **6** |
| "did a plank challenge" (10 min) | 2.8 | 10 min | **1** |

### Yoga / Stretching

| What they say | MET | Typical Duration | Effort Score |
|---------------|-----|-----------------|--------------|
| "stretched" (10-15 min) | 2.3 | 12 min | **1** |
| "did yoga" (hatha, 45 min) | 2.3 | 45 min | **2** |
| "did yoga" (vinyasa, 60 min) | 2.7 | 60 min | **3** |
| "did power yoga" (60 min) | 4.0 | 60 min | **4** |
| "did hot yoga" (75 min) | 8.0 | 75 min | **8** |

### HIIT / Intervals

| What they say | MET | Typical Duration | Effort Score |
|---------------|-----|-----------------|--------------|
| "did HIIT" (moderate, 20 min) | 7.0 | 20 min | **6** |
| "did HIIT" (intense, 20 min) | 11.0 | 20 min | **8** |
| "did Tabata" (4-8 min actual work) | 11.0 | 15 min | **7** |
| "did a hard HIIT class" (45 min) | 11.0 | 45 min | **9** |
| "jumped rope" (15 min) | 8.3 | 15 min | **6** |
| "jumped rope hard" (20 min) | 12.3 | 20 min | **9** |

### Sports

| What they say | MET | Typical Duration | Effort Score |
|---------------|-----|-----------------|--------------|
| "played catch" / "threw a ball around" | 3.0 | 20 min | **2** |
| "played golf" (walking, 3 hours) | 4.5 | 180 min | **6** |
| "shot some hoops" (casual) | 5.0 | 30 min | **4** |
| "played basketball" (pickup game) | 8.0 | 45 min | **7** |
| "played tennis" (singles, 60 min) | 8.0 | 60 min | **8** |
| "played soccer" (casual, 45 min) | 7.0 | 45 min | **6** |
| "played soccer" (competitive, 90 min) | 9.5 | 90 min | **9** |
| "went bowling" (60 min) | 3.5 | 60 min | **3** |
| "played volleyball" (casual) | 3.5 | 45 min | **3** |
| "did boxing/kickboxing class" (45 min) | 7.8 | 45 min | **7** |
| "rock climbing" (60 min) | 8.0 | 60 min | **8** |

### Everyday Movement

| What they say | MET | Typical Duration | Effort Score |
|---------------|-----|-----------------|--------------|
| "cleaned the house" (30 min) | 3.5 | 30 min | **3** |
| "cleaned the house" (2 hours deep clean) | 3.5 | 120 min | **5** |
| "did yard work" (30 min) | 4.0 | 30 min | **3** |
| "mowed the lawn" (push mower, 45 min) | 6.0 | 45 min | **5** |
| "shoveled snow" (30 min) | 7.5 | 30 min | **6** |
| "moved furniture / helped someone move" | 5.8 | 60 min | **6** |
| "carried groceries upstairs" | 9.0 | 10 min | **6** |

---

## Important Nuances for Claude's Prompt

### 1. Weight Training Needs a Bump
MET values for lifting (3.5-6.0) drastically underestimate how hard heavy squats feel. Subjective intensity cues matter:
- "light" / "easy" → use MET as-is
- "moderate" / "decent" → +1
- "heavy" / "hard" / "intense" → +2
- "PR" / "max" / "to failure" → +2 to +3

### 2. Duration Changes Everything
Same activity, wildly different scores:
- 10-min casual walk = **1**
- 60-min casual walk = **3**
- 10-min sprint intervals = **8**
- 30-min sprint intervals = **10** (insane)

### 3. "Competitive" vs "Casual" Matters
- Casual basketball = **4**, pickup game = **7**
- Recreational swimming = **5**, training laps = **7-8**
- Casual bike ride = **3**, spin class = **8**

### 4. Short Bursts Don't Score as High
A 5-minute plank or 3-minute sprint is intense per second, but the total effort is lower than a 30-minute sustained effort. Duration modifier prevents over-scoring.

### 5. Everyday Activity Counts
Shoveling snow (6), deep cleaning (5), moving furniture (6) are legitimate effort entries. The app should validate these, not dismiss them.

---

## Updated Effort Scale (Recommended for App)

| Score | Label | What it feels like | Example Activities |
|-------|-------|-------------------|-------------------|
| 1 | Minimal | Barely moved | Short stretch, slow 10-min stroll |
| 2 | Easy | Light movement, no sweat | Casual 20-min walk, light housework, gentle yoga |
| 3 | Light | Moving with purpose | Brisk 20-min walk, vinyasa yoga, yard work, cleaning |
| 4 | Moderate | Noticeable effort | Long walk, easy bike ride, power yoga, casual hoops |
| 5 | Steady | Working, slightly winded | Easy jog, recreational swim, moderate gym session |
| 6 | Challenging | Pushing yourself | Solid run, solid lift, casual sports game, circuit training |
| 7 | Hard | Real effort | Hard gym session, competitive sports, tempo run, spin class |
| 8 | Very Hard | Near limit for sustained work | Long hard run, heavy lifting day, HIIT, mountain biking |
| 9 | Intense | Almost all-out | Sprint intervals, race pace, tournament, hard HIIT class |
| 10 | Max | Everything you had | Competition, marathon, PR day, multi-hour endurance (rare) |

---

## Sources

- [2024 Adult Compendium of Physical Activities](https://pacompendium.com/)
- [Borg CR10 Scale - ScienceInsights](https://scienceinsights.org/what-is-the-borg-cr10-scale-for-perceived-exertion/)
- [Session-RPE Method - PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC5673663/)
- [RPE Scale - Cleveland Clinic](https://my.clevelandclinic.org/health/articles/17450-rated-perceived-exertion-rpe-scale)
- [MET Thresholds - PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC6053180/)
- [NASM - Metabolic Equivalents](https://blog.nasm.org/metabolic-equivalents-for-weight-loss)
- [CDC - Measuring Physical Activity Intensity](https://www.cdc.gov/physical-activity-basics/measuring/index.html)
- See also: `docs/research/effort-scale-research.md` for Mind Pump / Huberman protocol analysis
