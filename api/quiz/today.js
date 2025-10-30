export default async function handler(req, res) {
  try {
    // 1️⃣ Wikimedia에서 인물 관련 랜덤 이미지 10개 가져오기
    const response = await fetch(
      "https://commons.wikimedia.org/w/api.php?action=query&generator=random&grnnamespace=6&grnlimit=10&prop=imageinfo&iiprop=url|extmetadata&format=json&origin=*"
    );
    const data = await response.json();

    if (!data.query) {
      return res.status(500).json({ error: "랜덤 인물 데이터를 불러오지 못했습니다." });
    }

    // 2️⃣ 받은 결과를 기본 정보로 정리
    const allCandidates = Object.values(data.query.pages).map((page) => {
      const title = page.title.replace(/^File:/, "").replace(/\.[^/.]+$/, "");
      const image = page.imageinfo?.[0]?.url || "";
      return { name: title, hint: "세계 역사 또는 인물 관련 이미지", image };
    });

    // 3️⃣ URL이 실제로 접속 가능한지 확인
    const validCandidates = [];
    for (const person of allCandidates) {
      try {
        const headCheck = await fetch(person.image, { method: "HEAD" });
        if (headCheck.ok && headCheck.headers.get("content-type")?.startsWith("image")) {
          validCandidates.push(person);
        }
      } catch {
        // 실패한 URL은 제외
      }
    }

    // 4️⃣ 유효한 이미지 중 5개 랜덤 선택
    const selected = [];
    const temp = [...validCandidates];
    while (selected.length < 5 && temp.length > 0) {
      const randIndex = Math.floor(Math.random() * temp.length);
      selected.push(temp.splice(randIndex, 1)[0]);
    }

    // 5️⃣ 자동 한글 번역 (이름 & 힌트)
    const translated = [];
    for (const quiz of selected) {
      try {
        const translateResponse = await fetch(
          `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=ko&dt=t&q=${encodeURIComponent(
            quiz.name
          )}`
        );
        const translateData = await translateResponse.json();
        const translatedName = translateData?.[0]?.[0]?.[0] || quiz.name;

        // 힌트도 한글로 변환
        const hintResponse = await fetch(
          `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=ko&dt=t&q=${encodeURIComponent(
            quiz.hint
          )}`
        );
        const hintData = await hintResponse.json();
        const translatedHint = hintData?.[0]?.[0]?.[0] || quiz.hint;

        translated.push({
          name: translatedName,
          hint: translatedHint,
          image: quiz.image,
        });
      } catch {
        translated.push(quiz); // 번역 실패 시 원문 유지
      }
    }

    // 6️⃣ 캐시 방지
    res.setHeader("Cache-Control", "no-store");

    // ✅ 최종 결과 반환
    res.status(200).json(translated);
  } catch (error) {
    console.error("❌ 자동 생성 오류:", error);
    res.status(500).json({ error: "퀴즈를 자동 생성하는 중 오류가 발생했습니다." });
  }
}




