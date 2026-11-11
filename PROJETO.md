# Free Kick Legends (provisional name)

## What it is

Lightweight 3D free-kick minigame for mobile, playable in the browser via a link.

Inspirations: the free-kick games from the old Click Jogos, the free kicks from PES on PS2, Score! Hero and New Star Soccer.

The graphics are simple on purpose. The product is the kicking mechanic: it needs to feel good to repeat.

The theme: a roster made only of great free-kick takers from history. The player chooses who takes the kick, sees the wall and the goalkeeper with the colors of the rival of that taker's club, imagines the play and takes the kick. No championship: just take free kicks and have fun.

## About me and how to work with me

- I'm not a developer. Explain everything in simple English. When using a technical term, explain it in one sentence.
- Work in small stages. At the end of each stage, say what changed and exactly how I test it, on the computer and on the phone.
- Use git and make a commit at every stage that is working, so we can go back if something breaks.
- Do not add anything outside the scope of v0.1 without asking me first.
- No build step for now (nothing of npm or Vite). Use HTML + JavaScript + Three.js loaded via CDN with fixed version. Few files.
- Mobile first, vertical orientation. Testing on a real phone is mandatory, because touch is different from mouse.
- As soon as there is something playable, publish on free static hosting (GitHub Pages or similar) so I can test on the phone via link. Guide me step by step.

## The central mechanic

Each free kick has three decisions:

1. **Direction:** drag the finger horizontally. A target appears on the goal.
2. **Contact point:** touch a large ball in the corner of the screen to choose where the foot hits. The chosen point is saved between kicks.
3. **Power:** hold the kick button. The bar fills. Release to kick. Going past the ideal point increases the error.

### Effect of the contact point

| Where the foot hits | Effect on the ball |
|---|---|
| Bottom | Spins backwards: rises more and floats. Too low, goes over the goal |
| Top | Spins forwards: comes out lower and drops fast (dry leaf) |
| Right side | Curves to the left |
| Left side | Curves to the right |
| Diagonals | Combines curve with rise or drop |
| Center, with power | Comes out almost without spin and oscillates unpredictably |

### Principles

- **Realistic in behavior, exaggerated in measure.** The ball obeys the controls coherently, but beautiful curves need to be achievable. Fun beats precision.
- Right curve to the left;
- Spin backwards or forwards proportional to the vertical displacement of the contact;
- Contact in the center with high power generates the "ball without rotation": small random lateral oscillation.
- All numbers stay in a single configuration object.

Real measurements to use: goal of 7.32 m x 2.44 m; wall at 9.15 m from the ball; ball radius of about 0.11 m; free kicks between about 18 and 30 m, at various angles.

## Adjustment panel (mandatory from the start)

A hidden panel, opened by a discreet button, with sliders for:

- curve strength;
- contact effect on elevation;
- gravity and drag;
- minimum and maximum kick speed;
- size of the error cone and ideal power point;
- goalkeeper reflex, speed and reach;
- wall height.

Changes apply immediately. A "copy values" button generates the text with the current configuration, so I can send you the numbers that turned out good.

Reason: what defines if the game is good is the feel of the kick, and that is discovered by playing and adjusting, not by discussing.

## Game modes (decision of 10/9/2026, expanded on 10/10/2026)

The base is **free training with rival**. For each free kick the game draws the position and a taker from the Legendary Roster
(you can change in the list, which shows the most indicated). The taker wears the shirt of the club where he was outstanding;
the wall and the goalkeeper wear the colors of a rival of that club. Goal score in the session, replay and video of the play.

On 10/10/2026, with friends and family playing via the link, two small modes entered on top of the same mechanic
(buttons at the top of the screen; the game opens in the last mode used):

- **Training**: the usual one (drawn free kick, fixed free kick button).
- **Daily Challenge** (only free kicks): the same free kicks, in the same order, for everyone on the same day. The date becomes the
  seed of the draw (free kick, suggested taker and even the aiming error come from it). Worth the longest sequence of goals:
  missed, go back to the first free kick of the day. The pressure (extra error; the taker's coolness cuts part of it) grows
  with the sequence, which is the decisive play of this game.
  **Daily ranking (stage 8):** with at least 2 consecutive goals, the person types the name and their best sequence
  goes to an internet ranking, which everyone sees in the game and which resets every day. The data stays in a
  **Supabase** project (internet database with free plan; the game talks to it by address + public key,
  in `config.js`, field `ranking`; the table and permissions are in `ranking-supabase.sql`, for
