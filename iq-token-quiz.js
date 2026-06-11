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
const LIFELINE_COST = 50;
const TOKEN_DATA_URL = new URL("tokens.json", document.currentScript?.src || window.location.href).href;

const DIFFICULTIES = {
  easy: { label: "Easy", detail: "Full logo · 4 choices · 15 seconds", choices: 4, points: 100, seconds: 15 },
  medium: { label: "Medium", detail: "Partial logo · 5 choices · 12 seconds", choices: 5, points: 150, seconds: 12 },
  hard: { label: "Hard", detail: "Tiny logo fragment · 6 choices · 9 seconds", choices: 6, points: 250, seconds: 9 },
};

const CATEGORY_SYMBOLS = {
  "Layer 1": new Set(["ETH", "SOL", "BNB", "ADA", "AVAX", "DOT", "TRX", "TON", "SUI", "APT", "NEAR", "ATOM", "ALGO", "HBAR", "ICP", "SEI", "EGLD", "KAS"]),
  DeFi: new Set(["UNI", "AAVE", "MKR", "CRV", "LDO", "RUNE", "JUP", "PENDLE", "COMP", "SNX", "DYDX", "CAKE", "SUSHI", "1INCH", "ENA"]),
  Stablecoins: new Set(["USDT", "USDC", "DAI", "FDUSD", "USDE", "USDS", "FRAX", "PYUSD", "TUSD"]),
  Meme: new Set(["DOGE", "SHIB", "PEPE", "BONK", "WIF", "FLOKI", "BRETT", "MOG", "POPCAT", "BOME", "MEME"]),
  AI: new Set(["TAO", "FET", "RENDER", "RNDR", "WLD", "AKT", "AIOZ", "VIRTUAL", "AGIX", "OCEAN"]),
  Infrastructure: new Set(["LINK", "GRT", "FIL", "AR", "OP", "ARB", "STX", "IMX", "MNT", "TIA", "POL", "MATIC", "LRC"]),
  Payments: new Set(["BTC", "LTC", "BCH", "XRP", "XLM", "DASH"]),
  Privacy: new Set(["XMR", "ZEC", "ROSE", "SCRT"]),
};

function inferCategory(token) {
  if (token.category) return token.category;
  return Object.entries(CATEGORY_SYMBOLS).find(([, symbols]) => symbols.has(token.symbol?.toUpperCase()))?.[0] || "Other";
}

