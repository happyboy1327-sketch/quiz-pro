// ======================
// 1️⃣ 후보군 (이순신 포함)
// ======================
const candidates = [
  { name: "이순신", hint: "임진왜란 장군", image: "img/General-soonsin.jpg" },
  { name: "세종대왕", hint: "한글 창제", image: "https://commons.wikimedia.org/wiki/Special:FilePath/King_Sejong_the_Great.jpg?width=400" },
  { name: "정약용", hint: "목민심서 저술", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Jeong_Yak-yong.jpg?width=400" },
  { name: "아인슈타인", hint: "상대성이론", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Albert_Einstein_Head.jpg?width=400" },
  { name: "마리 퀴리", hint: "라듐 발견", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Marie_Curie_c1920.jpg?width=400" },
  { name: "간디", hint: "인도 독립", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Portrait_Gandhi.jpg?width=400" },
  { name: "나폴레옹", hint: "프랑스 황제", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Jacques-Louis_David_-_Napoleon_in_his_Study_-_Google_Art_Project_2.jpg?width=400" },
  { name: "링컨", hint: "미국 남북전쟁 대통령", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Abraham_Lincoln_O-77_matte_collodion_print.jpg?width=400" },
  { name: "피카소", hint: "입체파 화가", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Pablo_picasso_1.jpg?width=400" },
  { name: "레오나르도 다 빈치", hint: "모나리자 화가", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Leonardo_self.jpg?width=400" }
];

// ======================
// 2️⃣ 오늘 신규 5문제 생성
// ======================
function getDailyQuiz() {
  const today = new Date();
  let seed = today.getFullYear()*10000 + (today.getMonth()+1)*100 + today.getDate();

  function seededRandom() {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  const temp = [...candidates];
  const selected = [];
  while (selected.length < 5 && temp.length > 0) {
    const idx = Math.floor(seededRandom() * temp.length);
    selected.push(temp.splice(idx,1)[0]);
  }
  return selected;
}

// ======================
// 3️⃣ 오늘의 문제 세트
// ======================
let quizData = getDailyQuiz();

// ======================
// 4️⃣ HTML 요소
// ======================
let currentQuiz = 0;
let score = 0;
let timer;

const imageEl = document.getElementById("image");
const questionEl = document.getElementById("question");
const inputEl = document.getElementById("answer");
const submitBtn = document.getElementById("submit");
const resultEl = document.getElementById("result");
const timerEl = document.getElementById("timer");
const restartBtn = document.getElementById("restart");

// ======================
// 5️⃣ 문제 로드
// ======================
function loadQuiz() {
  clearInterval(timer);
  const person = quizData[currentQuiz];

  // 이미지 로드 실패 시 경고 (퀴즈 진행 중만)
  imageEl.onerror = function() {
    alert(`⚠️ 이미지 로드 실패: ${person.name}`);
    this.src = "";
  };
  imageEl.src = person.image;

  questionEl.textContent = `힌트: ${person.hint}`;
  inputEl.value = "";
  resultEl.textContent = "";
  startTimer(15);

  // 요소 표시
  imageEl.style.display = "block";
  questionEl.style.display = "block";
  inputEl.style.display = "inline";
  submitBtn.style.display = "inline";
  timerEl.style.display = "block";
  restartBtn.style.display = "none";
}

// ======================
// 6️⃣ 타이머
// ======================
function startTimer(seconds) {
  let timeLeft = seconds;
  timerEl.textContent = `⏰ 남은 시간: ${timeLeft}초`;

  timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `⏰ 남은 시간: ${timeLeft}초`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      checkAnswer();
    }
  }, 1000);
}

// ======================
// 7️⃣ 제출 버튼
// ======================
submitBtn.addEventListener("click", checkAnswer);

// ======================
// 8️⃣ 정답 확인
// ======================
function checkAnswer() {
  clearInterval(timer);
  const answer = inputEl.value.trim();
  const correct = quizData[currentQuiz].name;

  if (answer === correct) {
    resultEl.textContent = "💖 정답이에요!";
    score++;
  } else {
    resultEl.textContent = `❌ 오답이에요! 정답은 ${correct}`;
  }

  currentQuiz++;
  if (currentQuiz < quizData.length) {
    setTimeout(loadQuiz, 2000);
  } else {
    setTimeout(showResults, 2000);
  }
}

// ======================
// 9️⃣ 결과 표시 및 다시 시작 버튼
// ======================
function showResults() {
  questionEl.textContent = `퀴즈 종료! 점수: ${score}/${quizData.length} 💕`;
  imageEl.style.display = "none";
  inputEl.style.display = "none";
  submitBtn.style.display = "none";
  timerEl.style.display = "none";
  resultEl.style.display = "block";
  resultEl.textContent = ""; // 정답 결과는 이미 체크 시 표시됨
  restartBtn.style.display = "inline";
}

// ======================
// 10️⃣ 다시 시작 버튼
// ======================
restartBtn.addEventListener("click", () => {
  quizData = getDailyQuiz(); // 새로운 5문제 생성
  currentQuiz = 0;
  score = 0;
  loadQuiz();
});

// ======================
// 11️⃣ 페이지 로드 시 시작
// ======================
window.addEventListener("load", loadQuiz);

