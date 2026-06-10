const siteConfig = {
  nickname: "椰汁",
  themes: ["椰奶晴天", "薄荷晚风", "草莓小憩", "奶油云朵"],
  compliments: [
    "椰汁像冰好的椰奶一样，清清爽爽，但会让人记很久。",
    "今天的椰汁不用很厉害，也已经足够可爱。",
    "如果快乐有口味，今天一定是椰汁味。",
    "椰汁的存在感很轻，但在心里会亮很久。",
    "今天也想把第一口甜甜的留给椰汁。",
    "椰汁认真起来很闪，放松下来也很软。",
    "世界很吵，但椰汁可以拥有一小块安静的奶白色。"
  ],
  moods: {
    sunny: {
      label: "晴天椰",
      text: "今天适合被夸，也适合把快乐分一点给世界。"
    },
    tired: {
      label: "需要抱抱",
      text: "可以慢一点，椰汁不用一直元气满满，先把自己照顾好。"
    },
    sweet: {
      label: "甜甜椰",
      text: "今天适合喝一杯喜欢的东西，再收下很多很多偏爱。"
    },
    quiet: {
      label: "安静充电",
      text: "不说话也没关系，安静的椰汁也很珍贵。"
    }
  },
  wishes: [
    {
      title: "一起去喝一杯新品",
      hint: "最好是有椰奶、草莓或冰淇淋的那种。"
    },
    {
      title: "拍一组不用修也可爱的照片",
      hint: "散步、晚风、便利店灯光都可以。"
    },
    {
      title: "挑一部轻松电影窝着看",
      hint: "不需要多宏大，只要看完心情变软。"
    },
    {
      title: "留一个不用赶时间的下午",
      hint: "慢慢吃饭，慢慢聊天，慢慢回家。"
    }
  ],
  quiz: {
    question: "椰汁今天最适合收到什么？",
    answer: "一整天的偏爱",
    options: ["一杯冰椰奶", "一整天的偏爱", "一朵奶油云"]
  },
  secretMessage:
    "今日隐藏纸条：椰汁不是普通可爱，是需要认真收藏的可爱。"
};

const storageKey = "yezhi-calendar-wishes";
let careScore = 98;
let secretClicks = 0;

const todayText = document.querySelector("#todayText");
const dailyTheme = document.querySelector("#dailyTheme");
const heroCompliment = document.querySelector("#heroCompliment");
const complimentText = document.querySelector("#complimentText");
const careScoreText = document.querySelector("#careScore");
const moodButtons = document.querySelectorAll("[data-mood]");
const moodTag = document.querySelector("#moodTag");
const moodText = document.querySelector("#moodText");
const wishList = document.querySelector("#wishList");
const quizQuestion = document.querySelector("#quizQuestion");
const quizOptions = document.querySelector("#quizOptions");
const quizResult = document.querySelector("#quizResult");
const secretButton = document.querySelector("#secretButton");
const secretMessage = document.querySelector("#secretMessage");

function formatToday() {
  const formatter = new Intl.DateTimeFormat("zh-CN", {
    month: "long",
    day: "numeric",
    weekday: "long"
  });
  todayText.textContent = formatter.format(new Date());
}

function pickDailyTheme() {
  const dayIndex = new Date().getDate() % siteConfig.themes.length;
  dailyTheme.textContent = siteConfig.themes[dayIndex];
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function refreshCompliment() {
  const compliment = randomItem(siteConfig.compliments);
  complimentText.textContent = compliment;
  heroCompliment.textContent = compliment;
  increaseCareScore(1);
}

function increaseCareScore(value) {
  careScore = Math.min(120, careScore + value);
  careScoreText.textContent = careScore;
}

function bindMoods() {
  moodButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedMood = siteConfig.moods[button.dataset.mood];
      moodButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      moodTag.textContent = selectedMood.label;
      moodText.textContent = selectedMood.text;
      increaseCareScore(2);
    });
  });
}

function loadWishState() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || {};
  } catch {
    return {};
  }
}

function saveWishState(state) {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function renderWishes() {
  const savedState = loadWishState();
  wishList.innerHTML = "";

  siteConfig.wishes.forEach((wish, index) => {
    const item = document.createElement("label");
    item.className = "wish-item";
    if (savedState[index]) {
      item.classList.add("done");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = Boolean(savedState[index]);
    checkbox.addEventListener("change", () => {
      savedState[index] = checkbox.checked;
      item.classList.toggle("done", checkbox.checked);
      saveWishState(savedState);
      increaseCareScore(checkbox.checked ? 3 : -1);
    });

    const copy = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = wish.title;
    const hint = document.createElement("span");
    hint.textContent = wish.hint;
    copy.append(title, hint);

    const status = document.createElement("span");
    status.textContent = checkbox.checked ? "已收藏" : "待安排";

    item.append(checkbox, copy, status);
    wishList.appendChild(item);
  });
}

function renderQuiz() {
  quizQuestion.textContent = siteConfig.quiz.question;
  quizOptions.innerHTML = "";

  siteConfig.quiz.options.forEach((option) => {
    const button = document.createElement("button");
    button.className = "button";
    button.type = "button";
    button.textContent = option;
    button.addEventListener("click", () => {
      if (option === siteConfig.quiz.answer) {
        quizResult.textContent = "答对啦。今天的彩蛋关键词：偏爱加满。";
        increaseCareScore(5);
      } else {
        quizResult.textContent = "也很不错，但椰汁今天最适合收到一整天的偏爱。";
        increaseCareScore(1);
      }
    });
    quizOptions.appendChild(button);
  });
}

function bindSecret() {
  secretButton.addEventListener("click", () => {
    secretClicks += 1;
    secretButton.classList.remove("pop");
    void secretButton.offsetWidth;
    secretButton.classList.add("pop");

    if (secretClicks < 5) {
      secretMessage.textContent = `还差 ${5 - secretClicks} 下，椰汁纸条就会出现。`;
      return;
    }

    secretMessage.textContent = siteConfig.secretMessage;
    increaseCareScore(8);
  });
}

function init() {
  formatToday();
  pickDailyTheme();
  renderWishes();
  renderQuiz();
  bindMoods();
  bindSecret();
  document
    .querySelectorAll("[data-random-compliment]")
    .forEach((button) => button.addEventListener("click", refreshCompliment));
}

init();
