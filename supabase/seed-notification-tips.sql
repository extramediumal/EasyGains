-- Seed notification_tips with 228 research-backed coaching tips
-- Sources: Mind Pump Media, Dr. Rhonda Patrick, Dr. Andy Galpin, Andrew Huberman
-- See docs/research/notification-tips-research.md for full sourcing

INSERT INTO notification_tips (category, source, message_title, message_body) VALUES

-- ============================================================
-- MIND PUMP MEDIA (56 tips)
-- ============================================================

-- Protein & Nutrition (Tips 1-4)
('protein', 'mind_pump', 'Mind Pump', 'You don''t need 1g of protein per pound of bodyweight to build muscle. That''s supplement marketing math. 0.7-0.8g/lb covers almost everyone.'),
('protein', 'mind_pump', 'Mind Pump', 'Stop stressing about the ''anabolic window.'' You don''t need a shake within 30 minutes of training. Just hit your daily protein total.'),
('protein', 'mind_pump', 'Mind Pump', 'If you want to optimize protein, space it into 30-50g meals every 3-4 hours. But honestly? Just hitting your daily target is 90% of the game.'),
('protein', 'mind_pump', 'Mind Pump', 'Falling short on protein every day? Add one shake. That''s 25-50g you were missing. Whole foods first, supplements to fill gaps.'),

-- Supplements (Tips 5-7)
('supplements', 'mind_pump', 'Mind Pump', 'Creatine monohydrate. 3-5g a day. Every day. It''s the one supplement that actually works and has hundreds of studies behind it.'),
('supplements', 'mind_pump', 'Mind Pump', 'Gained 3 lbs after starting creatine? Relax. It''s water pulled INTO your muscles, not bloat. That''s a good thing.'),
('supplements', 'mind_pump', 'Mind Pump', 'Save your money on 99% of supplements. If your diet and training are solid, only creatine and caffeine have real evidence behind them.'),

-- Training Principles (Tips 8-11)
('training', 'mind_pump', 'Mind Pump', 'Progressive overload doesn''t mean adding 20 lbs to the bar. Going from 5 reps to 6 reps at the same weight? That''s progress. Track it.'),
('training', 'mind_pump', 'Mind Pump', 'Try trigger sessions on off days: 5-10 min of light band work or bodyweight moves. Gets blood to the muscles, speeds recovery, no fatigue.'),
('training', 'mind_pump', 'Mind Pump', 'Your daily step count matters more than your cardio session. Aim for 8-10k steps. It burns more total calories than most people''s gym cardio.'),
('training', 'mind_pump', 'Mind Pump', 'Stop 2-3 reps short of failure on most sets. You''ll recover faster, train more consistently, and build more muscle long-term.'),

-- Myth-Busting (Tips 12-16)
('myth_busting', 'mind_pump', 'Mind Pump', 'Cardio doesn''t burn fat. Your diet does. Cardio actually slows your metabolism over time by teaching your body to be more ''efficient.'' Lift instead.'),
('myth_busting', 'mind_pump', 'Mind Pump', 'Sore muscles don''t mean you had a great workout. It just means you did something new. Progress is in the numbers, not the pain.'),
('myth_busting', 'mind_pump', 'Mind Pump', 'You don''t need to train 6 days a week. 3 solid full-body sessions with progressive overload beats 6 junk-volume sessions every time.'),
('myth_busting', 'mind_pump', 'Mind Pump', 'Eating 6 small meals a day doesn''t ''stoke your metabolism.'' Studies show frequent protein feedings can actually desensitize your body to it.'),
('myth_busting', 'mind_pump', 'Mind Pump', 'If cardio is your main fat loss tool, limit it to a couple 30-min sessions a week or long walks. Make weights the priority.'),

-- Mindset & Consistency (Tips 17-20)
('mindset', 'mind_pump', 'Mind Pump', 'You don''t need to make fitness your whole identity. A few solid habits done consistently will change your body more than any ''transformation challenge.'''),
('mindset', 'mind_pump', 'Mind Pump', 'January transformations fail because people start unsustainably hard. The boring stuff — showing up 3x a week, eating protein, walking — is what actually works.'),
('mindset', 'mind_pump', 'Mind Pump', 'Proper weight training can boost your metabolism 20-50% over 6 months. No amount of cardio does that. Build muscle, burn more at rest.'),
('mindset', 'mind_pump', 'Mind Pump', 'When dieting, your body secretly makes you move less without you noticing. That''s why tracking your steps matters — fight the invisible slowdown.'),

-- Sleep & Recovery (Tips 21-25)
('sleep', 'mind_pump', 'Mind Pump', 'Sleep under 7 hours tanks your testosterone by 10-15% in just one week. Your gains literally happen in bed — prioritize 7-9 hours like it''s a training program.'),
('sleep', 'mind_pump', 'Mind Pump', 'Kill blue light 1-2 hours before bed. Dim the lights, grab some blue-blockers, and let your brain wind down. Better sleep = better recovery = better gains.'),
('sleep', 'mind_pump', 'Mind Pump', 'Get 30 min of direct sunlight in the morning. It resets your circadian rhythm so you sleep deeper at night AND boosts vitamin D for testosterone. Double win.'),
('recovery', 'mind_pump', 'Mind Pump', 'Can''t beat last week''s numbers? That''s not failure — that''s your body saying it''s time to deload. Cut volume and intensity in half for a week. You''ll come back stronger.'),
('recovery', 'mind_pump', 'Mind Pump', 'Feeling wired but tired, sleep quality dropping, resting heart rate creeping up? Those are overtraining red flags. Back off before your body forces you to.'),

-- Hormones & Testosterone (Tips 26-28)
('hormones', 'mind_pump', 'Mind Pump', 'Eating too little fat crushes your hormones. Mind Pump recommends 30-40% of your calories from fat — think eggs, grass-fed beef, olive oil. Your testosterone needs cholesterol to exist.'),
('hormones', 'mind_pump', 'Mind Pump', 'Low vitamin D = low testosterone. 15-20 minutes of sun exposure (ideally shirtless) beats most supplements. If you can''t get sun, supplement with D3.'),
('hormones', 'mind_pump', 'Mind Pump', 'Chronic stress keeps cortisol high, which directly suppresses testosterone. Managing stress isn''t soft — it''s literally hormonal optimization.'),

