const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// ==================== ACHIEVEMENTS ====================
const defaultAchievements = [
  // Workout Milestones
  { name: 'First Blood', description: 'Complete your first workout', category: 'workout', icon: 'Dumbbell', rarity: 'common', requirement: { type: 'workout_count', value: 1 }, xpReward: 50 },
  { name: 'Getting Started', description: 'Complete 5 workouts', category: 'workout', icon: 'Flame', rarity: 'common', requirement: { type: 'workout_count', value: 5 }, xpReward: 100 },
  { name: 'Dedicated', description: 'Complete 10 workouts', category: 'workout', icon: 'Target', rarity: 'common', requirement: { type: 'workout_count', value: 10 }, xpReward: 150 },
  { name: 'Committed', description: 'Complete 25 workouts', category: 'workout', icon: 'Award', rarity: 'uncommon', requirement: { type: 'workout_count', value: 25 }, xpReward: 250 },
  { name: 'Warrior', description: 'Complete 50 workouts', category: 'workout', icon: 'Sword', rarity: 'uncommon', requirement: { type: 'workout_count', value: 50 }, xpReward: 500 },
  { name: 'Centurion', description: 'Complete 100 workouts', category: 'workout', icon: 'Shield', rarity: 'rare', requirement: { type: 'workout_count', value: 100 }, xpReward: 1000 },
  { name: 'Iron Veteran', description: 'Complete 250 workouts', category: 'workout', icon: 'Medal', rarity: 'epic', requirement: { type: 'workout_count', value: 250 }, xpReward: 2500 },
  { name: 'Legendary Lifter', description: 'Complete 500 workouts', category: 'workout', icon: 'Crown', rarity: 'legendary', requirement: { type: 'workout_count', value: 500 }, xpReward: 5000 },
  
  // Strength - Personal Records
  { name: 'PR Hunter', description: 'Set your first personal record', category: 'strength', icon: 'TrendingUp', rarity: 'common', requirement: { type: 'pr_count', value: 1 }, xpReward: 100 },
  { name: 'Record Breaker', description: 'Set 10 personal records', category: 'strength', icon: 'Zap', rarity: 'uncommon', requirement: { type: 'pr_count', value: 10 }, xpReward: 300 },
  { name: 'PR Machine', description: 'Set 25 personal records', category: 'strength', icon: 'Rocket', rarity: 'rare', requirement: { type: 'pr_count', value: 25 }, xpReward: 500 },
  { name: 'Unstoppable', description: 'Set 50 personal records', category: 'strength', icon: 'Star', rarity: 'epic', requirement: { type: 'pr_count', value: 50 }, xpReward: 1000 },
  { name: 'World Beater', description: 'Set 100 personal records', category: 'strength', icon: 'Trophy', rarity: 'legendary', requirement: { type: 'pr_count', value: 100 }, xpReward: 2000 },
  
  // Consistency - Streaks
  { name: 'Spark', description: 'Achieve a 3-day workout streak', category: 'consistency', icon: 'Flame', rarity: 'common', requirement: { type: 'streak', value: 3 }, xpReward: 75 },
  { name: 'Week Warrior', description: 'Achieve a 7-day workout streak', category: 'consistency', icon: 'Calendar', rarity: 'uncommon', requirement: { type: 'streak', value: 7 }, xpReward: 200 },
  { name: 'Two Week Terror', description: 'Achieve a 14-day workout streak', category: 'consistency', icon: 'CalendarCheck', rarity: 'rare', requirement: { type: 'streak', value: 14 }, xpReward: 400 },
  { name: 'Monthly Master', description: 'Achieve a 30-day workout streak', category: 'consistency', icon: 'CalendarDays', rarity: 'epic', requirement: { type: 'streak', value: 30 }, xpReward: 1000 },
  { name: 'Iron Will', description: 'Achieve a 100-day workout streak', category: 'consistency', icon: 'Infinity', rarity: 'legendary', requirement: { type: 'streak', value: 100 }, xpReward: 5000 },
  
  // Volume - Total Weight Lifted
  { name: 'Ton Lifter', description: 'Lift 1,000 kg total', category: 'volume', icon: 'Weight', rarity: 'common', requirement: { type: 'total_weight', value: 1000 }, xpReward: 100 },
  { name: '5 Ton Club', description: 'Lift 5,000 kg total', category: 'volume', icon: 'Dumbbell', rarity: 'uncommon', requirement: { type: 'total_weight', value: 5000 }, xpReward: 250 },
  { name: '10 Ton Club', description: 'Lift 10,000 kg total', category: 'volume', icon: 'Mountain', rarity: 'rare', requirement: { type: 'total_weight', value: 10000 }, xpReward: 500 },
  { name: '50 Ton Club', description: 'Lift 50,000 kg total', category: 'volume', icon: 'Building', rarity: 'epic', requirement: { type: 'total_weight', value: 50000 }, xpReward: 1500 },
  { name: '100 Ton Club', description: 'Lift 100,000 kg total', category: 'volume', icon: 'Castle', rarity: 'legendary', requirement: { type: 'total_weight', value: 100000 }, xpReward: 3000 },
  
  // Volume - Sets and Reps
  { name: 'Rep Counter', description: 'Complete 500 total reps', category: 'volume', icon: 'Hash', rarity: 'common', requirement: { type: 'total_reps', value: 500 }, xpReward: 75 },
  { name: 'Rep Machine', description: 'Complete 2,500 total reps', category: 'volume', icon: 'Repeat', rarity: 'uncommon', requirement: { type: 'total_reps', value: 2500 }, xpReward: 200 },
  { name: 'Rep Legend', description: 'Complete 10,000 total reps', category: 'volume', icon: 'RotateCcw', rarity: 'rare', requirement: { type: 'total_reps', value: 10000 }, xpReward: 500 },
  { name: 'Set Crusher', description: 'Complete 100 total sets', category: 'volume', icon: 'Layers', rarity: 'common', requirement: { type: 'total_sets', value: 100 }, xpReward: 75 },
  { name: 'Set Master', description: 'Complete 500 total sets', category: 'volume', icon: 'LayoutGrid', rarity: 'uncommon', requirement: { type: 'total_sets', value: 500 }, xpReward: 200 },
  { name: 'Set Legend', description: 'Complete 2,000 total sets', category: 'volume', icon: 'Grid3x3', rarity: 'rare', requirement: { type: 'total_sets', value: 2000 }, xpReward: 500 },
  
  // Special Achievements
  { name: 'Early Bird', description: 'Complete a workout before 7 AM', category: 'special', icon: 'Sunrise', rarity: 'uncommon', requirement: { type: 'early_workout', value: 1 }, xpReward: 150 },
  { name: 'Night Owl', description: 'Complete a workout after 10 PM', category: 'special', icon: 'Moon', rarity: 'uncommon', requirement: { type: 'late_workout', value: 1 }, xpReward: 150 },
  { name: 'Weekend Warrior', description: 'Complete workouts on both Saturday and Sunday', category: 'special', icon: 'CalendarRange', rarity: 'uncommon', requirement: { type: 'weekend_workouts', value: 1 }, xpReward: 200 },
  { name: 'Perfectionist', description: 'Complete all sets in a workout', category: 'special', icon: 'CheckCircle', rarity: 'common', requirement: { type: 'perfect_workout', value: 1 }, xpReward: 100 },
  { name: 'Variety Pack', description: 'Use 10 different exercises in a single week', category: 'special', icon: 'Shuffle', rarity: 'rare', requirement: { type: 'weekly_exercise_variety', value: 10 }, xpReward: 300 },
  { name: 'Full Body Master', description: 'Train all major muscle groups in one week', category: 'special', icon: 'User', rarity: 'rare', requirement: { type: 'all_muscles_week', value: 1 }, xpReward: 400 },
  { name: 'Comeback Kid', description: 'Return after a 14+ day break', category: 'special', icon: 'Undo2', rarity: 'uncommon', requirement: { type: 'comeback', value: 14 }, xpReward: 200, isSecret: true },
  { name: 'Marathon Session', description: 'Complete a workout lasting over 90 minutes', category: 'special', icon: 'Clock', rarity: 'rare', requirement: { type: 'workout_duration', value: 90 }, xpReward: 300 },
  { name: 'Speed Demon', description: 'Complete a workout in under 30 minutes', category: 'special', icon: 'Zap', rarity: 'uncommon', requirement: { type: 'workout_duration_under', value: 30 }, xpReward: 150 },
]

