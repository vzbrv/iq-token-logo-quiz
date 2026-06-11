const TOKENS = [
  { name: "Bitcoin", symbol: "BTC", icon: "btc", hint: "The original proof-of-work cryptocurrency" },
  { name: "Ethereum", symbol: "ETH", icon: "eth", hint: "Home of the EVM and smart contracts" },
  { name: "Solana", symbol: "SOL", icon: "sol", hint: "A high-throughput layer 1 blockchain" },
  { name: "Dogecoin", symbol: "DOGE", icon: "doge", hint: "The internet's favorite dog-themed coin" },
  { name: "Chainlink", symbol: "LINK", icon: "link", hint: "A decentralized oracle network" },
  { name: "Uniswap", symbol: "UNI", icon: "uni", hint: "A leading decentralized exchange protocol" },
  { name: "Aave", symbol: "AAVE", icon: "aave", hint: "A decentralized lending protocol" },
  { name: "Polkadot", symbol: "DOT", icon: "dot", hint: "A network designed to connect blockchains" },
  { name: "Avalanche", symbol: "AVAX", icon: "avax", hint: "A layer 1 built around subnets" },
  { name: "Cosmos", symbol: "ATOM", icon: "atom", hint: "The internet of blockchains" },
  { name: "Litecoin", symbol: "LTC", icon: "ltc", hint: "One of the earliest Bitcoin-derived currencies" },
  { name: "Monero", symbol: "XMR", icon: "xmr", hint: "A privacy-focused cryptocurrency" },
  { name: "Maker", symbol: "MKR", icon: "mkr", hint: "Governance token behind the DAI ecosystem" },
  { name: "The Graph", symbol: "GRT", icon: "grt", hint: "An indexing protocol for blockchain data" },
  { name: "Basic Attention Token", symbol: "BAT", icon: "bat", hint: "A token for the digital advertising ecosystem" },
];

const styles = `
  :host {
    --iq-purple: #6c4cff;
    --iq-purple-dark: #5137db;
    --iq-ink: #17152b;
    --iq-muted: #706d84;
    --iq-border: #e8e5f2;
    --iq-bg: #f7f6fb;
    display: block;
    max-width: 460px;
    color: var(--iq-ink);
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  * { box-sizing: border-box; }

  .quiz {
    position: relative;
    overflow: hidden;
    padding: 22px;
    border: 1px solid var(--iq-border);
    border-radius: 24px;
    background: #fff;
    box-shadow: 0 16px 50px rgba(41, 30, 91, .1);
  }

  .top, .meta, .actions, .result-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .eyebrow {
    margin: 0;
    color: var(--iq-purple);
    font-size: 12px;
    font-weight: 800;
    letter-spacing: .09em;
    text-transform: uppercase;
  }

  .score {
    padding: 7px 11px;
    border-radius: 999px;
    background: #f0edff;
    color: var(--iq-purple-dark);
    font-size: 13px;
    font-weight: 800;
  }

  .progress {
    height: 5px;
    margin: 16px 0 20px;
    overflow: hidden;
    border-radius: 99px;
    background: #efedf5;
  }

  .progress span {
    display: block;
    width: 10%;
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, #6c4cff, #a18cff);
    transition: width .3s ease;
  }

  .logo-wrap {
    display: grid;
    width: 148px;
    height: 148px;
    margin: 0 auto 18px;
    place-items: center;
    border: 1px solid var(--iq-border);
    border-radius: 40px;
    background: radial-gradient(circle at 35% 30%, #fff 0, #f5f2ff 75%);
    box-shadow: inset 0 1px #fff, 0 10px 24px rgba(71, 51, 158, .11);
  }

  .logo-wrap img {
    width: 86px;
    height: 86px;
    object-fit: contain;
  }

  .logo-fallback {
    display: none;
    color: var(--iq-purple);
    font-size: 34px;
    font-weight: 900;
  }

  h2 {
    margin: 0 0 5px;
    text-align: center;
    font-size: 24px;
    line-height: 1.2;
    letter-spacing: -.04em;
  }

  .sub {
    margin: 0 0 18px;
    color: var(--iq-muted);
    text-align: center;
    font-size: 14px;
  }

  .choices {
    display: grid;
    gap: 9px;
  }

  button {
    border: 0;
    font: inherit;
    cursor: pointer;
  }

  .choice {
    width: 100%;
    padding: 13px 14px;
    border: 1px solid var(--iq-border);
    border-radius: 13px;
    background: #fff;
    color: var(--iq-ink);
    text-align: left;
    font-size: 14px;
    font-weight: 700;
    transition: border-color .15s ease, background .15s ease, transform .15s ease;
  }

  .choice:hover:not(:disabled) {
    transform: translateY(-1px);
    border-color: #a99aff;
    background: #faf9ff;
  }

  .choice.correct { border-color: #37b77b; background: #ecfbf4; color: #16724a; }
  .choice.wrong { border-color: #e97979; background: #fff1f1; color: #a53636; }
  .choice:disabled { cursor: default; }

  .feedback {
    min-height: 42px;
    margin-top: 13px;
    color: var(--iq-muted);
    font-size: 13px;
    line-height: 1.4;
  }

  .feedback strong { color: var(--iq-ink); }
  .feedback a { color: var(--iq-purple-dark); font-weight: 800; text-decoration: none; }

  .next, .restart {
    width: 100%;
    padding: 13px 16px;
    border-radius: 13px;
    background: var(--iq-purple);
    color: #fff;
    font-weight: 800;
    transition: background .15s ease, transform .15s ease;
  }

  .next:hover, .restart:hover { background: var(--iq-purple-dark); transform: translateY(-1px); }
  .next[hidden] { display: none; }

  .result { padding: 34px 4px 8px; text-align: center; }
  .result .big { margin: 12px 0 6px; font-size: 48px; font-weight: 900; letter-spacing: -.06em; }
  .result h2 { font-size: 28px; }
  .result .sub { margin-bottom: 24px; }
  .result-badge { font-size: 50px; }

  @media (max-width: 430px) {
    .quiz { padding: 18px; border-radius: 19px; }
    .logo-wrap { width: 126px; height: 126px; border-radius: 34px; }
    .logo-wrap img { width: 72px; height: 72px; }
  }
`;