-- Body Composition (Tips 29-34)
('nutrition', 'mind_pump', 'Mind Pump', 'Done dieting? Don''t just jump back to normal eating. Reverse diet by adding 100-200 calories per week. Your metabolism will actually speed up instead of storing everything as fat.'),
('nutrition', 'mind_pump', 'Mind Pump', 'If your weight loss stalled but you''re eating less than ever, that''s metabolic adaptation. Your body lowered your BMR, NEAT, and workout burn to survive. Time to reverse diet back up.'),
('nutrition', 'mind_pump', 'Mind Pump', 'Bulking? Aim for 1-2 lbs per month, not per week. Anything faster is mostly fat. Keep the surplus small — just 200-300 calories above maintenance.'),
('nutrition', 'mind_pump', 'Mind Pump', 'Start a bulk around 10% body fat, ride it to about 15%, then cut. Short cycles of building and cutting beat endless dirty bulks for long-term body composition.'),
('nutrition', 'mind_pump', 'Mind Pump', 'After 4+ weeks of dieting and progress stalls, take a 1-2 week diet break at maintenance calories. It resets your metabolism, preserves muscle, and keeps you sane.'),
('nutrition', 'mind_pump', 'Mind Pump', 'Mind Pump''s SBC framework: Strength first, Build muscle second, Cut fat last. Most people do it backwards — they diet first and have no muscle to reveal.'),

-- Mobility & Flexibility (Tips 35-38)
('mobility', 'mind_pump', 'Mind Pump', 'Skip the treadmill warm-up. Spend those 5-10 minutes on mobility drills instead — they wake up dormant muscles and make your actual lifts way more effective.'),
('mobility', 'mind_pump', 'Mind Pump', 'Mobility isn''t flexibility. Flexibility is touching your toes. Mobility is owning that range of motion under load. Train full range of motion on every lift and you build both.'),
('mobility', 'mind_pump', 'Mind Pump', '10 minutes of daily mobility work beats a 60-minute session once a week. Consistency wins. Pick your worst area and hit 1-2 drills for it every single day.'),
('mobility', 'mind_pump', 'Mind Pump', 'Cossack squats for hip mobility, yoga push-ups for shoulder mobility. Two moves, zero equipment, massive payoff for injury prevention.'),

-- Nutrition — Specific Food Advice (Tips 39-43)
('nutrition', 'mind_pump', 'Mind Pump', 'Aim for 30-40g of protein per meal from real food — eggs, chicken, beef, fish. Spreading it across meals beats dumping it all in one shake.'),
('nutrition', 'mind_pump', 'Mind Pump', 'Treat sugar like alcohol — have it sparingly and don''t pretend it''s okay just because you work out. Being fit doesn''t give you a pass on metabolic health.'),
('nutrition', 'mind_pump', 'Mind Pump', 'When you''re craving sugar, eat a piece of whole fruit instead. You get the sweetness plus fiber to slow absorption. Mind Pump says under 70g added sugar daily max.'),
('nutrition', 'mind_pump', 'Mind Pump', 'Sal''s rule: avoid all processed food and drink mostly water. Sounds extreme but most of your results come from just eating real, whole foods consistently.'),
('nutrition', 'mind_pump', 'Mind Pump', 'For carbs, stick to oats, rice, potatoes, and quinoa. They fuel your workouts, keep cortisol low, and support testosterone better than going ultra low-carb.'),

-- Alcohol (Tip 44)
('nutrition', 'mind_pump', 'Mind Pump', 'Mind Pump''s take on alcohol: you don''t have to quit, but treat it like a treat. Drink infrequently, hydrate like crazy, and don''t kid yourself that it''s harmless.'),

-- Mental Health & Sustainable Fitness (Tips 45-48)
('mindset', 'mind_pump', 'Mind Pump', 'Ate like garbage yesterday? Don''t punish yourself with extra cardio or skipping meals. Accept it, forgive yourself, and nail your next meal. That''s how consistent people think.'),
('mindset', 'mind_pump', 'Mind Pump', 'Before you eat, ask: ''Am I eating this because I love my body, or because I''m bored/stressed?'' That one question changes everything about your food choices.'),
('mindset', 'mind_pump', 'Mind Pump', 'Exercise is one of the best natural treatments for anxiety and depression. Not a replacement for professional help, but 3-4 lifting sessions a week can genuinely change your brain chemistry.'),
('mindset', 'mind_pump', 'Mind Pump', 'Weight loss should improve your quality of life, not destroy it. If your diet makes you miserable, it''s not sustainable. Build habits you''d actually want to keep for years.'),

-- Women-Specific Training (Tips 49-51)
('training', 'mind_pump', 'Mind Pump', 'Ladies: lifting heavy will NOT make you bulky. Building muscle is incredibly slow, and 99.99% of women will never look like a bodybuilder no matter how hard they train. Lift heavy with confidence.'),
('training', 'mind_pump', 'Mind Pump', 'Women often get better results from higher frequency, lower volume training. Hit each muscle group more often with fewer sets per session instead of one brutal workout per week.'),
('training', 'mind_pump', 'Mind Pump', 'Building muscle helps balance estrogen, testosterone, and insulin sensitivity. For women, strength training isn''t just about looks — it''s hormonal optimization.'),

-- Aging & Longevity (Tips 52-54)
('longevity', 'mind_pump', 'Mind Pump', 'Resistance training is the #1 exercise for aging well. For every 10% increase in muscle mass, you get an 11% drop in pre-diabetes risk. Muscle is medicine.'),
('longevity', 'mind_pump', 'Mind Pump', 'After 40, muscle loss accelerates every decade if you don''t fight it. Strength training prevents bone loss, improves balance, and keeps you independent. Start now or wish you had.'),
('longevity', 'mind_pump', 'Mind Pump', 'Joint pain over 40? Don''t stop training — train smarter. Full range of motion with controlled tempo builds joint resilience. Avoiding movement makes it worse.'),

-- Beginner Mistakes (Tips 55-56)
('mindset', 'mind_pump', 'Mind Pump', 'Stop program hopping. Pick one solid program and follow it for at least 8-12 weeks before you judge it. Switching every 3 weeks means you never actually adapt.'),
('mindset', 'mind_pump', 'Mind Pump', 'Master the fundamentals before obsessing over details. A sustained calorie deficit and consistent lifting will get you 90% of the results. Sodium timing and supplement stacking are the last 1%.'),

-- ============================================================
-- DR. RHONDA PATRICK (59 tips)
-- ============================================================