const styles = `
  :host {
    --iq-pink: #ff5ca8;
    --iq-pink-dark: #e23888;
    --iq-pink-soft: #ffe1ef;
    --iq-ink: #15111e;
    --iq-muted: #756e80;
    --iq-border: #ded8e5;
    --iq-bg: #f7f3fa;
    display: block;
    max-width: 620px;
    color: var(--iq-ink);
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  * { box-sizing: border-box; }

  .quiz {
    position: relative;
    overflow: hidden;
    padding: 26px;
    border: 1px solid rgba(255,255,255,.75);
    border-radius: 28px;
    background: #fff;
    box-shadow: 0 26px 80px rgba(44, 25, 56, .16);
  }

  .quiz::before {
    position: absolute;
    z-index: 0;
    width: 210px;
    height: 210px;
    border-radius: 50%;
    background: var(--iq-pink);
    content: "";
    filter: blur(95px);
    opacity: .12;
    right: -110px;
    top: -100px;
  }

  .quiz > * { position: relative; z-index: 1; }
  .top, .result-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .eyebrow {
    margin: 0;
    color: var(--iq-pink-dark);
    font-size: 11px;
    font-weight: 900;
    letter-spacing: .12em;
    text-transform: uppercase;
  }

  .live {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 7px 10px;
    border: 1px solid var(--iq-border);
    border-radius: 999px;
    color: var(--iq-muted);
    font-size: 11px;
    font-weight: 800;
  }
  .live::before { width: 7px; height: 7px; border-radius: 50%; background: #36c586; content: ""; box-shadow: 0 0 0 4px #daf7ea; }

  .hud { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin: 18px 0 12px; }
  .hud-item { padding: 10px 12px; border: 1px solid var(--iq-border); border-radius: 13px; background: rgba(255,255,255,.84); }
  .hud-item strong, .hud-item span { display: block; }
  .hud-item strong { font-size: 17px; letter-spacing: -.03em; }
  .hud-item span { margin-top: 2px; color: var(--iq-muted); font-size: 9px; font-weight: 900; letter-spacing: .08em; text-transform: uppercase; }

  .timer { display: flex; align-items: center; gap: 9px; margin-bottom: 13px; color: var(--iq-pink-dark); font-size: 11px; font-weight: 900; }
  .timer-track { height: 6px; flex: 1; overflow: hidden; border-radius: 99px; background: #eee9f1; }
  .timer-track span { display: block; height: 100%; background: var(--iq-pink); transition: width .1s linear; }
  .timer.danger { color: #b53131; }
  .timer.danger .timer-track span { background: #dc5b5b; }

  .logo-wrap {
    position: relative;
    display: grid;
    width: 100%;
    height: 226px;
    margin: 0 auto 20px;
    overflow: hidden;
    place-items: center;
    border-radius: 24px;
    background: radial-gradient(circle at center, #30253b 0 2px, transparent 3px), radial-gradient(circle at center, #241b2e 0 28%, #18121f 72%);
    background-size: 24px 24px, auto;
    box-shadow: inset 0 0 0 1px rgba(255,255,255,.09);
  }
  .logo-wrap::before, .logo-wrap::after {
    position: absolute;
    width: 180px;
    height: 180px;
    border: 1px solid rgba(255,92,168,.25);
    border-radius: 50%;
    content: "";
    animation: orbit 9s linear infinite;
  }
  .logo-wrap::after { width: 130px; height: 130px; border-style: dashed; animation-direction: reverse; animation-duration: 12s; }
  .logo-window {
    z-index: 1;
    filter: drop-shadow(0 14px 22px rgba(0,0,0,.35));
  }
  .logo-reveal {
    position: absolute;
    z-index: 2;
    bottom: 16px;
    padding: 7px 11px;
    border: 1px solid rgba(255,255,255,.18);
    border-radius: 999px;
    background: rgba(21,17,30,.78);
    color: #fff;
    font-size: 10px;
    font-weight: 900;
    opacity: 0;
    transform: translateY(8px);
    transition: opacity .25s ease, transform .25s ease;
  }
  .logo-wrap.answered .logo-reveal { opacity: 1; transform: translateY(0); }
  .score-pop {
    position: absolute;
    z-index: 3;
    color: #fff;
    font-size: 30px;
    font-weight: 950;
    text-shadow: 0 5px 20px rgba(255,92,168,.8);
    animation: scorePop 1s ease both;
  }

  .logo-fallback {
    display: none;
    color: #fff;
    font-size: 48px;
    font-weight: 900;
  }

  h2 {
    margin: 0 0 5px;
    text-align: center;
    font-size: 30px;
    line-height: 1.05;
    letter-spacing: -.055em;
  }

  .sub {
    margin: 0 0 20px;
    color: var(--iq-muted);
    text-align: center;
    font-size: 14px;
    line-height: 1.5;
  }

  .choices { display: grid; grid-template-columns: repeat(2, 1fr); gap: 9px; }

  button {
    border: 0;
    font: inherit;
    cursor: pointer;
  }

  .choice {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    min-height: 58px;
    padding: 11px 12px;
    border: 1px solid var(--iq-border);
    border-radius: 14px;
    background: #fff;
    color: var(--iq-ink);
    text-align: left;
    font-size: 13px;
    font-weight: 800;
    transition: border-color .15s ease, background .15s ease, transform .15s ease, box-shadow .15s ease;
  }

  .choice:hover:not(:disabled) {
    transform: translateY(-2px);
    border-color: var(--iq-pink);
    background: var(--iq-pink-soft);
    box-shadow: 0 8px 18px rgba(226,56,136,.12);
  }
  .key { display: grid; width: 28px; height: 28px; flex: 0 0 28px; place-items: center; border-radius: 8px; background: var(--iq-bg); color: var(--iq-muted); font-size: 11px; }
  .choice span:last-child { margin-left: auto; color: var(--iq-muted); font-size: 10px; }
  .choice.correct { border-color: #37b77b; background: #ecfbf4; color: #16724a; }
  .choice.wrong { border-color: #e97979; background: #fff1f1; color: #a53636; }
  .choice.removed { opacity: .12; pointer-events: none; }
  .choice:disabled { cursor: default; }

  .tools { display: flex; justify-content: center; gap: 8px; margin: 0 0 13px; }
  .tool { padding: 8px 12px; border: 1px solid var(--iq-border); border-radius: 999px; background: #fff; color: var(--iq-pink-dark); font-size: 11px; font-weight: 900; }
  .tool:disabled { opacity: .4; cursor: default; }
  .clue { margin-bottom: 13px; padding: 10px 12px; border-radius: 10px; background: var(--iq-pink-soft); color: var(--iq-pink-dark); font-size: 12px; font-weight: 800; }
  .clue[hidden] { display: none; }

  .feedback {
    min-height: 48px;
    margin-top: 14px;
    color: var(--iq-muted);
    font-size: 13px;
    line-height: 1.4;
  }

  .feedback strong { color: var(--iq-ink); }
  .feedback a { display: block; margin-top: 5px; color: var(--iq-pink-dark); font-weight: 800; text-decoration: none; }
  .combo { display: inline-block; margin-left: 5px; color: var(--iq-pink-dark); font-weight: 950; animation: comboPop .45s ease; }
  .knowledge { margin-top: 9px; padding: 11px 12px; border: 1px solid var(--iq-border); border-radius: 12px; background: var(--iq-bg); }
  .knowledge span { color: var(--iq-muted); font-size: 11px; font-weight: 800; }
  .knowledge a { margin-top: 3px; }

  .next, .restart, .start-button, .share {
    width: 100%;
    padding: 15px 16px;
    border-radius: 14px;
    background: linear-gradient(135deg, var(--iq-pink), var(--iq-pink-dark));
    color: #fff;
    font-weight: 900;
    transition: background .15s ease, transform .15s ease;
  }

  .next:hover, .restart:hover, .start-button:hover, .share:hover { transform: translateY(-2px); }
  .next[hidden] { display: none; }

  .result { padding: 18px 4px 4px; text-align: center; }
  .rank { display: inline-block; margin-bottom: 18px; padding: 8px 12px; border-radius: 999px; background: #211828; color: #fff; font-size: 11px; font-weight: 900; letter-spacing: .08em; text-transform: uppercase; }
  .result .big { margin: 8px 0 2px; font-size: 64px; font-weight: 950; letter-spacing: -.075em; }
  .result h2 { font-size: 31px; }
  .result .sub { margin-bottom: 24px; }
  .result-hero { display: grid; grid-template-columns: 112px 1fr; gap: 18px; align-items: center; margin: 18px 0; text-align: left; }
  .accuracy-ring { display: grid; width: 112px; height: 112px; place-items: center; border-radius: 50%; background: conic-gradient(var(--iq-pink) calc(var(--accuracy) * 1%), var(--iq-pink-soft) 0); box-shadow: inset 0 0 0 12px #fff; }
  .accuracy-ring strong { font-size: 25px; }
  .result-copy .big { margin: 0; font-size: 48px; }
  .result-copy span { color: var(--iq-muted); font-size: 11px; font-weight: 900; text-transform: uppercase; }
  .run-grid { display: flex; flex-wrap: wrap; justify-content: center; gap: 5px; margin: 13px 0 18px; }
  .run-dot { width: 9px; height: 9px; border-radius: 50%; background: #e97979; }
  .run-dot.correct { background: #37b77b; }
  .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 7px; margin: 18px 0; }
  .stat { padding: 13px 4px; border-radius: 12px; background: var(--iq-bg); }
  .stat strong, .stat span { display: block; }
  .stat strong { color: var(--iq-pink-dark); font-size: 17px; }
  .stat span { margin-top: 3px; color: var(--iq-muted); font-size: 9px; font-weight: 900; text-transform: uppercase; }
  .review { margin: 16px 0; padding: 13px; border-radius: 12px; background: var(--iq-pink-soft); text-align: left; }
  .review strong { display: block; margin-bottom: 6px; font-size: 13px; }
  .review a { display: inline-block; margin: 4px 7px 4px 0; color: var(--iq-pink-dark); font-size: 12px; font-weight: 800; text-decoration: none; }
  .result-actions { align-items: stretch; }
  .result-actions button { flex: 1; }
  .share-label { margin: 18px 0 8px; color: var(--iq-muted); font-size: 10px; font-weight: 900; letter-spacing: .1em; text-transform: uppercase; }
  .share-links { display: grid; grid-template-columns: repeat(4, 1fr); gap: 7px; margin-bottom: 10px; }
  .share-link {
    padding: 11px 6px;
    border: 1px solid var(--iq-border);
    border-radius: 12px;
    background: #fff;
    color: var(--iq-ink);
    font-size: 11px;
    font-weight: 900;
    text-align: center;
    text-decoration: none;
    transition: border-color .15s ease, color .15s ease, transform .15s ease;
  }
  .share-link:hover { border-color: var(--iq-pink); color: var(--iq-pink-dark); transform: translateY(-2px); }
  .start { padding-top: 2px; text-align: center; }
  .start h2 { max-width: 440px; margin: 16px auto 9px; font-size: 40px; }
  .start .sub { max-width: 450px; margin: 0 auto 22px; }
  .section-label { margin: 18px 0 8px; color: var(--iq-muted); text-align: left; font-size: 10px; font-weight: 900; letter-spacing: .1em; text-transform: uppercase; }
  .levels { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
  .level, .round {
    display: grid;
    gap: 4px;
    padding: 12px;
    border: 1px solid var(--iq-border);
    border-radius: 13px;
    background: #fff;
    color: var(--iq-ink);
    text-align: left;
  }
  .level:hover, .round:hover, .level.selected, .round.selected { border-color: var(--iq-pink); background: var(--iq-pink-soft); }
  .level strong, .round strong { font-size: 13px; }
  .level span, .level small, .round span { color: var(--iq-muted); font-size: 10px; line-height: 1.35; }
  .rounds { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 18px; }
  .categories { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 18px; }
  .category { padding: 8px 11px; border: 1px solid var(--iq-border); border-radius: 999px; background: #fff; color: var(--iq-muted); font-size: 11px; font-weight: 900; }
  .category:hover, .category.selected { border-color: var(--iq-pink); background: var(--iq-pink-soft); color: var(--iq-pink-dark); }
  .round { text-align: center; }
  .start-button { margin-top: 3px; }
  .logo-window { position: relative; display: grid; overflow: hidden; place-items: center; }
  .logo-window { width: var(--window-size); height: var(--window-size); border-radius: var(--window-radius); }
  .logo-window, .logo-window img { transition: width .28s ease, height .28s ease, border-radius .28s ease, transform .28s ease; }
  .logo-window img { position: absolute; max-width: none; transform: translate(var(--crop-x), var(--crop-y)); }
  .logo-window img { top: 0; left: 0; width: var(--logo-size); height: var(--logo-size); }
  .logo-window.glimpse, .logo-window.revealed { width: 104px; height: 104px; border-radius: 22px; }
  .logo-window.glimpse { animation: glimpsePulse 1.6s ease; }
  .logo-window.glimpse img, .logo-window.revealed img { width: 104px; height: 104px; transform: translate(0, 0); }
  .logo-window.revealed { animation: revealPulse .7s ease; }
  .secondary { margin-top: 8px; background: var(--iq-pink-soft); color: var(--iq-pink-dark); }
  .quit { width: 100%; margin-top: 9px; background: transparent; color: var(--iq-muted); font-size: 12px; font-weight: 800; }
  @keyframes orbit { to { transform: rotate(360deg); } }
  @keyframes glimpsePulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(255,92,168,0); }
    35%, 70% { box-shadow: 0 0 0 12px rgba(255,92,168,.2), 0 0 34px rgba(255,92,168,.45); }
  }
  @keyframes revealPulse { 45% { transform: scale(1.12); filter: drop-shadow(0 0 30px rgba(255,92,168,.8)); } }
  @keyframes scorePop { 0% { opacity: 0; transform: translateY(15px) scale(.7); } 30% { opacity: 1; transform: translateY(-10px) scale(1.08); } 100% { opacity: 0; transform: translateY(-55px); } }
  @keyframes comboPop { 50% { transform: scale(1.12); } }

  @media (max-width: 540px) {
    .quiz { padding: 17px; border-radius: 20px; }
    .start h2 { font-size: 32px; }
    .levels { grid-template-columns: 1fr; }
    .rounds { grid-template-columns: repeat(2, 1fr); }
    .choices { grid-template-columns: 1fr; }
    .logo-wrap { height: 190px; border-radius: 18px; }
    .result-actions { flex-direction: column; }
    .share-links { grid-template-columns: repeat(2, 1fr); }
    .result-hero { grid-template-columns: 92px 1fr; gap: 12px; }
    .accuracy-ring { width: 92px; height: 92px; box-shadow: inset 0 0 0 10px #fff; }
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation: none !important; transition: none !important; }
  }
`;

