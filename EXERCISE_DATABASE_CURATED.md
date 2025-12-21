# FitTrack Curated Exercise Database
## Evidence-Based Exercise Library for Production Implementation

> **Research Sources Used:**
> - PubMed EMG Studies (2018-2025)
> - NSCA & ACSM Publications
> - Journal of Strength & Conditioning Research
> - Jeff Nippard Exercise Tier Lists
> - Dr. Mike Israetel (Renaissance Periodization)
> - Brad Schoenfeld Hypertrophy Research
> - Athlean-X Injury Prevention Guidelines

---

## Table of Contents
1. [Chest Exercises](#chest-exercises)
2. [Back Exercises](#back-exercises)
3. [Shoulder Exercises](#shoulder-exercises)
4. [Biceps Exercises](#biceps-exercises)
5. [Triceps Exercises](#triceps-exercises)
6. [Quadriceps Exercises](#quadriceps-exercises)
7. [Hamstrings Exercises](#hamstrings-exercises)
8. [Glutes Exercises](#glutes-exercises)
9. [Calves Exercises](#calves-exercises)
10. [Core Exercises](#core-exercises)
11. [Full Body / Compound Exercises](#full-body-compound-exercises)
12. [Exercises to EXCLUDE](#exercises-to-exclude)
13. [Database Integration Schema](#database-integration-schema)

---

## Chest Exercises

### Tier 1 - Essential

#### 1. Flat Barbell Bench Press
```
Exercise Name: Flat Barbell Bench Press
Primary Muscle Group: chest
Secondary Muscles: triceps, anterior deltoid
Movement Pattern: horizontal push
Category: compound
Equipment Required: barbell
Difficulty Level: intermediate
Joint Stress Profile: moderate
Evidence Summary: EMG meta-analysis (MDPI 2023) confirms bench press as one of the most effective exercises for pectoralis major activation. Flat bench maximizes middle and lower pec activation (Rodriguez-Ridao et al., 2020).
Common Programming Use: main lift
Safer Alternatives: dumbbell bench press, machine chest press
Default Rep Range: 6-10
Suggested RPE: 7-9
Recovery Demand: high
System Exercise: true
```

#### 2. Incline Dumbbell Press (30°)
```
Exercise Name: Incline Dumbbell Press
Primary Muscle Group: chest
Secondary Muscles: anterior deltoid, triceps
Movement Pattern: incline push
Category: compound
Equipment Required: dumbbell
Difficulty Level: beginner
Joint Stress Profile: low
Evidence Summary: EMG study (Rodriguez-Ridao 2020) shows 30° incline maximizes upper pectoralis major (clavicular head) activation. Dumbbells allow greater ROM and individual arm work.
Common Programming Use: main lift, accessory
Safer Alternatives: machine incline press
Default Rep Range: 8-12
Suggested RPE: 7-8
Recovery Demand: moderate
System Exercise: true
```

#### 3. Machine Chest Press
```
Exercise Name: Machine Chest Press
Primary Muscle Group: chest
Secondary Muscles: triceps, anterior deltoid
Movement Pattern: horizontal push
Category: compound
Equipment Required: machine
Difficulty Level: beginner
Joint Stress Profile: low
Evidence Summary: Jeff Nippard rates S+ tier for hypertrophy. Provides stable path, easier progressive overload, and reduced injury risk while maintaining high pec activation.
Common Programming Use: main lift, accessory
Safer Alternatives: none needed
Default Rep Range: 8-12
Suggested RPE: 7-9
Recovery Demand: moderate
System Exercise: true
```

#### 4. Cable Crossover / Pec Fly (Standing)
```
Exercise Name: Cable Crossover
Primary Muscle Group: chest
Secondary Muscles: anterior deltoid
Movement Pattern: horizontal adduction
Category: isolation
Equipment Required: cable
Difficulty Level: intermediate
Joint Stress Profile: low
Evidence Summary: Provides constant tension throughout ROM unlike dumbbell flies. Jeff Nippard S-tier. Cables maintain resistance at peak contraction where dumbbells lose tension.
Common Programming Use: accessory, finisher
Safer Alternatives: pec deck machine
Default Rep Range: 10-15
Suggested RPE: 7-8
Recovery Demand: low
System Exercise: true
```

### Tier 2 - Highly Useful

#### 5. Dumbbell Bench Press (Flat)
```
Exercise Name: Dumbbell Bench Press
Primary Muscle Group: chest
Secondary Muscles: triceps, anterior deltoid
Movement Pattern: horizontal push
Category: compound
Equipment Required: dumbbell
Difficulty Level: intermediate
Joint Stress Profile: low
Evidence Summary: Allows greater stretch at bottom and individual arm work. EMG shows similar pec activation to barbell with reduced shoulder stress.
Common Programming Use: main lift, accessory
Safer Alternatives: machine chest press
Default Rep Range: 8-12
Suggested RPE: 7-8
Recovery Demand: moderate
System Exercise: true
```

#### 6. Low-to-High Cable Fly
```
Exercise Name: Low to High Cable Fly
Primary Muscle Group: chest
Secondary Muscles: anterior deltoid
Movement Pattern: incline adduction
Category: isolation
Equipment Required: cable
Difficulty Level: intermediate
Joint Stress Profile: low
Evidence Summary: Targets upper chest fibers through line of resistance. Superior to incline dumbbell fly due to constant tension.
Common Programming Use: accessory, finisher
Safer Alternatives: none needed
Default Rep Range: 12-15
Suggested RPE: 7-8
Recovery Demand: low
System Exercise: true
```

#### 7. Dip (Chest Focused)
```
Exercise Name: Chest Dip
Primary Muscle Group: chest
Secondary Muscles: triceps, anterior deltoid
Movement Pattern: vertical push
Category: compound
Equipment Required: bodyweight
Difficulty Level: intermediate
Joint Stress Profile: moderate
Evidence Summary: When performed with forward lean, effectively targets lower chest. ACE study shows high pec activation. Requires adequate shoulder mobility.
Common Programming Use: accessory
Safer Alternatives: decline press, cable crossover
Default Rep Range: 8-12
Suggested RPE: 7-9
Recovery Demand: moderate
System Exercise: true
```

### Tier 3 - Optional Variations

#### 8. Decline Barbell Bench Press
```
Exercise Name: Decline Barbell Bench Press
Primary Muscle Group: chest
Secondary Muscles: triceps
Movement Pattern: decline push
Category: compound
Equipment Required: barbell
Difficulty Level: intermediate
Joint Stress Profile: moderate
Evidence Summary: EMG shows greater lower pec activation vs flat. However, flat bench already adequately targets this area. Useful for variety.
Common Programming Use: accessory
Safer Alternatives: chest dip, high-to-low cable fly
Default Rep Range: 8-10
Suggested RPE: 7-8
Recovery Demand: moderate
System Exercise: false
```

#### 9. Push-Up
```
Exercise Name: Push-Up
Primary Muscle Group: chest
Secondary Muscles: triceps, anterior deltoid, core
Movement Pattern: horizontal push
Category: compound
Equipment Required: bodyweight
Difficulty Level: beginner
Joint Stress Profile: low
Evidence Summary: Excellent entry-level movement. Can be progressed with bands, deficit, or weighted vest. Core engagement adds functional benefit.
Common Programming Use: warm-up, finisher, home workout
Safer Alternatives: none needed
Default Rep Range: 10-20
Suggested RPE: 6-8
Recovery Demand: low
System Exercise: true
```

---

## Back Exercises

### Tier 1 - Essential

#### 1. Chest-Supported Row
```
Exercise Name: Chest Supported Row
Primary Muscle Group: back
Secondary Muscles: biceps, rear deltoid
Movement Pattern: horizontal pull
Category: compound
Equipment Required: dumbbell, machine
Difficulty Level: beginner
Joint Stress Profile: low
Evidence Summary: Jeff Nippard S-tier. Dr. Mike Israetel's preferred row variation. Eliminates lower back fatigue, allowing focus on upper back. Reduces cheating.
Common Programming Use: main lift, accessory
Safer Alternatives: machine row
Default Rep Range: 8-12
Suggested RPE: 7-9
Recovery Demand: moderate
System Exercise: true
```

#### 2. Lat Pulldown (Wide Grip)
```
Exercise Name: Wide Grip Lat Pulldown
Primary Muscle Group: back
Secondary Muscles: biceps, rear deltoid
Movement Pattern: vertical pull
Category: compound
Equipment Required: cable
Difficulty Level: beginner
Joint Stress Profile: low
Evidence Summary: ACSM (2019) confirms excellent lat activation. Allows controlled progressive overload for those unable to do pull-ups. Jeff Nippard S-tier.
Common Programming Use: main lift, accessory
Safer Alternatives: assisted pull-up machine
Default Rep Range: 8-12
Suggested RPE: 7-8
Recovery Demand: moderate
System Exercise: true
```

#### 3. Pull-Up / Chin-Up
```
Exercise Name: Pull-Up
Primary Muscle Group: back
Secondary Muscles: biceps, core
Movement Pattern: vertical pull
Category: compound
Equipment Required: bodyweight
Difficulty Level: intermediate
Joint Stress Profile: moderate
Evidence Summary: NSCA foundational movement. Superior EMG activation vs pulldowns at bodyweight. Chin-ups (supinated) increase biceps involvement.
Common Programming Use: main lift
Safer Alternatives: lat pulldown, assisted pull-up
Default Rep Range: 6-12
Suggested RPE: 7-9
Recovery Demand: moderate
System Exercise: true
```

#### 4. Barbell Row (Bent Over)
```
Exercise Name: Barbell Bent Over Row
Primary Muscle Group: back
Secondary Muscles: biceps, rear deltoid, lower back
Movement Pattern: horizontal pull
Category: compound
Equipment Required: barbell
Difficulty Level: intermediate
Joint Stress Profile: moderate
Evidence Summary: High load capacity for progressive overload. EMG shows excellent lat and rhomboid activation. Requires hip hinge competency.
Common Programming Use: main lift
Safer Alternatives: chest-supported row, cable row
Default Rep Range: 6-10
Suggested RPE: 7-9
Recovery Demand: high
System Exercise: true
```

#### 5. Seated Cable Row
```
Exercise Name: Seated Cable Row
Primary Muscle Group: back
Secondary Muscles: biceps, rear deltoid
Movement Pattern: horizontal pull
Category: compound
Equipment Required: cable
Difficulty Level: beginner
Joint Stress Profile: low
Evidence Summary: Constant tension throughout ROM. Various handle attachments allow different emphases (close grip = lats, wide = rhomboids/traps).
Common Programming Use: main lift, accessory
Safer Alternatives: machine row
Default Rep Range: 10-12
Suggested RPE: 7-8
Recovery Demand: moderate
System Exercise: true
```

### Tier 2 - Highly Useful

#### 6. Single-Arm Dumbbell Row
```
Exercise Name: Single Arm Dumbbell Row
Primary Muscle Group: back
Secondary Muscles: biceps, rear deltoid
Movement Pattern: horizontal pull
Category: compound
Equipment Required: dumbbell
Difficulty Level: beginner
Joint Stress Profile: low
Evidence Summary: Allows unilateral work to correct imbalances. Greater ROM than barbell rows. Core anti-rotation benefit.
Common Programming Use: accessory
Safer Alternatives: none needed
Default Rep Range: 8-12
Suggested RPE: 7-8
Recovery Demand: moderate
System Exercise: true
```

#### 7. Face Pull
```
Exercise Name: Face Pull
Primary Muscle Group: back
Secondary Muscles: rear deltoid, external rotators
Movement Pattern: horizontal pull
Category: isolation
Equipment Required: cable
Difficulty Level: beginner
Joint Stress Profile: low
Evidence Summary: NSCA recommends for shoulder health and posture. Targets often-neglected rear delts and external rotators. Excellent prehab exercise.
Common Programming Use: accessory, warm-up
Safer Alternatives: band pull-apart
Default Rep Range: 15-20
Suggested RPE: 6-7
Recovery Demand: low
System Exercise: true
```

#### 8. Close-Grip Lat Pulldown
```
Exercise Name: Close Grip Lat Pulldown
Primary Muscle Group: back
Secondary Muscles: biceps
Movement Pattern: vertical pull
Category: compound
Equipment Required: cable
Difficulty Level: beginner
Joint Stress Profile: low
Evidence Summary: Greater stretch on lats compared to wide grip. Increased biceps involvement. Good variation for lat development.
Common Programming Use: accessory
Safer Alternatives: none needed
Default Rep Range: 10-12
Suggested RPE: 7-8
Recovery Demand: moderate
System Exercise: true
```

### Tier 3 - Optional Variations

#### 9. Straight-Arm Lat Pulldown
```
Exercise Name: Straight Arm Lat Pulldown
Primary Muscle Group: back
Secondary Muscles: triceps (long head), core
Movement Pattern: shoulder extension
Category: isolation
Equipment Required: cable
Difficulty Level: intermediate
Joint Stress Profile: low
Evidence Summary: Isolates lats without biceps involvement. Useful for mind-muscle connection and as a pre-exhaust or finisher.
Common Programming Use: accessory, finisher
Safer Alternatives: none needed
Default Rep Range: 12-15
Suggested RPE: 7-8
Recovery Demand: low
System Exercise: false
```

#### 10. Inverted Row
```
Exercise Name: Inverted Row
Primary Muscle Group: back
Secondary Muscles: biceps, core
Movement Pattern: horizontal pull
Category: compound
Equipment Required: bodyweight
Difficulty Level: beginner
Joint Stress Profile: low
Evidence Summary: Excellent regression for those unable to do pull-ups. Scalable difficulty via body angle adjustment.
Common Programming Use: accessory, home workout
Safer Alternatives: none needed
Default Rep Range: 10-15
Suggested RPE: 6-8
Recovery Demand: low
System Exercise: true
```

---

## Shoulder Exercises

### Tier 1 - Essential

#### 1. Overhead Press (Standing Barbell)
```
Exercise Name: Standing Barbell Overhead Press
Primary Muscle Group: shoulders
Secondary Muscles: triceps, core, upper chest
Movement Pattern: vertical push
Category: compound
Equipment Required: barbell
Difficulty Level: intermediate
Joint Stress Profile: moderate
Evidence Summary: Fundamental strength movement. EMG shows high anterior deltoid activation. Standing version engages core for stability.
Common Programming Use: main lift
Safer Alternatives: seated dumbbell press, machine shoulder press
Default Rep Range: 6-10
Suggested RPE: 7-9
Recovery Demand: high
System Exercise: true
```

#### 2. Cable Lateral Raise
```
Exercise Name: Cable Lateral Raise
Primary Muscle Group: shoulders
Secondary Muscles: upper traps
Movement Pattern: abduction
Category: isolation
Equipment Required: cable
Difficulty Level: beginner
Joint Stress Profile: low
Evidence Summary: Jeff Nippard S-tier. EMG studies (2020) show constant tension throughout ROM vs dumbbells. Superior for lateral deltoid hypertrophy.
Common Programming Use: accessory
Safer Alternatives: machine lateral raise
Default Rep Range: 12-15
Suggested RPE: 7-8
Recovery Demand: low
System Exercise: true
```

#### 3. Machine Shoulder Press
```
Exercise Name: Machine Shoulder Press
Primary Muscle Group: shoulders
Secondary Muscles: triceps
Movement Pattern: vertical push
Category: compound
Equipment Required: machine
Difficulty Level: beginner
Joint Stress Profile: low
Evidence Summary: Jeff Nippard S+-tier. Stable path allows heavy loading without stability concerns. Excellent for progressive overload with reduced injury risk.
Common Programming Use: main lift, accessory
Safer Alternatives: none needed
Default Rep Range: 8-12
Suggested RPE: 7-9
Recovery Demand: moderate
System Exercise: true
```

#### 4. Dumbbell Lateral Raise
```
Exercise Name: Dumbbell Lateral Raise
Primary Muscle Group: shoulders
Secondary Muscles: upper traps
Movement Pattern: abduction
Category: isolation
Equipment Required: dumbbell
Difficulty Level: beginner
Joint Stress Profile: low
Evidence Summary: Staple shoulder isolation exercise. Systematic review (ScienceDirect 2022) confirms high lateral deltoid EMG. Use slight forward lean.
Common Programming Use: accessory
Safer Alternatives: cable lateral raise
Default Rep Range: 12-20
Suggested RPE: 7-8
Recovery Demand: low
System Exercise: true
```

### Tier 2 - Highly Useful

#### 5. Seated Dumbbell Shoulder Press
```
Exercise Name: Seated Dumbbell Shoulder Press
Primary Muscle Group: shoulders
Secondary Muscles: triceps
Movement Pattern: vertical push
Category: compound
Equipment Required: dumbbell
Difficulty Level: intermediate
Joint Stress Profile: moderate
Evidence Summary: Greater ROM than barbell. Each arm works independently. EMG shows similar deltoid activation to barbell version.
Common Programming Use: main lift, accessory
Safer Alternatives: machine shoulder press
Default Rep Range: 8-12
Suggested RPE: 7-8
Recovery Demand: moderate
System Exercise: true
```

#### 6. Reverse Pec Deck / Rear Delt Fly Machine
```
Exercise Name: Reverse Pec Deck
Primary Muscle Group: shoulders
Secondary Muscles: rhomboids, mid traps
Movement Pattern: horizontal abduction
Category: isolation
Equipment Required: machine
Difficulty Level: beginner
Joint Stress Profile: low
Evidence Summary: Systematic review shows high posterior deltoid activation. Machine provides stability for focused rear delt work.
Common Programming Use: accessory
Safer Alternatives: face pull
Default Rep Range: 12-15
Suggested RPE: 7-8
Recovery Demand: low
System Exercise: true
```

#### 7. Bent-Over Dumbbell Reverse Fly
```
Exercise Name: Bent Over Reverse Fly
Primary Muscle Group: shoulders
Secondary Muscles: rhomboids, mid traps
Movement Pattern: horizontal abduction
Category: isolation
Equipment Required: dumbbell
Difficulty Level: intermediate
Joint Stress Profile: low
Evidence Summary: Free weight alternative to reverse pec deck. Requires hip hinge position. Targets posterior deltoid effectively.
Common Programming Use: accessory
Safer Alternatives: reverse pec deck, face pull
Default Rep Range: 12-15
Suggested RPE: 7-8
Recovery Demand: low
System Exercise: true
```

### Tier 3 - Optional Variations

#### 8. Arnold Press
```
Exercise Name: Arnold Press
Primary Muscle Group: shoulders
Secondary Muscles: triceps
Movement Pattern: vertical push with rotation
Category: compound
Equipment Required: dumbbell
Difficulty Level: intermediate
Joint Stress Profile: moderate
Evidence Summary: Incorporates rotation for anterior delt emphasis. Good variation but not essential given standard pressing movements.
Common Programming Use: accessory
Safer Alternatives: standard dumbbell press
Default Rep Range: 10-12
Suggested RPE: 7-8
Recovery Demand: moderate
System Exercise: false
```

---

## Biceps Exercises

### Tier 1 - Essential

#### 1. Incline Dumbbell Curl
```
Exercise Name: Incline Dumbbell Curl
Primary Muscle Group: biceps
Secondary Muscles: brachialis
Movement Pattern: elbow flexion
Category: isolation
Equipment Required: dumbbell
Difficulty Level: beginner
Joint Stress Profile: low
Evidence Summary: EMG study (Oliveira 2013) shows highest long head activation due to stretched position at shoulder extension. Jeff Nippard A-tier.
Common Programming Use: main bicep exercise
Safer Alternatives: none needed
Default Rep Range: 10-12
Suggested RPE: 7-8
Recovery Demand: low
System Exercise: true
```

#### 2. Preacher Curl
```
Exercise Name: Preacher Curl
Primary Muscle Group: biceps
Secondary Muscles: brachialis
Movement Pattern: elbow flexion
Category: isolation
Equipment Required: dumbbell, barbell, EZ bar
Difficulty Level: beginner
Joint Stress Profile: low
Evidence Summary: EMG study (MyoMax 2025) shows greatest short head activation. Eliminates momentum and shoulder involvement. Dr. Mike preferred exercise.
Common Programming Use: main bicep exercise
Safer Alternatives: machine preacher curl
Default Rep Range: 10-12
Suggested RPE: 7-8
Recovery Demand: low
System Exercise: true
```

#### 3. Cable Curl
```
Exercise Name: Cable Curl
Primary Muscle Group: biceps
Secondary Muscles: brachialis
Movement Pattern: elbow flexion
Category: isolation
Equipment Required: cable
Difficulty Level: beginner
Joint Stress Profile: low
Evidence Summary: Provides constant tension throughout full ROM. Various attachments (straight bar, EZ, rope) offer variety. High muscle activation.
Common Programming Use: accessory
Safer Alternatives: none needed
Default Rep Range: 10-15
Suggested RPE: 7-8
Recovery Demand: low
System Exercise: true
```

### Tier 2 - Highly Useful

#### 4. Barbell Curl
```
Exercise Name: Barbell Curl
Primary Muscle Group: biceps
Secondary Muscles: brachialis, brachioradialis
Movement Pattern: elbow flexion
Category: isolation
Equipment Required: barbell
Difficulty Level: beginner
Joint Stress Profile: low
Evidence Summary: Classic biceps exercise. EMG (Marcolin 2018) shows similar activation to other curl variations. Allows heavier loading.
Common Programming Use: main bicep exercise
Safer Alternatives: EZ bar curl
Default Rep Range: 8-12
Suggested RPE: 7-8
Recovery Demand: low
System Exercise: true
```

#### 5. Hammer Curl
```
Exercise Name: Hammer Curl
Primary Muscle Group: biceps
Secondary Muscles: brachialis, brachioradialis
Movement Pattern: elbow flexion (neutral grip)
Category: isolation
Equipment Required: dumbbell
Difficulty Level: beginner
Joint Stress Profile: low
Evidence Summary: Neutral grip emphasizes brachialis and brachioradialis for overall arm thickness. EMG shows lower biceps activation but important for arm development.
Common Programming Use: accessory
Safer Alternatives: rope hammer curl
Default Rep Range: 10-12
Suggested RPE: 7-8
Recovery Demand: low
System Exercise: true
```

#### 6. Concentration Curl
```
Exercise Name: Concentration Curl
Primary Muscle Group: biceps
Secondary Muscles: none significant
Movement Pattern: elbow flexion
Category: isolation
Equipment Required: dumbbell
Difficulty Level: beginner
Joint Stress Profile: low
Evidence Summary: ACE study found highest overall biceps EMG activation. Eliminates all momentum and shoulder involvement.
Common Programming Use: accessory, finisher
Safer Alternatives: none needed
Default Rep Range: 10-15
Suggested RPE: 7-8
Recovery Demand: low
System Exercise: true
```

### Tier 3 - Optional

#### 7. EZ Bar Curl
```
Exercise Name: EZ Bar Curl
Primary Muscle Group: biceps
Secondary Muscles: brachialis
Movement Pattern: elbow flexion
Category: isolation
Equipment Required: EZ bar
Difficulty Level: beginner
Joint Stress Profile: low
Evidence Summary: Angled grip reduces wrist strain compared to straight barbell. Similar EMG activation. Good option for those with wrist discomfort.
Common Programming Use: accessory
Safer Alternatives: none needed
Default Rep Range: 10-12
Suggested RPE: 7-8
Recovery Demand: low
System Exercise: false
```

---

## Triceps Exercises

### Tier 1 - Essential

#### 1. Overhead Cable Triceps Extension
```
Exercise Name: Overhead Cable Triceps Extension
Primary Muscle Group: triceps
Secondary Muscles: none significant
Movement Pattern: elbow extension (overhead)
Category: isolation
Equipment Required: cable
Difficulty Level: beginner
Joint Stress Profile: low
Evidence Summary: Jeff Nippard S+-tier. EMG study (Maeo 2022) shows overhead position maximizes long head stretch and hypertrophy. Cable provides constant tension.
Common Programming Use: main tricep exercise
Safer Alternatives: none needed
Default Rep Range: 10-15
Suggested RPE: 7-8
Recovery Demand: low
System Exercise: true
```

#### 2. Skull Crusher (Lying Triceps Extension)
```
Exercise Name: Skull Crusher
Primary Muscle Group: triceps
Secondary Muscles: none significant
Movement Pattern: elbow extension
Category: isolation
Equipment Required: barbell, EZ bar, dumbbell
Difficulty Level: intermediate
Joint Stress Profile: moderate
Evidence Summary: Jeff Nippard S-tier. EMG shows high triceps activation. Athlean-X notes proper form critical - bar should pass over head, not to forehead.
Common Programming Use: main tricep exercise
Safer Alternatives: overhead cable extension
Default Rep Range: 10-12
Suggested RPE: 7-8
Recovery Demand: moderate
System Exercise: true
```

#### 3. Triceps Pushdown (Cable)
```
Exercise Name: Triceps Pushdown
Primary Muscle Group: triceps
Secondary Muscles: none significant
Movement Pattern: elbow extension
Category: isolation
Equipment Required: cable
Difficulty Level: beginner
Joint Stress Profile: low
Evidence Summary: ACE study confirms high triceps activation. Various attachments (bar, rope, V-bar) allow targeting different heads. Rope version shows greater lateral head activation.
Common Programming Use: main tricep exercise, accessory
Safer Alternatives: none needed
Default Rep Range: 10-15
Suggested RPE: 7-8
Recovery Demand: low
System Exercise: true
```

### Tier 2 - Highly Useful

#### 4. Close-Grip Bench Press
```
Exercise Name: Close Grip Bench Press
Primary Muscle Group: triceps
Secondary Muscles: chest, anterior deltoid
Movement Pattern: horizontal push
Category: compound
Equipment Required: barbell
Difficulty Level: intermediate
Joint Stress Profile: moderate
Evidence Summary: Compound triceps builder allowing heavy loading. EMG shows greater triceps activation than standard grip. Hands shoulder-width apart.
Common Programming Use: main lift, accessory
Safer Alternatives: machine chest press (close grip)
Default Rep Range: 6-10
Suggested RPE: 7-9
Recovery Demand: moderate
System Exercise: true
```

#### 5. Triceps Dip
```
Exercise Name: Triceps Dip
Primary Muscle Group: triceps
Secondary Muscles: chest, anterior deltoid
Movement Pattern: vertical push
Category: compound
Equipment Required: bodyweight
Difficulty Level: intermediate
Joint Stress Profile: moderate
Evidence Summary: ACE study shows high triceps EMG. Upright torso emphasizes triceps over chest. Requires adequate shoulder mobility.
Common Programming Use: main tricep exercise, accessory
Safer Alternatives: machine dip, bench dip
Default Rep Range: 8-12
Suggested RPE: 7-9
Recovery Demand: moderate
System Exercise: true
```

#### 6. Triceps Kickback
```
Exercise Name: Triceps Kickback
Primary Muscle Group: triceps
Secondary Muscles: none significant
Movement Pattern: elbow extension
Category: isolation
Equipment Required: dumbbell, cable
Difficulty Level: beginner
Joint Stress Profile: low
Evidence Summary: ACE study found similar activation to triangle push-ups and dips. Cable version provides constant tension. Good isolation exercise.
Common Programming Use: accessory, finisher
Safer Alternatives: none needed
Default Rep Range: 12-15
Suggested RPE: 7-8
Recovery Demand: low
System Exercise: true
```

### Tier 3 - Optional

#### 7. Diamond Push-Up
```
Exercise Name: Diamond Push-Up
Primary Muscle Group: triceps
Secondary Muscles: chest
Movement Pattern: horizontal push
Category: compound
Equipment Required: bodyweight
Difficulty Level: intermediate
Joint Stress Profile: moderate
Evidence Summary: ACE study found highest triceps EMG activation. Bodyweight alternative to weighted triceps exercises. Can stress wrists.
Common Programming Use: accessory, home workout
Safer Alternatives: close-grip push-up
Default Rep Range: 10-15
Suggested RPE: 7-8
Recovery Demand: low
System Exercise: true
```

---

## Quadriceps Exercises

### Tier 1 - Essential

#### 1. Barbell Back Squat
```
Exercise Name: Barbell Back Squat
Primary Muscle Group: legs
Secondary Muscles: glutes, hamstrings, core
Movement Pattern: squat
Category: compound
Equipment Required: barbell
Difficulty Level: intermediate
Joint Stress Profile: moderate
Evidence Summary: NSCA foundational movement. EMG (Martinez 2022) shows 80-90% 1RM maximizes quad/glute activation. High bar emphasizes quads. Dr. Mike Israetel top exercise.
Common Programming Use: main lift
Safer Alternatives: leg press, hack squat
Default Rep Range: 5-8
Suggested RPE: 7-9
Recovery Demand: high
System Exercise: true
```

#### 2. Hack Squat
```
Exercise Name: Hack Squat
Primary Muscle Group: legs
Secondary Muscles: glutes
Movement Pattern: squat
Category: compound
Equipment Required: machine
Difficulty Level: beginner
Joint Stress Profile: moderate
Evidence Summary: Jeff Nippard S+-tier for quads. Fixed path reduces balance demands. EMG shows excellent quad activation with reduced spinal load.
Common Programming Use: main lift, accessory
Safer Alternatives: leg press
Default Rep Range: 8-12
Suggested RPE: 7-9
Recovery Demand: high
System Exercise: true
```

#### 3. Leg Press
```
Exercise Name: Leg Press
Primary Muscle Group: legs
Secondary Muscles: glutes
Movement Pattern: squat pattern
Category: compound
Equipment Required: machine
Difficulty Level: beginner
Joint Stress Profile: moderate
Evidence Summary: Lower technical demand than free squats. Allows heavy loading with reduced injury risk. Foot position alters muscle emphasis.
Common Programming Use: main lift, accessory
Safer Alternatives: none needed
Default Rep Range: 8-12
Suggested RPE: 7-9
Recovery Demand: moderate
System Exercise: true
```

#### 4. Leg Extension
```
Exercise Name: Leg Extension
Primary Muscle Group: legs
Secondary Muscles: none significant
Movement Pattern: knee extension
Category: isolation
Equipment Required: machine
Difficulty Level: beginner
Joint Stress Profile: moderate
Evidence Summary: Only exercise isolating quads without hip involvement. EMG shows high rectus femoris activation. Jeff Nippard A-tier. Moderate loads recommended.
Common Programming Use: accessory, finisher
Safer Alternatives: none (use moderate loads)
Default Rep Range: 12-15
Suggested RPE: 7-8
Recovery Demand: low
System Exercise: true
```

### Tier 2 - Highly Useful

#### 5. Bulgarian Split Squat
```
Exercise Name: Bulgarian Split Squat
Primary Muscle Group: legs
Secondary Muscles: glutes
Movement Pattern: lunge
Category: compound
Equipment Required: dumbbell, barbell
Difficulty Level: intermediate
Joint Stress Profile: moderate
Evidence Summary: Jeff Nippard S-tier. Unilateral training corrects imbalances. EMG shows high quad activation. Greater ROM than bilateral squats.
Common Programming Use: main lift, accessory
Safer Alternatives: standard lunge
Default Rep Range: 8-12
Suggested RPE: 7-9
Recovery Demand: moderate
System Exercise: true
```

#### 6. Front Squat
```
Exercise Name: Barbell Front Squat
Primary Muscle Group: legs
Secondary Muscles: core, upper back
Movement Pattern: squat
Category: compound
Equipment Required: barbell
Difficulty Level: advanced
Joint Stress Profile: moderate
Evidence Summary: EMG (2022) shows more balanced quad/hamstring activation than back squat. Upright torso reduces shear forces. Requires wrist/thoracic mobility.
Common Programming Use: main lift
Safer Alternatives: goblet squat, hack squat
Default Rep Range: 6-10
Suggested RPE: 7-9
Recovery Demand: high
System Exercise: true
```

#### 7. Goblet Squat
```
Exercise Name: Goblet Squat
Primary Muscle Group: legs
Secondary Muscles: core, glutes
Movement Pattern: squat
Category: compound
Equipment Required: dumbbell, kettlebell
Difficulty Level: beginner
Joint Stress Profile: low
Evidence Summary: Excellent teaching tool for squat pattern. Counterbalance allows upright torso. Good for beginners and warm-ups.
Common Programming Use: warm-up, accessory
Safer Alternatives: none needed
Default Rep Range: 10-15
Suggested RPE: 6-8
Recovery Demand: low
System Exercise: true
```

### Tier 3 - Optional

#### 8. Sissy Squat
```
Exercise Name: Sissy Squat
Primary Muscle Group: legs
Secondary Muscles: none significant
Movement Pattern: knee extension
Category: isolation
Equipment Required: bodyweight
Difficulty Level: advanced
Joint Stress Profile: high
Evidence Summary: High quad stretch and activation but significant knee shear forces. Athlean-X cautions about knee stress. Use only with adequate preparation.
Common Programming Use: accessory
Safer Alternatives: leg extension, Spanish squat
Default Rep Range: 12-15
Suggested RPE: 6-7
Recovery Demand: moderate
System Exercise: false
```

---

## Hamstrings Exercises

### Tier 1 - Essential

#### 1. Seated Leg Curl
```
Exercise Name: Seated Leg Curl
Primary Muscle Group: legs
Secondary Muscles: none significant
Movement Pattern: knee flexion
Category: isolation
Equipment Required: machine
Difficulty Level: beginner
Joint Stress Profile: low
Evidence Summary: Jeff Nippard preferred over lying curl. Research shows greater hamstring hypertrophy due to stretched position at hip flexion. Direct hamstring isolation.
Common Programming Use: main hamstring exercise
Safer Alternatives: none needed
Default Rep Range: 10-12
Suggested RPE: 7-8
Recovery Demand: low
System Exercise: true
```

#### 2. Romanian Deadlift (RDL)
```
Exercise Name: Romanian Deadlift
Primary Muscle Group: legs
Secondary Muscles: glutes, lower back
Movement Pattern: hinge
Category: compound
Equipment Required: barbell, dumbbell
Difficulty Level: intermediate
Joint Stress Profile: moderate
Evidence Summary: EMG shows >60% MVIC for glutes and hamstrings. Hip hinge pattern essential for posterior chain development. Eccentric emphasis on hamstrings.
Common Programming Use: main lift, accessory
Safer Alternatives: cable pull-through
Default Rep Range: 8-12
Suggested RPE: 7-8
Recovery Demand: moderate
System Exercise: true
```

#### 3. Lying Leg Curl
```
Exercise Name: Lying Leg Curl
Primary Muscle Group: legs
Secondary Muscles: none significant
Movement Pattern: knee flexion
Category: isolation
Equipment Required: machine
Difficulty Level: beginner
Joint Stress Profile: low
Evidence Summary: Traditional hamstring isolation. Slightly less effective than seated variation for hypertrophy but still valuable. Good for variety.
Common Programming Use: accessory
Safer Alternatives: none needed
Default Rep Range: 10-12
Suggested RPE: 7-8
Recovery Demand: low
System Exercise: true
```

### Tier 2 - Highly Useful

#### 4. Stiff-Legged Deadlift
```
Exercise Name: Stiff Legged Deadlift
Primary Muscle Group: legs
Secondary Muscles: glutes, lower back
Movement Pattern: hinge
Category: compound
Equipment Required: barbell, dumbbell
Difficulty Level: intermediate
Joint Stress Profile: moderate
Evidence Summary: Greater hamstring stretch than RDL. Dr. Mike Israetel recommends. Requires good hamstring flexibility. Eccentric loading effective.
Common Programming Use: accessory
Safer Alternatives: RDL, cable pull-through
Default Rep Range: 8-12
Suggested RPE: 7-8
Recovery Demand: moderate
System Exercise: true
```

#### 5. Nordic Hamstring Curl
```
Exercise Name: Nordic Hamstring Curl
Primary Muscle Group: legs
Secondary Muscles: none significant
Movement Pattern: knee flexion (eccentric)
Category: isolation
Equipment Required: bodyweight
Difficulty Level: advanced
Joint Stress Profile: moderate
Evidence Summary: Research shows significant hamstring injury prevention benefits. Extremely challenging eccentric loading. Used by elite athletes.
Common Programming Use: accessory, prehab
Safer Alternatives: assisted Nordic, leg curl
Default Rep Range: 3-8
Suggested RPE: 8-9
Recovery Demand: high
System Exercise: true
```

---

## Glutes Exercises

### Tier 1 - Essential

#### 1. Hip Thrust (Barbell)
```
Exercise Name: Barbell Hip Thrust
Primary Muscle Group: glutes
Secondary Muscles: hamstrings
Movement Pattern: hip extension
Category: compound
Equipment Required: barbell
Difficulty Level: intermediate
Joint Stress Profile: low
Evidence Summary: Bret Contreras research (2015) shows highest glute EMG activation. Superior to squats for glute isolation. JSCR (2019) confirms hip thrust > squat for glute max activation.
Common Programming Use: main glute exercise
Safer Alternatives: glute bridge, hip thrust machine
Default Rep Range: 8-12
Suggested RPE: 7-9
Recovery Demand: moderate
System Exercise: true
```

#### 2. Glute Bridge
```
Exercise Name: Glute Bridge
Primary Muscle Group: glutes
Secondary Muscles: hamstrings
Movement Pattern: hip extension
Category: compound
Equipment Required: bodyweight, barbell
Difficulty Level: beginner
Joint Stress Profile: low
Evidence Summary: EMG shows high glute activation. Excellent regression from hip thrust. Can be loaded with barbell or dumbbell for progression.
Common Programming Use: accessory, warm-up
Safer Alternatives: none needed
Default Rep Range: 12-15
Suggested RPE: 6-8
Recovery Demand: low
System Exercise: true
```

#### 3. Cable Pull-Through
```
Exercise Name: Cable Pull Through
Primary Muscle Group: glutes
Secondary Muscles: hamstrings
Movement Pattern: hinge
Category: compound
Equipment Required: cable
Difficulty Level: beginner
Joint Stress Profile: low
Evidence Summary: Teaches hip hinge pattern safely. Constant cable tension through ROM. Good for those with lower back issues avoiding deadlifts.
Common Programming Use: accessory, learning tool
Safer Alternatives: none needed
Default Rep Range: 12-15
Suggested RPE: 7-8
Recovery Demand: low
System Exercise: true
```

### Tier 2 - Highly Useful

#### 4. Walking Lunge
```
Exercise Name: Walking Lunge
Primary Muscle Group: glutes
Secondary Muscles: quads, hamstrings
Movement Pattern: lunge
Category: compound
Equipment Required: dumbbell, barbell, bodyweight
Difficulty Level: intermediate
Joint Stress Profile: moderate
Evidence Summary: Jeff Nippard rates as top glute exercise for stimulus-to-fatigue ratio. Dynamic movement challenges stability. High glute EMG.
Common Programming Use: accessory
Safer Alternatives: stationary lunge
Default Rep Range: 10-12 per leg
Suggested RPE: 7-8
Recovery Demand: moderate
System Exercise: true
```

#### 5. Step-Up
```
Exercise Name: Step-Up
Primary Muscle Group: glutes
Secondary Muscles: quads
Movement Pattern: single-leg squat
Category: compound
Equipment Required: dumbbell, barbell
Difficulty Level: intermediate
Joint Stress Profile: low
Evidence Summary: Unilateral glute exercise with minimal equipment. Height adjustment changes difficulty. Good functional carryover.
Common Programming Use: accessory
Safer Alternatives: none needed
Default Rep Range: 10-12 per leg
Suggested RPE: 7-8
Recovery Demand: moderate
System Exercise: true
```

#### 6. Cable Kickback
```
Exercise Name: Cable Kickback
Primary Muscle Group: glutes
Secondary Muscles: hamstrings
Movement Pattern: hip extension
Category: isolation
Equipment Required: cable
Difficulty Level: beginner
Joint Stress Profile: low
Evidence Summary: Isolates glute max through hip extension. Cable provides constant tension. Good for mind-muscle connection.
Common Programming Use: accessory, finisher
Safer Alternatives: none needed
Default Rep Range: 12-15
Suggested RPE: 7-8
Recovery Demand: low
System Exercise: true
```

---

## Calves Exercises

### Tier 1 - Essential

#### 1. Standing Calf Raise
```
Exercise Name: Standing Calf Raise
Primary Muscle Group: calves
Secondary Muscles: none significant
Movement Pattern: plantar flexion
Category: isolation
Equipment Required: machine, dumbbell
Difficulty Level: beginner
Joint Stress Profile: low
Evidence Summary: Straight knee position emphasizes gastrocnemius. Research supports full ROM for muscle development. Pause at stretch important.
Common Programming Use: main calf exercise
Safer Alternatives: none needed
Default Rep Range: 12-15
Suggested RPE: 7-9
Recovery Demand: low
System Exercise: true
```

#### 2. Seated Calf Raise
```
Exercise Name: Seated Calf Raise
Primary Muscle Group: calves
Secondary Muscles: none significant
Movement Pattern: plantar flexion
Category: isolation
Equipment Required: machine
Difficulty Level: beginner
Joint Stress Profile: low
Evidence Summary: Bent knee position shifts emphasis to soleus muscle. Both standing and seated needed for complete calf development.
Common Programming Use: accessory
Safer Alternatives: none needed
Default Rep Range: 15-20
Suggested RPE: 7-8
Recovery Demand: low
System Exercise: true
```

### Tier 2 - Highly Useful

#### 3. Leg Press Calf Raise
```
Exercise Name: Leg Press Calf Raise
Primary Muscle Group: calves
Secondary Muscles: none significant
Movement Pattern: plantar flexion
Category: isolation
Equipment Required: machine
Difficulty Level: beginner
Joint Stress Profile: low
Evidence Summary: Alternative to standing calf raise machine. Allows heavy loading. Knee angle can be adjusted.
Common Programming Use: accessory
Safer Alternatives: standing calf raise
Default Rep Range: 12-15
Suggested RPE: 7-8
Recovery Demand: low
System Exercise: true
```

---

## Core Exercises

### Tier 1 - Essential

#### 1. Plank
```
Exercise Name: Plank
Primary Muscle Group: core
Secondary Muscles: shoulders, glutes
Movement Pattern: anti-extension
Category: isometric
Equipment Required: bodyweight
Difficulty Level: beginner
Joint Stress Profile: low
Evidence Summary: Systematic review (PMC 2020) shows highest rectus abdominis EMG among core exercises. Foundational anti-extension exercise. ACSM recommended.
Common Programming Use: accessory, warm-up
Safer Alternatives: none needed
Default Rep Range: 30-60 seconds
Suggested RPE: 7-8
Recovery Demand: low
System Exercise: true
```

#### 2. Cable Crunch
```
Exercise Name: Cable Crunch
Primary Muscle Group: core
Secondary Muscles: none significant
Movement Pattern: spinal flexion
Category: isolation
Equipment Required: cable
Difficulty Level: beginner
Joint Stress Profile: low
Evidence Summary: Allows progressive overload unlike bodyweight crunches. Constant tension throughout ROM. Lower back friendly when done correctly.
Common Programming Use: accessory
Safer Alternatives: crunch, decline crunch
Default Rep Range: 12-15
Suggested RPE: 7-8
Recovery Demand: low
System Exercise: true
```

#### 3. Hanging Leg Raise
```
Exercise Name: Hanging Leg Raise
Primary Muscle Group: core
Secondary Muscles: hip flexors
Movement Pattern: hip flexion / posterior pelvic tilt
Category: compound
Equipment Required: pull-up bar
Difficulty Level: intermediate
Joint Stress Profile: low
Evidence Summary: EMG shows high rectus abdominis and oblique activation when performed with posterior pelvic tilt. Grip strength may be limiting factor.
Common Programming Use: accessory
Safer Alternatives: captain's chair leg raise, lying leg raise
Default Rep Range: 10-15
Suggested RPE: 7-9
Recovery Demand: low
System Exercise: true
```

#### 4. Ab Rollout
```
Exercise Name: Ab Rollout
Primary Muscle Group: core
Secondary Muscles: lats, shoulders
Movement Pattern: anti-extension
Category: compound
Equipment Required: ab wheel, barbell
Difficulty Level: intermediate
Joint Stress Profile: moderate
Evidence Summary: EMG shows very high rectus abdominis activation. Progressive difficulty by extending ROM. Requires baseline core strength.
Common Programming Use: accessory
Safer Alternatives: plank, stability ball rollout
Default Rep Range: 8-12
Suggested RPE: 7-9
Recovery Demand: moderate
System Exercise: true
```

### Tier 2 - Highly Useful

#### 5. Dead Bug
```
Exercise Name: Dead Bug
Primary Muscle Group: core
Secondary Muscles: hip flexors
Movement Pattern: anti-extension / anti-rotation
Category: stabilization
Equipment Required: bodyweight
Difficulty Level: beginner
Joint Stress Profile: low
Evidence Summary: Excellent for learning core bracing. Low back stays pressed to floor. Physical therapy staple for core stability.
Common Programming Use: warm-up, accessory
Safer Alternatives: none needed
Default Rep Range: 10-15 per side
Suggested RPE: 6-7
Recovery Demand: low
System Exercise: true
```

#### 6. Pallof Press
```
Exercise Name: Pallof Press
Primary Muscle Group: core
Secondary Muscles: shoulders
Movement Pattern: anti-rotation
Category: stabilization
Equipment Required: cable, band
Difficulty Level: beginner
Joint Stress Profile: low
Evidence Summary: Premier anti-rotation exercise. Targets obliques and transverse abdominis. Functional core stability.
Common Programming Use: accessory, warm-up
Safer Alternatives: none needed
Default Rep Range: 10-12 per side
Suggested RPE: 6-8
Recovery Demand: low
System Exercise: true
```

#### 7. Russian Twist
```
Exercise Name: Russian Twist
Primary Muscle Group: core
Secondary Muscles: hip flexors
Movement Pattern: rotation
Category: isolation
Equipment Required: bodyweight, dumbbell, medicine ball
Difficulty Level: intermediate
Joint Stress Profile: moderate
Evidence Summary: Targets obliques through rotation. Use moderate load to avoid excessive spinal rotation. Feet elevated increases difficulty.
Common Programming Use: accessory
Safer Alternatives: bicycle crunch
Default Rep Range: 15-20 per side
Suggested RPE: 7-8
Recovery Demand: low
System Exercise: true
```

#### 8. Bicycle Crunch
```
Exercise Name: Bicycle Crunch
Primary Muscle Group: core
Secondary Muscles: hip flexors
Movement Pattern: rotation + flexion
Category: compound
Equipment Required: bodyweight
Difficulty Level: beginner
Joint Stress Profile: low
Evidence Summary: ACE study shows high rectus abdominis and oblique activation. Combines rotation with flexion for comprehensive core engagement.
Common Programming Use: accessory, finisher
Safer Alternatives: none needed
Default Rep Range: 15-20 per side
Suggested RPE: 7-8
Recovery Demand: low
System Exercise: true
```

---

## Full Body / Compound Exercises

### Tier 1 - Essential

#### 1. Conventional Deadlift
```
Exercise Name: Conventional Deadlift
Primary Muscle Group: full_body
Secondary Muscles: quads, glutes, hamstrings, back, core
Movement Pattern: hinge
Category: compound
Equipment Required: barbell
Difficulty Level: intermediate
Joint Stress Profile: high
Evidence Summary: NSCA foundational lift. One of highest total-body muscle activation exercises. Athlean-X notes 4600 lbs spinal shear with poor form - technique critical.
Common Programming Use: main lift
Safer Alternatives: trap bar deadlift, RDL
Default Rep Range: 3-6
Suggested RPE: 7-9
Recovery Demand: high
System Exercise: true
```

#### 2. Trap Bar Deadlift
```
Exercise Name: Trap Bar Deadlift
Primary Muscle Group: full_body
Secondary Muscles: quads, glutes, hamstrings, back
Movement Pattern: hinge/squat hybrid
Category: compound
Equipment Required: trap bar
Difficulty Level: intermediate
Joint Stress Profile: moderate
Evidence Summary: More quad involvement than conventional. Neutral grip reduces bicep strain. Research shows reduced spinal shear forces vs conventional.
Common Programming Use: main lift
Safer Alternatives: none needed
Default Rep Range: 5-8
Suggested RPE: 7-9
Recovery Demand: high
System Exercise: true
```

#### 3. Farmer's Walk / Carry
```
Exercise Name: Farmers Walk
Primary Muscle Group: full_body
Secondary Muscles: traps, core, grip, legs
Movement Pattern: carry
Category: compound
Equipment Required: dumbbell, trap bar, farmer handles
Difficulty Level: beginner
Joint Stress Profile: low
Evidence Summary: Functional loaded carry with minimal injury risk. High core activation. Builds grip strength and work capacity.
Common Programming Use: accessory, finisher
Safer Alternatives: none needed
Default Rep Range: 30-60 seconds or distance
Suggested RPE: 7-8
Recovery Demand: moderate
System Exercise: true
```

### Tier 2 - Highly Useful

#### 4. Sumo Deadlift
```
Exercise Name: Sumo Deadlift
Primary Muscle Group: full_body
Secondary Muscles: quads, glutes, adductors, back
Movement Pattern: hinge
Category: compound
Equipment Required: barbell
Difficulty Level: intermediate
Joint Stress Profile: moderate
Evidence Summary: Wide stance increases quad and adductor involvement. Shorter ROM than conventional. May suit certain body types better.
Common Programming Use: main lift
Safer Alternatives: trap bar deadlift
Default Rep Range: 3-6
Suggested RPE: 7-9
Recovery Demand: high
System Exercise: true
```

#### 5. Kettlebell Swing
```
Exercise Name: Kettlebell Swing
Primary Muscle Group: full_body
Secondary Muscles: glutes, hamstrings, core, shoulders
Movement Pattern: hinge
Category: compound
Equipment Required: kettlebell
Difficulty Level: intermediate
Joint Stress Profile: moderate
Evidence Summary: Ballistic hip hinge with power development. High metabolic demand. Effective for conditioning and posterior chain.
Common Programming Use: accessory, conditioning
Safer Alternatives: cable pull-through
Default Rep Range: 15-20
Suggested RPE: 7-8
Recovery Demand: moderate
System Exercise: true
```

---

## Exercises to EXCLUDE

### DO NOT ADD - High Injury Risk

| Exercise | Reason | Source |
|----------|--------|--------|
| Behind-the-Neck Press | Shoulder impingement risk, places glenohumeral joint in compromised position | Athlean-X, NSCA |
| Behind-the-Neck Lat Pulldown | Cervical spine strain, shoulder impingement | ACSM, Gravity Transformation |
| Upright Row (narrow grip) | Internal rotation under load causes shoulder impingement | Athlean-X, multiple PT sources |
| Good Morning (heavy) | Extreme spinal shear forces with heavy loads | NSCA (moderate loads only) |
| Dumbbell Fly (flat, heavy) | Shoulder joint strain at stretched position, no resistance at top | Athlean-X |
| Smith Machine Squat | Fixed bar path can cause knee/hip tracking issues | Multiple PT sources |
| Leg Press (extreme ROM) | Lower back rounding at bottom position | Athlean-X |

### DO NOT ADD - Low Benefit / Redundant

| Exercise | Reason |
|----------|--------|
| Bosu Ball Squats | EMG shows 50%+ reduction in muscle activation (JSCR) |
| Wrist Curls (heavy) | High injury risk for minimal benefit |
| Renegade Row | Jeff Nippard F-tier - limits weight, poor ROM for back |
| Bench Dips (deep) | Shoulder strain in bottom position |
| Hip Adductor/Abductor Machine | Limited functional carryover, time better spent elsewhere |
| Seated Torso Rotation Machine | Spinal rotation under load is risky |
| Thigh Master type exercises | No progressive overload, ineffective |

### CAUTION - Use With Proper Form Only

| Exercise | Notes |
|----------|-------|
| Sissy Squat | High knee shear - only for advanced with prep |
| Leg Extension (heavy) | Moderate loads only to protect knee |
| Skull Crusher | Bar must pass OVER head, not to forehead |
| Deadlift | Technique critical - rounded back dangerous |

---

## Database Integration Schema

### Prisma-Compatible Exercise Entry Format

```typescript
// Add these exercises to seed file
const curatedExercises = [
  {
    name: "Flat Barbell Bench Press",
    description: "Primary compound chest exercise. EMG meta-analysis confirms highest pec activation. Use 30° incline for upper chest emphasis.",
    muscleGroup: "chest",
    category: "compound",
    equipment: "barbell",
    instructions: "Lie on bench, grip slightly wider than shoulders. Lower bar to mid-chest, press up. Keep shoulder blades retracted.",
    isCustom: false,
    isPublic: true
  },
  // ... additional exercises
]
```

### Recommended Default Values by Exercise Type

| Exercise Type | Default Sets | Default Reps | Rest (sec) | RPE Range |
|---------------|-------------|--------------|------------|-----------|
| Main Compound (squat, deadlift, bench) | 3-4 | 5-8 | 180-300 | 7-9 |
| Secondary Compound (rows, presses) | 3-4 | 8-10 | 120-180 | 7-8 |
| Isolation | 3 | 10-15 | 60-90 | 7-8 |
| Core | 3 | 10-15 or 30-60s | 60 | 6-8 |

### Muscle Group Mapping (for recovery tracking)

```javascript
const muscleGroupMap = {
  "chest": ["Flat Barbell Bench Press", "Incline Dumbbell Press", "Cable Crossover", ...],
  "back": ["Lat Pulldown", "Barbell Row", "Pull-Up", "Seated Cable Row", ...],
  "shoulders": ["Overhead Press", "Lateral Raise", "Reverse Pec Deck", ...],
  "biceps": ["Barbell Curl", "Incline Dumbbell Curl", "Preacher Curl", ...],
  "triceps": ["Triceps Pushdown", "Skull Crusher", "Overhead Extension", ...],
  "legs": ["Squat", "Leg Press", "Leg Extension", "Leg Curl", ...],
  "glutes": ["Hip Thrust", "Romanian Deadlift", "Cable Kickback", ...],
  "core": ["Plank", "Cable Crunch", "Hanging Leg Raise", ...]
}
```

---

## Summary Statistics

| Category | Tier 1 (Essential) | Tier 2 (Useful) | Tier 3 (Optional) | Total |
|----------|-------------------|-----------------|-------------------|-------|
| Chest | 4 | 3 | 2 | 9 |
| Back | 5 | 3 | 2 | 10 |
| Shoulders | 4 | 3 | 1 | 8 |
| Biceps | 3 | 3 | 1 | 7 |
| Triceps | 3 | 3 | 1 | 7 |
| Quadriceps | 4 | 3 | 1 | 8 |
| Hamstrings | 3 | 2 | 0 | 5 |
| Glutes | 3 | 3 | 0 | 6 |
| Calves | 2 | 1 | 0 | 3 |
| Core | 4 | 4 | 0 | 8 |
| Full Body | 3 | 2 | 0 | 5 |
| **TOTAL** | **38** | **30** | **8** | **76** |

---

## References

1. Rodriguez-Ridao et al. (2020). "Effect of Five Bench Inclinations on the EMG Activity..." *Int J Environ Res Public Health*
2. Marcolin et al. (2018). "Differences in EMG activity of biceps brachii..." *PeerJ*
3. Contreras et al. (2015). "EMG Amplitude for Hip Thrust Variations" *J Strength Cond Res*
4. Schoenfeld (2010). "Mechanisms of Muscle Hypertrophy" *J Strength Cond Res*
5. ACE Sponsored Research (2012). "Best Triceps Exercises" *American Council on Exercise*
6. ACE Sponsored Research (2014). "Best Biceps Exercises" *American Council on Exercise*
7. Maeo et al. (2022). "Triceps hypertrophy after elbow extension training" *Eur J Sport Sci*
8. NSCA Exercise Technique Manual (3rd Edition)
9. ACSM Guidelines for Exercise Testing and Prescription (11th Edition)
10. Jeff Nippard Exercise Tier Lists (2024-2025)
11. Dr. Mike Israetel, Renaissance Periodization Hypertrophy Guidelines
12. Athlean-X Injury Prevention Guidelines (Jeff Cavaliere)

---

*Document generated for FitTrack production database. Last updated: 2024*
