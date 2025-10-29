// ======================
// 1️⃣ 기존 + 신규 문제 저장소 (제거)
// ======================
// let candidates = JSON.parse(localStorage.getItem("candidates")) || []; // 제거// ======================

// ======================
// 2️⃣ API에서 신규 문제 불러오기
// ======================
async function fetchNewQuestions() {
  try {
    const res = await fetch("/api/quiz/today");
    if (!res.ok) throw new Error("❌ API 불러오기 실패");
    const newQuestions = await res.json();

    // 🔸 URL 포맷 정리
    const formatted = newQuestions.map(q => ({
      ...q,
      // *수정*: URL 포맷을 단순화하고, 혹시 모를 URL 인코딩 문제를 해결
      // today.js에서 이미 완전한 URL(width=400 포함)을 제공하고 있으므로, 
      // 추가적인 URL 조작 없이 그대로 사용합니다.
      // 만약 image 속성이 비어있을 경우를 대비한 기본 로직만 유지합니다.
      image: q.image 
        ? q.image 
        : `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(q.name)}.jpg?width=400`
    }));

    console.log(`✨ 5개의 새 문제가 API로부터 로드되었습니다.`);
    return formatted; // 5문제 반환
  } catch (err) {
    console.error("🚨 API 로드 오류:", err);
    return []; // 오류 시 빈 배열 반환
  }
}
// ======================
// 3️⃣ 무작위 5문제 추출 (제거)
// ======================
/*
// function getRandomQuiz() { ... } 제거
*/

// ======================
// 4️⃣ 초기화 및 재시작
// ======================
let quizData = [];
let currentQuiz = 0;
let score = 0;
let timer;

// *추가*: API 호출을 통해 새로운 5문제를 가져와 퀴즈 시작
async function startNewQuizSet() {
  // 💾 데이터는 절대로 유실되지 않도록: 기존 데이터를 덮어쓰기 전에 새 데이터를 API로 부터 가져옵니다.
  quizData = await fetchNewQuestions();
  currentQuiz = 0;
  score = 0;

  if (quizData.length > 0) {
    loadQuiz();
  } else {
    alert("API로부터 문제를 불러오지 못했습니다. 다시 시도해 주세요.");
  }
}

// *수정*: initQuiz 대신 startNewQuizSet 호출
async function initQuiz() {
  await startNewQuizSet();
}

// ======================
// 5️⃣ 이하 퀴즈 로직 동일
// ======================
const imageEl = document.getElementById("image");
const questionEl = document.getElementById("question");
const inputEl = document.getElementById("answer");
const submitBtn = document.getElementById("submit");
const resultEl = document.getElementById("result");
const timerEl = document.getElementById("timer");
const restartBtn = document.getElementById("restart");

function loadQuiz() {
  clearInterval(timer);
  const person = quizData[currentQuiz];
  if (!person) return alert("문제가 충분하지 않아요!");

  imageEl.onerror = function() {
    alert(`⚠️ 이미지 로드 실패: ${person.name}`);
    this.src = "";
  };
  imageEl.src = person.image;
  questionEl.textContent = `힌트: ${person.hint}`;
  inputEl.value = "";
  resultEl.textContent = "";
  startTimer(15);

  imageEl.style.display = "block";
  questionEl.style.display = "block";
  inputEl.style.display = "inline";
  submitBtn.style.display = "inline";
  timerEl.style.display = "block";
  restartBtn.style.display = "none";
}

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

submitBtn.addEventListener("click", checkAnswer);

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

function showResults() {
  questionEl.textContent = `퀴즈 종료! 점수: ${score}/${quizData.length} 💕`;
  imageEl.style.display = "none";
  inputEl.style.display = "none";
  submitBtn.style.display = "none";
  timerEl.style.display = "none";
  resultEl.style.display = "block";
  restartBtn.style.display = "inline";
}

// *수정*: 재시작 버튼 클릭 시 API 호출 및 새로운 퀴즈 세트 시작
restartBtn.addEventListener("click", startNewQuizSet);

window.addEventListener("load", initQuiz);