-- Nutrition Science — Micronutrients (Tips 1-4)
('nutrition', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'Broccoli sprouts are lowkey one of the most powerful foods you can eat. The sulforaphane in them activates your body''s own detox and antioxidant defenses (NRF2 pathway). Toss some on a salad.'),
('supplements', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'Most people are walking around vitamin D deficient and don''t know it. Rhonda Patrick keeps hers at 40-60 ng/mL and takes 6,000 IU daily — even living in San Diego. Get yours tested.'),
('supplements', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'Your omega-3 index might matter more than your cholesterol. Rhonda Patrick aims for above 8% — that level is linked to better heart and brain health. Fish oil or fatty fish can get you there.'),
('supplements', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'Magnesium is involved in 300+ enzyme reactions and most people don''t get enough. Industrial farming has depleted it from soil. Magnesium glycinate before bed is a solid move for sleep and recovery.'),

-- Protein & Muscle (Tips 5-8)
('protein', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'Not all protein meals are equal. You need 2-3g of leucine per meal to actually flip the switch on muscle protein synthesis. That''s roughly 30-40g of protein from whole foods, or one scoop of whey.'),
('protein', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'Good news: you don''t need to chug a shake within 30 minutes of training. Muscle protein synthesis stays elevated for up to 24 hours post-exercise. Just hit your daily protein target.'),
('protein', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'Over 40? Your muscles become less responsive to protein. The fix: hit that leucine threshold at every meal AND keep lifting. Exercise restores your muscle''s sensitivity to amino acids.'),
('protein', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'Wild fact: your body breaks down and rebuilds about 300 grams of protein every single day. That''s why consistent protein intake matters — you''re literally rebuilding yourself.'),

-- Supplements (Tips 9-11)
('supplements', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'Creatine isn''t just for gains. At 5-10g/day it preserves muscle, maintains bone density, AND boosts cognition — especially when you''re stressed or sleep-deprived. Rhonda takes it daily.'),
('supplements', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'If you could only take 5 supplements, Rhonda Patrick''s picks: vitamin D, omega-3 fish oil, magnesium, a multivitamin, and sulforaphane. Cover those bases before anything fancy.'),
('supplements', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'PQQ is one of those under-the-radar supplements. It supports mitochondrial biogenesis — literally helping your cells make new power plants. Rhonda takes 20mg daily.'),

-- Exercise Science (Tips 12-14)
('recovery', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'Sauna 4-7x per week was linked to a 40% lower risk of dying from all causes in Finnish studies. 20 minutes per session. It''s basically a cardio session while sitting still.'),
('brain_health', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'Sauna after a workout increases BDNF (brain growth factor) more than exercise alone. Your brain literally grows new neurons. Stack heat stress with training for a combo bonus.'),
('training', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'Didn''t sleep great? A quick HIIT session can reverse the insulin resistance caused by even one night of bad sleep. It''s the single best thing you can do after a rough night.'),

-- Sleep & Recovery (Tips 15-17)
('sleep', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'Eating close to bed wrecks your sleep quality. The glucose spike raises body temp and insulin, which messes with your sleep cycles. Cut the kitchen off 3 hours before lights out.'),
('sleep', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'Losing just 1 hour of sleep for 3 nights straight is enough to mess up your glucose regulation and insulin sensitivity. Protect your sleep like you protect your protein intake.'),
('sleep', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'Want to sleep better tonight? Get 30-60 minutes of bright light first thing in the morning. It sets your circadian clock and makes your melatonin kick in harder at night. Rhonda''s #1 sleep hack.'),

-- Practical Nutrition (Tips 18-20)
('nutrition', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'Rhonda Patrick''s smoothie hack: blend kale, spinach, avocado, flax seeds, and berries. You''ll hit a ridiculous amount of micronutrients in one glass. Pro tip — she cut back on fruit after seeing blood sugar spikes on a CGM.'),
('nutrition', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'Time-restricted eating isn''t about eating less — it''s about eating in a consistent window. Rhonda stops eating 3 hours before bed. People who do this improve metabolic markers without cutting calories.'),
('sleep', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'Can''t wind down at night? Rhonda takes 2g of inositol before bed for sleep quality. It''s cheap, well-studied, and pairs well with magnesium. Low-key sleep stack.'),

-- Micronutrients — Advanced (Tips 21-26)
('supplements', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'Vitamin K2 tells calcium where to go — into your bones, not your arteries. Pair it with D3 and they work way better together than alone.'),
('supplements', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'Rhonda takes benfotiamine (fat-soluble B1) to block advanced glycation end products — the junk that forms when sugar reacts with proteins and accelerates aging.'),
('supplements', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'Zinc acetate lozenges can cut your cold recovery time by up to 40%. Keep some on hand during cold season — they work best started within 24 hours of symptoms.'),
('supplements', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'Zinc is required for testosterone production. Even mild deficiency tanks immune function AND hormone levels — two reasons to make sure you''re not low.'),
('supplements', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'Not all B vitamins are created equal. Rhonda uses a multivitamin with active/methylated forms of folate and B12 because many people have MTHFR gene variants that make it harder to use the cheap synthetic forms.'),
('supplements', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'Selenium supports thyroid function and DNA repair. Most people get enough from 2-3 Brazil nuts a day — it''s one of the easiest micronutrient wins out there.'),

-- Gut Health (Tips 27-31)
('gut_health', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'A Stanford study found that eating 6 servings of fermented foods daily increased gut microbiome diversity AND decreased 19 inflammatory markers — including IL-6. A high-fiber diet didn''t have the same diversity effect.'),
('gut_health', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'Interleukin-6 is a key driver of chronic inflammation. In the Stanford fermented foods study, it dropped significantly after just 10 weeks of adding kimchi, kefir, yogurt, or sauerkraut to the diet.'),
('gut_health', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'Blueberries contain pectin, a prebiotic fiber that feeds your good gut bacteria. You get antioxidants AND microbiome support from the same food.'),
('gut_health', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'Leafy greens contain sulfoquinovose, a unique prebiotic sugar that specifically feeds beneficial gut bacteria. Another reason to eat your greens beyond just vitamins.'),
('gut_health', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'Berries, dark chocolate, and colorful produce are rich in polyphenols that increase gut microbial diversity. More colors on your plate = more diverse gut bugs.'),

-- Exercise & Brain Health (Tips 32-37)
('brain_health', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'Just 6 minutes of high-intensity cycling increased brain-derived neurotrophic factor by 4-5x. BDNF is the protein that grows new brain cells and strengthens memory.'),
('brain_health', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'Trained muscles act like sponges, absorbing kynurenine (a neurotoxin linked to depression) from your blood and converting it to a harmless form. Literally, stronger muscles = more resilient brain.'),
('brain_health', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'That burning feeling during hard exercise? Your muscles are producing lactate, and your brain soaks it up as premium fuel. Lactate also signals BDNF release and boosts focus via norepinephrine.'),
('brain_health', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'Exercise triggers your body''s own endocannabinoid system — the same system CBD targets. This is one reason a hard workout reduces anxiety and pain naturally.'),
('brain_health', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'Vigorous aerobic exercise promotes neurogenesis in the hippocampus — that''s literally growing new neurons in the brain region responsible for learning and memory.'),
('brain_health', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'A single session of aerobic exercise increased BDNF by 42% in older adults and improved verbal memory. You don''t need months of training — even one session helps your brain.'),

