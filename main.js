import './style.css';

const main = document.querySelector(".main");
const typeArea = document.querySelector(".typingArea");
const btn = document.querySelector(".btn");

typeArea.disabled = true;

const game = {
  start: 0,
  end: 0,
  user: "",
  arrText: "",
};

btn.addEventListener("click", () => {
  if (btn.textContent === "Start") {
    play();
    typeArea.value = "";
    typeArea.disabled = false;
    typeArea.focus();
  } else if (btn.textContent === "Done") {
    typeArea.disabled = true;
    end();
  }
});

typeArea.addEventListener("input", highlightCurrentWord);

typeArea.addEventListener("keydown", (e) => {
  console.log("Enter Pressed");
  if (e.key === "Enter" && btn.textContent === "Done") {
    console.log("Going to submit");
    e.preventDefault();
    typeArea.disabled = true;
    end();
  }
})

async function getQuoteText() {
  const res = await fetch("https://dummyjson.com/quotes/random");
  const data = await res.json();
  return data.quote;
}

async function play() {
  const paragraph = await getQuoteText();
  game.arrText = paragraph.split(" ");
  main.innerHTML = game.arrText.map(word => `<span>${word}</span>`).join(" ");
  btn.textContent = "Done";
  const duration = new Date();
  game.start = duration.getTime();
}

function highlightCurrentWord() {
  const userWords = typeArea.value.trim().split(" ");
  const spans = main.querySelectorAll("span");

  spans.forEach((span, idx) => {
    span.className = "";
    if (idx < userWords.length) {
      if (userWords[idx] === game.arrText[idx]) {
        span.classList.add("correct");
      } else {
        span.classList.add("incorrect");
      }
    }
    if (idx === userWords.length) {
      span.classList.add("current");
    }
  });
}

function end() {
  if (!typeArea.value.trim()) {
    main.innerHTML = `<span style="color: tomato; font-weight: bold;">Please type something before clicking Done!</span>`;
    btn.textContent = "Start";
    return;
  }

  const duration = new Date();
  game.end = duration.getTime();
  const totalTime = (game.end - game.start) / 1000;
  game.user = typeArea.value;
  const correct = results();
  const wpm = Math.round((game.user.split(" ").length / totalTime) * 60);
  main.innerHTML = `Time: ${totalTime}s | WPM: ${wpm} | Score: ${correct.score}/${correct.total}<br>`;

  if (correct.score === correct.total) {
    main.innerHTML += `<br><span style="color: lightgreen; font-weight: bold;">Well Done!!! Perfect Accuracy</span>`;
  } else if (correct.score >= (correct.total / 2)) {
    main.innerHTML += `<br><span style="color: gold; font-weight: bold;">Good!! Accuracy is improving</span>`;
  } else {
    main.innerHTML += `<br><span style="color: red; font-weight: bold;">Improve your accuracy!</span>`;
  }

  if (wpm >= 60) {
    main.innerHTML += `<br><span style="color: lightgreen; font-weight: bold;">Blazing Fast!!!</span>`;
  } else if (wpm >= 40) {
    main.innerHTML += `<br><span style="color: gold; font-weight: bold;">Great Speed!!</span>`;
  } else if (wpm >= 20) {
    main.innerHTML += `<br><span style="color: tomato; font-weight: bold;">Decent Speed!</span>`;
  } else {
    main.innerHTML += `<br><span style="color: red; font-weight: bold;">Try to increase your speed!</span>`;
  }

  btn.textContent = "Start";
}

function results() {
  let valueOne = game.arrText;
  let valueTwo = game.user.trim().split(" ");
  let score = 0;
  valueOne.forEach((word, idx) => {
    if (word === valueTwo[idx]) {
      score++;
    }
  });

  return { score, total: valueOne.length };
}


const themeToggle = document.querySelector(".theme-toggle");

themeToggle.addEventListener("click", () => {
  document.documentElement.classList.toggle("light");
});
