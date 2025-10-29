console.log("✅ 최신 API 코드 로드됨");
let usedIndices = new Set(); 

export default function handler(req, res) {
  // 전체 후보군
  // ************* 🚨 모든 이미지 URL이 안정적인 직접 링크로 변경됨 🚨 *************
  const allCandidates = [
    { name: "이순신", hint: "임진왜란 장군", image: "img/General-soonsin.jpg" },
    { name: "세종대왕", hint: "한글 창제", image: "https://upload.wikimedia.org/wikipedia/commons/d/d4/King_Sejong_the_Great.jpg" },
    { name: "정약용", hint: "목민심서 저술", image: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Jeong_Yak-yong.jpg" },
    { name: "아인슈타인", hint: "상대성이론 창시자", image: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Albert_Einstein_Head.jpg" },
    { name: "마리 퀴리", hint: "라듐 발견", image: "https://upload.wikimedia.org/wikipedia/commons/9/9c/Marie_Curie_c1920.jpg" },
    { name: "간디", hint: "인도 독립운동가", image: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Portrait_Gandhi.jpg" },
    { name: "링컨", hint: "미국 남북전쟁 대통령", image: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Abraham_Lincoln_O-77_matte_collodion_print.jpg" },
    { name: "피카소", hint: "입체파 화가", image: "https://upload.wikimedia.org/wikipedia/commons/7/74/Pablo_picasso_1.jpg" },
    { name: "레오나르도 다 빈치", hint: "모나리자 화가", image: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Leonardo_self.jpg" },
    { name: "나폴레옹", hint: "프랑스 황제", image: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Jacques-Louis_David_-_Napoleon_in_his_Study_-_Google_Art_Project_2.jpg" },
    { name: "신사임당", hint: "율곡 이이의 어머니", image: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Shin_Saimdang.jpg" },
    { name: "안중근", hint: "이토 히로부미 저격 의사", image: "https://upload.wikimedia.org/wikipedia/commons/6/62/Ahn_Jung-geun_portrait.jpg" },
    { name: "소크라테스", hint: "철학의 아버지", image: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Socrates_Louvre.jpg" },
    { name: "아리스토텔레스", hint: "플라톤의 제자", image: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Aristotle_Altemps_Inv8575.jpg" },
    { name: "뉴턴", hint: "만유인력 법칙 발견", image: "https://upload.wikimedia.org/wikipedia/commons/3/39/Sir_Isaac_Newton_%281642-1727%29.jpg" }
  ];
  // ************* 🚨 수정된 부분 종료 🚨 *************

  // ⚙️ 이미 사용한 문제 제외 및 로직 유지
  const allIndices = allCandidates.map((_, i) => i); 
  const availableIndices = allIndices.filter(i => !usedIndices.has(i));

  if (availableIndices.length < 5) {
    usedIndices.clear();
    availableIndices.splice(0, availableIndices.length, ...allIndices);
  }

  const selected = [];
  const temp = [...availableIndices]; 

  while (selected.length < 5 && temp.length > 0) {
    const randIndex = Math.floor(Math.random() * temp.length);
    const pick = temp.splice(randIndex, 1)[0];
    usedIndices.add(pick);
    selected.push(allCandidates[pick]);
  }

  res.status(200).json(selected);
}