-- Aging & Longevity (Tips 38-43)
('longevity', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'Supplementing glycine, proline, and hydroxyproline (3:1:1 ratio) reduced biological age by an average of 1.4 years after 6 months. Some participants saw reductions of 8-12 years.'),
('longevity', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'NAD+ is essential for DNA repair and energy production, and it drops as you age. Exercise naturally boosts NAD+ and activates sirtuins (longevity proteins) without needing supplements.'),
('longevity', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'People with an active FOXO3 gene variant are 2.7x more likely to become centenarians. You can activate FOXO3 through fasting, sauna use, and eating quercetin-rich foods like onions and apples.'),
('longevity', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'Astaxanthin — the antioxidant that makes salmon pink — increased FOXO3 longevity gene activation by 90% in mice. Wild salmon and krill are the best food sources.'),
('longevity', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'Meditation activates the gene that produces telomerase, the enzyme that rebuilds your telomeres (chromosome caps that shorten with aging). Stress shortens them; meditation fights back.'),
('longevity', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'Glycine (found in collagen and bone broth) improves sleep quality AND is one of the key amino acids your body needs to make collagen. Two-for-one longevity hack.'),

-- Inflammation (Tips 44-46)
('nutrition', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'Omega-3s aren''t just anti-inflammatory — they''re pro-resolving. They activate the shutdown process for inflammation. Without enough omega-3, inflammation lingers way longer than it should.'),
('nutrition', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'In the Framingham study, higher omega-3 blood levels correlated with lower levels across 10 different inflammatory biomarkers, including C-reactive protein. More fish, less fire.'),
('nutrition', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'Rhonda says if you eat a Standard American Diet, the single most impactful change is cutting refined sugar. Not adding superfoods — just removing the one thing causing the most damage.'),

-- Genetics & Epigenetics (Tips 47-49)
('longevity', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'About 1 in 4 people carry the APOE4 gene variant (2-3x Alzheimer''s risk). Rhonda''s published research shows DHA in phospholipid form (from fish roe, not fish oil capsules) may bypass the faulty brain transport in these carriers.'),
('longevity', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'Fish roe (salmon eggs, etc.) contains 38-75% of its omega-3s in phospholipid form, which uses a different transporter to enter the brain. Regular fish oil supplements don''t do this.'),
('longevity', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'Diet, exercise, sleep, and stress literally change which genes get turned on or off. Epigenetic changes from lifestyle can override genetic risk factors for many chronic diseases.'),

-- Heat & Cold Science (Tips 50-53)
('recovery', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'Finnish studies found that using a sauna 4-7 times per week at 174F+ for 20+ minutes decreased all-cause mortality by 40%. Your heart rate hits 120-150 BPM — it''s basically passive cardio.'),
('recovery', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'An hour at 57F (14C) neck-deep cold water boosted norepinephrine by 530% and dopamine by 250%. Even a 20-second dip in very cold water (40F) gets you a 200-300% norepinephrine boost.'),
('recovery', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'Norepinephrine from cold exposure triggers the ''browning'' of fat tissue, making it more metabolically active. Brown fat burns regular fat for heat — so cold literally helps your body burn fat differently.'),
('recovery', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'Cold exposure activates RBM3, a cold shock protein that helps regenerate damaged neurons by boosting protein synthesis at synapses. Your brain literally repairs itself better when you get cold.'),

-- Cancer Prevention (Tips 54-55)
('longevity', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'Quercetin (in onions, apples, berries) combined with dasatinib works as a senolytic — clearing out zombie ''senescent'' cells that drive aging and cancer risk. Eat your onions.'),
('longevity', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'Broccoli sprouts contain up to 100x more sulforaphane than mature broccoli. Sulforaphane activates Nrf2, your body''s master antioxidant switch, and kills cancer stem cells in lab studies.'),

-- Practical Food Tips (Tips 56-59)
('nutrition', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'Wild Alaskan salmon naturally accumulates EPA, DHA, and astaxanthin from its diet. Farmed salmon eats grain and corn, with synthetic astaxanthin added to fake the pink color. Rhonda says always go wild.'),
('nutrition', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'Rhonda specifically recommends blending over juicing because juicers strip out the fiber. The fiber is prebiotic fuel for your gut bacteria AND slows sugar absorption. Don''t throw it away.'),
('nutrition', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'Wearing a continuous glucose monitor showed Rhonda that poor sleep dramatically spiked her blood sugar response to the same foods. It also made her reduce fruit in her smoothies after seeing unexpected glucose spikes.'),
('nutrition', 'rhonda_patrick', 'Dr. Rhonda Patrick', 'Different colored produce = different polyphenols and antioxidants = more diverse gut microbiome = less inflammation. Rhonda specifically recommends variety of colors over just volume of veggies.'),

-- ============================================================
-- DR. ANDY GALPIN (57 tips)
-- ============================================================

-- Training Programming (Tips 1-3)
('training', 'andy_galpin', 'Dr. Andy Galpin', '3 full-body sessions a week beats a 6-day bro split for most people. Miss a Monday? No muscle group goes untrained all week.'),
('training', 'andy_galpin', 'Dr. Andy Galpin', 'For muscle growth, anywhere from 5 to 30 reps works — as long as you stop about 2 reps shy of failure. The set matters more than the rep count.'),
('training', 'andy_galpin', 'Dr. Andy Galpin', 'Building strength? Stay at 5 reps or fewer per set, 70%+ of your max, and rest 2-4 minutes. Strength is a skill — keep it crisp.'),

-- Nutrition for Performance (Tips 4-7)
('nutrition', 'andy_galpin', 'Dr. Andy Galpin', 'Stop stressing about meal timing. Unless you''re a competitive athlete, hitting your total daily protein matters way more than when you eat it.'),
('hydration', 'andy_galpin', 'Dr. Andy Galpin', 'The Galpin Equation: body weight in lbs / 30 = ounces of water every 15 min during training. A 180 lb person? That''s 6 oz per 15 min. Easy math, big difference.'),
('hydration', 'andy_galpin', 'Dr. Andy Galpin', 'Add 200-400mg of sodium to your workout water. Muscle contraction runs on electrical gradients — sodium, potassium, magnesium. Plain water alone doesn''t cut it.'),
('nutrition', 'andy_galpin', 'Dr. Andy Galpin', 'Doing a long or intense session? Consider 60g of carbs per hour during training. Glycogen depletion kills performance way before your muscles give out.'),

