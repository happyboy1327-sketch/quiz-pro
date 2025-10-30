import fetch from "node-fetch"; // Vercel 환경에서 필요할 수 있음

var fetch = require("node-fetch"); // Node 환경용

console.log("✅ 최신 API 코드 로드됨");

module.exports = async function handler(req, res) {
  try {
    // 전체 후보군 (기존 그대로 유지)
    var allCandidates = [
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
      { name: "안중근", hint: "이토 히로부미 저격 의사", image: "https://upload.wikimedia.org/wikipedia/commons/4/4e/An_Jung-geun.jpg" },
      { name: "소크라테스", hint: "철학의 아버지", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Socrates_Louvre.jpg" },
      { name: "아리스토텔레스", hint: "플라톤의 제자", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Aristotle_Altemps_Inv8575.jpg" },
      { name: "뉴턴", hint: "만유인력 법칙 발견", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Portrait_of_Sir_Isaac_Newton,_1689_(brightened).jpg" }
    ];

    // 1️⃣ 이미지 URL 실제 접속 가능한지 확인
    var validCandidates = [];
    for (var i = 0; i < allCandidates.length; i++) {
      try {
        var headCheck = await fetch(allCandidates[i].image, { method: "HEAD" });
        if (headCheck.ok && headCheck.headers.get("content-type")?.startsWith("image")) {
          validCandidates.push(allCandidates[i]);
        }
      } catch (e) {
        // 실패한 URL은 무시
      }
    }

    // 2️⃣ 5개 랜덤 선택
    var selected = [];
    var temp = validCandidates.slice();
    while (selected.length < 5 && temp.length > 0) {
      var randIndex = Math.floor(Math.random() * temp.length);
      selected.push(temp.splice(randIndex, 1)[0]);
    }

    // 3️⃣ 자동 한글 번역 (Google Translate API)
    var translated = [];
    for (var j = 0; j < selected.length; j++) {
      var quiz = selected[j];
      try {
        var translateNameResp = await fetch(
          "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=ko&dt=t&q=" +
          encodeURIComponent(quiz.name)
        );
        var nameData = await translateNameResp.json();
        var translatedName = nameData?.[0]?.[0]?.[0] || quiz.name;

        var translateHintResp = await fetch(
          "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=ko&dt=t&q=" +
          encodeURIComponent(quiz.hint)
        );
        var hintData = await translateHintResp.json();
        var translatedHint = hintData?.[0]?.[0]?.[0] || quiz.hint;

        translated.push({
          name: translatedName,
          hint: translatedHint,
          image: quiz.image
        });
      } catch (e) {
        translated.push(quiz); // 번역 실패 시 원본 유지
      }
    }

    // 4️⃣ 캐시 방지
    res.setHeader("Cache-Control", "no-store");

    // 5️⃣ 최종 결과 반환
    res.status(200).json(translated);

  } catch (error) {
    console.error("❌ 내부 서버 오류:", error);
    res.status(500).json({ error: "퀴즈 자동 생성 중 서버 오류 발생", details: error.message });
  }
};





