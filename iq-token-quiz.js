const FALLBACK_TOKENS = [
  { name: "Bitcoin", symbol: "BTC", icon: "btc", wiki: "bitcoin", category: "Payments", hint: "The original proof-of-work cryptocurrency" },
  { name: "Ethereum", symbol: "ETH", icon: "eth", wiki: "ethereum", category: "Layer 1", hint: "Home of the EVM and smart contracts" },
  { name: "Solana", symbol: "SOL", icon: "sol", wiki: "solana", category: "Layer 1", hint: "A high-throughput layer 1 blockchain" },
  { name: "Dogecoin", symbol: "DOGE", icon: "doge", wiki: "dogecoin", category: "Meme", hint: "The internet's favorite dog-themed coin" },
  { name: "Chainlink", symbol: "LINK", icon: "link", wiki: "chainlink", category: "Infrastructure", hint: "A decentralized oracle network" },
  { name: "Uniswap", symbol: "UNI", icon: "uni", wiki: "uniswap", category: "DeFi", hint: "A leading decentralized exchange protocol" },
  { name: "Aave", symbol: "AAVE", icon: "aave", wiki: "aave", category: "DeFi", hint: "A decentralized lending protocol" },
  { name: "Polkadot", symbol: "DOT", icon: "dot", wiki: "polkadot", category: "Layer 1", hint: "A network designed to connect blockchains" },
  { name: "Avalanche", symbol: "AVAX", icon: "avax", wiki: "avalanche", category: "Layer 1", hint: "A layer 1 built around subnets" },
  { name: "Cosmos", symbol: "ATOM", icon: "atom", wiki: "cosmos", category: "Layer 1", hint: "The internet of blockchains" },
  { name: "Litecoin", symbol: "LTC", icon: "ltc", wiki: "litecoin", category: "Payments", hint: "One of the earliest Bitcoin-derived currencies" },
  { name: "Monero", symbol: "XMR", icon: "xmr", wiki: "monero", category: "Privacy", hint: "A privacy-focused cryptocurrency" },
  { name: "Maker", symbol: "MKR", icon: "mkr", wiki: "makerdao", category: "DeFi", hint: "Governance token behind the DAI ecosystem" },
  { name: "The Graph", symbol: "GRT", icon: "grt", wiki: "the-graph", category: "Infrastructure", hint: "An indexing protocol for blockchain data" },
  { name: "Basic Attention Token", symbol: "BAT", icon: "bat", wiki: "basic-attention-token", category: "Web3", hint: "A token for the digital advertising ecosystem" },
];
const TOKEN_POOL_SIZE = 500;
const RANKING_PAGES_TO_LOAD = 40;

const DIFFICULTIES = {
  easy: { label: "Easy", detail: "Full logo · 4 choices · 15 seconds", choices: 4, points: 100, seconds: 15 },
  medium: { label: "Medium", detail: "Partial logo · 5 choices · 12 seconds", choices: 5, points: 150, seconds: 12 },
  hard: { label: "Hard", detail: "Tiny logo fragment · 6 choices · 9 seconds", choices: 6, points: 250, seconds: 9 },
};