-- Recovery (Tips 8-10)
('recovery', 'andy_galpin', 'Dr. Andy Galpin', 'Had a rough night of sleep? Ask yourself: am I in a push phase or near a deload? If you''re pushing, train anyway. If you''re coasting, take the rest.'),
('recovery', 'andy_galpin', 'Dr. Andy Galpin', 'Still sore from your last session? A light walk or easy movement clears more soreness than sitting on the couch. Active recovery is recovery tool #1.'),
('recovery', 'andy_galpin', 'Dr. Andy Galpin', 'Schedule a deload every 4-8 weeks. Not because you''re weak — because accumulated fatigue is invisible until it wrecks your progress.'),

-- Supplements (Tips 11-13)
('supplements', 'andy_galpin', 'Dr. Andy Galpin', 'Take 5g of creatine monohydrate daily. It''s the most researched supplement in history, it''s dirt cheap, and timing doesn''t matter. Just be consistent.'),
('supplements', 'andy_galpin', 'Dr. Andy Galpin', 'Creatine isn''t just for muscles. It helps your brain recover from bad sleep — effects kick in within 3.5 hours and can last up to 9. Keep that daily 5g going.'),
('supplements', 'andy_galpin', 'Dr. Andy Galpin', 'Weigh over 180 lbs? You might want 10g of creatine instead of 5. Galpin adjusts dosage by body size — bigger frame, bigger phosphocreatine pool to fill.'),

-- Cardio & Conditioning (Tips 14-16)
('cardio', 'andy_galpin', 'Dr. Andy Galpin', 'You only need 5-6 total minutes of all-out effort per week to improve VO2max. That''s it. Try 30 seconds on, 30 seconds off for 4+ rounds, 1-2 days a week.'),
('cardio', 'andy_galpin', 'Dr. Andy Galpin', 'Zone 2 cardio won''t kill your gains. Galpin says it can actually help hypertrophy by improving blood flow and recovery. Aim for 150-180 min per week.'),
('cardio', 'andy_galpin', 'Dr. Andy Galpin', 'Zone 2 makes everything above it better. But only doing HIIT won''t improve your Zone 2 base. Build from the bottom up.'),

-- Practical Wisdom (Tips 17-20)
('training', 'andy_galpin', 'Dr. Andy Galpin', 'The two biggest reasons people don''t see results: no consistency and no progressive overload. Both are almost impossible without a plan. Write it down.'),
('training', 'andy_galpin', 'Dr. Andy Galpin', '10 sets per muscle per week is the minimum to maintain what you''ve built. Below that, you''re slowly losing ground. Above that, you''re growing.'),
('hydration', 'andy_galpin', 'Dr. Andy Galpin', 'Daily hydration baseline: half your body weight (in lbs) in ounces of water. That''s before training even starts. Most people are behind before they pick up a weight.'),
('training', 'andy_galpin', 'Dr. Andy Galpin', 'Train to technical failure, not absolute failure. When your form breaks, the set is done. This is how you train hard for decades without getting hurt.'),

-- Flexibility & Mobility (Tips 21-24)
('mobility', 'andy_galpin', 'Dr. Andy Galpin', 'Train every joint through its full range of motion each week. More range = more muscle growth. Just don''t sacrifice technique to get there.'),
('mobility', 'andy_galpin', 'Dr. Andy Galpin', 'For each muscle group, pick one exercise that loads it in the stretched position and one that loads it shortened. Example: incline curls (stretched) + preacher curls (shortened). Covers all the fibers.'),
('mobility', 'andy_galpin', 'Dr. Andy Galpin', 'Static stretching before lifting can reduce power output. Use dynamic warm-ups pre-workout (leg swings, hip circles, arm circles). Save the long holds for after your session.'),
('mobility', 'andy_galpin', 'Dr. Andy Galpin', 'Unless you''re dealing with a specific tightness or injury, skip static stretches between working sets — it can cost you gains. Move around instead.'),

-- Testing & Self-Assessment (Tips 25-30)
('training', 'andy_galpin', 'Dr. Andy Galpin', 'Grip strength is one of the strongest predictors of longevity and overall health. Grab a $30 dynamometer: men should hit 40+ kg, women 35+ kg. Less than 10% difference between hands.'),
('training', 'andy_galpin', 'Dr. Andy Galpin', 'Can you hang from a bar for 60 seconds? That''s the gold standard. Under 30 seconds means grip and upper body endurance need work. All you need is a pull-up bar.'),
('training', 'andy_galpin', 'Dr. Andy Galpin', 'Stand still, jump forward. If you can jump your own height, your power is solid. Women may be ~15% less. No gym needed — just a flat surface and a tape measure.'),
('training', 'andy_galpin', 'Dr. Andy Galpin', 'Want a quick muscular endurance check? Men: aim for 25+ consecutive push-ups. Women: 15+. If you can''t hit those, add push-ups to your warm-up a few times per week.'),
('cardio', 'andy_galpin', 'Dr. Andy Galpin', 'Run as far as you can in 12 minutes. It''s a legit proxy for VO2 max and costs nothing. Retest every 3-6 months to track your cardio fitness over time.'),
('recovery', 'andy_galpin', 'Dr. Andy Galpin', 'Squeeze a grip dynamometer first thing in the morning. If your numbers are notably down from baseline, your nervous system hasn''t recovered yet. Consider backing off training that day.'),

-- Breathing & Performance (Tips 31-33)
('cardio', 'andy_galpin', 'Dr. Andy Galpin', 'Breathing through your nose during Zone 2 cardio engages your diaphragm and intercostals more, basically simulating altitude training. Switch to mouth breathing only above ~70% effort.'),
('recovery', 'andy_galpin', 'Dr. Andy Galpin', 'Take 4 deep breaths, then exhale as slowly as possible through pursed lips. If you can control the exhale for 30-60 seconds, you''re well-recovered. Under 20 seconds? You might need more rest.'),
('recovery', 'andy_galpin', 'Dr. Andy Galpin', 'Right after your last set, lie down and do slow, controlled breathing for a few minutes. This shifts you from fight-or-flight to recovery mode and can cut recovery time significantly.'),

