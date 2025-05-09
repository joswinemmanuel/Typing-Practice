const main = document.querySelector(".main");
const typeArea = document.querySelector(".typingArea");
const btn = document.querySelector(".btn");

typeArea.disabled = true;

const words = [
  "A day in the life of programmer",
  "What is JavaScript?",
  "What is React?",
  "What is Programming Language?",
  "What's your name?",
  "Where are you from?",
  "This is just random word",
  "What is Remix.js?",
  "New Technologies",
  "Is programming hard?",
  "Why do you wanna become a programmer?",
  "Which programming language you like the most?",
  "What is Golang? and why do you wanna learn it?",
  "What is CSS?",
  "What makes Python so special?"
];

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
    main.style.borderColor = "white";
    end();
  }
});

typeArea.addEventListener("input", highlightCurrentWord);

function play() {
  let randText = Math.floor(Math.random() * words.length);
  game.arrText = words[randText].split(" "); // Save as array
  main.innerHTML = game.arrText.map(word => `<span>${word}</span>`).join(" ");
  main.style.borderColor = "#c8c8c8";
  btn.textContent = "Done";
  const duration = new Date();
  game.start = duration.getTime();
}

function highlightCurrentWord() {
  const userWords = typeArea.value.trim().split(" ");
  const spans = main.querySelectorAll("span");

  spans.forEach((span, idx) => {
    span.className = ""; // Reset class
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
    main.innerHTML = `<span style="color: red;">Please type something before clicking Done!</span>`;
    btn.textContent = "Start";
    return;
  }
  
  const duration = new Date();
  game.end = duration.getTime();
  const totalTime = (game.end - game.start) / 1000;
  game.user = typeArea.value;
  const correct = results();
  main.style.borderColor = "white";
  const wpm = Math.round((game.user.split(" ").length / totalTime) * 60);
  main.innerHTML = `Time: ${totalTime}s | WPM: ${wpm} | Score: ${correct.score}/${correct.total}`;
  btn.textContent = "Start";
}

function results() {
  let valueOne = game.arrText; // already an array
  let valueTwo = game.user.trim().split(" ");
  let score = 0;
  valueOne.forEach((word, idx) => {
    if (word === valueTwo[idx]) {
      score++;
    }
  });

  return { score, total: valueOne.length };
}