class IqTokenQuiz extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.rounds = Number(this.getAttribute("rounds")) || 5;
    this.question = 0;
    this.score = 0;
    this.streak = 0;
    this.correctAnswers = 0;
    this.deck = [];
  }

  connectedCallback() {
    this.start();
  }

  shuffle(items) {
    return [...items].sort(() => Math.random() - 0.5);
  }

  start() {
    this.question = 0;
    this.score = 0;
    this.streak = 0;
    this.correctAnswers = 0;
    this.deck = this.shuffle(TOKENS).slice(0, Math.min(this.rounds, TOKENS.length));
    this.renderQuestion();
  }

  getChoices(answer) {
    const others = this.shuffle(TOKENS.filter((token) => token.symbol !== answer.symbol)).slice(0, 3);
    return this.shuffle([answer, ...others]);
  }

  renderQuestion() {
    const answer = this.deck[this.question];
    const choices = this.getChoices(answer);

    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <section class="quiz" aria-label="Token logo quiz">
        <div class="top">
          <p class="eyebrow">Token Logo Quiz</p>
          <div class="score">${this.score} point${this.score === 1 ? "" : "s"}</div>
        </div>
        <div class="progress" aria-label="Question ${this.question + 1} of ${this.deck.length}">
          <span style="width:${((this.question + 1) / this.deck.length) * 100}%"></span>
        </div>
        <div class="logo-wrap">
          <img src="https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/svg/color/${answer.icon}.svg" alt="Mystery token logo">
          <span class="logo-fallback">${answer.symbol.slice(0, 2)}</span>
        </div>
        <h2>Which token is this?</h2>
        <p class="sub">Question ${this.question + 1} of ${this.deck.length}</p>
        <div class="choices">
          ${choices.map((token) => `<button class="choice" data-symbol="${token.symbol}">${token.name} <span>(${token.symbol})</span></button>`).join("")}
        </div>
        <div class="feedback" aria-live="polite"></div>
        <button class="next" hidden>${this.question + 1 === this.deck.length ? "See my score" : "Next logo"}</button>
      </section>
    `;

    const image = this.shadowRoot.querySelector("img");
    image.addEventListener("error", () => {
      image.style.display = "none";
      this.shadowRoot.querySelector(".logo-fallback").style.display = "block";
    });

    this.shadowRoot.querySelectorAll(".choice").forEach((button) => {
      button.addEventListener("click", () => this.answer(button, answer));
    });
    this.shadowRoot.querySelector(".next").addEventListener("click", () => this.next());
  }

  answer(selected, answer) {
    const buttons = [...this.shadowRoot.querySelectorAll(".choice")];
    const correct = selected.dataset.symbol === answer.symbol;

    buttons.forEach((button) => {
      button.disabled = true;
      if (button.dataset.symbol === answer.symbol) button.classList.add("correct");
    });

    if (correct) {
      this.streak += 1;
      this.correctAnswers += 1;
      this.score += 100 + Math.max(0, this.streak - 1) * 25;
    } else {
      this.streak = 0;
      selected.classList.add("wrong");
    }

    this.shadowRoot.querySelector(".score").textContent = `${this.score} points`;
    this.shadowRoot.querySelector(".feedback").innerHTML = correct
      ? `<strong>Correct${this.streak > 1 ? ` · ${this.streak} answer streak` : ""}.</strong> ${answer.hint}.`
      : `<strong>That is ${answer.name} (${answer.symbol}).</strong> ${answer.hint}.`;
    this.shadowRoot.querySelector(".next").hidden = false;

    this.dispatchEvent(new CustomEvent("token-quiz-answer", {
      bubbles: true,
      detail: { correct, token: answer.symbol, score: this.score },
    }));
  }

  next() {
    this.question += 1;
    if (this.question < this.deck.length) {
      this.renderQuestion();
    } else {
      this.renderResult();
    }
  }

  renderResult() {
    const maxBaseScore = this.deck.length * 100;
    const percentage = Math.round((this.correctAnswers / this.deck.length) * 100);
    const badge = percentage >= 100 ? "🏆" : percentage >= 60 ? "⚡" : "🧠";
    const title = percentage >= 100 ? "Token expert" : percentage >= 60 ? "Strong crypto knowledge" : "Keep exploring";

    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <section class="quiz" aria-label="Token logo quiz result">
        <div class="result">
          <div class="result-badge">${badge}</div>
          <p class="eyebrow">Quiz Complete</p>
          <div class="big">${this.score}</div>
          <h2>${title}</h2>
          <p class="sub">${this.correctAnswers} of ${this.deck.length} correct. Streak bonuses can push your score above ${maxBaseScore}.</p>
          <button class="restart">Play again</button>
        </div>
      </section>
    `;
    this.shadowRoot.querySelector(".restart").addEventListener("click", () => this.start());
    this.dispatchEvent(new CustomEvent("token-quiz-complete", {
      bubbles: true,
      detail: { score: this.score, rounds: this.deck.length },
    }));
  }
}

customElements.define("iq-token-quiz", IqTokenQuiz);