-- Body Composition (Tips 34-37)
('nutrition', 'andy_galpin', 'Dr. Andy Galpin', 'When eating in a deficit, increase your protein intake by about 20% above maintenance levels. Higher protein protects muscle, boosts the thermic effect of food, and keeps you fuller.'),
('nutrition', 'andy_galpin', 'Dr. Andy Galpin', 'Building muscle while losing fat simultaneously is most achievable if you''re newer to training or carrying extra body fat. The more advanced you are, the harder it gets. Prioritize one goal at a time.'),
('nutrition', 'andy_galpin', 'Dr. Andy Galpin', 'During a cut, take periodic diet breaks (eat at maintenance for a few days). This counters adaptive thermogenesis — your body''s tendency to downshift metabolism during prolonged deficits.'),
('nutrition', 'andy_galpin', 'Dr. Andy Galpin', 'Protein has the highest thermic effect of any macronutrient — 15-30% of its calories are burned during digestion. Swapping some carb/fat calories for protein means fewer net calories absorbed.'),

-- Sleep Deep Dive (Tips 38-42)
('sleep', 'andy_galpin', 'Dr. Andy Galpin', 'Galpin recommends extending sleep by 30 min to 2 hours before intense training blocks or competitions. Studies show it improves sprint times, accuracy, and reaction time.'),
('sleep', 'andy_galpin', 'Dr. Andy Galpin', 'Nap for 20 minutes (power nap, no deep sleep) or go for a full 90-minute cycle. Anything in between can leave you groggy. And finish before 4 PM or you''ll wreck your nighttime sleep.'),
('sleep', 'andy_galpin', 'Dr. Andy Galpin', 'If napping isn''t an option, 5-10 minutes of slow breathing or progressive relaxation gives similar nervous system recovery benefits. Works at your desk, in your car, wherever.'),
('sleep', 'andy_galpin', 'Dr. Andy Galpin', 'Consumer wearables are decent at tracking total sleep time — use that for accountability. But sleep stage data and ''recovery scores'' aren''t accurate enough to make training decisions from.'),
('sleep', 'andy_galpin', 'Dr. Andy Galpin', 'Most people only think about how long they sleep. But when you sleep and how well you sleep matter just as much. Consistent bed/wake times beat extra hours of irregular sleep.'),

-- Injury Prevention & Warm-Up (Tips 43-44)
('training', 'andy_galpin', 'Dr. Andy Galpin', 'Galpin''s soreness rule: 3/10 or less, train normally. 4-6/10, warm up and reassess — you''ll often feel better. Above 6/10, skip it. You can always do more tomorrow.'),
('training', 'andy_galpin', 'Dr. Andy Galpin', 'High knees, butt kickers, leg swings, arm circles, hip openers, walking lunges with rotation. 5-10 minutes of dynamic movement before lifting is all you need. No static holds.'),

-- Women's Training (Tips 45-47)
('training', 'andy_galpin', 'Dr. Andy Galpin', 'Despite lower testosterone levels, the rate of muscle gain is similar between men and women. Women: don''t be afraid of heavy weights. You won''t ''bulk up'' — you''ll get stronger and leaner.'),
('training', 'andy_galpin', 'Dr. Andy Galpin', 'Bone mineral density loss postmenopause is one of the biggest drivers of reduced quality of life for women. Heavy resistance training builds bone. Start banking it now — you can''t catch up later.'),
('supplements', 'andy_galpin', 'Dr. Andy Galpin', 'Galpin''s female athlete supplement stack includes collagen peptides (joint/tendon health), vitamin D3 (immune + hormonal balance), and omega-3s (inflammation). These address female-specific vulnerability points.'),

-- Periodization & Programming (Tips 48-50)
('mindset', 'andy_galpin', 'Dr. Andy Galpin', 'The #1 predictor of fitness outcomes isn''t your program — it''s whether you actually do it. A mediocre plan you stick to will always beat an optimal plan you quit after 3 weeks.'),
('training', 'andy_galpin', 'Dr. Andy Galpin', 'Training one quality at a time (linear) or mixing strength/hypertrophy/endurance days (undulating) produce similar results for most people. Pick whichever you''ll actually enjoy and stick with.'),
('training', 'andy_galpin', 'Dr. Andy Galpin', 'Switching exercises every session feels fun but can leave muscles under-stimulated. Keep core movements for 4-6 weeks minimum so you can actually progress. Add variety around the edges.'),

-- Nutrition Deep Dive (Tips 51-55)
('supplements', 'andy_galpin', 'Dr. Andy Galpin', 'Galpin takes 5,000 IU of vitamin D3 daily. It supports muscle function, brain health, immune response, and gut integrity. Most people are deficient, especially if you train indoors.'),
('supplements', 'andy_galpin', 'Dr. Andy Galpin', 'Active people lose magnesium through sweat and need 10-20% more than sedentary folks. Aim for ~6 mg per kg of body weight. Bisglycinate or threonate forms absorb best. Take it before bed.'),
('nutrition', 'andy_galpin', 'Dr. Andy Galpin', 'Galpin prefers real food for protein — better taste, better digestion, less processing. But he''s not anti-powder. If it helps you hit your target, use it. Just don''t make it your primary source.'),
('nutrition', 'andy_galpin', 'Dr. Andy Galpin', 'Variety of food colors = variety of micronutrients. Galpin''s simplest nutrition advice beyond protein: eat many different colors of fruits and vegetables throughout the week. No supplements replace that.'),
('nutrition', 'andy_galpin', 'Dr. Andy Galpin', 'Galpin gets blood work done every 3 months and adjusts his supplement doses based on results. At minimum, check vitamin D, magnesium, zinc, and iron levels annually. Don''t guess — test.'),

-- Motivation & Psychology (Tips 56-57)
('mindset', 'andy_galpin', 'Dr. Andy Galpin', 'Studies show people who follow a structured training plan get better results than those who don''t — regardless of how good the plan is. The plan creates accountability and direction.'),
('mindset', 'andy_galpin', 'Dr. Andy Galpin', 'Galpin has seen athletes who appear to have fitness problems — gassing out, losing power — that are actually panic responses to high-pressure moments. Train your mind alongside your body.'),

-- ============================================================
-- ANDREW HUBERMAN (56 tips)
-- ============================================================

