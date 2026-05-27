// Tempo — exercise data
// Each bucket has 10 exercises balanced across movement patterns:
// squat, hinge, push, pull, lunge, core, carry, full

const PATTERNS = {
  squat:  { label: "Squat",     hint: "Sit down, stand up" },
  hinge:  { label: "Hinge",     hint: "Bend at the hips" },
  push:   { label: "Push",      hint: "Press away from you" },
  pull:   { label: "Pull",      hint: "Draw toward you" },
  lunge:  { label: "Lunge",     hint: "Step and sink" },
  core:   { label: "Core",      hint: "Brace the middle" },
  carry:  { label: "Carry",     hint: "Move with load" },
  full:   { label: "Full body", hint: "Everything at once" },
};

// Helper to keep declarations terse
const ex = (id, name, pattern, steps) => ({ id, name, pattern, steps });

const EXERCISES = {
  "bodyweight-strength-beginner": [
    ex("bw-air-squat",        "Air Squat",            "squat",  ["Stand with feet shoulder-width apart, toes turned out 15–30°.","Brace your core and pull your shoulders down and back.","Initiate by hinging at the hips — think 'sit back into a chair.'","Bend knees as hips lower; keep knees tracking over your toes, never caving in.","Descend until thighs are parallel to the floor (or as low as you can keep heels grounded).","Drive through the whole foot to stand; squeeze glutes at the top."]),
    ex("bw-glute-bridge",     "Glute Bridge",         "hinge",  ["Lie on your back; bend knees and plant feet flat under your knees.","Tuck your ribs and brace your core so the low back is flat on the floor.","Press through your heels to lift hips until knees, hips, and shoulders form one line.","Squeeze your glutes hard at the top — do not hyperextend the low back.","Lower under control for a 2-count back to the floor."]),
    ex("bw-incline-pushup",   "Incline Push-up",      "push",   ["Place hands shoulder-width apart on a sturdy bench or counter, directly under your shoulders.","Step feet back so your body forms one straight line from head to heels.","Brace your core, squeeze glutes, and tuck the ribs so hips do not sag.","Lower chest toward the bench with elbows angling back at ~45° from your torso.","Press the bench away to return; do not let shoulders shrug at the top."]),
    ex("bw-doorway-row",      "Doorway Row",          "pull",   ["Grip a sturdy door frame at chest height with both hands.","Walk feet toward the frame and lean back with arms straight; heels planted.","Brace the core so your body stays in one rigid line from heels to head.","Pull your chest toward the frame, leading with the elbows and squeezing the shoulder blades.","Lower under control for a 2-count back to arms-extended."]),
    ex("bw-step-back-lunge",  "Step-back Lunge",      "lunge",  ["Stand tall with feet hip-width, hands on hips or at your chest.","Take a long step back — long enough that the front shin can stay vertical at the bottom.","Lower the back knee straight down toward the floor; front thigh ends parallel.","Front knee stacks over the ankle; torso stays upright, chest tall.","Drive through the front heel to stand; bring the back foot home before switching."]),
    ex("bw-dead-bug",         "Dead Bug",             "core",   ["Lie on back; arms straight up over shoulders, knees stacked over hips at 90°.","Press your low back firmly into the floor and hold it there the whole rep.","Slowly lower opposite arm and leg toward the floor without losing low-back contact.","Stop just before either limb touches; return to the start under control.","Switch sides each rep — quality over speed."]),
    ex("bw-suitcase-hold",    "Suitcase Hold",        "carry",  ["Pick up any heavy household object (gallon jug, kettlebell, backpack) in one hand.","Stand tall; shoulders pulled down and back, level with each other.","Brace the core so the loaded side doesn't pull you into a side bend.","Walk slowly across the room and back; eyes forward, ribs over hips.","Switch hands and repeat."]),
    ex("bw-bird-dog",         "Bird Dog",             "full",   ["Start on all fours: hands under shoulders, knees under hips, spine neutral.","Brace your core as if bracing for a light punch to the stomach.","Slowly extend opposite arm and leg until both are parallel to the floor.","Pause one beat at full reach — keep hips square, no tipping side to side.","Return under control; switch sides each rep."]),
    ex("bw-wall-squat",       "Wall Sit",             "squat",  ["Stand with your back flat against a wall, feet ~2 feet out and shoulder-width.","Slide down the wall until thighs are parallel to the floor.","Knees stack directly over ankles (not past toes); shins vertical.","Press the low back into the wall and breathe slow and even.","Hold each rep for 10 seconds."]),
    ex("bw-knee-pushup",      "Knee Push-up",         "push",   ["Start on hands and knees; hands shoulder-width and directly under shoulders.","Walk knees back so body forms a straight line from knees to head.","Brace core, squeeze glutes, tuck ribs so hips do not sag or pike up.","Lower chest toward the floor; elbows angle back at ~45° from torso.","Press the floor away to return; lock out fully at the top."]),
  ],

  "bodyweight-strength-intermediate": [
    ex("bw-bulgarian",        "Split Squat",          "squat",  ["Rear foot elevated on a chair behind you.","Sink the back knee toward the floor.","Front knee tracks over the foot.","Drive up through the front heel."]),
    ex("bw-single-leg-rdl",   "Single-leg Hinge",     "hinge",  ["Stand on one leg, slight knee bend.","Hinge at the hips, free leg trails back.","Reach hands toward the floor.","Stand back up with a hip squeeze."]),
    ex("bw-pushup",           "Push-up",              "push",   ["Plank on hands; hands shoulder-width, directly under shoulders, fingers forward.","Body forms one straight line head to heels; squeeze glutes and brace core.","Lower chest toward the floor with elbows angling back at ~45° from torso.","Stop when your chest is 2–3 inches off the floor (elbows ~90°).","Press the floor away as one unit; do not let hips lead or lag."]),
    ex("bw-inverted-row",     "Inverted Row",         "pull",   ["Set a sturdy bar at hip height; lie under it.","Grip the bar shoulder-width, arms straight; body in one line from heels to head.","Squeeze shoulder blades together as you pull your chest to the bar.","Pause one beat with chest near the bar; elbows angled ~45° from the torso.","Lower slowly until arms fully extend; reset for the next rep."]),
    ex("bw-walking-lunge",    "Walking Lunge",        "lunge",  ["Stand tall with feet hip-width, hands on hips or at chest.","Step forward into a long lunge — long enough that the front shin stays vertical.","Lower the back knee toward the floor; front thigh ends parallel to the ground.","Drive through the front heel to stand; step the back foot forward into the next lunge.","Alternate legs each step; keep the torso upright the whole way."]),
    ex("bw-hollow-hold",      "Hollow Hold",          "core",   ["Lie on your back; press the low back firmly into the floor.","Brace your core; reach arms straight overhead by your ears.","Lift shoulders and straight legs a few inches off the floor.","Body forms a shallow banana shape; do not let the low back lift.","Hold each rep for 10 seconds, breathing shallow through the brace."]),
    ex("bw-bear-crawl",       "Bear Crawl",           "carry",  ["Knees hover one inch above the floor.","Move opposite hand and foot together.","Stay low and quiet.","Crawl 10 steps forward, 10 back per rep."]),
    ex("bw-burpee-step",      "Step-back Burpee",     "full",   ["Squat down, hands to the floor.","Step feet back to a plank.","Step them in and stand up.","Reach overhead at the top."]),
    ex("bw-pike-pushup",      "Pike Push-up",         "push",   ["Form an inverted V with hips high.","Bend elbows, crown of head toward floor.","Press back up to the V.","Keep legs straight if you can."]),
    ex("bw-side-plank",       "Side Plank",           "core",   ["Lie on your side, forearm under shoulder, legs stacked.","Lift hips off the floor so body forms one straight line from feet to head.","Stack hips and shoulders — do not let the top hip rock forward.","Breathe steady; squeeze the bottom-side oblique.","Hold each rep for 10 seconds per side."]),
  ],

  "bodyweight-strength-advanced": [
    ex("bw-pistol",           "Pistol Squat",         "squat",  ["Stand on one leg, other leg straight ahead.","Sit hips back and down all the way.","Free heel stays off the floor.","Drive up to standing."]),
    ex("bw-single-leg-bridge","Single-leg Hip Thrust","hinge",  ["Lie on back, one foot planted, other leg straight up.","Drive through the planted heel to lift hips.","Squeeze at the top for one beat.","Lower with control. Switch sides each set."]),
    ex("bw-archer-pushup",    "Archer Push-up",       "push",   ["Wide hands, lower toward one side.","Other arm stays nearly straight.","Press up and shift to the other side.","Alternate every rep."]),
    ex("bw-pullup",           "Pull-up",              "pull",   ["Hang from a bar with hands shoulder-width, palms facing away.","Engage shoulders — pull them down and back so you do not hang from the joint.","Brace the core; squeeze glutes; keep a slight 'hollow body' line.","Pull elbows down and back until your chin clears the bar.","Lower under control for a 2-count to a full hang."]),
    ex("bw-shrimp",           "Shrimp Squat",         "lunge",  ["Stand on one leg, grab the other foot behind.","Sink down until the back knee taps.","Free arm reaches forward for balance.","Stand up without setting down."]),
    ex("bw-dragon-flag",      "Dragon Flag",          "core",   ["Lie on a bench, grip behind your head.","Lift body straight, only shoulders touching.","Lower with control, body rigid.","Reverse slowly."]),
    ex("bw-handstand-walk",   "Handstand Hold",       "carry",  ["Kick up to a handstand against a wall.","Stack shoulders over wrists.","Squeeze everything tight.","Hold each rep for 15 seconds."]),
    ex("bw-burpee",           "Full Burpee",          "full",   ["Drop to a plank, chest to the floor.","Snap feet forward, explode up.","Reach overhead, clap if you like.","Land soft and repeat."]),
    ex("bw-hspu",             "Handstand Push-up",    "push",   ["Kick up against a wall.","Lower the crown of head to floor.","Press back up explosively.","Stay tight throughout."]),
    ex("bw-front-lever",      "Front Lever Hold",     "pull",   ["Hang from a bar, body horizontal to floor.","Squeeze lats hard, point toes.","Hold the line as long as you can.","Hold each rep for 8 seconds."]),
  ],

  "bodyweight-cardio-beginner": [
    ex("bw-march",            "March in Place",       "full",   ["Stand tall, soft knees.","Lift one knee to hip height.","Swing opposite arm up.","Alternate at a steady beat. 30 seconds = 1 rep."]),
    ex("bw-step-touch",       "Side Step Touch",      "lunge",  ["Step right, tap left foot in.","Now step left, tap right in.","Stay light on the balls of feet.","30 seconds = 1 rep."]),
    ex("bw-toe-tap",          "Toe Taps",             "squat",  ["Find a low step or thick book.","Alternate tapping toes onto it.","Keep a quick, steady rhythm.","30 seconds = 1 rep."]),
    ex("bw-arm-circles",      "Arm Circles",          "push",   ["Arms out wide at shoulder height.","Make small forward circles.","Reverse after 15 seconds.","30 seconds = 1 rep."]),
    ex("bw-good-morning",     "Standing Good-morning","hinge",  ["Hands behind head, soft knees.","Hinge forward to a flat back.","Stand tall again with a hip squeeze.","Keep a steady tempo."]),
    ex("bw-half-jacks",       "Half Jacks",           "full",   ["Step one foot out, arms to shoulders.","Return, then step the other way.","Stay light and rhythmic.","30 seconds = 1 rep."]),
    ex("bw-knee-pull",        "Standing Knee Pull",   "core",   ["Stand tall, hands overhead.","Crunch one knee up to elbows.","Reset and alternate.","Steady beat. 30 seconds = 1 rep."]),
    ex("bw-shadow-box",       "Shadow Box",           "pull",   ["Light bounce, hands up by chin.","Throw alternating soft jabs.","Breathe out on each punch.","30 seconds = 1 rep."]),
    ex("bw-farmer-walk-bw",   "Brisk Walk Around",    "carry",  ["Walk briskly around the room.","Long strides, swing arms naturally.","Breathe through the nose.","45 seconds = 1 rep."]),
    ex("bw-heel-flick",       "Heel Flicks",          "lunge",  ["Jog in place, kicking heels to glutes.","Soft landings, quiet feet.","Keep arms moving.","30 seconds = 1 rep."]),
  ],

  "bodyweight-cardio-intermediate": [
    ex("bw-jumping-jack",     "Jumping Jacks",        "full",   ["Feet together, arms down.","Jump feet wide as arms swing up.","Return on the next beat.","30 seconds = 1 rep."]),
    ex("bw-mountain-climber", "Mountain Climbers",    "core",   ["Start in a high plank, body straight.","Drive one knee to chest, then switch.","Quick, even tempo.","30 seconds = 1 rep."]),
    ex("bw-skater",           "Skater Hops",          "lunge",  ["Hop sideways, landing on one foot.","Other foot swings behind for balance.","Spring to the other side.","30 seconds = 1 rep."]),
    ex("bw-squat-jump",       "Squat Jump",           "squat",  ["Sink into a quarter squat.","Explode straight up.","Land soft, sink, repeat.","Continuous rhythm."]),
    ex("bw-high-knee",        "High Knees",           "full",   ["Run in place, knees to hip height.","Pump the arms.","Stay on the balls of feet.","30 seconds = 1 rep."]),
    ex("bw-inchworm",         "Inchworm",             "hinge",  ["Hinge forward, walk hands to plank.","Hold one beat at the top.","Walk hands back, stand tall.","Move smoothly."]),
    ex("bw-pop-squat",        "Pop Squat",            "squat",  ["Feet wide, squat down.","Pop feet together standing.","Jump back out to a squat.","Stay light."]),
    ex("bw-fast-feet",        "Fast Feet",            "carry",  ["Tiny, rapid steps in place.","Stay low, hands ready.","Switch directions every few beats.","30 seconds = 1 rep."]),
    ex("bw-plank-jack",       "Plank Jacks",          "core",   ["Hold a high plank.","Jump feet wide, then back together.","Hips stay level.","30 seconds = 1 rep."]),
    ex("bw-jump-rope",        "Invisible Jump Rope",  "pull",   ["Spin wrists, hop with both feet.","Land softly on the balls of feet.","Find an easy rhythm.","45 seconds = 1 rep."]),
  ],

  "bodyweight-cardio-advanced": [
    ex("bw-burpee-pull",      "Burpee + Tuck Jump",   "full",   ["Drop to chest, snap up.","Explode into a tuck jump.","Knees to chest at the apex.","Land soft and repeat."]),
    ex("bw-broad-jump",       "Broad Jump + Back",    "squat",  ["Jump forward as far as you can.","Land soft and stable.","Walk or jog back.","Reset and repeat."]),
    ex("bw-tuck-jump",        "Tuck Jumps",           "squat",  ["Jump straight up.","Pull knees to chest at the top.","Land soft and immediately rebound.","Continuous, controlled."]),
    ex("bw-spider-climber",   "Spider Climbers",      "core",   ["High plank, drive knee to same elbow.","Quick alternation.","Hips stay low.","30 seconds = 1 rep."]),
    ex("bw-clap-pushup",      "Clap Push-up",         "push",   ["Lower into a push-up.","Press up explosively, clap.","Catch the floor softly.","Continuous reps."]),
    ex("bw-jump-lunge",       "Jumping Lunges",       "lunge",  ["Sink into a lunge.","Explode up, switch legs mid-air.","Land soft into the next lunge.","Continuous rhythm."]),
    ex("bw-bear-sprint",      "Bear Sprint",          "carry",  ["Bear position, knees off floor.","Sprint forward 10 steps.","Sprint back 10 steps.","One round = one rep."]),
    ex("bw-shuttle",          "Shuttle Run",          "full",   ["Mark two spots ~5 paces apart.","Sprint to one, touch the floor.","Sprint back, touch.","One round = one rep."]),
    ex("bw-pike-jump",        "Pike Jump",            "hinge",  ["Hands down, kick legs up to a pike.","Tap floor with hands, snap legs down.","Stand and reach.","Continuous."]),
    ex("bw-explosive-row",    "Explosive Row Pull",   "pull",   ["Under a sturdy bar, body straight.","Pull chest up, let go for a beat.","Re-catch and lower with control.","Continuous reps."]),
  ],

  "equipment-strength-beginner": [
    ex("eq-goblet-squat",     "Goblet Squat",         "squat",  ["Hold one dumbbell vertically at your chest, both hands cupping the top.","Feet shoulder-width, toes turned out 15–30°. Elbows tucked inside the knees.","Initiate by hinging at the hips — sit back, then drop down between your heels.","Knees track over toes; descend until elbows touch the inside of the knees.","Drive through the whole foot; keep the chest tall and the weight close.", "Equipment: 1 dumbbell"]),
    ex("eq-db-rdl",           "Dumbbell Hinge",       "hinge",  ["Stand with feet hip-width, a dumbbell in each hand in front of your thighs.","Soft bend in the knees — then lock that angle. Knees don't bend further on the way down.","Push your hips straight back as the dumbbells slide down along your legs.","Lower the weights to mid-shin or just below the knees, keeping a flat back.","Stand by driving the hips forward; squeeze glutes at the top — do not hyperextend.", "Equipment: 2 dumbbells"]),
    ex("eq-db-bench",         "Dumbbell Floor Press", "push",   ["Lie on the floor, dumbbells at shoulders.","Press straight up, palms forward.","Lower until elbows tap the floor.","Press again with control.", "Equipment: 2 dumbbells"]),
    ex("eq-db-row",           "Dumbbell Row",         "pull",   ["Place one hand and same-side knee on a bench; spine flat and parallel to the floor.","Let the dumbbell hang at arm's length directly below your shoulder.","Brace core; pull the dumbbell up toward your hip, elbow leading.","Squeeze the shoulder blade in for one beat at the top.","Lower slowly until the arm is fully extended; switch sides at the set break.", "Equipment: 1 dumbbell"]),
    ex("eq-reverse-lunge",    "Dumbbell Reverse Lunge","lunge", ["Stand with a dumbbell in each hand at your sides; feet hip-width.","Brace your core; keep shoulders pulled down and back.","Step one foot back — long step so the front shin stays vertical.","Lower the back knee straight down; front thigh ends parallel.","Drive through the front heel to stand; bring the back foot home before switching.", "Equipment: 2 dumbbells"]),
    ex("eq-db-deadbug",       "Weighted Dead Bug",    "core",   ["Lie on back, one dumbbell pressed up.","Lower opposite leg slowly.","Low back stays pressed down.","Switch sides each rep.", "Equipment: 1 dumbbell"]),
    ex("eq-farmer-carry",     "Farmer Carry",         "carry",  ["A dumbbell in each hand.","Stand tall, shoulders down.","Walk slowly 20 paces.","Turn and walk back. One round = one rep.", "Equipment: 2 dumbbells"]),
    ex("eq-db-clean",         "Dumbbell Clean",       "full",   ["Dumbbells at your sides.","Hinge, then explode up.","Catch the weights at your shoulders.","Lower with control.", "Equipment: 2 dumbbells"]),
    ex("eq-db-press",         "Standing Shoulder Press","push",  ["Dumbbells at shoulders, palms forward.","Press straight overhead.","Biceps frame the ears at the top.","Lower with control.", "Equipment: 2 dumbbells"]),
    ex("eq-db-curl-press",    "Curl to Press",        "pull",   ["Dumbbells at sides, palms forward.","Curl to shoulders, then press overhead.","Reverse the motion smoothly.","One round = one rep.", "Equipment: 2 dumbbells"]),
  ],

  "equipment-strength-intermediate": [
    ex("eq-front-squat",      "Dumbbell Front Squat", "squat",  ["Hold a dumbbell in each hand at shoulder height; elbows pointing forward and high.","Feet shoulder-width, toes turned out 15–30°; brace core.","Initiate by hinging at the hips, then drop down between your heels.","Keep elbows high so the torso stays upright; chest tall throughout.","Drive through the whole foot to stand; lock out hips at the top.", "Equipment: 2 dumbbells"]),
    ex("eq-rdl",              "Romanian Deadlift",    "hinge",  ["Stand tall with a dumbbell in each hand in front of your thighs.","Soft bend in the knees and freeze that angle for the whole rep.","Push your hips straight back; dumbbells slide along your thighs.","Lower until the weights reach mid-shin or just below the knees — keep a flat back.","Stand by driving hips forward; squeeze glutes at the top, do not hyperextend.", "Equipment: 2 dumbbells"]),
    ex("eq-bench-press",      "Bench Press",          "push",   ["Lie on the bench, feet planted; eyes directly under the bar.","Grip just outside shoulder-width; pull shoulder blades down and squeezed together.","Unrack the bar over your shoulders; lower under control to your mid-chest.","Elbows angle back ~45° from the torso — don't flare at 90°.","Press the bar straight up; lock out without losing the shoulder pack.", "Equipment: 2 dumbbells + bench"]),
    ex("eq-pendlay",          "Bent Over Row",        "pull",   ["Stand with a dumbbell in each hand, feet hip-width.","Hinge at the hips until torso is at about 45°; flat back, neutral neck.","Let the dumbbells hang straight down; arms long, core tight.","Pull both dumbbells up to the lower ribs — elbows lead, squeeze shoulder blades.","Lower under control for a 2-count; do not round the back.", "Equipment: 2 dumbbells"]),
    ex("eq-bulgarian-eq",     "Bulgarian Split Squat","lunge",  ["Rear foot on a bench, dumbbells at sides.","Sink the back knee toward the floor.","Drive up through the front heel.","Switch legs each set.", "Equipment: 2 dumbbells + bench"]),
    ex("eq-rotation",         "Weighted Russian Twist","core",  ["Sit, lean back, heels light on floor.","Hold a dumbbell at chest.","Rotate side to side under control.","Two taps = one rep.", "Equipment: 1 dumbbell"]),
    ex("eq-suitcase-carry",   "Suitcase Carry",       "carry",  ["One dumbbell in one hand.","Stand tall, do not lean.","Walk 20 paces and back.","Switch hands each rep.", "Equipment: 1 dumbbell"]),
    ex("eq-thruster",         "Dumbbell Thruster",    "full",   ["Front squat with dumbbells at shoulders.","Drive up and press overhead.","One smooth motion.","Lower to shoulders softly.", "Equipment: 2 dumbbells"]),
    ex("eq-arnold",           "Arnold Press",         "push",   ["Dumbbells at shoulders, palms in.","Rotate as you press overhead.","Reverse the rotation coming down.","Smooth tempo.", "Equipment: 2 dumbbells"]),
    ex("eq-upright-row",      "Upright Row",          "pull",   ["Dumbbells in front of thighs.","Pull elbows high and wide.","Weights rise to chest level.","Lower with control.", "Equipment: 2 dumbbells"]),
  ],

  "equipment-strength-advanced": [
    ex("eq-back-squat",       "Barbell Back Squat",   "squat",  ["Bar across upper back, feet shoulder-width.","Sit hips down between the heels.","Chest up, knees track toes.","Drive up powerfully.", "Equipment: barbell"]),
    ex("eq-deadlift",         "Deadlift",             "hinge",  ["Set the bar over mid-foot; feet hip-width, toes slightly out.","Hinge to grip the bar just outside the knees; shins vertical, hips above knees.","Pull slack out of the bar; chest up, lats tight, neutral spine.","Stand by pushing the floor away with your feet; hips and shoulders rise together.","Lock out by squeezing glutes; lower under control by hinging hips back first.", "Equipment: barbell"]),
    ex("eq-bench-bar",        "Barbell Bench Press",  "push",   ["Lie on bench, grip just outside shoulders.","Lower bar to mid-chest under control.","Press straight up.","Keep glutes on the bench.", "Equipment: barbell + bench"]),
    ex("eq-weighted-pull",    "Weighted Pull-up",     "pull",   ["Belt or hold a dumbbell between feet.","Hang from the bar.","Pull chest to the bar.","Lower with control.", "Equipment: pull-up bar + dumbbell"]),
    ex("eq-back-lunge",       "Barbell Reverse Lunge","lunge",  ["Bar on upper back.","Step one foot back, sink straight down.","Drive up through the front heel.","Switch legs each rep.", "Equipment: barbell"]),
    ex("eq-hanging-raise",    "Hanging Leg Raise",    "core",   ["Hang from a pull-up bar.","Lift legs to horizontal, straight.","Lower with control, no swing.","Continuous reps.", "Equipment: pull-up bar"]),
    ex("eq-kb-carry",         "Heavy Farmer Carry",   "carry",  ["A heavy dumbbell in each hand.","Stand tall, shoulders packed.","Walk 30 paces and back.","One round = one rep.", "Equipment: 2 heavy dumbbells"]),
    ex("eq-clean-jerk",       "Clean and Press",      "full",   ["Dumbbells outside the feet.","Pull up, catch at shoulders.","Drive overhead in one motion.","Lower to the floor.", "Equipment: 2 dumbbells"]),
    ex("eq-incline-press",    "Incline Bench Press",  "push",   ["Bench at 30°, dumbbells at shoulders.","Press up over the upper chest.","Lower with control.","Wrists stay stacked.", "Equipment: 2 dumbbells + incline bench"]),
    ex("eq-pendlay-row",      "Pendlay Row",          "pull",   ["Hinge to parallel, bar on the floor.","Explosively row to the lower chest.","Reset on the floor each rep.","Strict back angle.", "Equipment: barbell"]),
  ],

  "equipment-cardio-beginner": [
    ex("eq-kb-march",         "Loaded March",         "carry",  ["One dumbbell at chest height.","March in place, knees to hip.","Steady tempo.","45 seconds = 1 rep.", "Equipment: 1 dumbbell"]),
    ex("eq-step-up",          "Dumbbell Step-up",     "lunge",  ["Dumbbells at sides, low step or bench.","Step up, full stand at the top.","Lower with control.","Alternate legs each rep.", "Equipment: 2 dumbbells + step"]),
    ex("eq-light-thruster",   "Light Thruster",       "full",   ["Light dumbbells at shoulders.","Squat, drive up, press overhead.","One smooth rhythm.","Steady tempo for the set.", "Equipment: 2 light dumbbells"]),
    ex("eq-db-swing-light",   "Light Dumbbell Swing","hinge",   ["One dumbbell in two hands.","Hinge back, swing to chest height.","Drive with the hips.","Continuous reps.", "Equipment: 1 dumbbell"]),
    ex("eq-press-out",        "Press-outs",           "push",   ["Hold one dumbbell at chest.","Press straight out, arms extended.","Bring back to chest.","Steady tempo.", "Equipment: 1 dumbbell"]),
    ex("eq-bent-row-light",   "Light Row Pulses",     "pull",   ["Hinged over, dumbbells hanging.","Quick, strict rows.","No body english.","30 seconds = 1 rep.", "Equipment: 2 dumbbells"]),
    ex("eq-suit-shuffle",     "Suitcase Shuffle",     "core",   ["One dumbbell at your side.","Side-shuffle 5 steps each way.","Stand tall, no lean.","Switch sides each rep.", "Equipment: 1 dumbbell"]),
    ex("eq-light-squat",      "Light Goblet Pulses",  "squat",  ["Light dumbbell at chest.","Half-squat at a quick tempo.","Stay tall and controlled.","30 seconds = 1 rep.", "Equipment: 1 light dumbbell"]),
    ex("eq-curl-jog",         "Curl + Jog in Place",  "pull",   ["Light dumbbells at sides.","Jog softly while curling.","Easy, rhythmic.","45 seconds = 1 rep.", "Equipment: 2 light dumbbells"]),
    ex("eq-overhead-march",   "Overhead Carry March","carry",   ["One dumbbell locked overhead.","March in place, ribs down.","Switch arms halfway.","45 seconds = 1 rep.", "Equipment: 1 dumbbell"]),
  ],

  "equipment-cardio-intermediate": [
    ex("eq-db-swing",         "Dumbbell Swing",       "hinge",  ["One dumbbell, hike between legs.","Snap hips to swing to chest height.","Let it fall back, hinge again.","Continuous reps.", "Equipment: 1 dumbbell"]),
    ex("eq-thruster-int",     "Dumbbell Thruster",    "full",   ["Dumbbells at shoulders.","Front squat, then press overhead.","Smooth, continuous tempo.","30 seconds = 1 rep.", "Equipment: 2 dumbbells"]),
    ex("eq-renegade",         "Renegade Row",         "pull",   ["High plank on dumbbell handles.","Row one weight to hip, then the other.","Hips stay square to floor.","Two rows = one rep.", "Equipment: 2 dumbbells"]),
    ex("eq-goblet-cycle",     "Goblet Squat Cycle",   "squat",  ["Dumbbell at chest.","Cycle: squat, stand, repeat.","Steady, quick tempo.","30 seconds = 1 rep.", "Equipment: 1 dumbbell"]),
    ex("eq-burpee-row",       "Burpee + Row",         "full",   ["Dumbbells on the floor.","Burpee down, then row each weight.","Stand and reset.","One round = one rep.", "Equipment: 2 dumbbells"]),
    ex("eq-step-up-quick",    "Quick Step-ups",       "lunge",  ["Dumbbells at sides, low bench.","Quick alternating step-ups.","Light landings.","30 seconds = 1 rep.", "Equipment: 2 dumbbells + step"]),
    ex("eq-pushup-row",       "Push-up to Row",       "push",   ["Push-up on dumbbell handles.","At the top, row one weight.","Switch arms each rep.","Continuous tempo.", "Equipment: 2 dumbbells"]),
    ex("eq-suitcase-jog",     "Suitcase Jog",         "carry",  ["One dumbbell at your side.","Jog in place 30 seconds.","Switch sides.","One full minute = one rep.", "Equipment: 1 dumbbell"]),
    ex("eq-windmill-flow",    "Windmill Flow",        "core",   ["Light dumbbell locked overhead.","Hinge sideways, eyes on the weight.","Stand back tall.","Switch sides each rep.", "Equipment: 1 light dumbbell"]),
    ex("eq-snatch",           "Dumbbell Snatch",      "hinge",  ["One dumbbell between feet.","Pull explosively overhead in one move.","Lower with control.","Switch arms each rep.", "Equipment: 1 dumbbell"]),
  ],

  "equipment-cardio-advanced": [
    ex("eq-bb-complex",       "Barbell Complex",      "full",   ["RDL → row → clean → press → squat.","One rep each, then repeat.","Bar does not touch the floor.","One cycle = one rep.", "Equipment: barbell"]),
    ex("eq-man-maker",        "Man Maker",            "full",   ["Burpee + row each side + clean + press.","Continuous, full-body motion.","Smooth transitions.","One round = one rep.", "Equipment: 2 dumbbells"]),
    ex("eq-heavy-swing",      "Heavy Swing",          "hinge",  ["Heavier dumbbell, two hands.","Drive hips, swing to overhead.","Control the descent.","Continuous reps.", "Equipment: 1 heavy dumbbell"]),
    ex("eq-thruster-heavy",   "Heavy Thruster",       "squat",  ["Heavier dumbbells at shoulders.","Squat + press in one motion.","Breathe at the top.","Continuous tempo.", "Equipment: 2 dumbbells"]),
    ex("eq-double-snatch",    "Double DB Snatch",     "pull",   ["Two dumbbells between feet.","Pull both overhead in one move.","Lower with control.","Reset each rep.", "Equipment: 2 dumbbells"]),
    ex("eq-jump-squat-load",  "Loaded Jump Squat",    "squat",  ["Light dumbbells at sides.","Quarter squat, explode up.","Land soft, repeat.","Continuous reps.", "Equipment: 2 dumbbells"]),
    ex("eq-overhead-walk",    "Overhead Walk",        "carry",  ["Two dumbbells locked overhead.","Walk 20 paces.","Ribs down, glutes tight.","Turn and walk back.", "Equipment: 2 dumbbells"]),
    ex("eq-renegade-pushup",  "Renegade Push-up",     "push",   ["Push-up on dumbbells.","Row each side at the top.","Continuous, controlled.","One round = one rep.", "Equipment: 2 dumbbells"]),
    ex("eq-clean-burpee",     "Clean + Burpee",       "lunge",  ["Burpee on the dumbbells.","Stand into a clean.","Lower with control.","One round = one rep.", "Equipment: 2 dumbbells"]),
    ex("eq-turkish-getup",    "Turkish Get-up",       "core",   ["Lie down, one dumbbell pressed up.","Stand up step-by-step, weight overhead.","Reverse the steps back down.","Switch arms each rep.", "Equipment: 1 dumbbell"]),
  ],
};

const KEY_LABELS = {
  bodyweight: "Bodyweight",
  equipment:  "Equipment",
  cardio:     "Cardio",
  strength:   "Strength",
  beginner:   "Beginner",
  intermediate: "Intermediate",
  advanced:   "Advanced",
};

function bucketKey(s) {
  return `${s.gear}-${s.kind}-${s.level}`;
}

Object.assign(window, { EXERCISES, PATTERNS, KEY_LABELS, bucketKey });
