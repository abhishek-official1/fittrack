// Curated Exercise Database - Evidence-Based Seed Data
// Sources: PubMed EMG Studies, NSCA, ACSM, Jeff Nippard, Dr. Mike Israetel, Brad Schoenfeld

export const curatedExercises = [
  // ==================== CHEST ====================
  {
    name: "Flat Barbell Bench Press",
    description: "Primary compound chest movement. EMG meta-analysis confirms highest overall pectoralis major activation. Targets middle and lower chest fibers.",
    muscleGroup: "chest",
    category: "compound",
    equipment: "barbell",
    instructions: "Lie on flat bench with feet flat on floor. Grip bar slightly wider than shoulder width. Unrack and lower to mid-chest with elbows at ~45°. Press up to full extension. Keep shoulder blades retracted throughout.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Incline Dumbbell Press",
    description: "Targets upper chest (clavicular head). EMG studies show 30° incline optimal for upper pec activation while minimizing anterior deltoid takeover.",
    muscleGroup: "chest",
    category: "compound",
    equipment: "dumbbell",
    instructions: "Set bench to 30° incline. Press dumbbells from shoulder level to full extension. Lower with control, allowing slight stretch at bottom. Keep elbows at ~45° angle.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Machine Chest Press",
    description: "Stable pressing movement ideal for beginners and high-intensity training. Fixed path allows focus on chest contraction without stability demands.",
    muscleGroup: "chest",
    category: "compound",
    equipment: "machine",
    instructions: "Adjust seat so handles align with mid-chest. Press forward to full extension. Control the negative. Keep back flat against pad.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Cable Crossover",
    description: "Isolation movement with constant tension. Superior to dumbbell fly which loses resistance at top. Excellent for chest contraction and mind-muscle connection.",
    muscleGroup: "chest",
    category: "isolation",
    equipment: "cable",
    instructions: "Set cables at shoulder height. Step forward with slight lean. Bring hands together in arc motion, squeezing chest at center. Control return.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Dumbbell Bench Press",
    description: "Allows greater ROM than barbell and independent arm work. Each arm works through full range addressing imbalances.",
    muscleGroup: "chest",
    category: "compound",
    equipment: "dumbbell",
    instructions: "Lie on flat bench. Press dumbbells from chest level to full lockout. Lower with control to deep stretch. Keep wrists neutral.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Low to High Cable Fly",
    description: "Targets upper chest fibers through ascending line of pull. Constant cable tension throughout movement.",
    muscleGroup: "chest",
    category: "isolation",
    equipment: "cable",
    instructions: "Set cables at lowest position. Bring handles up and together in arc motion to upper chest height. Squeeze at top. Control descent.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Chest Dip",
    description: "Compound movement targeting lower chest when performed with forward lean. Also engages triceps and anterior deltoids.",
    muscleGroup: "chest",
    category: "compound",
    equipment: "bodyweight",
    instructions: "Grip parallel bars, lean torso forward ~30°. Lower until upper arms parallel to floor. Press up to full extension. Avoid excessive forward lean.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Push-Up",
    description: "Fundamental bodyweight pressing movement. Scalable difficulty through variations. Engages core for stability.",
    muscleGroup: "chest",
    category: "compound",
    equipment: "bodyweight",
    instructions: "Hands slightly wider than shoulders. Lower chest to floor with body in straight line. Press up to full extension. Keep core braced throughout.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Incline Barbell Bench Press",
    description: "Barbell version of incline press for heavier loading. 30° incline optimal for upper chest emphasis.",
    muscleGroup: "chest",
    category: "compound",
    equipment: "barbell",
    instructions: "Set bench to 30° incline. Grip slightly wider than shoulders. Lower bar to upper chest. Press to full extension.",
    isCustom: false,
    isPublic: true
  },

  // ==================== BACK ====================
  {
    name: "Chest Supported Row",
    description: "Preferred row variation - eliminates lower back fatigue allowing focus on upper back. Reduces momentum and cheating.",
    muscleGroup: "back",
    category: "compound",
    equipment: "dumbbell",
    instructions: "Lie face down on incline bench. Row dumbbells toward hip, squeezing shoulder blades. Lower with control. Keep chest on pad throughout.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Wide Grip Lat Pulldown",
    description: "Vertical pull targeting latissimus dorsi. Controllable resistance ideal for those building toward pull-ups.",
    muscleGroup: "back",
    category: "compound",
    equipment: "cable",
    instructions: "Grip bar 1.5x shoulder width. Pull bar to upper chest, driving elbows down and back. Squeeze lats at bottom. Control return to full stretch.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Pull-Up",
    description: "Foundational vertical pull. Superior EMG activation vs pulldowns at bodyweight. Overhand grip emphasizes lats.",
    muscleGroup: "back",
    category: "compound",
    equipment: "bodyweight",
    instructions: "Hang with overhand grip slightly wider than shoulders. Pull until chin over bar, driving elbows down. Lower with full control to dead hang.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Chin-Up",
    description: "Underhand grip pull-up with increased biceps involvement. Excellent lat and bicep builder.",
    muscleGroup: "back",
    category: "compound",
    equipment: "bodyweight",
    instructions: "Hang with underhand grip at shoulder width. Pull until chin over bar. Lower with control to full extension. Keep core engaged.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Barbell Bent Over Row",
    description: "High load capacity horizontal pull. Requires hip hinge competency. Targets lats, rhomboids, and traps.",
    muscleGroup: "back",
    category: "compound",
    equipment: "barbell",
    instructions: "Hinge at hips ~45°, grip bar outside knees. Row to lower chest/upper abs. Squeeze shoulder blades at top. Lower with control.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Seated Cable Row",
    description: "Constant tension horizontal pull. Various attachments allow targeting different back areas.",
    muscleGroup: "back",
    category: "compound",
    equipment: "cable",
    instructions: "Sit with feet on platform, slight knee bend. Pull handle to lower chest, squeezing shoulder blades. Return to full stretch. Keep torso stable.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Single Arm Dumbbell Row",
    description: "Unilateral row for addressing imbalances. Greater ROM and core anti-rotation benefit.",
    muscleGroup: "back",
    category: "compound",
    equipment: "dumbbell",
    instructions: "Support with one hand on bench. Row dumbbell toward hip, keeping elbow close. Squeeze at top. Lower to full stretch.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Face Pull",
    description: "Essential for shoulder health and posture. Targets rear delts and external rotators. Recommended by NSCA for prehab.",
    muscleGroup: "back",
    category: "isolation",
    equipment: "cable",
    instructions: "Set cable at face height. Pull rope toward face, spreading hands and rotating externally. Squeeze rear delts. Control return.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Close Grip Lat Pulldown",
    description: "Greater lat stretch compared to wide grip. Increased biceps involvement. Good variation for lat development.",
    muscleGroup: "back",
    category: "compound",
    equipment: "cable",
    instructions: "Use V-bar or close grip attachment. Pull to upper chest, keeping elbows in front. Squeeze lats. Return to full stretch.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Inverted Row",
    description: "Bodyweight horizontal pull. Excellent regression for those building toward pull-ups. Adjustable difficulty via body angle.",
    muscleGroup: "back",
    category: "compound",
    equipment: "bodyweight",
    instructions: "Hang from bar with feet on ground. Pull chest to bar, squeezing shoulder blades. Lower with control. Adjust angle for difficulty.",
    isCustom: false,
    isPublic: true
  },

  // ==================== SHOULDERS ====================
  {
    name: "Standing Barbell Overhead Press",
    description: "Fundamental strength movement. High anterior deltoid activation. Standing version engages core for stability.",
    muscleGroup: "shoulders",
    category: "compound",
    equipment: "barbell",
    instructions: "Grip bar just outside shoulders, bar on front delts. Press overhead to lockout. Lower to starting position. Keep core braced, avoid excessive back arch.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Cable Lateral Raise",
    description: "Superior to dumbbells for lateral deltoid due to constant tension throughout ROM. No dead spot at bottom.",
    muscleGroup: "shoulders",
    category: "isolation",
    equipment: "cable",
    instructions: "Stand beside low cable. Raise arm to side until parallel to floor. Control descent. Slight forward lean keeps tension on side delt.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Machine Shoulder Press",
    description: "Stable pressing allowing heavy loading without balance demands. Excellent for progressive overload with reduced injury risk.",
    muscleGroup: "shoulders",
    category: "compound",
    equipment: "machine",
    instructions: "Adjust seat so handles at shoulder level. Press to full extension. Lower with control. Keep back against pad.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Dumbbell Lateral Raise",
    description: "Staple shoulder isolation exercise. Builds lateral deltoid for shoulder width. Use controlled form.",
    muscleGroup: "shoulders",
    category: "isolation",
    equipment: "dumbbell",
    instructions: "Stand with dumbbells at sides. Raise arms to sides until parallel to floor. Slight bend in elbows. Lower with control.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Seated Dumbbell Shoulder Press",
    description: "Greater ROM than barbell. Each arm works independently addressing imbalances. Seated provides stability.",
    muscleGroup: "shoulders",
    category: "compound",
    equipment: "dumbbell",
    instructions: "Sit with back support. Press dumbbells from shoulder level to overhead. Lower to ear level. Keep core engaged.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Reverse Pec Deck",
    description: "Machine isolation for posterior deltoid. Provides stability for focused rear delt work.",
    muscleGroup: "shoulders",
    category: "isolation",
    equipment: "machine",
    instructions: "Face pad, grip handles. Pull handles back in arc, squeezing rear delts. Control return. Avoid using momentum.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Bent Over Reverse Fly",
    description: "Free weight rear delt isolation. Requires hip hinge position. Targets posterior deltoid.",
    muscleGroup: "shoulders",
    category: "isolation",
    equipment: "dumbbell",
    instructions: "Hinge at hips, dumbbells hanging. Raise arms to sides, squeezing rear delts. Lower with control. Keep slight bend in elbows.",
    isCustom: false,
    isPublic: true
  },

  // ==================== BICEPS ====================
  {
    name: "Incline Dumbbell Curl",
    description: "EMG shows highest long head activation due to stretched position at shoulder extension. Essential for bicep peak.",
    muscleGroup: "biceps",
    category: "isolation",
    equipment: "dumbbell",
    instructions: "Lie on 45° incline bench. Let arms hang, curl dumbbells toward shoulders. Squeeze at top. Lower to full stretch.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Preacher Curl",
    description: "Greatest short head activation. Eliminates momentum and shoulder involvement for pure bicep isolation.",
    muscleGroup: "biceps",
    category: "isolation",
    equipment: "dumbbell",
    instructions: "Rest arms on preacher pad. Curl weight toward shoulders. Squeeze at top. Lower with control to nearly full extension.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Cable Curl",
    description: "Constant tension throughout full ROM. Various attachments offer variety. High muscle activation.",
    muscleGroup: "biceps",
    category: "isolation",
    equipment: "cable",
    instructions: "Stand facing low cable. Curl bar toward shoulders, keeping elbows stationary. Squeeze at top. Lower with control.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Barbell Curl",
    description: "Classic biceps exercise allowing heavier loading. Builds overall bicep mass and strength.",
    muscleGroup: "biceps",
    category: "isolation",
    equipment: "barbell",
    instructions: "Stand with barbell at thighs, shoulder-width grip. Curl to shoulders keeping elbows at sides. Lower with control.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Hammer Curl",
    description: "Neutral grip emphasizes brachialis and brachioradialis for overall arm thickness.",
    muscleGroup: "biceps",
    category: "isolation",
    equipment: "dumbbell",
    instructions: "Hold dumbbells with neutral grip (palms facing). Curl to shoulders keeping wrists neutral throughout. Lower with control.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Concentration Curl",
    description: "ACE study found highest overall biceps EMG activation. Complete isolation with no momentum possible.",
    muscleGroup: "biceps",
    category: "isolation",
    equipment: "dumbbell",
    instructions: "Sit with elbow braced against inner thigh. Curl dumbbell to shoulder. Squeeze at top. Lower with control.",
    isCustom: false,
    isPublic: true
  },

  // ==================== TRICEPS ====================
  {
    name: "Overhead Cable Triceps Extension",
    description: "Overhead position maximizes long head stretch and hypertrophy. Cable provides constant tension. Top-tier triceps exercise.",
    muscleGroup: "triceps",
    category: "isolation",
    equipment: "cable",
    instructions: "Face away from high cable. Start with elbows bent overhead. Extend arms forward and up. Control return to stretch position.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Skull Crusher",
    description: "High triceps activation compound movement. Bar should pass over head, not to forehead for safety.",
    muscleGroup: "triceps",
    category: "isolation",
    equipment: "barbell",
    instructions: "Lie on bench, arms extended. Lower bar toward crown of head by bending elbows. Extend back to start. Keep upper arms stationary.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Triceps Pushdown",
    description: "Staple triceps isolation. Various attachments target different heads. Rope version emphasizes lateral head.",
    muscleGroup: "triceps",
    category: "isolation",
    equipment: "cable",
    instructions: "Stand at high cable. Push bar/rope down to full extension. Squeeze triceps at bottom. Control return to 90°.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Close Grip Bench Press",
    description: "Compound triceps builder allowing heavy loading. Also targets inner chest.",
    muscleGroup: "triceps",
    category: "compound",
    equipment: "barbell",
    instructions: "Lie on bench, grip bar shoulder width. Lower to lower chest. Press to lockout. Keep elbows closer to body than standard bench.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Triceps Dip",
    description: "Bodyweight compound movement. Upright torso emphasizes triceps over chest.",
    muscleGroup: "triceps",
    category: "compound",
    equipment: "bodyweight",
    instructions: "Grip parallel bars, body upright. Lower until upper arms parallel. Press to full extension. Avoid excessive forward lean.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Triceps Kickback",
    description: "Isolation movement for triceps. Cable version provides constant tension. Good for mind-muscle connection.",
    muscleGroup: "triceps",
    category: "isolation",
    equipment: "dumbbell",
    instructions: "Hinge forward, upper arm parallel to floor. Extend arm straight back. Squeeze at full extension. Lower with control.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Diamond Push-Up",
    description: "Bodyweight triceps exercise with highest EMG activation per ACE study. Hands form diamond shape.",
    muscleGroup: "triceps",
    category: "compound",
    equipment: "bodyweight",
    instructions: "Push-up position with hands together forming diamond. Lower chest to hands. Press up to full extension. Keep elbows close to body.",
    isCustom: false,
    isPublic: true
  },

  // ==================== LEGS - QUADS ====================
  {
    name: "Barbell Back Squat",
    description: "Foundational lower body movement. High bar position emphasizes quads. King of leg exercises for overall development.",
    muscleGroup: "legs",
    category: "compound",
    equipment: "barbell",
    instructions: "Bar on upper traps. Squat to at least parallel, keeping knees tracking over toes. Drive through heels to stand. Keep core braced.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Hack Squat",
    description: "Fixed path machine squat. Excellent quad activation with reduced spinal load. Top-tier for quad hypertrophy.",
    muscleGroup: "legs",
    category: "compound",
    equipment: "machine",
    instructions: "Position shoulders under pads, feet shoulder width on platform. Squat to parallel or below. Press through feet to stand.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Leg Press",
    description: "Lower technical demand than free squats. Allows heavy loading with reduced injury risk. Foot position alters emphasis.",
    muscleGroup: "legs",
    category: "compound",
    equipment: "machine",
    instructions: "Sit with back flat, feet shoulder width on platform. Lower weight until knees at 90°. Press to near lockout. Don't lock knees.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Leg Extension",
    description: "Only exercise isolating quads without hip involvement. Use moderate loads to protect knees.",
    muscleGroup: "legs",
    category: "isolation",
    equipment: "machine",
    instructions: "Sit with back against pad, ankles behind roller. Extend legs to full lockout. Squeeze quads. Lower with control.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Bulgarian Split Squat",
    description: "Unilateral squat for balance and imbalance correction. High quad activation with deep stretch.",
    muscleGroup: "legs",
    category: "compound",
    equipment: "dumbbell",
    instructions: "Rear foot on bench. Lower until rear knee nearly touches floor. Drive through front heel to stand. Keep torso upright.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Barbell Front Squat",
    description: "Upright torso position emphasizes quads and reduces spinal shear. Requires mobility.",
    muscleGroup: "legs",
    category: "compound",
    equipment: "barbell",
    instructions: "Bar on front delts, elbows high. Squat to parallel keeping torso upright. Drive up through heels. Maintain elbow position.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Goblet Squat",
    description: "Excellent teaching tool for squat pattern. Counterbalance allows upright torso. Beginner-friendly.",
    muscleGroup: "legs",
    category: "compound",
    equipment: "dumbbell",
    instructions: "Hold dumbbell at chest. Squat between legs to depth. Drive through heels to stand. Keep chest up throughout.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Walking Lunge",
    description: "Dynamic unilateral movement. Excellent for quads, glutes, and balance. Top stimulus-to-fatigue ratio.",
    muscleGroup: "legs",
    category: "compound",
    equipment: "dumbbell",
    instructions: "Step forward into lunge, knee tracking over toe. Push off front foot to next step. Alternate legs. Keep torso upright.",
    isCustom: false,
    isPublic: true
  },

  // ==================== LEGS - HAMSTRINGS ====================
  {
    name: "Seated Leg Curl",
    description: "Superior to lying curl due to stretched position at hip flexion. Greater hamstring hypertrophy.",
    muscleGroup: "legs",
    category: "isolation",
    equipment: "machine",
    instructions: "Sit with thighs under pad, ankles on roller. Curl weight by bending knees. Squeeze hamstrings. Control return.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Romanian Deadlift",
    description: "Hip hinge targeting hamstrings and glutes. Eccentric emphasis builds hamstring strength and flexibility.",
    muscleGroup: "legs",
    category: "compound",
    equipment: "barbell",
    instructions: "Hold bar at thighs. Hinge at hips, sliding bar down legs. Feel hamstring stretch. Drive hips forward to stand.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Lying Leg Curl",
    description: "Traditional hamstring isolation. Effective complement to seated variation.",
    muscleGroup: "legs",
    category: "isolation",
    equipment: "machine",
    instructions: "Lie face down, ankles under roller. Curl weight toward glutes. Squeeze at top. Lower with control.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Stiff Legged Deadlift",
    description: "Greater hamstring stretch than RDL. Effective for hamstring development and flexibility.",
    muscleGroup: "legs",
    category: "compound",
    equipment: "barbell",
    instructions: "Hold bar at thighs, legs nearly straight. Lower bar toward feet keeping legs mostly straight. Drive hips forward to return.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Nordic Hamstring Curl",
    description: "Advanced eccentric exercise. Significant injury prevention benefits. Used by elite athletes.",
    muscleGroup: "legs",
    category: "isolation",
    equipment: "bodyweight",
    instructions: "Kneel with ankles secured. Lower body forward as slowly as possible. Use hands to push back up if needed. Progress to full reps.",
    isCustom: false,
    isPublic: true
  },

  // ==================== GLUTES ====================
  {
    name: "Barbell Hip Thrust",
    description: "Highest glute EMG activation of any exercise. Superior to squats for glute isolation.",
    muscleGroup: "glutes",
    category: "compound",
    equipment: "barbell",
    instructions: "Upper back on bench, bar over hips. Drive hips up until body straight. Squeeze glutes at top. Lower with control.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Glute Bridge",
    description: "Bodyweight or loaded glute exercise. Excellent regression from hip thrust. Great activation.",
    muscleGroup: "glutes",
    category: "compound",
    equipment: "bodyweight",
    instructions: "Lie on back, knees bent, feet flat. Drive hips up squeezing glutes. Hold at top. Lower with control.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Cable Pull Through",
    description: "Teaches hip hinge pattern safely. Constant cable tension. Good for those avoiding deadlifts.",
    muscleGroup: "glutes",
    category: "compound",
    equipment: "cable",
    instructions: "Face away from low cable, rope between legs. Hinge at hips, then drive forward squeezing glutes. Keep arms straight.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Step-Up",
    description: "Unilateral glute exercise. Height adjustment changes difficulty. Good functional carryover.",
    muscleGroup: "glutes",
    category: "compound",
    equipment: "dumbbell",
    instructions: "Stand facing box/step. Step up driving through heel. Stand fully upright. Step down with control. Alternate or same leg.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Cable Kickback",
    description: "Isolates glute max through hip extension. Cable provides constant tension. Good mind-muscle connection.",
    muscleGroup: "glutes",
    category: "isolation",
    equipment: "cable",
    instructions: "Face cable machine, ankle strap on. Kick leg straight back squeezing glute. Control return. Keep torso stable.",
    isCustom: false,
    isPublic: true
  },

  // ==================== CALVES ====================
  {
    name: "Standing Calf Raise",
    description: "Straight knee position emphasizes gastrocnemius. Full ROM with pause at stretch important.",
    muscleGroup: "calves",
    category: "isolation",
    equipment: "machine",
    instructions: "Stand with balls of feet on platform. Lower heels for full stretch. Rise onto toes squeezing calves. Pause at top.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Seated Calf Raise",
    description: "Bent knee position targets soleus muscle. Both seated and standing needed for complete development.",
    muscleGroup: "calves",
    category: "isolation",
    equipment: "machine",
    instructions: "Sit with knees under pad, balls of feet on platform. Lower heels for stretch. Rise onto toes. Pause and squeeze.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Leg Press Calf Raise",
    description: "Alternative to standing machine. Allows heavy loading. Adjustable knee angle.",
    muscleGroup: "calves",
    category: "isolation",
    equipment: "machine",
    instructions: "Position balls of feet at bottom of leg press platform. Push through toes, extending ankles fully. Control return.",
    isCustom: false,
    isPublic: true
  },

  // ==================== CORE ====================
  {
    name: "Plank",
    description: "Foundational anti-extension exercise. Highest rectus abdominis EMG per systematic review. ACSM recommended.",
    muscleGroup: "core",
    category: "bodyweight",
    equipment: "bodyweight",
    instructions: "Forearms and toes on ground. Body in straight line from head to heels. Brace core. Hold position without sagging or piking.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Cable Crunch",
    description: "Allows progressive overload unlike bodyweight crunches. Constant tension. Lower back friendly.",
    muscleGroup: "core",
    category: "isolation",
    equipment: "cable",
    instructions: "Kneel facing high cable. Hold rope at head. Crunch down bringing elbows toward thighs. Control return.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Hanging Leg Raise",
    description: "High rectus abdominis activation when performed with posterior pelvic tilt. Advanced core exercise.",
    muscleGroup: "core",
    category: "compound",
    equipment: "bodyweight",
    instructions: "Hang from bar. Raise legs to horizontal or higher. Focus on curling pelvis up. Lower with control.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Ab Rollout",
    description: "Very high rectus abdominis activation. Progressive difficulty by extending ROM. Requires baseline strength.",
    muscleGroup: "core",
    category: "compound",
    equipment: "bodyweight",
    instructions: "Kneel holding ab wheel. Roll forward extending body. Go as far as controllable. Pull back to start using abs.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Dead Bug",
    description: "Excellent for learning core bracing. Low back stays pressed to floor. Physical therapy staple.",
    muscleGroup: "core",
    category: "bodyweight",
    equipment: "bodyweight",
    instructions: "Lie on back, arms up, knees bent 90°. Extend opposite arm and leg while keeping back flat. Return and alternate.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Pallof Press",
    description: "Premier anti-rotation exercise. Targets obliques and transverse abdominis. Functional stability.",
    muscleGroup: "core",
    category: "isolation",
    equipment: "cable",
    instructions: "Stand sideways to cable at chest height. Press hands straight out. Resist rotation. Hold. Return and repeat.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Russian Twist",
    description: "Rotational core exercise targeting obliques. Use moderate load to avoid excessive spinal rotation.",
    muscleGroup: "core",
    category: "isolation",
    equipment: "dumbbell",
    instructions: "Sit with knees bent, feet off floor. Rotate torso side to side touching weight to floor each side. Control movement.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Bicycle Crunch",
    description: "High rectus abdominis and oblique activation. Combines rotation with flexion for comprehensive core work.",
    muscleGroup: "core",
    category: "compound",
    equipment: "bodyweight",
    instructions: "Lie on back, hands behind head. Bring opposite elbow to knee while extending other leg. Alternate in cycling motion.",
    isCustom: false,
    isPublic: true
  },

  // ==================== FULL BODY ====================
  {
    name: "Conventional Deadlift",
    description: "Fundamental full-body lift. One of highest total-body muscle activation exercises. Technique critical for safety.",
    muscleGroup: "full_body",
    category: "compound",
    equipment: "barbell",
    instructions: "Stand with feet hip width, bar over mid-foot. Hinge and grip bar. Drive through floor keeping bar close. Stand tall. Reverse to lower.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Trap Bar Deadlift",
    description: "More quad involvement than conventional. Neutral grip reduces bicep strain. Reduced spinal shear forces.",
    muscleGroup: "full_body",
    category: "compound",
    equipment: "trap bar",
    instructions: "Stand inside trap bar, feet hip width. Grip handles, hinge slightly. Drive through floor to stand. Keep chest up. Lower with control.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Farmers Walk",
    description: "Functional loaded carry. High core activation. Builds grip strength and work capacity with minimal injury risk.",
    muscleGroup: "full_body",
    category: "compound",
    equipment: "dumbbell",
    instructions: "Hold heavy dumbbells at sides. Walk with upright posture. Keep shoulders back, core braced. Maintain steady pace.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Sumo Deadlift",
    description: "Wide stance increases quad and adductor involvement. Shorter ROM than conventional. May suit certain body types.",
    muscleGroup: "full_body",
    category: "compound",
    equipment: "barbell",
    instructions: "Wide stance, toes pointed out. Grip bar inside legs. Drive through floor, pushing knees out. Stand tall. Lower with control.",
    isCustom: false,
    isPublic: true
  },
  {
    name: "Kettlebell Swing",
    description: "Ballistic hip hinge with power development. High metabolic demand. Effective for conditioning and posterior chain.",
    muscleGroup: "full_body",
    category: "compound",
    equipment: "kettlebell",
    instructions: "Hinge with kettlebell between legs. Explosively drive hips forward, swinging bell to shoulder height. Control descent and repeat.",
    isCustom: false,
    isPublic: true
  }
]

export default curatedExercises