-- Nutrition Protocols (Tips 1-3)
('nutrition', 'huberman', 'Huberman Lab', 'Eat your protein early. Getting 30-50g before 10am kickstarts muscle protein synthesis for the whole day. Your muscles are literally waiting.'),
('nutrition', 'huberman', 'Huberman Lab', 'Hack your blood sugar: eat fiber first, then protein, then carbs. Same meal, way flatter glucose curve. Your energy will thank you.'),
('gut_health', 'huberman', 'Huberman Lab', 'Your gut is your second brain — literally. 4-6 oz of low-sugar fermented food daily (kimchi, sauerkraut, plain yogurt) boosts microbiome diversity and lowers inflammation.'),

-- Supplements (Tips 4-7)
('supplements', 'huberman', 'Huberman Lab', 'Creatine isn''t just for gym bros. 5g/day improves short-term memory and reasoning too. One of the most studied supplements on the planet.'),
('supplements', 'huberman', 'Huberman Lab', 'Not all fish oil is equal. Aim for 2-3g of EPA specifically — that''s the one that moves the needle on mood, inflammation, and heart health.'),
('supplements', 'huberman', 'Huberman Lab', 'Most people are low on vitamin D and don''t know it. 5,000 IU daily is a reasonable baseline — but get your blood levels checked to dial it in.'),
('supplements', 'huberman', 'Huberman Lab', 'Can''t sleep? Magnesium L-threonate (or glycinate) 30-60 min before bed. It crosses the blood-brain barrier and actually calms your neurons down.'),

-- Exercise Science (Tips 8-10)
('cardio', 'huberman', 'Huberman Lab', 'Zone 2 cardio isn''t sexy but it''s the #1 thing for longevity. 150-200 min/week at a pace where you can talk but don''t want to. That''s the sweet spot.'),
('training', 'huberman', 'Huberman Lab', 'For each muscle group, pick two exercises: one that loads the shortened position and one that loads the stretched position. That combo is how you actually grow.'),
('training', 'huberman', 'Huberman Lab', 'Switch it up every ~4 weeks. Heavier weight / fewer reps one month, moderate weight / more reps the next. Your muscles adapt fast — keep them guessing.'),

-- Recovery & Sleep (Tips 11-14)
('recovery', 'huberman', 'Huberman Lab', 'Feeling stressed right now? Try this: two quick inhales through your nose, then one long exhale through your mouth. It''s the fastest way to calm your nervous system.'),
('recovery', 'huberman', 'Huberman Lab', 'Cold plunge in the morning, not at night. 1-3 min at 37-55F wakes you up, boosts dopamine for hours, and activates brown fat. Evening cold can wreck your sleep.'),
('recovery', 'huberman', 'Huberman Lab', 'Sauna 2-3x per week for ~20 min total per session (80-100C) boosts growth hormone and cardiovascular health. End on cold if you want the metabolic boost.'),
('sleep', 'huberman', 'Huberman Lab', 'Stop eating 2-3 hours before bed. Late meals raise core body temp and suppress growth hormone release during deep sleep. Your gains literally happen while you sleep.'),

-- Neuroscience of Motivation (Tips 15-17)
('mindset', 'huberman', 'Huberman Lab', 'Losing motivation mid-goal? That''s normal — it''s called the ''middle problem.'' Break the remaining work into smaller chunks and narrow your visual focus on just the next one.'),
('mindset', 'huberman', 'Huberman Lab', 'Don''t reward yourself every time you hit a goal. Random rewards (coin flip: heads = treat, tails = nothing) keep dopamine high way longer than guaranteed rewards.'),
('mindset', 'huberman', 'Huberman Lab', 'Need instant focus? Pick a point on the wall and stare at it for 30-60 seconds. Narrowing your visual field triggers alertness chemicals in your brainstem. Then get to work.'),

-- Practical Daily Habits (Tips 18-20)
('sleep', 'huberman', 'Huberman Lab', 'Get outside within 30 min of waking and look toward the sky (not at the sun) for 5-10 min. This sets your circadian clock, boosts cortisol at the right time, and improves sleep later.'),
('nutrition', 'huberman', 'Huberman Lab', 'Wait 90 min after waking to have your first coffee. Let your body clear adenosine naturally first — you''ll avoid the afternoon crash and the caffeine actually works better.'),
('recovery', 'huberman', 'Huberman Lab', 'Afternoon slump? Try 10-20 min of NSDR (Non-Sleep Deep Rest) instead of a nap. It restores dopamine levels and mental energy without the grogginess. YouTube ''NSDR'' — Huberman has free ones.'),

-- Dopamine Deep Dive (Tips 21-24)
('mindset', 'huberman', 'Huberman Lab', 'Layering caffeine + pre-workout + music + social energy before every session feels great short-term, but crashes your baseline dopamine after. Mix it up — some workouts with just you and the bar, no stimulants.'),
('mindset', 'huberman', 'Huberman Lab', 'Baseline dopamine is what makes you feel motivated day-to-day. Tyrosine-rich foods (red meat, nuts, hard cheese), morning sunlight, and avoiding bright screens between 10pm-4am all keep it healthy.'),
('mindset', 'huberman', 'Huberman Lab', 'Huberman says if you only spike dopamine at the finish line, you crash after every win. Train yourself to find reward in the grind itself — your motivation will outlast any single goal.'),
('mindset', 'huberman', 'Huberman Lab', 'The variable reward structure of scrolling (will I see something interesting?) creates unsustainable dopamine peaks and valleys. If you''re scrolling before a workout, you''re borrowing motivation from your session.'),

-- Stress & Cortisol (Tips 25-27)
('hormones', 'huberman', 'Huberman Lab', 'Cortisol isn''t the enemy — bad cortisol timing is. You want it high in the morning and tapering through the day. Morning sunlight within 30 min of waking sets this rhythm.'),
('hormones', 'huberman', 'Huberman Lab', 'Training sessions that stretch past 75 minutes start raising cortisol and lowering testosterone. Lift first, then cardio — and keep total session time in check.'),
('nutrition', 'huberman', 'Huberman Lab', 'Even one drink a night consistently increases cortisol release when you''re NOT drinking, making you more anxious and stressed on off-nights. Your ''relaxation drink'' is literally generating future stress.'),

-- Focus & Productivity (Tips 28-31)
('brain_health', 'huberman', 'Huberman Lab', 'You get 2-3 real focus bouts per day, each about 90 minutes. The first 5-10 min will feel unfocused — that''s normal, it''s the onramp. After 90 min, take a 10-30 min deliberate defocus break.'),
('brain_health', 'huberman', 'Huberman Lab', 'Huberman says 40Hz binaural beats (free on YouTube) prime your brain for focus. Use them 5 min before a work session, not the whole time. Great before lifting sessions too.'),
('brain_health', 'huberman', 'Huberman Lab', 'White, pink, or brown noise amplifies prefrontal cortex activity. Use it in ~45-min spurts, then take a break with sunlight or movement. Don''t run it all day.'),
('brain_health', 'huberman', 'Huberman Lab', '13 minutes of daily meditation is the minimum effective dose from the research Huberman cites. Not 30, not an hour — 13 minutes. Consistency beats duration.'),

