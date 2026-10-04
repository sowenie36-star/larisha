# larisot love game

A mobile-friendly basketball-themed love quiz arcade game. No installation, build, API keys, or backend required.

## Play locally
Open index.html in a browser. For a local server, run `python3 -m http.server 8080` from this folder and visit http://localhost:8080.

## Customize before sharing
Edit questions.js. The included questions are playful SAMPLE trivia, not facts about your relationship. Replace them with your own questions and answer choices. `correct: 0` means the first option, `correct: 1` the second, and so on. Keep at least five valid questions; ten gives the player room for mistakes.

## Rules
Each question has ten seconds. The timer starts when the question appears and continues if the tab is hidden. Correct answers unlock exactly one basketball shot; press SHOOT or Space to shoot and continue. Wrong answers/timeouts grant no shot and show the correct answer. Five correct answers in one round win the voucher, revealed after the fifth victory shot. If all questions are used before five correct answers, replay with a shuffled order. The score resets on refresh or replay. The voucher can be printed or saved as PDF using the browser print window.

## Basketball arcade
Time the shot meter for a bonus: the green zone scores 3 points, other shots score 2. All unlocked shots go in, so shot timing does not prevent the voucher win. The points scoreboard is separate from the five-correct-answer goal.

## Music
The supplied audio is included as assets/crush.mp3. Music is off by default; press Music to play or pause. Browser audio starts only after an explicit click.

## Vercel
Import this folder as a repository into Vercel. Use the Other framework preset, no build command, and the project root as the output directory. Alternatively, with the Vercel CLI installed, run `vercel` from this directory and follow its prompts. All files are static. No environment variables are needed.

## Files
- index.html: page and voucher wording
- style.css: responsive dark basketball arcade design
- questions.js: editable question bank
- game.js: quiz timer, scoring, shots, music and prize
- court.js: animated basketball court, shot meter, bonus points and sound effects
- assets/crush.mp3: supplied soundtrack
- vercel.json: static URL configuration

This is a playful client-side game: answers and voucher markup are visible in source. There is no secure prize redemption or one-use enforcement.
