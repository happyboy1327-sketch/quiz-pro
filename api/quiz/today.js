console.log("✅ 최신 API 코드 로드됨");
let usedIndices = new Set(); 

export default function handler(req, res) {
  // 전체 후보군
  // ************* 🚨 모든 이미지 URL이 안정적인 직접 링크로 변경됨 🚨 *************
  const allCandidates = [
    { name: "이순신", hint: "임진왜란 장군", image: "/img/General-soonsin.jpg" },
    { name: "세종대왕", hint: "한글 창제", image: "https://commons.wikimedia.org/wiki/Special:FilePath/King_Sejong_the_Great.jpg" },
    { name: "정약용", hint: "목민심서 저술", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Jeong_Yak-yong.jpg" },
    { name: "아인슈타인", hint: "상대성이론 창시자", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Albert_Einstein_Head.jpg" },
    { name: "마리 퀴리", hint: "라듐 발견", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Marie_Curie_c1920.jpg" },
    { name: "간디", hint: "인도 독립운동가", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Portrait_Gandhi.jpg" },
    { name: "링컨", hint: "미국 남북전쟁 대통령", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Abraham_Lincoln_O-77_matte_collodion_print.jpg" },
    { name: "피카소", hint: "입체파 화가", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Pablo_picasso_1.jpg" },
    { name: "레오나르도 다 빈치", hint: "모나리자 화가", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Leonardo_self.jpg" },
    { name: "나폴레옹", hint: "프랑스 황제", image: "https://upload.wikimedia.org/wikipedia/commons/b/b5/Jacques-Louis_David_-_The_Emperor_Napoleon_in_His_Study_at_the_Tuileries_-_Google_Art_Project_2.jpg" },
    { name: "신사임당", hint: "율곡 이이의 어머니", image: "/img/Shin_Saimdang.jpg" },
    { name: "안중근", hint: "이토 히로부미 저격 의사", image: "https://commons.wikimedia.org/wiki/Special:FilePath/An_Jung-geun.jpg" },
    { name: "소크라테스", hint: "철학의 아버지", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Socrates_Louvre.jpg" },
    { name: "아리스토텔레스", hint: "플라톤의 제자", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Aristotle_Altemps_Inv8575.jpg" },
    { name: "뉴턴", hint: "만유인력 법칙 발견", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Portrait_of_Sir_Isaac_Newton,_1689_(brightened).jpg" }
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