// ==================== CURATED EXERCISES (Evidence-Based) ====================
// Sources: PubMed EMG Studies, NSCA, ACSM, Jeff Nippard, Dr. Mike Israetel, Brad Schoenfeld
const defaultExercises = [
  // ==================== CHEST ====================
  { name: 'Flat Barbell Bench Press', muscleGroup: 'chest', category: 'compound', equipment: 'barbell', description: 'Primary compound chest movement. EMG meta-analysis confirms highest overall pectoralis major activation. Targets middle and lower chest fibers.', instructions: 'Lie on flat bench with feet flat on floor. Grip bar slightly wider than shoulder width. Unrack and lower to mid-chest with elbows at ~45°. Press up to full extension. Keep shoulder blades retracted throughout.' },
  { name: 'Incline Dumbbell Press', muscleGroup: 'chest', category: 'compound', equipment: 'dumbbell', description: 'Targets upper chest (clavicular head). EMG studies show 30° incline optimal for upper pec activation while minimizing anterior deltoid takeover.', instructions: 'Set bench to 30° incline. Press dumbbells from shoulder level to full extension. Lower with control, allowing slight stretch at bottom. Keep elbows at ~45° angle.' },
  { name: 'Machine Chest Press', muscleGroup: 'chest', category: 'compound', equipment: 'machine', description: 'Stable pressing movement ideal for beginners and high-intensity training. Fixed path allows focus on chest contraction without stability demands.', instructions: 'Adjust seat so handles align with mid-chest. Press forward to full extension. Control the negative. Keep back flat against pad.' },
  { name: 'Cable Crossover', muscleGroup: 'chest', category: 'isolation', equipment: 'cable', description: 'Isolation movement with constant tension. Superior to dumbbell fly which loses resistance at top. Excellent for chest contraction and mind-muscle connection.', instructions: 'Set cables at shoulder height. Step forward with slight lean. Bring hands together in arc motion, squeezing chest at center. Control return.' },
  { name: 'Dumbbell Bench Press', muscleGroup: 'chest', category: 'compound', equipment: 'dumbbell', description: 'Allows greater ROM than barbell and independent arm work. Each arm works through full range addressing imbalances.', instructions: 'Lie on flat bench. Press dumbbells from chest level to full lockout. Lower with control to deep stretch. Keep wrists neutral.' },
  { name: 'Low to High Cable Fly', muscleGroup: 'chest', category: 'isolation', equipment: 'cable', description: 'Targets upper chest fibers through ascending line of pull. Constant cable tension throughout movement.', instructions: 'Set cables at lowest position. Bring handles up and together in arc motion to upper chest height. Squeeze at top. Control descent.' },
  { name: 'Chest Dip', muscleGroup: 'chest', category: 'compound', equipment: 'bodyweight', description: 'Compound movement targeting lower chest when performed with forward lean. Also engages triceps and anterior deltoids.', instructions: 'Grip parallel bars, lean torso forward ~30°. Lower until upper arms parallel to floor. Press up to full extension. Avoid excessive forward lean.' },
  { name: 'Push-Up', muscleGroup: 'chest', category: 'compound', equipment: 'bodyweight', description: 'Fundamental bodyweight pressing movement. Scalable difficulty through variations. Engages core for stability.', instructions: 'Hands slightly wider than shoulders. Lower chest to floor with body in straight line. Press up to full extension. Keep core braced throughout.' },
  { name: 'Incline Barbell Bench Press', muscleGroup: 'chest', category: 'compound', equipment: 'barbell', description: 'Barbell version of incline press for heavier loading. 30° incline optimal for upper chest emphasis.', instructions: 'Set bench to 30° incline. Grip slightly wider than shoulders. Lower bar to upper chest. Press to full extension.' },
  { name: 'High to Low Cable Fly', muscleGroup: 'chest', category: 'isolation', equipment: 'cable', description: 'Targets lower chest fibers through descending line of pull. Good for lower chest definition.', instructions: 'Set cables at highest position. Bring handles down and together at lower chest level. Squeeze at bottom. Control return.' },

  // ==================== BACK ====================
  { name: 'Chest Supported Row', muscleGroup: 'back', category: 'compound', equipment: 'dumbbell', description: 'Preferred row variation - eliminates lower back fatigue allowing focus on upper back. Reduces momentum and cheating.', instructions: 'Lie face down on incline bench. Row dumbbells toward hip, squeezing shoulder blades. Lower with control. Keep chest on pad throughout.' },
  { name: 'Wide Grip Lat Pulldown', muscleGroup: 'back', category: 'compound', equipment: 'cable', description: 'Vertical pull targeting latissimus dorsi. Controllable resistance ideal for those building toward pull-ups.', instructions: 'Grip bar 1.5x shoulder width. Pull bar to upper chest, driving elbows down and back. Squeeze lats at bottom. Control return to full stretch.' },
  { name: 'Pull-Up', muscleGroup: 'back', category: 'compound', equipment: 'bodyweight', description: 'Foundational vertical pull. Superior EMG activation vs pulldowns at bodyweight. Overhand grip emphasizes lats.', instructions: 'Hang with overhand grip slightly wider than shoulders. Pull until chin over bar, driving elbows down. Lower with full control to dead hang.' },
  { name: 'Chin-Up', muscleGroup: 'back', category: 'compound', equipment: 'bodyweight', description: 'Underhand grip pull-up with increased biceps involvement. Excellent lat and bicep builder.', instructions: 'Hang with underhand grip at shoulder width. Pull until chin over bar. Lower with control to full extension. Keep core engaged.' },
  { name: 'Barbell Bent Over Row', muscleGroup: 'back', category: 'compound', equipment: 'barbell', description: 'High load capacity horizontal pull. Requires hip hinge competency. Targets lats, rhomboids, and traps.', instructions: 'Hinge at hips ~45°, grip bar outside knees. Row to lower chest/upper abs. Squeeze shoulder blades at top. Lower with control.' },
  { name: 'Seated Cable Row', muscleGroup: 'back', category: 'compound', equipment: 'cable', description: 'Constant tension horizontal pull. Various attachments allow targeting different back areas.', instructions: 'Sit with feet on platform, slight knee bend. Pull handle to lower chest, squeezing shoulder blades. Return to full stretch. Keep torso stable.' },
  { name: 'Single Arm Dumbbell Row', muscleGroup: 'back', category: 'compound', equipment: 'dumbbell', description: 'Unilateral row for addressing imbalances. Greater ROM and core anti-rotation benefit.', instructions: 'Support with one hand on bench. Row dumbbell toward hip, keeping elbow close. Squeeze at top. Lower to full stretch.' },
  { name: 'Face Pull', muscleGroup: 'back', category: 'isolation', equipment: 'cable', description: 'Essential for shoulder health and posture. Targets rear delts and external rotators. Recommended by NSCA for prehab.', instructions: 'Set cable at face height. Pull rope toward face, spreading hands and rotating externally. Squeeze rear delts. Control return.' },
  { name: 'Close Grip Lat Pulldown', muscleGroup: 'back', category: 'compound', equipment: 'cable', description: 'Greater lat stretch compared to wide grip. Increased biceps involvement. Good variation for lat development.', instructions: 'Use V-bar or close grip attachment. Pull to upper chest, keeping elbows in front. Squeeze lats. Return to full stretch.' },
  { name: 'Inverted Row', muscleGroup: 'back', category: 'compound', equipment: 'bodyweight', description: 'Bodyweight horizontal pull. Excellent regression for those building toward pull-ups. Adjustable difficulty via body angle.', instructions: 'Hang from bar with feet on ground. Pull chest to bar, squeezing shoulder blades. Lower with control. Adjust angle for difficulty.' },
  { name: 'Straight Arm Lat Pulldown', muscleGroup: 'back', category: 'isolation', equipment: 'cable', description: 'Isolates lats without biceps involvement. Useful for mind-muscle connection and as a pre-exhaust or finisher.', instructions: 'Stand at high cable with straight arms. Pull bar down to thighs using lats only. Squeeze at bottom. Control return overhead.' },
  { name: 'T-Bar Row', muscleGroup: 'back', category: 'compound', equipment: 'barbell', description: 'Compound rowing movement for back thickness. Allows heavy loading with stable base.', instructions: 'Straddle bar, grip V-handle. Row weight to chest keeping back flat. Squeeze shoulder blades at top. Lower with control.' },

  // ==================== SHOULDERS ====================
  { name: 'Standing Barbell Overhead Press', muscleGroup: 'shoulders', category: 'compound', equipment: 'barbell', description: 'Fundamental strength movement. High anterior deltoid activation. Standing version engages core for stability.', instructions: 'Grip bar just outside shoulders, bar on front delts. Press overhead to lockout. Lower to starting position. Keep core braced, avoid excessive back arch.' },
  { name: 'Cable Lateral Raise', muscleGroup: 'shoulders', category: 'isolation', equipment: 'cable', description: 'Superior to dumbbells for lateral deltoid due to constant tension throughout ROM. No dead spot at bottom.', instructions: 'Stand beside low cable. Raise arm to side until parallel to floor. Control descent. Slight forward lean keeps tension on side delt.' },
  { name: 'Machine Shoulder Press', muscleGroup: 'shoulders', category: 'compound', equipment: 'machine', description: 'Stable pressing allowing heavy loading without balance demands. Excellent for progressive overload with reduced injury risk.', instructions: 'Adjust seat so handles at shoulder level. Press to full extension. Lower with control. Keep back against pad.' },
  { name: 'Dumbbell Lateral Raise', muscleGroup: 'shoulders', category: 'isolation', equipment: 'dumbbell', description: 'Staple shoulder isolation exercise. Builds lateral deltoid for shoulder width. Use controlled form.', instructions: 'Stand with dumbbells at sides. Raise arms to sides until parallel to floor. Slight bend in elbows. Lower with control.' },
  { name: 'Seated Dumbbell Shoulder Press', muscleGroup: 'shoulders', category: 'compound', equipment: 'dumbbell', description: 'Greater ROM than barbell. Each arm works independently addressing imbalances. Seated provides stability.', instructions: 'Sit with back support. Press dumbbells from shoulder level to overhead. Lower to ear level. Keep core engaged.' },
  { name: 'Reverse Pec Deck', muscleGroup: 'shoulders', category: 'isolation', equipment: 'machine', description: 'Machine isolation for posterior deltoid. Provides stability for focused rear delt work.', instructions: 'Face pad, grip handles. Pull handles back in arc, squeezing rear delts. Control return. Avoid using momentum.' },
  { name: 'Bent Over Reverse Fly', muscleGroup: 'shoulders', category: 'isolation', equipment: 'dumbbell', description: 'Free weight rear delt isolation. Requires hip hinge position. Targets posterior deltoid.', instructions: 'Hinge at hips, dumbbells hanging. Raise arms to sides, squeezing rear delts. Lower with control. Keep slight bend in elbows.' },
  { name: 'Arnold Press', muscleGroup: 'shoulders', category: 'compound', equipment: 'dumbbell', description: 'Incorporates rotation for anterior delt emphasis. Good variation but not essential given standard pressing movements.', instructions: 'Start with palms facing you at shoulder height. Press up while rotating palms forward. Reverse on descent.' },

  // ==================== BICEPS ====================
  { name: 'Incline Dumbbell Curl', muscleGroup: 'biceps', category: 'isolation', equipment: 'dumbbell', description: 'EMG shows highest long head activation due to stretched position at shoulder extension. Essential for bicep peak.', instructions: 'Lie on 45° incline bench. Let arms hang, curl dumbbells toward shoulders. Squeeze at top. Lower to full stretch.' },
  { name: 'Preacher Curl', muscleGroup: 'biceps', category: 'isolation', equipment: 'dumbbell', description: 'Greatest short head activation. Eliminates momentum and shoulder involvement for pure bicep isolation.', instructions: 'Rest arms on preacher pad. Curl weight toward shoulders. Squeeze at top. Lower with control to nearly full extension.' },
  { name: 'Cable Curl', muscleGroup: 'biceps', category: 'isolation', equipment: 'cable', description: 'Provides constant tension throughout full ROM. Various attachments offer variety. High muscle activation.', instructions: 'Stand facing low cable. Curl bar toward shoulders, keeping elbows stationary. Squeeze at top. Lower with control.' },
  { name: 'Barbell Curl', muscleGroup: 'biceps', category: 'isolation', equipment: 'barbell', description: 'Classic biceps exercise allowing heavier loading. Builds overall bicep mass and strength.', instructions: 'Stand with barbell at thighs, shoulder-width grip. Curl to shoulders keeping elbows at sides. Lower with control.' },
  { name: 'Hammer Curl', muscleGroup: 'biceps', category: 'isolation', equipment: 'dumbbell', description: 'Neutral grip emphasizes brachialis and brachioradialis for overall arm thickness.', instructions: 'Hold dumbbells with neutral grip (palms facing). Curl to shoulders keeping wrists neutral throughout. Lower with control.' },
  { name: 'Concentration Curl', muscleGroup: 'biceps', category: 'isolation', equipment: 'dumbbell', description: 'ACE study found highest overall biceps EMG activation. Complete isolation with no momentum possible.', instructions: 'Sit with elbow braced against inner thigh. Curl dumbbell to shoulder. Squeeze at top. Lower with control.' },
  { name: 'EZ Bar Curl', muscleGroup: 'biceps', category: 'isolation', equipment: 'barbell', description: 'Angled grip reduces wrist strain compared to straight barbell. Similar EMG activation. Good option for those with wrist discomfort.', instructions: 'Grip EZ bar at angled portions. Curl to shoulders keeping elbows at sides. Squeeze at top. Lower with control.' },

  // ==================== TRICEPS ====================
  { name: 'Overhead Cable Triceps Extension', muscleGroup: 'triceps', category: 'isolation', equipment: 'cable', description: 'Overhead position maximizes long head stretch and hypertrophy. Cable provides constant tension. Top-tier triceps exercise.', instructions: 'Face away from high cable. Start with elbows bent overhead. Extend arms forward and up. Control return to stretch position.' },
  { name: 'Skull Crusher', muscleGroup: 'triceps', category: 'isolation', equipment: 'barbell', description: 'High triceps activation compound movement. Bar should pass over head, not to forehead for safety.', instructions: 'Lie on bench, arms extended. Lower bar toward crown of head by bending elbows. Extend back to start. Keep upper arms stationary.' },
  { name: 'Triceps Pushdown', muscleGroup: 'triceps', category: 'isolation', equipment: 'cable', description: 'Staple triceps isolation. Various attachments target different heads. Rope version emphasizes lateral head.', instructions: 'Stand at high cable. Push bar/rope down to full extension. Squeeze triceps at bottom. Control return to 90°.' },
  { name: 'Close Grip Bench Press', muscleGroup: 'triceps', category: 'compound', equipment: 'barbell', description: 'Compound triceps builder allowing heavy loading. Also targets inner chest.', instructions: 'Lie on bench, grip bar shoulder width. Lower to lower chest. Press to lockout. Keep elbows closer to body than standard bench.' },
  { name: 'Triceps Dip', muscleGroup: 'triceps', category: 'compound', equipment: 'bodyweight', description: 'Bodyweight compound movement. Upright torso emphasizes triceps over chest.', instructions: 'Grip parallel bars, body upright. Lower until upper arms parallel. Press to full extension. Avoid excessive forward lean.' },
  { name: 'Triceps Kickback', muscleGroup: 'triceps', category: 'isolation', equipment: 'dumbbell', description: 'Isolation movement for triceps. Cable version provides constant tension. Good for mind-muscle connection.', instructions: 'Hinge forward, upper arm parallel to floor. Extend arm straight back. Squeeze at full extension. Lower with control.' },
  { name: 'Diamond Push-Up', muscleGroup: 'triceps', category: 'compound', equipment: 'bodyweight', description: 'Bodyweight triceps exercise with highest EMG activation per ACE study. Hands form diamond shape.', instructions: 'Push-up position with hands together forming diamond. Lower chest to hands. Press up to full extension. Keep elbows close to body.' },
  { name: 'Rope Triceps Pushdown', muscleGroup: 'triceps', category: 'isolation', equipment: 'cable', description: 'Rope attachment allows spreading at bottom for greater lateral head activation and peak contraction.', instructions: 'Grip rope at high cable. Push down and spread hands at bottom. Squeeze triceps. Control return to 90°.' },

  // ==================== LEGS - QUADS ====================
  { name: 'Barbell Back Squat', muscleGroup: 'legs', category: 'compound', equipment: 'barbell', description: 'Foundational lower body movement. High bar position emphasizes quads. King of leg exercises for overall development.', instructions: 'Bar on upper traps. Squat to at least parallel, keeping knees tracking over toes. Drive through heels to stand. Keep core braced.' },
  { name: 'Hack Squat', muscleGroup: 'legs', category: 'compound', equipment: 'machine', description: 'Fixed path machine squat. Excellent quad activation with reduced spinal load. Top-tier for quad hypertrophy.', instructions: 'Position shoulders under pads, feet shoulder width on platform. Squat to parallel or below. Press through feet to stand.' },
  { name: 'Leg Press', muscleGroup: 'legs', category: 'compound', equipment: 'machine', description: 'Lower technical demand than free squats. Allows heavy loading with reduced injury risk. Foot position alters emphasis.', instructions: 'Sit with back flat, feet shoulder width on platform. Lower weight until knees at 90°. Press to near lockout. Do not lock knees.' },
  { name: 'Leg Extension', muscleGroup: 'legs', category: 'isolation', equipment: 'machine', description: 'Only exercise isolating quads without hip involvement. Use moderate loads to protect knees.', instructions: 'Sit with back against pad, ankles behind roller. Extend legs to full lockout. Squeeze quads. Lower with control.' },
  { name: 'Bulgarian Split Squat', muscleGroup: 'legs', category: 'compound', equipment: 'dumbbell', description: 'Unilateral squat for balance and imbalance correction. High quad activation with deep stretch.', instructions: 'Rear foot on bench. Lower until rear knee nearly touches floor. Drive through front heel to stand. Keep torso upright.' },
  { name: 'Barbell Front Squat', muscleGroup: 'legs', category: 'compound', equipment: 'barbell', description: 'Upright torso position emphasizes quads and reduces spinal shear. Requires mobility.', instructions: 'Bar on front delts, elbows high. Squat to parallel keeping torso upright. Drive up through heels. Maintain elbow position.' },
  { name: 'Goblet Squat', muscleGroup: 'legs', category: 'compound', equipment: 'dumbbell', description: 'Excellent teaching tool for squat pattern. Counterbalance allows upright torso. Beginner-friendly.', instructions: 'Hold dumbbell at chest. Squat between legs to depth. Drive through heels to stand. Keep chest up throughout.' },
  { name: 'Walking Lunge', muscleGroup: 'legs', category: 'compound', equipment: 'dumbbell', description: 'Dynamic unilateral movement. Excellent for quads, glutes, and balance. Top stimulus-to-fatigue ratio.', instructions: 'Step forward into lunge, knee tracking over toe. Push off front foot to next step. Alternate legs. Keep torso upright.' },
  { name: 'Leg Press Calf Raise', muscleGroup: 'calves', category: 'isolation', equipment: 'machine', description: 'Alternative to standing calf raise machine. Allows heavy loading for calf development.', instructions: 'Position balls of feet at bottom of leg press platform. Push through toes, extending ankles fully. Control return.' },

  // ==================== LEGS - HAMSTRINGS ====================
  { name: 'Seated Leg Curl', muscleGroup: 'legs', category: 'isolation', equipment: 'machine', description: 'Superior to lying curl due to stretched position at hip flexion. Greater hamstring hypertrophy.', instructions: 'Sit with thighs under pad, ankles on roller. Curl weight by bending knees. Squeeze hamstrings. Control return.' },
  { name: 'Romanian Deadlift', muscleGroup: 'legs', category: 'compound', equipment: 'barbell', description: 'Hip hinge targeting hamstrings and glutes. Eccentric emphasis builds hamstring strength and flexibility.', instructions: 'Hold bar at thighs. Hinge at hips, sliding bar down legs. Feel hamstring stretch. Drive hips forward to stand.' },
  { name: 'Lying Leg Curl', muscleGroup: 'legs', category: 'isolation', equipment: 'machine', description: 'Traditional hamstring isolation. Effective complement to seated variation.', instructions: 'Lie face down, ankles under roller. Curl weight toward glutes. Squeeze at top. Lower with control.' },
  { name: 'Stiff Legged Deadlift', muscleGroup: 'legs', category: 'compound', equipment: 'barbell', description: 'Greater hamstring stretch than RDL. Effective for hamstring development and flexibility.', instructions: 'Hold bar at thighs, legs nearly straight. Lower bar toward feet keeping legs mostly straight. Drive hips forward to return.' },
  { name: 'Nordic Hamstring Curl', muscleGroup: 'legs', category: 'isolation', equipment: 'bodyweight', description: 'Advanced eccentric exercise. Significant injury prevention benefits. Used by elite athletes.', instructions: 'Kneel with ankles secured. Lower body forward as slowly as possible. Use hands to push back up if needed. Progress to full reps.' },

  // ==================== GLUTES ====================
  { name: 'Barbell Hip Thrust', muscleGroup: 'glutes', category: 'compound', equipment: 'barbell', description: 'Highest glute EMG activation of any exercise. Superior to squats for glute isolation.', instructions: 'Upper back on bench, bar over hips. Drive hips up until body straight. Squeeze glutes at top. Lower with control.' },
  { name: 'Glute Bridge', muscleGroup: 'glutes', category: 'compound', equipment: 'bodyweight', description: 'Bodyweight or loaded glute exercise. Excellent regression from hip thrust. Great activation.', instructions: 'Lie on back, knees bent, feet flat. Drive hips up squeezing glutes. Hold at top. Lower with control.' },
  { name: 'Cable Pull Through', muscleGroup: 'glutes', category: 'compound', equipment: 'cable', description: 'Teaches hip hinge pattern safely. Constant cable tension. Good for those avoiding deadlifts.', instructions: 'Face away from low cable, rope between legs. Hinge at hips, then drive forward squeezing glutes. Keep arms straight.' },
  { name: 'Step-Up', muscleGroup: 'glutes', category: 'compound', equipment: 'dumbbell', description: 'Unilateral glute exercise. Height adjustment changes difficulty. Good functional carryover.', instructions: 'Stand facing box/step. Step up driving through heel. Stand fully upright. Step down with control. Alternate or same leg.' },
  { name: 'Cable Kickback', muscleGroup: 'glutes', category: 'isolation', equipment: 'cable', description: 'Isolates glute max through hip extension. Cable provides constant tension. Good mind-muscle connection.', instructions: 'Face cable machine, ankle strap on. Kick leg straight back squeezing glute. Control return. Keep torso stable.' },

  // ==================== CALVES ====================
  { name: 'Standing Calf Raise', muscleGroup: 'calves', category: 'isolation', equipment: 'machine', description: 'Straight knee position emphasizes gastrocnemius. Full ROM with pause at stretch important.', instructions: 'Stand with balls of feet on platform. Lower heels for full stretch. Rise onto toes squeezing calves. Pause at top.' },
  { name: 'Seated Calf Raise', muscleGroup: 'calves', category: 'isolation', equipment: 'machine', description: 'Bent knee position targets soleus muscle. Both seated and standing needed for complete development.', instructions: 'Sit with knees under pad, balls of feet on platform. Lower heels for stretch. Rise onto toes. Pause and squeeze.' },

  // ==================== CORE ====================
  { name: 'Plank', muscleGroup: 'core', category: 'bodyweight', equipment: 'bodyweight', description: 'Foundational anti-extension exercise. Highest rectus abdominis EMG per systematic review. ACSM recommended.', instructions: 'Forearms and toes on ground. Body in straight line from head to heels. Brace core. Hold position without sagging or piking.' },
  { name: 'Cable Crunch', muscleGroup: 'core', category: 'isolation', equipment: 'cable', description: 'Allows progressive overload unlike bodyweight crunches. Constant tension. Lower back friendly.', instructions: 'Kneel facing high cable. Hold rope at head. Crunch down bringing elbows toward thighs. Control return.' },
  { name: 'Hanging Leg Raise', muscleGroup: 'core', category: 'compound', equipment: 'bodyweight', description: 'High rectus abdominis activation when performed with posterior pelvic tilt. Advanced core exercise.', instructions: 'Hang from bar. Raise legs to horizontal or higher. Focus on curling pelvis up. Lower with control.' },
  { name: 'Ab Rollout', muscleGroup: 'core', category: 'compound', equipment: 'other', description: 'Very high rectus abdominis activation. Progressive difficulty by extending ROM. Requires baseline strength.', instructions: 'Kneel holding ab wheel. Roll forward extending body. Go as far as controllable. Pull back to start using abs.' },
  { name: 'Dead Bug', muscleGroup: 'core', category: 'bodyweight', equipment: 'bodyweight', description: 'Excellent for learning core bracing. Low back stays pressed to floor. Physical therapy staple.', instructions: 'Lie on back, arms up, knees bent 90°. Extend opposite arm and leg while keeping back flat. Return and alternate.' },
  { name: 'Pallof Press', muscleGroup: 'core', category: 'isolation', equipment: 'cable', description: 'Premier anti-rotation exercise. Targets obliques and transverse abdominis. Functional stability.', instructions: 'Stand sideways to cable at chest height. Press hands straight out. Resist rotation. Hold. Return and repeat.' },
  { name: 'Russian Twist', muscleGroup: 'core', category: 'isolation', equipment: 'dumbbell', description: 'Rotational core exercise targeting obliques. Use moderate load to avoid excessive spinal rotation.', instructions: 'Sit with knees bent, feet off floor. Rotate torso side to side touching weight to floor each side. Control movement.' },
  { name: 'Bicycle Crunch', muscleGroup: 'core', category: 'compound', equipment: 'bodyweight', description: 'High rectus abdominis and oblique activation. Combines rotation with flexion for comprehensive core work.', instructions: 'Lie on back, hands behind head. Bring opposite elbow to knee while extending other leg. Alternate in cycling motion.' },
  { name: 'Side Plank', muscleGroup: 'core', category: 'bodyweight', equipment: 'bodyweight', description: 'Lateral core stability exercise. Targets obliques and quadratus lumborum. Important for spine health.', instructions: 'Lie on side, prop up on forearm. Lift hips creating straight line. Hold position. Keep hips stacked.' },

  // ==================== FULL BODY ====================
  { name: 'Conventional Deadlift', muscleGroup: 'full_body', category: 'compound', equipment: 'barbell', description: 'Fundamental full-body lift. One of highest total-body muscle activation exercises. Technique critical for safety.', instructions: 'Stand with feet hip width, bar over mid-foot. Hinge and grip bar. Drive through floor keeping bar close. Stand tall. Reverse to lower.' },
  { name: 'Trap Bar Deadlift', muscleGroup: 'full_body', category: 'compound', equipment: 'other', description: 'More quad involvement than conventional. Neutral grip reduces bicep strain. Reduced spinal shear forces.', instructions: 'Stand inside trap bar, feet hip width. Grip handles, hinge slightly. Drive through floor to stand. Keep chest up. Lower with control.' },
  { name: 'Farmers Walk', muscleGroup: 'full_body', category: 'compound', equipment: 'dumbbell', description: 'Functional loaded carry. High core activation. Builds grip strength and work capacity with minimal injury risk.', instructions: 'Hold heavy dumbbells at sides. Walk with upright posture. Keep shoulders back, core braced. Maintain steady pace.' },
  { name: 'Sumo Deadlift', muscleGroup: 'full_body', category: 'compound', equipment: 'barbell', description: 'Wide stance increases quad and adductor involvement. Shorter ROM than conventional. May suit certain body types.', instructions: 'Wide stance, toes pointed out. Grip bar inside legs. Drive through floor, pushing knees out. Stand tall. Lower with control.' },
  { name: 'Kettlebell Swing', muscleGroup: 'full_body', category: 'compound', equipment: 'kettlebell', description: 'Ballistic hip hinge with power development. High metabolic demand. Effective for conditioning and posterior chain.', instructions: 'Hinge with kettlebell between legs. Explosively drive hips forward, swinging bell to shoulder height. Control descent and repeat.' },

  // ==================== CARDIO ====================
  { name: 'Running', muscleGroup: 'cardio', category: 'cardio', equipment: 'bodyweight', description: 'Classic cardiovascular exercise. Can be performed at various intensities. Burns significant calories.', instructions: 'Maintain upright posture. Land midfoot. Keep cadence around 170-180 steps per minute. Control breathing.' },
  { name: 'Cycling', muscleGroup: 'cardio', category: 'cardio', equipment: 'machine', description: 'Low impact cardiovascular exercise. Easy on joints while providing excellent conditioning.', instructions: 'Adjust seat height so slight knee bend at bottom. Maintain steady cadence. Control resistance for desired intensity.' },
  { name: 'Rowing Machine', muscleGroup: 'cardio', category: 'cardio', equipment: 'machine', description: 'Full body cardiovascular exercise. Engages legs, back, and arms. Excellent for HIIT or steady state.', instructions: 'Drive with legs first, then lean back slightly, then pull handle to chest. Return in reverse order. Maintain rhythm.' },
  { name: 'Jump Rope', muscleGroup: 'cardio', category: 'cardio', equipment: 'other', description: 'High intensity cardio that improves coordination. Burns calories efficiently. Portable equipment.', instructions: 'Jump just high enough to clear rope. Land on balls of feet. Keep elbows close to body. Rotate rope with wrists.' },
  { name: 'Burpees', muscleGroup: 'cardio', category: 'cardio', equipment: 'bodyweight', description: 'Full body conditioning exercise. Combines squat, plank, and jump. Excellent for metabolic conditioning.', instructions: 'Squat down, place hands on floor. Jump feet back to plank. Do push-up. Jump feet to hands. Jump up with hands overhead.' },
]

