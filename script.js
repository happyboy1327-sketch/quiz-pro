// ======================
// 퀴즈 상태 변수
// ======================
let quizData = [];
let currentQuiz = 0;
let score = 0;
let timer;

// ======================
// DOM 요소
// ======================
const imageEl = document.getElementById("image");
const questionEl = document.getElementById("question");
const inputEl = document.getElementById("answer");
const submitBtn = document.getElementById("submit");
const resultEl = document.getElementById("result");
const timerEl = document.getElementById("timer");
const restartBtn = document.getElementById("restart");

// ======================
// 2️⃣ API에서 신규 문제 불러오기 (매번 새로운 5문제 로드)
// ======================
async function fetchNewQuestions() {
  try {
    // Vercel 서버리스 함수 경로
    const res = await fetch("/api/quiz/today"); 
    if (!res.ok) throw new Error("❌ API 불러오기 실패. 상태: " + res.status);
    const newQuestions = await res.json();
      // 🔸 URL 포맷 정리
      const formatted = newQuestions.map(q => ({
        ...q,
        // ************** 🚨 최종 수정된 부분 🚨 **************
        image: q.image 
          ? (
              // 1. URL이 HTTPS로 시작하는지 확인 (대부분의 이미지 로드 실패는 보안 정책 때문)
              // 2. 만약 그렇지 않다면 HTTPS를 추가하고, 마지막에 ?width=400을 붙여서 안정적인 로딩을 유도합니다.
              // 3. q.image가 null 또는 undefined가 아닐 때만 처리합니다.
              q.image.startsWith('http') 
                ? `${q.image}?width=400` // 이미 http/https가 있으면 그대로 사용
                : `https://${q.image}?width=400` // 없으면 https를 강제로 추가
            )
          : null 
      // ************** 🚨 최종 수정된 부분 종료 🚨 **************
    }));

    console.log(`✨ 5개의 새 문제가 API로부터 로드되었습니다.`);
    return formatted; // 5문제 반환
  } catch (err) {
    console.error("🚨 API 로드 오류:", err);
    // 퀴즈 작동을 막는 주요 원인이므로 에러 메시지 사용자에게 표시
    alert(`🚨 퀴즈 로드 오류! 콘솔을 확인해주세요. (${err.message})`);
    return []; 
  }
}

// ======================
// 4️⃣ 초기화 및 재시작 (API 호출 트리거)
// ======================
async function startNewQuizSet() {
  quizData = await fetchNewQuestions();
  currentQuiz = 0;
  score = 0;

  if (quizData.length > 0) {
    loadQuiz();
  } else {
    // API 호출이 실패하면 이 메시지가 뜸
    questionEl.textContent = "문제를 불러오는 데 실패했습니다. 콘솔(F12)을 확인하세요.";
    imageEl.style.display = "none";
    restartBtn.style.display = "inline";
  }
}

async function initQuiz() {
  await startNewQuizSet();
}


// ======================
// 5️⃣ 퀴즈 로직 (이미지 로딩 안정성 보강)
// ======================
function loadQuiz() {
  clearInterval(timer);
  const person = quizData[currentQuiz];
  if (!person) return alert("문제가 충분하지 않아요!");

  // ************* 🚨 이미지 로딩 안정성 보강 부분 🚨 *************
  // 이미지 로드 실패 시 디버깅 로그 추가 및 사용자 알림
  imageEl.onerror = function() {
    console.error(`⚠️ 이미지 로드 실패: ${person.name}. URL: ${this.src}`);
    alert(`⚠️ 이미지 로드 실패: ${person.name}. 콘솔(F12)을 확인해주세요.`);
    this.src = "";
  };
  
  // 렌더링 안정성을 위한 명시적 크기 할당
  imageEl.style.width = '400px';
  imageEl.style.height = '400px'; 
  // ************* 🚨 보강 부분 종료 🚨 *************
  
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

restartBtn.addEventListener("click", startNewQuizSet);

window.addEventListener("load", initQuiz);
