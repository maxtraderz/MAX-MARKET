const TELEGRAM_USERNAME = "max_traderz";
const INSTAGRAM_URL = "https://www.instagram.com/max_traderz?igsh=MWJ3YjN1b2t4ejJ2eQ%3D%3D&utm_source=qr";
const TELEGRAM_URL = `https://t.me/${TELEGRAM_USERNAME}`;
const DISCORD_URL = "https://discord.gg/EkrsJTNjVb";

const bots = [
  {
    name: "MAX SOORAA V1",
    market: "ALL MARKET",
    risk: "Low to Medium Risk",
    price: "$300",
    description: "A smart trading EA built with daily profit target and daily loss protection.",
    features: [
      "Daily profit target control",
      "Daily loss limit protection",
      "Auto stop after target hit",
      "Simple lot size settings",
      "Best for controlled trading"
    ]
  },
  {
    name: "MAX BLUE V1",
    market: "XAUUSD",
    risk: "LOW Risk",
    price: "$500",
    description: "A smart bot using low risk to protect your capital with stable profit.",
    features: [
      "Daily stable profit focus",
      "Simple lot size settings",
      "Starts with low capital ($50-$100)",
      "Auto stop after target hit",
      "Best for controlled trading"
    ]
  },
  {
    name: "CUSTOM EA DEVELOPMENT",
    market: "Forex / Crypto / Indices",
    risk: "Based on Strategy",
    price: "Custom Price",
    description: "We also build custom MT4 and MT5 trading bots based on your own strategy.",
    features: [
      "MT4 / MT5 EA development",
      "Custom strategy automation",
      "Risk management settings",
      "Backtesting support",
      "Bot modification support"
    ]
  }
];

const socialLinks = [
  {
    name: "Instagram",
    label: "@max_traderz",
    url: INSTAGRAM_URL,
    icon: "assets/instagram.svg"
  },
  {
    name: "Telegram",
    label: `@${TELEGRAM_USERNAME}`,
    url: TELEGRAM_URL,
    icon: "assets/telegram.svg"
  },
  {
    name: "Discord",
    label: "Join our server",
    url: DISCORD_URL,
    icon: "assets/discord.svg"
  }
];

const botGrid = document.getElementById("botGrid");
const emptyState = document.getElementById("emptyState");
const botSearch = document.getElementById("botSearch");
const toast = document.getElementById("toast");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.getElementById("navLinks");
const themeToggle = document.querySelector(".theme-toggle");
const socialLinksContainer = document.getElementById("socialLinks");

document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("telegramHeroLink").href = TELEGRAM_URL;

function renderBots(items) {
  botGrid.innerHTML = items.map((bot) => `
    <article class="bot-card">
      <div class="bot-top">
        <h3>${bot.name}</h3>
        <span class="price">${bot.price}</span>
      </div>
      <p class="bot-description">${bot.description}</p>
      <div class="bot-meta">
        <span class="pill">${bot.market}</span>
        <span class="pill">${bot.risk}</span>
      </div>
      <ul class="feature-list">
        ${bot.features.map((feature) => `<li>${feature}</li>`).join("")}
      </ul>
      <button class="btn primary" type="button" data-bot-name="${bot.name}">Get This Bot</button>
    </article>
  `).join("");

  emptyState.hidden = items.length > 0;
}

function renderSocialLinks() {
  socialLinksContainer.innerHTML = socialLinks.map((link) => `
    <a class="social-card" href="${link.url}" target="_blank" rel="noopener">
      <span>
        <strong>${link.name}</strong>
        <span>${link.label}</span>
      </span>
      <span class="social-icon" aria-hidden="true"><img src="${link.icon}" alt=""></span>
    </a>
  `).join("");
}

function filterBots() {
  const query = botSearch.value.trim().toLowerCase();
  const filtered = bots.filter((bot) => {
    const searchable = `${bot.name} ${bot.market} ${bot.risk} ${bot.description}`.toLowerCase();
    return searchable.includes(query);
  });

  renderBots(filtered);
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  document.execCommand("copy");
  textArea.remove();
}

function buildTelegramUrl(message) {
  return `${TELEGRAM_URL}?text=${encodeURIComponent(message)}`;
}

async function handleBotClick(botName) {
  const message = `Hi MAX MARKET, I want more details about ${botName}. Please send me full details and price.`;

  try {
    await copyText(message);
    showToast(`${botName} message copied. Opening Telegram.`);
  } catch {
    showToast(`Opening Telegram for ${botName}.`);
  }

  window.open(buildTelegramUrl(message), "_blank", "noopener");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("max-market-theme", theme);
  document.querySelector(".theme-icon").innerHTML = theme === "light" ? "&#9728;" : "&#9790;";
  document.querySelector(".theme-label").textContent = theme === "light" ? "Light" : "Dark";
  themeToggle.setAttribute("aria-label", theme === "light" ? "Switch to dark mode" : "Switch to light mode");
}

function initTheme() {
  const savedTheme = localStorage.getItem("max-market-theme");
  const preferredTheme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  setTheme(savedTheme || preferredTheme);
}

botGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-bot-name]");
  if (!button) return;
  handleBotClick(button.dataset.botName);
});

botSearch.addEventListener("input", filterBots);

themeToggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.dataset.theme;
  setTheme(currentTheme === "light" ? "dark" : "light");
});

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  document.body.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.addEventListener("click", (event) => {
  if (!event.target.closest("a")) return;
  navLinks.classList.remove("open");
  document.body.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
});

initTheme();
renderBots(bots);
renderSocialLinks();