const styles = `
  :host {
    --iq-pink: #ff5ca8;
    --iq-pink-dark: #d92f7d;
    --iq-pink-soft: #fff5fa;
    --iq-ink: #161616;
    --iq-muted: #707070;
    --iq-border: #e7e7e7;
    --iq-bg: #f7f7f7;
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
    border-radius: 16px;
    background: #fff;
    box-shadow: 0 10px 32px rgba(0, 0, 0, .06);
  }

  .top, .meta, .actions, .result-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .eyebrow {
    margin: 0;
    color: var(--iq-pink-dark);
    font-size: 12px;
    font-weight: 800;
    letter-spacing: .09em;
    text-transform: uppercase;
  }

  .score {
    padding: 7px 11px;
    border-radius: 999px;
    background: var(--iq-pink-soft);
    color: var(--iq-pink-dark);
    font-size: 13px;
    font-weight: 800;
  }

  .level-count { margin-top: 4px; color: var(--iq-muted); font-size: 11px; font-weight: 800; text-align: right; }

  .progress {
    height: 5px;
    margin: 16px 0 20px;
    overflow: hidden;
    border-radius: 99px;
    background: #eeeeee;
  }

  .progress span {
    display: block;
    width: 10%;
    height: 100%;
    border-radius: inherit;
    background: var(--iq-pink);
    transition: width .3s ease;
  }

  .timer { display: flex; align-items: center; gap: 9px; margin: -10px 0 17px; color: var(--iq-pink-dark); font-size: 12px; font-weight: 800; }
  .timer-track { height: 5px; flex: 1; overflow: hidden; border-radius: 99px; background: #eeeeee; }
  .timer-track span { display: block; height: 100%; background: var(--iq-pink); transition: width .1s linear; }
  .timer.danger { color: #b53131; }
  .timer.danger .timer-track span { background: #dc5b5b; }

  .logo-wrap {
    display: grid;
    width: 148px;
    height: 148px;
    margin: 0 auto 18px;
    place-items: center;
    border: 1px solid var(--iq-border);
    border-radius: 24px;
    background: var(--iq-bg);
  }

  .logo-wrap img {
    width: 86px;
    height: 86px;
    object-fit: contain;
  }

  .logo-fallback {
    display: none;
    color: var(--iq-pink);
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
    border-radius: 10px;
    background: #fff;
    color: var(--iq-ink);
    text-align: left;
    font-size: 14px;
    font-weight: 700;
    transition: border-color .15s ease, background .15s ease, transform .15s ease;
  }

  .choice:hover:not(:disabled) {
    transform: translateY(-1px);
    border-color: var(--iq-pink);
    background: var(--iq-pink-soft);
  }

  .choice.correct { border-color: #37b77b; background: #ecfbf4; color: #16724a; }
  .choice.wrong { border-color: #e97979; background: #fff1f1; color: #a53636; }
  .choice.removed { opacity: .12; pointer-events: none; }
  .choice:disabled { cursor: default; }

  .tools { display: flex; gap: 8px; margin: 0 0 13px; }
  .tool { flex: 1; padding: 9px; border-radius: 8px; background: var(--iq-pink-soft); color: var(--iq-pink-dark); font-size: 12px; font-weight: 800; }
  .tool:disabled { opacity: .4; cursor: default; }
  .clue { margin-bottom: 13px; padding: 10px 12px; border-radius: 8px; background: var(--iq-pink-soft); color: var(--iq-pink-dark); font-size: 12px; font-weight: 700; }
  .clue[hidden] { display: none; }

  .feedback {
    min-height: 42px;
    margin-top: 13px;
    color: var(--iq-muted);
    font-size: 13px;
    line-height: 1.4;
  }

  .feedback strong { color: var(--iq-ink); }
  .feedback a { display: block; margin-top: 5px; color: var(--iq-pink-dark); font-weight: 800; text-decoration: none; }

  .next, .restart {
    width: 100%;
    padding: 13px 16px;
    border-radius: 10px;
    background: var(--iq-pink);
    color: #fff;
    font-weight: 800;
    transition: background .15s ease, transform .15s ease;
  }

  .next:hover, .restart:hover { background: var(--iq-pink-dark); transform: translateY(-1px); }
  .next[hidden] { display: none; }

  .result { padding: 34px 4px 8px; text-align: center; }
  .result .big { margin: 12px 0 6px; font-size: 48px; font-weight: 900; letter-spacing: -.06em; }
  .result h2 { font-size: 28px; }
  .result .sub { margin-bottom: 24px; }
  .result-badge { font-size: 50px; }
  .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 7px; margin: 18px 0; }
  .stat { padding: 11px 4px; border-radius: 8px; background: var(--iq-bg); }
  .stat strong, .stat span { display: block; }
  .stat strong { color: var(--iq-pink-dark); font-size: 17px; }
  .stat span { margin-top: 3px; color: var(--iq-muted); font-size: 10px; font-weight: 700; }
  .review { margin: 16px 0; padding: 12px; border-radius: 8px; background: var(--iq-pink-soft); text-align: left; }
  .review strong { display: block; margin-bottom: 6px; font-size: 13px; }
  .review a { display: inline-block; margin: 4px 7px 4px 0; color: var(--iq-pink-dark); font-size: 12px; font-weight: 800; text-decoration: none; }
  .start { padding-top: 6px; text-align: center; }
  .start h2 { margin-top: 10px; }
  .levels { display: grid; gap: 9px; margin-top: 20px; }
  .level {
    display: grid;
    gap: 3px;
    padding: 14px;
    border: 1px solid var(--iq-border);
    border-radius: 10px;
    background: #fff;
    color: var(--iq-ink);
    text-align: left;
  }
  .level:hover { border-color: var(--iq-pink); background: var(--iq-pink-soft); }
  .level span, .level small { color: var(--iq-muted); }
  .logo-window { position: relative; display: grid; overflow: hidden; place-items: center; }
  .logo-window.easy { width: 86px; height: 86px; }
  .logo-window.medium { width: 60px; height: 60px; border-radius: 14px; }
  .logo-window.hard { width: 38px; height: 38px; border-radius: 9px; }
  .logo-window img { position: absolute; max-width: none; transform: translate(var(--crop-x), var(--crop-y)); }
  .logo-window.easy img { width: 86px; height: 86px; }
  .logo-window.medium img { top: 0; left: 0; width: 100px; height: 100px; }
  .logo-window.hard img { top: 0; left: 0; width: 114px; height: 114px; }
  .secondary { margin-top: 8px; background: var(--iq-pink-soft); color: var(--iq-pink-dark); }
  .quit { width: 100%; margin-top: 9px; background: transparent; color: var(--iq-muted); font-size: 12px; font-weight: 800; }

  @media (max-width: 430px) {
    .quiz { padding: 18px; border-radius: 14px; }
    .logo-wrap { width: 126px; height: 126px; border-radius: 20px; }
    .logo-window.easy, .logo-window.easy img { width: 72px; height: 72px; }
  }
`;