-- Testosterone & Hormones (Tips 32-34)
('hormones', 'huberman', 'Huberman Lab', 'Late-night screen exposure doesn''t just wreck sleep — it suppresses dopamine release, which directly lowers testosterone. Dim the lights after 10pm if you care about your T levels.'),
('hormones', 'huberman', 'Huberman Lab', 'Mouth breathing during sleep is linked to sleep apnea, poor hormone regulation, and reduced testosterone. Huberman recommends mouth taping with medical-grade tape if you''re a mouth breather.'),
('hormones', 'huberman', 'Huberman Lab', 'Six sets of ten reps on major compound movements (squats, deadlifts, bench) twice per week is the protocol Huberman cites for natural testosterone optimization. Don''t skip leg day — literally.'),

-- Neuroplasticity & Learning (Tips 35-37)
('brain_health', 'huberman', 'Huberman Lab', 'During micro-rests, your brain replays what you just practiced at 10-20x speed. Huberman calls this the ''gap effect.'' Every 2-3 minutes, just stop and do nothing for 10 seconds.'),
('brain_health', 'huberman', 'Huberman Lab', 'Your practice session is just the trigger. The real neural circuit changes happen during deep sleep and NSDR. So a great workout or skill session followed by terrible sleep = wasted effort.'),
('brain_health', 'huberman', 'Huberman Lab', 'Making mistakes during learning isn''t a sign of failure — it''s literally what signals the brain to change. Huberman says frustration during practice means the process is working.'),

-- Alcohol (Tips 38-40)
('nutrition', 'huberman', 'Huberman Lab', 'Alcohol disrupts REM sleep, which handles emotional regulation and memory. ''Sleep after even one drink is not the same quality'' — Huberman. If you''re optimizing everything else but still drinking, you''re undoing the work.'),
('nutrition', 'huberman', 'Huberman Lab', 'Alcohol literally promotes aromatase enzymes that turn androgens into estrogen — leading to fat storage, reduced sex drive, and in men, potential breast tissue growth. Not a great trade for a buzz.'),
('gut_health', 'huberman', 'Huberman Lab', 'Your gut microbiome takes friendly fire every time you drink. The liver''s metabolism of alcohol releases inflammatory cytokines that also increase your desire to drink more — a nasty feedback loop.'),

-- Pain & Inflammation (Tips 41-42)
('recovery', 'huberman', 'Huberman Lab', 'NSAIDs taken within 4 hours before or after exercise can block the inflammation signals your body needs to actually adapt and grow. That post-workout soreness is the process working — don''t shut it down too early.'),
('recovery', 'huberman', 'Huberman Lab', 'Huberman cites research showing that patients who gently used their injured limb while restricting the uninjured one recovered faster. Light movement beats total immobilization.'),

-- Vision & Posture (Tips 43-45)
('brain_health', 'huberman', 'Huberman Lab', 'Looking up from your laptop isn''t enough — you need actual distance viewing. Get outside and let your eyes relax into panoramic vision. This prevents myopia progression and resets your visual system.'),
('brain_health', 'huberman', 'Huberman Lab', 'Hold a pen close, focus on it, then look past it into the distance. Repeat for 5 minutes, three times a week. This exercises the accommodation reflex and can help offset screen-induced myopia.'),
('brain_health', 'huberman', 'Huberman Lab', 'Self-generated optic flow — where the world moves past you as you move through it — is deeply beneficial for both your visual system and mood. It''s one reason walks feel so restorative.'),

-- Social Connection & Health (Tips 46-47)
('mindset', 'huberman', 'Huberman Lab', 'Huberman describes loneliness as the gap between your desired and actual social interaction. Your brain has a ''social homeostasis'' set point. If you''re under it, your health suffers — as much as smoking or obesity.'),
('mindset', 'huberman', 'Huberman Lab', 'Watching movies together, listening to someone tell a story, or playing music together builds stronger bonds than everyone scrolling on their phones side by side. Oxytocin flows through shared narrative.'),

-- Hydration (Tips 48-51)
('hydration', 'huberman', 'Huberman Lab', 'The Galpin Equation: body weight (lbs) / 30 = oz every 15 min during exercise. If you weigh 180 lbs, that''s 6 oz every 15 minutes during training. Add electrolytes.'),
('hydration', 'huberman', 'Huberman Lab', 'Sodium, potassium, and magnesium are the trio. Huberman recommends 200-400mg sodium with potassium in a 2:1 ratio during workouts. A pinch of sea salt in your morning water is the simplest fix.'),
('hydration', 'huberman', 'Huberman Lab', 'You lose significant water overnight through breathing. Huberman says to front-load hydration — aim for 16-32 oz right when you wake, ideally with a pinch of sea salt for electrolytes.'),
('hydration', 'huberman', 'Huberman Lab', 'Caffeine is a diuretic. Huberman recommends a 2:1 fluid-to-caffeine ratio (with electrolytes) to offset the dehydration effect. Your coffee habit may be quietly dehydrating you.'),

-- Specific Protocols (Tips 52-56)
('nutrition', 'huberman', 'Huberman Lab', 'A couple tablespoons of lemon juice or a dash of real cinnamon before, during, or after a high-carb meal can measurably reduce the blood sugar spike. Cheap, easy, no downside.'),
('nutrition', 'huberman', 'Huberman Lab', 'A small amount of the amino acid glutamine mixed with full-fat cream signals your gut and brain that you don''t need more sugar. It''s a weirdly effective hack from Huberman''s sugar cravings episode.'),
('nutrition', 'huberman', 'Huberman Lab', 'When you''re short on sleep, your appetite for sugary foods spikes disproportionately — not just hunger in general, but specifically sugar. Fixing sleep is an underrated diet strategy.'),
('sleep', 'huberman', 'Huberman Lab', 'During deep sleep, the glymphatic system flushes metabolic waste from your brain — and it works up to 60% more efficiently when you sleep on your side. Side sleeping is literally a brain detox position.'),
('training', 'huberman', 'Huberman Lab', 'Huberman''s protocol alternates Schedule A (4-8 reps, heavy, 3-4 sets, 2-4 min rest) with Schedule B (8-15 reps, moderate, 2-3 sets, 90s rest). Switching between these drives more growth than sticking to one scheme.');
