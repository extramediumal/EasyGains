# Reddit Launch Post Drafts

---

## Post 1: r/SideProject or r/indiehackers

### Title

I got fed up with MyFitnessPal, so I built a voice-first macro tracker with an unhinged AI coach

### Body

Hey everyone,

I have been tracking macros on and off for years. Every time I would start a cut, I would fire up MyFitnessPal, spend 45 seconds searching for "chicken breast grilled 6 oz" while my food got cold, get frustrated with the barcode scanner pulling up some random user entry from 2014 with wildly wrong macros, and eventually just stop tracking altogether. Rinse and repeat every few months.

I am a solo dev, and at some point I thought: why can I talk to my phone about literally anything else but I still have to manually search a janky database to log a meal? So I started building EasyGains.

**What it does**

EasyGains is a nutrition and macro tracking app where the primary input method is your voice. You just say "I had two eggs, some toast with peanut butter, and a coffee with oat milk" and it logs everything. No searching, no scrolling, no picking from five different entries for the same food. You talk, it tracks.

Beyond voice input, the core philosophy is:

- **Protein-first tracking.** Protein is the macro that actually matters for most people's goals. The app puts it front and center instead of burying it behind calories.
- **Weekly averages over daily guilt.** One bad day does not ruin a week. The app focuses on your rolling averages so you stop feeling like a failure because you went over on a Tuesday.
- **Coach AL.** This is the part that makes people either love or hate the app. Coach AL is an AI coaching personality that gives you feedback on your meals, but he is... not a typical wellness app voice. He is blunt, a little unhinged, and will absolutely roast your midnight cereal choices. Think less "you got this, queen" and more "brother, that is not a meal, that is a cry for help." You can dial the intensity up or down, or turn him off entirely if you just want a straightforward tracker.

**Tech stack for the nerds**

- React Native (Expo) for cross-platform
- Supabase for auth and database
- Claude API for the natural language food parsing and Coach AL's personality
- Voice input through the native speech-to-text APIs

The Claude integration was honestly the part that made the whole thing click. Parsing natural language food descriptions into structured macro data is a problem that sucked before LLMs. Now it just works. You can say vague stuff like "a big bowl of pasta with meat sauce" and it gives you a reasonable estimate instead of forcing you to pick an exact serving size from a dropdown.

**Where it is now**

The app is live and functional. Free tier gives you full voice tracking and basic macro views. Pro tier unlocks Coach AL, detailed analytics, and some other features. I am still a solo dev on this so it is not perfect -- there are rough edges and I am shipping improvements constantly.

I am not trying to compete with MyFitnessPal's 200-million-entry food database. This is a different approach to the same problem: make logging so low-friction that you actually keep doing it.

**What I would love from you all**

- Does the voice-first angle resonate, or is it a gimmick?
- The Coach AL personality is polarizing by design. Too much? Not enough?
- What would make you switch from whatever you currently use?
- Any obvious gaps I am missing?

Happy to answer questions about the tech, the business side, or anything else. Thanks for reading.

---

## Post 2: r/fitness or r/loseit

### Title

I stopped tracking macros because it was too annoying, so I built an app where you just say what you ate out loud

### Body

I will be honest -- I have tried to be consistent with macro tracking probably a dozen times over the past few years. I know it works. I have seen the results when I actually stick with it. But I never stick with it, because the actual process of logging food in MyFitnessPal is tedious enough that I just... stop.

The cycle was always the same. Day 1 through 4: diligently logging everything, scanning barcodes, weighing chicken on a food scale. Day 5: I eat something homemade or from a restaurant, spend two minutes trying to find a reasonable entry, give up and pick one that is probably wrong. Day 8: I forget to log lunch and figure I will just estimate later. Day 10: I have not opened the app in two days and I quietly pretend the whole thing never happened.

The friction was the problem. Not motivation, not knowledge -- just the sheer annoyance of the input process.

So I built something different. It is called EasyGains, and the main idea is simple: you talk to it. You say "I had a protein shake with banana and peanut butter for breakfast" and it logs the meal with macros. That is it. No searching a database, no scrolling through fifteen entries for "banana medium," no barcode scanning. Just say what you ate like you would tell a friend, and it figures it out.

**A few other things that make it work for me where other trackers did not:**

**Protein is the headline number.** I got tired of apps that put calories in giant font and bury protein three taps deep. If you are lifting or trying to maintain muscle on a cut, protein is the number you actually need to hit. EasyGains puts it front and center.

**Weekly averages, not daily report cards.** This was a big mental shift. I used to feel like I "failed" if I went over my calories on any given day, which would spiral into "well the day is ruined, might as well order pizza." EasyGains shows you your rolling weekly average, so one bad meal or one high day does not feel like the end of the world. Because it is not.

**Coach AL (optional, and a little unhinged).** There is an AI coach feature called Coach AL that gives you feedback on your meals and your trends. He is not your typical gentle wellness app voice. He will call you out. If you log a sleeve of Oreos at 11 PM, he is going to have something to say about it, and it will not be "great job listening to your body." Some people love it, some people find it obnoxious. You can adjust the intensity or turn it off completely. Personally, the mild roasting keeps me honest in a way that a green checkmark never did.

**What it is not:**

- It is not going to be accurate down to the gram. If you are a competitive bodybuilder doing a show prep, this is probably not precise enough for you. It estimates based on what you describe, and it is surprisingly close most of the time, but it is not a food scale.
- It does not have a massive barcode database. If scanning packaged foods is your main workflow, MFP is still better for that.
- It is not some polished product from a big company. I am one person building this, and there are rough edges.

**What it is:**

A tracker that is easy enough to actually use every day. That is the whole pitch. The best tracking app is the one you do not quit after a week.

It is free to use with the core voice tracking and macro views. There is a Pro tier if you want the coaching features and deeper analytics, but the free version is fully functional -- not a crippled trial.

I built this to solve my own problem, and it worked for me. I have been consistently tracking for longer than I ever managed with any other app. Maybe it will help some of you too, or maybe it is not your thing -- either way, I am genuinely curious what people think.

If you have questions about how it works or feedback on what would make it more useful, I am all ears.
