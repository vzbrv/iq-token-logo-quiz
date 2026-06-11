# IQ Token Logo Quiz

Dependency-free Web Component for embedding a token logo quiz on IQ.wiki.

Includes Easy, Medium, and Hard modes. Higher levels show only part of each logo, add more answer choices, and award more points. Incorrect answers link directly to the project's IQ.wiki page.

## Embed

```html
<iq-token-quiz rounds="7"></iq-token-quiz>
<script src="/path/to/iq-token-quiz.js"></script>
```

The component emits:

- `token-quiz-answer` with `{ correct, token, difficulty, score }`
- `token-quiz-complete` with `{ score, rounds, difficulty }`

Token icons load from the `cryptocurrency-icons` package on jsDelivr. Replace the icon URLs with IQ.wiki-hosted assets before production if avoiding an external dependency is required.

## Preview

Serve this directory and open `index.html`.
