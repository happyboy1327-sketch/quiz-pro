console.log("✅ 스크립트 로드됨");

// 퀴즈 5문제를 API에서 불러오기
async function fetchNewQuestions() {
  try {
    const res = await fetch("/api/quiz/today");
    if (!res.ok) throw new Error("API 요청 실패: " + res.status);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("🚨 API 불러오기 오류:", err);
    return [];
  }
}

// 퀴즈 화면에 표시
async function displayQuiz() {
  const container = document.getElementById("quiz-container");
  container.innerHTML = "<p>로딩 중...</p>";

  const questions = await fetchNewQuestions();

  if (questions.length === 0) {
    container.innerHTML = "<p>퀴즈를 불러오지 못했습니다.</p>";
    return;
  }

  container.innerHTML = ""; // 초기화
  questions.forEach((q, index) => {
    const div = document.createElement("div");
    div.className = "quiz-item";
    div.innerHTML = `
      <h3>문제 ${index + 1}: ${q.name}</h3>
      <p>힌트: ${q.hint}</p>
      <img src="${q.image}" alt="${q.name}" style="max-width:200px; display:block; margin-bottom:20px;">
    `;
    container.appendChild(div);
  });
}

// 페이지 로드 시 실행
window.addEventListener("DOMContentLoaded", displayQuiz);
