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

Token icons load from the `cryptocurrency-icons` package on jsDelivr. Replace the icon URLs with IQ.wiki-hosted assets before production if avoiding an external dependency is required.

## Preview

Serve this directory and open `index.html`.