class IqTokenQuiz extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.maxLevels = Number(this.getAttribute("levels")) || 999;
    this.runLength = Math.min(10, this.maxLevels);
    this.question = 0;
    this.score = 0;
    this.streak = 0;
    this.correctAnswers = 0;
    this.deck = [];
    this.difficulty = "easy";
    this.bestStreak = 0;
    this.missed = [];
    this.responseTimes = [];
    this.answerHistory = [];
    this.category = "All";
    this.timer = null;
    this.answered = false;
    this.endedByTimeout = false;
    this.lifelines = { fifty: true, clue: true };
    this.tokens = FALLBACK_TOKENS.map((token, index) => ({
      ...token,
      rank: index + 1,
      category: inferCategory(token),
    }));
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
      const response = await fetch(TOKEN_DATA_URL);
      if (!response.ok) throw new Error(`Token data returned ${response.status}`);
      const tokens = await response.json();
      if (tokens.length < TOKEN_POOL_SIZE) throw new Error("Too few ranked tokens found");
      this.tokens = tokens.slice(0, TOKEN_POOL_SIZE).map((token, index) => ({
        ...token,
        rank: index + 1,
        category: inferCategory(token),
      }));
      this.dataSource = "live";
      if (this.onStartScreen) this.renderStart();
    } catch {
      this.tokens = FALLBACK_TOKENS.map((token, index) => ({
        ...token,
        rank: index + 1,
        category: inferCategory(token),
      }));
      this.dataSource = "preview";
    }
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
    this.answerHistory = [];
    this.endedByTimeout = false;
    this.lifelines = { fifty: true, clue: true };
    this.onStartScreen = false;
    this.deck = this.buildDeck();
    this.renderQuestion();
  }

  getCategories() {
    const counts = this.tokens.reduce((result, token) => {
      result[token.category] = (result[token.category] || 0) + 1;
      return result;
    }, {});
    return ["All", ...Object.entries(counts).filter(([, count]) => count >= 5).sort((a, b) => b[1] - a[1]).map(([name]) => name)];
  }

  getTokenPool() {
    const filtered = this.category === "All" ? this.tokens : this.tokens.filter((token) => token.category === this.category);
    return filtered.length >= DIFFICULTIES[this.difficulty].choices ? filtered : this.tokens;
  }

  buildDeck() {
    const pool = [...this.getTokenPool()].sort((a, b) => (a.rank || 999) - (b.rank || 999));
    const cuts = [0.1, 0.3, 0.6, 1].map((ratio) => Math.ceil(pool.length * ratio));
    return cuts.flatMap((end, index) =>
      this.shuffle(pool.slice(index ? cuts[index - 1] : 0, end))
    );
  }

  renderStart() {
    this.stopTimer();
    this.onStartScreen = true;
    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <section class="quiz" aria-label="Choose token logo quiz difficulty">
        <div class="start">
          <div class="top"><p class="eyebrow">IQ.wiki Token Logo Quiz</p><span class="live">${this.dataSource === "live" ? "Live" : "Preview"} · ${this.tokens.length} projects</span></div>
          <h2>500 logos. How dialed in are you?</h2>
          <p class="sub">Identify crypto projects before time runs out. Partial logos, faster stages, streak bonuses, and two lifelines stand between you and the leaderboard.</p>
          <p class="section-label">Pick difficulty</p>
          <div class="levels">
            ${Object.entries(DIFFICULTIES).map(([key, level]) => `
              <button class="level ${this.difficulty === key ? "selected" : ""}" data-level="${key}">
                <strong>${level.label}</strong>
                <span>${level.detail}</span>
                <small>Up to ${level.points}+ pts</small>
              </button>
            `).join("")}
          </div>
          <p class="section-label">Pick a category</p>
          <div class="categories">
            ${this.getCategories().map((category) => `<button class="category ${this.category === category ? "selected" : ""}" data-category="${category}">${category}</button>`).join("")}
          </div>
          <p class="section-label">Pick your run</p>
          <div class="rounds">
            ${[
              [5, "Quick 5", "Warm-up"],
              [10, "Sprint 10", "Classic"],
              [25, "Gauntlet", "Serious"],
              [this.maxLevels, "Endless", `Up to ${this.maxLevels}`],
            ].map(([value, label, detail]) => `<button class="round ${this.runLength === value ? "selected" : ""}" data-rounds="${value}"><strong>${label}</strong><span>${detail}</span></button>`).join("")}
          </div>
          <button class="start-button" data-start>Start ${DIFFICULTIES[this.difficulty].label} run →</button>
        </div>
      </section>`;
    this.shadowRoot.querySelectorAll(".level").forEach((button) => {
      button.addEventListener("click", () => {
        this.difficulty = button.dataset.level;
        this.renderStart();
      });
    });
    this.shadowRoot.querySelectorAll(".round").forEach((button) => {
      button.addEventListener("click", () => {
        this.runLength = Number(button.dataset.rounds);
        this.renderStart();
      });
    });
    this.shadowRoot.querySelectorAll(".category").forEach((button) => {
      button.addEventListener("click", () => {
        this.category = button.dataset.category;
        this.renderStart();
      });
    });
    this.shadowRoot.querySelector("[data-start]").addEventListener("click", () => this.start());
  }

  getChoices(answer) {
    const pool = this.getTokenPool();
    const nearby = pool.filter((token) => token.symbol !== answer.symbol && Math.abs((token.rank || 0) - (answer.rank || 0)) <= 100);
    const candidates = nearby.length >= DIFFICULTIES[this.difficulty].choices - 1 ? nearby : pool.filter((token) => token.symbol !== answer.symbol);
    const others = this.shuffle(candidates)
      .slice(0, DIFFICULTIES[this.difficulty].choices - 1);
    return this.shuffle([answer, ...others]);
  }

  getAnswer() {
    if (this.question > 0 && this.question % this.deck.length === 0) this.deck = this.buildDeck();
    return this.deck[this.question % this.deck.length];
  }

  getSeconds() {
    return Math.max(4, DIFFICULTIES[this.difficulty].seconds - Math.floor(this.question / 10));
  }

  getProgression() {
    const stage = Math.floor(this.question / 10);
    const labels = ["Popular picks", "Recognizable", "Deep cuts", "Expert territory"];
    const baseWindow = { easy: 104, medium: 66, hard: 40 }[this.difficulty];
    const shrink = Math.min(stage, 8) * { easy: 4, medium: 3, hard: 2 }[this.difficulty];
    const windowSize = Math.max({ easy: 68, medium: 42, hard: 26 }[this.difficulty], baseWindow - shrink);
    const logoSize = Math.max(104, windowSize + { easy: 0, medium: 44, hard: 82 }[this.difficulty] + Math.min(stage, 8) * 3);
    return { label: labels[Math.min(3, Math.floor(stage / 2))], windowSize, logoSize };
  }

  renderQuestion() {
    const answer = this.getAnswer();
    const seconds = this.getSeconds();
    const stageLevel = (this.question % 10) + 1;
    const choices = this.getChoices(answer);
    const progression = this.getProgression();
    const cropMax = Math.max(0, progression.logoSize - progression.windowSize);
    const cropX = -Math.floor(Math.random() * cropMax);
    const cropY = -Math.floor(Math.random() * cropMax);
    this.answered = false;

    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <section class="quiz" aria-label="Token logo quiz" tabindex="0">
        <div class="top"><p class="eyebrow">${DIFFICULTIES[this.difficulty].label} · ${progression.label}</p><span class="live">Level ${this.question + 1} / ${this.runLength}</span></div>
        <div class="hud">
          <div class="hud-item"><strong class="score">${this.score}</strong><span>Score</span></div>
          <div class="hud-item"><strong data-streak>${this.streak}×</strong><span>Streak</span></div>
          <div class="hud-item"><strong>${stageLevel}/10</strong><span>Stage</span></div>
        </div>
        <div class="timer"><strong data-time>${seconds}s</strong><div class="timer-track"><span data-timebar style="width:100%"></span></div></div>
        <div class="logo-wrap">
          <div class="logo-window ${this.difficulty}" style="--window-size:${progression.windowSize}px;--logo-size:${progression.logoSize}px;--window-radius:${Math.max(8, Math.round(progression.windowSize * .2))}px">
            <img src="${this.imageUrl(answer)}" alt="Mystery token logo" style="--crop-x:${cropX}px;--crop-y:${cropY}px">
            <span class="logo-fallback">?</span>
          </div>
          <span class="logo-reveal">${answer.name} · ${answer.category}</span>
        </div>
        <h2>Which token is this?</h2>
        <p class="sub">Use keys 1–${choices.length}, or trust your cursor.</p>
        <div class="tools">
          <button class="tool" data-fifty ${!this.lifelines.fifty || this.score < LIFELINE_COST ? `disabled title="${this.lifelines.fifty ? "Earn 50 points to unlock" : "Already used this level"}"` : ""}>50:50 (-50)</button>
          ${this.difficulty === "easy" ? "" : `<button class="tool" data-clue ${!this.lifelines.clue || this.score < LIFELINE_COST ? `disabled title="${this.lifelines.clue ? "Earn 50 points to unlock" : "Already used this level"}"` : ""}>Logo glimpse (-50)</button>`}
        </div>
        <div class="clue" data-cluebox hidden></div>
        <div class="choices">
          ${choices.map((token, index) => `<button class="choice" data-symbol="${token.symbol}"><span class="key">${index + 1}</span>${token.name}<span>${token.symbol}</span></button>`).join("")}
        </div>
        <div class="feedback" aria-live="polite"></div>
        <button class="next" hidden>${this.question + 1 === this.runLength ? "See my result" : "Next logo →"}</button>
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
    this.shadowRoot.querySelector("[data-clue]")?.addEventListener("click", () => this.useClue(answer));
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
    if (!this.lifelines.fifty || this.answered || this.score < LIFELINE_COST) return;
    this.lifelines.fifty = false;
    this.score -= LIFELINE_COST;
    this.shadowRoot.querySelector(".score").textContent = this.score;
    const wrong = this.shuffle([...this.shadowRoot.querySelectorAll(".choice")]
      .filter((button) => button.dataset.symbol !== answer.symbol));
    wrong.slice(0, Math.max(0, wrong.length - 1)).forEach((button) => button.classList.add("removed"));
    this.shadowRoot.querySelector("[data-fifty]").disabled = true;
  }

  getHint(answer) {
    const words = answer.name.trim().split(/\s+/);
    const letters = answer.name.replace(/[^a-z0-9]/gi, "").length;
    return `${words.length === 1 ? "One-word" : `${words.length}-word`} project · ${letters} letters`;
  }

  getComboLabel() {
    if (this.streak >= 10) return "Logo oracle";
    if (this.streak >= 5) return "Unstoppable";
    if (this.streak >= 3) return "On-chain";
    if (this.streak >= 2) return "Locked in";
    return "";
  }

  useClue(answer) {
    if (!this.lifelines.clue || this.answered || this.score < LIFELINE_COST) return;
    this.lifelines.clue = false;
    this.score -= LIFELINE_COST;
    this.shadowRoot.querySelector(".score").textContent = this.score;
    this.shadowRoot.querySelector("[data-clue]").disabled = true;
    const clue = this.shadowRoot.querySelector("[data-cluebox]");
    clue.textContent = `Full logo revealed briefly · ${this.getHint(answer)}`;
    clue.hidden = false;
    const logo = this.shadowRoot.querySelector(".logo-window");
    logo.classList.remove("glimpse");
    void logo.offsetWidth;
    logo.classList.add("glimpse");
    setTimeout(() => logo?.isConnected && logo.classList.remove("glimpse"), 1600);
  }

  answer(selected, answer, timedOut = false) {
    if (this.answered) return;
    this.answered = true;
    this.stopTimer();
    const buttons = [...this.shadowRoot.querySelectorAll(".choice")];
    const correct = !timedOut && selected?.dataset.symbol === answer.symbol;
    const elapsed = Math.min(this.getSeconds(), (Date.now() - this.questionStartedAt) / 1000);
    this.responseTimes.push(elapsed);
    this.answerHistory.push(correct);

    buttons.forEach((button) => {
      button.disabled = true;
      if (button.dataset.symbol === answer.symbol) button.classList.add("correct");
    });
    this.shadowRoot.querySelectorAll(".tool").forEach((button) => { button.disabled = true; });

    if (correct) {
      this.streak += 1;
      this.bestStreak = Math.max(this.bestStreak, this.streak);
      this.correctAnswers += 1;
      const awarded = DIFFICULTIES[this.difficulty].points + Math.max(0, this.streak - 1) * 25 + this.timeLeft * 10;
      this.score += awarded;
      const pop = document.createElement("span");
      pop.className = "score-pop";
      pop.textContent = `+${awarded}`;
      this.shadowRoot.querySelector(".logo-wrap").append(pop);
    } else {
      this.streak = 0;
      this.missed.push(answer);
      if (selected) selected.classList.add("wrong");
    }

    this.shadowRoot.querySelector(".score").textContent = this.score;
    this.shadowRoot.querySelector("[data-streak]").textContent = `${this.streak}×`;
    this.shadowRoot.querySelector(".logo-wrap").classList.add("answered");
    this.shadowRoot.querySelector(".logo-window").classList.add("revealed");
    const combo = this.getComboLabel();
    this.shadowRoot.querySelector(".feedback").innerHTML = correct
      ? `<strong>Correct${this.streak > 1 ? ` · ${this.streak} answer streak` : ""}.</strong>${combo ? `<span class="combo">${combo}</span>` : ""}
         <div class="knowledge"><span>${answer.category} · Ranked #${answer.rank} in this IQ.wiki project set</span><a href="https://iq.wiki/wiki/${answer.wiki}" target="_blank" rel="noopener noreferrer">Explore ${answer.name} on IQ.wiki →</a></div>`
      : `<strong>${timedOut ? "Time is up." : "Not quite."} That is ${answer.name} (${answer.symbol}).</strong>
         <div class="knowledge"><span>${answer.category} · Ranked #${answer.rank} in this IQ.wiki project set</span><a href="https://iq.wiki/wiki/${answer.wiki}" target="_blank" rel="noopener noreferrer">Learn about ${answer.name} on IQ.wiki →</a></div>`;
    this.shadowRoot.querySelector(".next").hidden = timedOut;

    this.dispatchEvent(new CustomEvent("token-quiz-answer", {
      bubbles: true,
      detail: { correct, token: answer.symbol, difficulty: this.difficulty, score: this.score },
    }));
    if (timedOut) {
      this.endedByTimeout = true;
      this.renderResult();
    }
  }

  next() {
    this.stopTimer();
    this.question += 1;
    if (this.question < this.runLength) {
      this.lifelines = { fifty: true, clue: true };
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
    const rank = percentage >= 90 ? "Logo Oracle" : percentage >= 70 ? "Chain Spotter" : percentage >= 40 ? "Wiki Scout" : "Crypto Curious";
    const title = this.endedByTimeout
      ? "Time's up. Run over."
      : percentage >= 90 ? "You know the ecosystem." : percentage >= 60 ? "Your logo game is strong." : "More wikis. More power.";
    const shareText = this.getShareText(percentage);
    const shareUrl = encodeURIComponent(location.href);
    const encodedShareText = encodeURIComponent(shareText);

    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <section class="quiz" aria-label="Token logo quiz result">
        <div class="result">
          <div class="rank">${rank}</div>
          <p class="eyebrow">${this.category} · ${DIFFICULTIES[this.difficulty].label} run ${this.endedByTimeout ? "timed out" : "complete"}</p>
          <h2>${title}</h2>
          <div class="result-hero">
            <div class="accuracy-ring" style="--accuracy:${percentage}"><strong>${percentage}%</strong></div>
            <div class="result-copy"><div class="big">${this.score}</div><span>points · personal best ${best}</span></div>
          </div>
          <div class="run-grid" aria-label="${this.correctAnswers} of ${levelsPlayed} correct">
            ${this.answerHistory.map((correct) => `<span class="run-dot ${correct ? "correct" : ""}"></span>`).join("")}
          </div>
          <div class="stats">
            <div class="stat"><strong>${levelsPlayed}</strong><span>Levels reached</span></div>
            <div class="stat"><strong>${this.bestStreak}</strong><span>Best streak</span></div>
            <div class="stat"><strong>${average}s</strong><span>Avg. answer</span></div>
          </div>
          ${this.missed.length ? `<div class="review"><strong>Review missed tokens on IQ.wiki</strong>${this.missed.map((token) => `<a href="https://iq.wiki/wiki/${token.wiki}" target="_blank" rel="noopener noreferrer">${token.name} →</a>`).join("")}</div>` : ""}
          <p class="sub">Fast answers and streaks can push your score above ${maxBaseScore}.</p>
          <p class="share-label">Challenge your friends</p>
          <div class="share-links">
            <a class="share-link" href="https://twitter.com/intent/tweet?text=${encodedShareText}&url=${shareUrl}" target="_blank" rel="noopener noreferrer">X</a>
            <a class="share-link" href="https://t.me/share/url?url=${shareUrl}&text=${encodedShareText}" target="_blank" rel="noopener noreferrer">Telegram</a>
            <a class="share-link" href="https://wa.me/?text=${encodedShareText}%20${shareUrl}" target="_blank" rel="noopener noreferrer">WhatsApp</a>
            <button class="share-link copy-share">Copy link</button>
          </div>
          <div class="result-actions">
            <button class="share">More sharing options</button>
            <button class="restart">Play again</button>
          </div>
          <button class="restart secondary">Change mode</button>
        </div>
      </section>
    `;
    const [restart, change] = this.shadowRoot.querySelectorAll(".restart");
    restart.addEventListener("click", () => this.start());
    change.addEventListener("click", () => this.renderStart());
    this.shadowRoot.querySelector(".share").addEventListener("click", () => this.shareResult(rank, percentage));
    this.shadowRoot.querySelector(".copy-share").addEventListener("click", () => this.copyChallenge(percentage));
    this.dispatchEvent(new CustomEvent("token-quiz-complete", {
      bubbles: true,
      detail: { score: this.score, levels: levelsPlayed, difficulty: this.difficulty, category: this.category },
    }));
  }

  getShareText(percentage) {
    const grid = this.answerHistory.slice(-10).map((correct) => correct ? "🟩" : "🟥").join("");
    return `I reached Level ${this.responseTimes.length} in ${this.category} · ${DIFFICULTIES[this.difficulty].label} and scored ${this.score} points in the IQ.wiki Token Logo Quiz (${percentage}% accuracy).\n${grid}\nCan you beat my score?`;
  }

  async copyChallenge(percentage) {
    const button = this.shadowRoot.querySelector(".copy-share");
    try {
      await navigator.clipboard.writeText(`${this.getShareText(percentage)}\n${location.href}`);
      button.textContent = "Copied";
    } catch {
      button.textContent = "Copy unavailable";
    }
  }

  async shareResult(rank, percentage) {
    const text = this.getShareText(percentage);
    if (navigator.share) {
      try {
        await navigator.share({ title: "IQ.wiki Token Logo Quiz", text, url: location.href });
        return;
      } catch {}
    }
    try {
      await navigator.clipboard.writeText(`${text} ${location.href}`);
      this.shadowRoot.querySelector(".share").textContent = "Challenge copied";
    } catch {
      this.shadowRoot.querySelector(".share").textContent = "Share unavailable";
    }
  }
}

customElements.define("iq-token-quiz", IqTokenQuiz);
