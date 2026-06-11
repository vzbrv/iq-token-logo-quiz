# IQ Token Logo Quiz

Dependency-free Web Component for embedding a token logo quiz on IQ.wiki.

## Embed

```html
<iq-token-quiz rounds="5"></iq-token-quiz>
<script src="/path/to/iq-token-quiz.js"></script>
```

The component emits:

- `token-quiz-answer` with `{ correct, token, score }`
- `token-quiz-complete` with `{ score, rounds }`

Token icons load from the `cryptocurrency-icons` package on jsDelivr. Replace the icon URLs with IQ.wiki-hosted assets before production if avoiding an external dependency is required.

## Preview

Serve this directory and open `index.html`.