const defaultTemplates = [
  {
    name: 'Push Day',
    description: 'Chest, shoulders, and triceps focused workout',
    category: 'push_pull_legs',
    targetMuscles: 'chest,shoulders,triceps',
    estimatedDuration: 60,
    difficulty: 'intermediate',
    exercises: [
      { name: 'Barbell Bench Press', sets: 4, targetReps: '8-10' },
      { name: 'Incline Dumbbell Press', sets: 3, targetReps: '10-12' },
      { name: 'Overhead Press', sets: 3, targetReps: '8-10' },
      { name: 'Lateral Raises', sets: 3, targetReps: '12-15' },
      { name: 'Tricep Pushdown', sets: 3, targetReps: '12-15' },
      { name: 'Overhead Tricep Extension', sets: 3, targetReps: '12-15' },
    ]
  },
  {
    name: 'Pull Day',
    description: 'Back and biceps focused workout',
    category: 'push_pull_legs',
    targetMuscles: 'back,biceps',
    estimatedDuration: 60,
    difficulty: 'intermediate',
    exercises: [
      { name: 'Deadlift', sets: 4, targetReps: '5-6' },
      { name: 'Pull-ups', sets: 3, targetReps: '8-12' },
      { name: 'Barbell Row', sets: 3, targetReps: '8-10' },
      { name: 'Face Pulls', sets: 3, targetReps: '15-20' },
      { name: 'Barbell Curl', sets: 3, targetReps: '10-12' },
      { name: 'Hammer Curls', sets: 3, targetReps: '12-15' },
    ]
  },
  {
    name: 'Leg Day',
    description: 'Complete lower body workout',
    category: 'push_pull_legs',
    targetMuscles: 'legs',
    estimatedDuration: 60,
    difficulty: 'intermediate',
    exercises: [
      { name: 'Barbell Squat', sets: 4, targetReps: '6-8' },
      { name: 'Romanian Deadlift', sets: 3, targetReps: '10-12' },
      { name: 'Leg Press', sets: 3, targetReps: '12-15' },
      { name: 'Walking Lunges', sets: 3, targetReps: '12 each' },
      { name: 'Leg Curl', sets: 3, targetReps: '12-15' },
      { name: 'Calf Raises', sets: 4, targetReps: '15-20' },
    ]
  },
  {
    name: 'Upper Body',
    description: 'Full upper body workout',
    category: 'upper_lower',
    targetMuscles: 'chest,back,shoulders,biceps,triceps',
    estimatedDuration: 75,
    difficulty: 'intermediate',
    exercises: [
      { name: 'Barbell Bench Press', sets: 4, targetReps: '8-10' },
      { name: 'Barbell Row', sets: 4, targetReps: '8-10' },
      { name: 'Overhead Press', sets: 3, targetReps: '8-10' },
      { name: 'Lat Pulldown', sets: 3, targetReps: '10-12' },
      { name: 'Dumbbell Curl', sets: 3, targetReps: '12-15' },
      { name: 'Tricep Pushdown', sets: 3, targetReps: '12-15' },
    ]
  },
  {
    name: 'Lower Body',
    description: 'Complete leg and glute workout',
    category: 'upper_lower',
    targetMuscles: 'legs',
    estimatedDuration: 60,
    difficulty: 'intermediate',
    exercises: [
      { name: 'Barbell Squat', sets: 4, targetReps: '6-8' },
      { name: 'Romanian Deadlift', sets: 4, targetReps: '8-10' },
      { name: 'Bulgarian Split Squat', sets: 3, targetReps: '10-12' },
      { name: 'Leg Extension', sets: 3, targetReps: '12-15' },
      { name: 'Leg Curl', sets: 3, targetReps: '12-15' },
      { name: 'Calf Raises', sets: 4, targetReps: '15-20' },
    ]
  },
  {
    name: 'Full Body Workout',
    description: 'Complete full body training session',
    category: 'full_body',
    targetMuscles: 'full_body',
    estimatedDuration: 60,
    difficulty: 'beginner',
    exercises: [
      { name: 'Barbell Squat', sets: 3, targetReps: '8-10' },
      { name: 'Barbell Bench Press', sets: 3, targetReps: '8-10' },
      { name: 'Barbell Row', sets: 3, targetReps: '8-10' },
      { name: 'Overhead Press', sets: 3, targetReps: '8-10' },
      { name: 'Romanian Deadlift', sets: 3, targetReps: '10-12' },
      { name: 'Plank', sets: 3, targetReps: '60 sec' },
    ]
  },
]

