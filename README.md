# IQ Token Logo Quiz

Dependency-free Web Component for embedding a token logo quiz on IQ.wiki.

Includes Easy, Medium, and Hard timed modes with up to 999 levels. Every 10-level stage gets faster and refreshes the lifelines. Players earn speed and streak bonuses, save high scores, and review missed projects on IQ.wiki.

## Embed

```html
<iq-token-quiz levels="999"></iq-token-quiz>
<script src="/path/to/iq-token-quiz.js"></script>
```

Change the `levels` attribute to set the maximum run length.

The component emits:

- `token-quiz-answer` with `{ correct, token, difficulty, score }`
- `token-quiz-complete` with `{ score, levels, difficulty }`

The game loads its live token pool from IQ.wiki's cryptocurrency rankings, using projects that have IQ.wiki pages. Their IQ.wiki slugs, names, tickers, and logos power the questions and review links.

When the rankings page is unavailable, such as on a cross-domain GitHub Pages preview, the game uses a small built-in fallback pool.

## Preview

Serve this directory and open `index.html`.