class IqTokenQuiz extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.maxLevels = Number(this.getAttribute("levels")) || 999;
    this.question = 0;
    this.score = 0;
    this.streak = 0;
    this.correctAnswers = 0;
    this.deck = [];
    this.difficulty = "easy";
    this.bestStreak = 0;
    this.missed = [];
    this.responseTimes = [];
    this.timer = null;
    this.answered = false;
    this.lifelines = { fifty: true, clue: true };
    this.tokens = FALLBACK_TOKENS;
    this.dataSource = "preview";
    this.onStartScreen = false;
  }

  connectedCallback() {
    this.renderStart();
    this.loadTokens();
  }

  disconnectedCallback() {
    this.stopTimer();
  }

  shuffle(items) {
    return [...items].sort(() => Math.random() - 0.5);
  }

  async loadTokens() {
    try {
      const pages = await Promise.all(
        Array.from({ length: RANKING_PAGES_TO_LOAD }, async (_, index) => {
          const response = await fetch(`https://iq.wiki/rank/cryptocurrencies?page=${index + 1}`);
          if (!response.ok) throw new Error(`IQ.wiki returned ${response.status}`);
          return this.parseRankedTokens(await response.text());
        }),
      );
      const seen = new Set();
      const tokens = pages
        .flat()
        .filter((token) => {
          if (seen.has(token.wiki)) return false;
          seen.add(token.wiki);
          return true;
        })
        .slice(0, TOKEN_POOL_SIZE);
      if (tokens.length < TOKEN_POOL_SIZE) throw new Error("Too few ranked tokens found");
      this.tokens = tokens;
      this.dataSource = "live";
      if (this.onStartScreen) this.renderStart();
    } catch {
      this.tokens = FALLBACK_TOKENS;
      this.dataSource = "preview";
    }
  }

  parseRankedTokens(html) {
    const tokens = [];
    const seen = new Set();
    const pattern = /\\"ranking\\":\d+,\\"id\\":\\"([^"]+)\\"[\s\S]*?\\"tokenMarketData\\":\{\\"hasWiki\\":true,\\"image\\":\\"([^"]+)\\"[\s\S]*?\\"name\\":\\"([^"]+)\\"[\s\S]*?\\"alias\\":\\"([^"]+)\\"/g;
    let match;
    while ((match = pattern.exec(html))) {
      const [wiki, image, name, alias] = match.slice(1).map((value) => value.replaceAll("\\u0026", "&").replaceAll("\\/", "/"));
      const symbol = alias.toUpperCase();
      if (!seen.has(symbol)) {
        seen.add(symbol);
        tokens.push({
          name,
          symbol,
          image,
          wiki,
          category: "IQ.wiki ranked project",
          hint: `${name} has a wiki in IQ.wiki's cryptocurrency rankings`,
        });
      }
    }
    return tokens;
  }

  imageUrl(token) {
    return token.image || `https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/svg/color/${token.icon}.svg`;
  }

  start() {
    this.stopTimer();
    this.question = 0;
    this.score = 0;
    this.streak = 0;
    this.correctAnswers = 0;
    this.bestStreak = 0;
    this.missed = [];
    this.responseTimes = [];
    this.lifelines = { fifty: true, clue: true };
    this.onStartScreen = false;
    this.deck = this.shuffle(this.tokens);
    this.renderQuestion();
  }

  renderStart() {
    this.stopTimer();
    this.onStartScreen = true;
    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <section class="quiz" aria-label="Choose token logo quiz difficulty">
        <div class="start">
          <p class="eyebrow">IQ.wiki Token Logo Quiz</p>
          <h2>Choose your difficulty</h2>
          <p class="sub">Climb through ${this.maxLevels} levels. Every 10 levels gets faster.</p>
          <p class="sub">${this.dataSource === "live" ? "Live IQ.wiki pool" : "Built-in preview pool"}: ${this.tokens.length} tokens.</p>
          <div class="levels">
            ${Object.entries(DIFFICULTIES).map(([key, level]) => `
              <button class="level" data-level="${key}">
                <strong>${level.label}</strong>
                <span>${level.detail}</span>
                <small>${level.points} points per correct answer</small>
              </button>
            `).join("")}
          </div>
        </div>
      </section>`;
    this.shadowRoot.querySelectorAll(".level").forEach((button) => {
      button.addEventListener("click", () => {
        this.difficulty = button.dataset.level;
        this.start();
      });
    });
  }

  getChoices(answer) {
    const others = this.shuffle(this.tokens.filter((token) => token.symbol !== answer.symbol))
      .slice(0, DIFFICULTIES[this.difficulty].choices - 1);
    return this.shuffle([answer, ...others]);
  }

  getAnswer() {
    if (this.question > 0 && this.question % this.tokens.length === 0) this.deck = this.shuffle(this.tokens);
    return this.deck[this.question % this.tokens.length];
  }

  getSeconds() {
    return Math.max(4, DIFFICULTIES[this.difficulty].seconds - Math.floor(this.question / 10));
  }

  renderQuestion() {
    const answer = this.getAnswer();
    const seconds = this.getSeconds();
    const stageLevel = (this.question % 10) + 1;
    const choices = this.getChoices(answer);
    const cropMax = this.difficulty === "medium" ? 40 : this.difficulty === "hard" ? 76 : 0;
    const cropX = -Math.floor(Math.random() * cropMax);
    const cropY = -Math.floor(Math.random() * cropMax);
    this.answered = false;

    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <section class="quiz" aria-label="Token logo quiz" tabindex="0">
        <div class="top">
          <p class="eyebrow">${DIFFICULTIES[this.difficulty].label} Token Logo Quiz</p>
          <div><div class="score">${this.score} point${this.score === 1 ? "" : "s"}</div><div class="level-count">Level ${this.question + 1} / ${this.maxLevels}</div></div>
        </div>
        <div class="progress" aria-label="Stage progress ${stageLevel} of 10">
          <span style="width:${stageLevel * 10}%"></span>
        </div>
        <div class="timer"><strong data-time>${seconds}s</strong><div class="timer-track"><span data-timebar style="width:100%"></span></div></div>
        <div class="logo-wrap">
          <div class="logo-window ${this.difficulty}">
            <img src="${this.imageUrl(answer)}" alt="Mystery token logo" style="--crop-x:${cropX}px;--crop-y:${cropY}px">
            <span class="logo-fallback">?</span>
          </div>
        </div>
        <h2>Which token is this?</h2>
        <p class="sub">Level ${this.question + 1} · Stage ${Math.floor(this.question / 10) + 1}</p>
        <div class="tools">
          <button class="tool" data-fifty>50:50</button>
          <button class="tool" data-clue>Reveal clue (-50)</button>
        </div>
        <div class="clue" data-cluebox hidden></div>
        <div class="choices">
          ${choices.map((token, index) => `<button class="choice" data-symbol="${token.symbol}">${index + 1}. ${token.name} <span>(${token.symbol})</span></button>`).join("")}
        </div>
        <div class="feedback" aria-live="polite"></div>
        <button class="next" hidden>${this.question + 1 === this.maxLevels ? "Finish run" : "Next level"}</button>
        <button class="quit">End run and see results</button>
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
    this.shadowRoot.querySelector("[data-fifty]").addEventListener("click", () => this.useFifty(answer));
    this.shadowRoot.querySelector("[data-clue]").addEventListener("click", () => this.useClue(answer));
    this.shadowRoot.querySelector(".next").addEventListener("click", () => this.next());
    this.shadowRoot.querySelector(".quit").addEventListener("click", () => this.renderResult());
    const quiz = this.shadowRoot.querySelector(".quiz");
    quiz.addEventListener("keydown", (event) => {
      const choice = this.shadowRoot.querySelectorAll(".choice")[Number(event.key) - 1];
      if (choice && !choice.disabled && !choice.classList.contains("removed")) choice.click();
    });
    quiz.focus();
    this.startTimer(answer, seconds);
  }

  startTimer(answer, seconds) {
    this.stopTimer();
    this.questionStartedAt = Date.now();
    this.deadline = Date.now() + seconds * 1000;
    const update = () => {
      const remaining = Math.max(0, this.deadline - Date.now());
      this.timeLeft = Math.ceil(remaining / 1000);
      const timer = this.shadowRoot.querySelector(".timer");
      const label = this.shadowRoot.querySelector("[data-time]");
      const bar = this.shadowRoot.querySelector("[data-timebar]");
      if (!timer || !label || !bar) return;
      label.textContent = `${this.timeLeft}s`;
      bar.style.width = `${(remaining / (seconds * 1000)) * 100}%`;
      timer.classList.toggle("danger", this.timeLeft <= 3);
      if (remaining <= 0) this.answer(null, answer, true);
    };
    update();
    this.timer = setInterval(update, 100);
  }

  stopTimer() {
    clearInterval(this.timer);
    this.timer = null;
  }

  useFifty(answer) {
    if (!this.lifelines.fifty || this.answered) return;
    this.lifelines.fifty = false;
    const wrong = this.shuffle([...this.shadowRoot.querySelectorAll(".choice")]
      .filter((button) => button.dataset.symbol !== answer.symbol));
    wrong.slice(0, Math.max(0, wrong.length - 1)).forEach((button) => button.classList.add("removed"));
    this.shadowRoot.querySelector("[data-fifty]").disabled = true;
  }

  useClue(answer) {
    if (!this.lifelines.clue || this.answered) return;
    this.lifelines.clue = false;
    this.score = Math.max(0, this.score - 50);
    this.shadowRoot.querySelector(".score").textContent = `${this.score} points`;
    this.shadowRoot.querySelector("[data-clue]").disabled = true;
    const clue = this.shadowRoot.querySelector("[data-cluebox]");
    clue.textContent = `${answer.category}: ${answer.hint}.`;
    clue.hidden = false;
  }

  answer(selected, answer, timedOut = false) {
    if (this.answered) return;
    this.answered = true;
    this.stopTimer();
    const buttons = [...this.shadowRoot.querySelectorAll(".choice")];
    const correct = !timedOut && selected?.dataset.symbol === answer.symbol;
    const elapsed = Math.min(this.getSeconds(), (Date.now() - this.questionStartedAt) / 1000);
    this.responseTimes.push(elapsed);

    buttons.forEach((button) => {
      button.disabled = true;
      if (button.dataset.symbol === answer.symbol) button.classList.add("correct");
    });
    this.shadowRoot.querySelectorAll(".tool").forEach((button) => { button.disabled = true; });

    if (correct) {
      this.streak += 1;
      this.bestStreak = Math.max(this.bestStreak, this.streak);
      this.correctAnswers += 1;
      this.score += DIFFICULTIES[this.difficulty].points + Math.max(0, this.streak - 1) * 25 + this.timeLeft * 10;
    } else {
      this.streak = 0;
      this.missed.push(answer);
      if (selected) selected.classList.add("wrong");
    }

    this.shadowRoot.querySelector(".score").textContent = `${this.score} points`;
    this.shadowRoot.querySelector(".feedback").innerHTML = correct
      ? `<strong>Correct${this.streak > 1 ? ` · ${this.streak} answer streak` : ""}.</strong> ${answer.category} · ${answer.hint}.`
      : `<strong>${timedOut ? "Time is up." : `That is ${answer.name} (${answer.symbol}).`}</strong> ${answer.hint}.
         <a href="https://iq.wiki/wiki/${answer.wiki}" target="_blank" rel="noopener noreferrer">Learn about ${answer.name} on IQ.wiki →</a>`;
    this.shadowRoot.querySelector(".next").hidden = false;

    this.dispatchEvent(new CustomEvent("token-quiz-answer", {
      bubbles: true,
      detail: { correct, token: answer.symbol, difficulty: this.difficulty, score: this.score },
    }));
  }

  next() {
    this.stopTimer();
    this.question += 1;
    if (this.question < this.maxLevels) {
      if (this.question % 10 === 0) this.lifelines = { fifty: true, clue: true };
      this.renderQuestion();
    } else {
      this.renderResult();
    }
  }

  renderResult() {
    this.stopTimer();
    this.onStartScreen = false;
    const levelsPlayed = this.responseTimes.length;
    const maxBaseScore = levelsPlayed * DIFFICULTIES[this.difficulty].points;
    const percentage = levelsPlayed ? Math.round((this.correctAnswers / levelsPlayed) * 100) : 0;
    const average = levelsPlayed ? (this.responseTimes.reduce((sum, time) => sum + time, 0) / levelsPlayed).toFixed(1) : "0.0";
    const storageKey = `iq-token-quiz-best-${this.difficulty}`;
    const previousBest = Number(localStorage.getItem(storageKey) || 0);
    const best = Math.max(previousBest, this.score);
    localStorage.setItem(storageKey, best);
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
          <p class="sub">${this.correctAnswers} of ${levelsPlayed} correct on ${DIFFICULTIES[this.difficulty].label}. Best score: ${best}.</p>
          <div class="stats">
            <div class="stat"><strong>${levelsPlayed}</strong><span>Levels reached</span></div>
            <div class="stat"><strong>${this.bestStreak}</strong><span>Best streak</span></div>
            <div class="stat"><strong>${average}s</strong><span>Avg. answer</span></div>
          </div>
          ${this.missed.length ? `<div class="review"><strong>Review missed tokens on IQ.wiki</strong>${this.missed.map((token) => `<a href="https://iq.wiki/wiki/${token.wiki}" target="_blank" rel="noopener noreferrer">${token.name} →</a>`).join("")}</div>` : ""}
          <p class="sub">Fast answers and streaks can push your score above ${maxBaseScore}.</p>
          <button class="restart">Play again</button>
          <button class="restart secondary">Change difficulty</button>
        </div>
      </section>
    `;
    const [restart, change] = this.shadowRoot.querySelectorAll(".restart");
    restart.addEventListener("click", () => this.start());
    change.addEventListener("click", () => this.renderStart());
    this.dispatchEvent(new CustomEvent("token-quiz-complete", {
      bubbles: true,
      detail: { score: this.score, levels: levelsPlayed, difficulty: this.difficulty },
    }));
  }
}

customElements.define("iq-token-quiz", IqTokenQuiz);