async function main() {
  console.log('Seeding database...')

  // Create achievements
  console.log('Creating achievements...')
  for (const achievement of defaultAchievements) {
    const existing = await prisma.achievement.findUnique({
      where: { name: achievement.name }
    })
    
    if (!existing) {
      await prisma.achievement.create({
        data: achievement
      })
    }
  }
  console.log(`Created ${defaultAchievements.length} achievements`)

  // Create exercises
  console.log('Creating exercises...')
  for (const exercise of defaultExercises) {
    const existing = await prisma.exercise.findFirst({
      where: {
        name: exercise.name,
        userId: null
      }
    })
    
    if (!existing) {
      await prisma.exercise.create({
        data: {
          ...exercise,
          isCustom: false,
          isPublic: true,
        }
      })
    }
  }
  console.log(`Created ${defaultExercises.length} exercises`)

  // Create templates
  console.log('Creating templates...')
  for (const template of defaultTemplates) {
    const { exercises: templateExercises, ...templateData } = template
    const templateId = template.name.toLowerCase().replace(/\s+/g, '-')

    const existingTemplate = await prisma.workoutTemplate.findUnique({
      where: { id: templateId }
    })

    if (!existingTemplate) {
      // Get exercise IDs
      const exerciseRecords = await Promise.all(
        templateExercises.map(async (e) => {
          const exercise = await prisma.exercise.findFirst({
            where: { name: e.name }
          })
          return { ...e, exerciseId: exercise?.id }
        })
      )

      await prisma.workoutTemplate.create({
        data: {
          id: templateId,
          ...templateData,
          isPublic: true,
          exercises: {
            create: exerciseRecords
              .filter(e => e.exerciseId)
              .map((e, index) => ({
                exerciseId: e.exerciseId,
                order: index,
                sets: e.sets,
                targetReps: e.targetReps,
                restTime: 90,
              }))
          }
        }
      })
    }
  }
  console.log(`Created ${defaultTemplates.length} templates`)

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
